package com.cyberbullying.detection.security;

import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import java.security.KeyStore;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import android.util.Base64;

public class EncryptionManager {
    private static final String KEY_ALIAS = "CyberbullyingKey";
    private static final String ANDROID_KEY_STORE = "AndroidKeyStore";

    public EncryptionManager() {
        try {
            initKey();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void initKey() throws Exception {
        KeyStore keyStore = KeyStore.getInstance(ANDROID_KEY_STORE);
        keyStore.load(null);
        if (!keyStore.containsAlias(KEY_ALIAS)) {
            KeyGenerator keyGenerator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, ANDROID_KEY_STORE);
            keyGenerator.init(new KeyGenParameterSpec.Builder(KEY_ALIAS,
                    KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
                    .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                    .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                    .build());
            keyGenerator.generateKey();
        }
    }

    public String encrypt(String data) throws Exception {
        KeyStore keyStore = KeyStore.getInstance(ANDROID_KEY_STORE);
        keyStore.load(null);
        SecretKey secretKey = (SecretKey) keyStore.getKey(KEY_ALIAS, null);
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);
        byte[] encrypted = cipher.doFinal(data.getBytes());
        return Base64.encodeToString(encrypted, Base64.DEFAULT);
    }
}
