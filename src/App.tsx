import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Flashcard } from './components/Flashcard';
import { WordManager } from './components/WordManager';
import { firebaseService } from './api/firebaseService';
import { authService } from './api/authService';
import { Auth } from './components/Auth';
import type { Word } from './types';
import { ArrowLeft, LogOut, CheckCircle } from 'lucide-react';
import type { User } from 'firebase/auth';
import confetti from 'canvas-confetti';
import { soundService } from './api/soundService';

type ViewMode = 'DASHBOARD' | 'STUDY' | 'MANAGE' | 'SETTINGS';

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

  const [studyQueue, setStudyQueue] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = authService.onAuthChange((u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

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

  const handleStartStudy = (category?: string) => {
    let toLearn = words.filter(w => w.status !== 'learned');
    if (category) {
      toLearn = toLearn.filter(w => w.category === category);
    }

    if (toLearn.length === 0) {
      alert("No words to learn in this category!");
      return;
    }

    const shuffled = [...toLearn].sort(() => Math.random() - 0.5);
    setStudyQueue(shuffled);
    setCurrentIndex(0);
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
    await firebaseService.updateWord(user.uid, updatedWord);

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
      await updateStreak(); // Sync streak on completion
      setTimeout(() => setView('DASHBOARD'), 1500);
    }
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
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 0',
        marginBottom: '2rem',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--accent)', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CheckCircle size={18} color="white" />
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>VocabMaster</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user.email}</span>
          <button
            onClick={handleLogout}
            style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            title="Chiqish"
          >
            <LogOut size={16} /> <span style={{ fontSize: '0.85rem' }}>Chiqish</span>
          </button>
        </div>
      </header>

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
            onManage={() => setView('MANAGE')}
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
            onUpdate={(updated) => setWords(updated)}
            onClose={() => setView('DASHBOARD')}
          />
        )}

        {view === 'STUDY' && studyQueue.length > 0 && (
          <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-muted)' }}>
              So'z {currentIndex + 1} / {studyQueue.length}
            </div>

            <Flashcard
              key={studyQueue[currentIndex].id}
              word={studyQueue[currentIndex]}
              onResult={handleCardResult}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
