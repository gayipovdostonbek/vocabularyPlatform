import React, { useState } from 'react';
import type { Word } from '../types';
import { sheetService } from '../api/sheetService';
import { Plus, Trash2, X, RefreshCw, Pencil, Check, XCircle } from 'lucide-react';

interface WordManagerProps {
    words: Word[];
    scriptUrl: string;
    onUpdate: (words: Word[]) => void;
    onClose: () => void;
}

export const WordManager: React.FC<WordManagerProps> = ({ words, scriptUrl, onUpdate, onClose }) => {
    const [newEnglish, setNewEnglish] = useState('');
    const [newUzbek, setNewUzbek] = useState('');
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);

    // Editing State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editEnglish, setEditEnglish] = useState('');
    const [editUzbek, setEditUzbek] = useState('');

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEnglish || !newUzbek) return;

        setLoading(true);
        try {
            const id = await sheetService.addWord(scriptUrl, { english: newEnglish, uzbek: newUzbek });
            const newWord: Word = { id, english: newEnglish, uzbek: newUzbek, status: 'new' };
            onUpdate([...words, newWord]);
            setNewEnglish('');
            setNewUzbek('');
        } catch (err) {
            alert('Failed to add word');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this word?')) return;
        try {
            await sheetService.deleteWord(scriptUrl, id);
            onUpdate(words.filter(w => w.id !== id));
        } catch (err) {
            alert('Failed to delete');
        }
    };

    const startEdit = (word: Word) => {
        setEditingId(word.id);
        setEditEnglish(word.english);
        setEditUzbek(word.uzbek);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditEnglish('');
        setEditUzbek('');
    };

    const saveEdit = async (word: Word) => {
        if (!editEnglish || !editUzbek) return;
        const original = { ...word };

        // Optimistic update
        const updatedWord = { ...word, english: editEnglish, uzbek: editUzbek };
        onUpdate(words.map(w => w.id === word.id ? updatedWord : w));
        setEditingId(null);

        try {
            await sheetService.updateWord(scriptUrl, updatedWord);
        } catch (err) {
            alert('Failed to save changes');
            onUpdate(words.map(w => w.id === word.id ? original : w)); // Revert
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        try {
            const latest = await sheetService.syncWords(scriptUrl);
            onUpdate(latest);
        } catch (err) {
            alert('Sync failed');
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>Manage Words</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" onClick={handleSync} disabled={syncing}>
                        <RefreshCw size={18} className={syncing ? 'spin' : ''} />
                    </button>
                    <button className="btn btn-secondary" onClick={onClose}><X size={18} /></button>
                </div>
            </div>

            {/* Add Form */}
            <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', marginBottom: '2rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
                <input
                    className="input-field"
                    placeholder="English Word"
                    value={newEnglish}
                    onChange={e => setNewEnglish(e.target.value)}
                    style={{ margin: 0 }}
                />
                <input
                    className="input-field"
                    placeholder="Uzbek Translation"
                    value={newUzbek}
                    onChange={e => setNewUzbek(e.target.value)}
                    style={{ margin: 0 }}
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Adding...' : <Plus size={20} />}
                </button>
            </form>

            {/* List */}
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {words.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No words yet.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '0.5rem' }}>English</th>
                                <th style={{ padding: '0.5rem' }}>Uzbek</th>
                                <th style={{ padding: '0.5rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {words.map(word => {
                                const isEditing = editingId === word.id;
                                return (
                                    <tr key={word.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: isEditing ? 'rgba(255,255,255,0.05)' : 'transparent' }}>
                                        <td style={{ padding: '0.5rem' }}>
                                            {isEditing ? (
                                                <input className="input-field" value={editEnglish} onChange={e => setEditEnglish(e.target.value)} style={{ margin: 0, padding: '0.4rem' }} autoFocus />
                                            ) : (
                                                <span style={{ fontWeight: 600 }}>{word.english}</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '0.5rem' }}>
                                            {isEditing ? (
                                                <input className="input-field" value={editUzbek} onChange={e => setEditUzbek(e.target.value)} style={{ margin: 0, padding: '0.4rem' }} />
                                            ) : (
                                                <span style={{ color: '#e2e8f0' }}>{word.uzbek}</span>
                                            )}
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
      `}</style>
        </div>
    );
};
