import os
import torch
import pandas as pd
from torch.utils.data import DataLoader, Dataset
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification, Trainer, TrainingArguments
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_recall_fscore_support

# Step 1: Define Dataset class
class BullyingDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_len=128):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_len = max_len

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, item):
        text = str(self.texts[item])
        label = self.labels[item]

        encoding = self.tokenizer.encode_plus(
            text,
            add_special_tokens=True,
            max_length=self.max_len,
            return_token_type_ids=False,
            padding='max_length',
            return_attention_mask=True,
            return_tensors='pt',
            truncation=True
        )

        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': torch.tensor(label, dtype=torch.long)
        }

def compute_metrics(pred):
    labels = pred.label_ids
    preds = pred.predictions.argmax(-1)
    precision, recall, f1, _ = precision_recall_fscore_support(labels, preds, average='binary')
    acc = accuracy_score(labels, preds)
    return {
        'accuracy': acc,
        'f1': f1,
        'precision': precision,
        'recall': recall
    }

def train_model(data_path, output_dir):
    # Load data (Assuming Kaggle Jigsaw or similar CSV)
    df = pd.read_csv(data_path)
    
    # Filter for insults (adjust column name as per your dataset)
    # Binary classification: 1 for Insult, 0 for Not
    train_texts, val_texts, train_labels, val_labels = train_test_split(
        df['comment_text'].tolist(), 
        df['insult'].tolist(), 
        test_size=0.2
    )

    tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
    train_dataset = BullyingDataset(train_texts, train_labels, tokenizer)
    val_dataset = BullyingDataset(val_texts, val_labels, tokenizer)

    model = DistilBertForSequenceClassification.from_pretrained('distilbert-base-uncased', num_labels=2)

    training_args = TrainingArguments(
        output_dir=output_dir,
        num_train_epochs=3,
        per_device_train_batch_size=16,
        per_device_eval_batch_size=64,
        warmup_steps=500,
        weight_decay=0.01,
        logging_dir='./logs',
        logging_steps=100,
        evaluation_strategy="epoch",
        save_strategy="epoch",
        load_best_model_at_end=True,
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        compute_metrics=compute_metrics,
    )

    trainer.train()
    model.save_pretrained(os.path.join(output_dir, 'final_model'))
    tokenizer.save_pretrained(os.path.join(output_dir, 'final_model'))
    print(f"Model saved to {output_dir}")

if __name__ == "__main__":
    # Ensure datasets folder exists or update path
    PATH_TO_DATA = "ml/datasets/insult_data.csv"
    if os.path.exists(PATH_TO_DATA):
        train_model(PATH_TO_DATA, "ml/training/insult_output")
    else:
        print(f"Please place your dataset at {PATH_TO_DATA}")
