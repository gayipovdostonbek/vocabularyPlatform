export interface Word {
  id: string;
  english: string;
  uzbek: string;
  status: 'new' | 'learning' | 'learned';
}

export interface AppState {
  words: Word[];
  googleSheetUrl: string | null;
  dailyGoal: number;
  wordsLearnedToday: number;
}
