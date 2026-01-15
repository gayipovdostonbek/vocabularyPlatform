import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Flashcard } from './components/Flashcard';
import { WordManager } from './components/WordManager';
import { firebaseService } from './api/firebaseService';
import { authService } from './api/authService';
import { Auth } from './components/Auth';
import type { Word } from './types';
import { ArrowLeft, LogOut, CheckCircle, Sun, Moon } from 'lucide-react';
import type { User } from 'firebase/auth';
import confetti from 'canvas-confetti';
import { soundService } from './api/soundService';

import { Quiz } from './components/Quiz';
import { SpellingQuiz } from './components/SpellingQuiz';

type ViewMode = 'DASHBOARD' | 'STUDY' | 'MANAGE' | 'SETTINGS';
type StudyMode = 'flashcard' | 'quiz' | 'spelling';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [words, setWords] = useState<Word[]>([]);
  const [view, setView] = useState<ViewMode>('DASHBOARD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dailyGoal, setDailyGoal] = useState<number>(10);
  const [streak, setStreak] = useState<number>(0);
  const [lastActivity, setLastActivity] = useState<string | undefined>(undefined);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('vocab_theme');
    return saved ? saved === 'dark' : true;
  });

  const [wordFilter, setWordFilter] = useState<'all' | 'learning' | 'learned'>('all');
  const [studyMode, setStudyMode] = useState<StudyMode>('flashcard');
  const [studyQueue, setStudyQueue] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = authService.onAuthChange((u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
    localStorage.setItem('vocab_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const loadWords = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [fetchedWords, settings] = await Promise.all([
        firebaseService.syncWords(user.uid),
        firebaseService.getSettings(user.uid)
      ]);
      setWords(fetchedWords);
      setDailyGoal(settings.dailyGoal);
      setStreak(settings.currentStreak);
      setLastActivity(settings.lastActivityDate);
      setError(null);
    } catch (err: any) {
      console.error("Failed to load words:", err);
      setError("Failed to connect to Firebase. Check your configuration.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadWords();
    } else {
      setWords([]);
    }
  }, [user]);

  const handleStartStudy = (mode: StudyMode = 'flashcard') => {
    const toLearn = words.filter(w => w.status !== 'learned');

    if (toLearn.length === 0) {
      alert("Yodlash uchun yangi so'zlar qolmagan!");
      return;
    }

    const shuffled = [...toLearn].sort(() => Math.random() - 0.5);
    setStudyQueue(shuffled);
    setCurrentIndex(0);
    setStudyMode(mode);
    setView('STUDY');
  };

  const handleUpdateGoal = async (newGoal: number) => {
    setDailyGoal(newGoal);
    if (user) {
      await firebaseService.updateSettings(user.uid, { dailyGoal: newGoal });
    }
    localStorage.setItem('vocab_daily_goal', newGoal.toString());
  };

  const handleCardResult = async (word: Word, known: boolean) => {
    if (!user) return;

    if (known) {
      soundService.playSuccess();
    } else {
      soundService.playFailure();
    }

    const currentMastery = word.masteryLevel || 0;
    let nextMastery = known ? Math.min(4, currentMastery + 1) : Math.max(0, currentMastery - 1);
    const isNowLearned = nextMastery === 4;

    const updatedWord: Word = {
      ...word,
      masteryLevel: nextMastery,
      status: isNowLearned ? 'learned' : 'learning',
      lastReviewedAt: new Date().toISOString(),
      learnedAt: isNowLearned ? new Date().toISOString() : word.learnedAt
    };

    // Update local state
    setWords(words.map(w => w.id === word.id ? updatedWord : w));

    // Update Firebase
    try {
      await firebaseService.updateWord(user.uid, updatedWord);
    } catch (err: any) {
      console.error("Failed to update word in Firebase:", err);
      setError("Progressni saqlashda xatolik yuz berdi: " + err.message);
    }

    // Move to next
    if (currentIndex < studyQueue.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
    } else {
      // Session End
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });
      try {
        await updateStreak(); // Sync streak on completion
      } catch (err: any) {
        console.error("Failed to update streak:", err);
      }
      setTimeout(() => setView('DASHBOARD'), 1500);
    }
  };

  const handleManage = (filter: 'all' | 'learning' | 'learned' = 'all') => {
    setWordFilter(filter);
    setView('MANAGE');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to clear all local data? (Firebase data remains)')) {
      setWords([]);
      setView('DASHBOARD');
    }
  };

  const handleLogout = async () => {
    await authService.signOut();
    setView('DASHBOARD');
  };

  const updateStreak = async () => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    if (lastActivity === today) return;

    let newStreak = streak;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastActivity === yesterdayStr) {
      newStreak += 1;
    } else if (!lastActivity || lastActivity !== today) {
      newStreak = 1;
    }

    setStreak(newStreak);
    setLastActivity(today);
    await firebaseService.updateSettings(user.uid, { currentStreak: newStreak, lastActivityDate: today });
  };

  if (authLoading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loader"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container" style={{ paddingTop: '5vh' }}>
        <Auth />
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <header className="glass-panel responsive-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        marginBottom: '2rem',
        borderRadius: '1.5rem',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--border-color)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 4px 10px var(--accent-glow)'
          }}>
            <CheckCircle size={22} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, background: 'var(--title-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>VocabMaster</h1>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.5px' }}>LEARN & MASTER</div>
          </div>
        </div>

        <div className="user-nav" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user.email && (
            <div style={{
              padding: '0.5rem 1rem',
              background: 'var(--subtle-bg)',
              borderRadius: '2rem',
              fontSize: '0.85rem',
              color: 'var(--text-main)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }} />
              {user.email.split('@')[0]}
            </div>
          )}

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{
              background: 'var(--subtle-bg)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            className="interactable"
            title={isDarkMode ? "Light mode" : "Dark mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: 'var(--error)',
              cursor: 'pointer',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            className="interactable"
            title="Chiqish"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <style>{`
        @media (max-width: 600px) {
          .responsive-header { 
            flex-direction: column !important; 
            gap: 1.5rem !important; 
            align-items: center !important; 
            text-align: center !important; 
            padding-bottom: 1.5rem !important;
          }
          .user-nav { 
            width: 100% !important; 
            justify-content: center !important; 
            flex-wrap: wrap;
          }
          .user-email { display: none !important; }
        }
      `}</style>

      <main>
        {view !== 'DASHBOARD' && (
          <button
            className="btn btn-secondary"
            onClick={() => setView('DASHBOARD')}
            style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={18} /> Dashboardga qaytish
          </button>
        )}

        {loading && <div style={{ textAlign: 'center', padding: '2rem' }}>Ma'lumotlar sinxronizatsiya qilinmoqda...</div>}

        {error && (
          <div className="glass-panel" style={{ color: 'var(--error)', padding: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>⚠️</span>
            <div>
              <strong>Xatolik:</strong> {error}
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Iltimos, <code>src/firebaseConfig.ts</code> dagi sozlamalarni tekshiring.
              </p>
            </div>
          </div>
        )}

        {view === 'DASHBOARD' && (
          <Dashboard
            words={words}
            dailyGoal={dailyGoal}
            streak={streak}
            onStart={handleStartStudy}
            onReset={handleReset}
            onManage={handleManage}
            onOpenSettings={() => setView('SETTINGS')}
          />
        )}

        {view === 'SETTINGS' && (
          <div className="glass-panel animate-fade-in" style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Kunlik maqsad</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Har kuni nechtadan yangi so'z yodlamoqchisiz?</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <button
                className="btn btn-secondary"
                onClick={() => handleUpdateGoal(Math.max(1, dailyGoal - 5))}
                style={{ width: '40px', height: '40px', padding: 0 }}
              >
                -
              </button>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, minWidth: '80px' }}>{dailyGoal}</div>
              <button
                className="btn btn-secondary"
                onClick={() => handleUpdateGoal(dailyGoal + 5)}
                style={{ width: '40px', height: '40px', padding: 0 }}
              >
                +
              </button>
            </div>
            <button className="btn btn-primary" onClick={() => setView('DASHBOARD')} style={{ width: '100%' }}>Saqlash va qaytish</button>
          </div>
        )}

        {view === 'MANAGE' && (
          <WordManager
            userId={user.uid}
            words={words}
            initialFilter={wordFilter}
            onUpdate={(updated) => setWords(updated)}
            onClose={() => setView('DASHBOARD')}
          />
        )}

        {view === 'STUDY' && studyQueue.length > 0 && (
          <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-muted)' }}>
              So'z {currentIndex + 1} / {studyQueue.length}
            </div>

            {studyMode === 'flashcard' ? (
              <Flashcard
                key={studyQueue[currentIndex].id}
                word={studyQueue[currentIndex]}
                onResult={handleCardResult}
              />
            ) : studyMode === 'quiz' ? (
              <Quiz
                key={studyQueue[currentIndex].id}
                word={studyQueue[currentIndex]}
                allWords={words}
                onResult={handleCardResult}
              />
            ) : (
              <SpellingQuiz
                key={studyQueue[currentIndex].id}
                word={studyQueue[currentIndex]}
                onResult={handleCardResult}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
