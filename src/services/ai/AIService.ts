/**
 * AIService для взаимодействия с OpenRouter (DeepSeek R1 Free)
 */

export interface AIExplanation {
    meaning: string;
    synonyms: string[];
    examples: string[];
    usage_tips: string;
}

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'deepseek/deepseek-r1:free'; // Упрощенный ID модели

export class AIService {
    private static get apiKey() {
        // Добавляем .trim() на случай случайных пробелов при копировании в Vercel
        const key = import.meta.env.VITE_OPENROUTER_API_KEY;
        return key ? key.trim() : null;
    }

    /**
     * Получить подробное объяснение немецкого слова
     */
    static async explainWord(word: string): Promise<AIExplanation | null> {
        console.log('AIService: --- AI Request Started ---');

        if (!this.apiKey) {
            console.error('AIService: ERROR - VITE_OPENROUTER_API_KEY is undefined!');
            return null;
        }

        console.log('AIService: Word:', word);
        console.log('AIService: API Key found (starts with):', this.apiKey.substring(0, 4) + '...');

        const prompt = `
            Du bist ein Deutschlehrer. Erkläre das Wort "${word}" für einen Schüler.
            GIB DIE ANTWORT NUR ALS REINES JSON-OBJEKT ZURÜCK.
            KEIN TEXT DAVOR ODER DANACH.
            Struktur:
            {
                "meaning": "Kurze Erklärung auf Russisch",
                "synonyms": ["Synonym1", "Synonym2"],
                "examples": ["Satz 1", "Satz 2", "Satz 3"],
                "usage_tips": "Tipps zur Verwendung auf Russisch"
            }
        `;

        try {
            const response = await fetch(OPENROUTER_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'HTTP-Referer': 'https://lexanokhin-web.vercel.app',
                    'X-Title': 'Deutsch Lern-App',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: [
                        { role: 'user', content: prompt }
                    ]
                })
            });

            console.log('AIService: Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: { message: 'Unknown Error' } }));
                console.error('AIService: OpenRouter Error Message:', errorData.error?.message || JSON.stringify(errorData));
                return null;
            }

            const data = await response.json();
            let content = data.choices[0]?.message?.content;

            if (!content) {
                console.error('AIService: ERROR - Empty content', data);
                return null;
            }

            // Cleanup content if model puts it in markdown code blocks
            content = content.replace(/```json/g, '').replace(/```/g, '').trim();

            try {
                return JSON.parse(content) as AIExplanation;
            } catch (pError) {
                console.error('AIService: JSON Parse Error. Content was:', content);
                return null;
            }
        } catch (error) {
            console.error('AIService: Network error:', error);
            return null;
        }
    }
}
