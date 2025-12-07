import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, RefreshCw, X, Lightbulb } from 'lucide-react';
import { useA2BookData } from '../../hooks/useA2BookData';
import type { BookChapterContent, BookSection, BookExercise, BookExerciseItem } from '../../hooks/useA2BookData';
import { useSound } from 'use-sound';

const A2BookChapterPage: React.FC = () => {
    const { chapterId } = useParams<{ chapterId: string }>();
    const { fetchChapter } = useA2BookData();
    const [chapterData, setChapterData] = useState<BookChapterContent | null>(null);
    const [inputs, setInputs] = useState<Record<string, string>>({});
    const [results, setResults] = useState<Record<string, boolean>>({});
    const [showSolution, setShowSolution] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);

    const [playCorrect] = useSound('/sounds/correct.mp3', { volume: 0.5 });
    const [playWrong] = useSound('/sounds/wrong.mp3', { volume: 0.5 });

    React.useEffect(() => {
        if (chapterId) {
            fetchChapter(chapterId)
                .then(data => {
                    setChapterData(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [chapterId, fetchChapter]);

    const handleCheck = (exerciseId: string, itemId: string, correctAnswer: string) => {
        const input = inputs[`${exerciseId}_${itemId}`]?.trim().toLowerCase();
        const isCorrect = input === correctAnswer.toLowerCase();

        setResults(prev => ({ ...prev, [`${exerciseId}_${itemId}`]: isCorrect }));
        if (isCorrect) playCorrect();
        else playWrong();
    };

    const toggleSolution = (key: string) => {
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

    if (loading) return <div className="p-8 text-center">Laden...</div>;
    if (!chapterData) return <div className="p-8 text-center">Fehler beim Laden des Kapitels</div>;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/a2-book" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <div>
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Lektion</span>
                            <h1 className="text-lg font-bold text-slate-800 leading-none">{chapterData.title}</h1>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-3xl mx-auto px-4 py-8 space-y-12">
                <div className="prose prose-slate max-w-none">
                    <p className="text-xl text-slate-600 font-medium leading-relaxed">
                        {chapterData.description}
                    </p>
                </div>

                {chapterData.sections.map((section: BookSection) => (
                    <section key={section.id} className="space-y-6">
                        {/* Theory Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                    {section.id.split('.').pop()}
                                </div>
                                <h2 className="text-lg font-bold text-slate-800 m-0">
                                    {section.title.replace(/^\d+\.\d+\.?\s*/, '')}
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="prose prose-blue max-w-none">
                                    <p className="whitespace-pre-line text-slate-700 leading-relaxed text-lg">
                                        {section.content}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Exercises */}
                        <div className="space-y-6 pl-4 border-l-2 border-slate-200">
                            {section.exercises?.map((exercise: BookExercise, exIndex: number) => (
                                <motion.div
                                    key={exercise.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: exIndex * 0.1 }}
                                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6 relative group hover:border-blue-300 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Übung {exIndex + 1}</span>
                                            <h3 className="font-semibold text-slate-800 text-lg">
                                                {exercise.instruction}
                                            </h3>
                                        </div>
                                        <button
                                            onClick={() => resetExercise(exercise.id)}
                                            className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Übung neu starten"
                                        >
                                            <RefreshCw className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {exercise.items.map((item: BookExerciseItem) => {
                                            const key = `${exercise.id}_${item.id}`;
                                            const result = results[key];
                                            const show = showSolution[key];

                                            return (
                                                <div key={item.id} className="space-y-2">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                                        <span className="text-slate-500 font-medium min-w-[24px] pt-2 sm:pt-0">{item.id.replace(/[0-9]+/, '')})</span>
                                                        <div className="flex-1">
                                                            <p className="text-slate-700 mb-2">{item.prompt}</p>
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    className={`flex-1 px-4 py-2 rounded-lg border-2 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium
                                                                        ${result === true ? 'border-green-400 bg-green-50 text-green-800' :
                                                                            result === false ? 'border-red-400 bg-red-50' :
                                                                                'border-slate-200 focus:border-blue-400'}`}
                                                                    placeholder="..."
                                                                    value={inputs[key] || ''}
                                                                    onChange={(e) => setInputs(p => ({ ...p, [key]: e.target.value }))}
                                                                    onKeyDown={(e) => e.key === 'Enter' && handleCheck(exercise.id, item.id, item.answer)}
                                                                />
                                                                <button
                                                                    onClick={() => handleCheck(exercise.id, item.id, item.answer)}
                                                                    className="px-4 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors shadow-sm active:scale-95"
                                                                >
                                                                    <Check className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Feedback Area */}
                                                    <AnimatePresence>
                                                        {(result === false || show) && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="pl-12 pr-4 overflow-hidden"
                                                            >
                                                                <div className={`p-3 rounded-lg text-sm flex items-start gap-3 ${show ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
                                                                    {show ? <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" /> : <X className="w-4 h-4 shrink-0 mt-0.5" />}
                                                                    <div>
                                                                        {show ? (
                                                                            <span>Lösung: <strong className="font-semibold">{item.answer}</strong></span>
                                                                        ) : (
                                                                            <div className="flex items-center gap-2">
                                                                                <span>Leider falsch.</span>
                                                                                <button
                                                                                    onClick={() => toggleSolution(key)}
                                                                                    className="text-xs font-bold underline decoration-dotted hover:text-red-900"
                                                                                >
                                                                                    Lösung anzeigen
                                                                                </button>
                                                                            </div>
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
                                </motion.div>
                            ))}
                        </div>
                    </section>
                ))}
            </main>
        </div>
    );
};

export default A2BookChapterPage;
