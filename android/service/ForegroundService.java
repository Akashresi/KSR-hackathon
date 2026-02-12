package com.cyberbullying.detection.service;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import androidx.core.app.NotificationCompat;

/**
 * Ensures the CyberSafe protection service stays active.
 * Shows a persistent notification as required by Android for foreground tasks.
 */
public class ForegroundService extends Service {
    private static final String CHANNEL_ID = "CyberSafeProtectionChannel";
    private static final int NOTIFICATION_ID = 1001;

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // Build the persistent monitoring notification
        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("CyberSafe Protection Active")
                .setContentText("Real-time monitoring is enabled for your safety.")
                .setSmallIcon(android.R.drawable.ic_lock_lock)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .setOngoing(true) // Cannot be swiped away
                .build();

        // Start in foreground to prevent the system from killing the service
        startForeground(NOTIFICATION_ID, notification);

        return START_STICKY; // Restart automatically if killed
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null; // No binding needed
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                    CHANNEL_ID,
                    "CyberSafe Protection Service",
                    NotificationManager.IMPORTANCE_LOW
            );
            serviceChannel.setDescription("Notification for CyberSafe background protection");
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(serviceChannel);
            }
        }
    }
}
