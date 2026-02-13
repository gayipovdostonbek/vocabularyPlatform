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

export interface Verb {
  id: number;
  base: string;
  past: string;
  pastParticiple: string;
  translation_uz: string;
  level: string;
  example_sentence: string;
  example_translation_uz: string;
  isIrregular: boolean;
}
