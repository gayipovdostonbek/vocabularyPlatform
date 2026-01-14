import React, { useState } from 'react';
import type { Word } from '../types';
import { firebaseService } from '../api/firebaseService';
import { Plus, Trash2, X, RefreshCw, Pencil, Check, XCircle, Volume2 } from 'lucide-react';

interface WordManagerProps {
    userId: string;
    words: Word[];
    onUpdate: (words: Word[]) => void;
    onClose: () => void;
}

export const WordManager: React.FC<WordManagerProps> = ({ userId, words, onUpdate, onClose }) => {
    const [newEnglish, setNewEnglish] = useState('');
    const [newUzbek, setNewUzbek] = useState('');
    const [newExample, setNewExample] = useState('');
    const [newExampleTranslation, setNewExampleTranslation] = useState('');
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Editing State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editEnglish, setEditEnglish] = useState('');
    const [editUzbek, setEditUzbek] = useState('');
    const [editExample, setEditExample] = useState('');
    const [editExampleTranslation, setEditExampleTranslation] = useState('');

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    const filteredWords = words.filter(word =>
        word.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.uzbek.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this word?')) return;
        try {
            await firebaseService.deleteWord(userId, id);
            onUpdate(words.filter(w => w.id !== id));
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

            {/* Search and Add Form */}
            <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ position: 'relative' }}>
                    <input
                        className="input-field"
                        placeholder="So'zlarni qidirish..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ margin: 0, paddingLeft: '2.5rem' }}
                    />
                    <span style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
                </div>

                <form onSubmit={handleAdd} className="responsive-grid" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '0.75rem' }}>
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
                            <tr style={{ textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
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
                                    <tr key={word.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: isEditing ? 'rgba(255,255,255,0.05)' : 'transparent' }}>
                                        <td style={{ padding: '0.75rem 0.5rem' }}>
                                            {isEditing ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                                    <input className="input-field" value={editEnglish} onChange={e => setEditEnglish(e.target.value)} style={{ margin: 0, padding: '0.4rem' }} autoFocus />
                                                    <input className="input-field" placeholder="Misol..." value={editExample} onChange={e => setEditExample(e.target.value)} style={{ margin: 0, padding: '0.4rem', fontSize: '0.8rem' }} />
                                                </div>
                                            ) : (
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span style={{ fontWeight: 600 }}>{word.english}</span>
                                                        <button
                                                            onClick={() => speak(word.english)}
                                                            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
                                                            title="Eshitish"
                                                        >
                                                            <Volume2 size={14} />
                                                        </button>
                                                    </div>
                                                    {word.example && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.1rem' }}>"{word.example}"</div>}
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
                                                    <div style={{ color: '#e2e8f0' }}>{word.uzbek}</div>
                                                    {word.exampleTranslation && <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.1rem' }}>{word.exampleTranslation}</div>}
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
                                                            background: (word.masteryLevel || 0) > lvl ? 'var(--success)' : 'rgba(255,255,255,0.1)'
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
        </div>
    );
};
