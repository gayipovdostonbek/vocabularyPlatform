import React, { useState } from 'react';
import { authService } from '../api/authService';
import { LogIn, UserPlus, Mail, Lock, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                await authService.signIn(email, password);
            } else {
                await authService.signUp(email, password);
            }
        } catch (err: any) {
            setError(err.message || 'Xatolik yuz berdi. Qayta urinib ko\'ring.');
        } finally {
            setLoading(false);
        }
    };

    const shakeAnimation = {
        shake: {
            x: [0, -10, 10, -10, 10, 0],
            transition: { duration: 0.4 }
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '85vh', padding: '1.5rem' }}>
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel"
                style={{
                    padding: 'clamp(1.25rem, 5vw, 2.5rem)',
                    width: '95%',
                    maxWidth: '440px',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <motion.div
                        initial={{ scale: 0.5, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        style={{
                            width: '72px',
                            height: '72px',
                            background: 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)',
                            borderRadius: '20px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: '0 auto 1.5rem auto',
                            boxShadow: '0 12px 24px rgba(139, 92, 246, 0.3)',
                            color: 'white'
                        }}
                    >
                        {isLogin ? <LogIn size={36} /> : <UserPlus size={36} />}
                    </motion.div>

                    <h2 style={{ marginBottom: '0.5rem', fontSize: '2.2rem', fontWeight: 800, background: 'var(--title-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {isLogin ? 'Xush Kelibsiz' : 'Hisob Yarating'}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        {isLogin ? 'Davom etish uchun hisobingizga kiring' : 'Lug\'at boyligingizni oshirishni boshlang'}
                    </p>
                </div>

                {/* Error Pulse */}
                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            variants={shakeAnimation}
                            animate="shake"
                            initial={{ opacity: 0, y: -10 }}
                            exit={{ opacity: 0, y: -10 }}
                            style={{
                                background: 'rgba(239, 68, 68, 0.05)',
                                border: '1px solid rgba(239, 68, 68, 0.1)',
                                color: 'var(--error)',
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                marginBottom: '1.5rem',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}
                        >
                            <AlertCircle size={20} />
                            <span style={{ fontWeight: 500 }}>{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                        <input
                            type="email"
                            className="input-field"
                            placeholder="Email manzilingiz"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ paddingLeft: '3.2rem', height: '3.5rem', margin: 0 }}
                            required
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                        <input
                            type={showPassword ? "text" : "password"}
                            className="input-field"
                            placeholder="Parolingiz"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ paddingLeft: '3.2rem', paddingRight: '3.5rem', height: '3.5rem', margin: 0 }}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{
                            width: '100%',
                            height: '3.5rem',
                            fontSize: '1.1rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '0.75rem',
                            marginTop: '0.5rem'
                        }}
                    >
                        {loading ? (
                            <Loader2 size={24} className="spin" />
                        ) : (
                            <>
                                {isLogin ? <LogIn size={22} /> : <UserPlus size={22} />}
                                {isLogin ? 'Kirish' : 'Ro\'yxatdan o\'tish'}
                            </>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        {isLogin ? "Hisobingiz yo'qmi?" : "Hisobingiz bormi?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--accent)',
                                fontWeight: 700,
                                cursor: 'pointer',
                                marginLeft: '0.5rem',
                                textDecoration: 'underline',
                                textUnderlineOffset: '4px'
                            }}
                        >
                            {isLogin ? "Ro'yxatdan o'tish" : "Kirish"}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
