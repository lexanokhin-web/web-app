import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QuizQuestion } from '../components/features/Quiz/QuizQuestion';
import { QuizSelection } from '../components/features/Quiz/QuizSelection';
import { Button } from '../components/Button';
import { GlassCard } from '../components/GlassCard';
import { ArrowLeft, Trophy, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProgress } from '../hooks/useProgress';
import { useGenericQuizData } from '../hooks/useLoadData';
import { useAudio } from '../contexts/AudioContext';
import useSound from 'use-sound';
import type { QuizLevel, QuizTopic } from '../data/quizzes/quiz-config';

interface QuizData {
    question: string;
    correctAnswer: string;
    wrongAnswers: string[];
    explanation?: string;
    verbTranslation?: string;
    sentenceTranslation?: string;
    exampleSentence?: string;
}

interface Sentence {
    id: string;
    sentence: string;
    targetWord: string;
    targetWordTranslation: string;
    wrongAnswers?: string[];
    explanation?: string;
    verb?: string;
    verbTranslation?: string;
    sentenceTranslation?: string;
}

export const QuizPage: React.FC = () => {
    const navigate = useNavigate();
    const { blockId } = useParams<{ blockId?: string }>();
    const { addXP } = useProgress();
    const { isMuted, volume } = useAudio();

    const [playCorrect] = useSound('/sounds/correct.mp3', { volume: isMuted ? 0 : volume });
    const [playIncorrect] = useSound('/sounds/incorrect.mp3', { volume: isMuted ? 0 : volume });
    const [playLevelUp] = useSound('/sounds/levelup.mp3', { volume: isMuted ? 0 : volume });

    // Flow State
    const [mode, setMode] = useState<'selection' | 'quiz'>('selection');
    const [selectedLevel, setSelectedLevel] = useState<QuizLevel | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<QuizTopic | null>(null);

    // Quiz State
    const [quizData, setQuizData] = useState<QuizData[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [answeredCount, setAnsweredCount] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);

    const [currentPath, setCurrentPath] = useState<string | null>(null);
    const { data: rawSentences, isLoading: isQueryLoading, isError } = useGenericQuizData(currentPath);

    useEffect(() => {
        // Direct link support
        if (blockId) {
            setMode('quiz');
            // Check if it's already a full path or needs prefix? 
            // The API handles valid paths, but blockId usually implies "sentences" or similar.
            // QuizPage legacy: blockId usually matched a filename in /data/
            setCurrentPath(blockId);
        }
    }, [blockId]);

    const handleTopicSelect = (level: QuizLevel, topic: QuizTopic) => {
        setSelectedLevel(level);
        setSelectedTopic(topic);
        setMode('quiz');
        setCurrentPath(`${level.toLowerCase()}/${topic.file.replace('.json', '')}`);
    };

    const startQuizFromData = React.useCallback((sentences: Sentence[]) => {
        // Reset state
        setCurrentIndex(0);
        setScore(0);
        setAnsweredCount(0);
        setShowResults(false);

        // Shuffle and take 10
        const shuffledSentences = [...sentences].sort(() => Math.random() - 0.5);
        const questionCount = Math.min(10, shuffledSentences.length);

        const quiz: QuizData[] = shuffledSentences.slice(0, questionCount).map(sentence => {
            const correctAnswer = sentence.targetWord;
            let wrongAnswers: string[] = [];

            if (sentence.wrongAnswers && sentence.wrongAnswers.length > 0) {
                wrongAnswers = sentence.wrongAnswers
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3);
            } else {
                // Generate distractors
                const allOtherWords = sentences
                    .filter(s => s.targetWord !== correctAnswer)
                    .map(s => s.targetWord);
                const uniqueWrongWords = Array.from(new Set(allOtherWords));
                wrongAnswers = uniqueWrongWords
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3);
            }

            while (wrongAnswers.length < 3) {
                wrongAnswers.push('?');
            }

            return {
                question: sentence.verb ? `${sentence.verb} ______` : sentence.sentence.replace('_____', '______'),
                correctAnswer,
                wrongAnswers,
                explanation: sentence.explanation,
                verbTranslation: sentence.verbTranslation,
                sentenceTranslation: sentence.sentenceTranslation,
                exampleSentence: sentence.verb ? sentence.sentence : undefined
            };
        });

        setQuizData(quiz);
    }, []);

    // Initialize quiz when data is loaded or path changes
    useEffect(() => {
        if (rawSentences) {
            startQuizFromData(rawSentences);
        }
    }, [rawSentences, startQuizFromData]);

    // Combined loading state
    useEffect(() => {
        setLoading(isQueryLoading);
    }, [isQueryLoading]);

    // Handle Error
    useEffect(() => {
        if (isError) {
            alert('Fehler beim Laden der Übung. Bitte versuche es erneut.');
            setMode('selection');
            setCurrentPath(null);
        }
    }, [isError]);

    const handleAnswer = (isCorrect: boolean) => {
        setAnsweredCount(answeredCount + 1);

        if (isCorrect) {
            setScore(score + 1);
            playCorrect();
        } else {
            playIncorrect();
        }

        // Move to next question or show results
        if (currentIndex < quizData.length - 1) {
            setTimeout(() => {
                setCurrentIndex(currentIndex + 1);
            }, 1600);
        } else {
            setTimeout(() => {
                finishQuiz(score + (isCorrect ? 1 : 0));
            }, 1600);
        }
    };

    const finishQuiz = async (finalScore: number) => {
        setShowResults(true);
        playLevelUp();
        // Award XP: 10 XP per correct answer + 50 XP bonus for completion
        const xpEarned = (finalScore * 10) + 50;
        if (addXP) {
            await addXP(xpEarned);
        }
    };

    const handleRestart = () => {
        if (rawSentences) {
            startQuizFromData(rawSentences);
        } else {
            // Should not happen if we are on result screen
            setMode('selection');
        }
    };

    const handleBack = () => {
        if (mode === 'quiz' && !blockId) {
            setMode('selection');
        } else {
            navigate('/');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen py-8 px-4 flex items-center justify-center">
                <GlassCard className="p-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-700">Lade Übung...</p>
                    </div>
                </GlassCard>
            </div>
        );
    }

    // Selection Mode
    if (mode === 'selection') {
        return (
            <div className="min-h-screen py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <Button
                            onClick={() => navigate('/')}
                            variant="secondary"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Zurück zum Hauptmenü
                        </Button>
                    </div>
                    <QuizSelection onSelectTopic={handleTopicSelect} />
                </div>
            </div>
        );
    }

    // Results View
    if (showResults) {
        const percentage = Math.round((score / quizData.length) * 100);
        const isPerfect = percentage === 100;
        const isGood = percentage >= 70;

        return (
            <div className="min-h-screen py-8 px-4 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full"
                >
                    <GlassCard className="p-8 text-center">
                        <Trophy className={`w-20 h-20 mx-auto mb-4 ${isPerfect ? 'text-yellow-500' : isGood ? 'text-blue-500' : 'text-gray-500'}`} />

                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            {isPerfect ? 'Fantastisch! 🎉' : isGood ? 'Super gemacht! 👏' : 'Gut geübt! 💪'}
                        </h2>

                        <p className="text-gray-600 mb-6">
                            Dein Ergebnis für Bereich {selectedTopic?.title}
                        </p>

                        {/* Score Circle */}
                        <div className="relative w-40 h-40 mx-auto mb-6">
                            <svg className="transform -rotate-90" width="160" height="160">
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="#e5e7eb"
                                    strokeWidth="12"
                                    fill="none"
                                />
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke={isPerfect ? '#f59e0b' : isGood ? '#3b82f6' : '#6b7280'}
                                    strokeWidth="12"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 70 * percentage / 100} ${2 * Math.PI * 70}`}
                                    className="transition-all duration-1000"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div>
                                    <div className="text-4xl font-bold text-gray-800">{percentage}%</div>
                                    <div className="text-sm text-gray-600">{score}/{quizData.length}</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={handleRestart}
                                variant="primary"
                                className="w-full"
                            >
                                Noch einmal üben
                            </Button>

                            <Button
                                onClick={() => setMode('selection')}
                                variant="secondary"
                                className="w-full"
                            >
                                Andere Übung wählen
                            </Button>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        );
    }

    const currentQuiz = quizData[currentIndex];
    const progress = ((answeredCount) / quizData.length) * 100;

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button
                        onClick={handleBack}
                        variant="secondary"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        {blockId ? 'Startseite' : 'Zurück zur Auswahl'}
                    </Button>

                    <div className="flex items-center space-x-4">
                        {selectedTopic && (
                            <div className="hidden sm:block px-4 py-2 bg-white/50 backdrop-blur rounded-full text-sm font-medium text-gray-600">
                                {selectedLevel} • {selectedTopic.title}
                            </div>
                        )}
                        <GlassCard className="px-6 py-3" animate={false}>
                            <div className="flex items-center">
                                <Target className="w-6 h-6 text-indigo-600 inline mr-2" />
                                <span className="text-xl font-bold text-gray-800">
                                    {score}/{quizData.length}
                                </span>
                            </div>
                        </GlassCard>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-indigo-400 to-purple-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                {/* Question */}
                {currentQuiz && (
                    <QuizQuestion
                        key={currentIndex}
                        question={currentQuiz.question}
                        correctAnswer={currentQuiz.correctAnswer}
                        wrongAnswers={currentQuiz.wrongAnswers}
                        onAnswer={handleAnswer}
                        questionNumber={currentIndex + 1}
                        totalQuestions={quizData.length}
                        explanation={currentQuiz.explanation}
                        verbTranslation={currentQuiz.verbTranslation}
                        sentenceTranslation={currentQuiz.sentenceTranslation}
                        exampleSentence={currentQuiz.exampleSentence}
                    />
                )}
            </div>
        </div>
    );
};

