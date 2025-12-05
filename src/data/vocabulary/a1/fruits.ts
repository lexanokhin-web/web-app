// A1 Fruits & Vegetables
import type { VocabularyWord, VocabularyCategory } from '../types';

export const a1Fruits: VocabularyWord[] = [
    { id: 'a1_fruit_1', german: 'der Apfel', russian: 'яблоко', level: 'A1', category: 'fruits' },
    { id: 'a1_fruit_2', german: 'die Banane', russian: 'банан', level: 'A1', category: 'fruits' },
    { id: 'a1_fruit_3', german: 'die Orange', russian: 'апельсин', level: 'A1', category: 'fruits' },
    { id: 'a1_fruit_4', german: 'die Zitrone', russian: 'лимон', level: 'A1', category: 'fruits' },
    { id: 'a1_fruit_5', german: 'die Birne', russian: 'груша', level: 'A1', category: 'fruits' },
    { id: 'a1_fruit_6', german: 'die Erdbeere', russian: 'клубника', level: 'A1', category: 'fruits' },
    { id: 'a1_fruit_7', german: 'die Kirsche', russian: 'вишня', level: 'A1', category: 'fruits' },
    { id: 'a1_fruit_8', german: 'die Traube', russian: 'виноград', level: 'A1', category: 'fruits' },
    { id: 'a1_fruit_9', german: 'die Tomate', russian: 'помидор', level: 'A1', category: 'fruits' },
    { id: 'a1_fruit_10', german: 'die Gurke', russian: 'огурец', level: 'A1', category: 'fruits' },
    { id: 'a1_fruit_11', german: 'die Karotte', russian: 'морковь', level: 'A1', category: 'fruits' },
    { id: 'a1_fruit_12', german: 'die Kartoffel', russian: 'картофель', level: 'A1', category: 'fruits' },
    { id: 'a1_fruit_13', german: 'die Zwiebel', russian: 'лук', level: 'A1', category: 'fruits' },
    { id: 'a1_fruit_14', german: 'der Knoblauch', russian: 'чеснок', level: 'A1', category: 'fruits' },
    { id: 'a1_fruit_15', german: 'der Salat', russian: 'салат (листья)', level: 'A1', category: 'fruits' },
    { id: 'a1_fruit_16', german: 'der Kohl', russian: 'капуста', level: 'A1', category: 'fruits' },
    { id: 'a1_fruit_17', german: 'der Pilz', russian: 'гриб', level: 'A1', category: 'fruits' },
];

export const a1FruitsCategory: VocabularyCategory = {
    id: 'a1_fruits',
    level: 'A1',
    name: 'Fruits & Vegetables',
    nameRu: 'Фрукты и овощи',
    icon: '🍎',
    wordCount: a1Fruits.length,
    words: a1Fruits
};
