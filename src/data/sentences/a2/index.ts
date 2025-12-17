import { a2ExercisesOld } from './a2';
import { a2Satzbau } from './satzbau';
import { a2VerbenZeiten } from './verben_zeiten';
import { a2Kasus } from './kasus';
import { a2Adjektive } from './adjektive';
import { a2Pronomen } from './pronomen';
import { a2Konnektoren } from './konnektoren';
import { a2Nebensaetze } from './nebensaetze';
import { a2Infinitiv } from './infinitiv';

export const a2Exercises = [
    ...a2ExercisesOld,
    ...a2Satzbau,
    ...a2VerbenZeiten,
    ...a2Kasus,
    ...a2Adjektive,
    ...a2Pronomen,
    ...a2Konnektoren,
    ...a2Nebensaetze,
    ...a2Infinitiv
];
