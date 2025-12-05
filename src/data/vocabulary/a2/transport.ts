// A2 Transportation & Vehicles
import type { VocabularyWord, VocabularyCategory } from '../types';

export const a2Transport: VocabularyWord[] = [
    { id: 'a2_tra_1', german: 'das Verkehrsmittel', russian: 'транспортное средство', level: 'A2', category: 'transport' },
    { id: 'a2_tra_2', german: 'das Auto', russian: 'автомобиль', level: 'A2', category: 'transport' },
    { id: 'a2_tra_3', german: 'der Wagen', russian: 'машина', level: 'A2', category: 'transport' },
    { id: 'a2_tra_4', german: 'der Bus', russian: 'автобус', level: 'A2', category: 'transport' },
    { id: 'a2_tra_5', german: 'die Straßenbahn', russian: 'трамвай', level: 'A2', category: 'transport' },
    { id: 'a2_tra_6', german: 'die U-Bahn', russian: 'метро', level: 'A2', category: 'transport' },
    { id: 'a2_tra_7', german: 'der Zug', russian: 'поезд', level: 'A2', category: 'transport' },
    { id: 'a2_tra_8', german: 'die Bahn', russian: 'железная дорога', level: 'A2', category: 'transport' },
    { id: 'a2_tra_9', german: 'das Taxi', russian: 'такси', level: 'A2', category: 'transport' },
    { id: 'a2_tra_10', german: 'das Flugzeug', russian: 'самолёт', level: 'A2', category: 'transport' },
    { id: 'a2_tra_11', german: 'das Schiff', russian: 'корабль', level: 'A2', category: 'transport' },
    { id: 'a2_tra_12', german: 'das Fahrrad', russian: 'велосипед', level: 'A2', category: 'transport' },
    { id: 'a2_tra_13', german: 'das Motorrad', russian: 'мотоцикл', level: 'A2', category: 'transport' },
    { id: 'a2_tra_14', german: 'der Bahnhof', russian: 'вокзал', level: 'A2', category: 'transport' },
    { id: 'a2_tra_15', german: 'der Flughafen', russian: 'аэропорт', level: 'A2', category: 'transport' },
    { id: 'a2_tra_16', german: 'die Haltestelle', russian: 'остановка', level: 'A2', category: 'transport' },
    { id: 'a2_tra_17', german: 'die Straße', russian: 'улица', level: 'A2', category: 'transport' },
    { id: 'a2_tra_18', german: 'die Autobahn', russian: 'автобан', level: 'A2', category: 'transport' },
    { id: 'a2_tra_19', german: 'die Ampel', russian: 'светофор', level: 'A2', category: 'transport' },
    { id: 'a2_tra_20', german: 'das Ticket', russian: 'билет', level: 'A2', category: 'transport' },
    { id: 'a2_tra_21', german: 'die Fahrkarte', russian: 'проездной билет', level: 'A2', category: 'transport' },
    { id: 'a2_tra_22', german: 'der Fahrer', russian: 'водитель', level: 'A2', category: 'transport' },
    { id: 'a2_tra_23', german: 'der Passagier', russian: 'пассажир', level: 'A2', category: 'transport' },
    { id: 'a2_tra_24', german: 'abfahren', russian: 'отъезжать', level: 'A2', category: 'transport' },
    { id: 'a2_tra_25', german: 'ankommen', russian: 'прибывать', level: 'A2', category: 'transport' },
    { id: 'a2_tra_26', german: 'umsteigen', russian: 'пересаживаться', level: 'A2', category: 'transport' },
    { id: 'a2_tra_27', german: 'verpassen', russian: 'опоздать/пропустить', level: 'A2', category: 'transport' },
    { id: 'a2_tra_28', german: 'parken', russian: 'парковаться', level: 'A2', category: 'transport' },
    { id: 'a2_tra_29', german: 'der Parkplatz', russian: 'парковка', level: 'A2', category: 'transport' },
    { id: 'a2_tra_30', german: 'die Verspätung', russian: 'опоздание', level: 'A2', category: 'transport' },
];

export const a2TransportCategory: VocabularyCategory = {
    id: 'a2_transport',
    level: 'A2',
    name: 'Transportation & Vehicles',
    nameRu: 'Транспорт',
    icon: '🚗',
    wordCount: a2Transport.length,
    words: a2Transport
};
