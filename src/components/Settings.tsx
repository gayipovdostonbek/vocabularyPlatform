import { useTranslation } from 'react-i18next';
import { Lock, Loader2, CheckCircle, AlertCircle, Eye, EyeOff, Target, ShieldCheck, Minus, Plus } from 'lucide-react';
import { authService } from '../api/authService';
import { auth } from '../firebaseConfig';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsProps {
    dailyGoal: number;
    onUpdateGoal: (newGoal: number) => void;
}

export const Settings: React.FC<SettingsProps> = ({ dailyGoal, onUpdateGoal }) => {
    const { t } = useTranslation();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'security'>('general');

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Parollar mos kelmadi');
            return;
        }
        if (newPassword.length < 6) {
            setError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            setError('Foydalanuvchi topilmadi');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await authService.changePassword(user, newPassword);
            setSuccess(true);
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            console.error('Password change error:', err);
            if (err.code === 'auth/requires-recent-login') {
                setError('Xavfsizlik yuzasidan, parolni o\'zgartirish uchun qaytadan tizimga kirishingiz kerak.');
            } else {
                setError(err.message || 'Xatolik yuz berdi');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ paddingTop: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0, fontSize: '1.5rem', background: 'var(--title-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>
                    {t('settings.title')}
                </h1>
            </div>

            <div className="tab-container" style={{ marginBottom: '2rem', width: '100%' }}>
                <button
                    className={`tab-item ${activeTab === 'general' ? 'active' : ''}`}
                    onClick={() => setActiveTab('general')}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <Target size={18} />
                        <span>Umumiy</span>
                    </div>
                </button>
                <button
                    className={`tab-item ${activeTab === 'security' ? 'active' : ''}`}
                    onClick={() => setActiveTab('security')}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <ShieldCheck size={18} />
                        <span>Xavfsizlik</span>
                    </div>
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'general' ? (
                    <motion.div
                        key="general"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="glass-panel"
                        style={{ padding: '2rem', textAlign: 'center' }}
                    >
                        <h2 style={{ marginBottom: '1.5rem' }}>{t('settings.dailyGoal')}</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{t('settings.dailyGoalDesc')}</p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
                            <button
                                className="interactable"
                                onClick={() => onUpdateGoal(Math.max(1, dailyGoal - 5))}
                                style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '1.25rem',
                                    background: 'var(--subtle-bg)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-main)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                                }}
                            >
                                <Minus size={24} />
                            </button>

                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-2px', lineHeight: 1 }}>{dailyGoal}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5rem' }}>so'z/kun</div>
                            </div>

                            <button
                                className="interactable"
                                onClick={() => onUpdateGoal(dailyGoal + 5)}
                                style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '1.25rem',
                                    background: 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)',
                                    border: 'none',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: '0 10px 15px -3px rgba(124, 58, 237, 0.3)'
                                }}
                            >
                                <Plus size={24} />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="security"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="glass-panel"
                        style={{ padding: '2rem', textAlign: 'left' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <Lock size={24} className="icon-main" style={{ color: 'var(--accent)' }} />
                            <h2 style={{ margin: 0 }}>Hisob xavfsizligi</h2>
                        </div>

                        {error && (
                            <div style={{
                                background: 'rgba(244, 63, 94, 0.1)',
                                border: '1px solid var(--error)',
                                color: 'var(--error)',
                                padding: '0.75rem',
                                borderRadius: '0.75rem',
                                marginBottom: '1rem',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        {success && (
                            <div style={{
                                background: 'rgba(16, 185, 129, 0.1)',
                                border: '1px solid var(--success)',
                                color: 'var(--success)',
                                padding: '0.75rem',
                                borderRadius: '0.75rem',
                                marginBottom: '1rem',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <CheckCircle size={18} />
                                Parol muvaffaqiyatli o'zgartirildi!
                            </div>
                        )}

                        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Yangi parol</label>
                                <div className="input-group">
                                    <Lock size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="modern-input"
                                        placeholder="Kamida 6 belgi"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Parolni tasdiqlang</label>
                                <div className="input-group">
                                    <Lock size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="modern-input"
                                        placeholder="Parolni qayta kiriting"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                                style={{ width: '100%', marginTop: '0.5rem' }}
                            >
                                {loading ? <Loader2 size={20} className="spin" /> : 'Parolni yangilash'}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
