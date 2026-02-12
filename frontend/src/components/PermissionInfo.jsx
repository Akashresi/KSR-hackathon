import React from 'react';
import { Info, Lock } from 'lucide-react';

const PermissionInfo = () => {
    return (
        <div className="glass-card" style={{ borderLeft: '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <Info color="var(--primary)" />
                <div>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>Why do we need notification access?</h3>
                    <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        To protect you from cyberbullying, our Android app analyzes incoming message notifications
                        using local AI. We <strong>never</strong> store your messages or upload text content to our servers.
                        Only risk metadata (scores) is sent for background severity analysis.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', color: 'var(--accent-green)', fontSize: '0.875rem' }}>
                        <Lock size={16} />
                        <span>End-to-End Privacy First Design</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PermissionInfo;
