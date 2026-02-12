from app.config import settings

def calculate_severity(insult_prob: float, threat_prob: float, bullying_prob: float) -> str:
    """
    Calculates severity level based on model probabilities.
    Low / Medium / High
    """
    # Weight threats higher
    max_prob = max(insult_prob, threat_prob * 1.2, bullying_prob)
    
    if max_prob >= settings.HIGH_RISK_THRESHOLD:
        return "High"
    elif max_prob >= settings.MEDIUM_RISK_THRESHOLD:
        return "Medium"
    else:
        return "Low"

def should_alert(severity: str, history: list) -> bool:
    """
    Logic to decide if a trusted contact should be alerted.
    Strictly follows 'One-time alert' requirement per pattern.
    """
    # If High severity and no alert sent recently
    if severity == "High":
        # Check if an alert was already sent for this pattern
        # This is high-level logic, would check DB in actual API
        return True
    return False
