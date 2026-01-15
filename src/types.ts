export interface Word {
  id: string;
  english: string;
  uzbek: string;
  status: 'new' | 'learning' | 'learned';
  learnedAt?: string; // ISO timestamp
  masteryLevel?: number; // 0-4
  lastReviewedAt?: string;
  example?: string;
  exampleTranslation?: string;
  category?: string;
}

export interface AppState {
  words: Word[];
  dailyGoal: number;
  wordsLearnedToday: number;
}
