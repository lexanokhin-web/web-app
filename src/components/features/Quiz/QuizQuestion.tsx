import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface QuizQuestionProps {
    question: string;
    correctAnswer: string;
    wrongAnswers: string[];
    onAnswer: (isCorrect: boolean) => void;
    questionNumber: number;
    totalQuestions: number;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
    question,
    correctAnswer,
    wrongAnswers,
    onAnswer,
    questionNumber,
    totalQuestions
}) => {
    const [options, setOptions] = useState<string[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    // Перемешать ответы при загрузке
    useEffect(() => {
        const allOptions = [correctAnswer, ...wrongAnswers];
        const shuffled = allOptions.sort(() => Math.random() - 0.5);
        setOptions(shuffled);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setShowFeedback(false);
    }, [question, correctAnswer, wrongAnswers]);

    const handleAnswer = (answer: string) => {
        if (selectedAnswer !== null) return; // Already answered

        setSelectedAnswer(answer);
        const correct = answer === correctAnswer;
        setIsCorrect(correct);
        setShowFeedback(true);

        // Auto-advance after 1.5 seconds
        setTimeout(() => {
            onAnswer(correct);
        }, 1500);
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
                        className={`
              mt-6 p-4 rounded-xl text-center text-lg font-semibold
              ${isCorrect
                                ? 'bg-green-100 text-green-800 border-2 border-green-300'
                                : 'bg-red-100 text-red-800 border-2 border-red-300'
                            }
            `}
                    >
                        {isCorrect ? '✅ Правильно!' : `❌ Правильный ответ: ${correctAnswer}`}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
