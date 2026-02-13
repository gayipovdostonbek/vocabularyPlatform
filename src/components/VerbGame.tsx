import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Timer,
    Trophy,
    ChevronLeft,
    CheckCircle2,
    XCircle,
    Volume2,
    Heart,
    Flame,
    Layers,
    Dna,
    Infinity as InfinityIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { verbsData } from '../data/verbsData';
import { soundService } from '../api/soundService';
import confetti from 'canvas-confetti';

interface Option {
    v2: string;
    v3: string;
    isCorrect: boolean;
}

type GameMode = 'all' | 'irregular' | 'regular';

export const VerbGame: React.FC = () => {
    const navigate = useNavigate();
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
    const [gameMode, setGameMode] = useState<GameMode>('all');
    const [currentVerbIndex, setCurrentVerbIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [score, setScore] = useState(0);
    const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const [lives, setLives] = useState(3);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [isShaking, setIsShaking] = useState(false);
    const [options, setOptions] = useState<Option[]>([]);

    const timerRef = useRef<any>(null);

    // Shuffle and filter verbs based on selected mode
    const filteredVerbs = useMemo(() => {
        let pool = [...verbsData];
        if (gameMode === 'irregular') pool = pool.filter(v => v.isIrregular);
        if (gameMode === 'regular') pool = pool.filter(v => !v.isIrregular);
        return pool.sort(() => Math.random() - 0.5);
    }, [gameState === 'idle', gameMode]);

    const currentVerb = filteredVerbs[currentVerbIndex];

    // Generate options when verb changes
    useEffect(() => {
        if (gameState === 'playing' && currentVerb) {
            const correctOption: Option = {
                v2: currentVerb.past,
                v3: currentVerb.pastParticiple,
                isCorrect: true
            };

            const distractors: Option[] = [];
            const usedIndices = new Set([verbsData.findIndex(v => v.id === currentVerb.id)]);

            // We still pick distractors from all verbs to make it more varied
            while (distractors.length < 3) {
                const randomIndex = Math.floor(Math.random() * verbsData.length);
                if (!usedIndices.has(randomIndex)) {
                    const v = verbsData[randomIndex];
                    distractors.push({ v2: v.past, v3: v.pastParticiple, isCorrect: false });
                    usedIndices.add(randomIndex);
                }
            }

            setOptions([...distractors, correctOption].sort(() => Math.random() - 0.5));
        }
    }, [currentVerbIndex, gameState]);

    // Timer logic
    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0 && !showFeedback) {
            timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && gameState === 'playing' && !showFeedback) {
            handleSelect(null);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [timeLeft, gameState, showFeedback]);

    const initialTime = Math.max(5, 10 - Math.floor(score / 8));

    const startGame = () => {
        if (filteredVerbs.length === 0) return;
        setGameState('playing');
        setCurrentVerbIndex(0);
        setScore(0);
        setLives(3);
        setCombo(0);
        setMaxCombo(0);
        setTimeLeft(10);
        setShowFeedback(null);
    };

    const triggerShake = () => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
    };

    const handleSelect = (option: Option | null) => {
        if (showFeedback) return;

        const isCorrect = option?.isCorrect || false;

        if (isCorrect) {
            const newCombo = combo + 1;
            setCombo(newCombo);
            if (newCombo > maxCombo) setMaxCombo(newCombo);

            setScore(prev => prev + 1);
            setShowFeedback('correct');
            soundService.playSuccess();
            if (newCombo >= 3) {
                confetti({
                    particleCount: 50,
                    spread: 60,
                    origin: { y: 0.6 },
                    colors: ['#ff4d4d', '#ff9933', '#ffff66']
                });
            }
        } else {
            setCombo(0);
            setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) setTimeout(() => setGameState('finished'), 2000);
                return newLives;
            });
            setShowFeedback('incorrect');
            triggerShake();
            soundService.playError();
        }

        setTimeout(() => {
            if (lives > (isCorrect ? 0 : 1)) {
                setCurrentVerbIndex(prev => (prev + 1) % filteredVerbs.length);
                setTimeLeft(initialTime);
                setShowFeedback(null);
            }
        }, 1200);
    };

    if (gameState === 'idle') {
        return (
            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: '120px', height: '120px', borderRadius: '30px', background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--accent)', border: '2px solid var(--accent)', boxShadow: '0 0 30px var(--accent-glow)' }}> <Zap size={60} fill="var(--accent)" /> </motion.div>
                    <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem', background: 'var(--title-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Verb Blitz ⚡️</h2>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '450px', margin: '0 auto 2.5rem', fontSize: '1.2rem' }}> O'yin turini tanlang va bilimingizni sinang! </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', maxWidth: '400px', margin: '0 auto 3rem' }}>
                        <button
                            onClick={() => setGameMode('all')}
                            style={{
                                padding: '1.5rem', borderRadius: '1.5rem', border: '2px solid',
                                borderColor: gameMode === 'all' ? 'var(--accent)' : 'var(--border-color)',
                                background: gameMode === 'all' ? 'var(--accent-glow)' : 'var(--subtle-bg)',
                                display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer',
                                transition: 'all 0.2s', color: 'inherit'
                            }}
                        >
                            <div style={{ background: 'var(--accent)', padding: '0.8rem', borderRadius: '1rem', color: 'white' }}><InfinityIcon size={24} /></div>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Barchasi</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Barcha fe'llar aralash keladi</div>
                            </div>
                        </button>

                        <button
                            onClick={() => setGameMode('irregular')}
                            style={{
                                padding: '1.5rem', borderRadius: '1.5rem', border: '2px solid',
                                borderColor: gameMode === 'irregular' ? '#f59e0b' : 'var(--border-color)',
                                background: gameMode === 'irregular' ? 'rgba(245, 158, 11, 0.1)' : 'var(--subtle-bg)',
                                display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer',
                                transition: 'all 0.2s', color: 'inherit'
                            }}
                        >
                            <div style={{ background: '#f59e0b', padding: '0.8rem', borderRadius: '1rem', color: 'white' }}><Layers size={24} /></div>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Noto'g'ri fe'llar</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Faqat "Irregular" shakllar</div>
                            </div>
                        </button>

                        <button
                            onClick={() => setGameMode('regular')}
                            style={{
                                padding: '1.5rem', borderRadius: '1.5rem', border: '2px solid',
                                borderColor: gameMode === 'regular' ? '#ef4444' : 'var(--border-color)',
                                background: gameMode === 'regular' ? 'rgba(239, 68, 68, 0.1)' : 'var(--subtle-bg)',
                                display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer',
                                transition: 'all 0.2s', color: 'inherit'
                            }}
                        >
                            <div style={{ background: '#ef4444', padding: '0.8rem', borderRadius: '1rem', color: 'white' }}><Dna size={24} /></div>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>To'g'ri fe'llar</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Faqat "Regular" shakllar</div>
                            </div>
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button onClick={() => navigate('/verbs')} className="btn btn-secondary" style={{ padding: '0.8rem 2rem' }}>Orqaga</button>
                        <button onClick={startGame} className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.3rem', borderRadius: '1rem', boxShadow: '0 5px 25px var(--accent-glow)', fontWeight: 800 }}>BOSHLASH!</button>
                    </div>
                </div>
            </div>
        );
    }

    if (gameState === 'finished') {
        return (
            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="glass-panel" style={{ padding: '3.5rem 2rem', maxWidth: '500px', margin: '0 auto', border: '3px solid var(--accent)', borderRadius: '2rem' }}>
                    <Trophy size={100} color="var(--accent)" style={{ marginBottom: '1.5rem' }} />
                    <h2 style={{ fontSize: '3rem', fontWeight: 950, marginBottom: '1rem' }}>NATIJA</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', margin: '2.5rem 0' }}>
                        <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--subtle-bg)', borderRadius: '1.5rem' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.5rem' }}>Ball</div>
                            <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--accent)' }}>{score}</div>
                        </div>
                        <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--subtle-bg)', borderRadius: '1.5rem' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.5rem' }}>Max Combo</div>
                            <div style={{ fontSize: '3rem', fontWeight: 900, color: '#f59e0b' }}>{maxCombo}</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => navigate('/verbs')} className="btn btn-secondary" style={{ flex: 1, padding: '1rem' }}>Ro'yxatga</button>
                        <button onClick={startGame} className="btn btn-primary" style={{ flex: 1, fontWeight: 700, padding: '1rem' }}>Yana o'ynash</button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }} style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', padding: '0 0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                    {[...Array(3)].map((_, i) => (<Heart key={i} size={30} color="#ef4444" fill={i < lives ? "#ef4444" : "rgba(0,0,0,0.1)"} style={{ transition: 'all 0.3s' }} />))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: timeLeft < 4 ? 'rgba(239, 68, 68, 0.1)' : 'var(--subtle-bg)', padding: '0.6rem 1.2rem', borderRadius: '2rem', color: timeLeft < 4 ? '#ef4444' : 'var(--text-main)', border: timeLeft < 4 ? '1px solid #ef4444' : 'none', transition: 'all 0.3s' }}>
                        <Timer size={22} className={timeLeft < 4 ? "animate-pulse" : ""} /> <span style={{ fontWeight: 900, fontSize: '1.2rem' }}>{timeLeft}</span>
                    </div>
                    {combo >= 2 && (<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(to right, #ff4d4d, #f59e0b)', padding: '0.6rem 1.2rem', borderRadius: '2rem', color: 'white', fontWeight: 950, fontSize: '1rem', boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)' }}> <Flame size={20} fill="white" /> {combo} COMBO </motion.div>)}
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '3.5rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden', borderRadius: '2rem' }}>
                <AnimatePresence mode="wait">
                    <motion.div key={currentVerb.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
                        <div style={{ fontSize: '1rem', color: 'var(--accent)', fontWeight: 850, textTransform: 'uppercase', marginBottom: '0.8rem', letterSpacing: '2px' }}>{currentVerb.translation_uz}</div>
                        <div style={{ fontSize: '5rem', fontWeight: 950, marginBottom: '1rem', position: 'relative', width: 'fit-content', margin: '0 auto' }}>
                            {currentVerb.base}
                            <button onClick={() => soundService.speak(currentVerb.base)} style={{ position: 'absolute', right: -50, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '10px' }}>
                                <Volume2 size={30} />
                            </button>
                        </div>

                        <div style={{ color: 'var(--text-muted)', marginBottom: '3.5rem', fontWeight: 600 }}>Tanlang: V2 | V3</div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            {options.map((opt, idx) => (
                                <motion.button
                                    key={idx}
                                    whileHover={{ scale: 1.03, translateY: -3 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => handleSelect(opt)}
                                    disabled={!!showFeedback}
                                    style={{
                                        padding: '1.5rem 1rem',
                                        borderRadius: '1.5rem',
                                        background: 'var(--subtle-bg)',
                                        border: '2px solid var(--border-color)',
                                        fontSize: '1.3rem',
                                        fontWeight: 800,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.2rem',
                                        color: 'var(--text-main)',
                                        boxShadow: '0 4px 0 var(--border-color)'
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'baseline' }}>
                                        <span style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase' }}>V2:</span>
                                        <span>{opt.v2}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'baseline' }}>
                                        <span style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase' }}>V3:</span>
                                        <span style={{ color: 'var(--accent)' }}>{opt.v3}</span>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <AnimatePresence>
                    {showFeedback && (
                        <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: showFeedback === 'correct' ? 'rgba(34, 197, 94, 0.98)' : 'rgba(239, 68, 68, 0.98)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', borderRadius: '2rem' }}>
                            {showFeedback === 'correct' ? (
                                <> <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}><CheckCircle2 size={140} /></motion.div> <h3 style={{ fontSize: '3rem', fontWeight: 950, marginTop: '2rem' }}>TO'G'RI!</h3> {combo >= 2 && <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffff00' }}>+{combo} Combo Spike!</div>} </>
                            ) : (
                                <> <XCircle size={140} /> <h3 style={{ fontSize: '3rem', fontWeight: 950, marginTop: '2rem' }}>NOTO'G'RI!</h3> <div style={{ marginTop: '2rem', padding: '2rem', background: 'rgba(0,0,0,0.15)', borderRadius: '1.5rem', minWidth: '300px' }}> <div style={{ opacity: 0.7, marginBottom: '0.5rem' }}>To'g'ri shakllar:</div> <div style={{ fontSize: '2.5rem', fontWeight: 950 }}>{currentVerb.past}</div> <div style={{ fontSize: '1.8rem', fontWeight: 700, opacity: 0.9 }}>{currentVerb.pastParticiple}</div> </div> </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                <button onClick={() => setGameState('idle')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem', margin: '0 auto', fontSize: '1.1rem', fontWeight: 600 }}> <ChevronLeft size={22} /> O'yinni to'xtatish </button>
            </div>
        </motion.div>
    );
};
