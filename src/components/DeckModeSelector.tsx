import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Award, Mic, Calculator } from 'lucide-react';

interface DeckModeSelectorProps {
    category: string | null;
    onClose: () => void;
    onSelectMode: (mode: 'flashcard' | 'quiz' | 'spelling' | 'speaking') => void;
}

export const DeckModeSelector: React.FC<DeckModeSelectorProps> = ({ category, onClose, onSelectMode }) => {
    if (!category) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'var(--overlay-bg)',
                    backdropFilter: 'blur(5px)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={e => e.stopPropagation()}
                    className="glass-panel"
                    style={{
                        width: '100%',
                        maxWidth: '500px',
                        padding: '2rem',
                        border: '1px solid var(--border-color)',
                        background: 'var(--glass-bg)',
                        position: 'relative'
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={24} />
                    </button>

                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>MAVZU</div>
                        <h2 style={{ fontSize: '2rem', margin: '0.5rem 0 0 0', color: 'var(--text-main)' }}>{category}</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <button
                            className="mode-btn"
                            onClick={() => onSelectMode('flashcard')}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.5rem', background: 'var(--subtle-bg)', border: '1px solid var(--border-color)', borderRadius: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            <Play size={32} color="var(--accent)" />
                            <span style={{ fontWeight: 600 }}>Flashcard</span>
                        </button>

                        <button
                            className="mode-btn"
                            onClick={() => onSelectMode('quiz')}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.5rem', background: 'var(--subtle-bg)', border: '1px solid var(--border-color)', borderRadius: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            <Award size={32} color="var(--success)" />
                            <span style={{ fontWeight: 600 }}>Quiz</span>
                        </button>

                        <button
                            className="mode-btn"
                            onClick={() => onSelectMode('spelling')}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.5rem', background: 'var(--subtle-bg)', border: '1px solid var(--border-color)', borderRadius: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            <Calculator size={32} color="#3b82f6" /> {/* Using Calculator as generic icon for now or Keyboard */}
                            <span style={{ fontWeight: 600 }}>Spelling</span>
                        </button>

                        <button
                            className="mode-btn"
                            onClick={() => onSelectMode('speaking')}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.5rem', background: 'var(--subtle-bg)', border: '1px solid var(--border-color)', borderRadius: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            <Mic size={32} color="#f59e0b" />
                            <span style={{ fontWeight: 600 }}>Speaking</span>
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
