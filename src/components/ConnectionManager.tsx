import React, { useState } from 'react';
import { Link, Database } from 'lucide-react';
import { sheetService } from '../api/sheetService';
import type { Word } from '../types';

interface ConnectionManagerProps {
    onConnect: (words: Word[], url: string) => void;
}

export const ConnectionManager: React.FC<ConnectionManagerProps> = ({ onConnect }) => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConnect = async () => {
        if (!url) return;
        setLoading(true);
        setError(null);

        try {
            const words = await sheetService.syncWords(url);
            onConnect(words, url);
        } catch (err: any) {
            setError('Connection failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel animate-fade-in" style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
            <Database size={48} color="var(--accent)" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Connect to Google Sheet</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                1. Extensions → Apps Script.<br />
                2. Paste the provided code.<br />
                3. Deploy as Web App (Anyone).<br />
                4. Paste URL here.
            </p>

            <input
                type="text"
                className="input-field"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />

            {error && <p style={{ color: 'var(--error)', marginTop: '0.5rem' }}>{error}</p>}

            <button
                className="btn btn-primary"
                style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', width: '100%' }}
                onClick={handleConnect}
                disabled={loading}
            >
                {loading ? 'Connecting...' : <><Link size={20} /> Connect Database</>}
            </button>
        </div>
    );
};
