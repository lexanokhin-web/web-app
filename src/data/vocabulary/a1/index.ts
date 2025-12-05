// A1 Level - All Categories Export
import type { VocabularyCategory } from '../types';

import { a1NumbersCategory } from './numbers';
import { a1FamilyCategory } from './family';
import { a1ColorsCategory } from './colors';
import { a1BodyCategory } from './body';
import { a1FoodCategory } from './food';
import { a1FruitsCategory } from './fruits';
import { a1HomeCategory } from './home';
import { a1TimeCategory } from './time';
import { a1WeatherCategory } from './weather';
import { a1VerbsCategory } from './verbs';
import { a1AdjectivesCategory } from './adjectives';
import { a1SchoolCategory } from './school';
import { a1AnimalsCategory } from './animals';
import { a1ClothingCategory } from './clothing';

export const a1VocabularyCategories: VocabularyCategory[] = [
    a1NumbersCategory,
    a1FamilyCategory,
    a1ColorsCategory,
    a1BodyCategory,
    a1FoodCategory,
    a1FruitsCategory,
    a1HomeCategory,
    a1TimeCategory,
    a1WeatherCategory,
    a1VerbsCategory,
    a1AdjectivesCategory,
    a1SchoolCategory,
    a1AnimalsCategory,
    a1ClothingCategory,
];

// Re-export individual categories if needed
export * from './numbers';
export * from './family';
export * from './colors';
export * from './body';
export * from './food';
export * from './fruits';
export * from './home';
export * from './time';
export * from './weather';
export * from './verbs';
export * from './adjectives';
export * from './school';
export * from './animals';
export * from './clothing';
