package com.cyberbullying.detection.permissions;

import android.content.Context;
import android.content.Intent;
import android.provider.Settings;
import androidx.core.app.NotificationManagerCompat;

public class PermissionHandler {

    public static boolean isNotificationServiceEnabled(Context context) {
        return NotificationManagerCompat.getEnabledListenerPackages(context)
                .contains(context.getPackageName());
    }

    public static void openNotificationAccessSettings(Context context) {
        context.startActivity(new Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS));
    }
    
    public static String getPermissionRationale() {
        return "We need Notification Access to analyze incoming messages ON-DEVICE for your protection. " +
               "Messages are never stored or uploaded to our servers.";
    }
}
