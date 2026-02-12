import os
import tensorflow as tf
from transformers import TFDistilBertForSequenceClassification, DistilBertTokenizer

def convert_huggingface_to_tflite(hf_model_path, tflite_output_path):
    print(f"Converting model from {hf_model_path} to {tflite_output_path}")
    
    # Load tokenizer and model in Keras format
    tokenizer = DistilBertTokenizer.from_pretrained(hf_model_path)
    model = TFDistilBertForSequenceClassification.from_pretrained(hf_model_path, from_pt=True)

    # Save as SavedModel
    saved_model_path = os.path.join(os.path.dirname(tflite_output_path), "saved_model")
    model.save(saved_model_path)

    # Convert to TFLite
    converter = tf.lite.TFLiteConverter.from_saved_model(saved_model_path)
    # Post-training quantization for smaller size and faster inference on mobile
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    tflite_model = converter.convert()

    with open(tflite_output_path, "wb") as f:
        f.write(tflite_model)
    
    print(f"Successfully converted to {tflite_output_path}")

if __name__ == "__main__":
    # Example paths
    # convert_huggingface_to_tflite("ml/training/insult_output/final_model", "android/ml/insult_model.tflite")
    # convert_huggingface_to_tflite("ml/training/threat_output/final_model", "android/ml/threat_model.tflite")
    print("This script will convert your trained models to TFLite format for Android.")
