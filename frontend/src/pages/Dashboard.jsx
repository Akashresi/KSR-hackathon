import React, { useEffect, useState } from 'react';
import { Activity, Shield, AlertTriangle } from 'lucide-react';
import PermissionInfo from '../components/PermissionInfo';

const Dashboard = () => {
    const [stats, setStats] = useState({ totalAnalyzed: 0, threatsBlocked: 0, status: 'Active' });

    useEffect(() => {
        // Simulated live updates
        setStats({ totalAnalyzed: 142, threatsBlocked: 3, status: 'Active' });
    }, []);

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>System Overview</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>Protection Status</p>
                            <h2 style={{ margin: 0, color: 'var(--accent-green)' }}>{stats.status}</h2>
                        </div>
                        <Shield size={40} color="var(--accent-green)" />
                    </div>
                </div>

                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>Messages Analyzed</p>
                            <h2 style={{ margin: 0 }}>{stats.totalAnalyzed}</h2>
                        </div>
                        <Activity size={40} color="var(--primary)" />
                    </div>
                </div>

                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>Threats Detected</p>
                            <h2 style={{ margin: 0, color: 'var(--accent-red)' }}>{stats.threatsBlocked}</h2>
                        </div>
                        <AlertTriangle size={40} color="var(--accent-red)" />
                    </div>
                </div>
            </div>

            <PermissionInfo />
        </div>
    );
};

export default Dashboard;
