package com.cyberbullying.detection.service;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import androidx.core.app.NotificationCompat;
import org.tensorflow.lite.Interpreter;
import java.nio.MappedByteBuffer;
import java.io.FileInputStream;
import java.nio.channels.FileChannel;
import android.content.res.AssetFileDescriptor;

public class ForegroundService extends Service {
    private static final String CHANNEL_ID = "CyberbullyingDetectionServiceChannel";
    private Interpreter insultModel;
    private Interpreter threatModel;

    @Override
    public void onCreate() {
        super.onCreate();
        loadModels();
    }

    private void loadModels() {
        try {
            insultModel = new Interpreter(loadModelFile("insult_model.tflite"));
            threatModel = new Interpreter(loadModelFile("threat_model.tflite"));
        } catch (Exception e) {
            e.printStackTrace();
        }
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
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && "ANALYZE_TEXT".equals(intent.getAction())) {
            String text = intent.getStringExtra("content");
            analyzeOnDevice(text);
        }

        createNotificationChannel();
        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Cyberbullying Protection")
                .setContentText("Monitoring for your safety...")
                .setSmallIcon(android.R.drawable.ic_lock_lock)
                .build();

        startForeground(1, notification);
        return START_STICKY;
    }

    private void analyzeOnDevice(String text) {
        // 1. Tokenize (Simple implementation for demo)
        // 2. Run Inference
        float[][] insultOutput = new float[1][2];
        float[][] threatOutput = new float[1][2];
        
        // insultModel.run(input, insultOutput);
        // threatModel.run(input, threatOutput);
        
        // 3. Immediately delete text (not stored)
        // 4. Send metadata to backend
        sendMetadataToBackend(0.1f, 0.05f, 0.0f); 
    }

    private void sendMetadataToBackend(float insult, float threat, float bullying) {
        // Async HTTP call to Backend /api/analyze
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                    CHANNEL_ID,
                    "Cyberbullying Detection Service Channel",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            manager.createNotificationChannel(serviceChannel);
        }
    }
}
