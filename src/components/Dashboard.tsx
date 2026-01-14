import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Award, Settings, Flame, Sparkles, Volume2 } from 'lucide-react';
import type { Word } from '../types';

interface DashboardProps {
    words: Word[];
    dailyGoal: number;
    streak?: number;
    onStart: (category?: string) => void;
    onReset: () => void;
    onManage: () => void;
    onOpenSettings: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
    words, dailyGoal, streak = 0, onStart, onReset, onManage, onOpenSettings
}) => {
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

    // Kun so'zini tanlash (yodlanmaganlar orasidan)
    const wordOfTheDay = React.useMemo(() => {
        const unlearned = words.filter(w => w.status !== 'learned');
        if (unlearned.length === 0) return null;
        // Tasodifiy tanlash uchun seed sifatida bugungi sanadan foydalanamiz
        const todayStr = new Date().toISOString().split('T')[0];
        const seed = todayStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return unlearned[seed % unlearned.length];
    }, [words]);

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    const total = words.length;
    const learned = words.filter(w => w.status === 'learned').length;

    const today = new Date().toISOString().split('T')[0];
    const learnedToday = words.filter(w => w.status === 'learned' && w.learnedAt?.startsWith(today)).length;

    const progress = Math.min(100, Math.round((learnedToday / dailyGoal) * 100));

    const categories = Array.from(new Set(words.map(w => w.category).filter(Boolean))) as string[];

    // Last 7 days chart data
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const count = words.filter(w => w.status === 'learned' && w.learnedAt?.startsWith(dateStr)).length;

        // Kun nomlarini o'zbekchalashtirish
        const daysUz = {
            'Mon': 'Du', 'Tue': 'Se', 'Wed': 'Ch', 'Thu': 'Pa', 'Fri': 'Ju', 'Sat': 'Sh', 'Sun': 'Ya'
        };
        const dayEn = d.toLocaleDateString('en-US', { weekday: 'short' }) as keyof typeof daysUz;

        return {
            day: daysUz[dayEn] || dayEn,
            count
        };
    }).reverse();

    return (
        <div className="dashboard animate-fade-in" style={{ textAlign: 'left' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* Progress Card */}
                <div className="glass-panel" style={{ padding: '2rem', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                        <div>
                            <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Kunlik Progress</h3>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <span style={{ fontSize: '3rem', fontWeight: 800 }}>{learnedToday}</span>
                                <span style={{ color: 'var(--text-muted)' }}>/ {dailyGoal} ta so'z</span>
                            </div>
                        </div>
                        <button
                            onClick={onOpenSettings}
                            style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-muted)', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                            title="Maqsadni sozlash"
                        >
                            <Settings size={20} />
                        </button>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.05)', height: '12px', borderRadius: '6px', overflow: 'hidden', marginBottom: '1rem' }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            style={{ height: '100%', background: 'var(--accent)', boxShadow: '0 0 15px var(--accent-glow)' }}
                        />
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: progress >= 100 ? 'var(--success)' : 'var(--text-muted)' }}>
                        {progress >= 100 ? '🎉 Maqsad bajarildi!' : `Maqsadga erishish uchun yana ${dailyGoal - learnedToday} ta so'z qoldi`}
                    </p>

                    {/* Streak Badge */}
                    {streak > 0 && (
                        <div style={{
                            position: 'absolute',
                            top: '-15px',
                            right: '25px',
                            background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                            padding: '0.5rem 1rem',
                            borderRadius: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
                            color: 'white',
                            fontWeight: 700
                        }}>
                            <Flame size={18} fill="white" />
                            <span>{streak} KUNLIK STREAK</span>
                        </div>
                    )}
                </div>

                {/* Stats Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Umumiy so'zlar</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{total}</div>
                        </div>
                        <Award size={32} color="var(--accent)" opacity={0.5} />
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Yodlangan</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>{learned}</div>
                        </div>
                        <div style={{ background: 'rgba(16,185,129,0.1)', padding: '0.5rem', borderRadius: '0.5rem', color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600 }}>
                            {Math.round((learned / total) * 100 || 0)}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity Chart */}
            <div className="glass-panel" style={{ marginTop: '2rem', padding: '2rem' }}>
                <h3 style={{ margin: '0 0 2rem 0', fontSize: '1.1rem' }}>Oxirgi 7 kunlik faollik</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '150px', gap: '0.5rem' }}>
                    {last7Days.map((data, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${Math.max(5, (data.count / (dailyGoal || 10)) * 100)}px` }}
                                    style={{
                                        width: '60%',
                                        background: data.count >= dailyGoal ? 'var(--success)' : 'var(--accent)',
                                        borderRadius: '4px 4px 0 0',
                                        opacity: data.count === 0 ? 0.2 : 1
                                    }}
                                />
                                {data.count > 0 && (
                                    <span style={{ position: 'absolute', top: '-1.5rem', fontSize: '0.75rem', fontWeight: 600 }}>{data.count}</span>
                                )}
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{data.day}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Kun so'zi bo'limi */}
            {wordOfTheDay && (
                <div className="glass-panel" style={{
                    marginTop: '2rem',
                    padding: '1.5rem 2rem',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(30, 41, 59, 0.7) 100%)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid rgba(139, 92, 246, 0.2)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ background: 'var(--accent)', padding: '0.75rem', borderRadius: '1rem', boxShadow: '0 0 15px var(--accent-glow)' }}>
                            <Sparkles size={24} color="white" />
                        </div>
                        <div>
                            <h4 style={{ margin: 0, color: 'var(--accent)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Kun so'zi</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
                                <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{wordOfTheDay.english}</span>
                                <span style={{ color: 'var(--text-muted)' }}>—</span>
                                <span style={{ fontSize: '1.25rem' }}>{wordOfTheDay.uzbek}</span>
                                <button
                                    onClick={() => speak(wordOfTheDay.english)}
                                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center' }}
                                    title="Eshitish"
                                >
                                    <Volume2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.4rem' }}>O'zlashtirish darajasi</div>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                            {[0, 1, 2, 3].map(lvl => (
                                <div
                                    key={lvl}
                                    style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: (wordOfTheDay.masteryLevel || 0) > lvl ? 'var(--success)' : 'rgba(255,255,255,0.1)'
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Start Sections */}
            <div style={{ marginTop: '3rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>O'rganishni boshlash</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                    <button
                        className={`btn ${selectedCategory === undefined ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setSelectedCategory(undefined)}
                        style={{ fontSize: '0.9rem', padding: '0.6rem 1.25rem' }}
                    >
                        Barcha so'zlar
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setSelectedCategory(cat)}
                            style={{ fontSize: '0.9rem', padding: '0.6rem 1.25rem' }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <button className="btn btn-primary" onClick={() => onStart(selectedCategory)} style={{ height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                        <Play fill="white" size={20} /> Mashqni boshlash
                    </button>
                    <button className="btn btn-secondary" onClick={onManage} style={{ height: '4rem' }}>
                        Lug'at
                    </button>
                    <button className="btn btn-secondary" onClick={onReset} style={{ height: '4rem', color: 'var(--error)', borderColor: 'rgba(239,68,68,0.2)' }}>
                        Tozalash
                    </button>
                </div>
            </div>
        </div>
    );
};
