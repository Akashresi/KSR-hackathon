from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from pydantic import BaseModel
from app.database.mongodb import get_database
from app.services.severity_engine import calculate_severity
from app.services.alert_manager import send_alert_to_contact
import datetime
from bson import ObjectId

router = APIRouter()

class RealTimeAnalysisRequest(BaseModel):
    user_id: str
    app_name: str
    insult_score: float
    threat_score: float
    bullying_score: float

@router.post("/analyze")
async def analyze_realtime(
    request: RealTimeAnalysisRequest, 
    background_tasks: BackgroundTasks,
    db = Depends(get_database)
):
    # 1. Calculate severity and deduction
    severity = calculate_severity(
        request.insult_score, 
        request.threat_score, 
        request.bullying_score
    )
    
    deduction = 0
    if severity == "High":
        deduction = 50
    elif severity == "Medium":
        deduction = 5
    
    # 2. Add DB storage and state update to BackgroundTasks
    background_tasks.add_task(
        update_student_safety_state, 
        request, 
        severity, 
        deduction,
        db
    )
    
    return {
        "severity": severity,
        "action": "logged" if severity != "Low" else "none"
    }

async def update_student_safety_state(request, severity, deduction, db):
    # Update student safety percentage and potentially block app
    student = await db.users.find_one({"user_id": request.user_id})
    if not student:
        return

    current_safety = student.get("safety_percentage", 100)
    new_safety = max(0, current_safety - deduction)
    
    update_data = {"safety_percentage": new_safety}
    
    # If safety hits 0 and was previously above 0, notify parent
    was_blocked = student.get("app_blocked", False)
    is_now_blocked = new_safety <= 0
    
    if is_now_blocked:
        update_data["app_blocked"] = True
        
        # Notify parent ONLY when it first hits 0
        if not was_blocked:
            parent = await db.users.find_one({"user_id": student.get("parent_id")})
            if parent and parent.get("email"):
                await send_alert_to_contact(
                    parent["email"], 
                    "CRITICAL", 
                    f"Student {student['user_id']} safety reached 0%. App has been blocked."
                )

    await db.users.update_one({"user_id": request.user_id}, {"$set": update_data})

    # Log the interaction for historical records
    await db.alerts.insert_one({
        "user_id": request.user_id,
        "app": request.app_name,
        "severity": severity,
        "safety_deduction": deduction,
        "timestamp": datetime.datetime.utcnow()
    })

@router.get("/parent/dashboard/{parent_id}")
async def get_parent_dashboard(parent_id: str, db = Depends(get_database)):
    # Find student linked to this parent
    student = await db.users.find_one({"parent_id": parent_id, "role": "student"})
    if not student:
        raise HTTPException(status_code=404, detail="No linked student found")
    
    # Get only High and Medium alerts for history (Hide Low)
    alerts = await db.alerts.find({
        "user_id": student["user_id"],
        "severity": {"$in": ["High", "Medium"]}
    }).sort("timestamp", -1).to_list(length=20)
    
    # Format BSON for JSON
    for alert in alerts:
        alert["_id"] = str(alert["_id"])
    
    return {
        "student_id": student["user_id"],
        "safety_percentage": student.get("safety_percentage", 100),
        "app_blocked": student.get("app_blocked", False),
        "alerts": alerts
    }

@router.post("/parent/unlock-student")
async def unlock_student(student_id: str, db = Depends(get_database)):
    # Reset safety and unblock
    result = await db.users.update_one(
        {"user_id": student_id, "role": "student"},
        {"$set": {"safety_percentage": 100, "app_blocked": False}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Student not found or already unlocked")
        
    return {"status": "success", "message": "App unlocked and safety reset to 100%"}
