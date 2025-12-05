import type { SentenceExercise } from './types';
import { a1Exercises } from './a1';
import { a2Exercises } from './a2';
import { b1Exercises } from './b1';
import { b2Exercises } from './b2';

export * from './types';

export const sentenceExercises: SentenceExercise[] = [
    ...a1Exercises,
    ...a2Exercises,
    ...b1Exercises,
    ...b2Exercises
];

// Helper function to get exercises by level
export const getExercisesByLevel = (level: 'A1' | 'A2' | 'B1' | 'B2'): SentenceExercise[] => {
    switch (level) {
        case 'A1': return a1Exercises;
        case 'A2': return a2Exercises;
        case 'B1': return b1Exercises;
        case 'B2': return b2Exercises;
        default: return [];
    }
};

// Helper function to scramble words
export const scrambleWords = (sentence: string[]): string[] => {
    return [...sentence].sort(() => Math.random() - 0.5);
};
