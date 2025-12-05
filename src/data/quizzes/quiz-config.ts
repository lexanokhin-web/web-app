export type QuizLevel = 'A1' | 'A2' | 'B1' | 'B2';

export interface QuizTopic {
    id: string;
    title: string;
    description: string;
    file: string; // Filename relative to level folder e.g. "articles.json"
}

export interface LevelConfig {
    id: QuizLevel;
    title: string;
    description: string;
    topics: QuizTopic[];
}

export const QUIZ_CONFIG: LevelConfig[] = [
    {
        id: 'A1',
        title: 'A1 - Anfänger',
        description: 'Grundlagen der deutschen Grammatik',
        topics: [
            {
                id: 'articles',
                title: 'Artikel',
                description: 'Der, Die, Das, Ein, Eine',
                file: 'articles.json'
            },
            {
                id: 'personal_pronouns',
                title: 'Personalpronomen',
                description: 'Ich, du, er, sie, es...',
                file: 'personal_pronouns.json'
            },
            {
                id: 'present_tense',
                title: 'Präsens',
                description: 'Regelmäßige und unregelmäßige Verben',
                file: 'present_tense.json'
            },
            {
                id: 'plural',
                title: 'Plural',
                description: 'Pluralformen der Nomen',
                file: 'plural.json'
            },
            {
                id: 'accusative',
                title: 'Akkusativ',
                description: 'Direkte Objekte und Kasus',
                file: 'accusative.json'
            },
            {
                id: 'modal_verbs',
                title: 'Modalverben',
                description: 'Können, müssen, wollen, dürfen',
                file: 'modal_verbs.json'
            }
        ]
    },
    {
        id: 'A2',
        title: 'A2 - Grundlagen',
        description: 'Erweiterte Grundlagen',
        topics: [
            {
                id: 'perfect_tense',
                title: 'Perfekt',
                description: 'Vergangenheit mit haben und sein',
                file: 'perfect_tense.json'
            },
            {
                id: 'dative',
                title: 'Dativ',
                description: 'Indirekte Objekte und Dativ-Verben',
                file: 'dative.json'
            },
            {
                id: 'prepositions_locative',
                title: 'Wechselpräpositionen',
                description: 'In, an, auf, unter (Wo/Wohin)',
                file: 'prepositions_locative.json'
            },
            {
                id: 'adjective_endings_1',
                title: 'Adjektivendungen I',
                description: 'Grundlegende Deklination',
                file: 'adjective_endings_1.json'
            },
            {
                id: 'reflexive_verbs',
                title: 'Reflexive Verben',
                description: 'Sich waschen, sich freuen',
                file: 'reflexive_verbs.json'
            },
            {
                id: 'conjunctions_basic',
                title: 'Konjunktionen',
                description: 'Und, aber, oder, denn, deshalb',
                file: 'conjunctions_basic.json'
            }
        ]
    },
    {
        id: 'B1',
        title: 'B1 - Fortgeschritten',
        description: 'Komplexere Strukturen',
        topics: [
            {
                id: 'past_tense_pratetirum',
                title: 'Präteritum',
                description: 'Schriftliche Vergangenheit',
                file: 'past_tense_pratetirum.json'
            },
            {
                id: 'relative_clauses',
                title: 'Relativsätze',
                description: 'Der Mann, der... / Das Haus, das...',
                file: 'relative_clauses.json'
            },
            {
                id: 'passive_voice',
                title: 'Passiv',
                description: 'Vorgangspassiv mit werden',
                file: 'passive_voice.json'
            },
            {
                id: 'genitive',
                title: 'Genitiv',
                description: 'Besitzanzeigender Kasus',
                file: 'genitive.json'
            },
            {
                id: 'adjective_endings_2',
                title: 'Adjektivendungen II',
                description: 'Komplexe Deklination',
                file: 'adjective_endings_2.json'
            },
            {
                id: 'connectors_subordinate',
                title: 'Nebensatz-Konnektoren',
                description: 'Weil, dass, wenn, ob, obwohl',
                file: 'connectors_subordinate.json'
            }
        ]
    },
    {
        id: 'B2',
        title: 'B2 - Experte',
        description: 'Nuancen und Stil',
        topics: [
            {
                id: 'konjunktiv_ii',
                title: 'Konjunktiv II',
                description: 'Wünsche und irreale Bedingungen',
                file: 'konjunktiv_ii.json'
            },
            {
                id: 'participial_types',
                title: 'Partizipien als Adjektive',
                description: 'Partizip I und II vor Nomen',
                file: 'participial_types.json'
            },
            {
                id: 'noun_verb_connections',
                title: 'Nomen-Verb-Verbindungen',
                description: 'Funktionsverbgefüge',
                file: 'noun_verb_connections.json'
            },
            {
                id: 'advanced_prepositions',
                title: 'Genitiv-Präpositionen',
                description: 'Wegen, trotz, während, innerhalb',
                file: 'advanced_prepositions.json'
            },
            {
                id: 'indirect_speech',
                title: 'Indirekte Rede',
                description: 'Konjunktiv I',
                file: 'indirect_speech.json'
            }
        ]
    }
];
