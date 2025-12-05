// A2 Professions
import type { VocabularyWord, VocabularyCategory } from '../types';

export const a2Professions: VocabularyWord[] = [
    { id: 'a2_prof_1', german: 'der Beruf', russian: 'профессия', level: 'A2', category: 'professions' },
    { id: 'a2_prof_2', german: 'die Arbeit', russian: 'работа', level: 'A2', category: 'professions' },
    { id: 'a2_prof_3', german: 'der Arbeiter', russian: 'рабочий', level: 'A2', category: 'professions' },
    { id: 'a2_prof_4', german: 'der Ingenieur', russian: 'инженер', level: 'A2', category: 'professions' },
    { id: 'a2_prof_5', german: 'der Programmierer', russian: 'программист', level: 'A2', category: 'professions' },
    { id: 'a2_prof_6', german: 'der Anwalt', russian: 'адвокат', level: 'A2', category: 'professions' },
    { id: 'a2_prof_7', german: 'der Richter', russian: 'судья', level: 'A2', category: 'professions' },
    { id: 'a2_prof_8', german: 'der Polizist', russian: 'полицейский', level: 'A2', category: 'professions' },
    { id: 'a2_prof_9', german: 'der Feuerwehrmann', russian: 'пожарный', level: 'A2', category: 'professions' },
    { id: 'a2_prof_10', german: 'der Pilot', russian: 'пилот', level: 'A2', category: 'professions' },
    { id: 'a2_prof_11', german: 'der Krankenpfleger', russian: 'медбрат', level: 'A2', category: 'professions' },
    { id: 'a2_prof_12', german: 'die Krankenschwester', russian: 'медсестра', level: 'A2', category: 'professions' },
    { id: 'a2_prof_13', german: 'der Architekt', russian: 'архитектор', level: 'A2', category: 'professions' },
    { id: 'a2_prof_14', german: 'der Künstler', russian: 'художник', level: 'A2', category: 'professions' },
    { id: 'a2_prof_15', german: 'der Musiker', russian: 'музыкант', level: 'A2', category: 'professions' },
    { id: 'a2_prof_16', german: 'der Schauspieler', russian: 'актёр', level: 'A2', category: 'professions' },
    { id: 'a2_prof_17', german: 'der Journalist', russian: 'журналист', level: 'A2', category: 'professions' },
    { id: 'a2_prof_18', german: 'der Fotograf', russian: 'фотограф', level: 'A2', category: 'professions' },
    { id: 'a2_prof_19', german: 'der Friseur', russian: 'парикмахер', level: 'A2', category: 'professions' },
    { id: 'a2_prof_20', german: 'der Mechaniker', russian: 'механик', level: 'A2', category: 'professions' },
    { id: 'a2_prof_21', german: 'der Elektriker', russian: 'электрик', level: 'A2', category: 'professions' },
    { id: 'a2_prof_22', german: 'der Bäcker', russian: 'пекарь', level: 'A2', category: 'professions' },
    { id: 'a2_prof_23', german: 'der Metzger', russian: 'мясник', level: 'A2', category: 'professions' },
    { id: 'a2_prof_24', german: 'der Gärtner', russian: 'садовник', level: 'A2', category: 'professions' },
    { id: 'a2_prof_25', german: 'der Briefträger', russian: 'почтальон', level: 'A2', category: 'professions' },
    { id: 'a2_prof_26', german: 'der Chef', russian: 'начальник', level: 'A2', category: 'professions' },
    { id: 'a2_prof_27', german: 'der Kollege', russian: 'коллега', level: 'A2', category: 'professions' },
    { id: 'a2_prof_28', german: 'der Mitarbeiter', russian: 'сотрудник', level: 'A2', category: 'professions' },
    { id: 'a2_prof_29', german: 'das Büro', russian: 'офис', level: 'A2', category: 'professions' },
    { id: 'a2_prof_30', german: 'das Gehalt', russian: 'зарплата', level: 'A2', category: 'professions' },
];

export const a2ProfessionsCategory: VocabularyCategory = {
    id: 'a2_professions',
    level: 'A2',
    name: 'Professions',
    nameRu: 'Профессии',
    icon: '💼',
    wordCount: a2Professions.length,
    words: a2Professions
};
