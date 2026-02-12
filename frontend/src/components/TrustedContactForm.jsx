import React, { useState } from 'react';
import { setTrustedContact } from '../services/api';
import { ShieldCheck } from 'lucide-react';

const TrustedContactForm = ({ userId }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('saving');
        try {
            await setTrustedContact({ user_id: userId, name, email });
            setStatus('success');
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <ShieldCheck color="#6366f1" size={32} />
                <h2 style={{ margin: 0 }}>Trusted Contact</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                In case of high-risk cyberbullying detection, we will send an alert to this person.
            </p>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                        placeholder="Guardian Name"
                        required
                    />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
                        placeholder="guardian@example.com"
                        required
                    />
                </div>
                <button type="submit" className="btn-primary" disabled={status === 'saving'}>
                    {status === 'saving' ? 'Saving...' : 'Save Contact'}
                </button>
                {status === 'success' && <p style={{ color: 'var(--accent-green)', marginTop: '1rem' }}>Contact saved successfully!</p>}
            </form>
        </div>
    );
};

export default TrustedContactForm;
