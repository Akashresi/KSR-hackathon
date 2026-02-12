import React from 'react';
import TrustedContactForm from '../components/TrustedContactForm';

const Settings = () => {
    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Safety Settings</h1>
            <div style={{ maxWidth: '600px' }}>
                <TrustedContactForm userId="user_123" />

                <div className="glass-card" style={{ marginTop: '2rem' }}>
                    <h3>Privacy Mode</h3>
                    <p style={{ color: 'var(--text-muted)' }}>
                        When enabled, message analysis occurs strictly on-device. No data is sent to the cloud except for critical risk indicators.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>On-Device Inference</span>
                        <div style={{ padding: '0.5rem 1rem', background: 'var(--accent-green)', borderRadius: '0.5rem', fontWeight: 600 }}>Enabled</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
