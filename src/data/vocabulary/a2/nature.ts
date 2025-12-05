// A2 Nature & Plants
import type { VocabularyWord, VocabularyCategory } from '../types';

export const a2Nature: VocabularyWord[] = [
    { id: 'a2_nat_1', german: 'die Natur', russian: 'природа', level: 'A2', category: 'nature' },
    { id: 'a2_nat_2', german: 'die Landschaft', russian: 'ландшафт', level: 'A2', category: 'nature' },
    { id: 'a2_nat_3', german: 'der Baum', russian: 'дерево', level: 'A2', category: 'nature' },
    { id: 'a2_nat_4', german: 'der Wald', russian: 'лес', level: 'A2', category: 'nature' },
    { id: 'a2_nat_5', german: 'die Blume', russian: 'цветок', level: 'A2', category: 'nature' },
    { id: 'a2_nat_6', german: 'die Pflanze', russian: 'растение', level: 'A2', category: 'nature' },
    { id: 'a2_nat_7', german: 'das Gras', russian: 'трава', level: 'A2', category: 'nature' },
    { id: 'a2_nat_8', german: 'das Blatt', russian: 'лист', level: 'A2', category: 'nature' },
    { id: 'a2_nat_9', german: 'die Wurzel', russian: 'корень', level: 'A2', category: 'nature' },
    { id: 'a2_nat_10', german: 'der Berg', russian: 'гора', level: 'A2', category: 'nature' },
    { id: 'a2_nat_11', german: 'der Hügel', russian: 'холм', level: 'A2', category: 'nature' },
    { id: 'a2_nat_12', german: 'das Tal', russian: 'долина', level: 'A2', category: 'nature' },
    { id: 'a2_nat_13', german: 'der Fluss', russian: 'река', level: 'A2', category: 'nature' },
    { id: 'a2_nat_14', german: 'der See', russian: 'озеро', level: 'A2', category: 'nature' },
    { id: 'a2_nat_15', german: 'das Meer', russian: 'море', level: 'A2', category: 'nature' },
    { id: 'a2_nat_16', german: 'der Ozean', russian: 'океан', level: 'A2', category: 'nature' },
    { id: 'a2_nat_17', german: 'der Strand', russian: 'пляж', level: 'A2', category: 'nature' },
    { id: 'a2_nat_18', german: 'die Insel', russian: 'остров', level: 'A2', category: 'nature' },
    { id: 'a2_nat_19', german: 'die Wüste', russian: 'пустыня', level: 'A2', category: 'nature' },
    { id: 'a2_nat_20', german: 'der Stein', russian: 'камень', level: 'A2', category: 'nature' },
    { id: 'a2_nat_21', german: 'der Sand', russian: 'песок', level: 'A2', category: 'nature' },
    { id: 'a2_nat_22', german: 'das Feuer', russian: 'огонь', level: 'A2', category: 'nature' },
    { id: 'a2_nat_23', german: 'die Luft', russian: 'воздух', level: 'A2', category: 'nature' },
    { id: 'a2_nat_24', german: 'der Stern', russian: 'звезда', level: 'A2', category: 'nature' },
    { id: 'a2_nat_25', german: 'der Mond', russian: 'луна', level: 'A2', category: 'nature' },
];

export const a2NatureCategory: VocabularyCategory = {
    id: 'a2_nature',
    level: 'A2',
    name: 'Nature & Plants',
    nameRu: 'Природа и растения',
    icon: '🌳',
    wordCount: a2Nature.length,
    words: a2Nature
};
