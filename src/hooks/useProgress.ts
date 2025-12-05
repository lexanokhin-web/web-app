import { useState, useEffect } from 'react';
import { ProgressService } from '../services/progress/ProgressService';
import type { UserProgress } from '../services/progress/ProgressService';
import { useAuth } from '../contexts/AuthContext';

export const useProgress = () => {
    const { user } = useAuth();
    const [progress, setProgress] = useState<UserProgress | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProgress();
    }, [user?.id]);

    const loadProgress = async () => {
        setLoading(true);
        try {
            const data = await ProgressService.getProgress(user?.id);
            setProgress(data);
        } catch (error) {
            console.error('Error loading progress:', error);
        } finally {
            setLoading(false);
        }
    };

    const addXP = async (amount: number) => {
        try {
            const newProgress = await ProgressService.addXP(amount, user?.id);
            setProgress(newProgress);
            return newProgress;
        } catch (error) {
            console.error('Error adding XP:', error);
        }
    };

    return {
        progress,
        loading,
        addXP,
        reload: loadProgress
    };
};
