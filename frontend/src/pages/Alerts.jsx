import React, { useState, useEffect } from 'react';
import { Bell, ShieldAlert, History, MessageSquare, Phone, Info } from 'lucide-react';

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulating API fetch with dummy data as requested
        setTimeout(() => {
            setAlerts([
                { id: 1, app: 'WhatsApp', severity: 'High', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), type: 'Persistent Harassment' },
                { id: 2, app: 'Telegram', severity: 'Medium', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), type: 'Inappropriate Language' },
                { id: 3, app: 'WhatsApp', severity: 'Low', timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(), type: 'System Flag' },
                { id: 4, app: 'Other', severity: 'Medium', timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(), type: 'Social Exclusion Pattern' },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    const getAppIcon = (app) => {
        switch (app) {
            case 'WhatsApp': return <MessageSquare size={18} color="#25D366" />;
            case 'Telegram': return <Phone size={18} color="#0088cc" />;
            default: return <Info size={18} color="var(--primary)" />;
        }
    };

    const getTimeLabel = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' • ' + date.toLocaleDateString();
    };

    return (
        <div className="alerts-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                <div className="glass-card" style={{ padding: '0.75rem', borderRadius: '1rem' }}>
                    <History size={24} color="var(--primary)" />
                </div>
                <div>
                    <h1 style={{ margin: 0 }}>Notification History</h1>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Review detected risks across all monitored platforms</p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <div className="status-badge" style={{ animation: 'pulse 1.5s infinite alex' }}>Loading history...</div>
                    </div>
                ) : alerts.length > 0 ? (
                    alerts.map((alert) => (
                        <div key={alert.id} className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.03)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {getAppIcon(alert.app)}
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                        <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{alert.app} Alert</span>
                                        {/* Page 2, Rule 3: Color indicator badges */}
                                        <span className={`status-badge status-${alert.severity.toLowerCase()}`}>
                                            {alert.severity}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <Bell size={14} />
                                        <span>{alert.type}</span>
                                        <span>•</span>
                                        <span>{getTimeLabel(alert.timestamp)}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <button className="nav-link" style={{ fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--glass-border)' }}>
                                    Dismiss
                                </button>
                                <ShieldAlert size={20} color={alert.severity === 'High' ? 'var(--accent-red)' : 'var(--text-muted)'} />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
                        <ShieldAlert size={48} color="var(--accent-green)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <h3>All Clear!</h3>
                        <p style={{ color: 'var(--text-muted)' }}>No high-risk activity has been detected in your message history.</p>
                    </div>
                )}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    * For your privacy, the content of monitored messages is never stored or displayed here.
                </p>
            </div>
        </div>
    );
};

export default Alerts;
