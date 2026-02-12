from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.database.mongodb import get_database
from passlib.context import CryptContext
from typing import Optional
import uuid

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Models for Request/Response
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str
    role: str # "parent" or "student"
    parent_email: Optional[EmailStr] = None # Used for students to link to parent

class UserLogin(BaseModel):
    email: EmailStr
    password: str

@router.post("/register")
async def register(user: UserRegister, db = Depends(get_database)):
    # 1. Check if user already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2. Hash password
    hashed_password = pwd_context.hash(user.password)
    
    user_id = str(uuid.uuid4())
    user_data = {
        "user_id": user_id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "password": hashed_password,
        "role": user.role,
        "safety_percentage": 100, # Initial safety for everyone
        "app_blocked": False
    }

    # 3. Handle Parent-Student Linking
    if user.role == "student":
        if not user.parent_email:
             raise HTTPException(status_code=400, detail="Student must provide a parent email")
        
        parent = await db.users.find_one({"email": user.parent_email, "role": "parent"})
        if not parent:
            raise HTTPException(status_code=404, detail="Parent with this email not found. Parent must register first.")
        
        user_data["parent_id"] = parent["user_id"]
    
    # 4. Save to DB
    await db.users.insert_one(user_data)
    
    return {"message": "User registered successfully", "user_id": user_id, "role": user.role}

@router.post("/login")
async def login(user: UserLogin, db = Depends(get_database)):
    # 1. Find user
    db_user = await db.users.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # 2. Verify password
    if not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {
        "status": "success",
        "user_id": db_user["user_id"],
        "name": db_user["name"],
        "role": db_user["role"]
    }
