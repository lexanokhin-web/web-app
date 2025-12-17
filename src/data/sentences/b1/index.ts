import { b1ExercisesOld } from './b1';
import { b1Satzbau } from './satzbau';
import { b1Passiv } from './passiv';
import { b1Konjunktiv } from './konjunktiv';
import { b1Verben } from './verben';
import { b1Relativsaetze } from './relativsaetze';
import { b1Zeitformen } from './zeitformen';
import { b1Partizipien } from './partizipien';
import { b1Genitiv } from './genitiv';

export const b1Exercises = [
    ...b1ExercisesOld,
    ...b1Satzbau,
    ...b1Passiv,
    ...b1Konjunktiv,
    ...b1Verben,
    ...b1Relativsaetze,
    ...b1Zeitformen,
    ...b1Partizipien,
    ...b1Genitiv
];
