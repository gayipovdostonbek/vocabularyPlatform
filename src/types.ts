export interface Word {
  id: string;
  english: string;
  uzbek: string;
  example?: string;
  exampleTranslation?: string;
  category?: string;
  status: 'new' | 'learning' | 'learned';
  createdAt?: string;
  interval?: number;
  repetitions?: number;
  easeFactor?: number;
  nextReviewDate?: string;
  lastReviewedAt?: string;
  masteryLevel?: number;
  learnedAt?: string;
}

export interface UserProfile {
  xp: number;
  level: number;
  coins: number;
  inventory: string[];
  activeTheme?: string;
  activeAvatar?: string;
}
