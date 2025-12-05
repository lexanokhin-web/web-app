// A1 Body Parts
import type { VocabularyWord, VocabularyCategory } from '../types';

export const a1Body: VocabularyWord[] = [
    { id: 'a1_body_1', german: 'der Körper', russian: 'тело', level: 'A1', category: 'body' },
    { id: 'a1_body_2', german: 'der Kopf', russian: 'голова', level: 'A1', category: 'body' },
    { id: 'a1_body_3', german: 'das Gesicht', russian: 'лицо', level: 'A1', category: 'body' },
    { id: 'a1_body_4', german: 'das Auge', russian: 'глаз', level: 'A1', category: 'body' },
    { id: 'a1_body_5', german: 'die Nase', russian: 'нос', level: 'A1', category: 'body' },
    { id: 'a1_body_6', german: 'der Mund', russian: 'рот', level: 'A1', category: 'body' },
    { id: 'a1_body_7', german: 'das Ohr', russian: 'ухо', level: 'A1', category: 'body' },
    { id: 'a1_body_8', german: 'der Zahn', russian: 'зуб', level: 'A1', category: 'body' },
    { id: 'a1_body_9', german: 'die Zunge', russian: 'язык', level: 'A1', category: 'body' },
    { id: 'a1_body_10', german: 'die Lippe', russian: 'губа', level: 'A1', category: 'body' },
    { id: 'a1_body_11', german: 'das Haar', russian: 'волос', level: 'A1', category: 'body' },
    { id: 'a1_body_12', german: 'der Hals', russian: 'шея', level: 'A1', category: 'body' },
    { id: 'a1_body_13', german: 'die Schulter', russian: 'плечо', level: 'A1', category: 'body' },
    { id: 'a1_body_14', german: 'der Arm', russian: 'рука (от плеча)', level: 'A1', category: 'body' },
    { id: 'a1_body_15', german: 'die Hand', russian: 'рука (кисть)', level: 'A1', category: 'body' },
    { id: 'a1_body_16', german: 'der Finger', russian: 'палец', level: 'A1', category: 'body' },
    { id: 'a1_body_17', german: 'der Daumen', russian: 'большой палец', level: 'A1', category: 'body' },
    { id: 'a1_body_18', german: 'die Brust', russian: 'грудь', level: 'A1', category: 'body' },
    { id: 'a1_body_19', german: 'der Bauch', russian: 'живот', level: 'A1', category: 'body' },
    { id: 'a1_body_20', german: 'der Rücken', russian: 'спина', level: 'A1', category: 'body' },
    { id: 'a1_body_21', german: 'das Bein', russian: 'нога', level: 'A1', category: 'body' },
    { id: 'a1_body_22', german: 'das Knie', russian: 'колено', level: 'A1', category: 'body' },
    { id: 'a1_body_23', german: 'der Fuß', russian: 'стопа', level: 'A1', category: 'body' },
    { id: 'a1_body_24', german: 'die Zehe', russian: 'палец ноги', level: 'A1', category: 'body' },
    { id: 'a1_body_25', german: 'die Haut', russian: 'кожа', level: 'A1', category: 'body' },
    { id: 'a1_body_26', german: 'das Herz', russian: 'сердце', level: 'A1', category: 'body' },
    { id: 'a1_body_27', german: 'das Blut', russian: 'кровь', level: 'A1', category: 'body' },
    { id: 'a1_body_28', german: 'der Knochen', russian: 'кость', level: 'A1', category: 'body' },
];

export const a1BodyCategory: VocabularyCategory = {
    id: 'a1_body',
    level: 'A1',
    name: 'Body Parts',
    nameRu: 'Части тела',
    icon: '🧍',
    wordCount: a1Body.length,
    words: a1Body
};
