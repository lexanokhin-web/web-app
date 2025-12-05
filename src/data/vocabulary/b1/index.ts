// B1 Level - All Categories Export
import type { VocabularyCategory } from '../types';

import { b1WorkCategory } from './work';
import { b1EducationCategory } from './education';
import { b1TravelCategory } from './travel';
import { b1RelationshipsCategory } from './relationships';
import { b1MediaCategory } from './media';
import { b1EnvironmentCategory } from './environment';
import { b1CultureCategory } from './culture';
import { b1HousingCategory } from './housing';
import { b1VerbsCategory } from './verbs';
import { b1AdjectivesCategory } from './adjectives';

export const b1VocabularyCategories: VocabularyCategory[] = [
    b1WorkCategory,
    b1EducationCategory,
    b1TravelCategory,
    b1RelationshipsCategory,
    b1MediaCategory,
    b1EnvironmentCategory,
    b1CultureCategory,
    b1HousingCategory,
    b1VerbsCategory,
    b1AdjectivesCategory,
];

// Re-export individual categories
export * from './work';
export * from './education';
export * from './travel';
export * from './relationships';
export * from './media';
export * from './environment';
export * from './culture';
export * from './housing';
export * from './verbs';
export * from './adjectives';
