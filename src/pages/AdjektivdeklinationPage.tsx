import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { ArrowLeft, CheckCircle, XCircle, HelpCircle, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CompletionModal } from '../components/CompletionModal';
import { DifficultySelector, defaultLevels } from '../components/DifficultySelector';
import { GrammarReference } from '../components/features/Adjektiv/GrammarReference';

interface Exercise {
    id: string;
    sentence: string;
    adjective: string;
    correctEnding: string; // Can be single "en" or multiple "em|en" separated by pipe
    gender: string;
    case: string;
    articleType: string;
    difficulty: string;
    hint: string;
}

// Inner component to handle individual exercise state
const ExerciseCard: React.FC<{
    exercise: Exercise;
    onCorrect: () => void;
    onIncorrect: () => void;
    onNext: () => void;
    showInfo: boolean;
    onToggleInfo: () => void;
}> = ({ exercise, onCorrect, onIncorrect, onNext, showInfo, onToggleInfo }) => {
    // Determine initial gap count
    const initialGapCount = exercise.sentence.split(/___+/).length - 1;

    // State specific to this exercise instance
    const [userInputs, setUserInputs] = useState<string[]>(new Array(initialGapCount).fill(''));
    const [showHint, setShowHint] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Focus first input on mount
    useEffect(() => {
        setTimeout(() => {
            inputRefs.current[0]?.focus();
        }, 100);
    }, []);

    const handleInputChange = (index: number, value: string) => {
        const newInputs = [...userInputs];
        newInputs[index] = value;
        setUserInputs(newInputs);
    };

    const handleCheck = () => {
        // Parse correct endings (support "em|en" format)
        const corrects = exercise.correctEnding.split('|');

        // Check if all inputs are correct
        const allCorrect = userInputs.every((input, idx) => {
            const trimmedInput = input.trim().toLowerCase().replace(/^-/, '');
            const expected = corrects[idx] ? corrects[idx].toLowerCase() : '';
            return trimmedInput === expected;
        });

        if (allCorrect) {
            setIsCorrect(true);
            onCorrect();
            setTimeout(() => {
                onNext();
            }, 1000);
        } else {
            setIsCorrect(false);
            onIncorrect();
            setShowHint(true);
        }
    };

    const handleSkip = () => {
        onIncorrect();
        onNext();
    };

    const handleKeyPress = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Enter') {
            // If it's the last input or generic check
            if (index === userInputs.length - 1 || showHint) {
                if (showHint) {
                    onNext();
                } else {
                    handleCheck();
                }
            } else {
                // Focus next input
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const renderSentence = (sentence: string) => {
        const parts = sentence.split(/___+/);
        return (
            <div className="flex flex-wrap items-baseline justify-center gap-2 leading-relaxed">
                {parts.map((part, index) => (
                    <React.Fragment key={index}>
                        <span>{part}</span>
                        {index < parts.length - 1 && (
                            <span className="relative inline-block">
                                <input
                                    ref={el => { inputRefs.current[index] = el; }}
                                    type="text"
                                    value={userInputs[index] || ''}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    placeholder="___"
                                    className={`
                                        w-24 text-center text-xl font-bold bg-transparent border-b-4 outline-none transition-colors
                                        ${isCorrect === true ? 'border-green-500 text-green-600' :
                                            isCorrect === false ? 'border-red-500 text-red-600' :
                                                'border-cyan-500 text-cyan-600 focus:border-cyan-700'}
                                    `}
                                    disabled={showHint || isCorrect === true}
                                    autoComplete="off"
                                />
                                {showHint && (
                                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-red-500 bg-red-50 px-1 rounded whitespace-nowrap border border-red-200 shadow-sm z-10">
                                        -{exercise.correctEnding.split('|')[index]}
                                    </span>
                                )}
                            </span>
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    const getDifficultyLabel = (diff: string) => {
        switch (diff) {
            case 'easy': return 'LEICHT';
            case 'medium': return 'MITTEL';
            case 'hard': return 'SCHWER';
            default: return diff.toUpperCase();
        }
    };

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'easy': return 'bg-green-100 text-green-700 border-green-300';
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            case 'hard': return 'bg-red-100 text-red-700 border-red-300';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getCaseColor = (c: string) => {
        switch (c) {
            case 'Nom': return 'bg-blue-100 text-blue-700';
            case 'Akk': return 'bg-purple-100 text-purple-700';
            case 'Dat': return 'bg-orange-100 text-orange-700';
            case 'Gen': return 'bg-pink-100 text-pink-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getGenderLabel = (g: string) => {
        switch (g) {
            case 'm': return 'Maskulin';
            case 'f': return 'Feminin';
            case 'n': return 'Neutrum';
            case 'pl': return 'Plural';
            default: return g;
        }
    };

    const getArticleTypeLabel = (t: string) => {
        switch (t) {
            case 'definite': return 'bestimmt';
            case 'indefinite': return 'unbestimmt';
            case 'zero': return 'ohne Artikel';
            case 'possessive': return 'Possessiv';
            default: return t;
        }
    };

    return (
        <GlassCard className="p-8">
            {/* Difficulty & Case badges with Toggle */}
            <div className="flex justify-between items-start mb-4">
                <AnimatePresence>
                    {showInfo ? (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex gap-2 flex-wrap flex-1 mr-4 overflow-hidden"
                        >
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(exercise.difficulty)}`}>
                                {getDifficultyLabel(exercise.difficulty)}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCaseColor(exercise.case)}`}>
                                {exercise.case}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                                {getGenderLabel(exercise.gender)}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
                                {getArticleTypeLabel(exercise.articleType)}
                            </span>
                        </motion.div>
                    ) : (
                        <div className="flex-1" /> // Spacer
                    )}
                </AnimatePresence>

                <button
                    onClick={onToggleInfo}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    title={showInfo ? "Infos ausblenden" : "Infos anzeigen"}
                >
                    {showInfo ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
            </div>

            {/* Sentence */}
            <div className="text-center mb-6">
                <div className="text-2xl font-bold text-gray-800 mb-2">
                    {renderSentence(exercise.sentence)}
                </div>
                <p className="text-sm text-gray-500 mt-4">
                    Adjektiv: <span className="font-semibold text-cyan-600">{exercise.adjective}</span>
                </p>
            </div>

            {/* Result Feedback */}
            <AnimatePresence>
                {isCorrect === true && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-2 text-green-600 mb-4"
                    >
                        <CheckCircle className="w-6 h-6" />
                        <span className="text-lg font-semibold">
                            Richtig! &nbsp;
                            <span className="opacity-75">
                                ({exercise.correctEnding.split('|').map(e => '-' + e).join(', ')})
                            </span>
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hint on Wrong Answer */}
            <AnimatePresence>
                {showHint && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mb-4"
                    >
                        <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-red-700 mb-1">
                                    Leider falsch
                                </p>
                                <p className="text-sm text-gray-700">{exercise.hint}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Buttons */}
            <div className="flex gap-2">
                {!showHint ? (
                    <>
                        <Button
                            onClick={handleCheck}
                            // Disable if any input is empty
                            disabled={userInputs.some(input => !input || input.trim() === '')}
                            variant="primary"
                            className="flex-1 justify-center py-3"
                        >
                            Prüfen
                        </Button>
                        <Button
                            onClick={handleSkip}
                            variant="secondary"
                            className="justify-center"
                            title="Überspringen"
                        >
                            <HelpCircle className="w-5 h-5" />
                        </Button>
                    </>
                ) : (
                    <Button
                        onClick={onNext}
                        variant="primary"
                        className="flex-1 justify-center py-3"
                    >
                        Nächste Aufgabe →
                    </Button>
                )}
            </div>
        </GlassCard>
    );
};

export const AdjektivdeklinationPage: React.FC = () => {
    const navigate = useNavigate();

    // rawExercises holds the full loaded data
    const [rawExercises, setRawExercises] = useState<Exercise[]>([]);
    // exercises holds the current shuffled playlist
    const [exercises, setExercises] = useState<Exercise[]>([]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showCompletion, setShowCompletion] = useState(false);
    const [difficulty, setDifficulty] = useState('all');
    const [showExerciseInfo, setShowExerciseInfo] = useState(true);

    // Helper to shuffle exercises
    const getShuffledExercises = (all: Exercise[], level: string) => {
        const filtered = level === 'all'
            ? all
            : all.filter(e => e.difficulty === level);

        const shuffled = [...filtered];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Load exercises
    useEffect(() => {
        fetch('/data/adjektivdeklination_endings.json')
            .then(res => res.json())
            .then((data: Exercise[]) => {
                setRawExercises(data);
                // Initial shuffle
                setExercises(getShuffledExercises(data, 'all'));
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load exercises:', err);
                setLoading(false);
            });
    }, []);

    const currentExercise = exercises[currentIndex];

    // Prepare structure for DifficultySelector
    const difficultyLevels = defaultLevels.map(level => {
        const count = level.id === 'all'
            ? rawExercises.length
            : rawExercises.filter(e => e.difficulty === level.id).length;

        return {
            ...level,
            count
        };
    });

    const nextExercise = () => {
        if (currentIndex < exercises.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setShowCompletion(true);
        }
    };

    const restartExercise = () => {
        // Re-shuffle current set
        const shuffled = [...exercises];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setExercises(shuffled);
        setCurrentIndex(0);
        setCorrectCount(0);
        setIncorrectCount(0);
        setShowCompletion(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-teal-50">
                <GlassCard className="p-8">
                    <p className="text-xl text-gray-700">Übungen werden geladen...</p>
                </GlassCard>
            </div>
        );
    }

    if (showCompletion) {
        return (
            <CompletionModal
                correctCount={correctCount}
                incorrectCount={incorrectCount}
                totalCount={exercises.length}
                onRestart={restartExercise}
                onBack={() => navigate('/')}
            />
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-cyan-50 to-teal-50">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <Button onClick={() => navigate('/')} variant="secondary">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Zurück
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Adjektivdeklination
                    </h1>
                </div>

                {/* Difficulty Selector */}
                <GlassCard className="p-4 mb-6">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-600">Schwierigkeitsgrad:</span>
                            <span className="text-sm text-gray-500">
                                {Math.min(currentIndex + 1, exercises.length)} / {exercises.length} Aufgaben
                            </span>
                        </div>

                        <DifficultySelector
                            levels={difficultyLevels}
                            selected={difficulty}
                            onChange={(level) => {
                                setDifficulty(level);
                                const shuffled = getShuffledExercises(rawExercises, level);
                                setExercises(shuffled);
                                setCurrentIndex(0);
                                setCorrectCount(0);
                                setIncorrectCount(0);
                                setShowCompletion(false);
                            }}
                        />

                        {/* Progress bar */}
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-green-600 font-semibold text-sm">✓ {correctCount}</span>
                            <span className="text-red-600 font-semibold text-sm">✗ {incorrectCount}</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-300"
                                    style={{ width: `${(currentIndex / exercises.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* Grammar Reference Components */}
                <GrammarReference />

                {/* Main Exercise Card */}
                {currentExercise && (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentExercise.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ExerciseCard
                                exercise={currentExercise}
                                onCorrect={() => setCorrectCount(c => c + 1)}
                                onIncorrect={() => setIncorrectCount(c => c + 1)}
                                onNext={nextExercise}
                                showInfo={showExerciseInfo}
                                onToggleInfo={() => setShowExerciseInfo(prev => !prev)}
                            />
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};
