import torch
from transformers import DistilBertForSequenceClassification, DistilBertTokenizer
from sklearn.metrics import classification_report
import pandas as pd

def evaluate_model(model_path, data_path, label_col):
    print(f"Evaluating model at {model_path} for label: {label_col}")
    
    # Load model and tokenizer
    tokenizer = DistilBertTokenizer.from_pretrained(model_path)
    model = DistilBertForSequenceClassification.from_pretrained(model_path)
    model.eval()

    # Load data
    df = pd.read_csv(data_path)
    texts = df['comment_text'].tolist()
    true_labels = df[label_col].tolist()

    preds = []
    
    with torch.no_grad():
        for text in texts:
            inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=128)
            outputs = model(**inputs)
            pred = torch.argmax(outputs.logits, dim=1).item()
            preds.append(pred)

    print(classification_report(true_labels, preds))

if __name__ == "__main__":
    # Example usage
    # evaluate_model("ml/training/insult_output/final_model", "ml/datasets/test_data.csv", "insult")
    print("Run this script by pointing to a trained model and a test CSV dataset.")
