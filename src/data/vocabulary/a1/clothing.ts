// A1 Clothing Basics
import type { VocabularyWord, VocabularyCategory } from '../types';

export const a1Clothing: VocabularyWord[] = [
    { id: 'a1_clo_1', german: 'die Kleidung', russian: 'одежда', level: 'A1', category: 'clothing' },
    { id: 'a1_clo_2', german: 'das T-Shirt', russian: 'футболка', level: 'A1', category: 'clothing' },
    { id: 'a1_clo_3', german: 'das Hemd', russian: 'рубашка', level: 'A1', category: 'clothing' },
    { id: 'a1_clo_4', german: 'die Bluse', russian: 'блузка', level: 'A1', category: 'clothing' },
    { id: 'a1_clo_5', german: 'die Hose', russian: 'брюки', level: 'A1', category: 'clothing' },
    { id: 'a1_clo_6', german: 'die Jeans', russian: 'джинсы', level: 'A1', category: 'clothing' },
    { id: 'a1_clo_7', german: 'der Rock', russian: 'юбка', level: 'A1', category: 'clothing' },
    { id: 'a1_clo_8', german: 'das Kleid', russian: 'платье', level: 'A1', category: 'clothing' },
    { id: 'a1_clo_9', german: 'die Jacke', russian: 'куртка', level: 'A1', category: 'clothing' },
    { id: 'a1_clo_10', german: 'der Mantel', russian: 'пальто', level: 'A1', category: 'clothing' },
    { id: 'a1_clo_11', german: 'der Pullover', russian: 'пуловер/свитер', level: 'A1', category: 'clothing' },
    { id: 'a1_clo_12', german: 'die Socke', russian: 'носок', level: 'A1', category: 'clothing' },
    { id: 'a1_clo_13', german: 'der Schuh', russian: 'ботинок', level: 'A1', category: 'clothing' },
    { id: 'a1_clo_14', german: 'der Stiefel', russian: 'сапог', level: 'A1', category: 'clothing' },
    { id: 'a1_clo_15', german: 'die Sandale', russian: 'сандалия', level: 'A1', category: 'clothing' },
    { id: 'a1_clo_16', german: 'der Hut', russian: 'шляпа', level: 'A1', category: 'clothing' },
    { id: 'a1_clo_17', german: 'die Mütze', russian: 'шапка', level: 'A1', category: 'clothing' },
    { id: 'a1_clo_18', german: 'der Schal', russian: 'шарф', level: 'A1', category: 'clothing' },
    { id: 'a1_clo_19', german: 'der Handschuh', russian: 'перчатка', level: 'A1', category: 'clothing' },
    { id: 'a1_clo_20', german: 'der Gürtel', russian: 'ремень', level: 'A1', category: 'clothing' },
    { id: 'a1_clo_21', german: 'die Krawatte', russian: 'галстук', level: 'A1', category: 'clothing' },
    { id: 'a1_clo_22', german: 'die Tasche', russian: 'сумка', level: 'A1', category: 'clothing' },
    { id: 'a1_clo_23', german: 'die Brille', russian: 'очки', level: 'A1', category: 'clothing' },
    { id: 'a1_clo_24', german: 'der Schmuck', russian: 'украшение', level: 'A1', category: 'clothing' },
    { id: 'a1_clo_25', german: 'die Uhr', russian: 'часы (наручные)', level: 'A1', category: 'clothing' },
];

export const a1ClothingCategory: VocabularyCategory = {
    id: 'a1_clothing',
    level: 'A1',
    name: 'Clothing Basics',
    nameRu: 'Базовая одежда',
    icon: '👕',
    wordCount: a1Clothing.length,
    words: a1Clothing
};
