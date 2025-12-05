import { useState, useEffect } from 'react';
import { AchievementsService, ACHIEVEMENTS_LIST } from '../services/gamification/AchievementsService';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from './useProgress';

export const useAchievements = () => {
    const { user } = useAuth();
    const { progress } = useProgress();
    const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [newUnlocks, setNewUnlocks] = useState<string[]>([]);

    useEffect(() => {
        if (user) {
            loadAchievements();
        } else {
            setUnlockedIds([]); // Or load from localStorage for guest
            setLoading(false);
        }
    }, [user]);

    // Check for new unlocks whenever progress changes
    useEffect(() => {
        if (user && progress) {
            checkAchievements();
        }
    }, [progress, user]);

    const loadAchievements = async () => {
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
    };

    const checkAchievements = async () => {
        if (!user || !progress) return;

        // We need to pass a "stats" object that matches what AchievementsService expects.
        // Currently useProgress returns a UserProgress object.
        // We might need to extend UserProgress or map it here.
        // For now, let's assume progress has the needed fields or we calculate them.

        // Mapping progress to stats expected by conditions
        const stats = {
            level: progress.level,
            xp: progress.xp,
            streak: progress.streak,
            words_learned: progress.learned_words?.length || 0,
            lessons_completed: 0, // TODO: Track this in DB
            quizzes_completed: 0, // TODO: Track this in DB
            perfect_quizzes: 0    // TODO: Track this in DB
        };

        const newlyUnlocked = await AchievementsService.checkAndUnlock(user.id, stats);

        if (newlyUnlocked.length > 0) {
            setNewUnlocks(newlyUnlocked);
            setUnlockedIds(prev => [...prev, ...newlyUnlocked]);

            // Here you could trigger a toast/notification
            // alert(`New Achievement Unlocked: ${newlyUnlocked.join(', ')}`);
        }
    };

    const getAchievementById = (id: string) => ACHIEVEMENTS_LIST.find(a => a.id === id);

    return {
        achievements: ACHIEVEMENTS_LIST,
        unlockedIds,
        loading,
        newUnlocks,
        getAchievementById
    };
};
