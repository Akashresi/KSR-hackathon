import smtplib
from email.mime.text import MIMEText
from app.config import settings

async def send_alert_to_contact(contact_info: dict, severity: str, details: str):
    """
    Sends a one-time alert to the trusted contact.
    contact_info: {'email': '...', 'name': '...'}
    """
    subject = f"IMPORTANT: Cyberbullying Alert for User"
    body = f"Hello {contact_info['name']},\n\nOur system has detected a {severity} risk of cyberbullying activity on the user's device.\n\nSummary: {details}\n\nPlease check in with them.\n\nThis is an automated privacy-focused alert."

    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = settings.SMTP_USER
    msg['To'] = contact_info['email']

    try:
        # For demo purposes, we log instead of actually sending if no SMTP configured
        if not settings.SMTP_USER:
            print(f"ALERT LOG: To {contact_info['email']} - {subject}")
            return True
            
        with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
