import pandas as pd
import os
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

def format_dataset(input_file, output_file, label_col):
    neutral_phrases = [
        "Hello, how are you today?", "That's a very nice idea!", "I hope you have a great day.",
        "Can you help me with this task?", "The weather is lovely outside.", "I'll see you at the meeting later.",
        "Thank you for your support.", "Let's work together on this project.", "I really appreciate your help.",
        "Have a safe trip!", "What time does the movie start?", "I'm going to the store now.",
        "Congratulations on your success!", "Please let me know if you need anything.", "It was nice talking to you."
    ] * 10 

    if not os.path.exists(input_file):
        print(f"Skipping {input_file} (not found)")
        return

    with open(input_file, 'r', encoding='utf-8') as f:
        raw_lines = [line.strip() for line in f if line.strip()]

    toxic_phrases = []
    for line in raw_lines:
        # If line ends with ,bullying or ,threat or ,insult, remove it
        cleaned = line
        for suffix in [',bullying', ',threat', ',insult']:
            if cleaned.lower().endswith(suffix):
                cleaned = cleaned[:-len(suffix)]
                break
        # Remove surrounding quotes if they exist
        cleaned = cleaned.strip('"').strip("'")
        toxic_phrases.append(cleaned)

    df_toxic = pd.DataFrame({'comment_text': toxic_phrases, label_col: 1})
    df_neutral = pd.DataFrame({'comment_text': neutral_phrases[:len(toxic_phrases)], label_col: 0})
    
    df_final = pd.concat([df_toxic, df_neutral]).sample(frac=1).reset_index(drop=True)
    df_final.to_csv(output_file, index=False)
    print(f"Prepared {output_file} ({len(df_final)} rows).")

def train_fast_model(data_path, model_name):
    if not os.path.exists(data_path):
        return
    print(f"--- Training {model_name} Model ---")
    df = pd.read_csv(data_path)
    label_col = 'bullying' if model_name == 'bullying' else model_name
    X, y = df['comment_text'], df[label_col]
    vectorizer = TfidfVectorizer(max_features=1000)
    X_vec = vectorizer.fit_transform(X)
    X_train, X_test, y_train, y_test = train_test_split(X_vec, y, test_size=0.2, random_state=42)
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    preds = model.predict(X_test)
    print(f"Accuracy: {accuracy_score(y_test, preds):.2f}")
    os.makedirs(f"ml/models/{model_name}", exist_ok=True)
    joblib.dump(model, f"ml/models/{model_name}/model.joblib")
    joblib.dump(vectorizer, f"ml/models/{model_name}/vectorizer.joblib")
    print(f"Saved to ml/models/{model_name}/\n")

if __name__ == "__main__":
    format_dataset("ml/datasets/insult_data.csv", "ml/datasets/insult_data_clean.csv", "insult")
    format_dataset("ml/datasets/threat_data.csv", "ml/datasets/threat_data_clean.csv", "threat")
    format_dataset("ml/datasets/bullying_data.csv", "ml/datasets/bullying_data_clean.csv", "bullying")

    train_fast_model("ml/datasets/insult_data_clean.csv", "insult")
    train_fast_model("ml/datasets/threat_data_clean.csv", "threat")
    train_fast_model("ml/datasets/bullying_data_clean.csv", "bullying")
    print("🚀 All models ready!")
