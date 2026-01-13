import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Repeat, CheckCircle } from 'lucide-react';
import type { Word } from '../types';
import confetti from 'canvas-confetti';

interface FlashcardProps {
    word: Word;
    onResult: (word: Word, known: boolean) => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({ word, onResult }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => setIsFlipped(!isFlipped);

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
        <div style={{ perspective: 1000, width: '100%', maxWidth: '400px', height: '300px', margin: '2rem auto', cursor: 'pointer' }} onClick={handleFlip}>
            <motion.div
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
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
                        background: 'linear-gradient(135deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%)'
                    }}
                >
                    <span style={{ fontSize: '0.9rem', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '2px' }}>English</span>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>{word.english}</h2>
                    <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Click to flip</p>
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
                        background: 'linear-gradient(135deg, rgba(76,29,149,0.8) 0%, rgba(15,23,42,0.95) 100%)'
                    }}
                >
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '2px' }}>Translation</span>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: '#e2e8f0' }}>{word.uzbek}</h2>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
                        <button
                            className="btn btn-secondary"
                            onClick={handleStudyAgain}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', border: 'none', color: '#ff8a8a' }}
                        >
                            <Repeat size={18} /> Hard
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleKnown}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--success)', boxShadow: '0 0 20px rgba(16,185,129,0.4)' }}
                        >
                            <CheckCircle size={18} /> I Know It
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
