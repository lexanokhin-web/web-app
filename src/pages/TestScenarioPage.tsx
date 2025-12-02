import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { DataProvider } from '../lib/dataProvider';
import type { StandaloneScenarioModel } from '../types';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TestScenarioPageProps {
    filename?: string;
}

export const TestScenarioPage: React.FC<TestScenarioPageProps> = ({ filename: propFilename }) => {
    const navigate = useNavigate();
    const { scenarioId } = useParams<{ scenarioId?: string }>();
    const [dataProvider] = useState(() => DataProvider.getInstance());

    const [sentences, setSentences] = useState<StandaloneScenarioModel[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [incorrectIDs, setIncorrectIDs] = useState<string[]>([]);
    const [isFinished, setIsFinished] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const filename = propFilename || scenarioId || 'verb_test_scenarios';
            const data = await dataProvider.loadTestScenario(filename);
            const shuffled = [...data].sort(() => Math.random() - 0.5);
            setSentences(shuffled);
            setLoading(false);
        };
        loadData();
    }, [scenarioId, propFilename]);

    const handleOptionSelect = (option: string) => {
        if (showAnswer) return;
        setSelectedOption(option);
        setShowAnswer(true);
        recordAnswer(option);
    };

    const recordAnswer = (chosen: string) => {
        if (sentences.length === 0) return;
        const current = sentences[currentIndex];

        if (chosen === current.targetWord) {
            setCorrectCount(prev => prev + 1);
        } else {
            setIncorrectCount(prev => prev + 1);
            if (!incorrectIDs.includes(current.id)) {
                setIncorrectIDs(prev => [...prev, current.id]);
            }
        }
    };

    const handleNext = () => {
        setShowAnswer(false);
        setSelectedOption(null);

        if (currentIndex + 1 < sentences.length) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setIsFinished(true);
        }
    };

    const handleRetryIncorrect = () => {
        const incorrectSentences = sentences.filter(s => incorrectIDs.includes(s.id));
        if (incorrectSentences.length > 0) {
            setSentences(incorrectSentences);
            setCurrentIndex(0);
            setCorrectCount(0);
            setIncorrectCount(0);
            setIncorrectIDs([]);
            setIsFinished(false);
            setShowAnswer(false);
            setSelectedOption(null);
        }
    };

    const handleStartShortQuiz = (count: number) => {
        const shuffled = [...sentences].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(count, shuffled.length));
        setSentences(selected);
        setCurrentIndex(0);
        setCorrectCount(0);
        setIncorrectCount(0);
        setIncorrectIDs([]);
        setIsFinished(false);
        setShowAnswer(false);
        setSelectedOption(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <GlassCard className="p-8">
                    <p className="text-xl text-gray-700">Загрузка...</p>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <Button
                        onClick={() => navigate(-1)}
                        variant="secondary"
                    >
                        <ArrowLeft className="w-5 h-5 inline mr-2" />
                        Назад
                    </Button>

                    {!isFinished && (
                        <Button
                            onClick={() => handleStartShortQuiz(10)}
                            variant="primary"
                        >
                            Короткий тест — 10
                        </Button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {!isFinished && sentences.length > 0 ? (
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <GlassCard className="p-8" animate={false}>
                                <div className="space-y-6">
                                    {/* Progress */}
                                    <div className="text-center text-sm text-gray-600 mb-4">
                                        <p>Вопрос {currentIndex + 1} из {sentences.length}</p>
                                    </div>

                                    {/* Sentence */}
                                    <div className="text-center mb-8">
                                        <p className="text-3xl font-bold text-gray-800 mb-4">
                                            {sentences[currentIndex].sentence.replace(
                                                sentences[currentIndex].targetWord,
                                                '...'
                                            )}
                                        </p>
                                        {sentences[currentIndex].sentenceTranslation && (
                                            <p className="text-lg text-gray-600">
                                                {sentences[currentIndex].sentenceTranslation}
                                            </p>
                                        )}
                                    </div>

                                    {/* Options */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {sentences[currentIndex].options.map((option, idx) => {
                                            const isSelected = selectedOption === option;
                                            const isCorrectOption = showAnswer && sentences[currentIndex].targetWord === option;
                                            const isWrongSelection = showAnswer && isSelected && !isCorrectOption;
                                            const letter = String.fromCharCode(65 + idx); // A, B, C, D

                                            return (
                                                <motion.div
                                                    key={idx}
                                                    whileHover={!showAnswer ? { scale: 1.02 } : {}}
                                                    whileTap={!showAnswer ? { scale: 0.98 } : {}}
                                                >
                                                    <button
                                                        onClick={() => handleOptionSelect(option)}
                                                        disabled={showAnswer}
                                                        className={`
                              w-full p-6 rounded-xl font-semibold text-lg text-left
                              backdrop-blur-md border-2 transition-all duration-200
                              ${isSelected && !showAnswer ? 'bg-blue-400/40 border-blue-500' : 'bg-white/30 border-white/50'}
                              ${isCorrectOption ? 'bg-green-400/40 border-green-500' : ''}
                              ${isWrongSelection ? 'bg-red-400/40 border-red-500' : ''}
                              ${!showAnswer ? 'hover:bg-white/50 cursor-pointer' : 'cursor-default'}
                              disabled:opacity-70
                            `}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span>{letter}. {option}</span>
                                                            {showAnswer && (
                                                                <>
                                                                    {isCorrectOption && (
                                                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                                                    )}
                                                                    {isWrongSelection && (
                                                                        <XCircle className="w-6 h-6 text-red-600" />
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </button>
                                                </motion.div>
                                            );
                                        })}
                                    </div>

                                    {/* Answer Details */}
                                    <AnimatePresence>
                                        {showAnswer && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="space-y-2 p-4 bg-white/20 rounded-xl"
                                            >
                                                <p className="font-semibold text-gray-800">
                                                    Перевод: {sentences[currentIndex].targetWordTranslation}
                                                </p>
                                                <p className="font-bold text-gray-900">
                                                    Правильный ответ: {sentences[currentIndex].targetWord}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Action Button */}
                                    <div className="flex justify-end">
                                        {showAnswer ? (
                                            <Button
                                                onClick={handleNext}
                                                variant="success"
                                                className="text-lg"
                                            >
                                                Далее
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() => {
                                                    setShowAnswer(true);
                                                    recordAnswer('');
                                                }}
                                                variant="secondary"
                                                className="text-lg"
                                            >
                                                Показать ответ
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ) : isFinished ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <GlassCard className="p-12 text-center" animate={false}>
                                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                                    Тест завершён!
                                </h2>

                                <div className="space-y-3 mb-8">
                                    <p className="text-xl text-gray-700">
                                        Всего вопросов: {correctCount + incorrectCount}
                                    </p>
                                    <p className="text-xl text-green-600 font-semibold">
                                        Правильно: {correctCount}
                                    </p>
                                    <p className="text-xl text-red-600 font-semibold">
                                        Неправильно: {incorrectCount}
                                    </p>
                                </div>

                                <div className="flex justify-center space-x-4">
                                    <Button
                                        onClick={() => navigate(-1)}
                                        variant="secondary"
                                        className="text-lg"
                                    >
                                        Закрыть
                                    </Button>

                                    {incorrectIDs.length > 0 && (
                                        <Button
                                            onClick={handleRetryIncorrect}
                                            variant="primary"
                                            className="text-lg"
                                        >
                                            <RotateCcw className="w-5 h-5 inline mr-2" />
                                            Повторить ошибочные
                                        </Button>
                                    )}
                                </div>
                            </GlassCard>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>
        </div>
    );
};
