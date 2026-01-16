import type { UserProfile } from '../types';

export const LEVELS = [
    { level: 1, xp: 0, title: "Yangi boshlovchi" },
    { level: 2, xp: 100, title: "O'quvchi" },
    { level: 3, xp: 250, title: "Bilimdon" },
    { level: 4, xp: 500, title: "Tajribali" },
    { level: 5, xp: 1000, title: "Lingvist" },
    { level: 6, xp: 2000, title: "Poliglot" },
    { level: 7, xp: 4000, title: "Master" },
    { level: 8, xp: 7000, title: "Afsona" },
    { level: 9, xp: 12000, title: "Daho" },
    { level: 10, xp: 20000, title: "Titan" },
];

export const gamificationService = {
    // Calculate level based on total XP
    getLevel: (xp: number) => {
        let currentLevel = LEVELS[0];
        let nextLevel = LEVELS[1];

        for (let i = 0; i < LEVELS.length - 1; i++) {
            if (xp >= LEVELS[i].xp) {
                currentLevel = LEVELS[i];
                nextLevel = LEVELS[i + 1] || { xp: Infinity, level: i + 2, title: 'Max' };
            }
        }
        
        return {
            current: currentLevel,
            next: { ...nextLevel, minXP: nextLevel.xp },
            progress: Math.min(100, Math.floor(((xp - currentLevel.xp) / (nextLevel.xp - currentLevel.xp)) * 100))
        };
    },

    // Calculate rewards for an action
    calculateRewards: (isCorrect: boolean, currentStreak: number) => {
        if (!isCorrect) return { xp: 2, coins: 0 }; // Even attempting gives small XP

        const baseXP = 10;
        const baseCoins = 5;
        
        // Streak multiplier
        const multiplier = Math.min(2, 1 + (currentStreak * 0.1)); // Max 2x multiplier

        return {
            xp: Math.round(baseXP * multiplier),
            coins: Math.round(baseCoins * multiplier)
        };
    }
};
