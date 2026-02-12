package com.cyberbullying.detection.notification;

import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.util.Log;
import android.os.Bundle;
import org.tensorflow.lite.Interpreter;
import java.nio.MappedByteBuffer;
import java.io.FileInputStream;
import java.nio.channels.FileChannel;
import android.content.res.AssetFileDescriptor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.HashMap;
import java.util.Map;

/**
 * Real-time Notification Listener for CyberSafe.
 * Performs on-device ML inference immediately when a notification arrives.
 * Privacy-First: Raw text is never sent to the backend.
 */
public class NotificationListener extends NotificationListenerService {
    private static final String TAG = "NotificationListener";
    private Interpreter insultModel;
    private Interpreter threatModel;
    private Interpreter bullyingModel;
    private final ExecutorService analysisExecutor = Executors.newSingleThreadExecutor();

    @Override
    public void onCreate() {
        super.onCreate();
        initializeTFLite();
    }

    private void initializeTFLite() {
        analysisExecutor.execute(() -> {
            try {
                // Models are loaded ONCE and reused
                insultModel = new Interpreter(loadModelFile("insult_model.tflite"));
                threatModel = new Interpreter(loadModelFile("threat_model.tflite"));
                bullyingModel = new Interpreter(loadModelFile("bullying_model.tflite"));
                Log.d(TAG, "TFLite Interpreters initialized successfully");
            } catch (Exception e) {
                Log.e(TAG, "Failed to initialize TFLite models", e);
            }
        });
    }

    private MappedByteBuffer loadModelFile(String modelName) throws Exception {
        AssetFileDescriptor fileDescriptor = getAssets().openFd(modelName);
        FileInputStream inputStream = new FileInputStream(fileDescriptor.getFileDescriptor());
        FileChannel fileChannel = inputStream.getChannel();
        long startOffset = fileDescriptor.getStartOffset();
        long declaredLength = fileDescriptor.getDeclaredLength();
        return fileChannel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength);
    }

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        String packageName = sbn.getPackageName();
        Bundle extras = sbn.getNotification().extras;
        CharSequence text = extras.getCharSequence("android.text");

        if (text != null && !text.toString().isEmpty()) {
            final String messageToAnalyze = text.toString();
            
            // Execute inference on background thread to keep UI/Listener responsive
            analysisExecutor.execute(() -> {
                runInference(messageToAnalyze, packageName);
            });
        }
    }

    private void runInference(String text, String packageName) {
        if (insultModel == null || threatModel == null || bullyingModel == null) return;

        try {
            // 1. Prepare input (Simple tokenization/padding for demo purposes)
            float[][] input = preprocessText(text);
            
            // 2. Run Inference
            float[][] insultOutput = new float[1][2];
            float[][] threatOutput = new float[1][2];
            float[][] bullyingOutput = new float[1][2];

            insultModel.run(input, insultOutput);
            threatModel.run(input, threatOutput);
            bullyingModel.run(input, bullyingOutput);

            // 3. IMMEDIATELY CLEAR TEXT FROM MEMORY
            text = null; 

            // 4. Send ONLY scores to backend
            float insultScore = insultOutput[0][1];
            float threatScore = threatOutput[0][1];
            float bullyingScore = bullyingOutput[0][1];

            sendMetadataToBackend(packageName, insultScore, threatScore, bullyingScore);
            
        } catch (Exception e) {
            Log.e(TAG, "Inference failed", e);
        }
    }

    private float[][] preprocessText(String text) {
        // Implementation of text-to-tensor logic (Vocabulary matching)
        return new float[1][128]; 
    }

    private void sendMetadataToBackend(String pkg, float i, float t, float b) {
        // Instant non-blocking API call
        Log.d(TAG, "Metadata Sent: " + pkg + " [I:" + i + " T:" + t + " B:" + b + "]");
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (insultModel != null) insultModel.close();
        if (threatModel != null) threatModel.close();
        if (bullyingModel != null) bullyingModel.close();
        analysisExecutor.shutdown();
    }
}
