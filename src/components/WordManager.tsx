import React, { useState } from 'react';
import type { Word } from '../types';
import { firebaseService } from '../api/firebaseService';
import { Plus, Trash2, X, RefreshCw, Pencil, Check, XCircle, Volume2 } from 'lucide-react';

interface WordManagerProps {
    userId: string;
    words: Word[];
    initialFilter?: 'all' | 'learning' | 'learned';
    onUpdate: (words: Word[]) => void;
    onClose: () => void;
}

export const WordManager: React.FC<WordManagerProps> = ({ userId, words, initialFilter = 'all', onUpdate, onClose }) => {
    const [newEnglish, setNewEnglish] = useState('');
    const [newUzbek, setNewUzbek] = useState('');
    const [newExample, setNewExample] = useState('');
    const [newExampleTranslation, setNewExampleTranslation] = useState('');
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'learning' | 'learned'>(initialFilter);

    // Editing State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editEnglish, setEditEnglish] = useState('');
    const [editUzbek, setEditUzbek] = useState('');
    const [editExample, setEditExample] = useState('');
    const [editExampleTranslation, setEditExampleTranslation] = useState('');

    // Delete confirmation state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    const filteredWords = words.filter(word => {
        const matchesSearch = word.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
            word.uzbek.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || word.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEnglish || !newUzbek) return;

        setLoading(true);
        try {
            const data = {
                english: newEnglish,
                uzbek: newUzbek,
                example: newExample || undefined,
                exampleTranslation: newExampleTranslation || undefined
            };
            const id = await firebaseService.addWord(userId, data);
            const newWord: Word = { id, ...data, status: 'new' };
            onUpdate([...words, newWord]);
            setNewEnglish('');
            setNewUzbek('');
            setNewExample('');
            setNewExampleTranslation('');
        } catch (err) {
            console.error(err);
            alert('Failed to add word');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: string) => {
        setShowDeleteConfirm(id);
    };

    const confirmDelete = async () => {
        if (!showDeleteConfirm) return;
        try {
            await firebaseService.deleteWord(userId, showDeleteConfirm);
            onUpdate(words.filter(w => w.id !== showDeleteConfirm));
            setShowDeleteConfirm(null);
        } catch (err) {
            alert('Failed to delete');
        }
    };

    const startEdit = (word: Word) => {
        setEditingId(word.id);
        setEditEnglish(word.english);
        setEditUzbek(word.uzbek);
        setEditExample(word.example || '');
        setEditExampleTranslation(word.exampleTranslation || '');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditEnglish('');
        setEditUzbek('');
        setEditExample('');
        setEditExampleTranslation('');
    };

    const saveEdit = async (word: Word) => {
        if (!editEnglish || !editUzbek) return;
        const original = { ...word };

        // Optimistic update
        const updatedWord = {
            ...word,
            english: editEnglish,
            uzbek: editUzbek,
            example: editExample || undefined,
            exampleTranslation: editExampleTranslation || undefined
        };
        onUpdate(words.map(w => w.id === word.id ? updatedWord : w));
        setEditingId(null);

        try {
            await firebaseService.updateWord(userId, updatedWord);
        } catch (err) {
            alert('Failed to save changes');
            onUpdate(words.map(w => w.id === word.id ? original : w)); // Revert
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        try {
            const synced = await firebaseService.syncWords(userId);
            onUpdate(synced);
        } catch (err) {
            alert('Sync failed');
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>So'zlarni boshqarish</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" onClick={handleSync} disabled={syncing}>
                        <RefreshCw size={18} className={syncing ? 'spin' : ''} />
                    </button>
                    <button className="btn btn-secondary" onClick={onClose}><X size={18} /></button>
                </div>
            </div>

            {/* Filter Tabs and Search */}
            <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', background: 'var(--subtle-bg)', padding: '0.3rem', borderRadius: '0.75rem', gap: '0.2rem' }}>
                    {[
                        { id: 'all', label: 'Barchasi', count: words.length },
                        { id: 'learning', label: 'Yodlanayotgan', count: words.filter(w => w.status === 'learning' || w.status === 'new').length },
                        { id: 'learned', label: 'Yodlangan', count: words.filter(w => w.status === 'learned').length }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setStatusFilter(tab.id as any)}
                            style={{
                                flex: 1,
                                padding: '0.6rem',
                                border: 'none',
                                borderRadius: '0.6rem',
                                background: statusFilter === tab.id ? 'var(--accent)' : 'transparent',
                                color: statusFilter === tab.id ? 'white' : 'var(--text-muted)',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            {tab.label}
                            <span style={{
                                opacity: 0.7,
                                fontSize: '0.75rem',
                                background: statusFilter === tab.id ? 'rgba(255,255,255,0.2)' : 'var(--border-color)',
                                padding: '0.1rem 0.4rem',
                                borderRadius: '1rem'
                            }}>{tab.count}</span>
                        </button>
                    ))}
                </div>

                <div style={{ position: 'relative' }}>
                    <input
                        className="input-field"
                        placeholder="So'zlarni qidirish..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ margin: 0, paddingLeft: '2.75rem' }}
                    />
                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '1rem' }}>🔍</span>
                </div>

                <form onSubmit={handleAdd} className="responsive-grid" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--subtle-bg)', padding: '1.25rem', borderRadius: '0.75rem' }}>
                    <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <input
                            className="input-field"
                            placeholder="Inglizcha so'z"
                            value={newEnglish}
                            onChange={e => setNewEnglish(e.target.value)}
                            style={{ margin: 0 }}
                            required
                        />
                        <input
                            className="input-field"
                            placeholder="O'zbekcha tarjimasi"
                            value={newUzbek}
                            onChange={e => setNewUzbek(e.target.value)}
                            style={{ margin: 0 }}
                            required
                        />
                    </div>
                    <div className="grid-2-auto" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.75rem' }}>
                        <input
                            className="input-field"
                            placeholder="Misol (Inglizcha gap)..."
                            value={newExample}
                            onChange={e => setNewExample(e.target.value)}
                            style={{ margin: 0 }}
                        />
                        <input
                            className="input-field"
                            placeholder="Misol tarjimasi..."
                            value={newExampleTranslation}
                            onChange={e => setNewExampleTranslation(e.target.value)}
                            style={{ margin: 0 }}
                        />
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '60px', height: '3.5rem', marginTop: '0.5rem' }}>
                            {loading ? '...' : <Plus size={24} />}
                        </button>
                    </div>
                </form>
            </div>

            {/* List */}
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {filteredWords.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        {searchTerm ? 'Hech narsa topilmadi.' : 'Hozircha so\'zlar yo\'q.'}
                    </p>
                ) : (
                    <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '0.5rem' }}>Inglizcha</th>
                                <th style={{ padding: '0.5rem' }}>O'zbekcha</th>
                                <th style={{ padding: '0.5rem' }}>O'zlashtirish</th>
                                <th style={{ padding: '0.5rem', textAlign: 'right' }}>Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWords.map(word => {
                                const isEditing = editingId === word.id;
                                return (
                                    <tr key={word.id} style={{ borderBottom: '1px solid var(--border-color)', background: isEditing ? 'var(--subtle-bg)' : 'transparent' }}>
                                        <td style={{ padding: '0.75rem 0.5rem' }}>
                                            {isEditing ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                                    <input className="input-field" value={editEnglish} onChange={e => setEditEnglish(e.target.value)} style={{ margin: 0, padding: '0.4rem' }} autoFocus />
                                                    <input className="input-field" placeholder="Misol..." value={editExample} onChange={e => setEditExample(e.target.value)} style={{ margin: 0, padding: '0.4rem', fontSize: '0.8rem' }} />
                                                </div>
                                            ) : (
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{word.english}</span>
                                                        <button
                                                            onClick={() => speak(word.english)}
                                                            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem', opacity: 0.7 }}
                                                            title="Eshitish"
                                                        >
                                                            <Volume2 size={14} />
                                                        </button>
                                                    </div>
                                                    {word.example && (
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                            <span>"{word.example}"</span>
                                                            <button
                                                                onClick={() => speak(word.example!)}
                                                                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.1rem', display: 'flex', alignItems: 'center', opacity: 0.5 }}
                                                                title="Gapni eshitish"
                                                            >
                                                                <Volume2 size={12} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '0.75rem 0.5rem' }}>
                                            {isEditing ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                                    <input className="input-field" value={editUzbek} onChange={e => setEditUzbek(e.target.value)} style={{ margin: 0, padding: '0.4rem' }} />
                                                    <input className="input-field" placeholder="Misol tarjimasi..." value={editExampleTranslation} onChange={e => setEditExampleTranslation(e.target.value)} style={{ margin: 0, padding: '0.4rem', fontSize: '0.8rem' }} />
                                                </div>
                                            ) : (
                                                <div>
                                                    <div style={{ color: 'var(--text-main)' }}>{word.uzbek}</div>
                                                    {word.exampleTranslation && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{word.exampleTranslation}</div>}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '0.5rem' }}>
                                            <div style={{ display: 'flex', gap: '3px' }}>
                                                {[0, 1, 2, 3].map(lvl => (
                                                    <div
                                                        key={lvl}
                                                        style={{
                                                            width: '6px',
                                                            height: '6px',
                                                            borderRadius: '50%',
                                                            background: (word.masteryLevel || 0) > lvl ? 'var(--success)' : 'var(--subtle-bg)'
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                        <td style={{ padding: '0.5rem', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                            {isEditing ? (
                                                <>
                                                    <button onClick={() => saveEdit(word)} style={{ background: 'var(--success)', border: 'none', borderRadius: '4px', padding: '0.4rem', color: '#fff', cursor: 'pointer' }}>
                                                        <Check size={16} />
                                                    </button>
                                                    <button onClick={cancelEdit} style={{ background: 'var(--bg-secondary)', border: 'none', borderRadius: '4px', padding: '0.4rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                                        <XCircle size={16} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => startEdit(word)} style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', opacity: 0.8 }}>
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button onClick={() => handleDelete(word.id)} style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', opacity: 0.8 }}>
                                                        <Trash2 size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Custom Confirm Modal */}
            {
                showDeleteConfirm && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'var(--overlay-bg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2000,
                        padding: '1rem'
                    }}>
                        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '350px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                            <div style={{ background: 'rgba(239, 68, 68, 0.05)', color: 'var(--error)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                <Trash2 size={30} />
                            </div>
                            <h3 style={{ margin: '0 0 1rem 0' }}>So'zni o'chirasizmi?</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>O'chirilgan so'zni qayta tiklab bo'lmaydi.</p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowDeleteConfirm(null)}>
                                    Bekor qilish
                                </button>
                                <button className="btn btn-primary" style={{ flex: 1, background: 'var(--error)' }} onClick={confirmDelete}>
                                    O'chirish
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        @media (max-width: 768px) {
            .grid-3 { grid-template-columns: 1fr !important; }
            .grid-2-auto { grid-template-columns: 1fr !important; }
            .grid-2-auto button { width: 100% !important; margin-top: 0 !important; }
            .responsive-table th:nth-child(3), 
            .responsive-table td:nth-child(3) {
                display: none;
            }
        }
      `}</style>
        </div >
    );
};
