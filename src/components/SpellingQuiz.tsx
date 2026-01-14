import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Check, X, ArrowRight } from 'lucide-react';
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
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [word.id]);

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (status !== 'typing' || !input.trim()) return;

        const isCorrect = input.trim().toLowerCase() === word.english.toLowerCase();

        if (isCorrect) {
            setStatus('correct');
            soundService.playSuccess();
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.7 }
            });
        } else {
            setStatus('incorrect');
            soundService.playFailure();
        }

        setTimeout(() => {
            onResult(word, isCorrect);
            setInput('');
            setStatus('typing');
        }, 1500);
    };

    return (
        <div className="spelling-container" style={{ width: '100%', maxWidth: '500px', margin: '2rem auto' }}>
            <motion.div
                className="glass-panel"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ padding: '2.5rem', textAlign: 'center', position: 'relative' }}
            >
                <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                    <button
                        onClick={() => speak(word.english)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: '0.5rem' }}
                        title="Eshitish"
                    >
                        <Volume2 size={24} />
                    </button>
                </div>

                <span style={{ fontSize: '0.9rem', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '2px', display: 'block' }}>O'zbekcha</span>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 2rem 0', color: 'var(--text-main)' }}>{word.uzbek}</h2>

                <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
                    <input
                        ref={inputRef}
                        className="input-field"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={status !== 'typing'}
                        placeholder="Inglizchasini yozing..."
                        autoComplete="off"
                        autoFocus
                        style={{
                            fontSize: '1.25rem',
                            textAlign: 'center',
                            padding: '1rem 3rem 1rem 1rem',
                            height: '4rem',
                            borderColor: status === 'correct' ? 'var(--success)' : status === 'incorrect' ? 'var(--error)' : 'var(--border-color)',
                            boxShadow: status === 'correct' ? '0 0 15px rgba(34, 197, 94, 0.2)' : status === 'incorrect' ? '0 0 15px rgba(239, 68, 68, 0.2)' : 'none',
                            transition: 'all 0.3s'
                        }}
                    />

                    <button
                        type="submit"
                        disabled={status !== 'typing' || !input.trim()}
                        style={{
                            position: 'absolute',
                            right: '0.75rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'var(--accent)',
                            border: 'none',
                            borderRadius: '0.5rem',
                            width: '2.5rem',
                            height: '2.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            cursor: 'pointer',
                            opacity: input.trim() ? 1 : 0.5
                        }}
                    >
                        <ArrowRight size={20} />
                    </button>
                </form>

                <AnimatePresence>
                    {status === 'incorrect' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ marginTop: '1.5rem', color: 'var(--success)', fontWeight: 600 }}
                        >
                            To'g'ri javob: <span style={{ fontSize: '1.2rem' }}>{word.english}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: status === 'correct' ? 'var(--success)' : 'var(--text-muted)' }}>
                        <Check size={20} /> <span style={{ fontSize: '0.9rem' }}>To'g'ri</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: status === 'incorrect' ? 'var(--error)' : 'var(--text-muted)' }}>
                        <X size={20} /> <span style={{ fontSize: '0.9rem' }}>Xato</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
