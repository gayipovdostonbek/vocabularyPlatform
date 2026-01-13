import type { Word } from '../types';

export const sheetService = {
  
  async syncWords(scriptUrl: string): Promise<Word[]> {
    const response = await fetch(`${scriptUrl}?action=read`);
    const json = await response.json();
    if (json.success) {
      return json.data.map((row: any) => ({
        id: row.id,
        english: row.english,
        uzbek: row.uzbek,
        status: row.status || 'new'
      }));
    }
    throw new Error(json.message || 'Failed to sync');
  },

  async addWord(scriptUrl: string, word: { english: string; uzbek: string }): Promise<string> {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({ action: 'add', ...word })
    });
    const json = await response.json();
    if(json.success) return json.id;
    throw new Error(json.message);
  },

  async updateWord(scriptUrl: string, word: Word): Promise<void> {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({ action: 'update', ...word })
    });
    const json = await response.json();
    if(!json.success) throw new Error(json.message);
  },

  async deleteWord(scriptUrl: string, id: string): Promise<void> {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({ action: 'delete', id })
    });
    const json = await response.json();
    if(!json.success) throw new Error(json.message);
  }
};
