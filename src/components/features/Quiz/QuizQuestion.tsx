import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';

interface QuizQuestionProps {
    question: string;
    correctAnswer: string;
    wrongAnswers: string[];
    onAnswer: (isCorrect: boolean) => void;
    onNext: () => void;
    onCorrectFeedback?: () => void;
    onShowAIAdvice?: () => void;
    questionNumber: number;
    totalQuestions: number;
    explanation?: string;
    verbTranslation?: string;
    sentenceTranslation?: string;
    exampleSentence?: string;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
    question,
    correctAnswer,
    wrongAnswers,
    onAnswer,
    onNext,
    onCorrectFeedback,
    onShowAIAdvice,
    questionNumber,
    totalQuestions,
    explanation,
    verbTranslation,
    sentenceTranslation,
    exampleSentence
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

        if (correct && onCorrectFeedback) {
            onCorrectFeedback();
        }

        // Notify parent immediately
        // QuizPage will handle the score and auto-advance timer
        onAnswer(correct);
    };

    const handleNext = () => {
        onNext();
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

    const renderStyledText = (text: string) => {
        if (!text || !text.includes('**')) return text;

        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                const content = part.slice(2, -2);
                return (
                    <strong
                        key={i}
                        className="text-indigo-200 font-black underline decoration-indigo-300/60 underline-offset-8 decoration-2"
                    >
                        {content}
                    </strong>
                );
            }
            return part;
        });
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
                className="bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 rounded-2xl p-8 mb-8 text-center shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-white/20" />
                <p className="text-3xl font-bold text-white mb-2 leading-tight">
                    {renderStyledText(question)}
                </p>
                {verbTranslation && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-white/80 text-sm font-medium"
                    >
                        Подсказка: {verbTranslation}
                    </motion.p>
                )}
            </motion.div>

            {/* Example Sentence (if provided) */}
            {(exampleSentence || sentenceTranslation) && (
                <div className="mb-8 px-4 text-center space-y-2">
                    {exampleSentence && (
                        <p className="text-gray-700 text-lg font-medium">
                            {selectedAnswer !== null
                                ? (() => {
                                    const isAtStart = exampleSentence.startsWith('_____');
                                    let displayAnswer = correctAnswer;
                                    if (isAtStart && displayAnswer.length > 0) {
                                        displayAnswer = displayAnswer.charAt(0).toUpperCase() + displayAnswer.slice(1);
                                    }
                                    return exampleSentence.replace('_____', `[${displayAnswer}]`);
                                })()
                                : renderStyledText(exampleSentence.replace('_____', '______'))
                            }
                        </p>
                    )}
                    {sentenceTranslation && (
                        <p className="text-gray-500 text-sm italic">
                            {sentenceTranslation}
                        </p>
                    )}
                </div>
            )}

            {/* Options */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {options.map((option, index) => (
                    <motion.button
                        key={index}
                        onClick={() => handleAnswer(option)}
                        disabled={selectedAnswer !== null}
                        className={`
              ${getButtonStyle(option)}
              p-4 sm:p-6 rounded-xl
              text-lg sm:text-xl font-black
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

            {/* Feedback Overlay / Section */}
            <AnimatePresence>
                {showFeedback && (
                    <>
                        {/* Mobile Backdrop blur */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-40 md:hidden"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            className={`
                                fixed bottom-0 left-0 right-0 z-50 p-6 
                                bg-white/80 backdrop-blur-xl border-t border-white/40
                                shadow-[0_-20px_40px_rgba(0,0,0,0.1)]
                                md:relative md:mt-8 md:p-0 md:bg-transparent md:backdrop-blur-none md:border-none md:shadow-none
                            `}
                        >
                            <div className="max-w-2xl mx-auto">
                                <div className={`
                                    p-4 rounded-2xl text-center text-lg font-bold
                                    shadow-sm
                                    ${isCorrect
                                        ? 'bg-green-100/80 text-green-800 border border-green-200'
                                        : 'bg-red-100/80 text-red-800 border border-red-200'
                                    }
                                `}>
                                    <div className="flex items-center justify-center gap-2">
                                        {isCorrect ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                                        <span>{isCorrect ? 'Правильно!' : `Верный ответ: ${correctAnswer}`}</span>
                                    </div>
                                    {explanation && (
                                        <div className="mt-2 text-sm font-medium opacity-70 italic leading-relaxed">
                                            💡 {explanation}
                                        </div>
                                    )}

                                    {onShowAIAdvice && (
                                        <button
                                            onClick={onShowAIAdvice}
                                            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-sm font-bold transition-all text-indigo-700 shadow-sm"
                                        >
                                            <span className="animate-pulse text-lg">✨</span> Подробный разбор (AI)
                                        </button>
                                    )}
                                </div>

                                {/* Show Next button ONLY if the answer was WRONG */}
                                {!isCorrect && (
                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        onClick={handleNext}
                                        className="mt-4 w-full py-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)]"
                                    >
                                        Weiter
                                        <ArrowRight className="w-6 h-6" />
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Spacer for mobile to prevent content being hidden behind the fixed footer */}
            {showFeedback && <div className="h-40 md:hidden" />}
        </div>
    );
};
