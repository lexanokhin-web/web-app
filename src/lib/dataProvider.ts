import type { BlockInfo, Sentence, UserProgress, ArticleSentence, AntonymExercise, SynonymExercise, StandaloneScenarioModel } from '../types';

const PROGRESS_KEY_PREFIX = "userProgress_";

export const availableBlocks: BlockInfo[] = [
    { id: "sentences", displayName: "Verb Learn 1-100 A1" },
    { id: "sentence2", displayName: "Verb Learn 101-200 A1-A2" },
    { id: "sentence3", displayName: "Verb Learn 201-300 A2-B1" },
    { id: "sentence4", displayName: "Verb Learn 301-400 (Ofte Verben)" },
    { id: "sentence5", displayName: "Verb Learn 401-500" },
];

export class DataProvider {
    private static instance: DataProvider;
    private currentBlock: BlockInfo | null = null;
    private sentences: Sentence[] = [];

    private constructor() { }

    public static getInstance(): DataProvider {
        if (!DataProvider.instance) {
            DataProvider.instance = new DataProvider();
        }
        return DataProvider.instance;
    }

    public async loadBlock(block: BlockInfo): Promise<Sentence[]> {
        this.currentBlock = block;
        try {
            const response = await fetch(`/data/${block.id}.json`);
            if (!response.ok) throw new Error("Failed to load data");
            const data = await response.json();
            this.sentences = data;
            return data;
        } catch (error) {
            console.error(error);
            this.sentences = [];
            return [];
        }
    }

    public async loadArticleSentences(): Promise<ArticleSentence[]> {
        try {
            const response = await fetch(`/data/article_sentences.json`);
            if (!response.ok) throw new Error("Failed to load data");
            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    public async loadPersonalPronounExercises(): Promise<any[]> { // Type is not defined in Models.swift but used in PersonalPronounExerciseView
        try {
            const response = await fetch(`/data/personalpronomen_exercises.json`);
            if (!response.ok) throw new Error("Failed to load data");
            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    public async loadAntonymExercises(): Promise<AntonymExercise[]> {
        try {
            const response = await fetch(`/data/antonyms_exercises.json`);
            if (!response.ok) throw new Error("Failed to load data");
            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    public async loadSynonymExercises(): Promise<SynonymExercise[]> {
        try {
            const response = await fetch(`/data/synonym_exercises.json`);
            if (!response.ok) throw new Error("Failed to load data");
            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    public async loadTestScenario(filename: string): Promise<StandaloneScenarioModel[]> {
        try {
            const response = await fetch(`/data/${filename}.json`);
            if (!response.ok) throw new Error("Failed to load data");
            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    public getSentences(): Sentence[] {
        return this.sentences;
    }

    public loadProgress(): UserProgress {
        if (!this.currentBlock) return { learnedWordIDs: [], toRepeatWordIDs: [], totalCompleted: 0 };
        const key = PROGRESS_KEY_PREFIX + this.currentBlock.id;
        const data = localStorage.getItem(key);
        if (data) {
            return JSON.parse(data);
        }
        return { learnedWordIDs: [], toRepeatWordIDs: [], totalCompleted: 0 };
    }

    public saveProgress(progress: UserProgress) {
        if (!this.currentBlock) return;
        const key = PROGRESS_KEY_PREFIX + this.currentBlock.id;
        localStorage.setItem(key, JSON.stringify(progress));
    }

    public resetProgress() {
        if (!this.currentBlock) return;
        const key = PROGRESS_KEY_PREFIX + this.currentBlock.id;
        localStorage.removeItem(key);
    }
}
