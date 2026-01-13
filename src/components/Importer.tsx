import React, { useState } from 'react';
import Papa from 'papaparse';
import { FileSpreadsheet, Download } from 'lucide-react';
import type { Word } from '../types';

interface ImporterProps {
    onImport: (words: Word[], url: string) => void;
}

export const Importer: React.FC<ImporterProps> = ({ onImport }) => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImport = async () => {
        if (!url) return;
        setLoading(true);
        setError(null);

        // Google Sheets "Publish to Web" CSV check
        // It usually looks like: https://docs.google.com/spreadsheets/d/e/.../pub?output=csv
        // But we will try to fetch whatever URL is given.

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch the sheet. Make sure it is public.');
            const csvText = await response.text();

            Papa.parse(csvText, {
                header: true, // Try with headers first
                skipEmptyLines: true,
                complete: (results) => {
                    if (results.data && results.data.length > 0) {
                        // Robust column detection
                        const firstRow = results.data[0] as any;
                        const keys = Object.keys(firstRow);

                        if (keys.length < 2) {
                            setError('The sheet must have at least 2 columns (English & Uzbek).');
                            setLoading(false);
                            return;
                        }

                        const englishKey = keys[0];
                        const uzbekKey = keys[1];

                        const words: Word[] = results.data.map((row: any, index: number) => ({
                            id: `word-${index}-${Date.now()}`,
                            english: row[englishKey],
                            uzbek: row[uzbekKey],
                            status: 'new' as const
                        })).filter(w => w.english && w.uzbek); // cleanup empty rows

                        if (words.length === 0) {
                            setError('No valid words found.');
                        } else {
                            onImport(words, url);
                        }
                    } else {
                        setError('Sheet is empty.');
                    }
                    setLoading(false);
                },
                error: (err: any) => {
                    setError('CSV Parse Error: ' + err.message);
                    setLoading(false);
                }
            });

        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel animate-fade-in" style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
            <FileSpreadsheet size={48} color="var(--accent)" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Import Vocabulary</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Paste the link to your Google Sheet (File → Share → Publish to Web → CSV).
            </p>

            <input
                type="text"
                className="input-field"
                placeholder="https://docs.google.com/.../pub?output=csv"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />

            {error && <p style={{ color: 'var(--error)', marginTop: '0.5rem' }}>{error}</p>}

            <button
                className="btn btn-primary"
                style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', width: '100%' }}
                onClick={handleImport}
                disabled={loading}
            >
                {loading ? 'Loading...' : <><Download size={20} /> Import Words</>}
            </button>
        </div>
    );
};
