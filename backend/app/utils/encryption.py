from cryptography.fernet import Fernet
from app.config import settings
import base64

# Simple encryption to show privacy-first design
# In a real app, this key would be securely managed
cipher_suite = Fernet(base64.urlsafe_b64encode(settings.ENCRYPTION_KEY.encode().ljust(32)[:32]))

def encrypt_data(data: str) -> str:
    return cipher_suite.encrypt(data.encode()).decode()

def decrypt_data(encrypted_data: str) -> str:
    return cipher_suite.decrypt(encrypted_data.encode()).decode()
