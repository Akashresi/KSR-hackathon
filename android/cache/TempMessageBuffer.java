package com.cyberbullying.detection.cache;

import android.os.Handler;
import android.os.Looper;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Temporarily holds notification text during analysis.
 * AUTO-DELETES text after 5 seconds to ensure privacy.
 */
public class TempMessageBuffer {
    private final ConcurrentHashMap<String, String> buffer = new ConcurrentHashMap<>();
    private final Handler handler = new Handler(Looper.getMainLooper());

    public void push(String id, String content) {
        buffer.put(id, content);
        // Automatically purge after 5 seconds
        handler.postDelayed(() -> buffer.remove(id), 5000);
    }

    public String getAndRemove(String id) {
        return buffer.remove(id);
    }
}
