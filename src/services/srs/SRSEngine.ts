/**
 * SuperMemo SM-2 Algorithm для Spaced Repetition
 * 
 * Адаптировано для изучения языков
 * Источник: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 */

export interface SRSCard {
    id: string;
    wordId: string;
    userId?: string;
    easeFactor: number;      // Коэффициент легкости (по умолчанию 2.5)
    interval: number;         // Интервал до следующего повторения (в днях)
    repetitions: number;      // Количество успешных повторений подряд
    nextReviewDate: Date;     // Дата следующего повторения
    lastReviewDate?: Date;    // Дата последнего повторения
}

export interface ReviewResult {
    quality: number;          // 0-5: качество ответа
    card: SRSCard;
}

export interface SRSStats {
    total: number;
    due: number;
    new: number;
    learning: number;
    mature: number;
    avgEaseFactor: string;
}

export class SRSEngine {
    /**
     * Оценить качество ответа:
     * 0 - полный провал
     * 1 - неправильно, но вспомнил после подсказки
     * 2 - неправильно, но легко вспомнил после показа
     * 3 - правильно, но с трудом
     * 4 - правильно, после колебаний
     * 5 - правильно, легко
     */
    static review(card: SRSCard, quality: number): SRSCard {
        const newCard = { ...card };

        // Обновить дату последнего повторения
        newCard.lastReviewDate = new Date();

        // Обновить easeFactor
        newCard.easeFactor = Math.max(
            1.3,
            newCard.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
        );

        // Если ответ был слишком плохим (< 3), сбросить repetitions
        if (quality < 3) {
            newCard.repetitions = 0;
            newCard.interval = 1; // Повторить завтра
        } else {
            newCard.repetitions += 1;

            // Рассчитать новый интервал
            if (newCard.repetitions === 1) {
                newCard.interval = 1; // 1 день
            } else if (newCard.repetitions === 2) {
                newCard.interval = 6; // 6 дней
            } else {
                newCard.interval = Math.round(newCard.interval * newCard.easeFactor);
            }
        }

        // Установить дату следующего повторения
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + newCard.interval);
        newCard.nextReviewDate = nextDate;

        return newCard;
    }

    /**
     * Создать новую карточку
     */
    static createCard(wordId: string, userId?: string): SRSCard {
        const now = new Date();
        return {
            id: `srs_${wordId}_${Date.now()}`,
            wordId,
            userId,
            easeFactor: 2.5,
            interval: 0,
            repetitions: 0,
            nextReviewDate: now,
            lastReviewDate: undefined
        };
    }

    /**
     * Получить карточки, которые нужно повторить сегодня
     */
    static getDueCards(cards: SRSCard[]): SRSCard[] {
        const now = new Date();
        return cards.filter(card => card.nextReviewDate <= now);
    }

    /**
     * Сортировать карточки по приоритету (самые срочные первыми)
     */
    static sortByPriority(cards: SRSCard[]): SRSCard[] {
        return [...cards].sort((a, b) => {
            // Сначала просроченные
            const aOverdue = new Date().getTime() - a.nextReviewDate.getTime();
            const bOverdue = new Date().getTime() - b.nextReviewDate.getTime();

            if (aOverdue > 0 && bOverdue > 0) {
                return bOverdue - aOverdue; // Более просроченные первыми
            }

            if (aOverdue > 0) return -1;
            if (bOverdue > 0) return 1;

            return a.nextReviewDate.getTime() - b.nextReviewDate.getTime();
        });
    }

    /**
     * Конвертировать качество свайпа в оценку SM-2
     */
    static swipeToQuality(isKnown: boolean): number {
        return isKnown ? 5 : 2; // Знаю = 5, Не знаю = 2
    }

    /**
     * Получить статистику обучения
     */
    static getStats(cards: SRSCard[]): SRSStats {
        const now = new Date();
        const dueCards = cards.filter(c => c.nextReviewDate <= now);
        const newCards = cards.filter(c => c.repetitions === 0);
        const reviewCards = cards.filter(c => c.repetitions > 0);

        const avgEaseFactor = cards.length > 0
            ? cards.reduce((sum, c) => sum + c.easeFactor, 0) / cards.length
            : 2.5;

        return {
            total: cards.length,
            due: dueCards.length,
            new: newCards.length,
            learning: reviewCards.filter(c => c.repetitions < 3).length,
            mature: reviewCards.filter(c => c.repetitions >= 3).length,
            avgEaseFactor: avgEaseFactor.toFixed(2)
        };
    }

    /**
     * Рассчитать прогноз обучения (сколько карточек в ближайшие дни)
     */
    static getForecast(cards: SRSCard[], days: number = 7): number[] {
        const forecast = new Array(days).fill(0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        cards.forEach(card => {
            const reviewDate = new Date(card.nextReviewDate);
            reviewDate.setHours(0, 0, 0, 0);

            const daysDiff = Math.floor((reviewDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            if (daysDiff >= 0 && daysDiff < days) {
                forecast[daysDiff]++;
            }
        });

        return forecast;
    }
}
