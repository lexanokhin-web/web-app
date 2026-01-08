/**
 * AIService для взаимодействия с Google Gemini API
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

// Google Gemini API endpoint
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const GEMINI_MODEL = 'gemini-2.5-flash';

export class AIService {
    private static get apiKey() {
        const key = import.meta.env.VITE_GOOGLE_AI_KEY;
        return key ? key.trim() : null;
    }

    /**
     * Извлекает JSON из строки, даже если модель прислала лишний текст или markdown
     */
    private static extractJSON(content: string): string | null {
        try {
            // Убираем markdown code fences (```json ... ```)
            const cleaned = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

            const firstBrace = cleaned.indexOf('{');
            const lastBrace = cleaned.lastIndexOf('}');

            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                const jsonCandidate = cleaned.substring(firstBrace, lastBrace + 1);
                JSON.parse(jsonCandidate);
                return jsonCandidate;
            }
            return null;
        } catch {
            return null;
        }
    }

    /**
     * Выполняет запрос к Google Gemini API
     */
    private static async fetchGemini(prompt: string, expectJSON: boolean = true): Promise<string | null> {
        if (!this.apiKey) {
            console.error('AIService: VITE_GOOGLE_AI_KEY is missing!');
            return null;
        }

        const url = `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${this.apiKey}`;

        try {
            console.log('AIService: Requesting Gemini...');

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        temperature: 0.5,
                        maxOutputTokens: 2048
                    }
                }),
                signal: AbortSignal.timeout(30000)
            });

            if (response.ok) {
                const data = await response.json();
                const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
                console.log(`AIService: Gemini response length: ${content?.length || 0}`);

                if (content) {
                    if (expectJSON) {
                        const extracted = this.extractJSON(content);
                        if (extracted) {
                            console.log('AIService: Success with Gemini');
                            return extracted;
                        } else {
                            console.warn('AIService: Gemini returned non-JSON:', content.substring(0, 200));
                            return null;
                        }
                    } else {
                        return content;
                    }
                }
            } else {
                const errorText = await response.text();
                console.error(`AIService: Gemini failed (Status ${response.status}):`, errorText);
            }
        } catch (error: unknown) {
            if (error instanceof Error && error.name === 'TimeoutError') {
                console.warn('AIService: Gemini timed out after 30s');
            } else {
                console.error('AIService: Error with Gemini:', error);
            }
        }

        return null;
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
        try {
            const res = await this.fetchGemini(prompt);
            return res ? JSON.parse(res) : null;
        } catch {
            console.error('AIService: Parse error in explainWord');
            return null;
        }
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
        try {
            const res = await this.fetchGemini(prompt);
            return res ? JSON.parse(res) : null;
        } catch (e) {
            console.error('AIService: Parse error in analyzeSentence:', e);
            return null;
        }
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
            Du bist ein Deutschlehrer. Erkläre die Grammatik для этого топика: ${topic}.
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
        try {
            const res = await this.fetchGemini(prompt);
            return res ? JSON.parse(res) : null;
        } catch (e) {
            console.error('AIService: Parse error in getGrammarAdvice:', e);
            return null;
        }
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
        return await this.fetchGemini(prompt, false);
    }
}
