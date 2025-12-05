import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QuizQuestion } from '../components/features/Quiz/QuizQuestion';
import { Button } from '../components/Button';
import { GlassCard } from '../components/GlassCard';
import { ArrowLeft, Trophy, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProgress } from '../hooks/useProgress';

interface QuizData {
    question: string;
    correctAnswer: string;
    wrongAnswers: string[];
}

interface Sentence {
    id: string;
    sentence: string;
    targetWord: string;
    targetWordTranslation: string;
}

export const QuizPage: React.FC = () => {
    const navigate = useNavigate();
    const { blockId } = useParams<{ blockId?: string }>();
    const { addXP } = useProgress();

    const [quizData, setQuizData] = useState<QuizData[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [answeredCount, setAnsweredCount] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadQuizData();
    }, [blockId]);

    const loadQuizData = async () => {
        setLoading(true);

        try {
            // Определить какой файл загружать
            const filename = blockId || 'relativsaetze';
            const response = await fetch(`/data/${filename}.json`);
            const sentences: Sentence[] = await response.json();

            // Перемешать предложения и взять 10 случайных
            const shuffledSentences = sentences.sort(() => Math.random() - 0.5);

            // Конвертировать в quiz формат
            const quiz: QuizData[] = shuffledSentences.slice(0, 10).map(sentence => {
                const correctAnswer = sentence.targetWord;

                // Генерировать неправильные ответы из других предложений
                const allOtherWords = sentences
                    .filter(s => s.targetWord !== correctAnswer)
                    .map(s => s.targetWord);

                // Убрать дубликаты
                const uniqueWrongWords = Array.from(new Set(allOtherWords));

                // Взять 3 случайных уникальных неправильных ответа
                const wrongAnswers = uniqueWrongWords
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3);

                return {
                    question: sentence.sentence.replace('_____', '______'),
                    correctAnswer,
                    wrongAnswers
                };
            });

            setQuizData(quiz);
        } catch (error) {
            console.error('Failed to load quiz data:', error);
            // Fallback to sample data
            setQuizData(getSampleQuiz());
        } finally {
            setLoading(false);
        }
    };

    const getSampleQuiz = (): QuizData[] => [
        {
            question: 'Das ist der Mann, ______ gestern hier war.',
            correctAnswer: 'der',
            wrongAnswers: ['den', 'dem', 'des']
        },
        {
            question: 'Ich kenne die Frau, ______ Auto rot ist.',
            correctAnswer: 'deren',
            wrongAnswers: ['der', 'die', 'dessen']
        },
        {
            question: 'Das sind die Kinder, ______ wir geholfen haben.',
            correctAnswer: 'denen',
            wrongAnswers: ['die', 'der', 'dem']
        }
    ];

    const handleAnswer = (isCorrect: boolean) => {
        setAnsweredCount(answeredCount + 1);

        if (isCorrect) {
            setScore(score + 1);
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
        // Award XP: 10 XP per correct answer + 50 XP bonus for completion
        const xpEarned = (finalScore * 10) + 50;
        if (addXP) {
            await addXP(xpEarned);
        }
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setScore(0);
        setAnsweredCount(0);
        setShowResults(false);
        loadQuizData();
    };

    if (loading) {
        return (
            <div className="min-h-screen py-8 px-4 flex items-center justify-center">
                <GlassCard className="p-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-700">Загрузка вопросов...</p>
                    </div>
                </GlassCard>
            </div>
        );
    }

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
                            {isPerfect ? 'Превосходно! 🎉' : isGood ? 'Отлично! 👏' : 'Хороший старт! 💪'}
                        </h2>

                        <p className="text-gray-600 mb-6">
                            Ваш результат
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
                                Пройти снова
                            </Button>

                            <Button
                                onClick={() => navigate('/')}
                                variant="secondary"
                                className="w-full"
                            >
                                На главную
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
                        onClick={() => navigate('/')}
                        variant="secondary"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Назад
                    </Button>

                    <GlassCard className="px-6 py-3" animate={false}>
                        <div className="flex items-center space-x-4">
                            <div className="text-center">
                                <Target className="w-6 h-6 text-green-600 inline mr-2" />
                                <span className="text-xl font-bold text-gray-800">
                                    {score}/{answeredCount}
                                </span>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-green-400 to-blue-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                {/* Question */}
                {currentQuiz && (
                    <QuizQuestion
                        question={currentQuiz.question}
                        correctAnswer={currentQuiz.correctAnswer}
                        wrongAnswers={currentQuiz.wrongAnswers}
                        onAnswer={handleAnswer}
                        questionNumber={currentIndex + 1}
                        totalQuestions={quizData.length}
                    />
                )}
            </div>
        </div>
    );
};
