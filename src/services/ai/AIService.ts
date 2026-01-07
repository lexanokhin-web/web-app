/**
 * AIService для взаимодействия с OpenRouter (DeepSeek R1 Free)
 */

export interface AIExplanation {
    meaning: string;
    synonyms: string[];
    examples: string[];
    usage_tips: string;
}

export interface AISentenceAnalysis {
    explanation: string;
    rule: string;
    tip: string;
}

export interface AIGrammarAdvice {
    explanation: string;
    rule: string;
    mnemonic?: string;
}

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'deepseek/deepseek-r1-0528:free';

export class AIService {
    private static get apiKey() {
        const key = import.meta.env.VITE_OPENROUTER_API_KEY;
        return key ? key.trim() : null;
    }

    private static async fetchAI(prompt: string): Promise<string | null> {
        if (!this.apiKey) {
            console.error('AIService: VITE_OPENROUTER_API_KEY is undefined!');
            return null;
        }

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
                const errorData = await response.json().catch(() => ({ error: { message: 'Unknown Error' } }));
                console.error('AIService: OpenRouter Error:', errorData.error?.message || JSON.stringify(errorData));
                return null;
            }

            const data = await response.json();
            const content = data.choices[0]?.message?.content;

            if (!content) return null;

            // Cleanup markdown blocks
            return content.replace(/```json/g, '').replace(/```/g, '').trim();
        } catch (error) {
            console.error('AIService: Network error:', error);
            return null;
        }
    }

    /**
     * Объяснение отдельного слова
     */
    static async explainWord(word: string): Promise<AIExplanation | null> {
        const prompt = `
            Du bist ein Deutschlehrer. Erkläre das Wort "${word}" für einen Schüler.
            GIB DIE ANTWORT NUR ALS REINES JSON ZURÜCK.
            Struktur:
            {
                "meaning": "Объяснение на русском",
                "synonyms": ["syn1", "syn2"],
                "examples": ["ex1", "ex2"],
                "usage_tips": "Совет на русском"
            }
        `;
        const res = await this.fetchAI(prompt);
        return res ? JSON.parse(res) : null;
    }

    /**
     * Анализ ошибки в порядке слов (Sentence Builder)
     */
    static async analyzeSentence(
        userSentence: string,
        correctSentence: string,
        translation: string,
        level: string = 'B1'
    ): Promise<AISentenceAnalysis | null> {
        const prompt = `
            Du bist ein Deutschlehrer. Ein Schüler hat einen Satz falsch gebaut.
            Level: ${level}
            Übersetzung: ${translation}
            Richtiger Satz: ${correctSentence}
            Satz vom Schüler: ${userSentence}
            
            Analysiere den Fehler (Satzbau, Wortposition, Grammatik).
            GIB DIE ANTWORT NUR ALS REINES JSON ZURÜCK.
            Struktur:
            {
                "explanation": "Объяснение ошибки на русском (почему это неверно)",
                "rule": "Грамматическое правило на русском",
                "tip": "Совет на будущее на русском"
            }
        `;
        const res = await this.fetchAI(prompt);
        return res ? JSON.parse(res) : null;
    }

    /**
     * Совет по грамматике (артикли, окончания)
     */
    static async getGrammarAdvice(
        context: string,
        topic: string,
        level: string = 'B1'
    ): Promise<AIGrammarAdvice | null> {
        const prompt = `
            Du bist ein Deutschlehrer. Erkläre die Grammatik für dieses Thema: ${topic}.
            Kontext/Satz: ${context}
            Level: ${level}
            
            GIB DIE ANTWORT NUR ALS REINES JSON ZURÜCK.
            Struktur:
            {
                "explanation": "Объяснение логики на русском",
                "rule": "Краткое правило на русском",
                "mnemonic": "Мнемоническая подсказка (если есть) на русском"
            }
        `;
        const res = await this.fetchAI(prompt);
        return res ? JSON.parse(res) : null;
    }

    /**
     * Персонализированный совет на основе статистики
     */
    static async getPersonalizedTip(
        stats: { level: number, xp: number, streak: number, learnedCount: number }
    ): Promise<string | null> {
        const prompt = `
            Du bist ein Deutschlehrer. Gib einen kurzen Motivations-Tipp für einen Schüler.
            Stats: Level ${stats.level}, XP ${Math.floor(stats.xp)}, Streak ${stats.streak}, Выучено слов: ${stats.learnedCount}.
            GIB NUR DEN REINEN TEXT DES TIPPS AUF RUSSISCH ZURÜCK. MAXIMAL 2 SÄTZE.
            KEIN JSON, NUR TEXT.
        `;
        const res = await this.fetchAI(prompt);
        return res;
    }
}
