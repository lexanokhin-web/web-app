import { a1Satzbau } from './satzbau';
import { a1Verben } from './verben';
import { a1NomenArtikel } from './nomen_artikel';
import { a1Pronomen } from './pronomen';
import { a1Kasus } from './kasus';
import { a1Praepositionen } from './praepositionen';
import { a1Adjektive } from './adjektive';

import { a1ExercisesOld } from './a1';

export const a1Exercises = [
    ...a1ExercisesOld,
    ...a1Satzbau,
    ...a1Verben,
    ...a1NomenArtikel,
    ...a1Pronomen,
    ...a1Kasus,
    ...a1Praepositionen,
    ...a1Adjektive
];
