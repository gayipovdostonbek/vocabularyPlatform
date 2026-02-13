import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Volume2,
    Zap,
    Info,
    Layers,
    PlayCircle,
    Star,
    LayoutGrid,
    List
} from 'lucide-react';
import { verbsData } from '../data/verbsData';
import { soundService } from '../api/soundService';

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const VerbsDashboard: React.FC = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLevel, setSelectedLevel] = useState<string>('All');
    const [showIrregularOnly, setShowIrregularOnly] = useState(false);
    const [activeVerbId, setActiveVerbId] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    const filteredVerbs = useMemo(() => {
        return verbsData.filter(verb => {
            const currentLang = i18n.language === 'ru' ? 'ru' : 'uz';
            const translationField = `translation_${currentLang}` as keyof typeof verb;
            const translationValue = String(verb[translationField] || verb.translation_uz);

            const matchesSearch = verb.base.toLowerCase().includes(searchTerm.toLowerCase()) ||
                translationValue.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLevel = selectedLevel === 'All' || verb.level === selectedLevel;
            const matchesType = !showIrregularOnly || verb.isIrregular;
            return matchesSearch && matchesLevel && matchesType;
        });
    }, [searchTerm, selectedLevel, showIrregularOnly, i18n.language]);

    const levels = ['All', 'A1', 'A2', 'B1'];

    const playAllForms = async (verb: any) => {
        soundService.speak(verb.base);
        await new Promise(resolve => setTimeout(resolve, 800));
        soundService.speak(verb.past);
        await new Promise(resolve => setTimeout(resolve, 800));
        soundService.speak(verb.pastParticiple);
    };

    return (
        <div className="verbs-dashboard animate-fade-in" style={{ padding: '0 1.5rem', paddingBottom: '5rem' }}>
            <header style={{ marginBottom: '3.5rem', textAlign: 'center', paddingTop: '2rem' }}>
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <h2 style={{
                        fontSize: '3.5rem',
                        fontWeight: 950,
                        marginBottom: '0.5rem',
                        background: 'var(--title-gradient)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-1px'
                    }}>
                        {t('dashboard.title')}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
                        {t('dashboard.subtitle')}
                    </p>
                </motion.div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '2.5rem' }}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/verbs/game')}
                        className="btn btn-primary"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1.2rem 3.5rem',
                            borderRadius: '1.5rem',
                            fontSize: '1.2rem',
                            fontWeight: 800,
                            boxShadow: '0 10px 30px var(--accent-glow)'
                        }}
                    >
                        <Zap size={24} fill="white" /> {t('dashboard.startGame')}
                    </motion.button>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                        <span style={{ color: 'var(--accent)' }}>{t('dashboard.verbsFound', { count: filteredVerbs.length })}</span>
                    </div>
                </div>
            </header>

            {/* Controls Section */}
            <div className="glass-panel" style={{
                padding: '1.5rem',
                marginBottom: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                borderRadius: '2rem',
                boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
            }}>
                {/* Search */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <Search size={22} style={{
                        position: 'absolute',
                        left: '1.2rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)'
                    }} />
                    <input
                        type="text"
                        placeholder={t('dashboard.searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1rem 1rem 1rem 3.5rem',
                            background: 'var(--input-bg)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '1.2rem',
                            color: 'var(--text-main)',
                            fontSize: '1.1rem',
                            outline: 'none',
                            transition: 'all 0.3s'
                        }}
                        className="search-input"
                    />
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    {/* Left Side: Filters */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        {/* Level Filters */}
                        <div style={{ display: 'flex', background: 'var(--subtle-bg)', padding: '0.4rem', borderRadius: '1rem', border: '1px solid var(--border-color)', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {levels.map(level => (
                                <button
                                    key={level}
                                    onClick={() => setSelectedLevel(level)}
                                    style={{
                                        padding: '0.6rem 1.4rem',
                                        borderRadius: '0.8rem',
                                        border: 'none',
                                        background: selectedLevel === level ? 'var(--accent)' : 'transparent',
                                        color: selectedLevel === level ? 'white' : 'var(--text-muted)',
                                        cursor: 'pointer',
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {level === 'All' ? (t('dashboard.all') || 'All') : level}
                                </button>
                            ))}
                        </div>

                        {/* Irregular Toggle */}
                        <button
                            onClick={() => setShowIrregularOnly(!showIrregularOnly)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.8rem',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '1.2rem',
                                border: '2px solid',
                                borderColor: showIrregularOnly ? 'var(--accent)' : 'var(--border-color)',
                                background: showIrregularOnly ? 'var(--accent-glow)' : 'var(--subtle-bg)',
                                color: showIrregularOnly ? 'var(--accent)' : 'var(--text-main)',
                                cursor: 'pointer',
                                fontWeight: 750,
                                fontSize: '0.95rem',
                                transition: 'all 0.3s',
                                minWidth: '180px'
                            }}
                        >
                            <Star size={18} fill={showIrregularOnly ? 'var(--accent)' : 'none'} />
                            {t('dashboard.irregularOnly') || "Noto'g'ri (Irregular)"}
                        </button>
                    </div>

                    {/* Right Side: View Mode Toggle */}
                    <div style={{ display: 'flex', background: 'var(--subtle-bg)', padding: '5px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                        <button
                            onClick={() => setViewMode('grid')}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '10px',
                                border: 'none',
                                background: viewMode === 'grid' ? 'var(--accent)' : 'transparent',
                                color: viewMode === 'grid' ? 'white' : 'var(--text-muted)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                transition: 'all 0.3s'
                            }}
                        >
                            <LayoutGrid size={18} /> <span className="mobile-hide">{t('dashboard.cardsView')}</span>
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '10px',
                                border: 'none',
                                background: viewMode === 'table' ? 'var(--accent)' : 'transparent',
                                color: viewMode === 'table' ? 'white' : 'var(--text-muted)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                transition: 'all 0.3s'
                            }}
                        >
                            <List size={18} /> <span className="mobile-hide">{t('dashboard.tableView')}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* List Transitions */}
            <AnimatePresence mode="wait">
                {viewMode === 'grid' ? (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="verbs-grid"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '1.5rem'
                        }}
                    >
                        {filteredVerbs.map((verb) => (
                            <motion.div
                                layout
                                key={verb.id}
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                className="glass-panel verb-card-premium"
                                onClick={() => setActiveVerbId(activeVerbId === verb.id ? null : verb.id)}
                                style={{
                                    padding: '1.75rem',
                                    cursor: 'pointer',
                                    borderRadius: '2rem',
                                    border: activeVerbId === verb.id ? '2px solid var(--accent)' : '1px solid rgba(255,255,255,0.08)',
                                    position: 'relative',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    overflow: 'hidden',
                                    boxShadow: activeVerbId === verb.id ? '0 20px 40px rgba(0,0,0,0.3)' : '0 10px 25px rgba(0,0,0,0.05)'
                                }}
                            >
                                {/* Badges Row */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', alignItems: 'center' }}>
                                    <div style={{
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        padding: '4px 12px',
                                        borderRadius: '8px',
                                        fontSize: '0.75rem',
                                        fontWeight: 850,
                                        color: 'var(--accent)',
                                        border: '1px solid var(--accent-glow)'
                                    }}>
                                        {verb.level}
                                    </div>
                                    {verb.isIrregular && (
                                        <div style={{
                                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                            color: 'white',
                                            padding: '4px 12px',
                                            fontSize: '0.7rem',
                                            fontWeight: 900,
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}>
                                            <Zap size={12} fill="white" /> {t('verbs.irregular').toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                {/* Main Content */}
                                <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
                                        <h3 style={{ fontSize: '2.2rem', margin: 0, fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                                            {verb.base}
                                        </h3>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); soundService.speak(verb.base); }}
                                            className="btn-icon"
                                            style={{ background: 'var(--subtle-bg)', padding: '10px', borderRadius: '50%', color: 'var(--accent)' }}
                                        >
                                            <Volume2 size={22} />
                                        </button>
                                    </div>
                                    <div style={{ fontSize: '1.2rem', color: 'var(--accent)', fontWeight: 750 }}>
                                        {verb.translation_uz}
                                    </div>
                                </div>

                                {/* Three Forms Visualizer */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '0.75rem',
                                    marginBottom: '1.75rem'
                                }}>
                                    <div style={{ textAlign: 'center', background: 'rgba(96, 165, 250, 0.05)', padding: '1rem 0.2rem', borderRadius: '1.5rem', border: '1px solid rgba(96, 165, 250, 0.1)' }}>
                                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#60a5fa', textTransform: 'uppercase', marginBottom: '5px', opacity: 0.8 }}>V1</div>
                                        <div style={{ fontSize: '1rem', fontWeight: 850 }}>{verb.base}</div>
                                    </div>
                                    <div style={{ textAlign: 'center', background: 'rgba(52, 211, 153, 0.05)', padding: '1rem 0.2rem', borderRadius: '1.5rem', border: '1px solid rgba(52, 211, 153, 0.1)' }}>
                                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', marginBottom: '5px', opacity: 0.8 }}>V2</div>
                                        <div style={{ fontSize: '1rem', fontWeight: 850, color: verb.isIrregular ? '#34d399' : 'inherit' }}>{verb.past}</div>
                                    </div>
                                    <div style={{ textAlign: 'center', background: 'rgba(167, 139, 250, 0.05)', padding: '1rem 0.2rem', borderRadius: '1.5rem', border: '1px solid rgba(167, 139, 250, 0.1)' }}>
                                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#a78bfa', textTransform: 'uppercase', marginBottom: '5px', opacity: 0.8 }}>V3</div>
                                        <div style={{ fontSize: '1rem', fontWeight: 850, color: verb.isIrregular ? '#a78bfa' : 'inherit' }}>{verb.pastParticiple}</div>
                                    </div>
                                </div>

                                {/* Action Row */}
                                <div style={{ display: 'flex', gap: '0.8rem' }}>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); playAllForms(verb); }}
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.6rem',
                                            padding: '0.8rem',
                                            borderRadius: '1.2rem',
                                            background: 'var(--subtle-bg)',
                                            border: '1px solid var(--border-color)',
                                            color: 'var(--text-main)',
                                            fontWeight: 800,
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        <PlayCircle size={20} /> {t('dashboard.listenAll') || 'Listen All'}
                                    </button>
                                    <button
                                        className="btn-icon"
                                        style={{
                                            padding: '0.8rem',
                                            width: '3.2rem',
                                            borderRadius: '1.2rem',
                                            background: activeVerbId === verb.id ? 'var(--accent)' : 'var(--subtle-bg)',
                                            color: activeVerbId === verb.id ? 'white' : 'var(--text-muted)',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Info size={20} />
                                    </button>
                                </div>

                                {/* Example Section (Expand on Click) */}
                                <AnimatePresence>
                                    {activeVerbId === verb.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            style={{ overflow: 'hidden' }}
                                        >
                                            <div style={{
                                                marginTop: '1.5rem',
                                                padding: '1.5rem',
                                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, transparent 100%)',
                                                borderRadius: '1.5rem',
                                                borderLeft: '4px solid var(--accent)'
                                            }}>
                                                <div style={{ marginBottom: '0.5rem', color: 'var(--accent)', fontWeight: 850, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('common.contextualUsage')}:</div>
                                                <div style={{ fontSize: '1.1rem', lineHeight: 1.4, marginBottom: '0.5rem', fontWeight: 700 }}>
                                                    "{verb.example_sentence}"
                                                </div>
                                                <div style={{ fontSize: '0.95rem', color: 'var(--text-lowest)', fontStyle: 'italic' }}>
                                                    {i18n.language === 'ru' ? (verb.example_translation_ru || verb.example_translation_uz) : verb.example_translation_uz}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="table"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="glass-panel"
                        style={{
                            overflow: 'hidden',
                            borderRadius: '2rem',
                            padding: '0',
                            border: '1px solid var(--border-color)',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
                        }}
                    >
                        <div style={{ overflowX: 'auto', maxHeight: '72vh' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', textAlign: 'left', minWidth: '900px' }}>
                                <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-secondary)', backdropFilter: 'blur(20px)', borderBottom: '2px solid var(--border-color)' }}>
                                    <tr style={{ color: 'var(--text-lowest)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        <th style={{ padding: '1.75rem 1.5rem', fontWeight: 800 }}>{t('verbs.v1')}</th>
                                        <th style={{ padding: '1.75rem 1.5rem', fontWeight: 800 }}>{t('verbs.v2')}</th>
                                        <th style={{ padding: '1.75rem 1.5rem', fontWeight: 800 }}>{t('verbs.v3')}</th>
                                        <th style={{ padding: '1.75rem 1.5rem', fontWeight: 800 }}>{t('verbs.translation')}</th>
                                        <th style={{ padding: '1.75rem 1.5rem', fontWeight: 800, textAlign: 'center' }}>{t('verbs.level')}</th>
                                        <th style={{ padding: '1.75rem 1.5rem', fontWeight: 800, textAlign: 'right' }}>{t('verbs.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredVerbs.map((verb) => (
                                        <React.Fragment key={verb.id}>
                                            <tr
                                                onClick={() => setActiveVerbId(activeVerbId === verb.id ? null : verb.id)}
                                                className={`modern-table-row ${activeVerbId === verb.id ? 'active' : ''}`}
                                                style={{
                                                    cursor: 'pointer',
                                                    background: activeVerbId === verb.id ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                                }}
                                            >
                                                <td style={{ padding: '1.5rem 1.5rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }} />
                                                        <span style={{ fontWeight: 850, fontSize: '1.1rem', color: 'var(--text-main)', letterSpacing: '0.2px' }}>{verb.base}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1.5rem 1.5rem' }}>
                                                    <span style={{
                                                        fontWeight: 800,
                                                        color: verb.isIrregular ? '#34d399' : 'var(--text-muted)',
                                                        background: verb.isIrregular ? 'rgba(52, 211, 153, 0.1)' : 'transparent',
                                                        padding: verb.isIrregular ? '6px 10px' : '0',
                                                        borderRadius: '8px',
                                                        fontSize: '1.05rem'
                                                    }}>
                                                        {verb.past}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1.5rem 1.5rem' }}>
                                                    <span style={{
                                                        fontWeight: 800,
                                                        color: verb.isIrregular ? '#a78bfa' : 'var(--text-muted)',
                                                        background: verb.isIrregular ? 'rgba(167, 139, 250, 0.1)' : 'transparent',
                                                        padding: verb.isIrregular ? '6px 10px' : '0',
                                                        borderRadius: '8px',
                                                        fontSize: '1.05rem'
                                                    }}>
                                                        {verb.pastParticiple}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1.5rem 1.5rem' }}>
                                                    <span style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '1rem' }}>
                                                        {i18n.language === 'ru' ? verb.translation_ru || verb.translation_uz : verb.translation_uz}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1.5rem 1.5rem', textAlign: 'center' }}>
                                                    <span style={{
                                                        background: 'rgba(99, 102, 241, 0.12)',
                                                        padding: '5px 14px',
                                                        borderRadius: '2rem',
                                                        fontSize: '0.8rem',
                                                        color: 'var(--accent)',
                                                        fontWeight: 900,
                                                        border: '1px solid var(--accent-glow)'
                                                    }}>
                                                        {verb.level}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1.5rem 1.5rem', textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1, backgroundColor: 'var(--accent)', color: 'white' }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={(e) => { e.stopPropagation(); soundService.speak(verb.base); }}
                                                            style={{
                                                                background: 'rgba(99, 102, 241, 0.1)',
                                                                border: 'none',
                                                                width: '42px',
                                                                height: '42px',
                                                                borderRadius: '14px',
                                                                color: 'var(--accent)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.3s'
                                                            }}
                                                            title="Pronounce"
                                                        >
                                                            <Volume2 size={20} />
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1, backgroundColor: '#10b981', color: 'white' }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={(e) => { e.stopPropagation(); playAllForms(verb); }}
                                                            style={{
                                                                background: 'rgba(16, 185, 129, 0.1)',
                                                                border: 'none',
                                                                width: '42px',
                                                                height: '42px',
                                                                borderRadius: '14px',
                                                                color: '#10b981',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.3s'
                                                            }}
                                                            title="Listen All Forms"
                                                        >
                                                            <PlayCircle size={20} />
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1, rotate: activeVerbId === verb.id ? 180 : 0 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            style={{
                                                                background: 'var(--subtle-bg)',
                                                                border: 'none',
                                                                width: '42px',
                                                                height: '42px',
                                                                borderRadius: '14px',
                                                                color: activeVerbId === verb.id ? 'var(--accent)' : 'var(--text-lowest)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.3s'
                                                            }}
                                                        >
                                                            <Info size={20} />
                                                        </motion.button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <AnimatePresence>
                                                {activeVerbId === verb.id && (
                                                    <tr>
                                                        <td colSpan={6} style={{ padding: '0', border: 'none' }}>
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                style={{ overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}
                                                            >
                                                                <div style={{
                                                                    padding: '2.5rem',
                                                                    display: 'flex',
                                                                    gap: '3rem',
                                                                    alignItems: 'center',
                                                                    borderLeft: '5px solid var(--accent)',
                                                                    margin: '0 1.5rem'
                                                                }}>
                                                                    <div style={{ flex: 1 }}>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
                                                                            <Star size={18} fill="var(--accent)" color="var(--accent)" />
                                                                            <span style={{ color: 'var(--accent)', fontWeight: 900, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '3px' }}>{t('common.contextualUsage')}</span>
                                                                        </div>
                                                                        <div style={{ fontWeight: 900, fontSize: '1.6rem', color: 'var(--text-main)', marginBottom: '0.8rem', lineHeight: 1.3 }}>
                                                                            "{verb.example_sentence}"
                                                                        </div>
                                                                        <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontStyle: 'italic', fontWeight: 500 }}>
                                                                            {i18n.language === 'ru' ? (verb.example_translation_ru || verb.example_translation_uz) : verb.example_translation_uz}
                                                                        </div>
                                                                    </div>
                                                                    <div style={{
                                                                        background: 'rgba(255, 255, 255, 0.03)',
                                                                        padding: '2rem',
                                                                        borderRadius: '2rem',
                                                                        border: '1px solid var(--border-color)',
                                                                        minWidth: '240px',
                                                                        textAlign: 'center',
                                                                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                                                                    }}>
                                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-lowest)', marginBottom: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>{t('common.classification')}</div>
                                                                        <div style={{ fontSize: '1.3rem', fontWeight: 950, color: verb.isIrregular ? '#f59e0b' : '#34d399' }}>
                                                                            {verb.isIrregular ? t('common.irregularVerb') : t('common.regularVerb')}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </AnimatePresence>
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {filteredVerbs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-muted)' }}>
                    <Layers size={60} style={{ marginBottom: '1.5rem', opacity: 0.15 }} />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Mavjud emas</h3>
                    <p style={{ fontSize: '1.1rem', opacity: 0.6 }}>Qidiruv parametrlarini o'zgartirib ko'ring</p>
                </div>
            )}

            <style>{`
                .verb-card-premium {
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .search-input:focus {
                    border-color: var(--accent) !important;
                    background: rgba(255, 255, 255, 0.05) !important;
                    box-shadow: 0 0 30px var(--accent-glow);
                }
                .modern-table-row {
                    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
                }
                .modern-table-row:hover {
                    background: rgba(255, 255, 255, 0.03) !important;
                }
                .modern-table-row.active {
                    background: rgba(99, 102, 241, 0.08) !important;
                }
                
                @media (max-width: 768px) {
                    .verbs-grid {
                        grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)) !important;
                    }
                    h2 { font-size: 3rem !important; }
                    .mobile-hide { display: none; }
                }

                @media (max-width: 480px) {
                    .verbs-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .verbs-dashboard { padding: 0 1rem !important; }
                    .verb-card-premium { padding: 1.5rem !important; }
                    h2 { font-size: 2.5rem !important; }
                }
            `}</style>
        </div>
    );
};
