import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Text } from 'recharts';
import { Shield, MessageSquare, Phone, Info } from 'lucide-react';

const Dashboard = () => {
    // Demo Data - In a real app, this would be derived from the alerts history
    const [appAlerts, setAppAlerts] = useState({
        WhatsApp: { high: 0, medium: 2, low: 5 },
        Telegram: { high: 1, medium: 0, low: 3 },
        Other: { high: 0, medium: 1, low: 10 }
    });

    const [safetyScore, setSafetyScore] = useState(100);

    // Calculate safety score based on deduction rules:
    // High -> -50% per occurrence
    // Medium -> -5% per occurrence
    // Low -> 0%
    useEffect(() => {
        let totalDeduction = 0;
        Object.values(appAlerts).forEach(stats => {
            totalDeduction += (stats.high * 50);
            totalDeduction += (stats.medium * 5);
        });

        // Clamp score between 0 and 100
        const newScore = Math.max(0, 100 - totalDeduction);
        setSafetyScore(newScore);
    }, [appAlerts]);

    const chartData = [
        { name: 'Safety', value: safetyScore, color: safetyScore > 70 ? '#10b981' : safetyScore > 30 ? '#f59e0b' : '#ef4444' },
        { name: 'Risk', value: 100 - safetyScore, color: 'rgba(255, 255, 255, 0.05)' }
    ];

    const getAppPercentage = (appName) => {
        const stats = appAlerts[appName];
        const deduction = (stats.high * 50) + (stats.medium * 5);
        return Math.max(0, 100 - deduction);
    };

    return (
        <div className="dashboard-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0 }}>Safety Overview</h1>
                <div className="glass-card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Shield size={18} color={safetyScore > 70 ? '#10b981' : '#f59e0b'} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>System Active</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
                {/* Page 1, Rule 2: Large Pie Chart representing 100% safety score */}
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Aggregate Safety Score</h3>
                    <div style={{ width: '100%', height: 250, position: 'relative' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                    startAngle={90}
                                    endAngle={450}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: '800', display: 'block' }}>{safetyScore}%</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Protected</span>
                        </div>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                        {safetyScore > 80 ? 'Your online environment is currently secure.' : 'Potential risks detected. Review your notifications.'}
                    </p>
                </div>

                {/* Page 1, Rule 3 & 4: App progress bars */}
                <div className="glass-card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Platform Protection</h3>

                    {[
                        { name: 'WhatsApp', icon: <MessageSquare size={20} />, color: '#25D366' },
                        { name: 'Telegram', icon: <Phone size={20} />, color: '#0088cc' },
                        { name: 'Other', icon: <Info size={20} />, color: 'var(--primary)' }
                    ].map(app => {
                        const percentage = getAppPercentage(app.name);
                        return (
                            <div key={app.name} style={{ marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ color: app.color }}>{app.icon}</div>
                                        <span style={{ fontWeight: 600 }}>{app.name}</span>
                                    </div>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: percentage > 70 ? 'var(--accent-green)' : percentage > 30 ? 'var(--accent-yellow)' : 'var(--accent-red)' }}>
                                        {percentage}% Safe
                                    </span>
                                </div>
                                <div className="progress-container">
                                    <div
                                        className="progress-bar"
                                        style={{
                                            width: `${percentage}%`,
                                            background: percentage > 70 ? 'var(--accent-green)' : percentage > 30 ? 'var(--accent-yellow)' : 'var(--accent-red)',
                                            boxShadow: `0 0 10px ${percentage > 70 ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}

                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', border: '1px dashed var(--glass-border)' }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            <strong>Deduction Logic:</strong> High Risk reduces app score by 50%. Medium Risk reduces it by 5%. Low Risk has no impact.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
