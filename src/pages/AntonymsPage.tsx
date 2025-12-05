import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { useAntonymExercises } from '../hooks/useLoadData';
import type { AntonymExercise } from '../types';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AntonymsPage: React.FC = () => {
    const navigate = useNavigate();

    const { data: rawExercises, isLoading: isQueryLoading } = useAntonymExercises();

    const [exercises, setExercises] = useState<AntonymExercise[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showCompletion, setShowCompletion] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (rawExercises) {
            const shuffled = rawExercises.map(exercise => ({
                ...exercise,
                options: [...exercise.options].sort(() => Math.random() - 0.5)
            })).sort(() => Math.random() - 0.5);
            setExercises(shuffled);
            setLoading(false);
        }
    }, [rawExercises]);

    // Sync loading state
    useEffect(() => {
        setLoading(isQueryLoading);
    }, [isQueryLoading]);

    const handleOptionSelect = (option: string) => {
        if (showResult) return;
        setSelectedOption(option);
    };

    const handleCheck = () => {
        if (!selectedOption || exercises.length === 0) return;

        const correct = exercises[currentIndex].correct === selectedOption;
        setIsCorrect(correct);
        setShowResult(true);
    };

    const handleNext = () => {
        setSelectedOption(null);
        setShowResult(false);
        setIsCorrect(false);

        if (currentIndex + 1 < exercises.length) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setShowCompletion(true);
        }
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
            <div className="max-w-3xl mx-auto">
                <Button
                    onClick={() => navigate('/')}
                    variant="secondary"
                    className="mb-6"
                >
                    <ArrowLeft className="w-5 h-5 inline mr-2" />
                    Назад
                </Button>

                <AnimatePresence mode="wait">
                    {exercises.length > 0 && !showCompletion ? (
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <GlassCard className="p-8" animate={false}>
                                <div className="space-y-6">
                                    {/* Title */}
                                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                                        Антонимы
                                    </h2>

                                    {/* Word */}
                                    <div className="text-center mb-8">
                                        <p className="text-4xl font-bold text-gray-800 mb-2">
                                            {exercises[currentIndex].word}
                                        </p>
                                        <p className="text-lg text-gray-600">
                                            ({exercises[currentIndex].translation})
                                        </p>
                                    </div>

                                    {/* Options */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {exercises[currentIndex].options.map((option, idx) => {
                                            const isSelected = selectedOption === option;
                                            const isCorrectOption = showResult && exercises[currentIndex].correct === option;
                                            const isWrongSelection = showResult && isSelected && !isCorrect;

                                            return (
                                                <motion.div
                                                    key={idx}
                                                    whileHover={!showResult ? { scale: 1.02 } : {}}
                                                    whileTap={!showResult ? { scale: 0.98 } : {}}
                                                >
                                                    <button
                                                        onClick={() => handleOptionSelect(option)}
                                                        disabled={showResult}
                                                        className={`
                              w-full p-6 rounded-xl font-semibold text-lg
                              backdrop-blur-md border-2 transition-all duration-200
                              ${isSelected && !showResult ? 'bg-blue-400/40 border-blue-500' : 'bg-white/30 border-white/50'}
                              ${isCorrectOption ? 'bg-green-400/40 border-green-500' : ''}
                              ${isWrongSelection ? 'bg-red-400/40 border-red-500' : ''}
                              ${!showResult ? 'hover:bg-white/50 cursor-pointer' : 'cursor-default'}
                              disabled:opacity-70
                            `}
                                                    >
                                                        {option}
                                                    </button>
                                                </motion.div>
                                            );
                                        })}
                                    </div>

                                    {/* Result Message */}
                                    <AnimatePresence>
                                        {showResult && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className={`flex items-center justify-center space-x-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
                                            >
                                                {isCorrect ? (
                                                    <>
                                                        <CheckCircle className="w-6 h-6" />
                                                        <span className="text-xl font-semibold">Правильно!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="w-6 h-6" />
                                                        <span className="text-xl font-semibold">
                                                            Правильный ответ: {exercises[currentIndex].correct}
                                                        </span>
                                                    </>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Action Button */}
                                    {!showResult ? (
                                        <Button
                                            onClick={handleCheck}
                                            disabled={!selectedOption}
                                            variant="primary"
                                            className="w-full text-lg py-4"
                                        >
                                            Проверить
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleNext}
                                            variant="success"
                                            className="w-full text-lg py-4"
                                        >
                                            Далее
                                        </Button>
                                    )}

                                    {/* Progress */}
                                    <div className="text-center text-sm text-gray-600">
                                        <p>Вопрос {currentIndex + 1} из {exercises.length}</p>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ) : showCompletion ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <GlassCard className="p-12 text-center" animate={false}>
                                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                    Упражнение завершено!
                                </h2>
                                <p className="text-xl text-gray-700 mb-8">
                                    Все упражнения пройдены.
                                </p>
                                <Button
                                    onClick={() => navigate('/')}
                                    variant="primary"
                                    className="text-lg"
                                >
                                    Главное меню
                                </Button>
                            </GlassCard>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>
        </div>
    );
};
