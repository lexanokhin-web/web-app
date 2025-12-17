import type { SentenceExercise } from './types';
import { a1Exercises } from './a1';
import { a2Exercises } from './a2';
import { b1Exercises } from './b1';
import { b2Exercises } from './b2';

export * from './types';

export const allExercises: SentenceExercise[] = [
    ...a1Exercises,
    ...a2Exercises,
    ...b1Exercises,
    ...b2Exercises
];

// Helper function to get exercises by level
export const getExercisesByLevel = (level: string): SentenceExercise[] => {
    return allExercises.filter(ex => ex.level === level);
};

// Helper function to scramble words
export const scrambleWords = (sentence: string[]): string[] => {
    return [...sentence].sort(() => Math.random() - 0.5);
};
