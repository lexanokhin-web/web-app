// A1 Colors
import type { VocabularyWord, VocabularyCategory } from '../types';

export const a1Colors: VocabularyWord[] = [
    { id: 'a1_col_1', german: 'die Farbe', russian: 'цвет', level: 'A1', category: 'colors' },
    { id: 'a1_col_2', german: 'rot', russian: 'красный', level: 'A1', category: 'colors' },
    { id: 'a1_col_3', german: 'blau', russian: 'синий', level: 'A1', category: 'colors' },
    { id: 'a1_col_4', german: 'gelb', russian: 'жёлтый', level: 'A1', category: 'colors' },
    { id: 'a1_col_5', german: 'grün', russian: 'зелёный', level: 'A1', category: 'colors' },
    { id: 'a1_col_6', german: 'schwarz', russian: 'чёрный', level: 'A1', category: 'colors' },
    { id: 'a1_col_7', german: 'weiß', russian: 'белый', level: 'A1', category: 'colors' },
    { id: 'a1_col_8', german: 'grau', russian: 'серый', level: 'A1', category: 'colors' },
    { id: 'a1_col_9', german: 'braun', russian: 'коричневый', level: 'A1', category: 'colors' },
    { id: 'a1_col_10', german: 'orange', russian: 'оранжевый', level: 'A1', category: 'colors' },
    { id: 'a1_col_11', german: 'rosa', russian: 'розовый', level: 'A1', category: 'colors' },
    { id: 'a1_col_12', german: 'lila', russian: 'фиолетовый', level: 'A1', category: 'colors' },
    { id: 'a1_col_13', german: 'hell', russian: 'светлый', level: 'A1', category: 'colors' },
    { id: 'a1_col_14', german: 'dunkel', russian: 'тёмный', level: 'A1', category: 'colors' },
    { id: 'a1_col_15', german: 'bunt', russian: 'цветной/пёстрый', level: 'A1', category: 'colors' },
];

export const a1ColorsCategory: VocabularyCategory = {
    id: 'a1_colors',
    level: 'A1',
    name: 'Colors',
    nameRu: 'Цвета',
    icon: '🎨',
    wordCount: a1Colors.length,
    words: a1Colors
};
