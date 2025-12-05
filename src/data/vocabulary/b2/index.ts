// B2 Level - All Categories Export
import type { VocabularyCategory } from '../types';

import { b2PoliticsCategory } from './politics';
import { b2EconomyCategory } from './economy';
import { b2ScienceCategory } from './science';
import { b2LawCategory } from './law';
import { b2AbstractCategory } from './abstract';
import { b2VerbsCategory } from './verbs';
import { b2AdjectivesCategory } from './adjectives';

export const b2VocabularyCategories: VocabularyCategory[] = [
    b2PoliticsCategory,
    b2EconomyCategory,
    b2ScienceCategory,
    b2LawCategory,
    b2AbstractCategory,
    b2VerbsCategory,
    b2AdjectivesCategory,
];

// Re-export individual categories
export * from './politics';
export * from './economy';
export * from './science';
export * from './law';
export * from './abstract';
export * from './verbs';
export * from './adjectives';
