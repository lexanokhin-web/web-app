import { useState, useEffect } from 'react';
import type { UserProgress } from '../types';

const PROGRESS_KEY_PREFIX = "userProgress_";

export function useExerciseProgress(blockId: string | undefined) {
    const [progress, setProgress] = useState<UserProgress>({
        learnedWordIDs: [],
        toRepeatWordIDs: [],
        totalCompleted: 0
    });

    useEffect(() => {
        if (!blockId) return;
        const key = PROGRESS_KEY_PREFIX + blockId;
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                setProgress(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse progress", e);
            }
        } else {
            // Reset to empty if no saved progress
            setProgress({
                learnedWordIDs: [],
                toRepeatWordIDs: [],
                totalCompleted: 0
            });
        }
    }, [blockId]);

    const saveProgress = (newProgress: UserProgress) => {
        if (!blockId) return;
        setProgress(newProgress);
        const key = PROGRESS_KEY_PREFIX + blockId;
        localStorage.setItem(key, JSON.stringify(newProgress));
    };

    return { progress, saveProgress };
}
