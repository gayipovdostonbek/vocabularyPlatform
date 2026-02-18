import React from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Award, Settings, Flame, Sparkles, Volume2, Keyboard, TrendingUp, Calendar, Check, Trash2, Mic, BookOpen, ShoppingBag, Coins, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Word } from '../types';
import { soundService } from '../api/soundService';
import { verbsData } from '../data/verbsData';


import type { UserProfile } from '../types';

interface DashboardProps {
    userProfile: UserProfile;
    words: Word[];
    dailyGoal: number;
    streak?: number;
    onStart: (mode: 'flashcard' | 'quiz' | 'spelling' | 'speaking', category?: string) => void;
    onReset: () => void;
    onOpenShop: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
    userProfile, words, dailyGoal, streak = 0, onStart, onReset, onOpenShop
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [showResetConfirm, setShowResetConfirm] = React.useState(false);


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
        const daysUz: Record<string, string> = {
            'Mon': t('days.mon') || 'Mon',
            'Tue': t('days.tue') || 'Tue',
            'Wed': t('days.wed') || 'Wed',
            'Thu': t('days.thu') || 'Thu',
            'Fri': t('days.fri') || 'Fri',
            'Sat': t('days.sat') || 'Sat',
            'Sun': t('days.sun') || 'Sun'
        };
        const dayEn = d.toLocaleDateString('en-US', { weekday: 'short' });
        return { day: daysUz[dayEn] || dayEn, count };
    }).reverse();

    // Level Calculation
    const getLevel = (count: number) => {
        if (count >= 1000) return { name: t('ranks.legend'), color: '#ec4899', icon: '👑' };
        if (count >= 500) return { name: t('ranks.master'), color: '#8b5cf6', icon: '🎓' };
        if (count >= 200) return { name: t('ranks.scholar'), color: '#f59e0b', icon: '📚' };
        if (count >= 50) return { name: t('ranks.rookie'), color: '#3b82f6', icon: '🌱' };
        return { name: t('ranks.newbie'), color: '#10b981', icon: '🥚' };
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

                {/* Level Banner - Reimagined */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.015, borderColor: level.color, boxShadow: `0 20px 40px -10px ${level.color}40` }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="glass-panel"
                    style={{
                        marginBottom: '2rem',
                        padding: '1.5rem 2rem',
                        background: `linear-gradient(135deg, var(--glass-bg) 0%, ${level.color}10 100%)`,
                        border: `1px solid ${level.color}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '2rem',
                        boxShadow: `0 10px 30px -10px ${level.color}20`,
                        borderRadius: '1.5rem'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <motion.div
                            whileHover={{ filter: 'brightness(1.2)' }}
                            style={{
                                fontSize: '2.5rem',
                                background: 'var(--subtle-bg)',
                                width: '72px',
                                height: '72px',
                                borderRadius: '1.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                lineHeight: 1
                            }}
                        >
                            {level.icon}
                        </motion.div>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600, marginBottom: '0.25rem' }}>
                                {t('dashboard.currentRank')}
                            </div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: level.color, letterSpacing: '-0.5px' }}>
                                {level.name}
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: '1', minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>
                                {t('dashboard.rankProgress')}
                            </span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                                <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{learned}</span> / {nextLevelTarget} XP
                            </span>
                        </div>
                        <div style={{ height: '12px', background: 'var(--subtle-bg)', borderRadius: '6px', overflow: 'hidden', padding: '2px', border: '1px solid var(--border-color)' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${xpProgress}%` }}
                                transition={{ duration: 0.8, ease: 'circOut' }}
                                style={{
                                    height: '100%',
                                    background: `linear-gradient(90deg, ${level.color}, #ffffff50)`,
                                    borderRadius: '4px',
                                    boxShadow: `0 0 15px ${level.color}50`
                                }}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Header Stats Grid - Premium Layout */}
                <div className="dashboard-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2.5rem'
                }}>

                    {/* Main Progress Card */}
                    <motion.div
                        whileHover={{ scale: 1.015, borderColor: 'var(--accent)', boxShadow: '0 20px 40px -10px var(--accent-glow)' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        className="glass-panel"
                        style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden', borderRadius: '1.5rem' }}
                    >
                        <div style={{ position: 'absolute', top: '-10%', right: '-5%', padding: '1.5rem', opacity: 0.05 }}>
                            <TrendingUp size={160} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1, marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '0.6rem', borderRadius: '0.75rem' }}>
                                    <Calendar size={20} style={{ color: 'var(--accent)' }} />
                                </div>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {t('dashboard.dailyGoal')}
                                </span>
                            </div>
                            <button
                                onClick={() => navigate('/settings')}
                                className="interactable"
                                style={{
                                    background: 'var(--subtle-bg)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-muted)',
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                            >
                                <Settings size={18} />
                            </button>
                        </div>

                        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-2px' }}>{learnedToday}</span>
                                <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {dailyGoal}</span>
                            </div>

                            <div style={{ marginTop: '1rem', background: 'var(--subtle-bg)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                    style={{
                                        height: '100%',
                                        background: 'linear-gradient(90deg, var(--accent) 0%, #7c3aed 100%)',
                                        boxShadow: '0 0 15px var(--accent-glow)'
                                    }}
                                />
                            </div>
                            <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: progress >= 100 ? 'var(--success)' : 'var(--text-muted)', fontWeight: 500 }}>
                                {progress >= 100 ?
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}><Check size={16} strokeWidth={3} /> {t('dashboard.goalAchieved')}</span> :
                                    t('dashboard.remainingWords', { count: dailyGoal - learnedToday })
                                }
                            </div>
                        </div>
                    </motion.div>

                    {/* Word Statistics Card */}
                    <motion.div
                        whileHover={{ scale: 1.015, borderColor: '#3b82f6', boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.3)' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        className="glass-panel"
                        onClick={() => navigate('/manage')}
                        style={{ padding: '1.5rem', cursor: 'pointer', position: 'relative', overflow: 'hidden', borderRadius: '1.5rem' }}
                    >
                        <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.05 }}>
                            <BookOpen size={160} />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
                            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.6rem', borderRadius: '0.75rem' }}>
                                <BookOpen size={20} style={{ color: '#3b82f6' }} />
                            </div>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {t('dashboard.totalWords')}
                            </span>
                        </div>

                        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-2px', marginBottom: '1rem' }}>{total}</div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--subtle-bg)', padding: '0.75rem', borderRadius: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700, textTransform: 'uppercase' }}>{t('dashboard.learned')}</div>
                                    <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>{learned}</div>
                                </div>
                                <div style={{ borderLeft: '1px solid var(--border-color)' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase' }}>{t('dashboard.learning')}</div>
                                    <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>{learning}</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Streak Card */}
                    <motion.div
                        whileHover={{ scale: 1.015, borderColor: '#f59e0b', boxShadow: '0 20px 40px -10px rgba(245, 158, 11, 0.3)' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        className="glass-panel"
                        style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden', borderRadius: '1.5rem' }}
                    >
                        <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.05 }}>
                            <Flame size={160} />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
                            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '0.6rem', borderRadius: '0.75rem' }}>
                                <Flame size={20} style={{ color: '#f59e0b' }} />
                            </div>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {t('dashboard.streak')}
                            </span>
                        </div>

                        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.5rem' }}>
                                <motion.span
                                    animate={streak > 0 ? { scale: [1, 1.1, 1] } : {}}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    style={{ fontSize: '3.5rem', fontWeight: 900, color: streak > 0 ? '#f59e0b' : 'var(--text-main)', letterSpacing: '-2px' }}
                                >
                                    {streak}
                                </motion.span>
                                <span style={{ fontSize: '1.5rem', color: '#f59e0b' }}>🔥</span>
                            </div>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                                {streak > 0 ? t('dashboard.streakGood', { count: streak }) : t('dashboard.streakStart')}
                            </div>
                        </div>
                    </motion.div>

                    {/* Coins Card */}
                    <motion.div
                        whileHover={{ scale: 1.015, borderColor: 'var(--success)', boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.3)' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        className="glass-panel"
                        style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden', borderRadius: '1.5rem' }}
                    >
                        <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.05 }}>
                            <Coins size={160} />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
                            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.6rem', borderRadius: '0.75rem' }}>
                                <Coins size={20} style={{ color: 'var(--success)' }} />
                            </div>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {t('dashboard.coins')}
                            </span>
                        </div>

                        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-2px', marginBottom: '1rem' }}>{userProfile.coins}</div>
                            <button
                                onClick={onOpenShop}
                                className="interactable"
                                style={{
                                    width: '100%',
                                    background: 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)',
                                    border: 'none',
                                    color: 'white',
                                    padding: '0.75rem',
                                    borderRadius: '1rem',
                                    cursor: 'pointer',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.6rem',
                                    boxShadow: '0 8px 15px -3px rgba(124, 58, 237, 0.4)'
                                }}
                            >
                                <ShoppingBag size={18} /> {t('dashboard.shop')}
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Word of the Day Hero Section */}
                {wordOfTheDay && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-panel"
                        style={{
                            marginBottom: '3rem',
                            padding: '3rem 2rem',
                            background: 'var(--glass-bg)',
                            border: '1px solid var(--border-color)',
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '2rem',
                            textAlign: 'center',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.05, transform: 'rotate(15deg)' }}>
                            <Sparkles size={240} />
                        </div>

                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <motion.div
                                animate={{ y: [0, -4, 0], boxShadow: ['0 10px 30px rgba(124, 58, 237, 0.2)', '0 15px 40px rgba(124, 58, 237, 0.4)', '0 10px 30px rgba(124, 58, 237, 0.2)'] }}
                                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                                whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
                                style={{
                                    background: 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)',
                                    color: 'white',
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '2rem',
                                    fontSize: '0.8rem',
                                    fontWeight: 800,
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.6rem',
                                    boxShadow: '0 10px 20px -5px var(--accent-glow)',
                                    marginBottom: '2rem'
                                }}
                            >
                                <Sparkles size={16} /> {t('dashboard.wordOfTheDay')}
                            </motion.div>

                            <div style={{ marginBottom: '2.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '0.5rem' }}>
                                    <h2 style={{ fontSize: 'min(5rem, 12vw)', fontWeight: 900, margin: 0, lineHeight: 0.9, color: 'var(--text-main)', letterSpacing: '-3px' }}>
                                        {wordOfTheDay.english}
                                    </h2>
                                    <button
                                        onClick={() => soundService.speak(wordOfTheDay.english)}
                                        className="interactable"
                                        style={{
                                            background: 'var(--subtle-bg)',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '50%',
                                            width: '56px',
                                            height: '56px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            color: 'var(--accent)'
                                        }}
                                    >
                                        <Volume2 size={24} strokeWidth={2.5} />
                                    </button>
                                </div>
                                <div style={{ fontSize: '2.25rem', color: 'var(--accent)', fontWeight: 600, letterSpacing: '-1px' }}>
                                    {wordOfTheDay.uzbek}
                                </div>
                            </div>

                            {wordOfTheDay.example && (
                                <div style={{
                                    maxWidth: '700px',
                                    background: 'var(--subtle-bg)',
                                    padding: '1.5rem 2rem',
                                    borderRadius: '1.5rem',
                                    border: '1px solid var(--border-color)',
                                    position: 'relative'
                                }}>
                                    <div style={{ fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--text-main)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                                        "{wordOfTheDay.example}"
                                    </div>
                                    {wordOfTheDay.exampleTranslation && (
                                        <div style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                                            {wordOfTheDay.exampleTranslation}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2.5rem' }}>
                                {[0, 1, 2, 3].map(lvl => (
                                    <motion.div
                                        key={lvl}
                                        animate={(wordOfTheDay.masteryLevel || 0) > lvl ? { scale: [1, 1.2, 1] } : {}}
                                        transition={{ delay: lvl * 0.1 }}
                                        style={{
                                            width: '14px',
                                            height: '14px',
                                            borderRadius: '50%',
                                            background: (wordOfTheDay.masteryLevel || 0) > lvl ? 'var(--success)' : 'var(--border-color)',
                                            boxShadow: (wordOfTheDay.masteryLevel || 0) > lvl ? '0 0 15px rgba(34, 197, 94, 0.6)' : 'none'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Quick Actions - Reimagined Grid */}
                <div style={{ marginBottom: '4rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-main)' }}>
                        <div style={{ background: 'var(--accent)', width: '4px', height: '24px', borderRadius: '2px' }} />
                        {t('dashboard.exercises')}
                    </h3>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {/* Flashcards */}
                        <motion.div
                            whileHover="hover"
                            initial="initial"
                            className="glass-panel interactable"
                            onClick={() => onStart('flashcard')}
                            style={{ padding: '2rem', cursor: 'pointer', borderRadius: '1.75rem', position: 'relative', overflow: 'hidden' }}
                            variants={{
                                hover: { scale: 1.015, borderColor: 'var(--accent)', boxShadow: '0 20px 40px -10px var(--accent-glow)' }
                            }}
                        >
                            <motion.div
                                variants={{ hover: { scale: 1.1, rotate: 5, background: 'rgba(139, 92, 246, 0.25)' } }}
                                style={{ marginBottom: '1.5rem', background: 'rgba(139, 92, 246, 0.15)', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1.25rem', transition: 'all 0.15s' }}
                            >
                                <Play size={32} style={{ color: 'var(--accent)' }} />
                            </motion.div>
                            <h4 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.75rem 0' }}>{t('dashboard.flashcards')}</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.6 }}>{t('dashboard.flashcardsDesc')}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent)', fontWeight: 700, fontSize: '0.95rem' }}>
                                {t('dashboard.startLearning')} <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
                            </div>
                        </motion.div>

                        {/* Quiz */}
                        <motion.div
                            whileHover="hover"
                            initial="initial"
                            className="glass-panel interactable"
                            onClick={() => onStart('quiz')}
                            style={{ padding: '2rem', cursor: 'pointer', borderRadius: '1.75rem', position: 'relative', overflow: 'hidden' }}
                            variants={{
                                hover: { scale: 1.015, borderColor: 'var(--success)', boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.3)' }
                            }}
                        >
                            <motion.div
                                variants={{ hover: { scale: 1.1, rotate: -5, background: 'rgba(16, 185, 129, 0.25)' } }}
                                style={{ marginBottom: '1.5rem', background: 'rgba(16, 185, 129, 0.15)', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1.25rem', transition: 'all 0.15s' }}
                            >
                                <Award size={32} style={{ color: 'var(--success)' }} />
                            </motion.div>
                            <h4 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.75rem 0' }}>{t('dashboard.multipleChoice')}</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.6 }}>{t('dashboard.multipleChoiceDesc')}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--success)', fontWeight: 700, fontSize: '0.95rem' }}>
                                {t('dashboard.startLearning')} <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
                            </div>
                        </motion.div>

                        {/* Spelling */}
                        <motion.div
                            whileHover="hover"
                            initial="initial"
                            className="glass-panel interactable"
                            onClick={() => onStart('spelling')}
                            style={{ padding: '2rem', cursor: 'pointer', borderRadius: '1.75rem', position: 'relative', overflow: 'hidden' }}
                            variants={{
                                hover: { scale: 1.015, borderColor: '#3b82f6', boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.3)' }
                            }}
                        >
                            <motion.div
                                variants={{ hover: { scale: 1.1, rotate: 10, background: 'rgba(59, 130, 246, 0.25)' } }}
                                style={{ marginBottom: '1.5rem', background: 'rgba(59, 130, 246, 0.15)', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1.25rem', transition: 'all 0.15s' }}
                            >
                                <Keyboard size={32} style={{ color: '#3b82f6' }} />
                            </motion.div>
                            <h4 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.75rem 0' }}>{t('dashboard.spelling')}</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.6 }}>{t('dashboard.spellingDesc')}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#3b82f6', fontWeight: 700, fontSize: '0.95rem' }}>
                                {t('dashboard.startLearning')} <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
                            </div>
                        </motion.div>

                        {/* Speaking Practice */}
                        <motion.div
                            whileHover="hover"
                            initial="initial"
                            className="glass-panel interactable"
                            onClick={() => onStart('speaking')}
                            style={{ padding: '2rem', cursor: 'pointer', borderRadius: '1.75rem', position: 'relative', overflow: 'hidden' }}
                            variants={{
                                hover: { scale: 1.015, borderColor: '#ec4899', boxShadow: '0 20px 40px -10px rgba(236, 72, 153, 0.3)' }
                            }}
                        >
                            <motion.div
                                variants={{ hover: { scale: 1.15, background: 'rgba(236, 72, 153, 0.25)' } }}
                                style={{ marginBottom: '1.5rem', background: 'rgba(236, 72, 153, 0.15)', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1.25rem', transition: 'all 0.15s' }}
                            >
                                <Mic size={32} style={{ color: '#ec4899' }} />
                            </motion.div>
                            <h4 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.75rem 0' }}>{t('dashboard.speaking')}</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.6 }}>{t('dashboard.speakingDesc')}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ec4899', fontWeight: 700, fontSize: '0.95rem' }}>
                                {t('dashboard.startLearning')} <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
                            </div>
                        </motion.div>

                        {/* Verbs Section */}
                        <motion.div
                            whileHover="hover"
                            initial="initial"
                            className="glass-panel interactable"
                            onClick={() => navigate('/verbs')}
                            style={{ padding: '2rem', cursor: 'pointer', borderRadius: '1.75rem', position: 'relative', overflow: 'hidden' }}
                            variants={{
                                hover: { scale: 1.015, borderColor: 'var(--success)', boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.3)' }
                            }}
                        >
                            <motion.div
                                variants={{ hover: { scale: 1.1, rotate: 180, background: 'rgba(16, 185, 129, 0.25)' } }}
                                style={{ marginBottom: '1.5rem', background: 'rgba(16, 185, 129, 0.15)', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1.25rem', transition: 'all 0.15s' }}
                            >
                                <Sparkles size={32} style={{ color: 'var(--success)' }} />
                            </motion.div>
                            <h4 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.75rem 0' }}>{t('dashboard.verbsMode')}</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.6 }}>{t('dashboard.verbsModeDesc', { count: verbsData.length })}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--success)', fontWeight: 700, fontSize: '0.95rem' }}>
                                {t('dashboard.viewMore')} <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
                            </div>
                        </motion.div>

                        {/* Grammar Section */}
                        <motion.div
                            whileHover="hover"
                            initial="initial"
                            className="glass-panel interactable"
                            onClick={() => navigate('/grammar')}
                            style={{ padding: '2rem', cursor: 'pointer', borderRadius: '1.75rem', position: 'relative', overflow: 'hidden' }}
                            variants={{
                                hover: { scale: 1.015, borderColor: '#f59e0b', boxShadow: '0 20px 40px -10px rgba(245, 158, 11, 0.3)' }
                            }}
                        >
                            <motion.div
                                variants={{ hover: { scale: 1.1, background: 'rgba(245, 158, 11, 0.25)' } }}
                                style={{ marginBottom: '1.5rem', background: 'rgba(245, 158, 11, 0.15)', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1.25rem', transition: 'all 0.3s' }}
                            >
                                <BookOpen size={32} style={{ color: '#f59e0b' }} />
                            </motion.div>
                            <h4 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.75rem 0' }}>{t('dashboard.grammarMode')}</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                                {t('dashboard.grammarModeDesc')}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#f59e0b', fontWeight: 700, fontSize: '0.95rem' }}>
                                {t('dashboard.startLearning')} <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Activity Chart & Footer */}
                <div className="glass-panel" style={{ marginBottom: '3rem', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{t('dashboard.activityTitle')}</h3>

                        {/* Reset Button */}
                        <button
                            onClick={() => setShowResetConfirm(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--error)', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                            <Trash2 size={14} /> {t('dashboard.resetProgress')}
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
                    box-shadow: 0 10px 40px -10px rgba(0,0,0,0.4);
                    border-color: rgba(255,255,255,0.15) !important;
                }
                .text-accent { color: var(--accent); }
                .text-secondary { color: var(--text-muted); }

                @media (max-width: 1024px) {
                    .dashboard-grid { grid-template-columns: 1fr 1fr !important; }
                }
                
                @media (max-width: 640px) {
                    .dashboard-grid { grid-template-columns: 1fr !important; }
                    .dashboard { padding: 0 1rem; }
                    header { padding: 1rem !important; }
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
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{t('resetModal.title')}</h3>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.5' }}>
                                        {t('resetModal.desc')}
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
                                            {t('resetModal.cancel')}
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
                                            {t('resetModal.confirm')}
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
