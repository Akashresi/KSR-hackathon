import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Cyberbullying Detection API"
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = "cyberbullying_db"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-it")
    ALGORITHM: str = "HS256"
    ENCRYPTION_KEY: str = os.getenv("ENCRYPTION_KEY", "your-encryption-key-32chars!!")
    
    # Alert thresholds
    HIGH_RISK_THRESHOLD: float = 0.8
    MEDIUM_RISK_THRESHOLD: float = 0.5
    
    # Trusted Contact Notification settings
    SMTP_SERVER: str = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", 587))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")

settings = Settings()
