// A2 City & Places
import type { VocabularyWord, VocabularyCategory } from '../types';

export const a2City: VocabularyWord[] = [
    { id: 'a2_city_1', german: 'die Stadt', russian: 'город', level: 'A2', category: 'city' },
    { id: 'a2_city_2', german: 'das Dorf', russian: 'деревня', level: 'A2', category: 'city' },
    { id: 'a2_city_3', german: 'das Zentrum', russian: 'центр', level: 'A2', category: 'city' },
    { id: 'a2_city_4', german: 'die Bank', russian: 'банк', level: 'A2', category: 'city' },
    { id: 'a2_city_5', german: 'die Post', russian: 'почта', level: 'A2', category: 'city' },
    { id: 'a2_city_6', german: 'das Restaurant', russian: 'ресторан', level: 'A2', category: 'city' },
    { id: 'a2_city_7', german: 'das Café', russian: 'кафе', level: 'A2', category: 'city' },
    { id: 'a2_city_8', german: 'das Hotel', russian: 'отель', level: 'A2', category: 'city' },
    { id: 'a2_city_9', german: 'die Bibliothek', russian: 'библиотека', level: 'A2', category: 'city' },
    { id: 'a2_city_10', german: 'die Kirche', russian: 'церковь', level: 'A2', category: 'city' },
    { id: 'a2_city_11', german: 'der Park', russian: 'парк', level: 'A2', category: 'city' },
    { id: 'a2_city_12', german: 'das Schwimmbad', russian: 'бассейн', level: 'A2', category: 'city' },
    { id: 'a2_city_13', german: 'das Stadion', russian: 'стадион', level: 'A2', category: 'city' },
    { id: 'a2_city_14', german: 'die Polizei', russian: 'полиция', level: 'A2', category: 'city' },
    { id: 'a2_city_15', german: 'die Feuerwehr', russian: 'пожарная служба', level: 'A2', category: 'city' },
    { id: 'a2_city_16', german: 'das Rathaus', russian: 'ратуша', level: 'A2', category: 'city' },
    { id: 'a2_city_17', german: 'der Platz', russian: 'площадь', level: 'A2', category: 'city' },
    { id: 'a2_city_18', german: 'die Brücke', russian: 'мост', level: 'A2', category: 'city' },
    { id: 'a2_city_19', german: 'der Turm', russian: 'башня', level: 'A2', category: 'city' },
    { id: 'a2_city_20', german: 'das Gebäude', russian: 'здание', level: 'A2', category: 'city' },
    { id: 'a2_city_21', german: 'der Eingang', russian: 'вход', level: 'A2', category: 'city' },
    { id: 'a2_city_22', german: 'der Ausgang', russian: 'выход', level: 'A2', category: 'city' },
    { id: 'a2_city_23', german: 'die Ecke', russian: 'угол', level: 'A2', category: 'city' },
    { id: 'a2_city_24', german: 'geradeaus', russian: 'прямо', level: 'A2', category: 'city' },
    { id: 'a2_city_25', german: 'links', russian: 'налево', level: 'A2', category: 'city' },
    { id: 'a2_city_26', german: 'rechts', russian: 'направо', level: 'A2', category: 'city' },
    { id: 'a2_city_27', german: 'die Richtung', russian: 'направление', level: 'A2', category: 'city' },
    { id: 'a2_city_28', german: 'der Weg', russian: 'путь', level: 'A2', category: 'city' },
    { id: 'a2_city_29', german: 'die Adresse', russian: 'адрес', level: 'A2', category: 'city' },
    { id: 'a2_city_30', german: 'die Postleitzahl', russian: 'почтовый индекс', level: 'A2', category: 'city' },
];

export const a2CityCategory: VocabularyCategory = {
    id: 'a2_city',
    level: 'A2',
    name: 'City & Places',
    nameRu: 'Город и места',
    icon: '🏙️',
    wordCount: a2City.length,
    words: a2City
};
