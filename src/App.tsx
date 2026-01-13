
import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Flashcard } from './components/Flashcard';
import { ConnectionManager } from './components/ConnectionManager';
import { WordManager } from './components/WordManager';
import type { Word } from './types';
import { ArrowLeft } from 'lucide-react';

type ViewMode = 'IMPORT' | 'DASHBOARD' | 'STUDY' | 'MANAGE';

function App() {
  const [words, setWords] = useState<Word[]>([]);
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>('IMPORT');

  // Study session state
  const [studyQueue, setStudyQueue] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load from local storage on mount
  useEffect(() => {
    const savedWords = localStorage.getItem('vocab_words');
    const savedUrl = localStorage.getItem('vocab_url');
    if (savedWords) {
      setWords(JSON.parse(savedWords));
      if (savedUrl) setSheetUrl(savedUrl);
      setView('DASHBOARD');
    }
  }, []);

  useEffect(() => {
    if (sheetUrl) console.log('Loaded sheet:', sheetUrl);
  }, [sheetUrl]);

  // Save to local storage whenever words change
  useEffect(() => {
    if (words.length > 0) {
      localStorage.setItem('vocab_words', JSON.stringify(words));
    }
  }, [words]);

  const handleConnect = (importedWords: Word[], url: string) => {
    setWords(importedWords);
    setSheetUrl(url);
    localStorage.setItem('vocab_url', url);
    setView('DASHBOARD');
  };

  const handleStartStudy = () => {
    const toLearn = words.filter(w => w.status !== 'learned');
    // Shuffle
    const shuffled = [...toLearn].sort(() => Math.random() - 0.5);
    setStudyQueue(shuffled);
    setCurrentIndex(0);
    setView('STUDY');
  };

  const handleCardResult = (word: Word, known: boolean) => {
    if (known) {
      // Mark as learned in global state
      const newWords = words.map(w => w.id === word.id ? { ...w, status: 'learned' as const } : w);
      setWords(newWords);
    } else {
      // Keep as 'learning' or 'new'
      // Maybe add to end of queue if we want to immediately review? 
      // For now, simple flashcard flow.
    }

    // Move to next
    if (currentIndex < studyQueue.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 300); // slight delay for animation
    } else {
      // End of session
      setView('DASHBOARD');
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to clear all data?')) {
      localStorage.removeItem('vocab_words');
      localStorage.removeItem('vocab_url');
      setWords([]);
      setSheetUrl(null);
      setView('IMPORT');
    }
  };

  return (
    <div className="App">
      {view === 'STUDY' && (
        <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
          <button className="btn btn-secondary" onClick={() => setView('DASHBOARD')} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 1rem' }}>
            <ArrowLeft size={16} /> Quit
          </button>
        </div>
      )}

      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {view === 'IMPORT' && <ConnectionManager onConnect={handleConnect} />}

        {view === 'DASHBOARD' && (
          <Dashboard
            words={words}
            onStart={handleStartStudy}
            onReset={handleReset}
            onManage={() => setView('MANAGE')}
          />
        )}

        {view === 'MANAGE' && sheetUrl && (
          <WordManager
            words={words}
            scriptUrl={sheetUrl}
            onUpdate={(updated) => setWords(updated)}
            onClose={() => setView('DASHBOARD')}
          />
        )}

        {view === 'STUDY' && studyQueue.length > 0 && (
          <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-muted)' }}>
              Word {currentIndex + 1} of {studyQueue.length}
            </div>

            <Flashcard
              key={studyQueue[currentIndex].id} // Key ensures remount on change for animation reset
              word={studyQueue[currentIndex]}
              onResult={handleCardResult}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
