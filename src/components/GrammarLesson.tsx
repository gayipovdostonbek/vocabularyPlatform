import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, BookOpen, Layout, AlertCircle, Volume2, ChevronRight, CheckCircle2, Info } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { grammarTopics } from '../data/grammarData';
import { soundService } from '../api/soundService';
import confetti from 'canvas-confetti';

export const GrammarLesson: React.FC = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const navigate = useNavigate();
    const topic = useMemo(() => grammarTopics.find(t => t.id === topicId), [topicId]);
    const [activeTab, setActiveTab] = useState<'learn' | 'quiz'>('learn');
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    // Get neighboring topics for navigation
    const currentIndex = grammarTopics.findIndex(t => t.id === topicId);
    const nextTopic = currentIndex < grammarTopics.length - 1 ? grammarTopics[currentIndex + 1] : null;

    useEffect(() => {
        window.scrollTo(0, 0);
        setActiveTab('learn');
        setShowResults(false);
        setQuizAnswers({});
    }, [topicId]);

    if (!topic) {
        return <div style={{ textAlign: 'center', padding: '4rem' }}>Mavzu topilmadi</div>;
    }

    const handleQuizSubmit = () => {
        setShowResults(true);
        const correctCount = topic.quiz?.filter((q, i) => quizAnswers[i] === q.correctAnswer).length || 0;
        setScore(correctCount);

        if (correctCount === topic.quiz?.length) {
            soundService.playSuccess();
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#8b5cf6', '#10b981', '#3b82f6']
            });
        } else if (correctCount > 0) {
            soundService.playSuccess();
        } else {
            soundService.playFailure();
        }
    };

    const resetQuiz = () => {
        setQuizAnswers({});
        setShowResults(false);
    };

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

    const levelColor = getLevelColor(topic.level);

    return (
        <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '5rem' }}>
            {/* Header Content */}
            <div style={{
                marginBottom: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button
                        onClick={() => navigate('/grammar')}
                        className="btn btn-secondary"
                        style={{ padding: '0.5rem 1rem', borderRadius: '1rem' }}
                    >
                        <ArrowLeft size={18} /> Orqaga
                    </button>
                    <div style={{
                        padding: '0.4rem 1rem',
                        borderRadius: '2rem',
                        background: `${levelColor}15`,
                        color: levelColor,
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        border: `1px solid ${levelColor}30`,
                        letterSpacing: '1px'
                    }}>
                        {topic.level.toUpperCase()}
                    </div>
                </div>

                <div style={{ textAlign: 'left' }}>
                    <h1 style={{
                        margin: '0 0 0.5rem 0',
                        fontSize: '2.4rem',
                        fontWeight: 900,
                        background: 'var(--title-gradient)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        {topic.title}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '700px' }}>
                        {topic.description}
                    </p>
                </div>
            </div>

            {/* Main Tabs Container */}
            <div className="glass-panel" style={{ overflow: 'hidden', padding: 0 }}>
                <div style={{
                    display: 'flex',
                    background: 'rgba(0,0,0,0.05)',
                    borderBottom: '1px solid var(--border-color)',
                    padding: '0.5rem'
                }}>
                    <button
                        onClick={() => setActiveTab('learn')}
                        style={{
                            flex: 1,
                            background: activeTab === 'learn' ? 'var(--bg-secondary)' : 'transparent',
                            border: 'none',
                            padding: '1rem',
                            borderRadius: '0.75rem',
                            fontSize: '1rem',
                            fontWeight: 700,
                            color: activeTab === 'learn' ? 'var(--accent)' : 'var(--text-muted)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.6rem',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        <BookOpen size={20} /> O'rganish
                    </button>
                    {topic.quiz && (
                        <button
                            onClick={() => setActiveTab('quiz')}
                            style={{
                                flex: 1,
                                background: activeTab === 'quiz' ? 'var(--bg-secondary)' : 'transparent',
                                border: 'none',
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                fontSize: '1rem',
                                fontWeight: 700,
                                color: activeTab === 'quiz' ? 'var(--accent)' : 'var(--text-muted)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.6rem',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            <CheckCircle2 size={20} /> Bilimni sinash
                        </button>
                    )}
                </div>

                <div style={{ padding: '2.5rem' }}>
                    {activeTab === 'learn' ? (
                        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                            {/* Rule Section */}
                            <section>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                    <div style={{
                                        padding: '0.5rem',
                                        borderRadius: '0.75rem',
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        color: '#3b82f6'
                                    }}>
                                        <Layout size={22} />
                                    </div>
                                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Dars qoidasi</h3>
                                </div>
                                <div style={{
                                    lineHeight: 1.7,
                                    fontSize: '1.15rem',
                                    color: 'var(--text-main)',
                                    background: 'var(--subtle-bg)',
                                    padding: '1.5rem',
                                    borderRadius: '1rem',
                                    border: '1px solid var(--border-color)',
                                    whiteSpace: 'pre-line'
                                }}>
                                    {topic.content.rule}
                                </div>
                            </section>

                            {/* Formulas Grid */}
                            <section>
                                <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.4rem', fontWeight: 800 }}>Gap tuzilishi</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                                    {topic.content.formulas.map((formula, idx) => (
                                        <div key={idx} className="interactable" style={{
                                            background: 'var(--subtle-bg)',
                                            padding: '1.5rem',
                                            borderRadius: '1.25rem',
                                            border: '1px solid var(--border-color)',
                                            borderTop: `4px solid ${formula.type === 'positive' ? 'var(--success)' :
                                                formula.type === 'negative' ? 'var(--error)' : 'var(--level-a1)'
                                                }`
                                        }}>
                                            <div style={{
                                                fontSize: '0.75rem',
                                                textTransform: 'uppercase',
                                                fontWeight: 800,
                                                color: 'var(--text-muted)',
                                                marginBottom: '0.75rem',
                                                letterSpacing: '0.5px'
                                            }}>
                                                {formula.type === 'positive' ? 'Positive (Darak)' :
                                                    formula.type === 'negative' ? 'Negative (Inkor)' : 'Question (So\'roq)'}
                                            </div>
                                            <div style={{
                                                fontFamily: '"SF Mono", Menlo, monospace',
                                                fontSize: '1.2rem',
                                                fontWeight: 700,
                                                marginBottom: '1rem',
                                                color: 'var(--text-main)'
                                            }}>
                                                {formula.structure}
                                            </div>
                                            <div style={{
                                                paddingTop: '1rem',
                                                borderTop: '1px solid var(--border-color)',
                                                fontStyle: 'italic',
                                                color: 'var(--text-muted)'
                                            }}>
                                                <span style={{ fontWeight: 600 }}>Misol:</span> {formula.example}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Examples with Audio */}
                            <section>
                                <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.4rem', fontWeight: 800 }}>Misollar bilan mashq</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {topic.content.examples.map((ex, idx) => (
                                        <div key={idx} className="interactable" style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '1.25rem 1.5rem',
                                            background: 'var(--subtle-bg)',
                                            borderRadius: '1rem',
                                            border: '1px solid var(--border-color)',
                                            transition: 'all 0.2s'
                                        }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.4rem', color: 'var(--accent)' }}>
                                                    {ex.english}
                                                </div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                                                    {ex.uzbek}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => soundService.speak(ex.english)}
                                                className="btn-icon"
                                                style={{
                                                    width: '44px',
                                                    height: '44px',
                                                    borderRadius: '50%',
                                                    background: 'var(--bg-secondary)',
                                                    border: '1px solid var(--border-color)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'var(--accent)',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Volume2 size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Note Section */}
                            {topic.content.note && (
                                <section style={{
                                    padding: '1.5rem',
                                    background: 'rgba(245, 158, 11, 0.05)',
                                    border: '1px solid rgba(245, 158, 11, 0.2)',
                                    borderRadius: '1.25rem',
                                    display: 'flex',
                                    gap: '1rem'
                                }}>
                                    <div style={{ color: 'var(--level-b2)', marginTop: '0.2rem' }}>
                                        <Info size={24} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 800, color: 'var(--level-b2)', marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.85rem' }}>Eslatma va maslahat:</div>
                                        <div style={{ whiteSpace: 'pre-line', fontSize: '1.1rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
                                            {topic.content.note}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Navigation to next topic */}
                            {nextTopic && (
                                <div style={{
                                    marginTop: '1rem',
                                    paddingTop: '2rem',
                                    borderTop: '1px solid var(--border-color)',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => navigate(`/grammar/${nextTopic.id}`)}
                                        style={{ padding: '1rem 2.5rem', borderRadius: '2rem' }}
                                    >
                                        Keyingi mavzu: {nextTopic.title} <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Bilimingizni sinab ko'ring</h3>
                                {showResults && (
                                    <div style={{
                                        fontWeight: 800,
                                        fontSize: '1.2rem',
                                        color: score === topic.quiz?.length ? 'var(--success)' : 'var(--accent)'
                                    }}>
                                        Natija: {score} / {topic.quiz?.length}
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'grid', gap: '2.5rem' }}>
                                {topic.quiz?.map((q, qIdx) => (
                                    <div key={qIdx} style={{
                                        padding: '1.5rem',
                                        background: 'var(--subtle-bg)',
                                        borderRadius: '1.25rem',
                                        border: '1px solid var(--border-color)'
                                    }}>
                                        <p style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
                                            <span style={{ opacity: 0.5, marginRight: '0.5rem' }}>{qIdx + 1}.</span> {q.question}
                                        </p>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                            {q.options.map((opt, oIdx) => {
                                                const isSelected = quizAnswers[qIdx] === oIdx;
                                                const isCorrect = q.correctAnswer === oIdx;

                                                let stateStyles: {
                                                    bg: string;
                                                    border: string;
                                                    color: string;
                                                    icon: React.ReactNode;
                                                } = {
                                                    bg: 'var(--bg-secondary)',
                                                    border: '1px solid var(--border-color)',
                                                    color: 'var(--text-main)',
                                                    icon: null
                                                };

                                                if (showResults) {
                                                    if (isCorrect) {
                                                        stateStyles = {
                                                            bg: 'rgba(16, 185, 129, 0.2)',
                                                            border: '2px solid var(--success)',
                                                            color: 'var(--success)',
                                                            icon: <CheckCircle2 size={18} />
                                                        };
                                                    } else if (isSelected) {
                                                        stateStyles = {
                                                            bg: 'rgba(239, 68, 68, 0.15)',
                                                            border: '2px solid var(--error)',
                                                            color: 'var(--error)',
                                                            icon: <AlertCircle size={18} />
                                                        };
                                                    }
                                                } else if (isSelected) {
                                                    stateStyles = {
                                                        bg: 'var(--accent)',
                                                        border: '2px solid var(--accent)',
                                                        color: 'white',
                                                        icon: null
                                                    };
                                                }

                                                return (
                                                    <button
                                                        key={oIdx}
                                                        disabled={showResults}
                                                        onClick={() => {
                                                            setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
                                                            soundService.playSuccess(); // Light feedback sound
                                                        }}
                                                        className="interactable"
                                                        style={{
                                                            padding: '1rem 1.25rem',
                                                            borderRadius: '1rem',
                                                            background: stateStyles.bg,
                                                            border: stateStyles.border,
                                                            color: stateStyles.color,
                                                            cursor: showResults ? 'default' : 'pointer',
                                                            textAlign: 'left',
                                                            fontWeight: 600,
                                                            fontSize: '1.05rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            gap: '1rem'
                                                        }}
                                                    >
                                                        {opt}
                                                        {stateStyles.icon}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '2rem' }}>
                                {!showResults ? (
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleQuizSubmit}
                                        disabled={Object.keys(quizAnswers).length < (topic.quiz?.length || 0)}
                                        style={{ width: '100%', padding: '1.25rem', borderRadius: '1rem', fontSize: '1.1rem' }}
                                    >
                                        Natijani tekshirish
                                    </button>
                                ) : (
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={resetQuiz}
                                            style={{ flex: 1, padding: '1rem', borderRadius: '1rem' }}
                                        >
                                            Qayta urinib ko'rish
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => setActiveTab('learn')}
                                            style={{ flex: 1, padding: '1rem', borderRadius: '1rem' }}
                                        >
                                            Qayta o'qish
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
