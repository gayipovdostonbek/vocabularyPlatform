import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Repeat, CheckCircle, Volume2 } from 'lucide-react';
import type { Word } from '../types';
import confetti from 'canvas-confetti';

interface FlashcardProps {
    word: Word;
    onResult: (word: Word, known: boolean) => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({ word, onResult }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => setIsFlipped(!isFlipped);

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    const handleKnown = (e: React.MouseEvent) => {
        e.stopPropagation();
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        onResult(word, true);
        setIsFlipped(false); // Reset for next card
    };

    const handleStudyAgain = (e: React.MouseEvent) => {
        e.stopPropagation();
        onResult(word, false);
        setIsFlipped(false);
    };

    return (
        <div className="flashcard-container" style={{ perspective: '1000px', width: '100%', height: '400px', margin: '2rem auto', cursor: 'pointer' }} onClick={handleFlip}>
            <motion.div
                className="flashcard"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* Front */}
                <div
                    className="glass-panel"
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: 'var(--card-front-bg)'
                    }}
                >
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                        <button
                            onClick={(e) => { e.stopPropagation(); speak(word.english); }}
                            style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: '0.5rem' }}
                            title="Listen"
                        >
                            <Volume2 size={24} />
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem' }}>
                        {[0, 1, 2, 3].map((lvl) => (
                            <div
                                key={lvl}
                                style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    background: (word.masteryLevel || 0) > lvl ? 'var(--success)' : 'var(--subtle-bg)',
                                    boxShadow: (word.masteryLevel || 0) > lvl ? '0 0 10px var(--success)' : 'none'
                                }}
                            />
                        ))}
                    </div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '2px' }}>Inglizcha</span>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>{word.english}</h2>
                    <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Kartani aylantirish uchun bosing</p>
                </div>

                {/* Back */}
                <div
                    className="glass-panel"
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: 'var(--card-back-bg)',
                        padding: '2rem'
                    }}
                >
                    <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '2px' }}>Tarjimasi</span>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: '#ffffff', textAlign: 'center' }}>{word.uzbek}</h2>

                    {word.example && (
                        <div style={{
                            marginTop: '2rem',
                            padding: '1rem',
                            background: 'var(--card-subtle-bg)',
                            borderRadius: '0.75rem',
                            width: '100%',
                            textAlign: 'center',
                            borderLeft: '4px solid var(--accent)',
                            position: 'relative'
                        }}>
                            <button
                                onClick={(e) => { e.stopPropagation(); speak(word.example!); }}
                                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}
                                title="Gapni eshitish"
                            >
                                <Volume2 size={16} />
                            </button>
                            <p style={{ margin: 0, fontSize: '1.1rem', color: '#ffffff', fontStyle: 'italic' }}>"{word.example}"</p>
                            {word.exampleTranslation && (
                                <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>{word.exampleTranslation}</p>
                            )}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
                        <button
                            className="btn btn-secondary"
                            onClick={handleStudyAgain}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--card-subtle-bg)', border: 'none', color: '#ffabab' }}
                        >
                            <Repeat size={18} /> Qiyin
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleKnown}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--success)', boxShadow: '0 0 20px rgba(16,185,129,0.4)' }}
                        >
                            <CheckCircle size={18} /> Yodladim
                        </button>
                    </div>
                </div>
            </motion.div>
            <style>{`
                @media (max-width: 768px) {
                    .flashcard-container { height: 350px !important; }
                    .flashcard h2 { font-size: 2rem !important; }
                }
                @media (max-width: 480px) {
                    .flashcard-container { height: 320px !important; }
                }
            `}</style>
        </div>
    );
};
