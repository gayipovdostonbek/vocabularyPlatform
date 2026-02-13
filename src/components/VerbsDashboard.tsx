import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Volume2,
    Zap,
    Info,
    Layers,
    ChevronLeft,
    PlayCircle,
    Star
} from 'lucide-react';
import { verbsData } from '../data/verbsData';
import { soundService } from '../api/soundService';

import { useNavigate } from 'react-router-dom';

export const VerbsDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLevel, setSelectedLevel] = useState<string>('All');
    const [showIrregularOnly, setShowIrregularOnly] = useState(false);
    const [activeVerbId, setActiveVerbId] = useState<number | null>(null);

    const filteredVerbs = useMemo(() => {
        return verbsData.filter(verb => {
            const matchesSearch = verb.base.toLowerCase().includes(searchTerm.toLowerCase()) ||
                verb.translation_uz.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLevel = selectedLevel === 'All' || verb.level === selectedLevel;
            const matchesType = !showIrregularOnly || verb.isIrregular;
            return matchesSearch && matchesLevel && matchesType;
        });
    }, [searchTerm, selectedLevel, showIrregularOnly]);

    const levels = ['All', 'A1', 'A2', 'B1'];

    const playAllForms = async (verb: any) => {
        soundService.speak(verb.base);
        await new Promise(resolve => setTimeout(resolve, 800));
        soundService.speak(verb.past);
        await new Promise(resolve => setTimeout(resolve, 800));
        soundService.speak(verb.pastParticiple);
    };

    return (
        <div className="verbs-dashboard animate-fade-in" style={{ padding: '0 1rem', paddingBottom: '5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
                >
                    <ChevronLeft size={20} /> Orqaga
                </button>
            </div>
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
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
                        Verb Master ⚡️
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                        250 ta eng ko'p qo'llaniladigan fe'llar va ularning barcha shakllarini yodlang
                    </p>
                </motion.div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/verbs/game')}
                    className="btn btn-primary"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        margin: '0 auto',
                        padding: '1.2rem 3rem',
                        borderRadius: '1.5rem',
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        boxShadow: '0 10px 30px var(--accent-glow)'
                    }}
                >
                    <Zap size={24} fill="white" /> O'yinni boshlash
                </motion.button>
            </header>

            {/* Controls Section */}
            <div className="glass-panel" style={{
                padding: '1.2rem',
                marginBottom: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.2rem',
                borderRadius: '1.5rem',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
                {/* Search */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <Search size={20} style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)'
                    }} />
                    <input
                        type="text"
                        placeholder="Fe'lni qidiring..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.8rem 1rem 0.8rem 3rem',
                            background: 'var(--subtle-bg)',
                            border: '2px solid var(--border-color)',
                            borderRadius: '1rem',
                            color: 'var(--text-main)',
                            fontSize: '1rem',
                            outline: 'none',
                            transition: 'all 0.3s'
                        }}
                        className="search-input"
                    />
                </div>

                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {/* Level Filters */}
                    <div style={{ display: 'flex', background: 'var(--subtle-bg)', padding: '0.3rem', borderRadius: '0.8rem', border: '1px solid var(--border-color)', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {levels.map(level => (
                            <button
                                key={level}
                                onClick={() => setSelectedLevel(level)}
                                style={{
                                    padding: '0.5rem 1.2rem',
                                    borderRadius: '0.6rem',
                                    border: 'none',
                                    background: selectedLevel === level ? 'var(--accent)' : 'transparent',
                                    color: selectedLevel === level ? 'white' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {level}
                            </button>
                        ))}
                    </div>

                    {/* Irregular Toggle */}
                    <button
                        onClick={() => setShowIrregularOnly(!showIrregularOnly)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            padding: '0.7rem 1.2rem',
                            borderRadius: '1rem',
                            border: '2px solid',
                            borderColor: showIrregularOnly ? 'var(--accent)' : 'var(--border-color)',
                            background: showIrregularOnly ? 'var(--accent-glow)' : 'var(--subtle-bg)',
                            color: showIrregularOnly ? 'var(--accent)' : 'var(--text-main)',
                            cursor: 'pointer',
                            fontWeight: 750,
                            fontSize: '0.9rem',
                            transition: 'all 0.2s',
                            flex: '1',
                            justifyContent: 'center',
                            minWidth: '160px'
                        }}
                    >
                        <Star size={16} fill={showIrregularOnly ? 'var(--accent)' : 'none'} />
                        Noto'g'ri
                    </button>
                </div>
            </div>

            {/* Verbs List Grid */}
            <div className="verbs-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem'
            }}>
                <AnimatePresence mode="popLayout">
                    {filteredVerbs.map((verb) => (
                        <motion.div
                            layout
                            key={verb.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="glass-panel verb-card-premium"
                            onClick={() => setActiveVerbId(activeVerbId === verb.id ? null : verb.id)}
                            style={{
                                padding: '1.5rem',
                                cursor: 'pointer',
                                borderRadius: '1.5rem',
                                border: activeVerbId === verb.id ? '2px solid var(--accent)' : '1px solid rgba(255,255,255,0.08)',
                                position: 'relative',
                                background: 'rgba(255, 255, 255, 0.03)',
                                overflow: 'hidden',
                                boxShadow: activeVerbId === verb.id ? '0 15px 30px rgba(0,0,0,0.2), 0 0 15px var(--accent-glow)' : '0 10px 20px rgba(0,0,0,0.05)'
                            }}
                        >
                            {/* Badges Row */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                                <div style={{
                                    background: 'var(--subtle-bg)',
                                    padding: '3px 10px',
                                    borderRadius: '6px',
                                    fontSize: '0.7rem',
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
                                        padding: '3px 10px',
                                        fontSize: '0.65rem',
                                        fontWeight: 900,
                                        borderRadius: '6px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        boxShadow: '0 4px 10px rgba(245, 158, 11, 0.2)'
                                    }}>
                                        <Zap size={10} fill="white" /> IRREGULAR
                                    </div>
                                )}
                            </div>

                            {/* Main Content */}
                            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                                    <h3 style={{ fontSize: '2rem', margin: 0, fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                                        {verb.base}
                                    </h3>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); soundService.speak(verb.base); }}
                                        className="btn-icon"
                                        style={{ background: 'var(--subtle-bg)', padding: '8px', borderRadius: '50%', color: 'var(--accent)' }}
                                    >
                                        <Volume2 size={20} />
                                    </button>
                                </div>
                                <div style={{ fontSize: '1.1rem', color: 'var(--accent)', fontWeight: 700, opacity: 0.9 }}>
                                    {verb.translation_uz}
                                </div>
                            </div>

                            {/* Three Forms Visualizer */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '0.5rem',
                                marginBottom: '1.2rem'
                            }}>
                                <div style={{ textAlign: 'center', background: 'rgba(59, 130, 246, 0.08)', padding: '0.6rem 0.2rem', borderRadius: '1rem', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                                    <div style={{ fontSize: '0.55rem', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '0.5px' }}>V1</div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 850, color: 'var(--text-main)', wordBreak: 'break-word' }}>{verb.base}</div>
                                </div>
                                <div style={{ textAlign: 'center', background: 'rgba(245, 158, 11, 0.08)', padding: '0.6rem 0.2rem', borderRadius: '1rem', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
                                    <div style={{ fontSize: '0.55rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '0.5px' }}>V2</div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 850, color: verb.isIrregular ? '#f59e0b' : 'inherit', wordBreak: 'break-word' }}>{verb.past}</div>
                                </div>
                                <div style={{ textAlign: 'center', background: 'rgba(239, 68, 68, 0.08)', padding: '0.6rem 0.2rem', borderRadius: '1rem', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                    <div style={{ fontSize: '0.55rem', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '0.5px' }}>V3</div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 850, color: verb.isIrregular ? '#ef4444' : 'inherit', wordBreak: 'break-word' }}>{verb.pastParticiple}</div>
                                </div>
                            </div>

                            {/* Action Row */}
                            <div style={{ display: 'flex', gap: '0.6rem' }}>
                                <button
                                    onClick={(e) => { e.stopPropagation(); playAllForms(verb); }}
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.4rem',
                                        padding: '0.7rem',
                                        borderRadius: '0.8rem',
                                        background: 'var(--subtle-bg)',
                                        border: '1px solid var(--border-color)',
                                        color: 'var(--text-main)',
                                        fontWeight: 750,
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <PlayCircle size={16} /> Eshitish
                                </button>
                                <button
                                    className="btn-icon"
                                    style={{
                                        padding: '0.7rem',
                                        borderRadius: '0.8rem',
                                        background: activeVerbId === verb.id ? 'var(--accent)' : 'var(--subtle-bg)',
                                        color: activeVerbId === verb.id ? 'white' : 'var(--text-muted)',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Info size={18} />
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
                                            marginTop: '1.2rem',
                                            padding: '1.2rem',
                                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, transparent 100%)',
                                            borderRadius: '1.2rem',
                                            borderLeft: '4px solid var(--accent)'
                                        }}>
                                            <div style={{ marginBottom: '0.5rem', color: 'var(--accent)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Misol:</div>
                                            <div style={{ fontSize: '1rem', lineHeight: 1.4, marginBottom: '0.5rem', fontWeight: 600 }}>
                                                "{verb.example_sentence}"
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                                {verb.example_translation_uz}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredVerbs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
                    <Layers size={50} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Topilmadi</h3>
                    <p style={{ fontSize: '0.9rem' }}>Qidiruv so'zini yoki filtrlarni o'zgartirib ko'ring.</p>
                </div>
            )}

            <style>{`
                .verb-card-premium {
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
                }
                .search-input:focus {
                    border-color: var(--accent) !important;
                    background: rgba(255, 255, 255, 0.05) !important;
                    box-shadow: 0 0 20px var(--accent-glow);
                }
                
                @media (max-width: 768px) {
                    .verbs-grid {
                        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
                    }
                    h2 { font-size: 2.8rem !important; }
                }

                @media (max-width: 480px) {
                    .verbs-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .verbs-dashboard { padding: 0 0.8rem !important; }
                    .verb-card-premium { padding: 1.2rem !important; }
                    h2 { font-size: 2.2rem !important; }
                    .btn-primary { 
                        padding: 1rem 2rem !important;
                        font-size: 1.1rem !important;
                    }
                }
            `}</style>
        </div>
    );
};
