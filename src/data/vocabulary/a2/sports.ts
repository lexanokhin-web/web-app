// A2 Sports
import type { VocabularyWord, VocabularyCategory } from '../types';

export const a2Sports: VocabularyWord[] = [
    { id: 'a2_spo_1', german: 'der Sport', russian: 'спорт', level: 'A2', category: 'sports' },
    { id: 'a2_spo_2', german: 'der Fußball', russian: 'футбол', level: 'A2', category: 'sports' },
    { id: 'a2_spo_3', german: 'der Basketball', russian: 'баскетбол', level: 'A2', category: 'sports' },
    { id: 'a2_spo_4', german: 'der Volleyball', russian: 'волейбол', level: 'A2', category: 'sports' },
    { id: 'a2_spo_5', german: 'das Tennis', russian: 'теннис', level: 'A2', category: 'sports' },
    { id: 'a2_spo_6', german: 'das Schwimmen', russian: 'плавание', level: 'A2', category: 'sports' },
    { id: 'a2_spo_7', german: 'das Laufen', russian: 'бег', level: 'A2', category: 'sports' },
    { id: 'a2_spo_8', german: 'joggen', russian: 'бегать трусцой', level: 'A2', category: 'sports' },
    { id: 'a2_spo_9', german: 'das Radfahren', russian: 'велоспорт', level: 'A2', category: 'sports' },
    { id: 'a2_spo_10', german: 'das Fahrrad', russian: 'велосипед', level: 'A2', category: 'sports' },
    { id: 'a2_spo_11', german: 'das Skifahren', russian: 'катание на лыжах', level: 'A2', category: 'sports' },
    { id: 'a2_spo_12', german: 'der Ski', russian: 'лыжа', level: 'A2', category: 'sports' },
    { id: 'a2_spo_13', german: 'das Snowboard', russian: 'сноуборд', level: 'A2', category: 'sports' },
    { id: 'a2_spo_14', german: 'das Eishockey', russian: 'хоккей', level: 'A2', category: 'sports' },
    { id: 'a2_spo_15', german: 'das Fitnessstudio', russian: 'фитнес-клуб', level: 'A2', category: 'sports' },
    { id: 'a2_spo_16', german: 'trainieren', russian: 'тренироваться', level: 'A2', category: 'sports' },
    { id: 'a2_spo_17', german: 'das Training', russian: 'тренировка', level: 'A2', category: 'sports' },
    { id: 'a2_spo_18', german: 'der Trainer', russian: 'тренер', level: 'A2', category: 'sports' },
    { id: 'a2_spo_19', german: 'der Spieler', russian: 'игрок', level: 'A2', category: 'sports' },
    { id: 'a2_spo_20', german: 'die Mannschaft', russian: 'команда', level: 'A2', category: 'sports' },
    { id: 'a2_spo_21', german: 'das Team', russian: 'команда', level: 'A2', category: 'sports' },
    { id: 'a2_spo_22', german: 'gewinnen', russian: 'выигрывать', level: 'A2', category: 'sports' },
    { id: 'a2_spo_23', german: 'verlieren', russian: 'проигрывать', level: 'A2', category: 'sports' },
    { id: 'a2_spo_24', german: 'der Sieg', russian: 'победа', level: 'A2', category: 'sports' },
    { id: 'a2_spo_25', german: 'die Niederlage', russian: 'поражение', level: 'A2', category: 'sports' },
];

export const a2SportsCategory: VocabularyCategory = {
    id: 'a2_sports',
    level: 'A2',
    name: 'Sports',
    nameRu: 'Спорт',
    icon: '⚽',
    wordCount: a2Sports.length,
    words: a2Sports
};
