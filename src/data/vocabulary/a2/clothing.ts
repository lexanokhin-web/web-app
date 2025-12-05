// A2 Clothing & Accessories
import type { VocabularyWord, VocabularyCategory } from '../types';

export const a2Clothing: VocabularyWord[] = [
    { id: 'a2_clo_1', german: 'der Anzug', russian: 'костюм', level: 'A2', category: 'clothing' },
    { id: 'a2_clo_2', german: 'das Kostüm', russian: 'женский костюм', level: 'A2', category: 'clothing' },
    { id: 'a2_clo_3', german: 'die Krawatte', russian: 'галстук', level: 'A2', category: 'clothing' },
    { id: 'a2_clo_4', german: 'der Schlafanzug', russian: 'пижама', level: 'A2', category: 'clothing' },
    { id: 'a2_clo_5', german: 'die Unterwäsche', russian: 'нижнее бельё', level: 'A2', category: 'clothing' },
    { id: 'a2_clo_6', german: 'der BH', russian: 'лифчик', level: 'A2', category: 'clothing' },
    { id: 'a2_clo_7', german: 'die Strumpfhose', russian: 'колготки', level: 'A2', category: 'clothing' },
    { id: 'a2_clo_8', german: 'der Regenmantel', russian: 'плащ', level: 'A2', category: 'clothing' },
    { id: 'a2_clo_9', german: 'die Sportschuhe', russian: 'кроссовки', level: 'A2', category: 'clothing' },
    { id: 'a2_clo_10', german: 'die Turnschuhe', russian: 'кеды', level: 'A2', category: 'clothing' },
    { id: 'a2_clo_11', german: 'die Hausschuhe', russian: 'тапочки', level: 'A2', category: 'clothing' },
    { id: 'a2_clo_12', german: 'die Sonnenbrille', russian: 'солнечные очки', level: 'A2', category: 'clothing' },
    { id: 'a2_clo_13', german: 'der Regenschirm', russian: 'зонт', level: 'A2', category: 'clothing' },
    { id: 'a2_clo_14', german: 'die Handtasche', russian: 'дамская сумочка', level: 'A2', category: 'clothing' },
    { id: 'a2_clo_15', german: 'der Rucksack', russian: 'рюкзак', level: 'A2', category: 'clothing' },
    { id: 'a2_clo_16', german: 'der Geldbeutel', russian: 'кошелёк', level: 'A2', category: 'clothing' },
    { id: 'a2_clo_17', german: 'das Portemonnaie', russian: 'портмоне', level: 'A2', category: 'clothing' },
    { id: 'a2_clo_18', german: 'der Ring', russian: 'кольцо', level: 'A2', category: 'clothing' },
    { id: 'a2_clo_19', german: 'die Halskette', russian: 'ожерелье', level: 'A2', category: 'clothing' },
    { id: 'a2_clo_20', german: 'die Ohrringe', russian: 'серьги', level: 'A2', category: 'clothing' },
    { id: 'a2_clo_21', german: 'das Armband', russian: 'браслет', level: 'A2', category: 'clothing' },
    { id: 'a2_clo_22', german: 'anprobieren', russian: 'примерять', level: 'A2', category: 'clothing' },
    { id: 'a2_clo_23', german: 'passen', russian: 'подходить по размеру', level: 'A2', category: 'clothing' },
    { id: 'a2_clo_24', german: 'stehen', russian: 'идти (об одежде)', level: 'A2', category: 'clothing' },
    { id: 'a2_clo_25', german: 'modisch', russian: 'модный', level: 'A2', category: 'clothing' },
];

export const a2ClothingCategory: VocabularyCategory = {
    id: 'a2_clothing',
    level: 'A2',
    name: 'Clothing & Accessories',
    nameRu: 'Одежда и аксессуары',
    icon: '👔',
    wordCount: a2Clothing.length,
    words: a2Clothing
};
