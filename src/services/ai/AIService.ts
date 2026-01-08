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

// Список моделей: от самых надежных до запасных
const MODELS = [
    'google/gemma-3-12b-it:free',           // Умная и стабильная
    'mistralai/mistral-small-3.1-24b-instruct:free', // Надёжная
    'meta-llama/llama-3.2-3b-instruct:free' // Быстрая запасная
];

export class AIService {
    private static get apiKey() {
        const key = import.meta.env.VITE_OPENROUTER_API_KEY;
        return key ? key.trim() : null;
    }

    /**
     * Извлекает JSON из строки, даже если модель прислала лишний текст или теги <think>
     */
    private static extractJSON(content: string): string | null {
        try {
            // Убираем теги <think>
            const withoutThink = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
            const firstBrace = withoutThink.indexOf('{');
            const lastBrace = withoutThink.lastIndexOf('}');

            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                const jsonCandidate = withoutThink.substring(firstBrace, lastBrace + 1);
                // Проверяем, что это валидный JSON
                JSON.parse(jsonCandidate);
                return jsonCandidate;
            }
            return null;
        } catch {
            return null;
        }
    }

    /**
     * Выполняет запрос к ИИ с поддержкой повторных попыток и переключением моделей
     */
    private static async fetchAIWithRetry(prompt: string, maxRetries: number = 1): Promise<string | null> {
        if (!this.apiKey) {
            console.error('AIService: VITE_OPENROUTER_API_KEY is missing!');
            return null;
        }

        const referer = window.location.origin || 'http://localhost:5173';

        for (const modelId of MODELS) {
            for (let attempt = 0; attempt <= maxRetries; attempt++) {
                try {
                    if (attempt > 0) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        console.log(`AIService: Retrying ${modelId} (Attempt ${attempt + 1})`);
                    }

                    console.log(`AIService: Requesting ${modelId}...`);

                    const response = await fetch(OPENROUTER_API_URL, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${this.apiKey}`,
                            'HTTP-Referer': referer,
                            'X-Title': 'Deutsch Lern-App',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            model: modelId,
                            messages: [{ role: 'user', content: prompt }]
                        }),
                        // Тайм-аут на запрос 30 секунд (бесплатные модели могут долго висеть в очереди)
                        signal: AbortSignal.timeout(30000)
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const content = data.choices[0]?.message?.content;
                        console.log(`AIService: ${modelId} response length: ${content?.length || 0}`);
                        if (content) {
                            const extracted = this.extractJSON(content);
                            if (extracted) {
                                console.log(`AIService: Success with ${modelId}`);
                                return extracted;
                            } else {
                                console.warn(`AIService: ${modelId} returned non-JSON content:`, content.substring(0, 200));
                            }
                        }
                    } else {
                        const errorText = await response.text();
                        console.error(`AIService: Model ${modelId} failed (Status ${response.status}):`, errorText);

                        // Если ошибка авторизации, нет смысла пробовать другие модели
                        if (response.status === 401 || response.status === 403) {
                            return null;
                        }
                        // Если rate limit - сразу выходим, нет смысла пробовать другие модели
                        if (response.status === 429) {
                            console.error('AIService: Rate limit exceeded! Wait until tomorrow or add credits.');
                            return null;
                        }
                    }
                } catch (error: unknown) {
                    if (error instanceof Error && error.name === 'TimeoutError') {
                        console.warn(`AIService: ${modelId} timed out after 25s`);
                    } else {
                        console.error(`AIService: Error with ${modelId}:`, error);
                    }
                }
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
            const res = await this.fetchAIWithRetry(prompt);
            return res ? JSON.parse(res) : null;
        } catch {
            console.error('AIService: Parse error in explainWord:');
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
            const res = await this.fetchAIWithRetry(prompt);
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
            const res = await this.fetchAIWithRetry(prompt);
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
        return await this.fetchAIWithRetry(prompt);
    }

    /**
     * Глубокий анализ (использует мощную модель DeepSeek R1)
     */
    static async getDeepAnalysis(
        context: string,
        topic: string,
        level: string = 'B1'
    ): Promise<string | null> {
        const prompt = `
            Du bist ein Deutschlehrer-Experte. Gib eine SEHR DETAILLIERТЕЛЬНУЮ и глубокую объяснительную записку (Deep Analysis) по этой теме: ${topic}.
            Контекст: ${context}
            Уровень ученика: ${level}
            
            Объясни все нюансы, исключения и логику максимально подробно на русском языке.
            GIB NUR DEN REINEN TEXT ZURÜCK (Markdown format ist erlaubt).
        `;

        // Для глубокого анализа используем только R1
        const r1Model = 'deepseek/deepseek-r1-0528:free';

        if (!this.apiKey) return null;
        const referer = window.location.origin || 'http://localhost:5173';

        try {
            console.log('AIService: Starting Deep Analysis with R1...');
            const response = await fetch(OPENROUTER_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'HTTP-Referer': referer,
                    'X-Title': 'Deutsch Lern-App',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: r1Model,
                    messages: [{ role: 'user', content: prompt }]
                }),
                signal: AbortSignal.timeout(60000) // 1 минута на глубокий анализ
            });

            if (response.ok) {
                const data = await response.json();
                let content = data.choices[0]?.message?.content;
                if (content) {
                    // Убираем <think> теги для чистого вывода
                    content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
                }
                return content;
            }
            return null;
        } catch (error) {
            console.error('AIService: Deep Analysis failed:', error);
            return null;
        }
    }
}
