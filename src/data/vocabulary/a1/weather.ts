// A1 Weather & Seasons
import type { VocabularyWord, VocabularyCategory } from '../types';

export const a1Weather: VocabularyWord[] = [
    { id: 'a1_wea_1', german: 'das Wetter', russian: 'погода', level: 'A1', category: 'weather' },
    { id: 'a1_wea_2', german: 'die Sonne', russian: 'солнце', level: 'A1', category: 'weather' },
    { id: 'a1_wea_3', german: 'der Regen', russian: 'дождь', level: 'A1', category: 'weather' },
    { id: 'a1_wea_4', german: 'der Schnee', russian: 'снег', level: 'A1', category: 'weather' },
    { id: 'a1_wea_5', german: 'der Wind', russian: 'ветер', level: 'A1', category: 'weather' },
    { id: 'a1_wea_6', german: 'die Wolke', russian: 'облако', level: 'A1', category: 'weather' },
    { id: 'a1_wea_7', german: 'der Himmel', russian: 'небо', level: 'A1', category: 'weather' },
    { id: 'a1_wea_8', german: 'der Nebel', russian: 'туман', level: 'A1', category: 'weather' },
    { id: 'a1_wea_9', german: 'das Gewitter', russian: 'гроза', level: 'A1', category: 'weather' },
    { id: 'a1_wea_10', german: 'der Blitz', russian: 'молния', level: 'A1', category: 'weather' },
    { id: 'a1_wea_11', german: 'der Donner', russian: 'гром', level: 'A1', category: 'weather' },
    { id: 'a1_wea_12', german: 'warm', russian: 'тёплый', level: 'A1', category: 'weather' },
    { id: 'a1_wea_13', german: 'heiß', russian: 'жаркий', level: 'A1', category: 'weather' },
    { id: 'a1_wea_14', german: 'kalt', russian: 'холодный', level: 'A1', category: 'weather' },
    { id: 'a1_wea_15', german: 'kühl', russian: 'прохладный', level: 'A1', category: 'weather' },
    { id: 'a1_wea_16', german: 'sonnig', russian: 'солнечный', level: 'A1', category: 'weather' },
    { id: 'a1_wea_17', german: 'regnerisch', russian: 'дождливый', level: 'A1', category: 'weather' },
    { id: 'a1_wea_18', german: 'wolkig', russian: 'облачный', level: 'A1', category: 'weather' },
    { id: 'a1_wea_19', german: 'windig', russian: 'ветреный', level: 'A1', category: 'weather' },
    { id: 'a1_wea_20', german: 'die Jahreszeit', russian: 'время года', level: 'A1', category: 'weather' },
    { id: 'a1_wea_21', german: 'der Frühling', russian: 'весна', level: 'A1', category: 'weather' },
    { id: 'a1_wea_22', german: 'der Sommer', russian: 'лето', level: 'A1', category: 'weather' },
    { id: 'a1_wea_23', german: 'der Herbst', russian: 'осень', level: 'A1', category: 'weather' },
    { id: 'a1_wea_24', german: 'der Winter', russian: 'зима', level: 'A1', category: 'weather' },
    { id: 'a1_wea_25', german: 'die Temperatur', russian: 'температура', level: 'A1', category: 'weather' },
];

export const a1WeatherCategory: VocabularyCategory = {
    id: 'a1_weather',
    level: 'A1',
    name: 'Weather & Seasons',
    nameRu: 'Погода и времена года',
    icon: '☀️',
    wordCount: a1Weather.length,
    words: a1Weather
};
