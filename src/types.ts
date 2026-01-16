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
  // SRS fields
  nextReviewDate?: string; // ISO timestamp
  interval?: number; // Days between reviews
  easeFactor?: number; // Multiplier (default 2.5)
  repetitions?: number; // Consecutive correct answers
}

export interface UserProfile {
  xp: number;
  level: number;
  coins: number;
  inventory: string[]; // IDs of unlocked items
  activeTheme?: string;
  activeAvatar?: string;
}

export interface AppState {
  words: Word[];
  userProfile: UserProfile;
  dailyGoal: number;
  wordsLearnedToday: number;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  xp: number;
  level: number;
  avatar?: string;
  rank: number;
}
