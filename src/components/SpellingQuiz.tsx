import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Check, ArrowRight, Keyboard } from 'lucide-react';
import type { Word } from '../types';
import { soundService } from '../api/soundService';
import confetti from 'canvas-confetti';

interface SpellingQuizProps {
    word: Word;
    onResult: (word: Word, known: boolean) => void;
}

export const SpellingQuiz: React.FC<SpellingQuizProps> = ({ word, onResult }) => {
    const [input, setInput] = useState('');
    const [status, setStatus] = useState<'typing' | 'correct' | 'incorrect'>('typing');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.code === 'Space') {
                e.preventDefault();
                soundService.speak(word.english);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [word.english]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
        // Play sound automatically on load
        const timer = setTimeout(() => soundService.speak(word.english), 500);
        return () => clearTimeout(timer);
    }, [word.id]);

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (status !== 'typing' || !input.trim()) return;

        const isCorrect = input.trim().toLowerCase() === word.english.toLowerCase();

        if (isCorrect) {
            setStatus('correct');
            soundService.playSuccess();
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.7 },
                colors: ['#22c55e', '#3b82f6', '#f59e0b']
            });
        } else {
            setStatus('incorrect');
            soundService.playFailure();
        }

        setTimeout(() => {
            onResult(word, isCorrect);
            setInput('');
            setStatus('typing');
        }, 2000);
    };

    return (
        <div className="spelling-container animate-fade-in" style={{ width: '100%', maxWidth: '600px', margin: '2rem auto' }}>
            <motion.div
                className="glass-panel"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ padding: '3rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
            >
                {/* Background Decoration */}
                <div style={{ position: 'absolute', top: -50, right: -50, opacity: 0.05, transform: 'rotate(15deg)' }}>
                    <Keyboard size={200} />
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                        <div style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            padding: '1rem',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                            onClick={() => soundService.speak(word.english)}
                            title="Qayta eshitish"
                        >
                            <Volume2 size={32} style={{ color: '#3b82f6' }} />
                        </div>
                    </div>

                    <div style={{ marginBottom: '2.5rem' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.5rem' }}>TARJIMA</span>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>{word.uzbek}</h2>
                    </div>

                    <form onSubmit={handleSubmit} style={{ position: 'relative', maxWidth: '400px', margin: '0 auto' }}>
                        <input
                            ref={inputRef}
                            className="modern-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={status !== 'typing'}
                            placeholder="So'zni yozing..."
                            autoComplete="off"
                            autoFocus
                            style={{
                                fontSize: '1.5rem',
                                textAlign: 'center',
                                padding: '1.25rem',
                                height: 'auto',
                                background: 'rgba(15, 23, 42, 0.6)',
                                border: `2px solid ${status === 'correct' ? 'var(--success)' : status === 'incorrect' ? 'var(--error)' : 'rgba(255,255,255,0.1)'}`,
                                borderRadius: '1rem',
                                color: status === 'correct' ? 'var(--success)' : status === 'incorrect' ? 'var(--error)' : 'var(--text-main)',
                                boxShadow: status !== 'typing' ? `0 0 20px ${status === 'correct' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}` : 'none',
                                transition: 'all 0.3s'
                            }}
                        />

                        {status === 'typing' && input.trim() && (
                            <motion.button
                                initial={{ opacity: 0, x: -10, y: '-50%' }}
                                animate={{ opacity: 1, x: 0, y: '-50%' }}
                                type="submit"
                                style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    top: '50%',
                                    background: 'var(--accent)',
                                    border: 'none',
                                    borderRadius: '0.75rem',
                                    width: '2.5rem',
                                    height: '2.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px var(--accent-glow)'
                                }}
                            >
                                <ArrowRight size={20} />
                            </motion.button>
                        )}
                    </form>

                    <AnimatePresence mode="wait">
                        {status === 'incorrect' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '1rem', border: '1px solid rgba(34, 197, 94, 0.2)' }}
                            >
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>To'g'ri javob:</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)', letterSpacing: '1px' }}>{word.english}</div>
                            </motion.div>
                        )}

                        {status === 'correct' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{ marginTop: '2rem', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                <Check size={24} /> <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>Barakalla!</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            <div style={{ marginTop: '2rem', textAlign: 'center', opacity: 0.6, fontSize: '0.9rem' }}>
                <p>Eshitish uchun <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Ctrl</kbd> + <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Space</kbd> bosing</p>
            </div>
        </div>
    );
};
