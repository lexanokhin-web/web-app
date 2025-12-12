import { describe, it, expect } from 'vitest';
import { allVocabularyCategories, getCategoryById } from '../../data/vocabulary';

describe('Vocabulary Data', () => {
    it('loads vocabulary categories', () => {
        expect(allVocabularyCategories).toBeDefined();
        expect(allVocabularyCategories.length).toBeGreaterThan(0);
    });

    it('has categories for all levels', () => {
        const levels = ['A1', 'A2', 'B1', 'B2'];

        levels.forEach(level => {
            const categoriesForLevel = allVocabularyCategories.filter(c => c.level === level);
            expect(categoriesForLevel.length).toBeGreaterThan(0);
        });
    });

    it('getCategoryById returns correct category', () => {
        // Get first category to test
        const firstCategory = allVocabularyCategories[0];
        const found = getCategoryById(firstCategory.id);

        expect(found).toBeDefined();
        expect(found?.id).toBe(firstCategory.id);
    });

    it('getCategoryById returns undefined for non-existent id', () => {
        const found = getCategoryById('non-existent-id-12345');
        expect(found).toBeUndefined();
    });

    it('each category has required fields', () => {
        allVocabularyCategories.forEach(category => {
            expect(category.id).toBeDefined();
            expect(category.name).toBeDefined();
            expect(category.nameRu).toBeDefined();
            expect(category.level).toBeDefined();
            expect(category.icon).toBeDefined();
            expect(category.words).toBeDefined();
            expect(Array.isArray(category.words)).toBe(true);
        });
    });

    it('each word has german and russian fields', () => {
        allVocabularyCategories.forEach(category => {
            category.words.forEach(word => {
                expect(word.german).toBeDefined();
                expect(typeof word.german).toBe('string');
                expect(word.russian).toBeDefined();
                expect(typeof word.russian).toBe('string');
            });
        });
    });

    it('A1 level has basic categories', () => {
        const a1Categories = allVocabularyCategories.filter(c => c.level === 'A1');
        const categoryNames = a1Categories.map(c => c.name.toLowerCase());

        // Should have common A1 topics
        expect(categoryNames.some(n => n.includes('food') || n.includes('essen'))).toBe(true);
    });

    it('wordCount matches actual words array length', () => {
        allVocabularyCategories.forEach(category => {
            if (category.wordCount !== undefined) {
                expect(category.wordCount).toBe(category.words.length);
            }
        });
    });
});
