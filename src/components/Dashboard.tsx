import React from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Award, Settings, Flame, Sparkles, Volume2, Keyboard, TrendingUp, Zap, Calendar, Check, Trash2, Mic, BookOpen, ShoppingBag, Coins } from 'lucide-react';
import type { Word } from '../types';
import { soundService } from '../api/soundService';

import { gamificationService } from '../utils/gamificationService';
import type { UserProfile } from '../types';

interface DashboardProps {
    userProfile: UserProfile;
    words: Word[];
    dailyGoal: number;
    streak?: number;
    onStart: (mode: 'flashcard' | 'quiz' | 'spelling' | 'speaking', category?: string) => void;
    onReset: () => void;
    onManage: (filter?: 'all' | 'learning' | 'learned') => void;
    onOpenSettings: () => void;
    onOpenShop: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
    userProfile, words, dailyGoal, streak = 0, onStart, onReset, onManage, onOpenSettings, onOpenShop
}) => {

    const [showResetConfirm, setShowResetConfirm] = React.useState(false);

    // Gamification Stats
    const levelInfo = React.useMemo(() => gamificationService.getLevel(userProfile.xp), [userProfile.xp]);

    // Kun so'zini tanlash
    const wordOfTheDay = React.useMemo(() => {
        const unlearned = words.filter(w => w.status !== 'learned');
        if (unlearned.length === 0) return null;
        const todayStr = new Date().toISOString().split('T')[0];
        const seed = todayStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return unlearned[seed % unlearned.length];
    }, [words]);

    const total = words.length;
    const learned = words.filter(w => w.status === 'learned').length;
    const learning = words.filter(w => w.status === 'learning').length;

    const today = new Date().toISOString().split('T')[0];
    const learnedToday = words.filter(w => w.lastReviewedAt?.startsWith(today)).length;
    const progress = Math.min(100, Math.round((learnedToday / dailyGoal) * 100));

    // Last 7 days chart data
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const count = words.filter(w => w.status === 'learned' && w.learnedAt?.startsWith(dateStr)).length;
        const daysUz = { 'Mon': 'Du', 'Tue': 'Se', 'Wed': 'Ch', 'Thu': 'Pa', 'Fri': 'Ju', 'Sat': 'Sh', 'Sun': 'Ya' };
        const dayEn = d.toLocaleDateString('en-US', { weekday: 'short' }) as keyof typeof daysUz;
        return { day: daysUz[dayEn] || dayEn, count };
    }).reverse();

    // Level Calculation
    const getLevel = (count: number) => {
        if (count >= 1000) return { name: 'Legend', color: '#ec4899', icon: '👑' };
        if (count >= 500) return { name: 'Master', color: '#8b5cf6', icon: '🎓' };
        if (count >= 200) return { name: 'Scholar', color: '#f59e0b', icon: '📚' };
        if (count >= 50) return { name: 'Rookie', color: '#3b82f6', icon: '🌱' };
        return { name: 'Newbie', color: '#10b981', icon: '🥚' };
    };

    const level = getLevel(learned);
    const nextLevelTarget =
        learned < 50 ? 50 :
            learned < 200 ? 200 :
                learned < 500 ? 500 :
                    learned < 1000 ? 1000 : 2000;

    const xpProgress = Math.min(100, Math.round((learned / nextLevelTarget) * 100));

    return (
        <>
            <div className="dashboard animate-fade-in" style={{ textAlign: 'left', maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>

                {/* Level Banner */}
                <div className="glass-panel" style={{
                    marginBottom: '2rem',
                    padding: '1.5rem',
                    background: `linear-gradient(to right, var(--bg-secondary), ${level.color}20)`,
                    border: `1px solid ${level.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ fontSize: '2.5rem', background: 'var(--subtle-bg)', padding: '0.5rem', borderRadius: '1rem', lineHeight: 1 }}>
                            {level.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Rank</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: level.color }}>{level.name}</div>
                        </div>
                    </div>

                    <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <span>Progress to next rank</span>
                            <span>{learned} / {nextLevelTarget} XP</span>
                        </div>
                        <div style={{ height: '8px', background: 'var(--subtle-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${xpProgress}%`, background: level.color, borderRadius: '4px', transition: 'width 1s ease' }} />
                        </div>
                    </div>
                </div>

                {/* Header Stats Grid */}
                <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

                    {/* Main Progress Card */}
                    <div className="glass-panel" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, padding: '1.5rem', opacity: 0.1 }}>
                            <TrendingUp size={120} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <Calendar size={16} className="text-secondary" />
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Bugungi Maqsad</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-1px' }}>{learnedToday}</span>
                                    <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/ {dailyGoal}</span>
                                </div>
                            </div>
                            <button onClick={onOpenSettings} className="btn-icon" style={{ background: 'var(--subtle-bg)', padding: '0.5rem', borderRadius: '0.75rem', height: 'fit-content' }}>
                                <Settings size={20} style={{ color: 'var(--text-muted)' }} />
                            </button>
                        </div>

                        <div style={{ marginTop: '1.5rem', position: 'relative', zIndex: 1 }}>
                            <div style={{ background: 'rgba(255,255,255,0.1)', height: '10px', borderRadius: '5px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    style={{ height: '100%', background: 'var(--accent)', boxShadow: '0 0 20px var(--accent-glow)' }}
                                />
                            </div>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: progress >= 100 ? 'var(--success)' : 'var(--text-muted)' }}>
                                {progress >= 100 ?
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} /> Maqsad bajarildi!</span> :
                                    `Yana ${dailyGoal - learnedToday} ta so'z qoldi`
                                }
                            </p>
                        </div>
                    </div>

                    {/* Word Statistics Card - FIRST */}
                    <div className="glass-panel" onClick={() => onManage()} style={{ padding: '2rem', cursor: 'pointer', transition: 'all 0.3s', border: '1px solid transparent', position: 'relative', overflow: 'hidden' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}>
                        <div style={{ position: 'absolute', top: 0, right: 0, padding: '1.5rem', opacity: 0.1 }}>
                            <BookOpen size={120} />
                        </div>

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <BookOpen size={16} className="text-secondary" />
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Jami so'zlar</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-1px' }}>{total}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginBottom: '0.25rem' }}>Yodlangan</div>
                                    <div style={{ fontWeight: 700, fontSize: '1.5rem' }}>{learned}</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#3b82f6', marginBottom: '0.25rem' }}>O'rganilmoqda</div>
                                    <div style={{ fontWeight: 700, fontSize: '1.5rem' }}>{learning}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Level Card */}
                    <div className="glass-panel" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, padding: '1.5rem', opacity: 0.1 }}>
                            <Award size={120} />
                        </div>

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <Award size={16} className="text-secondary" />
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Daraja</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-1px' }}>{levelInfo.current.level}</span>
                                <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/ 10</span>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 600 }}>{levelInfo.current.title}</div>
                            <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${levelInfo.progress}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    style={{ height: '100%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent-glow)' }}
                                />
                            </div>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                {userProfile.xp} / {levelInfo.next.minXP} XP
                            </div>
                        </div>
                    </div>

                    {/* Streak Card */}
                    <div className="glass-panel" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, padding: '1.5rem', opacity: 0.1 }}>
                            <Flame size={120} />
                        </div>

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <Flame size={16} className="text-secondary" />
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Streak</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-1px' }}>{streak}</span>
                                <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>kun</span>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                {streak > 0 ? `Ajoyib! ${streak} kun ketma-ket mashq qildingiz!` : 'Bugun mashq qiling va streak boshlang!'}
                            </div>
                        </div>
                    </div>

                    {/* Coins Card */}
                    <div className="glass-panel" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, padding: '1.5rem', opacity: 0.1 }}>
                            <Coins size={120} />
                        </div>

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <Coins size={16} className="text-secondary" />
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Tangalar</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-1px' }}>{userProfile.coins}</span>
                            </div>
                            <button
                                onClick={onOpenShop}
                                className="btn"
                                style={{
                                    width: '100%',
                                    background: 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)',
                                    border: 'none',
                                    color: 'white',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <ShoppingBag size={18} /> Do'kon
                            </button>
                        </div>
                    </div>
                </div>

                {/* Word of the Day Hero Card */}
                {wordOfTheDay && (
                    <div className="glass-panel" style={{
                        marginBottom: '2.5rem',
                        padding: '2.5rem',
                        background: 'var(--card-front-bg)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1, transform: 'rotate(15deg)' }}>
                            <Sparkles size={200} />
                        </div>

                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
                            <div style={{
                                background: 'var(--accent)',
                                color: 'white',
                                padding: '0.4rem 1rem',
                                borderRadius: '2rem',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 4px 15px var(--accent-glow)'
                            }}>
                                <Sparkles size={14} /> Kun so'zi
                            </div>

                            <div style={{ margin: '1rem 0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <h1 style={{ fontSize: '3.5rem', fontWeight: 800, margin: 0, lineHeight: 1, color: 'var(--text-main)' }}>
                                        {wordOfTheDay.english}
                                    </h1>
                                    <button onClick={() => soundService.speak(wordOfTheDay.english)} className="btn-icon-large" style={{ background: 'var(--subtle-bg)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}>
                                        <Volume2 size={20} />
                                    </button>
                                </div>
                                <div style={{ fontSize: '1.8rem', color: 'var(--accent)', fontWeight: 500 }}>{wordOfTheDay.uzbek}</div>
                            </div>

                            {wordOfTheDay.example && (
                                <div style={{ maxWidth: '600px', background: 'var(--subtle-bg)', padding: '1rem 1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                                    <div style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '0.5rem' }}>"{wordOfTheDay.example}"</div>
                                    {wordOfTheDay.exampleTranslation && <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{wordOfTheDay.exampleTranslation}</div>}
                                </div>
                            )}

                            <div className="mastery-indicator" style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                {[0, 1, 2, 3].map(lvl => (
                                    <div key={lvl} style={{
                                        width: '12px', height: '12px', borderRadius: '50%',
                                        background: (wordOfTheDay.masteryLevel || 0) > lvl ? 'var(--success)' : 'var(--border-color)',
                                        boxShadow: (wordOfTheDay.masteryLevel || 0) > lvl ? '0 0 10px rgba(34, 197, 94, 0.5)' : 'none'
                                    }} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div style={{ marginBottom: '3rem' }}>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Zap className="text-accent" /> Mashg'ulotlar
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {/* Flashcards */}
                        <div className="glass-panel mode-card interactable" onClick={() => onStart('flashcard')} style={{ padding: '2rem', cursor: 'pointer', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s ease' }}>
                            <div style={{ marginBottom: '1.5rem', background: 'rgba(139, 92, 246, 0.1)', width: 'fit-content', padding: '1rem', borderRadius: '1rem' }}>
                                <Play size={32} style={{ color: 'var(--accent)' }} />
                            </div>
                            <h4 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0' }}>Flesh-kartalar</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Klassik usulda so'zlarni yodlash. O'zingizni sinab ko'ring.</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem' }}>
                                Boshlash <TrendingUp size={16} />
                            </div>
                        </div>

                        {/* Quiz */}
                        <div className="glass-panel mode-card interactable" onClick={() => onStart('quiz')} style={{ padding: '2rem', cursor: 'pointer', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s ease' }}>
                            <div style={{ marginBottom: '1.5rem', background: 'rgba(34, 197, 94, 0.1)', width: 'fit-content', padding: '1rem', borderRadius: '1rem' }}>
                                <Award size={32} style={{ color: 'var(--success)' }} />
                            </div>
                            <h4 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0' }}>Multiple Choice</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>4 ta variantdan to'g'risini topish orqali tezkor test.</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: 600, fontSize: '0.9rem' }}>
                                Boshlash <TrendingUp size={16} />
                            </div>
                        </div>

                        {/* Spelling */}
                        <div className="glass-panel mode-card interactable" onClick={() => onStart('spelling')} style={{ padding: '2rem', cursor: 'pointer', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s ease' }}>
                            <div style={{ marginBottom: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', width: 'fit-content', padding: '1rem', borderRadius: '1rem' }}>
                                <Keyboard size={32} style={{ color: '#3b82f6' }} />
                            </div>
                            <h4 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0' }}>Yozma Mashq</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Eshitish va to'g'ri yozishni mashq qilish.</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6', fontWeight: 600, fontSize: '0.9rem' }}>
                                Boshlash <TrendingUp size={16} />
                            </div>
                        </div>

                        {/* Speaking Practice */}
                        <div className="glass-panel mode-card interactable" onClick={() => onStart('speaking')} style={{ padding: '2rem', cursor: 'pointer', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s ease' }}>
                            <div style={{ marginBottom: '1.5rem', background: 'rgba(236, 72, 153, 0.1)', width: 'fit-content', padding: '1rem', borderRadius: '1rem' }}>
                                <Mic size={32} style={{ color: '#ec4899' }} />
                            </div>
                            <h4 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0' }}>Talaffuz Mashqi</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>So'zlarni to'g'ri talaffuz qilishni mashq qiling.</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ec4899', fontWeight: 600, fontSize: '0.9rem' }}>
                                Boshlash <TrendingUp size={16} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Chart & Footer */}
                <div className="glass-panel" style={{ marginBottom: '3rem', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Oxirgi 7 kunlik faollik</h3>

                        {/* Reset Button */}
                        <button
                            onClick={() => setShowResetConfirm(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--error)', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                            <Trash2 size={14} /> Progressni tozalash
                        </button>
                    </div>

                    <div className="chart-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '120px', gap: '0.5rem' }}>
                        {last7Days.map((data, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${Math.max(5, (data.count / (dailyGoal || 10)) * 100)}px` }}
                                        style={{
                                            width: '60%',
                                            maxWidth: '30px',
                                            background: data.count >= dailyGoal ? 'var(--success)' : 'var(--accent)',
                                            borderRadius: '4px 4px 0 0',
                                            opacity: data.count === 0 ? 0.2 : 0.8,
                                            boxShadow: data.count >= dailyGoal ? '0 0 10px rgba(34, 197, 94, 0.3)' : '0 0 10px rgba(139, 92, 246, 0.3)'
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

                <style>{`
                .interactable:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
                    border-color: rgba(255,255,255,0.1) !important;
                }
                .text-accent { color: var(--accent); }
                .text-secondary { color: var(--text-muted); }
                
                @media (max-width: 768px) {
                    .dashboard-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
            </div>
            {/* Custom Confirm Modal Portal */}
            {
                ReactDOM.createPortal(
                    <AnimatePresence>
                        {showResetConfirm && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'rgba(0,0,0,0.7)',
                                    backdropFilter: 'blur(5px)',
                                    zIndex: 9999, // High z-index
                                    display: 'flex',
                                    alignItems: 'center', // Center vertically
                                    justifyContent: 'center', // Center horizontally
                                    padding: '1rem'
                                }}
                            >
                                <motion.div
                                    initial={{ scale: 0.9, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.9, y: 20 }}
                                    className="glass-panel"
                                    style={{
                                        padding: '2rem',
                                        maxWidth: '400px',
                                        width: '100%',
                                        textAlign: 'center',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        boxShadow: '0 0 40px rgba(0,0,0,0.5)',
                                        background: 'var(--glass-bg)', // Ensure background is set
                                    }}
                                >
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 1.5rem auto'
                                    }}>
                                        <Trash2 size={30} color="var(--error)" />
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Rostdan ham tozalaymizmi?</h3>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.5' }}>
                                        Barcha yutuqlaringiz va o'rganilgan so'zlar statistikasi o'chib ketadi. Bu amalni ortga qaytarib bo'lmaydi.
                                    </p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <button
                                            onClick={() => setShowResetConfirm(false)}
                                            className="btn"
                                            style={{
                                                background: 'transparent',
                                                border: '1px solid var(--border-color)',
                                                color: 'var(--text-main)'
                                            }}
                                        >
                                            Bekor qilish
                                        </button>
                                        <button
                                            onClick={() => {
                                                onReset();
                                                setShowResetConfirm(false);
                                            }}
                                            className="btn"
                                            style={{
                                                background: 'var(--error)',
                                                border: 'none',
                                                color: 'white'
                                            }}
                                        >
                                            Ha, tozalash
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body
                )
            }
        </>
    );
};
