// A2 Health & Medicine
import type { VocabularyWord, VocabularyCategory } from '../types';

export const a2Health: VocabularyWord[] = [
    { id: 'a2_hea_1', german: 'die Gesundheit', russian: 'здоровье', level: 'A2', category: 'health' },
    { id: 'a2_hea_2', german: 'die Krankheit', russian: 'болезнь', level: 'A2', category: 'health' },
    { id: 'a2_hea_3', german: 'der Arzt', russian: 'врач', level: 'A2', category: 'health' },
    { id: 'a2_hea_4', german: 'die Ärztin', russian: 'врач (ж.)', level: 'A2', category: 'health' },
    { id: 'a2_hea_5', german: 'der Zahnarzt', russian: 'стоматолог', level: 'A2', category: 'health' },
    { id: 'a2_hea_6', german: 'das Krankenhaus', russian: 'больница', level: 'A2', category: 'health' },
    { id: 'a2_hea_7', german: 'die Praxis', russian: 'практика/кабинет', level: 'A2', category: 'health' },
    { id: 'a2_hea_8', german: 'die Apotheke', russian: 'аптека', level: 'A2', category: 'health' },
    { id: 'a2_hea_9', german: 'das Medikament', russian: 'лекарство', level: 'A2', category: 'health' },
    { id: 'a2_hea_10', german: 'die Tablette', russian: 'таблетка', level: 'A2', category: 'health' },
    { id: 'a2_hea_11', german: 'die Pille', russian: 'пилюля', level: 'A2', category: 'health' },
    { id: 'a2_hea_12', german: 'der Schmerz', russian: 'боль', level: 'A2', category: 'health' },
    { id: 'a2_hea_13', german: 'das Fieber', russian: 'температура/лихорадка', level: 'A2', category: 'health' },
    { id: 'a2_hea_14', german: 'der Husten', russian: 'кашель', level: 'A2', category: 'health' },
    { id: 'a2_hea_15', german: 'der Schnupfen', russian: 'насморк', level: 'A2', category: 'health' },
    { id: 'a2_hea_16', german: 'die Erkältung', russian: 'простуда', level: 'A2', category: 'health' },
    { id: 'a2_hea_17', german: 'die Grippe', russian: 'грипп', level: 'A2', category: 'health' },
    { id: 'a2_hea_18', german: 'die Kopfschmerzen', russian: 'головная боль', level: 'A2', category: 'health' },
    { id: 'a2_hea_19', german: 'die Bauchschmerzen', russian: 'боль в животе', level: 'A2', category: 'health' },
    { id: 'a2_hea_20', german: 'die Halsschmerzen', russian: 'боль в горле', level: 'A2', category: 'health' },
    { id: 'a2_hea_21', german: 'der Termin', russian: 'приём/назначение', level: 'A2', category: 'health' },
    { id: 'a2_hea_22', german: 'die Untersuchung', russian: 'обследование', level: 'A2', category: 'health' },
    { id: 'a2_hea_23', german: 'das Rezept', russian: 'рецепт', level: 'A2', category: 'health' },
    { id: 'a2_hea_24', german: 'die Versicherung', russian: 'страховка', level: 'A2', category: 'health' },
    { id: 'a2_hea_25', german: 'der Krankenwagen', russian: 'скорая помощь', level: 'A2', category: 'health' },
    { id: 'a2_hea_26', german: 'die Spritze', russian: 'укол', level: 'A2', category: 'health' },
    { id: 'a2_hea_27', german: 'die Operation', russian: 'операция', level: 'A2', category: 'health' },
    { id: 'a2_hea_28', german: 'heilen', russian: 'лечить/исцелять', level: 'A2', category: 'health' },
    { id: 'a2_hea_29', german: 'behandeln', russian: 'лечить', level: 'A2', category: 'health' },
    { id: 'a2_hea_30', german: 'untersuchen', russian: 'обследовать', level: 'A2', category: 'health' },
];

export const a2HealthCategory: VocabularyCategory = {
    id: 'a2_health',
    level: 'A2',
    name: 'Health & Medicine',
    nameRu: 'Здоровье и медицина',
    icon: '🏥',
    wordCount: a2Health.length,
    words: a2Health
};
