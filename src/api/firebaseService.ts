import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, getDoc, setDoc } from 'firebase/firestore';
import type { Word } from '../types';

const getWordsCollection = (userId: string) => collection(db, 'users', userId, 'words');

export const firebaseService = {
  
  async syncWords(userId: string): Promise<Word[]> {
    const q = query(getWordsCollection(userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Word));
  },

  async addWord(userId: string, word: { english: string; uzbek: string; example?: string; exampleTranslation?: string }): Promise<string> {
    const docRef = await addDoc(getWordsCollection(userId), {
      ...word,
      status: 'new',
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  },

  async updateWord(userId: string, word: Word): Promise<void> {
    const wordRef = doc(db, 'users', userId, 'words', word.id);
    const { id, ...data } = word;
    
    if (data.status === 'learned' && !data.learnedAt) {
        data.learnedAt = new Date().toISOString();
    } else if (data.status !== 'learned') {
        data.learnedAt = undefined;
    }

    await updateDoc(wordRef, data);
  },

  async deleteWord(userId: string, id: string): Promise<void> {
    const wordRef = doc(db, 'users', userId, 'words', id);
    await deleteDoc(wordRef);
  },

  async getSettings(userId: string): Promise<{ dailyGoal: number; currentStreak: number; lastActivityDate?: string }> {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
        const data = userSnap.data();
        return { 
            dailyGoal: data.dailyGoal || 10,
            currentStreak: data.currentStreak || 0,
            lastActivityDate: data.lastActivityDate
        };
    }
    return { dailyGoal: 10, currentStreak: 0 };
  },

  async updateSettings(userId: string, settings: Partial<{ dailyGoal: number; currentStreak: number; lastActivityDate: string }>): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, settings, { merge: true });
  }
};
