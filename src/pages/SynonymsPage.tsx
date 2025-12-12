import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { ScoreCounter } from '../components/ScoreCounter';
import { useSynonymExercises } from '../hooks/useLoadData';
import type { SynonymExercise } from '../types';
import { ArrowLeft, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Difficulty configuration
const difficultyConfig = {
    all: { label: 'Alle', bgActive: 'bg-gradient-to-r from-gray-500 to-gray-700 text-white', bgInactive: 'bg-gray-100 hover:bg-gray-200 text-gray-700' },
    easy: { label: 'Leicht', bgActive: 'bg-gradient-to-r from-green-500 to-green-700 text-white', bgInactive: 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-300' },
    medium: { label: 'Mittel', bgActive: 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white', bgInactive: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-300' },
    hard: { label: 'Schwer', bgActive: 'bg-gradient-to-r from-red-500 to-red-700 text-white', bgInactive: 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-300' }
};

// Common synonym hints
const synonymHints: Record<string, string> = {
    'groß': 'Ähnliche Bedeutung: Größe/Dimension',
    'schnell': 'Ähnliche Bedeutung: Geschwindigkeit',
    'schön': 'Ähnliche Bedeutung: Ästhetik/Aussehen',
    'gut': 'Ähnliche Bedeutung: Qualität/Bewertung',
    'sprechen': 'Ähnliche Bedeutung: Kommunikation',
    'gehen': 'Ähnliche Bedeutung: Bewegung',
    'sehen': 'Ähnliche Bedeutung: Wahrnehmung',
    'machen': 'Ähnliche Bedeutung: Tätigkeit/Handlung',
    'denken': 'Ähnliche Bedeutung: kognitive Prozesse',
    'glücklich': 'Ähnliche Bedeutung: positive Emotion',
    'traurig': 'Ähnliche Bedeutung: negative Emotion',
    'wichtig': 'Ähnliche Bedeutung: Bedeutung/Relevanz',
    'schwierig': 'Ähnliche Bedeutung: Komplexität',
    'einfach': 'Ähnliche Bedeutung: Einfachheit',
    'beginnen': 'Ähnliche Bedeutung: Anfang',
    'enden': 'Ähnliche Bedeutung: Abschluss'
};

export const SynonymsPage: React.FC = () => {
    const navigate = useNavigate();

    const { data: rawExercises, isLoading: isQueryLoading } = useSynonymExercises();

    const [exercises, setExercises] = useState<SynonymExercise[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showCompletion, setShowCompletion] = useState(false);
    const [loading, setLoading] = useState(true);
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

    useEffect(() => {
        if (rawExercises) {
            // Add difficulty based on word complexity
            const withDifficulty = rawExercises.map((exercise, idx) => {
                let diff: 'easy' | 'medium' | 'hard' = 'easy';
                if (idx >= 20) diff = 'hard';
                else if (idx >= 10) diff = 'medium';
                return { ...exercise, difficulty: diff };
            });

            const shuffled = withDifficulty.map(exercise => ({
                ...exercise,
                options: [...exercise.options].sort(() => Math.random() - 0.5)
            })).sort(() => Math.random() - 0.5);
            setExercises(shuffled);
            setLoading(false);
        }
    }, [rawExercises]);

    useEffect(() => {
        setLoading(isQueryLoading);
    }, [isQueryLoading]);

    // Filter exercises by difficulty
    const filteredExercises = difficulty === 'all'
        ? exercises
        : exercises.filter(e => (e as SynonymExercise & { difficulty: string }).difficulty === difficulty);

    const currentExercise = filteredExercises[currentIndex];

    const handleOptionSelect = (option: string) => {
        if (showResult) return;
        setSelectedOption(option);
    };

    const handleCheck = () => {
        if (!selectedOption || filteredExercises.length === 0) return;

        const correct = currentExercise.correct === selectedOption;
        setIsCorrect(correct);
        setShowResult(true);

        if (correct) {
            setCorrectCount(prev => prev + 1);
        } else {
            setIncorrectCount(prev => prev + 1);
        }
    };

    const handleNext = () => {
        setSelectedOption(null);
        setShowResult(false);
        setIsCorrect(false);

        if (currentIndex + 1 < filteredExercises.length) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setShowCompletion(true);
        }
    };

    const handleRestart = () => {
        const shuffled = [...exercises].sort(() => Math.random() - 0.5);
        setExercises(shuffled);
        setCurrentIndex(0);
        setCorrectCount(0);
        setIncorrectCount(0);
        setShowCompletion(false);
        setShowResult(false);
        setSelectedOption(null);
    };

    const getDifficultyCount = (diff: string) => {
        if (diff === 'all') return exercises.length;
        return exercises.filter(e => (e as SynonymExercise & { difficulty: string }).difficulty === diff).length;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
                <GlassCard className="p-8">
                    <p className="text-xl text-gray-700">Übungen werden geladen...</p>
                </GlassCard>
            </div>
        );
    }

    if (showCompletion) {
        const score = correctCount + incorrectCount > 0
            ? Math.round((correctCount / (correctCount + incorrectCount)) * 100)
            : 0;
        return (
            <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <GlassCard className="p-12 text-center">
                            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                Übung abgeschlossen!
                            </h2>
                            <div className="flex justify-center gap-8 mb-8">
                                <div>
                                    <div className="text-3xl font-bold text-green-600">{correctCount}</div>
                                    <div className="text-sm text-gray-500">Richtig</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-red-600">{incorrectCount}</div>
                                    <div className="text-sm text-gray-500">Falsch</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-blue-600">{score}%</div>
                                    <div className="text-sm text-gray-500">Ergebnis</div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button onClick={handleRestart} variant="primary" className="w-full justify-center">
                                    Nochmal üben
                                </Button>
                                <Button onClick={() => navigate('/')} variant="secondary" className="w-full justify-center">
                                    Zurück zur Startseite
                                </Button>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <Button onClick={() => navigate('/')} variant="secondary">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Zurück
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Synonyme
                    </h1>
                </div>

                {/* Difficulty Selector */}
                <GlassCard className="p-4 mb-6">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-600">Schwierigkeitsgrad:</span>
                            <span className="text-sm text-gray-500">
                                {currentIndex + 1} / {filteredExercises.length} Aufgaben
                            </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {(Object.keys(difficultyConfig) as Array<keyof typeof difficultyConfig>).map((level) => {
                                const config = difficultyConfig[level];
                                const isActive = difficulty === level;
                                const count = getDifficultyCount(level);

                                return (
                                    <button
                                        key={level}
                                        onClick={() => {
                                            setDifficulty(level);
                                            setCurrentIndex(0);
                                            setShowResult(false);
                                            setSelectedOption(null);
                                        }}
                                        className={`relative px-3 py-3 rounded-xl font-semibold text-sm transition-all transform ${isActive
                                                ? `${config.bgActive} shadow-lg scale-105`
                                                : config.bgInactive
                                            }`}
                                    >
                                        <div>{config.label}</div>
                                        <div className={`text-xs mt-1 ${isActive ? 'text-white/80' : 'opacity-60'}`}>
                                            {count} Aufgaben
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        {/* Progress bar and score */}
                        <div className="flex items-center gap-3">
                            <ScoreCounter correct={correctCount} incorrect={incorrectCount} />
                            <ProgressBar
                                current={currentIndex}
                                total={filteredExercises.length}
                                color="blue"
                            />
                        </div>
                    </div>
                </GlassCard>

                {/* Main Exercise Card */}
                <AnimatePresence mode="wait">
                    {currentExercise && !showCompletion && (
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <GlassCard className="p-8" animate={false}>
                                <div className="space-y-6">
                                    {/* Word with category badge */}
                                    <div className="text-center mb-8">
                                        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 mb-4">
                                            Finde das Synonym
                                        </div>
                                        <p className="text-4xl font-bold text-gray-800 mb-2">
                                            {currentExercise.word}
                                        </p>
                                        <p className="text-lg text-gray-600">
                                            ({currentExercise.translation})
                                        </p>
                                    </div>

                                    {/* Options */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {currentExercise.options.map((option, idx) => {
                                            const isSelected = selectedOption === option;
                                            const isCorrectOption = showResult && currentExercise.correct === option;
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

                                    {/* Result Message with Hint */}
                                    <AnimatePresence>
                                        {showResult && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                            >
                                                {isCorrect ? (
                                                    <div className="flex items-center justify-center gap-2 text-green-600">
                                                        <CheckCircle className="w-6 h-6" />
                                                        <span className="text-xl font-semibold">Richtig!</span>
                                                    </div>
                                                ) : (
                                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                                        <div className="flex items-center gap-2 text-red-600 mb-2">
                                                            <XCircle className="w-5 h-5" />
                                                            <span className="font-semibold">
                                                                Richtige Antwort: {currentExercise.correct}
                                                            </span>
                                                        </div>
                                                        {synonymHints[currentExercise.word.toLowerCase()] && (
                                                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                                                <BookOpen className="w-4 h-4" />
                                                                {synonymHints[currentExercise.word.toLowerCase()]}
                                                            </p>
                                                        )}
                                                    </div>
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
                                            className="w-full text-lg py-4 justify-center"
                                        >
                                            Prüfen
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleNext}
                                            variant="primary"
                                            className="w-full text-lg py-4 justify-center"
                                        >
                                            Nächste Aufgabe →
                                        </Button>
                                    )}
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
