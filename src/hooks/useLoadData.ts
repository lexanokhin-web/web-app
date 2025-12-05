import { useQuery } from '@tanstack/react-query';
import * as api from '../lib/api';

/**
 * Hook to load block sentences (e.g. for VerbsPage or ExercisePage).
 */
export function useBlockSentences(blockId: string | undefined) {
    return useQuery({
        queryKey: ['sentences', blockId],
        queryFn: () => api.fetchBlockSentences(blockId || ''),
        enabled: !!blockId,
    });
}

/**
 * Hook to load article sentences.
 */
export function useArticleSentences() {
    return useQuery({
        queryKey: ['articles'],
        queryFn: api.fetchArticleSentences,
    });
}

/**
 * Hook to load pronoun exercises.
 */
export function usePronounExercises() {
    return useQuery({
        queryKey: ['pronouns'],
        queryFn: api.fetchPersonalPronounExercises,
    });
}

/**
 * Hook to load antonym exercises.
 */
export function useAntonymExercises() {
    return useQuery({
        queryKey: ['antonyms'],
        queryFn: api.fetchAntonymExercises,
    });
}

/**
 * Hook to load synonym exercises.
 */
export function useSynonymExercises() {
    return useQuery({
        queryKey: ['synonyms'],
        queryFn: api.fetchSynonymExercises,
    });
}

/**
 * Hook to load a test scenario.
 */
export function useTestScenario(filename: string | undefined) {
    return useQuery({
        queryKey: ['testScenario', filename],
        queryFn: () => api.fetchTestScenario(filename || ''),
        enabled: !!filename,
    });
}

/**
 * Hook to load quiz data for a specific level and topic.
 */
export function useQuizData(level: string | null, topicId: string | null) {
    return useQuery({
        queryKey: ['quiz', level, topicId],
        queryFn: () => api.fetchQuizData(level!, topicId!),
        enabled: !!level && !!topicId,
    });
}

/**
 * Hook to load quiz data from a generic path.
 */
export function useGenericQuizData(path: string | null) {
    return useQuery({
        queryKey: ['quiz', 'generic', path],
        queryFn: () => api.fetchGenericQuizData(path!),
        enabled: !!path,
    });
}
