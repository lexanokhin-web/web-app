import { useState, useEffect, useCallback } from 'react';
import { AchievementsService, ACHIEVEMENTS_LIST } from '../services/gamification/AchievementsService';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from './useProgress';

export const useAchievements = () => {
    const { user } = useAuth();
    const { progress } = useProgress();
    const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [newUnlocks, setNewUnlocks] = useState<string[]>([]);

    const loadAchievements = useCallback(async () => {
        setLoading(true);
        try {
            if (user) {
                const ids = await AchievementsService.getUnlockedAchievements(user.id);
                setUnlockedIds(ids);
            }
        } catch (error) {
            console.error('Failed to load achievements', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const checkAchievements = useCallback(async () => {
        if (!user || !progress) return;

        const stats = {
            level: progress.level,
            xp: progress.xp,
            streak: progress.streak,
            words_learned: progress.learned_words?.length || 0,
            lessons_completed: 0,
            quizzes_completed: 0,
            perfect_quizzes: 0
        };

        const newlyUnlocked = await AchievementsService.checkAndUnlock(user.id, stats);

        if (newlyUnlocked.length > 0) {
            setNewUnlocks(newlyUnlocked);
            setUnlockedIds(prev => [...prev, ...newlyUnlocked]);
        }
    }, [user, progress]);

    useEffect(() => {
        if (user) {
            loadAchievements();
        } else {
            setUnlockedIds([]);
            setLoading(false);
        }
    }, [user, loadAchievements]);

    useEffect(() => {
        if (user && progress) {
            checkAchievements();
        }
    }, [progress, user, checkAchievements]);

    const getAchievementById = (id: string) => ACHIEVEMENTS_LIST.find(a => a.id === id);

    return {
        achievements: ACHIEVEMENTS_LIST,
        unlockedIds,
        loading,
        newUnlocks,
        getAchievementById
    };
};
