// A1 Numbers - Cardinals, Ordinals, and Math terms
import type { VocabularyWord, VocabularyCategory } from '../types';

export const a1Numbers: VocabularyWord[] = [
    // Cardinals
    { id: 'a1_num_1', german: 'null', russian: 'ноль', level: 'A1', category: 'numbers' },
    { id: 'a1_num_2', german: 'eins', russian: 'один', level: 'A1', category: 'numbers' },
    { id: 'a1_num_3', german: 'zwei', russian: 'два', level: 'A1', category: 'numbers' },
    { id: 'a1_num_4', german: 'drei', russian: 'три', level: 'A1', category: 'numbers' },
    { id: 'a1_num_5', german: 'vier', russian: 'четыре', level: 'A1', category: 'numbers' },
    { id: 'a1_num_6', german: 'fünf', russian: 'пять', level: 'A1', category: 'numbers' },
    { id: 'a1_num_7', german: 'sechs', russian: 'шесть', level: 'A1', category: 'numbers' },
    { id: 'a1_num_8', german: 'sieben', russian: 'семь', level: 'A1', category: 'numbers' },
    { id: 'a1_num_9', german: 'acht', russian: 'восемь', level: 'A1', category: 'numbers' },
    { id: 'a1_num_10', german: 'neun', russian: 'девять', level: 'A1', category: 'numbers' },
    { id: 'a1_num_11', german: 'zehn', russian: 'десять', level: 'A1', category: 'numbers' },
    { id: 'a1_num_12', german: 'elf', russian: 'одиннадцать', level: 'A1', category: 'numbers' },
    { id: 'a1_num_13', german: 'zwölf', russian: 'двенадцать', level: 'A1', category: 'numbers' },
    { id: 'a1_num_14', german: 'dreizehn', russian: 'тринадцать', level: 'A1', category: 'numbers' },
    { id: 'a1_num_15', german: 'vierzehn', russian: 'четырнадцать', level: 'A1', category: 'numbers' },
    { id: 'a1_num_16', german: 'fünfzehn', russian: 'пятнадцать', level: 'A1', category: 'numbers' },
    { id: 'a1_num_17', german: 'sechzehn', russian: 'шестнадцать', level: 'A1', category: 'numbers' },
    { id: 'a1_num_18', german: 'siebzehn', russian: 'семнадцать', level: 'A1', category: 'numbers' },
    { id: 'a1_num_19', german: 'achtzehn', russian: 'восемнадцать', level: 'A1', category: 'numbers' },
    { id: 'a1_num_20', german: 'neunzehn', russian: 'девятнадцать', level: 'A1', category: 'numbers' },
    { id: 'a1_num_21', german: 'zwanzig', russian: 'двадцать', level: 'A1', category: 'numbers' },
    { id: 'a1_num_22', german: 'dreißig', russian: 'тридцать', level: 'A1', category: 'numbers' },
    { id: 'a1_num_23', german: 'vierzig', russian: 'сорок', level: 'A1', category: 'numbers' },
    { id: 'a1_num_24', german: 'fünfzig', russian: 'пятьдесят', level: 'A1', category: 'numbers' },
    { id: 'a1_num_25', german: 'sechzig', russian: 'шестьдесят', level: 'A1', category: 'numbers' },
    { id: 'a1_num_26', german: 'siebzig', russian: 'семьдесят', level: 'A1', category: 'numbers' },
    { id: 'a1_num_27', german: 'achtzig', russian: 'восемьдесят', level: 'A1', category: 'numbers' },
    { id: 'a1_num_28', german: 'neunzig', russian: 'девяносто', level: 'A1', category: 'numbers' },
    { id: 'a1_num_29', german: 'hundert', russian: 'сто', level: 'A1', category: 'numbers' },
    { id: 'a1_num_30', german: 'tausend', russian: 'тысяча', level: 'A1', category: 'numbers' },
    // Ordinals
    { id: 'a1_num_31', german: 'erste', russian: 'первый', level: 'A1', category: 'numbers' },
    { id: 'a1_num_32', german: 'zweite', russian: 'второй', level: 'A1', category: 'numbers' },
    { id: 'a1_num_33', german: 'dritte', russian: 'третий', level: 'A1', category: 'numbers' },
    { id: 'a1_num_34', german: 'vierte', russian: 'четвёртый', level: 'A1', category: 'numbers' },
    { id: 'a1_num_35', german: 'fünfte', russian: 'пятый', level: 'A1', category: 'numbers' },
    // Math
    { id: 'a1_num_36', german: 'plus', russian: 'плюс', level: 'A1', category: 'numbers' },
    { id: 'a1_num_37', german: 'minus', russian: 'минус', level: 'A1', category: 'numbers' },
    { id: 'a1_num_38', german: 'mal', russian: 'умножить', level: 'A1', category: 'numbers' },
    { id: 'a1_num_39', german: 'geteilt', russian: 'делить', level: 'A1', category: 'numbers' },
    { id: 'a1_num_40', german: 'gleich', russian: 'равно', level: 'A1', category: 'numbers' },
];

export const a1NumbersCategory: VocabularyCategory = {
    id: 'a1_numbers',
    level: 'A1',
    name: 'Numbers',
    nameRu: 'Числа',
    icon: '🔢',
    wordCount: a1Numbers.length,
    words: a1Numbers
};
