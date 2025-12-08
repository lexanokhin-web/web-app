// A2 Level - All Categories Export
import type { VocabularyCategory } from '../types';

import { a2ShoppingCategory } from './shopping';
import { a2ClothingCategory } from './clothing';
import { a2HealthCategory } from './health';
import { a2HobbiesCategory } from './hobbies';
import { a2SportsCategory } from './sports';
import { a2TransportCategory } from './transport';
import { a2CityCategory } from './city';
import { a2NatureCategory } from './nature';
import { a2EmotionsCategory } from './emotions';
import { a2RestaurantCategory } from './restaurant';
import { a2TechnologyCategory } from './technology';
import { a2ProfessionsCategory } from './professions';
import { a2VerbsCategory } from './verbs';

export const a2VocabularyCategories: VocabularyCategory[] = [
    a2ShoppingCategory,
    a2ClothingCategory,
    a2HealthCategory,
    a2HobbiesCategory,
    a2SportsCategory,
    a2TransportCategory,
    a2CityCategory,
    a2NatureCategory,
    a2EmotionsCategory,
    a2RestaurantCategory,
    a2TechnologyCategory,
    a2ProfessionsCategory,
    a2VerbsCategory,
];

// Re-export individual categories
export * from './shopping';
export * from './clothing';
export * from './health';
export * from './hobbies';
export * from './sports';
export * from './transport';
export * from './city';
export * from './nature';
export * from './emotions';
export * from './restaurant';
export * from './technology';
export * from './professions';
export * from './verbs';

