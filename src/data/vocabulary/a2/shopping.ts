// A2 Shopping & Money
import type { VocabularyWord, VocabularyCategory } from '../types';

export const a2Shopping: VocabularyWord[] = [
    { id: 'a2_shop_1', german: 'das Geschäft', russian: 'магазин', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_2', german: 'der Laden', russian: 'лавка/магазин', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_3', german: 'der Supermarkt', russian: 'супермаркет', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_4', german: 'der Markt', russian: 'рынок', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_5', german: 'das Einkaufszentrum', russian: 'торговый центр', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_6', german: 'der Kunde', russian: 'клиент', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_7', german: 'der Verkäufer', russian: 'продавец', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_8', german: 'die Kasse', russian: 'касса', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_9', german: 'der Preis', russian: 'цена', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_10', german: 'das Geld', russian: 'деньги', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_11', german: 'der Euro', russian: 'евро', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_12', german: 'der Cent', russian: 'цент', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_13', german: 'die Kreditkarte', russian: 'кредитная карта', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_14', german: 'das Bargeld', russian: 'наличные', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_15', german: 'der Rabatt', russian: 'скидка', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_16', german: 'das Angebot', russian: 'предложение/акция', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_17', german: 'die Rechnung', russian: 'счёт', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_18', german: 'die Quittung', russian: 'чек', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_19', german: 'der Einkauf', russian: 'покупка', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_20', german: 'der Einkaufswagen', russian: 'тележка для покупок', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_21', german: 'die Tüte', russian: 'пакет', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_22', german: 'die Größe', russian: 'размер', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_23', german: 'die Qualität', russian: 'качество', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_24', german: 'umtauschen', russian: 'обменивать', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_25', german: 'zurückgeben', russian: 'возвращать', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_26', german: 'sparen', russian: 'экономить', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_27', german: 'ausgeben', russian: 'тратить', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_28', german: 'verdienen', russian: 'зарабатывать', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_29', german: 'leihen', russian: 'одалживать', level: 'A2', category: 'shopping' },
    { id: 'a2_shop_30', german: 'schulden', russian: 'быть должным', level: 'A2', category: 'shopping' },
];

export const a2ShoppingCategory: VocabularyCategory = {
    id: 'a2_shopping',
    level: 'A2',
    name: 'Shopping & Money',
    nameRu: 'Покупки и деньги',
    icon: '🛒',
    wordCount: a2Shopping.length,
    words: a2Shopping
};
