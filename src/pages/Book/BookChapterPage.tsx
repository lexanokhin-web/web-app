import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookChapter } from '../../hooks/useBookData';
import { ArrowLeft, Check, X, RefreshCw, ChevronRight, Lightbulb, BookOpen } from 'lucide-react';
import { useSound } from 'use-sound';

export const BookChapterPage: React.FC = () => {
    const { filename } = useParams<{ filename: string }>();
    const { data: chapter, isLoading, error } = useBookChapter(filename);

    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [inputs, setInputs] = useState<Record<string, string>>({});
    const [results, setResults] = useState<Record<string, boolean>>({});
    const [showSolution, setShowSolution] = useState<Record<string, boolean>>({});

    const [playCorrect] = useSound('/sounds/correct.mp3', { volume: 0.5 });
    const [playWrong] = useSound('/sounds/wrong.mp3', { volume: 0.5 });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentSectionIndex]);

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (error || !chapter) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 font-medium">
            Kapitel konnte nicht geladen werden.
        </div>
    );

    const sections = chapter.sections;
    const currentSection = sections[currentSectionIndex];

    const handleCheck = (exerciseId: string, itemId: string, correctAnswer: string) => {
        const key = `${exerciseId}_${itemId}`;
        const input = inputs[key]?.trim().toLowerCase();

        // Simple equality check (case-insensitive)
        const isCorrect = input === correctAnswer.toLowerCase();

        setResults(prev => ({ ...prev, [key]: isCorrect }));

        if (isCorrect) {
            playCorrect();
        } else {
            playWrong();
        }
    };

    const toggleSolution = (exerciseId: string, itemId: string) => {
        const key = `${exerciseId}_${itemId}`;
        setShowSolution(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const resetExercise = (exerciseId: string) => {
        const newInputs = { ...inputs };
        const newResults = { ...results };
        const newSolutions = { ...showSolution };

        Object.keys(newInputs).forEach(key => {
            if (key.startsWith(exerciseId)) delete newInputs[key];
        });
        Object.keys(newResults).forEach(key => {
            if (key.startsWith(exerciseId)) delete newResults[key];
        });
        Object.keys(newSolutions).forEach(key => {
            if (key.startsWith(exerciseId)) delete newSolutions[key];
        });

        setInputs(newInputs);
        setResults(newResults);
        setShowSolution(newSolutions);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-32">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/b1-book" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <div>
                            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Kapitel</span>
                            <h1 className="text-lg font-bold text-slate-800 leading-none">{chapter.title}</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-8 space-y-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSection.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        {/* Theory Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <h2 className="text-lg font-bold text-slate-800 m-0">{currentSection.title}</h2>
                            </div>
                            <div className="p-8">
                                <div className="prose prose-indigo max-w-none">
                                    <p className="whitespace-pre-line text-slate-700 leading-relaxed text-lg">
                                        {currentSection.content}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Exercises */}
                        <div className="space-y-6">
                            {currentSection.exercises.map((exercise, idx) => (
                                <div key={exercise.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6 relative group hover:border-indigo-300 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                                                Übung {idx + 1}
                                            </span>
                                            <h3 className="font-semibold text-slate-800 text-lg">
                                                {exercise.instruction}
                                            </h3>
                                        </div>
                                        <button
                                            onClick={() => resetExercise(exercise.id)}
                                            className="p-2 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="Übung zurücksetzen"
                                        >
                                            <RefreshCw className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {exercise.items.map(item => {
                                            const key = `${exercise.id}_${item.id}`;
                                            const result = results[key];
                                            const show = showSolution[key];
                                            const inputValue = inputs[key] || '';

                                            return (
                                                <div key={item.id} className="space-y-2">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                                        {/* Prompt */}
                                                        <span className="text-slate-500 font-medium min-w-[24px] pt-2 sm:pt-0">{item.id.replace(/[0-9]+/, '')})</span>

                                                        {/* Input Area */}
                                                        <div className="flex-1">
                                                            <p className="text-slate-700 mb-2">{item.prompt}</p>
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={inputValue}
                                                                    onChange={(e) => setInputs(prev => ({ ...prev, [key]: e.target.value }))}
                                                                    onKeyDown={(e) => e.key === 'Enter' && handleCheck(exercise.id, item.id, item.answer)}
                                                                    disabled={result === true}
                                                                    className={`
                                                                        flex-1 px-4 py-2 rounded-lg border-2 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-medium
                                                                        ${result === true
                                                                            ? 'border-green-400 bg-green-50 text-green-800'
                                                                            : result === false
                                                                                ? 'border-red-400 bg-red-50'
                                                                                : 'border-slate-200 focus:border-indigo-400'
                                                                        }
                                                                    `}
                                                                    placeholder="..."
                                                                />
                                                                <button
                                                                    onClick={() => handleCheck(exercise.id, item.id, item.answer)}
                                                                    disabled={result === true || !inputValue}
                                                                    className="px-4 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors shadow-sm active:scale-95 flex items-center justify-center"
                                                                >
                                                                    {result === true ? <Check className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Feedback / Solution */}
                                                    <AnimatePresence>
                                                        {(result === false || show) && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="pl-12 pr-4 overflow-hidden"
                                                            >
                                                                <div className={`p-3 rounded-lg text-sm flex items-start gap-3 ${show ? 'bg-indigo-50 text-indigo-700' : 'bg-red-50 text-red-700'}`}>
                                                                    {show ? <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" /> : <X className="w-4 h-4 shrink-0 mt-0.5" />}
                                                                    <div className="flex-1">
                                                                        {!show && (
                                                                            <div className="flex items-center gap-2">
                                                                                <span>Leider falsch.</span>
                                                                                <button
                                                                                    onClick={() => toggleSolution(exercise.id, item.id)}
                                                                                    className="text-xs font-bold underline decoration-dotted hover:text-red-900"
                                                                                >
                                                                                    Lösung anzeigen
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                        {show && (
                                                                            <span>Lösung: <strong className="font-semibold">{item.answer}</strong></span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-between items-center pt-8 border-t border-slate-200">
                            <button
                                onClick={() => setCurrentSectionIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentSectionIndex === 0}
                                className={`
                                    flex items-center px-6 py-3 rounded-full font-bold transition-all
                                    ${currentSectionIndex === 0
                                        ? 'text-slate-300 cursor-not-allowed'
                                        : 'bg-white text-slate-600 hover:text-indigo-600 shadow-sm hover:shadow-md border border-slate-200'
                                    }
                                `}
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Zurück
                            </button>

                            <span className="text-slate-400 font-medium text-sm">
                                {currentSectionIndex + 1} von {sections.length}
                            </span>

                            <button
                                onClick={() => setCurrentSectionIndex(prev => Math.min(sections.length - 1, prev + 1))}
                                disabled={currentSectionIndex === sections.length - 1}
                                className={`
                                    flex items-center px-6 py-3 rounded-full font-bold transition-all
                                    ${currentSectionIndex === sections.length - 1
                                        ? 'text-slate-300 cursor-not-allowed'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                                    }
                                `}
                            >
                                Weiter
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
