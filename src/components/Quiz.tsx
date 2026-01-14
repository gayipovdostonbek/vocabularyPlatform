import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Check, X } from 'lucide-react';
import type { Word } from '../types';
import { soundService } from '../api/soundService';
import confetti from 'canvas-confetti';

interface QuizProps {
    word: Word;
    allWords: Word[];
    onResult: (word: Word, known: boolean) => void;
}

export const Quiz: React.FC<QuizProps> = ({ word, allWords, onResult }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const options = useMemo(() => {
        // Correct answer
        const correct = { id: word.id, text: word.uzbek, isCorrect: true };

        // Get distractors (excluding the current word)
        const distractors = allWords
            .filter(w => w.id !== word.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(w => ({ id: w.id, text: w.uzbek, isCorrect: false }));

        // Combine and shuffle
        return [correct, ...distractors].sort(() => Math.random() - 0.5);
    }, [word.id, allWords]);

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    const handleSelect = (option: { id: string, text: string, isCorrect: boolean }) => {
        if (selectedId) return; // Prevent double clicking

        setSelectedId(option.id);
        setIsCorrect(option.isCorrect);

        if (option.isCorrect) {
            soundService.playSuccess();
            confetti({
                particleCount: 80,
                spread: 60,
                origin: { y: 0.7 }
            });
        } else {
            soundService.playFailure();
        }

        // Wait a bit to show the result before moving to next
        setTimeout(() => {
            onResult(word, option.isCorrect);
            setSelectedId(null);
            setIsCorrect(null);
        }, 1200);
    };

    return (
        <div className="quiz-container" style={{ width: '100%', maxWidth: '500px', margin: '2rem auto' }}>
            <motion.div
                className="glass-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
            >
                {/* Status Indicator Overlays */}
                <AnimatePresence>
                    {isCorrect === true && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ position: 'absolute', inset: 0, background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, pointerEvents: 'none' }}
                        >
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1.5 }}>
                                <Check size={80} color="var(--success)" />
                            </motion.div>
                        </motion.div>
                    )}
                    {isCorrect === false && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ position: 'absolute', inset: 0, background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, pointerEvents: 'none' }}
                        >
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1.5 }}>
                                <X size={80} color="var(--error)" />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                    <button
                        onClick={() => speak(word.english)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: '0.5rem' }}
                    >
                        <Volume2 size={24} />
                    </button>
                </div>

                <span style={{ fontSize: '0.9rem', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '2px', display: 'block' }}>Tanlang</span>
                <h2 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 2.5rem 0', color: 'var(--text-main)' }}>{word.english}</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                    {options.map((option) => {
                        const isSelected = selectedId === option.id;
                        let bg = 'var(--subtle-bg)';
                        let color = 'var(--text-main)';
                        let border = '1px solid var(--border-color)';

                        if (isSelected) {
                            bg = option.isCorrect ? 'var(--success)' : 'var(--error)';
                            color = '#ffffff';
                            border = 'none';
                        } else if (selectedId && option.isCorrect) {
                            // Highlight correct answer if user got it wrong
                            bg = 'rgba(34, 197, 94, 0.2)';
                            border = '2px solid var(--success)';
                        }

                        return (
                            <motion.button
                                key={option.id}
                                whileHover={!selectedId ? { scale: 1.02, background: 'var(--accent)', color: '#ffffff' } : {}}
                                whileTap={!selectedId ? { scale: 0.98 } : {}}
                                onClick={() => handleSelect(option)}
                                disabled={!!selectedId}
                                style={{
                                    padding: '1.25rem',
                                    borderRadius: '1rem',
                                    border,
                                    background: bg,
                                    color,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    cursor: selectedId ? 'default' : 'pointer',
                                    transition: 'all 0.2s',
                                    position: 'relative'
                                }}
                            >
                                {option.text}
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
};
