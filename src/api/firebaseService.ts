import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, getDoc, setDoc } from 'firebase/firestore';
import type { Word } from '../types';

const getWordsCollection = (userId: string) => collection(db, 'users', userId, 'words');

const cleanData = (obj: any) => {
    const newObj = { ...obj };
    Object.keys(newObj).forEach(key => {
        if (newObj[key] === undefined || newObj[key] === null) {
            delete newObj[key];
        }
    });
    return newObj;
};

export const firebaseService = {
  
  async syncWords(userId: string): Promise<Word[]> {
    const q = query(getWordsCollection(userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Word));
  },

  async addWord(userId: string, word: { english: string; uzbek: string; example?: string; exampleTranslation?: string; category?: string }): Promise<string> {
    const docRef = await addDoc(getWordsCollection(userId), cleanData({
      ...word,
      status: 'new',
      createdAt: new Date().toISOString()
    }));
    return docRef.id;
  },

  async updateWord(userId: string, word: Word): Promise<void> {
    const wordRef = doc(db, 'users', userId, 'words', word.id);
    const { id, ...data } = word;
    
    const cleanUpdate = cleanData(data);

    if (cleanUpdate.status === 'learned' && !cleanUpdate.learnedAt) {
        cleanUpdate.learnedAt = new Date().toISOString();
    } else if (cleanUpdate.status !== 'learned') {
        // We don't set to undefined here, we just leave it out 
        // Or if we want to explicitly remove it, we'd need deleteField()
    }

    await updateDoc(wordRef, cleanUpdate);
  },

  async deleteWord(userId: string, id: string): Promise<void> {
    const wordRef = doc(db, 'users', userId, 'words', id);
    await deleteDoc(wordRef);
  },

  async getSettings(userId: string): Promise<{ dailyGoal: number; currentStreak: number; lastActivityDate?: string; xp?: number; level?: number; coins?: number; inventory?: string[]; activeTheme?: string }> {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
        const data = userSnap.data();
        return { 
            dailyGoal: data.dailyGoal || 10,
            currentStreak: data.currentStreak || 0,
            lastActivityDate: data.lastActivityDate,
            xp: data.xp || 0,
            level: data.level || 1,
            coins: data.coins || 0,
            inventory: data.inventory || [],
            activeTheme: data.activeTheme
        };
    }
    return { dailyGoal: 10, currentStreak: 0, xp: 0, level: 1, coins: 0, inventory: [] };
  },

  async updateSettings(userId: string, settings: Partial<{ dailyGoal: number; currentStreak: number; lastActivityDate: string; xp: number; level: number; coins: number; inventory: string[]; activeTheme: string }>): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, cleanData(settings), { merge: true });
  },

  async updateLeaderboard(userId: string, displayName: string, xp: number, level: number, avatar?: string): Promise<void> {
    const leaderboardRef = doc(db, 'leaderboard', userId);
    await setDoc(leaderboardRef, cleanData({
      displayName,
      xp,
      level,
      avatar,
      lastUpdated: new Date().toISOString()
    }), { merge: true });
  },

  async getLeaderboard(limit: number = 50): Promise<any[]> {
    const leaderboardCollection = collection(db, 'leaderboard');
    const q = query(leaderboardCollection);
    const querySnapshot = await getDocs(q);
    
    const entries = querySnapshot.docs.map(doc => ({
      userId: doc.id,
      ...doc.data()
    }));

    // Sort by XP descending
    entries.sort((a, b) => (b.xp || 0) - (a.xp || 0));
    
    // Add rank and limit
    return entries.slice(0, limit).map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
  },

  async getUserRank(userId: string): Promise<number> {
    const leaderboard = await this.getLeaderboard(1000); // Get more entries to find user
    const userEntry = leaderboard.find(entry => entry.userId === userId);
    return userEntry ? userEntry.rank : -1;
  }
};
