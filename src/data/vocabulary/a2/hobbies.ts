// A2 Hobbies & Free Time
import type { VocabularyWord, VocabularyCategory } from '../types';

export const a2Hobbies: VocabularyWord[] = [
    { id: 'a2_hob_1', german: 'das Hobby', russian: 'хобби', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_2', german: 'die Freizeit', russian: 'свободное время', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_3', german: 'das Interesse', russian: 'интерес', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_4', german: 'die Musik', russian: 'музыка', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_5', german: 'das Instrument', russian: 'инструмент', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_6', german: 'die Gitarre', russian: 'гитара', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_7', german: 'das Klavier', russian: 'пианино', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_8', german: 'die Kunst', russian: 'искусство', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_9', german: 'malen', russian: 'рисовать (краской)', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_10', german: 'zeichnen', russian: 'рисовать (карандашом)', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_11', german: 'fotografieren', russian: 'фотографировать', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_12', german: 'die Fotografie', russian: 'фотография', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_13', german: 'sammeln', russian: 'коллекционировать', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_14', german: 'die Sammlung', russian: 'коллекция', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_15', german: 'basteln', russian: 'мастерить', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_16', german: 'nähen', russian: 'шить', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_17', german: 'stricken', russian: 'вязать', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_18', german: 'das Kino', russian: 'кино', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_19', german: 'der Film', russian: 'фильм', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_20', german: 'das Theater', russian: 'театр', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_21', german: 'das Konzert', russian: 'концерт', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_22', german: 'das Museum', russian: 'музей', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_23', german: 'die Ausstellung', russian: 'выставка', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_24', german: 'das Spiel', russian: 'игра', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_25', german: 'das Videospiel', russian: 'видеоигра', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_26', german: 'das Schach', russian: 'шахматы', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_27', german: 'die Karten', russian: 'карты', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_28', german: 'wandern', russian: 'ходить в походы', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_29', german: 'campen', russian: 'кемпинговать', level: 'A2', category: 'hobbies' },
    { id: 'a2_hob_30', german: 'reisen', russian: 'путешествовать', level: 'A2', category: 'hobbies' },
];

export const a2HobbiesCategory: VocabularyCategory = {
    id: 'a2_hobbies',
    level: 'A2',
    name: 'Hobbies & Free Time',
    nameRu: 'Хобби и досуг',
    icon: '🎨',
    wordCount: a2Hobbies.length,
    words: a2Hobbies
};
