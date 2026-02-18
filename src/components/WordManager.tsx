import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Word } from '../types';
import { firebaseService } from '../api/firebaseService';
import { soundService } from '../api/soundService';
import { Plus, Trash2, X, RefreshCw, Pencil, Volume2, Wand2, Globe, Tag, Languages, Search, AlertTriangle } from 'lucide-react';
import { dictionaryService } from '../api/dictionaryService';
import { useNavigate } from 'react-router-dom';

interface WordManagerProps {
    userId: string;
    words: Word[];
    initialFilter?: 'all' | 'learning' | 'learned';
    onUpdate: (words: Word[]) => void;
}

export const WordManager: React.FC<WordManagerProps> = ({ userId, words, initialFilter = 'all', onUpdate }) => {
    const navigate = useNavigate();
    const [newEnglish, setNewEnglish] = useState('');
    const [newUzbek, setNewUzbek] = useState('');
    const [newExample, setNewExample] = useState('');
    const [newExampleTranslation, setNewExampleTranslation] = useState('');
    const [loading, setLoading] = useState(false);
    const [autoFilling, setAutoFilling] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'learning' | 'learned'>(initialFilter);

    // Category System
    const [category, setCategory] = useState('');
    const [lastCategory, setLastCategory] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    // Derive available categories from words
    const availableCategories = React.useMemo(() => {
        const cats = new Set(words.map(w => w.category).filter((c): c is string => !!c));
        return Array.from(cats).sort();
    }, [words]);

    // Editing State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editEnglish, setEditEnglish] = useState('');
    const [editUzbek, setEditUzbek] = useState('');
    const [editExample, setEditExample] = useState('');
    const [editExampleTranslation, setEditExampleTranslation] = useState('');
    const [editCategory, setEditCategory] = useState('');

    // Delete confirmation state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);



    const filteredWords = words.filter(word => {
        const matchesSearch = word.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
            word.uzbek.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (word.category && word.category.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || word.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || word.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEnglish || !newUzbek) return;

        // Duplicate Check
        const isDuplicate = words.some(w => w.english.toLowerCase() === newEnglish.trim().toLowerCase());
        if (isDuplicate) {
            alert("Bu so'z allaqachon mavjud!");
            return;
        }

        setLoading(true);
        try {
            const data = {
                english: newEnglish,
                uzbek: newUzbek,
                example: newExample || undefined,
                exampleTranslation: newExampleTranslation || undefined,
                category: category || lastCategory || undefined
            };
            const id = await firebaseService.addWord(userId, data);

            // Smart Memory: Remember last used category if it was set
            if (category) {
                setLastCategory(category);
            }
            const newWord: Word = { id, ...data, status: 'new' };
            onUpdate([...words, newWord]);
            setNewEnglish('');
            setNewUzbek('');
            setNewExample('');
            setNewExampleTranslation('');
            // Don't clear category completely, keep it for next input (Smart Memory)
            // But we might want to clear the visual input if we want to show it's "ready for new"
            // For now, let's keep it populated to be explicit
            setCategory(category || lastCategory || '');

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
        setEditCategory(word.category || '');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditEnglish('');
        setEditUzbek('');
        setEditExample('');
        setEditExampleTranslation('');
        setEditCategory('');
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
            exampleTranslation: editExampleTranslation || undefined,
            category: editCategory || undefined
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

    const handleAutoFill = async () => {
        if (!newEnglish) return;

        setAutoFilling(true);
        try {
            const result = await dictionaryService.lookupWord(newEnglish);

            if (result.translation) setNewUzbek(result.translation);
            if (result.example) setNewExample(result.example);
            if (result.exampleTranslation) setNewExampleTranslation(result.exampleTranslation);

        } catch (error) {
            console.error(error);
        } finally {
            setAutoFilling(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>So'zlarni boshqarish</h1>
                    <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0', fontWeight: 500 }}>Sizning lug'atingizdagi barcha so'zlar to'plami</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: 'var(--subtle-bg)', borderColor: 'var(--accent)', boxShadow: '0 0 20px var(--accent-glow)' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        whileTap={{ scale: 0.9 }}
                        className="interactable"
                        onClick={handleSync}
                        disabled={syncing}
                        style={{
                            background: 'var(--subtle-bg)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)',
                            width: '48px',
                            height: '48px',
                            borderRadius: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <RefreshCw size={20} className={syncing ? 'spin' : ''} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: '#ef4444', color: '#ef4444', boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        whileTap={{ scale: 0.9 }}
                        className="interactable"
                        onClick={() => navigate('/')}
                        style={{
                            background: 'var(--subtle-bg)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)',
                            width: '48px',
                            height: '48px',
                            borderRadius: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={22} />
                    </motion.button>
                </div>
            </div>

            {/* Top "Add Word" Control Center */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel"
                whileHover={{ boxShadow: '0 20px 50px -10px var(--accent-glow)', borderColor: 'var(--accent)' }}
                style={{ padding: '2rem', borderRadius: '1.5rem', border: '1px solid var(--accent-glow)', marginBottom: '2.5rem', transition: 'all 0.2s' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{ background: 'var(--accent-glow)', width: '40px', height: '40px', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={20} className="text-accent" />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Yangi so'z qo'shish</h3>
                </div>

                <form onSubmit={handleAdd}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Word and Translation Pair */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            <div className="input-group">
                                <Globe size={18} style={{ color: '#3b82f6', opacity: 0.8 }} />
                                <input className="modern-input" placeholder="English Word (Masalan: Serendipity)" value={newEnglish} onChange={e => setNewEnglish(e.target.value)} required />
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    {newEnglish && (
                                        <button type="button" onClick={() => setNewEnglish('')} style={{ background: 'none', border: 'none', color: 'var(--text-lowest)', cursor: 'pointer', display: 'flex' }}>
                                            <X size={16} />
                                        </button>
                                    )}
                                    <motion.button
                                        whileHover={{ scale: 1.2, color: 'var(--accent)', rotate: [0, -10, 10, 0] }}
                                        type="button"
                                        onClick={handleAutoFill}
                                        disabled={autoFilling || !newEnglish}
                                        style={{ background: 'none', border: 'none', color: 'var(--text-lowest)', cursor: 'pointer', display: 'flex' }}
                                    >
                                        <Wand2 size={18} className={autoFilling ? 'spin' : ''} />
                                    </motion.button>
                                </div>
                            </div>
                            <div className="input-group">
                                <Languages size={18} style={{ color: '#10b981', opacity: 0.8 }} />
                                <input className="modern-input" placeholder="Uzbek Translation (Tarjimasi...)" value={newUzbek} onChange={e => setNewUzbek(e.target.value)} required />
                                {newUzbek && (
                                    <button type="button" onClick={() => setNewUzbek('')} style={{ background: 'none', border: 'none', color: 'var(--text-lowest)', cursor: 'pointer', display: 'flex' }}>
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Example Sentence EN */}
                        <div className="input-group" style={{ height: '75px', alignItems: 'flex-start', padding: '0.5rem 0.75rem' }}>
                            <textarea
                                className="modern-input"
                                placeholder="Example Sentence (Bu so'z qatnashgan misol...)"
                                value={newExample}
                                onChange={e => setNewExample(e.target.value)}
                                style={{ height: '100%', resize: 'none', paddingTop: '0.4rem' }}
                            />
                            {newExample && (
                                <button type="button" onClick={() => setNewExample('')} style={{ background: 'none', border: 'none', color: 'var(--text-lowest)', cursor: 'pointer', display: 'flex', marginTop: '0.5rem' }}>
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Example Translation UZ */}
                        <div className="input-group" style={{ height: '75px', alignItems: 'flex-start', padding: '0.5rem 0.75rem' }}>
                            <textarea
                                className="modern-input"
                                placeholder="Example Translation (Gapning tarjimasi...)"
                                value={newExampleTranslation}
                                onChange={e => setNewExampleTranslation(e.target.value)}
                                style={{ height: '100%', resize: 'none', paddingTop: '0.4rem' }}
                            />
                            {newExampleTranslation && (
                                <button type="button" onClick={() => setNewExampleTranslation('')} style={{ background: 'none', border: 'none', color: 'var(--text-lowest)', cursor: 'pointer', display: 'flex', marginTop: '0.5rem' }}>
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Category and Submit Button */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) auto', gap: '1.5rem', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                            <div className="input-group" style={{ marginBottom: 0 }}>
                                <Tag size={18} style={{ color: 'var(--accent)', opacity: 0.8 }} />
                                <input className="modern-input" placeholder="Category (IT, Sayohat, Ish...)" value={category} onChange={e => setCategory(e.target.value)} list="category-suggestions" />
                                {category && (
                                    <button type="button" onClick={() => setCategory('')} style={{ background: 'none', border: 'none', color: 'var(--text-lowest)', cursor: 'pointer', display: 'flex' }}>
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, filter: 'brightness(1.1)', boxShadow: '0 15px 30px -5px rgba(124, 58, 237, 0.5)' }}
                                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary"
                                style={{
                                    padding: '0 3.5rem',
                                    height: '56px',
                                    fontSize: '1.1rem',
                                    fontWeight: 800,
                                    borderRadius: '1.25rem',
                                    boxShadow: '0 10px 20px -5px rgba(124, 58, 237, 0.4)',
                                    background: 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {loading ? 'Saqlanmoqda...' : <><Plus size={24} /> Qo'shish</>}
                            </motion.button>
                        </div>
                    </div>
                </form>
            </motion.div>

            {/* Content Filters and Search */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none', flexShrink: 0 }}>
                        {[
                            { id: 'all', label: 'Barchasi' },
                            { id: 'learning', label: 'Yodlanayotgan' },
                            { id: 'learned', label: 'Yodlangan' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setStatusFilter(tab.id as any)}
                                className={`filter-pill ${statusFilter === tab.id ? 'active' : ''}`}
                                style={{ padding: '0.6rem 1.25rem', whiteSpace: 'nowrap', fontWeight: 700 }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="input-group" style={{ maxWidth: '400px', flex: 1, marginBottom: 0 }}>
                        <Search size={20} style={{ color: 'var(--text-muted)' }} />
                        <input
                            className="modern-input"
                            placeholder="Lug'atdan qidirish..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ fontSize: '1rem' }}
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', color: 'var(--text-lowest)', cursor: 'pointer' }}>
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Category Quick Filter */}
                {availableCategories.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
                        <button
                            onClick={() => setCategoryFilter('all')}
                            className={`filter-pill ${categoryFilter === 'all' ? 'active' : ''}`}
                            style={{ fontSize: '0.85rem', padding: '0.45rem 1.1rem', fontWeight: 600 }}
                        >
                            Barchasi
                        </button>
                        {availableCategories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={`filter-pill ${categoryFilter === cat ? 'active' : ''}`}
                                style={{ fontSize: '0.85rem', padding: '0.45rem 1.1rem', fontWeight: 600 }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Word List Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <AnimatePresence mode="popLayout">
                    {filteredWords.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-panel"
                            style={{ padding: '6rem 2rem', textAlign: 'center', color: 'var(--text-muted)', borderRadius: '1.5rem' }}
                        >
                            <div style={{ marginBottom: '1.5rem', opacity: 0.15 }}>
                                <Search size={80} style={{ margin: '0 auto' }} />
                            </div>
                            <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                                {searchTerm ? 'Hech narsa topilmadi.' : 'Hozircha so\'zlar yo\'q.'}
                            </p>
                            <p style={{ fontSize: '0.95rem', marginTop: '0.5rem' }}>Balkim yangi so'z qo'shish kerakdir?</p>
                        </motion.div>
                    ) : (
                        filteredWords.map((word, idx) => (
                            <motion.div
                                key={word.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.15, delay: idx * 0.01 }}
                                className="glass-panel"
                                style={{
                                    padding: '1.5rem',
                                    borderRadius: '1.5rem',
                                    position: 'relative',
                                    border: editingId === word.id ? '2px solid var(--accent)' : '1px solid var(--border-color)',
                                    boxShadow: editingId === word.id ? '0 0 25px var(--accent-glow)' : '0 4px 6px -1px rgba(0,0,0,0.05)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
                                    <div style={{ flex: 1 }}>
                                        {editingId === word.id ? (
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                                                <div className="input-group"><input className="modern-input" value={editEnglish} onChange={e => setEditEnglish(e.target.value)} placeholder="English" autoFocus /></div>
                                                <div className="input-group"><input className="modern-input" value={editUzbek} onChange={e => setEditUzbek(e.target.value)} placeholder="Uzbek" /></div>
                                                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                                    <textarea className="modern-input" style={{ minHeight: '60px', paddingTop: '0.6rem' }} value={editExample} onChange={e => setEditExample(e.target.value)} placeholder="Misol (EN)..." rows={2} />
                                                </div>
                                                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                                    <textarea className="modern-input" style={{ minHeight: '60px', paddingTop: '0.6rem' }} value={editExampleTranslation} onChange={e => setEditExampleTranslation(e.target.value)} placeholder="Misol tarjimasi (UZ)..." rows={2} />
                                                </div>
                                                <div className="input-group"><input className="modern-input" value={editCategory} onChange={e => setEditCategory(e.target.value)} placeholder="Mavzu" list="category-suggestions" /></div>
                                                <div style={{ display: 'flex', gap: '0.75rem', gridColumn: 'span 2', justifyContent: 'flex-end' }}>
                                                    <button onClick={() => saveEdit(word)} className="btn btn-primary" style={{ height: '48px', padding: '0 2rem', fontWeight: 700 }}>Saqlash</button>
                                                    <button onClick={cancelEdit} className="btn btn-secondary" style={{ height: '48px', padding: '0 1.5rem', fontWeight: 700 }}>Bekor qilish</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                                                <div style={{
                                                    background: 'var(--subtle-bg)',
                                                    width: '60px',
                                                    height: '60px',
                                                    borderRadius: '1.1rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                    boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.05)'
                                                }}>
                                                    <Globe size={26} className="text-accent" />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '0.6rem' }}>
                                                        <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.5px' }}>{word.english}</h3>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1, backgroundColor: 'var(--accent)', color: 'white', boxShadow: '0 0 15px var(--accent-glow)' }}
                                                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => soundService.speak(word.english)}
                                                            className="interactable"
                                                            style={{ background: 'var(--accent-glow)', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.6rem', display: 'flex', transition: 'all 0.1s' }}
                                                        >
                                                            <Volume2 size={16} />
                                                        </motion.button>
                                                        <div style={{ display: 'flex', gap: '5px' }}>
                                                            {[0, 1, 2, 3].map(lvl => (
                                                                <div key={lvl} style={{ width: '9px', height: '9px', borderRadius: '50%', background: (word.masteryLevel || 0) > lvl ? 'var(--success)' : 'rgba(255,255,255,0.1)' }} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div style={{ fontSize: '1.15rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.5rem' }}>{word.uzbek}</div>
                                                    {word.example && (
                                                        <div style={{ fontSize: '1rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.1)', padding: '1rem 1.25rem', borderRadius: '1rem', marginTop: '1.25rem', borderLeft: '4px solid var(--accent)', lineHeight: 1.5 }}>
                                                            <div style={{ fontStyle: 'italic', marginBottom: word.exampleTranslation ? '0.5rem' : 0 }}>"{word.example}"</div>
                                                            {word.exampleTranslation && (
                                                                <div style={{ fontSize: '0.9rem', opacity: 0.8, color: 'var(--text-main)' }}>{word.exampleTranslation}</div>
                                                            )}
                                                        </div>
                                                    )}
                                                    {word.category && (
                                                        <div style={{ marginTop: '1.25rem', display: 'flex' }}>
                                                            <span style={{ fontSize: '0.8rem', background: 'var(--accent-glow)', color: 'var(--text-main)', padding: '0.35rem 1rem', borderRadius: '2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                                #{word.category}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {!editingId && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                            <motion.button whileHover={{ scale: 1.1, borderColor: 'var(--accent)', color: 'var(--accent)', boxShadow: '0 0 15px var(--accent-glow)' }} transition={{ type: 'spring', stiffness: 500, damping: 25 }} whileTap={{ scale: 0.9 }} onClick={() => startEdit(word)} className="interactable" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--border-color)', width: '48px', height: '48px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.1s' }}>
                                                <Pencil size={22} />
                                            </motion.button>
                                            <motion.button whileHover={{ scale: 1.1, borderColor: '#ef4444', color: '#ef4444', boxShadow: '0 0 15px rgba(239, 68, 68, 0.2)' }} transition={{ type: 'spring', stiffness: 500, damping: 25 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(word.id)} className="interactable" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--border-color)', width: '48px', height: '48px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.1s' }}>
                                                <Trash2 size={22} />
                                            </motion.button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Suggestions */}
            <datalist id="category-suggestions">
                {availableCategories.map(cat => <option key={cat} value={cat} />)}
                <option value="Sayohat" />
                <option value="Ish" />
                <option value="Oziq-ovqat" />
                <option value="IT" />
                <option value="Kundalik" />
                <option value="Sport" />
                <option value="Ta'lim" />
            </datalist>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(20px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 2000,
                            padding: '1rem'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 30 }}
                            className="glass-panel"
                            style={{ padding: '3.5rem 2.5rem', maxWidth: '420px', textAlign: 'center', borderRadius: '2.5rem', border: '1px solid rgba(239, 68, 68, 0.4)' }}
                        >
                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', width: '90px', height: '90px', borderRadius: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                                <AlertTriangle size={48} />
                            </div>
                            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.75rem', fontWeight: 900 }}>O'chirib tashlaysizmi?</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '3rem', fontWeight: 500, lineHeight: 1.6 }}>Bu so'z lug'atingizdan butunlay o'chirib yuboriladi. Bu amalni qayta tiklash imkoni yo'q.</p>
                            <div style={{ display: 'flex', gap: '1.25rem' }}>
                                <button className="btn btn-secondary" style={{ flex: 1, height: '56px', fontWeight: 800, borderRadius: '1.25rem' }} onClick={() => setShowDeleteConfirm(null)}>
                                    Biroz kutish
                                </button>
                                <button className="btn btn-primary" style={{ flex: 1, height: '56px', background: '#ef4444', border: 'none', fontWeight: 800, borderRadius: '1.25rem', boxShadow: '0 10px 20px -5px rgba(239, 68, 68, 0.4)' }} onClick={confirmDelete}>
                                    Ha, o'chirish
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }

                .text-accent { color: var(--accent); }

                .input-group:focus-within {
                    border-color: var(--accent) !important;
                    box-shadow: 0 0 15px var(--accent-glow) !important;
                    background: rgba(255, 255, 255, 0.05) !important;
                }

                @media (max-width: 600px) {
                    header { padding: 1rem !important; }
                    .modern-input { font-size: 16px !important; }
                    h1 { fontSize: 2rem !important; }
                    .glass-panel { padding: 1.25rem !important; }
                }
            `}</style>
        </div >
    );
};
