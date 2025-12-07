import { useState, useCallback } from 'react';
import type { BookSection, BookExercise, BookExerciseItem } from './useBookData';

export interface QuizItem {
    id: string;
    chapterTitle: string;
    instruction: string;
    prompt: string;
    correctAnswer: string;
    userAnswer?: string;
    isCorrect?: boolean;
}

export interface QuizState {
    status: 'idle' | 'loading' | 'active' | 'finished' | 'error';
    questions: QuizItem[];
    currentIndex: number;
    score: number;
    loadingProgress: number; // 0 to 100
    errorMessage?: string;
}

interface ChapterIndexItem {
    id: string;
    file: string;
    title: string;
}

export const useB1Quiz = () => {
    const [state, setState] = useState<QuizState>({
        status: 'idle',
        questions: [],
        currentIndex: 0,
        score: 0,
        loadingProgress: 0
    });

    const startQuiz = useCallback(async () => {
        setState(prev => ({ ...prev, status: 'loading', loadingProgress: 0, score: 0, currentIndex: 0, errorMessage: undefined }));

        try {
            // 1. Fetch Index
            const indexRes = await fetch('/data/b1_book/index.json');
            if (!indexRes.ok) throw new Error(`Failed to load index: ${indexRes.statusText}`);
            const chapters: ChapterIndexItem[] = await indexRes.json();

            if (!chapters || chapters.length === 0) throw new Error('No chapters found in index');

            // 2. Randomly select 10 unique chapters
            const shuffledChapters = [...chapters].sort(() => 0.5 - Math.random());
            const selectedChapters = shuffledChapters.slice(0, 10);

            // 3. Fetch each chapter and pick 1 random exercise item
            const loadedQuestions: QuizItem[] = [];

            for (let i = 0; i < selectedChapters.length; i++) {
                const chapterInfo = selectedChapters[i];
                const chapterUrl = `/data/b1_book/${chapterInfo.file}`;

                try {
                    const chapterRes = await fetch(chapterUrl);
                    if (!chapterRes.ok) {
                        console.warn(`Failed to load chapter ${chapterInfo.id} from ${chapterUrl}`);
                        continue; // Skip this chapter if it fails, try next
                    }
                    const chapterData = await chapterRes.json();

                    // Flatten all items from all exercises
                    const allItems: { id: string; prompt: string; answer: string; instruction: string }[] = [];
                    if (chapterData.sections) {
                        chapterData.sections.forEach((sec: BookSection) => {
                            if (sec.exercises) {
                                sec.exercises.forEach((ex: BookExercise) => {
                                    if (ex.items) {
                                        ex.items.forEach((item: BookExerciseItem) => {
                                            allItems.push({
                                                ...item,
                                                instruction: ex.instruction // Carry over instruction
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    }

                    if (allItems.length > 0) {
                        // Pick 1 random item
                        const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
                        loadedQuestions.push({
                            id: `${chapterInfo.id}_${randomItem.id}`,
                            chapterTitle: chapterInfo.title,
                            instruction: randomItem.instruction || 'Übung',
                            prompt: randomItem.prompt,
                            correctAnswer: randomItem.answer,
                        });
                    }
                } catch (e) {
                    console.error(`Error processing chapter ${chapterInfo.file}`, e);
                }

                // Update loading progress
                setState(prev => ({ ...prev, loadingProgress: ((i + 1) / selectedChapters.length) * 100 }));
            }

            if (loadedQuestions.length === 0) {
                throw new Error('Could not load any questions. Please check your connection or try again.');
            }

            // 4. Start Game
            setState({
                status: 'active',
                questions: loadedQuestions,
                currentIndex: 0,
                score: 0,
                loadingProgress: 100
            });

        } catch (error) {
            console.error("Quiz init error:", error);
            setState(prev => ({
                ...prev,
                status: 'error',
                errorMessage: error instanceof Error ? error.message : 'Unknown error occurred'
            }));
        }
    }, []);

    const submitAnswer = useCallback((answer: string) => {
        setState(prev => {
            const currentQ = prev.questions[prev.currentIndex];
            const isCorrect = answer.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();

            // Create new questions array with updated item
            const updatedQuestions = [...prev.questions];
            updatedQuestions[prev.currentIndex] = {
                ...currentQ,
                userAnswer: answer,
                isCorrect
            };

            return {
                ...prev,
                questions: updatedQuestions,
                score: isCorrect ? prev.score + 1 : prev.score
            };
        });
    }, []);

    const nextQuestion = useCallback(() => {
        setState(prev => {
            const nextIndex = prev.currentIndex + 1;
            if (nextIndex >= prev.questions.length) {
                return { ...prev, status: 'finished' };
            }
            return { ...prev, currentIndex: nextIndex };
        });
    }, []);

    return {
        state,
        startQuiz,
        submitAnswer,
        nextQuestion
    };
};
