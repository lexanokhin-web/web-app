// A1 School Supplies
import type { VocabularyWord, VocabularyCategory } from '../types';

export const a1School: VocabularyWord[] = [
    { id: 'a1_sch_1', german: 'die Schule', russian: 'школа', level: 'A1', category: 'school' },
    { id: 'a1_sch_2', german: 'der Lehrer', russian: 'учитель', level: 'A1', category: 'school' },
    { id: 'a1_sch_3', german: 'die Lehrerin', russian: 'учительница', level: 'A1', category: 'school' },
    { id: 'a1_sch_4', german: 'der Schüler', russian: 'ученик', level: 'A1', category: 'school' },
    { id: 'a1_sch_5', german: 'die Schülerin', russian: 'ученица', level: 'A1', category: 'school' },
    { id: 'a1_sch_6', german: 'das Buch', russian: 'книга', level: 'A1', category: 'school' },
    { id: 'a1_sch_7', german: 'das Heft', russian: 'тетрадь', level: 'A1', category: 'school' },
    { id: 'a1_sch_8', german: 'der Bleistift', russian: 'карандаш', level: 'A1', category: 'school' },
    { id: 'a1_sch_9', german: 'der Kugelschreiber', russian: 'шариковая ручка', level: 'A1', category: 'school' },
    { id: 'a1_sch_10', german: 'der Füller', russian: 'ручка (перьевая)', level: 'A1', category: 'school' },
    { id: 'a1_sch_11', german: 'der Radiergummi', russian: 'ластик', level: 'A1', category: 'school' },
    { id: 'a1_sch_12', german: 'das Lineal', russian: 'линейка', level: 'A1', category: 'school' },
    { id: 'a1_sch_13', german: 'die Schere', russian: 'ножницы', level: 'A1', category: 'school' },
    { id: 'a1_sch_14', german: 'der Klebstoff', russian: 'клей', level: 'A1', category: 'school' },
    { id: 'a1_sch_15', german: 'das Papier', russian: 'бумага', level: 'A1', category: 'school' },
    { id: 'a1_sch_16', german: 'die Tafel', russian: 'доска', level: 'A1', category: 'school' },
    { id: 'a1_sch_17', german: 'die Kreide', russian: 'мел', level: 'A1', category: 'school' },
    { id: 'a1_sch_18', german: 'der Rucksack', russian: 'рюкзак', level: 'A1', category: 'school' },
    { id: 'a1_sch_19', german: 'die Tasche', russian: 'сумка', level: 'A1', category: 'school' },
    { id: 'a1_sch_20', german: 'die Klasse', russian: 'класс', level: 'A1', category: 'school' },
    { id: 'a1_sch_21', german: 'der Unterricht', russian: 'урок', level: 'A1', category: 'school' },
    { id: 'a1_sch_22', german: 'die Pause', russian: 'перемена', level: 'A1', category: 'school' },
    { id: 'a1_sch_23', german: 'die Hausaufgabe', russian: 'домашнее задание', level: 'A1', category: 'school' },
    { id: 'a1_sch_24', german: 'die Prüfung', russian: 'экзамен', level: 'A1', category: 'school' },
    { id: 'a1_sch_25', german: 'die Note', russian: 'оценка', level: 'A1', category: 'school' },
];

export const a1SchoolCategory: VocabularyCategory = {
    id: 'a1_school',
    level: 'A1',
    name: 'School Supplies',
    nameRu: 'Школьные принадлежности',
    icon: '📚',
    wordCount: a1School.length,
    words: a1School
};
