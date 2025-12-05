// A1 Animals
import type { VocabularyWord, VocabularyCategory } from '../types';

export const a1Animals: VocabularyWord[] = [
    { id: 'a1_ani_1', german: 'das Tier', russian: 'животное', level: 'A1', category: 'animals' },
    { id: 'a1_ani_2', german: 'der Hund', russian: 'собака', level: 'A1', category: 'animals' },
    { id: 'a1_ani_3', german: 'die Katze', russian: 'кошка', level: 'A1', category: 'animals' },
    { id: 'a1_ani_4', german: 'die Maus', russian: 'мышь', level: 'A1', category: 'animals' },
    { id: 'a1_ani_5', german: 'das Pferd', russian: 'лошадь', level: 'A1', category: 'animals' },
    { id: 'a1_ani_6', german: 'die Kuh', russian: 'корова', level: 'A1', category: 'animals' },
    { id: 'a1_ani_7', german: 'das Schwein', russian: 'свинья', level: 'A1', category: 'animals' },
    { id: 'a1_ani_8', german: 'das Schaf', russian: 'овца', level: 'A1', category: 'animals' },
    { id: 'a1_ani_9', german: 'die Ziege', russian: 'коза', level: 'A1', category: 'animals' },
    { id: 'a1_ani_10', german: 'das Huhn', russian: 'курица', level: 'A1', category: 'animals' },
    { id: 'a1_ani_11', german: 'der Hahn', russian: 'петух', level: 'A1', category: 'animals' },
    { id: 'a1_ani_12', german: 'die Ente', russian: 'утка', level: 'A1', category: 'animals' },
    { id: 'a1_ani_13', german: 'der Vogel', russian: 'птица', level: 'A1', category: 'animals' },
    { id: 'a1_ani_14', german: 'der Fisch', russian: 'рыба', level: 'A1', category: 'animals' },
    { id: 'a1_ani_15', german: 'das Kaninchen', russian: 'кролик', level: 'A1', category: 'animals' },
    { id: 'a1_ani_16', german: 'der Hamster', russian: 'хомяк', level: 'A1', category: 'animals' },
    { id: 'a1_ani_17', german: 'der Elefant', russian: 'слон', level: 'A1', category: 'animals' },
    { id: 'a1_ani_18', german: 'der Löwe', russian: 'лев', level: 'A1', category: 'animals' },
    { id: 'a1_ani_19', german: 'der Tiger', russian: 'тигр', level: 'A1', category: 'animals' },
    { id: 'a1_ani_20', german: 'der Bär', russian: 'медведь', level: 'A1', category: 'animals' },
    { id: 'a1_ani_21', german: 'der Wolf', russian: 'волк', level: 'A1', category: 'animals' },
    { id: 'a1_ani_22', german: 'der Fuchs', russian: 'лиса', level: 'A1', category: 'animals' },
    { id: 'a1_ani_23', german: 'das Reh', russian: 'олень', level: 'A1', category: 'animals' },
    { id: 'a1_ani_24', german: 'die Giraffe', russian: 'жираф', level: 'A1', category: 'animals' },
    { id: 'a1_ani_25', german: 'das Zebra', russian: 'зебра', level: 'A1', category: 'animals' },
    { id: 'a1_ani_26', german: 'der Affe', russian: 'обезьяна', level: 'A1', category: 'animals' },
    { id: 'a1_ani_27', german: 'die Schlange', russian: 'змея', level: 'A1', category: 'animals' },
    { id: 'a1_ani_28', german: 'die Schildkröte', russian: 'черепаха', level: 'A1', category: 'animals' },
    { id: 'a1_ani_29', german: 'der Frosch', russian: 'лягушка', level: 'A1', category: 'animals' },
    { id: 'a1_ani_30', german: 'die Biene', russian: 'пчела', level: 'A1', category: 'animals' },
    { id: 'a1_ani_31', german: 'die Fliege', russian: 'муха', level: 'A1', category: 'animals' },
    { id: 'a1_ani_32', german: 'die Mücke', russian: 'комар', level: 'A1', category: 'animals' },
    { id: 'a1_ani_33', german: 'der Schmetterling', russian: 'бабочка', level: 'A1', category: 'animals' },
    { id: 'a1_ani_34', german: 'die Spinne', russian: 'паук', level: 'A1', category: 'animals' },
];

export const a1AnimalsCategory: VocabularyCategory = {
    id: 'a1_animals',
    level: 'A1',
    name: 'Animals',
    nameRu: 'Животные',
    icon: '🐾',
    wordCount: a1Animals.length,
    words: a1Animals
};
