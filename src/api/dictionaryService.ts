
interface DictionaryEntry {
    word: string;
    meanings: {
        partOfSpeech: string;
        definitions: {
            definition: string;
            example?: string;
        }[];
    }[];
    phonetics: {
        text?: string;
        audio?: string;
    }[];
}

interface MyMemoryResponse {
    responseData: {
        translatedText: string;
        match: number;
    };
    responseStatus: number;
}

export const dictionaryService = {
    async lookupWord(word: string): Promise<{ translation: string; example: string; exampleTranslation: string }> {
        try {
            // 1. Get Example from Dictionary API
            // Using Free Dictionary API: https://dictionaryapi.dev/
            const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            let example = '';

            if (dictRes.ok) {
                const data: DictionaryEntry[] = await dictRes.json();
                const allExamples: string[] = [];

                // Collect all valid examples
                for (const entry of data) {
                    for (const meaning of entry.meanings) {
                        for (const def of meaning.definitions) {
                            if (def.example) {
                                allExamples.push(def.example);
                            }
                        }
                    }
                }

                // Select the best example: prefer length between 20 and 80 characters
                // This filters out very short fragments or very long complex sentences
                example = allExamples.find(ex => ex.length > 20 && ex.length < 80) 
                         || allExamples.find(ex => ex.length > 10) 
                         || '';
            }

            // 2. Get Translation from MyMemory API
            // Using MyMemory API (Free tier): https://mymemory.translated.net/doc/spec.php
            // langpair=en|uz (English to Uzbek)
            const transRes = await fetch(`https://api.mymemory.translated.net/get?q=${word}&langpair=en|uz`);
            let translation = '';
            
            if (transRes.ok) {
                const data: MyMemoryResponse = await transRes.json();
                if (data.responseStatus === 200) {
                    translation = data.responseData.translatedText;
                }
            }

            // 3. (Optional) Get Example Translation logic
            // Ideally we'd translate the example too, but let's stick to word translation for now to be safe
            // or we could try to translate the example if we found one
            let exampleTranslation = '';
            if (example) {
                 const exTransRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(example)}&langpair=en|uz`);
                 if (exTransRes.ok) {
                     const data: MyMemoryResponse = await exTransRes.json();
                     if (data.responseStatus === 200) {
                         exampleTranslation = data.responseData.translatedText;
                     }
                 }
            }

            return {
                translation: translation.toLowerCase(), // Usually dictionary returns lowercase
                example,
                exampleTranslation
            };

        } catch (error) {
            console.error("Dictionary lookup failed:", error);
            return { translation: '', example: '', exampleTranslation: '' }; // Fallback to empty
        }
    }
};
