import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: 'uz', name: 'O\'zbekcha', flag: '🇺🇿' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺' },
        { code: 'en', name: 'English', flag: '🇺🇸' }
    ];

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

    const changeLanguage = (code: string) => {
        i18n.changeLanguage(code);
        setIsOpen(false);
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div style={{ position: 'relative' }} ref={dropdownRef}>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.6rem 1rem',
                    background: 'var(--subtle-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '1rem',
                    cursor: 'pointer',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isOpen ? '0 0 15px var(--accent-glow)' : 'none',
                    borderColor: isOpen ? 'var(--accent)' : 'var(--border-color)'
                }}
            >
                <Globe size={18} style={{ color: 'var(--accent)' }} />
                <span>{currentLang.flag}</span>
                <span style={{ textTransform: 'uppercase' }}>{currentLang.code}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ display: 'flex', alignItems: 'center' }}
                >
                    <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 0.5rem)',
                            right: 0,
                            minWidth: '180px',
                            background: 'var(--glass-bg)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '1.25rem',
                            padding: '0.5rem',
                            zIndex: 1001,
                            boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
                            overflow: 'hidden'
                        }}
                    >
                        {languages.map((lang) => (
                            <motion.button
                                key={lang.code}
                                whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                onClick={() => changeLanguage(lang.code)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '0.8rem 1rem',
                                    border: 'none',
                                    background: i18n.language === lang.code ? 'linear-gradient(90deg, var(--accent) 0%, transparent 100%)' : 'transparent',
                                    borderRadius: '0.75rem',
                                    cursor: 'pointer',
                                    color: i18n.language === lang.code ? 'white' : 'var(--text-main)',
                                    fontSize: '0.95rem',
                                    fontWeight: i18n.language === lang.code ? 800 : 600,
                                    textAlign: 'left',
                                    transition: 'color 0.2s'
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>{lang.flag}</span>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '0.9rem' }}>{lang.name}</span>
                                    <span style={{ fontSize: '0.7rem', color: i18n.language === lang.code ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)', textTransform: 'uppercase' }}>{lang.code}</span>
                                </div>
                                {i18n.language === lang.code && (
                                    <motion.div
                                        layoutId="active-dot"
                                        style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: 'white' }}
                                    />
                                )}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}; 
