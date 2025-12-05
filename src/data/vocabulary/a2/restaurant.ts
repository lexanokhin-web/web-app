// A2 Restaurant & Dining
import type { VocabularyWord, VocabularyCategory } from '../types';

export const a2Restaurant: VocabularyWord[] = [
    { id: 'a2_res_1', german: 'das Restaurant', russian: 'ресторан', level: 'A2', category: 'restaurant' },
    { id: 'a2_res_2', german: 'das Café', russian: 'кафе', level: 'A2', category: 'restaurant' },
    { id: 'a2_res_3', german: 'die Speisekarte', russian: 'меню', level: 'A2', category: 'restaurant' },
    { id: 'a2_res_4', german: 'die Vorspeise', russian: 'закуска', level: 'A2', category: 'restaurant' },
    { id: 'a2_res_5', german: 'die Hauptspeise', russian: 'основное блюдо', level: 'A2', category: 'restaurant' },
    { id: 'a2_res_6', german: 'die Nachspeise', russian: 'десерт', level: 'A2', category: 'restaurant' },
    { id: 'a2_res_7', german: 'das Dessert', russian: 'десерт', level: 'A2', category: 'restaurant' },
    { id: 'a2_res_8', german: 'das Gericht', russian: 'блюдо', level: 'A2', category: 'restaurant' },
    { id: 'a2_res_9', german: 'der Kellner', russian: 'официант', level: 'A2', category: 'restaurant' },
    { id: 'a2_res_10', german: 'die Kellnerin', russian: 'официантка', level: 'A2', category: 'restaurant' },
    { id: 'a2_res_11', german: 'der Koch', russian: 'повар', level: 'A2', category: 'restaurant' },
    { id: 'a2_res_12', german: 'der Tisch', russian: 'стол', level: 'A2', category: 'restaurant' },
    { id: 'a2_res_13', german: 'die Reservierung', russian: 'бронирование', level: 'A2', category: 'restaurant' },
    { id: 'a2_res_14', german: 'bestellen', russian: 'заказывать', level: 'A2', category: 'restaurant' },
    { id: 'a2_res_15', german: 'die Bestellung', russian: 'заказ', level: 'A2', category: 'restaurant' },
    { id: 'a2_res_16', german: 'servieren', russian: 'сервировать', level: 'A2', category: 'restaurant' },
    { id: 'a2_res_17', german: 'der Teller', russian: 'тарелка', level: 'A2', category: 'restaurant' },
    { id: 'a2_res_18', german: 'die Tasse', russian: 'чашка', level: 'A2', category: 'restaurant' },
    { id: 'a2_res_19', german: 'das Glas', russian: 'стакан', level: 'A2', category: 'restaurant' },
    { id: 'a2_res_20', german: 'die Gabel', russian: 'вилка', level: 'A2', category: 'restaurant' },
    { id: 'a2_res_21', german: 'das Messer', russian: 'нож', level: 'A2', category: 'restaurant' },
    { id: 'a2_res_22', german: 'der Löffel', russian: 'ложка', level: 'A2', category: 'restaurant' },
    { id: 'a2_res_23', german: 'die Serviette', russian: 'салфетка', level: 'A2', category: 'restaurant' },
    { id: 'a2_res_24', german: 'das Trinkgeld', russian: 'чаевые', level: 'A2', category: 'restaurant' },
    { id: 'a2_res_25', german: 'schmecken', russian: 'иметь вкус', level: 'A2', category: 'restaurant' },
];

export const a2RestaurantCategory: VocabularyCategory = {
    id: 'a2_restaurant',
    level: 'A2',
    name: 'Restaurant & Dining',
    nameRu: 'Ресторан и питание',
    icon: '🍴',
    wordCount: a2Restaurant.length,
    words: a2Restaurant
};
