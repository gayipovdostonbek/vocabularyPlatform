import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ShoppingBag, Check, Palette } from 'lucide-react';
import type { UserProfile } from '../types';

interface ShopModalProps {
    userProfile: UserProfile;
    onClose: () => void;
    onBuy: (itemId: string, price: number, type: 'theme' | 'avatar') => void;
    onEquip: (itemId: string, type: 'theme' | 'avatar') => void;
}

const ITEMS = [
    { id: 'theme-ocean', name: 'Okean', type: 'theme', price: 100, color: '#0ea5e9', description: 'Tinchlantiruvchi dengiz ranglari' },
    { id: 'theme-forest', name: 'O\'rmon', type: 'theme', price: 150, color: '#22c55e', description: 'Tabiat nafasini his eting' },
    { id: 'theme-sunset', name: 'Quyosh botishi', type: 'theme', price: 200, color: '#f59e0b', description: 'Iliq va yorqin ranglar' },
    { id: 'theme-cyber', name: 'Cyberpunk', type: 'theme', price: 500, color: '#d946ef', description: 'Kelajak uslubidagi neon' },
    { id: 'avatar-cat', name: '🐱 Mushuk', type: 'avatar', price: 50, emoji: '🐱', description: 'Sevimli mushuk' },
    { id: 'avatar-dog', name: '🐶 It', type: 'avatar', price: 50, emoji: '🐶', description: 'Sodiq do\'st' },
    { id: 'avatar-robot', name: '🤖 Robot', type: 'avatar', price: 100, emoji: '🤖', description: 'Texnologiya sevuvchi' },
    { id: 'avatar-alien', name: '👽 Alien', type: 'avatar', price: 150, emoji: '👽', description: 'Kosmosdan mehmon' },
    { id: 'avatar-ninja', name: '🥷 Ninja', type: 'avatar', price: 200, emoji: '🥷', description: 'Sirli jangchi' },
    { id: 'avatar-wizard', name: '🧙 Sehrgar', type: 'avatar', price: 300, emoji: '🧙', description: 'Sehrli kuchlar egasi' },
];

export const ShopModal: React.FC<ShopModalProps> = ({ userProfile, onClose, onBuy, onEquip }) => {
    const [activeTab, setActiveTab] = useState<'themes' | 'avatars'>('themes');

    const handleAction = (item: typeof ITEMS[0]) => {
        const isOwned = userProfile.inventory.includes(item.id);
        const isEquipped = item.type === 'theme'
            ? userProfile.activeTheme === item.id
            : userProfile.activeAvatar === item.id;

        if (isOwned) {
            if (!isEquipped) {
                onEquip(item.id, item.type as 'theme' | 'avatar');
            }
        } else {
            if (userProfile.coins >= item.price) {
                onBuy(item.id, item.price, item.type as 'theme' | 'avatar');
            } else {
                alert("Tangalar yetarli emas!");
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
                zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
            }}
        >
            <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                className="glass-panel"
                style={{
                    width: '100%', maxWidth: '600px', height: '80vh', display: 'flex', flexDirection: 'column',
                    background: 'var(--glass-bg)', border: '1px solid var(--border-color)', borderRadius: '2rem', overflow: 'hidden'
                }}
            >
                {/* Header */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'var(--accent)', padding: '0.8rem', borderRadius: '1rem', color: 'white' }}>
                            <ShoppingBag size={24} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Do'kon</h2>
                            <div style={{ color: 'var(--text-muted)' }}>Mavjud tangalar: <span style={{ color: '#f59e0b', fontWeight: 700 }}>{userProfile.coins}</span></div>
                        </div>
                    </div>
                    <button onClick={onClose} className="btn-icon">
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div style={{ padding: '0 1.5rem', display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border-color)' }}>
                    <button
                        onClick={() => setActiveTab('themes')}
                        style={{
                            padding: '1rem 0', background: 'none', border: 'none', fontSize: '1rem', fontWeight: 600,
                            color: activeTab === 'themes' ? 'var(--accent)' : 'var(--text-muted)',
                            borderBottom: activeTab === 'themes' ? '2px solid var(--accent)' : '2px solid transparent',
                            cursor: 'pointer'
                        }}
                    >
                        Mavzular
                    </button>
                    <button
                        onClick={() => setActiveTab('avatars')}
                        style={{
                            padding: '1rem 0', background: 'none', border: 'none', fontSize: '1rem', fontWeight: 600,
                            color: activeTab === 'avatars' ? 'var(--accent)' : 'var(--text-muted)',
                            borderBottom: activeTab === 'avatars' ? '2px solid var(--accent)' : '2px solid transparent',
                            cursor: 'pointer'
                        }}
                    >
                        Avatarlar
                    </button>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                    {activeTab === 'themes' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            {ITEMS.filter(item => item.type === 'theme').map(item => {
                                const isOwned = userProfile.inventory.includes(item.id);
                                const isEquipped = userProfile.activeTheme === item.id;

                                return (
                                    <div key={item.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: isEquipped ? '2px solid var(--accent)' : '1px solid var(--border-color)' }}>
                                        <div style={{ height: '80px', borderRadius: '1rem', background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Palette size={32} color="white" />
                                        </div>
                                        <div>
                                            <h3 style={{ margin: '0 0 0.2rem 0', fontSize: '1.1rem' }}>{item.name}</h3>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.description}</p>
                                        </div>
                                        <button
                                            onClick={() => handleAction(item)}
                                            style={{
                                                marginTop: 'auto',
                                                padding: '0.8rem',
                                                borderRadius: '0.8rem',
                                                border: 'none',
                                                fontWeight: 600,
                                                cursor: userProfile.coins < item.price && !isOwned ? 'not-allowed' : 'pointer',
                                                background: isEquipped
                                                    ? 'var(--accent)'
                                                    : isOwned
                                                        ? 'rgba(139, 92, 246, 0.2)'
                                                        : 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)',
                                                color: isEquipped
                                                    ? 'white'
                                                    : isOwned
                                                        ? 'var(--accent)'
                                                        : 'white',
                                                opacity: userProfile.coins < item.price && !isOwned ? 0.5 : 1,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                                            }}
                                        >
                                            {isEquipped ? <><Check size={18} /> O'rnatilgan</> :
                                                isOwned ? 'O\'rnatish' :
                                                    <>{item.price} <span style={{ color: '#fbbf24' }}>●</span> Sotib olish</>}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            {ITEMS.filter(item => item.type === 'avatar').map(item => {
                                const isOwned = userProfile.inventory.includes(item.id);
                                const isEquipped = userProfile.activeAvatar === item.id;

                                return (
                                    <div key={item.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: isEquipped ? '2px solid var(--accent)' : '1px solid var(--border-color)' }}>
                                        <div style={{ height: '80px', borderRadius: '1rem', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.1) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                                            {(item as any).emoji}
                                        </div>
                                        <div>
                                            <h3 style={{ margin: '0 0 0.2rem 0', fontSize: '1.1rem' }}>{item.name}</h3>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.description}</p>
                                        </div>
                                        <button
                                            onClick={() => handleAction(item)}
                                            style={{
                                                marginTop: 'auto',
                                                padding: '0.8rem',
                                                borderRadius: '0.8rem',
                                                border: 'none',
                                                fontWeight: 600,
                                                cursor: userProfile.coins < item.price && !isOwned ? 'not-allowed' : 'pointer',
                                                background: isEquipped
                                                    ? 'var(--accent)'
                                                    : isOwned
                                                        ? 'rgba(139, 92, 246, 0.2)'
                                                        : 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)',
                                                color: isEquipped
                                                    ? 'white'
                                                    : isOwned
                                                        ? 'var(--accent)'
                                                        : 'white',
                                                opacity: userProfile.coins < item.price && !isOwned ? 0.5 : 1,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                                            }}
                                        >
                                            {isEquipped ? <><Check size={18} /> O'rnatilgan</> :
                                                isOwned ? 'O\'rnatish' :
                                                    <>{item.price} <span style={{ color: '#fbbf24' }}>●</span> Sotib olish</>}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};
