import { useState, useEffect } from 'react';
import { SRSService } from '../services/srs/SRSService';
import type { SRSCard } from '../services/srs/SRSEngine';
import { useAuth } from '../contexts/AuthContext';

/**
 * React Hook для работы с SRS
 */
export const useSRS = (wordId?: string) => {
    const { user } = useAuth();
    const [card, setCard] = useState<SRSCard | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (wordId) {
            loadCard();
        }
    }, [wordId, user?.id]);

    const loadCard = async () => {
        if (!wordId) return;

        setLoading(true);
        try {
            const srsCard = await SRSService.getOrCreateCard(wordId, user?.id);
            setCard(srsCard);
        } catch (error) {
            console.error('Error loading SRS card:', error);
        } finally {
            setLoading(false);
        }
    };

    const review = async (isKnown: boolean) => {
        if (!wordId) return;

        setLoading(true);
        try {
            const updatedCard = await SRSService.reviewCard(wordId, isKnown, user?.id);
            setCard(updatedCard);
            return updatedCard;
        } catch (error) {
            console.error('Error reviewing card:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        card,
        loading,
        review,
        reload: loadCard
    };
};

/**
 * Hook для получения статистики SRS
 */
export const useSRSStats = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const loadStats = async () => {
        setLoading(true);
        try {
            const srsStats = await SRSService.getStats(user?.id);
            setStats(srsStats);
        } catch (error) {
            console.error('Error loading SRS stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, [user?.id]);

    return {
        stats,
        loading,
        reload: loadStats
    };
};

/**
 * Hook для получения карточек к повторению
 */
export const useDueCards = () => {
    const { user } = useAuth();
    const [dueCards, setDueCards] = useState<SRSCard[]>([]);
    const [loading, setLoading] = useState(false);

    const loadDueCards = async () => {
        setLoading(true);
        try {
            const cards = await SRSService.getDueCards(user?.id);
            setDueCards(cards);
        } catch (error) {
            console.error('Error loading due cards:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDueCards();
    }, [user?.id]);

    return {
        dueCards,
        loading,
        reload: loadDueCards
    };
};
