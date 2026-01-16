import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Check, AlertCircle, Volume2 } from 'lucide-react';
import type { Word } from '../types';
import { soundService } from '../api/soundService';
import confetti from 'canvas-confetti';

interface SpeakingQuizProps {
    word: Word;
    onResult: (word: Word, known: boolean) => void;
}

// Extend window for SpeechRecognition
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export const SpeakingQuiz: React.FC<SpeakingQuizProps> = ({ word, onResult }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'correct' | 'incorrect'>('idle');
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'en-US';
            recognition.interimResults = true;

            recognition.onstart = () => {
                setIsListening(true);
                setStatus('listening');
                setError(null);
            };

            recognition.onresult = (event: any) => {
                const current = event.resultIndex;
                const transcriptText = event.results[current][0].transcript;
                setTranscript(transcriptText);
            };

            recognition.onerror = (event: any) => {
                console.error("Speech error", event.error);
                if (event.error === 'not-allowed') {
                    setError("Mikrofonga ruxsat berilmagan. Sozlamalarni tekshiring.");
                } else if (event.error === 'no-speech') {
                    setError("Ovoz eshitilmadi. Qayta urinib ko'ring.");
                } else {
                    setError("Xatolik yuz berdi: " + event.error);
                }
                setIsListening(false);
                setStatus('idle');
            };

            recognition.onend = () => {
                setIsListening(false);
                if (status === 'listening' && transcript) {
                    validateAnswer(transcript);
                } else if (status === 'listening' && !transcript) {
                    setStatus('idle');
                }
            };

            recognitionRef.current = recognition;
        } else {
            setError("Brazueringiz ovozli qidiruvni qo'llab-quvvatlamaydi.");
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    // Reset state when word changes
    useEffect(() => {
        setTranscript('');
        setStatus('idle');
        setError(null);
        if (recognitionRef.current) {
            recognitionRef.current.abort();
        }
    }, [word.id]);


    const startListening = () => {
        if (recognitionRef.current && status === 'idle') {
            setTranscript('');
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error(e);
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    };

    const validateAnswer = (spokenText: string) => {
        setStatus('processing');

        // Clean up text
        const cleanSpoken = spokenText.trim().toLowerCase().replace(/[.,!?:;]/g, '');
        const cleanTarget = word.english.trim().toLowerCase().replace(/[.,!?:;]/g, '');

        // Simple fuzzy logic could be added here, currently strict + basic normalization
        const isCorrect = cleanSpoken === cleanTarget;

        if (isCorrect) {
            setStatus('correct');
            soundService.playSuccess();
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.7 },
                colors: ['#22c55e', '#3b82f6', '#f59e0b']
            });
            setTimeout(() => {
                onResult(word, true);
            }, 2000);
        } else {
            setStatus('incorrect');
            soundService.playFailure();
            setTimeout(() => {
                onResult(word, false);
            }, 2500);
        }
    };

    return (
        <div className="speaking-container animate-fade-in" style={{ width: '100%', maxWidth: '600px', margin: '2rem auto' }}>
            <motion.div
                className="glass-panel"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ padding: '3rem 2rem', textAlign: 'center', position: 'relative' }}
            >
                <div style={{ marginBottom: '2.5rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.5rem' }}>TARJIMA QILING VA AYTING</span>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>{word.uzbek}</h2>
                </div>

                <div style={{ minHeight: '60px', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {transcript ? (
                        <div style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--accent)' }}>"{transcript}"</div>
                    ) : (
                        <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>...</div>
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={isListening ? stopListening : startListening}
                        disabled={status === 'processing' || status === 'correct' || status === 'incorrect'}
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: isListening ? 'var(--error)' : 'var(--accent)',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            cursor: status === 'processing' ? 'not-allowed' : 'pointer',
                            boxShadow: isListening ? '0 0 30px rgba(239, 68, 68, 0.5)' : '0 10px 30px var(--accent-glow)',
                            transition: 'all 0.3s'
                        }}
                    >
                        {isListening ? <MicOff size={32} /> : <Mic size={32} />}
                    </motion.button>
                </div>

                {error && (
                    <div style={{ color: 'var(--error)', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {status === 'correct' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ marginTop: '1rem', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        >
                            <Check size={24} /> <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>Juda yaxshi!</span>
                        </motion.div>
                    )}

                    {status === 'incorrect' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ marginTop: '1rem' }}
                        >
                            <div style={{ color: 'var(--error)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Noto'g'ri talaffuz</div>
                            <div style={{ color: 'var(--text-muted)' }}>To'g'ri javob: <span style={{ color: 'var(--success)', fontWeight: 700 }}>{word.english}</span></div>
                            <button
                                onClick={() => soundService.speak(word.english)}
                                style={{
                                    marginTop: '1rem',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '0.5rem',
                                    color: '#3b82f6',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <Volume2 size={16} /> Eshitib ko'rish
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.div>
            <div style={{ marginTop: '2rem', textAlign: 'center', opacity: 0.6, fontSize: '0.9rem' }}>
                <p>Mikrofon tugmasini bosing va so'zni ingliz tilida aniq talaffuz qiling</p>
            </div>
        </div>
    );
};
