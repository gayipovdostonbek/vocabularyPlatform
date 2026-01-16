import type { Word } from '../types';

/**
 * SuperMemo-2 (SM-2) Spaced Repetition Algorithm
 * 
 * Quality scale:
 * 5 - perfect response
 * 4 - correct response after a hesitation
 * 3 - correct response recalled with serious difficulty
 * 2 - incorrect response; where the correct one seemed easy to recall
 * 1 - incorrect response; the correct one remembered
 * 0 - complete blackout.
 */
export const srsService = {
  calculateReview: (word: Word, quality: number): Word => {
    let { interval = 0, repetitions = 0, easeFactor = 2.5 } = word;

    // If quality is less than 3, we restart repetitions
    if (quality < 3) {
      repetitions = 0;
      interval = 1;
    } else {
      repetitions += 1;
      
      // Interval calculation
      if (repetitions === 1) {
        interval = 1;
      } else if (repetitions === 2) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
    }

    // Ease Factor calculation (should not drop below 1.3)
    // Formula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    const newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    easeFactor = Math.max(1.3, newEaseFactor);

    // Calculate Next Review Date
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + interval);
    
    // Status update logic
    let status = word.status;
    if (repetitions >= 5 && status !== 'learned') {
        status = 'learned';
    } else if (status === 'new' && quality >= 3) {
        status = 'learning';
    }

    return {
      ...word,
      interval,
      repetitions,
      easeFactor,
      nextReviewDate: nextDate.toISOString(),
      status,
      lastReviewedAt: new Date().toISOString(),
      masteryLevel: Math.min(4, Math.floor(repetitions / 2)) // Approximate mapping to old mastery level
    };
  }
};
