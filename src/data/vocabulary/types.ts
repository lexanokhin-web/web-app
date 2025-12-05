// Shared types for vocabulary database

export interface VocabularyWord {
    id: string;
    german: string;
    russian: string;
    level: 'A1' | 'A2' | 'B1' | 'B2';
    category: string;
    example?: string;
}

export interface VocabularyCategory {
    id: string;
    level: 'A1' | 'A2' | 'B1' | 'B2';
    name: string;
    nameRu: string;
    icon: string;
    wordCount: number;
    words: VocabularyWord[];
}
