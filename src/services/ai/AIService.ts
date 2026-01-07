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
const MODEL = 'deepseek/deepseek-r1-0528:free'; // Конкретная бесплатная модель

export class AIService {
    private static get apiKey() {
        return import.meta.env.VITE_OPENROUTER_API_KEY;
    }

    /**
     * Получить подробное объяснение немецкого слова
     */
    static async explainWord(word: string): Promise<AIExplanation | null> {
        if (!this.apiKey) {
            console.error('AIService: VITE_OPENROUTER_API_KEY is missing!');
            return null;
        }

        console.log('AIService: Requesting explanation for', word, 'using', MODEL);
        console.log('AIService: API Key starts with:', this.apiKey.substring(0, 4) + '...');

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

            if (!response.ok) {
                const errorData = await response.json();
                console.error('AIService: OpenRouter Error Details:', errorData);
                return null;
            }

            const data = await response.json();
            let content = data.choices[0]?.message?.content;

            if (!content) {
                console.error('AIService: Empty content in response', data);
                return null;
            }

            console.log('AIService: Raw AI response:', content);

            // Cleanup content if model puts it in markdown code blocks
            content = content.replace(/```json/g, '').replace(/```/g, '').trim();

            return JSON.parse(content) as AIExplanation;
        } catch (error) {
            console.error('AIService: Parse or Network Error:', error);
            return null;
        }
    }
}
