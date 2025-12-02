export interface Sentence {
    id: string;
    sentence: string;
    targetWord: string;
    targetWordTranslation: string;
    level: string;
    topic: string;
}

export interface UserProgress {
    learnedWordIDs: string[];
    toRepeatWordIDs: string[];
    totalCompleted: number;
}

export interface ArticleSentence {
    id: string;
    sentence: string;
    correctArticle: string;
    caseName: string;
    noun: string;
    translation: string;
}

export interface AntonymExercise {
    id: string;
    word: string;
    options: string[];
    correct: string;
    translation: string;
}

export interface SynonymExercise {
    id: string;
    word: string;
    options: string[];
    correct: string;
    translation: string;
}

export interface StandaloneScenarioModel {
    id: string;
    sentence: string;
    sentenceTranslation?: string;
    targetWord: string;
    targetWordTranslation: string;
    options: string[];
    level?: string;
    topic?: string;
}

export interface BlockInfo {
    id: string;
    displayName: string;
}
