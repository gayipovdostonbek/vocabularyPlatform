import React, { useState, useMemo } from 'react';
import { Book, ChevronRight, GraduationCap, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { grammarTopics } from '../data/grammarData';

export const GrammarDashboard: React.FC = () => {
    const [selectedLevel, setSelectedLevel] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');

    const levels = [
        'All',
        'A1 – Beginner (Asoslar)',
        'A2 – Elementary',
        'B1 – Intermediate',
        'B2 – Upper-Intermediate',
        'C1 – Advanced'
    ];

    const filteredTopics = useMemo(() => {
        return grammarTopics.filter(topic => {
            const matchesLevel = selectedLevel === 'All' || topic.level === selectedLevel;
            const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                topic.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesLevel && matchesSearch;
        });
    }, [selectedLevel, searchQuery]);

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'A1 – Beginner (Asoslar)': return 'var(--level-a1)';
            case 'A2 – Elementary': return 'var(--level-a2)';
            case 'B1 – Intermediate': return 'var(--level-b1)';
            case 'B2 – Upper-Intermediate': return 'var(--level-b2)';
            case 'C1 – Advanced': return 'var(--level-c1)';
            default: return 'var(--accent)';
        }
    };

    const getLevelBadgeClass = (level: string) => {
        switch (level) {
            case 'A1 – Beginner (Asoslar)': return 'badge-a1';
            case 'A2 – Elementary': return 'badge-a2';
            case 'B1 – Intermediate': return 'badge-b1';
            case 'B2 – Upper-Intermediate': return 'badge-b2';
            case 'C1 – Advanced': return 'badge-c1';
            default: return '';
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
            {/* Hero Section */}
            <div style={{
                marginBottom: '3rem',
                textAlign: 'center',
                padding: '3rem 2rem',
                borderRadius: '2rem',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                border: '1px solid var(--border-color)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.1 }}>
                    <GraduationCap size={200} />
                </div>

                <h2 style={{
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    background: 'var(--title-gradient)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    <GraduationCap size={44} style={{ color: 'var(--accent)' }} />
                    Grammatika Markazi
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Ingliz tili qoidalarini eng oson va qulay usulda o'rganing.
                    Mavzularni darajalar bo'yicha saralang va bilimingizni mustahkamlang.
                </p>
            </div>

            {/* Search & Filter Bar */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                marginBottom: '2.5rem'
            }}>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div className="tab-container" style={{ margin: 0 }}>
                        {levels.map(level => (
                            <div
                                key={level}
                                onClick={() => setSelectedLevel(level)}
                                className={`tab-item ${selectedLevel === level ? 'active' : ''}`}
                            >
                                {level}
                            </div>
                        ))}
                    </div>

                    <div style={{
                        position: 'relative',
                        flex: '1',
                        minWidth: '280px'
                    }}>
                        <Search
                            size={18}
                            style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-muted)'
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Mavzulardan qidirish..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field"
                            style={{ paddingLeft: '2.8rem', margin: 0 }}
                        />
                    </div>
                </div>
            </div>

            {/* Topics Grid */}
            {filteredTopics.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {filteredTopics.map((topic, index) => (
                        <Link
                            key={topic.id}
                            to={`/grammar/${topic.id}`}
                            className="glass-panel interactable animate-fade-in"
                            style={{
                                textDecoration: 'none',
                                color: 'inherit',
                                padding: '1.75rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                animationDelay: `${index * 0.05}s`
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    background: `${getLevelColor(topic.level)}15`,
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: getLevelColor(topic.level),
                                    border: `1px solid ${getLevelColor(topic.level)}30`
                                }}>
                                    <Book size={24} />
                                </div>
                                <span className={`level-badge ${getLevelBadgeClass(topic.level)}`}>
                                    {topic.level}
                                </span>
                            </div>

                            <div>
                                <h4 style={{
                                    margin: '0 0 0.5rem 0',
                                    fontSize: '1.2rem',
                                    fontWeight: 700,
                                    lineHeight: 1.3
                                }}>
                                    {topic.title}
                                </h4>
                                <p style={{
                                    margin: 0,
                                    fontSize: '0.95rem',
                                    color: 'var(--text-muted)',
                                    lineHeight: 1.5,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {topic.description}
                                </p>
                            </div>

                            <div style={{
                                marginTop: 'auto',
                                paddingTop: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: getLevelColor(topic.level),
                                fontSize: '0.9rem',
                                fontWeight: 700
                            }}>
                                Darsni boshlash <ChevronRight size={18} />
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    background: 'var(--subtle-bg)',
                    borderRadius: '1.5rem',
                    border: '1px dashed var(--border-color)'
                }}>
                    <Filter size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
                    <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Mavzular topilmadi</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Qidiruv so'zini o'zgartirib ko'ring yoki boshqa darajani tanlang.</p>
                    <button
                        onClick={() => { setSelectedLevel('All'); setSearchQuery(''); }}
                        className="btn btn-secondary"
                        style={{ marginTop: '1.5rem' }}
                    >
                        Filtrlarni tozalash
                    </button>
                </div>
            )}
        </div>
    );
};
