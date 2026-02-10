import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { Flashcard } from './components/Flashcard';
import { WordManager } from './components/WordManager';
import { ShopModal } from './components/ShopModal';
import { firebaseService } from './api/firebaseService';
import { authService } from './api/authService';
import { Auth } from './components/Auth';
import type { Word } from './types';
import { ArrowLeft, LogOut, CheckCircle, Sun, Moon } from 'lucide-react';
import type { User } from 'firebase/auth';
import confetti from 'canvas-confetti';
import { soundService } from './api/soundService';
import { srsService } from './api/srsService';
import { gamificationService } from './utils/gamificationService';
import type { UserProfile } from './types';

import { Quiz } from './components/Quiz';
import { SpellingQuiz } from './components/SpellingQuiz';
import { ReloadPrompt } from './components/ReloadPrompt';

import { SpeakingQuiz } from './components/SpeakingQuiz';
import { GrammarDashboard } from './components/GrammarDashboard';
import { GrammarLesson } from './components/GrammarLesson';
import { Settings } from './components/Settings';

type StudyMode = 'flashcard' | 'quiz' | 'spelling' | 'speaking';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    xp: 0,
    level: 1,
    coins: 0,
    inventory: []
  });
  const [authLoading, setAuthLoading] = useState(true);
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dailyGoal, setDailyGoal] = useState<number>(10);
  const [streak, setStreak] = useState<number>(0);
  const [lastActivity, setLastActivity] = useState<string | undefined>(undefined);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('vocab_theme');
    return saved ? saved === 'dark' : true;
  });

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
      setUserProfile({
        xp: settings.xp || 0,
        level: settings.level || 1,
        coins: settings.coins || 0,
        inventory: settings.inventory || [],
        activeTheme: settings.activeTheme,
        activeAvatar: settings.activeAvatar
      });
      setError(null);
    } catch (err: any) {
      console.error("Failed to load words:", err);
      setError(`Firebase Error: ${err.message || "Unknown error"}. Check console for details.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadWords();
    } else {
      setWords([]);
      setUserProfile({
        xp: 0,
        level: 1,
        coins: 0,
        inventory: []
      });
    }
  }, [user]);

  // Apply Theme
  useEffect(() => {
    if (userProfile.activeTheme) {
      document.documentElement.setAttribute('data-theme', userProfile.activeTheme);
      const themeColors: Record<string, string> = {
        'theme-ocean': '#0ea5e9',
        'theme-forest': '#22c55e',
        'theme-sunset': '#f59e0b',
        'theme-cyber': '#d946ef'
      };
      if (themeColors[userProfile.activeTheme]) {
        document.documentElement.style.setProperty('--accent', themeColors[userProfile.activeTheme]);
        document.documentElement.style.setProperty('--accent-glow', `${themeColors[userProfile.activeTheme]}60`);
      }
    }
  }, [userProfile.activeTheme]);

  const handleStartStudy = (mode: StudyMode = 'flashcard', category?: string) => {
    const today = new Date().toISOString();
    let candidateWords = words;
    if (category) {
      candidateWords = words.filter(w => w.category === category);
    }

    const dueForReview = candidateWords.filter(w =>
      w.status !== 'learned' &&
      (w.nextReviewDate ? w.nextReviewDate <= today : true)
    );

    const toLearn = dueForReview.length > 0 ? dueForReview : candidateWords.filter(w => w.status !== 'learned');

    if (toLearn.length === 0) {
      alert("Bu bo'limda yodlash uchun so'zlar qolmagan yoki vaqti kelmagan!");
      return;
    }

    const shuffled = [...toLearn].sort(() => Math.random() - 0.5);
    setStudyQueue(shuffled);
    setCurrentIndex(0);
    setStudyMode(mode);
    navigate(`/study/${mode}`);
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

    const rewards = gamificationService.calculateRewards(known, streak);
    const newXP = userProfile.xp + rewards.xp;
    const newCoins = userProfile.coins + rewards.coins;

    const oldLevelInfo = gamificationService.getLevel(userProfile.xp);
    const newLevelInfo = gamificationService.getLevel(newXP);

    if (newLevelInfo.current.level > oldLevelInfo.current.level) {
      soundService.playSuccess();
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
      });
      alert(`Tabriklaymiz! Siz ${newLevelInfo.current.level}-darajaga (${newLevelInfo.current.title}) chiqdingiz!`);
    }

    const updatedProfile = {
      ...userProfile,
      xp: newXP,
      coins: newCoins,
      level: newLevelInfo.current.level
    };

    setUserProfile(updatedProfile);
    firebaseService.updateSettings(user.uid, {
      xp: newXP,
      coins: newCoins,
      level: newLevelInfo.current.level
    });

    const quality = known ? 5 : 1;
    const updatedWord = srsService.calculateReview(word, quality);

    setWords(words.map(w => w.id === word.id ? updatedWord : w));

    try {
      await firebaseService.updateWord(user.uid, updatedWord);
    } catch (err: any) {
      console.error("Failed to update word in Firebase:", err);
      setError("Progressni saqlashda xatolik yuz berdi: " + err.message);
    }

    if (currentIndex < studyQueue.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
    } else {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });
      try {
        await updateStreak();
      } catch (err: any) {
        console.error("Failed to update streak:", err);
      }
      setTimeout(() => navigate('/'), 1500);
    }
  };

  const handleLogout = async () => {
    await authService.signOut();
    navigate('/');
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
    <>
      <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
        <ReloadPrompt />
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
          {location.pathname !== '/' && (
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/')}
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
              </div>
            </div>
          )}

          <Routes>
            <Route path="/" element={
              <Dashboard
                userProfile={userProfile}
                words={words}
                dailyGoal={dailyGoal}
                streak={streak}
                onStart={handleStartStudy}
                onReset={() => {
                  if (confirm('Are you sure you want to clear all local data? (Firebase data remains)')) {
                    setWords([]);
                  }
                }}
                onOpenShop={() => setIsShopOpen(true)}
              />
            } />

            <Route path="/manage" element={
              <WordManager
                userId={user.uid}
                words={words}
                initialFilter={'all'}
                onUpdate={(updated: Word[]) => setWords(updated)}
              />
            } />

            <Route path="/settings" element={
              <Settings
                dailyGoal={dailyGoal}
                onUpdateGoal={handleUpdateGoal}
              />
            } />

            <Route path="/grammar" element={<GrammarDashboard />} />
            <Route path="/grammar/:topicId" element={<GrammarLesson />} />

            <Route path="/study/:mode" element={
              studyQueue.length > 0 ? (
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
                  ) : studyMode === 'speaking' ? (
                    <SpeakingQuiz
                      key={studyQueue[currentIndex].id}
                      word={studyQueue[currentIndex]}
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
              ) : (
                <Navigate to="/" replace />
              )
            } />
          </Routes>
        </main>
      </div>

      {isShopOpen && (
        <ShopModal
          userProfile={userProfile}
          onClose={() => setIsShopOpen(false)}
          onBuy={async (itemId, price, _type) => {
            const newCoins = userProfile.coins - price;
            const newInventory = [...userProfile.inventory, itemId];
            const updatedProfile = {
              ...userProfile,
              coins: newCoins,
              inventory: newInventory
            };

            setUserProfile(updatedProfile);
            soundService.playSuccess();

            if (user) {
              await firebaseService.updateSettings(user.uid, {
                coins: newCoins,
                inventory: newInventory
              });
            }
          }}
          onEquip={async (itemId, type) => {
            const updatedProfile = type === 'theme'
              ? { ...userProfile, activeTheme: itemId }
              : { ...userProfile, activeAvatar: itemId };
            setUserProfile(updatedProfile);

            if (user) {
              await firebaseService.updateSettings(user.uid, {
                [type === 'theme' ? 'activeTheme' : 'activeAvatar']: itemId
              });
            }
          }}
        />
      )}
    </>
  );
}

export default App;
