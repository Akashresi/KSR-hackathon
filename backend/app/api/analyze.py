from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.database.mongodb import get_database
from app.services.severity_engine import calculate_severity, should_alert
from app.services.alert_manager import send_alert_to_contact
import datetime

router = APIRouter()

class AnalysisRequest(BaseModel):
    user_id: str
    insult_score: float
    threat_score: float
    bullying_score: float
    timestamp: datetime.datetime

@router.post("/analyze")
async def analyze_metadata(request: AnalysisRequest, db = Depends(get_database)):
    # Calculate severity
    severity = calculate_severity(
        request.insult_score, 
        request.threat_score, 
        request.bullying_score
    )
    
    # Store metadata (NO MESSAGE TEXT)
    metadata_entry = {
        "user_id": request.user_id,
        "insult_score": request.insult_score,
        "threat_score": request.threat_score,
        "bullying_score": request.bullying_score,
        "severity": severity,
        "timestamp": request.timestamp
    }
    
    await db.alerts.insert_one(metadata_entry)
    
    # Check if we should alert trusted contact
    # In a real app, we'd fetch the user's trusted contact from 'users' collection
    user_config = await db.users.find_one({"user_id": request.user_id})
    
    alert_sent = False
    if user_config and should_alert(severity, []):
        contact = user_config.get("trusted_contact")
        if contact and not user_config.get("alert_already_sent"):
            alert_sent = await send_alert_to_contact(
                contact, 
                severity, 
                "Persistent bullying patterns detected."
            )
            # Mark that we sent a one-time alert to prevent spam
            await db.users.update_one(
                {"user_id": request.user_id}, 
                {"$set": {"alert_already_sent": True}}
            )
            
    return {
        "status": "processed",
        "severity": severity,
        "alert_sent": alert_sent
    }
