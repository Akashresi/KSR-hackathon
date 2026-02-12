import React, { useState } from 'react';
import { User, Smartphone, ShieldCheck, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

const Settings = () => {
    const [profile, setProfile] = useState({
        name: 'Alex Johnson',
        age: '16',
        contact: '+1 (555) 123-4567'
    });

    const [isProtected, setIsProtected] = useState(true);

    return (
        <div className="settings-fade-in">
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ margin: 0 }}>System Settings</h1>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage your profile and protection preferences</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                {/* Page 3, Rule 2: Personal Information */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <User size={20} color="var(--primary)" />
                            <h3 style={{ margin: 0 }}>Personal Information</h3>
                        </div>

                        <div className="input-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                            <div className="input-group">
                                <label>Age</label>
                                <input
                                    type="number"
                                    value={profile.age}
                                    onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label>Trusted Contact Number</label>
                                <input
                                    type="text"
                                    value={profile.contact}
                                    onChange={(e) => setProfile({ ...profile, contact: e.target.value })}
                                />
                            </div>
                        </div>

                        <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                            Save Changes
                        </button>
                    </div>

                    <div className="glass-card">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <ShieldCheck size={20} color={isProtected ? 'var(--accent-green)' : 'var(--text-muted)'} />
                                <h3 style={{ margin: 0 }}>Global Protection</h3>
                            </div>
                            {/* Page 3, Rule 4: Enable / Disable Protection Toggle */}
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={isProtected}
                                    onChange={() => setIsProtected(!isProtected)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                            {isProtected
                                ? 'Your device is currently scanning notifications for potential cyberbullying patterns.'
                                : 'Protection is inactive. Your notifications will not be analyzed for safety.'}
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Page 3, Rule 3: Permission Status */}
                    <div className="glass-card">
                        <h3 style={{ marginBottom: '1.25rem' }}>System Integrity</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <CheckCircle2 size={18} color="var(--accent-green)" />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Notification Access</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Granted & Monitoring active</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <CheckCircle2 size={18} color="var(--accent-green)" />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Background Service</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Running normally</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <AlertCircle size={18} color="var(--accent-yellow)" />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Battery Optimization</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Exemption required for 24/7 safety</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Page 3, Rule 5: Privacy Explanation */}
                    <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(30,41,59,0.4))' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <Lock size={18} color="var(--primary)" />
                            <h3 style={{ margin: 0, fontSize: '1rem' }}>Privacy Commitment</h3>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5', margin: 0 }}>
                            We prioritize your safety without compromising your privacy. Our detection algorithms run
                            <strong> strictly on your device</strong>. Message content is processed in temporary memory
                            and is immediately discarded after analysis. Only anonymous safety scores are used to
                            generate your reports.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
