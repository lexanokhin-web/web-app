import type { SRSCard } from './SRSEngine';
import { SRSEngine } from './SRSEngine';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

/**
 * SRS Service для работы с Supabase и LocalStorage
 */
export class SRSService {
    private static STORAGE_KEY = 'srs_cards';

    /**
     * Получить все карточки пользователя
     */
    static async getCards(userId?: string): Promise<SRSCard[]> {
        const localCards = this.getLocalCards();

        if (isSupabaseConfigured() && userId) {
            // Загрузить из Supabase
            const { data, error } = await supabase!
                .from('srs_cards')
                .select('*')
                .eq('user_id', userId);

            if (error) {
                console.error('Error loading SRS cards from Supabase:', error);
                return localCards;
            }

            const dbCards = (data || []).map(this.dbToCard);

            // Гибридное слияние: берем самую свежую версию каждой карточки (из локала или из базы)
            const cardMap = new Map<string, SRSCard>();

            // Сначала кладём локальные
            localCards.forEach(card => cardMap.set(card.wordId, card));

            // Затем накладываем из БД, если они новее или их нет в локале
            dbCards.forEach(dbCard => {
                const localCard = cardMap.get(dbCard.wordId);
                if (!localCard) {
                    cardMap.set(dbCard.wordId, dbCard);
                } else {
                    // Сравниваем даты последнего обновления
                    const localUpdate = localCard.lastReviewDate?.getTime() || 0;
                    const dbUpdate = dbCard.lastReviewDate?.getTime() || 0;

                    if (dbUpdate >= localUpdate) {
                        cardMap.set(dbCard.wordId, dbCard);
                    }
                }
            });

            return Array.from(cardMap.values());
        }

        // Fallback to localStorage
        return localCards;
    }

    /**
     * Сохранить карточку
     */
    static async saveCard(card: SRSCard, userId?: string): Promise<void> {
        if (isSupabaseConfigured() && userId) {
            const dbCard = this.cardToDb(card, userId);

            const { error } = await supabase!
                .from('srs_cards')
                .upsert(dbCard, { onConflict: 'user_id,word_id' });

            if (error) {
                console.error('Error saving SRS card to Supabase:', error);
                this.saveLocalCard(card);
                return;
            }
        }

        // Always save to localStorage as backup
        this.saveLocalCard(card);
    }

    /**
     * Получить карточку по wordId
     */
    static async getCard(wordId: string, userId?: string): Promise<SRSCard | null> {
        const cards = await this.getCards(userId);
        return cards.find(c => c.wordId === wordId) || null;
    }

    /**
     * Получить или создать карточку
     */
    static async getOrCreateCard(wordId: string, userId?: string): Promise<SRSCard> {
        const existing = await this.getCard(wordId, userId);
        if (existing) return existing;

        const newCard = SRSEngine.createCard(wordId, userId);
        await this.saveCard(newCard, userId);
        return newCard;
    }

    /**
     * Отметить карточку как изученную/не изученную
     */
    static async reviewCard(
        wordId: string,
        isKnown: boolean,
        userId?: string
    ): Promise<SRSCard> {
        const card = await this.getOrCreateCard(wordId, userId);
        const quality = SRSEngine.swipeToQuality(isKnown);
        const updatedCard = SRSEngine.review(card, quality);

        await this.saveCard(updatedCard, userId);
        return updatedCard;
    }

    /**
     * Получить карточки для повторения
     */
    static async getDueCards(userId?: string): Promise<SRSCard[]> {
        const cards = await this.getCards(userId);
        return SRSEngine.getDueCards(cards);
    }

    /**
     * Получить статистику
     */
    static async getStats(userId?: string) {
        const cards = await this.getCards(userId);
        return SRSEngine.getStats(cards);
    }

    // Private helpers

    private static getLocalCards(): SRSCard[] {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (!data) return [];

            const cards = JSON.parse(data);
            // Convert date strings back to Date objects
            return cards.map((c: SRSCard & { nextReviewDate: string, lastReviewDate?: string }) => ({
                ...c,
                nextReviewDate: new Date(c.nextReviewDate),
                lastReviewDate: c.lastReviewDate ? new Date(c.lastReviewDate) : undefined
            }));
        } catch (error) {
            console.error('Error loading local SRS cards:', error);
            return [];
        }
    }

    private static saveLocalCard(card: SRSCard): void {
        try {
            const cards = this.getLocalCards();
            const index = cards.findIndex(c => c.wordId === card.wordId);

            if (index >= 0) {
                cards[index] = card;
            } else {
                cards.push(card);
            }

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cards));
        } catch (error) {
            console.error('Error saving local SRS card:', error);
        }
    }

    private static dbToCard(dbCard: {
        id: string;
        word_id: string;
        user_id: string;
        ease_factor: number;
        interval: number;
        repetitions: number;
        next_review_date: string;
        updated_at?: string;
    }): SRSCard {
        return {
            id: dbCard.id,
            wordId: dbCard.word_id,
            userId: dbCard.user_id,
            easeFactor: dbCard.ease_factor,
            interval: dbCard.interval,
            repetitions: dbCard.repetitions,
            nextReviewDate: new Date(dbCard.next_review_date),
            lastReviewDate: dbCard.updated_at ? new Date(dbCard.updated_at) : undefined
        };
    }

    private static cardToDb(card: SRSCard, userId: string): Record<string, unknown> {
        return {
            user_id: userId,
            word_id: card.wordId,
            ease_factor: card.easeFactor,
            interval: card.interval,
            repetitions: card.repetitions,
            next_review_date: card.nextReviewDate.toISOString()
        };
    }
}
