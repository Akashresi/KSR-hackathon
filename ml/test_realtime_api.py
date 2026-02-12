import requests
import json
import time

def simulate_app_detection(user_id, app_name, i_score, t_score, b_score):
    url = "http://localhost:8000/api/analyze"
    
    payload = {
        "user_id": user_id,
        "app_name": app_name,
        "insult_score": i_score,
        "threat_score": t_score,
        "bullying_score": b_score
    }
    
    print(f"📡 Sending Metadata for {app_name}...")
    start_time = time.time()
    
    try:
        response = requests.post(url, json=payload)
        latency = (time.time() - start_time) * 1000
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Success! Latency: {latency:.2f}ms")
            print(f"📊 Severity: {result['severity']}")
            print(f"⚡ Action: {result['action']}")
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"❌ Connection Failed: {e}")

if __name__ == "__main__":
    print("--- CyberSafe Real-Time API Test ---")
    
    # 1. Test High Risk (Threat)
    simulate_app_detection("demo_user", "WhatsApp", 0.1, 0.95, 0.2)
    
    # 2. Test Low Risk (Neutral)
    simulate_app_detection("demo_user", "Telegram", 0.05, 0.02, 0.1)
    
    # 3. Test Medium Risk (Insult)
    simulate_app_detection("demo_user", "SMS", 0.6, 0.1, 0.3)
