import React, { useEffect, useState } from 'react';
import { getAlerts } from '../services/api';

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const data = await getAlerts('user_123'); // Demo user ID
                setAlerts(data);
            } catch (err) {
                console.error("Failed to fetch alerts");
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, []);

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Risk History</h1>
            <div className="glass-card">
                {loading ? <p>Loading alerts...</p> : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '1rem' }}>Time</th>
                                <th style={{ padding: '1rem' }}>Severity</th>
                                <th style={{ padding: '1rem' }}>Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alerts.length === 0 ? (
                                <tr><td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No high-risk activity detected.</td></tr>
                            ) : alerts.map((alert) => (
                                <tr key={alert._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>{new Date(alert.timestamp).toLocaleString()}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span className={`status-badge status-${alert.severity.toLowerCase()}`}>
                                            {alert.severity}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {alert.insult_score > 0.5 ? 'Insult ' : ''}
                                        {alert.threat_score > 0.5 ? 'Threat ' : ''}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Alerts;
