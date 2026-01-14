export interface Word {
  id: string;
  english: string;
  uzbek: string;
  status: 'new' | 'learning' | 'learned';
  category?: string;
  learnedAt?: string; // ISO timestamp
  masteryLevel?: number; // 0-4
  lastReviewedAt?: string;
}

export interface AppState {
  words: Word[];
  dailyGoal: number;
  wordsLearnedToday: number;
}
