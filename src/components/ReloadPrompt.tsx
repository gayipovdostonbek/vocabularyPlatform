import { useRegisterSW } from 'virtual:pwa-register/react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X } from 'lucide-react';

export const ReloadPrompt = () => {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered: ' + r);
        },
        onRegisterError(error) {
            console.log('SW registration error', error);
        },
    });

    const close = () => {
        setOfflineReady(false);
        setNeedRefresh(false);
    };

    return (
        <AnimatePresence>
            {(offlineReady || needRefresh) && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="glass-panel"
                    style={{
                        position: 'fixed',
                        bottom: '2rem',
                        right: '2rem',
                        padding: '1rem',
                        zIndex: 10000,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        maxWidth: '350px',
                        border: '1px solid var(--accent)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}
                >
                    <div style={{ flex: 1 }}>
                        {offlineReady ? (
                            <span style={{ fontSize: '0.9rem' }}>App oflayn ishlashga tayyor!</span>
                        ) : (
                            <span style={{ fontSize: '0.9rem' }}>Yangi versiya mavjud!</span>
                        )}
                    </div>

                    {needRefresh && (
                        <button
                            onClick={() => updateServiceWorker(true)}
                            style={{
                                background: 'var(--accent)',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <RefreshCw size={14} /> Yangilash
                        </button>
                    )}

                    <button
                        onClick={close}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            display: 'flex'
                        }}
                    >
                        <X size={18} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
