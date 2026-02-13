import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

interface SettingsProps {
    dailyGoal: number;
    onUpdateGoal: (newGoal: number) => void;
}

export const Settings: React.FC<SettingsProps> = ({ dailyGoal, onUpdateGoal }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
            <button
                className="btn btn-secondary"
                onClick={() => navigate('/')}
                style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
                <ArrowLeft size={18} /> {t('settings.backToDashboard')}
            </button>

            <div className="glass-panel" style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>{t('settings.dailyGoal')}</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{t('settings.dailyGoalDesc')}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => onUpdateGoal(Math.max(1, dailyGoal - 5))}
                        style={{ width: '40px', height: '40px', padding: 0 }}
                    >
                        -
                    </button>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, minWidth: '80px' }}>{dailyGoal}</div>
                    <button
                        className="btn btn-secondary"
                        onClick={() => onUpdateGoal(dailyGoal + 5)}
                        style={{ width: '40px', height: '40px', padding: 0 }}
                    >
                        +
                    </button>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/')} style={{ width: '100%' }}>{t('settings.saveAndBack')}</button>
            </div>
        </div>
    );
};
