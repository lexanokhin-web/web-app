import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';

interface QuizQuestionProps {
    question: string;
    correctAnswer: string;
    wrongAnswers: string[];
    onAnswer: (isCorrect: boolean) => void;
    questionNumber: number;
    totalQuestions: number;
    explanation?: string;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
    question,
    correctAnswer,
    wrongAnswers,
    onAnswer,
    questionNumber,
    totalQuestions,
    explanation
}) => {
    const [options] = useState<string[]>(() => {
        const allOptions = [correctAnswer, ...wrongAnswers];
        return allOptions.sort(() => Math.random() - 0.5);
    });
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const handleAnswer = (answer: string) => {
        if (selectedAnswer !== null) return; // Already answered

        setSelectedAnswer(answer);
        const correct = answer === correctAnswer;
        setIsCorrect(correct);
        setShowFeedback(true);
        // No auto-advance - user clicks "Weiter" button
    };

    const handleNext = () => {
        if (isCorrect !== null) {
            onAnswer(isCorrect);
        }
    };

    const getButtonStyle = (option: string) => {
        if (selectedAnswer === null) {
            return 'bg-white/40 hover:bg-white/60 border-2 border-white/60';
        }

        if (option === correctAnswer) {
            return 'bg-green-500 border-2 border-green-600 text-white';
        }

        if (option === selectedAnswer && !isCorrect) {
            return 'bg-red-500 border-2 border-red-600 text-white';
        }

        return 'bg-gray-300/40 border-2 border-gray-400/40 opacity-50';
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Question number */}
            <div className="text-center mb-6">
                <span className="text-gray-600 text-lg">
                    Вопрос {questionNumber} из {totalQuestions}
                </span>
            </div>

            {/* Question */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl p-8 mb-8 text-center shadow-2xl"
            >
                <p className="text-3xl font-bold text-white">"{question}"</p>
            </motion.div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((option, index) => (
                    <motion.button
                        key={index}
                        onClick={() => handleAnswer(option)}
                        disabled={selectedAnswer !== null}
                        className={`
              ${getButtonStyle(option)}
              p-6 rounded-xl
              text-xl font-semibold
              transition-all duration-200
              backdrop-blur-md
              disabled:cursor-not-allowed
            `}
                        whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                        whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                    >
                        {option}

                        {/* Checkmark/X icon */}
                        {selectedAnswer !== null && (
                            <span className="ml-3 inline-block">
                                {option === correctAnswer ? (
                                    <Check className="w-6 h-6 inline" />
                                ) : option === selectedAnswer ? (
                                    <X className="w-6 h-6 inline" />
                                ) : null}
                            </span>
                        )}
                    </motion.button>
                ))}
            </div>

            {/* Feedback */}
            <AnimatePresence>
                {showFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-6"
                    >
                        <div className={`
                            p-4 rounded-xl text-center text-lg font-semibold
                            ${isCorrect
                                ? 'bg-green-100 text-green-800 border-2 border-green-300'
                                : 'bg-red-100 text-red-800 border-2 border-red-300'
                            }
                        `}>
                            <div>{isCorrect ? '✅ Правильно!' : `❌ Правильный ответ: ${correctAnswer}`}</div>
                            {explanation && (
                                <div className="mt-2 text-sm opacity-80 italic">
                                    💡 {explanation}
                                </div>
                            )}
                        </div>

                        {/* Next button */}
                        <motion.button
                            onClick={handleNext}
                            className="mt-4 w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Weiter
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
