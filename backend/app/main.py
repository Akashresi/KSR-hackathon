from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import analyze, alert, auth
from app.database.mongodb import connect_to_mongo, close_mongo_connection
from app.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

# CORS configuration for mobile and web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# Include routers
from app.api.auth import router as auth_router
from app.api.analyze import router as analyze_router
from app.api.alert import router as alert_router

app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(analyze_router, prefix="/api", tags=["Analysis"])
app.include_router(alert_router, prefix="/api", tags=["Alerts"])

@app.get("/")
async def root():
    return {"message": "CyberSafe Mobile Protection API is running"}
