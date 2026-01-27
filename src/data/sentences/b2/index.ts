import { b2ExercisesOld } from './b2';
import { b2ErweitertePartizipien } from './erweiterte_partizipien';
import { b2Nominalstil } from './nominalstil';
import { b2KonjunktivI } from './konjunktiv_i';
import { b2NomenVerb } from './nomen_verb_verbindungen';
import { b2Passiversatz } from './passiversatz';
import { b2Modalverben } from './modalverben';
import { b2KomplexeSaetze } from './komplexe_saetze';
import { b2Adjektive } from './adjektive_praepositionen';
import { b2Tekamolo } from './tekamolo';

export const b2Exercises = [
    ...b2ExercisesOld,
    ...b2ErweitertePartizipien,
    ...b2Nominalstil,
    ...b2KonjunktivI,
    ...b2NomenVerb,
    ...b2Passiversatz,
    ...b2Modalverben,
    ...b2KomplexeSaetze,
    ...b2Adjektive,
    ...b2Tekamolo
];
