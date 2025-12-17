export interface SentenceExercise {
    id: string;
    level: 'A1' | 'A2' | 'B1' | 'B2';
    correctSentence: string[];
    translation: string;
    hint?: string;
    grammarFocus: string; // Display text for the specific rule
    topic: string; // Main category (e.g., "Satzbau")
    subTopic: string; // Specific subtopic (e.g., "Aussagesatz")
}
