import joblib
import os

def test_single_message(message):
    models = ['insult', 'threat', 'bullying']
    results = {}

    print(f"\n🔍 Testing Message: \"{message}\"")
    print("-" * 40)

    for category in models:
        model_path = f"ml/models/{category}/model.joblib"
        vectorizer_path = f"ml/models/{category}/vectorizer.joblib"

        if not os.path.exists(model_path):
            print(f"⚠️ Model for '{category}' not found. Run training first.")
            continue

        # Load model and vectorizer
        model = joblib.load(model_path)
        vectorizer = joblib.load(vectorizer_path)

        # Vectorize and predict
        vec_text = vectorizer.transform([message])
        
        # Get probabilities - Note: [0] is neutral, [1] is positive (bullying/toxic)
        prob = model.predict_proba(vec_text)[0][1]
        prediction = "DETECTED" if prob > 0.5 else "SAFE"
        
        results[category] = prob
        
        color = "\033[91m" if prob > 0.5 else "\033[92m" # Red if toxic, Green if safe
        reset = "\033[0m"
        print(f"{category.capitalize():<10}: {color}{prediction:<10}{reset} (Confidence: {prob:.2%})")

    return results

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        custom_msg = " ".join(sys.argv[1:])
        test_single_message(custom_msg)
    else:
        test_messages = [
            "You are a total loser and no one likes you.",
            "I am going to find you and make you regret this.",
            "Do you want to go get some coffee later?",
            "Everyone in this group thinks you are weird, just leave."
        ]
        for msg in test_messages:
            test_single_message(msg)
        
        print("\n💡 Tip: Test your own message with: python ml/test_models.py \"message\"")
