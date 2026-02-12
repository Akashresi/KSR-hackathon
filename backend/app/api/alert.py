from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.database.mongodb import get_database

router = APIRouter()

class TrustedContact(BaseModel):
    user_id: str
    name: str
    email: str

@router.post("/set-trusted-contact")
async def set_contact(contact: TrustedContact, db = Depends(get_database)):
    await db.users.update_one(
        {"user_id": contact.user_id},
        {"$set": {
            "trusted_contact": {"name": contact.name, "email": contact.email},
            "alert_already_sent": False # Reset alert flag when contact changes
        }},
        upsert=True
    )
    return {"message": "Trusted contact updated"}

@router.get("/alerts/{user_id}")
async def get_user_alerts(user_id: str, db = Depends(get_database)):
    alerts = await db.alerts.find({"user_id": user_id}).sort("timestamp", -1).to_list(100)
    for a in alerts:
        a["_id"] = str(a["_id"])
    return alerts
