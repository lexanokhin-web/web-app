import type { BlockInfo, Sentence, ArticleSentence, AntonymExercise, SynonymExercise, StandaloneScenarioModel } from '../types';

/**
 * Generic fetcher to load JSON data from the public folder.
 */
async function fetchResource<T>(path: string): Promise<T> {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Failed to load resource: ${path}`);
    }
    return response.json();
}

/**
 * Loads a standard block of sentences (e.g., sentences.json).
 */
export async function fetchBlockSentences(blockId: string): Promise<Sentence[]> {
    if (!blockId) return [];
    return fetchResource<Sentence[]>(`/data/${blockId}.json`);
}

/**
 * Loads article exercises.
 */
export async function fetchArticleSentences(): Promise<ArticleSentence[]> {
    return fetchResource<ArticleSentence[]>(`/data/article_sentences.json`);
}

/**
 * Loads personal pronoun exercises.
 */
export async function fetchPersonalPronounExercises(): Promise<any[]> {
    return fetchResource<any[]>(`/data/personalpronomen_exercises.json`);
}

/**
 * Loads antonym exercises.
 */
export async function fetchAntonymExercises(): Promise<AntonymExercise[]> {
    return fetchResource<AntonymExercise[]>(`/data/antonyms_exercises.json`);
}

/**
 * Loads synonym exercises.
 */
export async function fetchSynonymExercises(): Promise<SynonymExercise[]> {
    return fetchResource<SynonymExercise[]>(`/data/synonym_exercises.json`);
}

/**
 * Loads a test scenario by filename.
 */
export async function fetchTestScenario(filename: string): Promise<StandaloneScenarioModel[]> {
    if (!filename) return [];
    return fetchResource<StandaloneScenarioModel[]>(`/data/${filename}.json`);
}

/**
 * Loads quiz data for a specific level and topic.
 */
export async function fetchQuizData(level: string, topicId: string): Promise<Sentence[]> {
    if (!level || !topicId) return [];
    return fetchResource<Sentence[]>(`/data/quizzes/${level}/${topicId}.json`);
}

/**
 * Loads quiz data from a generic path (legacy support).
 */
export async function fetchGenericQuizData(path: string): Promise<Sentence[]> {
    if (!path) return [];
    const url = path.includes('/') ? `/data/quizzes/${path}.json` : `/data/${path}.json`;
    return fetchResource<Sentence[]>(url);
}
