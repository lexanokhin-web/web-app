import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookChapter } from '../../hooks/useBookData';
import { GlassCard } from '../../components/GlassCard';
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, ChevronRight, RotateCcw, HelpCircle } from 'lucide-react';

export const BookChapterPage: React.FC = () => {
    const { filename } = useParams<{ filename: string }>();
    const navigate = useNavigate();
    const { data: chapter, isLoading, error } = useBookChapter(filename);

    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    // Store user answers: { [exerciseId]: { [itemId]: userAnswer } }
    const [answers, setAnswers] = useState<Record<string, Record<string, string>>>({});
    const [showResults, setShowResults] = useState<Record<string, boolean>>({});
    const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div>;
    if (error || !chapter) return <div className="min-h-screen flex items-center justify-center">Fehler beim Laden des Kapitels.</div>;

    const sections = chapter.sections;
    const currentSection = sections[currentSectionIndex];

    const handleAnswerChange = (exerciseId: string, itemId: string, value: string) => {
        setAnswers(prev => ({
            ...prev,
            [exerciseId]: {
                ...prev[exerciseId],
                [itemId]: value
            }
        }));
    };

    const checkExercise = (exerciseId: string) => {
        setShowResults(prev => ({ ...prev, [exerciseId]: true }));
    };

    const resetExercise = (exerciseId: string) => {
        setAnswers(prev => {
            const newAnswers = { ...prev };
            delete newAnswers[exerciseId];
            return newAnswers;
        });
        setShowResults(prev => {
            const newResults = { ...prev };
            delete newResults[exerciseId];
            return newResults;
        });
        setRevealedAnswers(prev => {
            // Remove revealed state for this exercise's items
            const newRevealed = { ...prev };
            Object.keys(newRevealed).forEach(key => {
                if (key.startsWith(`${exerciseId}-`)) {
                    delete newRevealed[key];
                }
            });
            return newRevealed;
        });
    };

    const toggleReveal = (exerciseId: string, itemId: string) => {
        const key = `${exerciseId}-${itemId}`;
        setRevealedAnswers(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const isCorrect = (userAnswer: string, correctAnswer: string) => {
        return userAnswer?.trim().toLowerCase() === correctAnswer.toLowerCase();
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            {/* Header / Nav */}
            <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
                <button
                    onClick={() => navigate('/b1-book')}
                    className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Zurück zur Übersicht
                </button>
                <h1 className="text-xl font-bold text-gray-800">{chapter.title}</h1>
            </div>

            <div className="max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSection.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Theory Section */}
                        <GlassCard className="p-8 mb-8 bg-white border-l-4 border-indigo-600">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">{currentSection.title}</h2>
                            <div className="prose prose-indigo max-w-none text-gray-600 whitespace-pre-line">
                                {currentSection.content}
                            </div>
                        </GlassCard>

                        {/* Exercises */}
                        <div className="space-y-8">
                            {currentSection.exercises.map(exercise => (
                                <GlassCard key={exercise.id} className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="text-lg font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg inline-block">
                                            Übung
                                        </h3>
                                        {showResults[exercise.id] && (
                                            <div className="flex items-center space-x-4">
                                                <span className="text-sm font-bold text-green-600 flex items-center">
                                                    <RefreshCw className="w-4 h-4 mr-1" />
                                                    Überprüft
                                                </span>
                                                <button
                                                    onClick={() => resetExercise(exercise.id)}
                                                    className="text-sm font-bold text-gray-500 hover:text-indigo-600 flex items-center transition-colors"
                                                >
                                                    <RotateCcw className="w-4 h-4 mr-1" />
                                                    Neu starten
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-gray-700 mb-6 font-medium">{exercise.instruction}</p>

                                    <div className="space-y-4">
                                        {exercise.items.map(item => {
                                            const userAnswer = answers[exercise.id]?.[item.id] || '';
                                            const isChecked = showResults[exercise.id];
                                            const isCorrectAnswer = isCorrect(userAnswer, item.answer);
                                            const isWrong = isChecked && !isCorrectAnswer;
                                            const uniqueId = `${exercise.id}-${item.id}`;
                                            const isRevealed = revealedAnswers[uniqueId];

                                            return (
                                                <div key={item.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                    <div className="mb-2 text-gray-800 font-medium">{item.prompt}</div>
                                                    <div className="relative flex items-center gap-2">
                                                        <div className="relative flex-grow">
                                                            <input
                                                                type="text"
                                                                value={userAnswer}
                                                                onChange={(e) => handleAnswerChange(exercise.id, item.id, e.target.value)}
                                                                className={`
                                                                    w-full p-3 rounded-lg border-2 transition-all duration-200 outline-none
                                                                    ${isWrong ? 'border-red-300 bg-red-50 text-red-700' : ''}
                                                                    ${isChecked && isCorrectAnswer ? 'border-green-300 bg-green-50 text-green-700' : ''}
                                                                    ${!isChecked ? 'border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100' : ''}
                                                                `}
                                                                placeholder="Deine Antwort..."
                                                                disabled={isChecked}
                                                            />
                                                            {isChecked && isCorrectAnswer && <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />}
                                                            {isWrong && <XCircle className="absolute right-3 top-3.5 w-5 h-5 text-red-500" />}
                                                        </div>

                                                        {isWrong && (
                                                            <button
                                                                onClick={() => toggleReveal(exercise.id, item.id)}
                                                                className={`p-3 rounded-lg transition-all ${isRevealed ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'}`}
                                                                title="Lösung anzeigen"
                                                            >
                                                                <HelpCircle className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                    </div>

                                                    {isRevealed && isWrong && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            className="text-sm text-indigo-600 mt-2 font-medium bg-indigo-50 p-2 rounded-lg border border-indigo-100"
                                                        >
                                                            Lösung: <span className="font-bold">{item.answer}</span>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {!showResults[exercise.id] && (
                                        <button
                                            onClick={() => checkExercise(exercise.id)}
                                            className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                                        >
                                            Überprüfen
                                        </button>
                                    )}
                                </GlassCard>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-end mt-8">
                            {currentSectionIndex < sections.length - 1 && (
                                <button
                                    onClick={() => setCurrentSectionIndex(prev => prev + 1)}
                                    className="flex items-center px-6 py-3 bg-white text-indigo-600 rounded-full shadow-md font-bold hover:bg-gray-50 transition-all"
                                >
                                    Nächster Abschnitt
                                    <ChevronRight className="w-5 h-5 ml-2" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
