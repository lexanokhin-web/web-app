// A2 Emotions & Feelings
import type { VocabularyWord, VocabularyCategory } from '../types';

export const a2Emotions: VocabularyWord[] = [
    { id: 'a2_emo_1', german: 'das Gefühl', russian: 'чувство', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_2', german: 'die Emotion', russian: 'эмоция', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_3', german: 'die Liebe', russian: 'любовь', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_4', german: 'der Hass', russian: 'ненависть', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_5', german: 'die Freude', russian: 'радость', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_6', german: 'das Glück', russian: 'счастье', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_7', german: 'die Trauer', russian: 'печаль', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_8', german: 'die Angst', russian: 'страх', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_9', german: 'die Sorge', russian: 'беспокойство', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_10', german: 'die Wut', russian: 'гнев', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_11', german: 'der Ärger', russian: 'раздражение', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_12', german: 'die Überraschung', russian: 'удивление', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_13', german: 'das Interesse', russian: 'интерес', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_14', german: 'die Langeweile', russian: 'скука', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_15', german: 'der Stolz', russian: 'гордость', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_16', german: 'die Scham', russian: 'стыд', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_17', german: 'die Hoffnung', russian: 'надежда', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_18', german: 'die Enttäuschung', russian: 'разочарование', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_19', german: 'nervös', russian: 'нервный', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_20', german: 'aufgeregt', russian: 'взволнованный', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_21', german: 'ruhig', russian: 'спокойный', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_22', german: 'müde', russian: 'усталый', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_23', german: 'wach', russian: 'бодрый', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_24', german: 'zufrieden', russian: 'довольный', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_25', german: 'unzufrieden', russian: 'недовольный', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_26', german: 'fröhlich', russian: 'весёлый', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_27', german: 'einsam', russian: 'одинокий', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_28', german: 'verliebt', russian: 'влюблённый', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_29', german: 'eifersüchtig', russian: 'ревнивый', level: 'A2', category: 'emotions' },
    { id: 'a2_emo_30', german: 'dankbar', russian: 'благодарный', level: 'A2', category: 'emotions' },
];

export const a2EmotionsCategory: VocabularyCategory = {
    id: 'a2_emotions',
    level: 'A2',
    name: 'Emotions & Feelings',
    nameRu: 'Эмоции и чувства',
    icon: '❤️',
    wordCount: a2Emotions.length,
    words: a2Emotions
};
