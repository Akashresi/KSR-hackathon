from fastapi import APIRouter, Depends, BackgroundTasks
from pydantic import BaseModel
from app.database.mongodb import get_database
from app.services.severity_engine import calculate_severity, should_alert
from app.services.alert_manager import send_alert_to_contact
import datetime

router = APIRouter()

# Schema optimized for real-time: NO text payload
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
    """
    Ultra-low latency analyze endpoint.
    Calculates severity instantly and returns to the mobile device.
    Alert logic is offloaded to background tasks.
    """
    
    # 1. Instant severity calculation
    severity = calculate_severity(
        request.insult_score, 
        request.threat_score, 
        request.bullying_score
    )
    
    # 2. Add DB storage and Alerting to BackgroundTasks to respond to user instantly
    background_tasks.add_task(
        process_post_inference_logic, 
        request, 
        severity, 
        db
    )
    
    return {
        "severity": severity,
        "action": "logged" if severity != "Low" else "none"
    }

async def process_post_inference_logic(request, severity, db):
    # Log the interaction for the dashboard
    metadata_entry = {
        "user_id": request.user_id,
        "app": request.app_name,
        "scores": {
            "insult": request.insult_score,
            "threat": request.threat_score,
            "bullying": request.bullying_score
        },
        "severity": severity,
        "timestamp": datetime.datetime.utcnow()
    }
    await db.alerts.insert_one(metadata_entry)

    # One-time alert logic per user/session
    if severity == "High":
        user = await db.users.find_one({"user_id": request.user_id})
        if user and not user.get("alert_already_sent", False):
            contact = user.get("trusted_contact")
            if contact:
                # Trigger actual alert (Email/SMS)
                success = await send_alert_to_contact(contact, severity, "High-risk behavior detected.")
                if success:
                    # Update flag instantly to prevent duplicate alerts
                    await db.users.update_one(
                        {"user_id": request.user_id}, 
                        {"$set": {"alert_already_sent": True}}
                    )
