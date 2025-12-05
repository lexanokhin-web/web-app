// Main Vocabulary Index
// Consolidates all CEFR levels (A1, A2, B1, B2)

export * from './types';

// Re-export all category arrays
export { a1VocabularyCategories } from './a1';
export { a2VocabularyCategories } from './a2';
export { b1VocabularyCategories } from './b1';
export { b2VocabularyCategories } from './b2';

import { a1VocabularyCategories } from './a1';
import { a2VocabularyCategories } from './a2';
import { b1VocabularyCategories } from './b1';
import { b2VocabularyCategories } from './b2';
import type { VocabularyWord, VocabularyCategory } from './types';

// Combine all levels
export const allVocabularyCategories: VocabularyCategory[] = [
    ...a1VocabularyCategories,
    ...a2VocabularyCategories,
    ...b1VocabularyCategories,
    ...b2VocabularyCategories,
];

// Helper functions
export const getAllVocabularyWords = (): VocabularyWord[] => {
    return allVocabularyCategories.flatMap(category => category.words);
};

export const getWordsByLevel = (level: 'A1' | 'A2' | 'B1' | 'B2'): VocabularyWord[] => {
    return getAllVocabularyWords().filter(word => word.level === level);
};

export const getCategoryById = (categoryId: string): VocabularyCategory | undefined => {
    return allVocabularyCategories.find(cat => cat.id === categoryId);
};

export const getCategoriesByLevel = (level: 'A1' | 'A2' | 'B1' | 'B2'): VocabularyCategory[] => {
    return allVocabularyCategories.filter(cat => cat.level === level);
};
