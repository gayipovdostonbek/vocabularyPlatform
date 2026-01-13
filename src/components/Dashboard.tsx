import React from 'react';
import type { Word } from '../types';
import { Play, RotateCcw, Award } from 'lucide-react';

interface DashboardProps {
    words: Word[];
    onStart: () => void;
    onReset: () => void;
    onManage: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ words, onStart, onReset, onManage }) => {
    const total = words.length;
    const learned = words.filter(w => w.status === 'learned').length;
    const learning = total - learned;
    const percentage = total === 0 ? 0 : Math.round((learned / total) * 100);

    return (
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, background: 'linear-gradient(to right, #fff, var(--text-muted))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 2rem 0' }}>
                Vocabulary Master
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '1rem' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Words</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{total}</div>
                </div>
                <div style={{ background: 'rgba(16,185,129,0.1)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <div style={{ color: '#6ee7b7', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Learned</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#34d399' }}>{learned}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '1rem' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Progress</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{percentage}%</div>
                </div>
            </div>

            {total === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <p style={{ color: 'var(--text-muted)' }}>No words found.</p>
                    <button className="btn btn-secondary" onClick={onManage}>Add your first word</button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    {learning === 0 ? (
                        <div style={{ marginBottom: '2rem' }}>
                            <Award size={64} color="#fbbf24" style={{ marginBottom: '1rem' }} />
                            <h2 style={{ fontSize: '1.5rem' }}>All words learned!</h2>
                            <p style={{ color: 'var(--text-muted)' }}>You are amazing.</p>
                            <button className="btn btn-secondary" onClick={onManage} style={{ marginTop: '1rem' }}>Add more words</button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-primary" onClick={onStart} style={{ fontSize: '1.2rem', padding: '1rem 3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Play fill="currentColor" size={24} /> Start
                            </button>
                            <button className="btn btn-secondary" onClick={onManage} style={{ fontSize: '1.2rem', padding: '1rem 1.5rem' }}>
                                Manage Cards
                            </button>
                        </div>
                    )}

                    <button
                        onClick={onReset}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', marginTop: '1rem' }}
                    >
                        <RotateCcw size={14} /> Clear data & Import new
                    </button>
                </div>
            )}
        </div>
    );
};
