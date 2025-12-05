// A2 Technology Basics
import type { VocabularyWord, VocabularyCategory } from '../types';

export const a2Technology: VocabularyWord[] = [
    { id: 'a2_tech_1', german: 'die Technologie', russian: 'технология', level: 'A2', category: 'technology' },
    { id: 'a2_tech_2', german: 'der Computer', russian: 'компьютер', level: 'A2', category: 'technology' },
    { id: 'a2_tech_3', german: 'der Laptop', russian: 'ноутбук', level: 'A2', category: 'technology' },
    { id: 'a2_tech_4', german: 'das Tablet', russian: 'планшет', level: 'A2', category: 'technology' },
    { id: 'a2_tech_5', german: 'das Handy', russian: 'мобильный телефон', level: 'A2', category: 'technology' },
    { id: 'a2_tech_6', german: 'das Smartphone', russian: 'смартфон', level: 'A2', category: 'technology' },
    { id: 'a2_tech_7', german: 'das Internet', russian: 'интернет', level: 'A2', category: 'technology' },
    { id: 'a2_tech_8', german: 'die E-Mail', russian: 'электронная почта', level: 'A2', category: 'technology' },
    { id: 'a2_tech_9', german: 'die Website', russian: 'веб-сайт', level: 'A2', category: 'technology' },
    { id: 'a2_tech_10', german: 'die App', russian: 'приложение', level: 'A2', category: 'technology' },
    { id: 'a2_tech_11', german: 'das Programm', russian: 'программа', level: 'A2', category: 'technology' },
    { id: 'a2_tech_12', german: 'die Software', russian: 'программное обеспечение', level: 'A2', category: 'technology' },
    { id: 'a2_tech_13', german: 'die Tastatur', russian: 'клавиатура', level: 'A2', category: 'technology' },
    { id: 'a2_tech_14', german: 'die Maus', russian: 'мышь', level: 'A2', category: 'technology' },
    { id: 'a2_tech_15', german: 'der Bildschirm', russian: 'экран', level: 'A2', category: 'technology' },
    { id: 'a2_tech_16', german: 'der Drucker', russian: 'принтер', level: 'A2', category: 'technology' },
    { id: 'a2_tech_17', german: 'drucken', russian: 'печатать', level: 'A2', category: 'technology' },
    { id: 'a2_tech_18', german: 'speichern', russian: 'сохранять', level: 'A2', category: 'technology' },
    { id: 'a2_tech_19', german: 'löschen', russian: 'удалять', level: 'A2', category: 'technology' },
    { id: 'a2_tech_20', german: 'herunterladen', russian: 'скачивать', level: 'A2', category: 'technology' },
    { id: 'a2_tech_21', german: 'hochladen', russian: 'загружать', level: 'A2', category: 'technology' },
    { id: 'a2_tech_22', german: 'das WLAN', russian: 'Wi-Fi', level: 'A2', category: 'technology' },
    { id: 'a2_tech_23', german: 'das Passwort', russian: 'пароль', level: 'A2', category: 'technology' },
    { id: 'a2_tech_24', german: 'anmelden', russian: 'входить в систему', level: 'A2', category: 'technology' },
    { id: 'a2_tech_25', german: 'abmelden', russian: 'выходить из системы', level: 'A2', category: 'technology' },
];

export const a2TechnologyCategory: VocabularyCategory = {
    id: 'a2_technology',
    level: 'A2',
    name: 'Technology Basics',
    nameRu: 'Базовые технологии',
    icon: '💻',
    wordCount: a2Technology.length,
    words: a2Technology
};
