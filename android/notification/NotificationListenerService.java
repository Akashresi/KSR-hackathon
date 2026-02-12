package com.cyberbullying.detection.notification;

import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.util.Log;
import android.os.Bundle;
import android.content.Intent;
import com.cyberbullying.detection.service.ForegroundService;

/**
 * Capture incoming notifications and send text for analysis.
 * Follows PRIVACY-FIRST: Text is not stored long-term.
 */
public class NotificationListener extends NotificationListenerService {
    private static final String TAG = "NotificationListener";

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        String packageName = sbn.getPackageName();
        Bundle extras = sbn.getNotification().extras;
        
        String title = extras.getString("android.title");
        CharSequence text = extras.getCharSequence("android.text");

        if (text != null) {
            Log.d(TAG, "Notification from " + packageName + ": " + title);
            
            // Send to ForegroundService for ML analysis
            Intent intent = new Intent(this, ForegroundService.class);
            intent.setAction("ANALYZE_TEXT");
            intent.putExtra("content", text.toString());
            intent.putExtra("package", packageName);
            startService(intent);
        }
    }

    @Override
    public void onNotificationRemoved(StatusBarNotification sbn) {
        // Handle removal if necessary
    }
}
