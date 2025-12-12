import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { ArrowLeft, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CompletionModal } from '../components/CompletionModal';
import { DifficultySelector, defaultLevels } from '../components/DifficultySelector';
import { GrammarReference } from '../components/features/Adjektiv/GrammarReference';

interface Exercise {
    id: string;
    sentence: string;
    adjective: string;
    correctEnding: string;
    gender: string;
    case: string;
    articleType: string;
    difficulty: string;
    hint: string;
}

export const AdjektivdeklinationPage: React.FC = () => {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showCompletion, setShowCompletion] = useState(false);
    const [difficulty, setDifficulty] = useState('all');

    // Load exercises
    useEffect(() => {
        fetch('/data/adjektivdeklination_endings.json')
            .then(res => res.json())
            .then((data: Exercise[]) => {
                const shuffled = [...data].sort(() => Math.random() - 0.5);
                setExercises(shuffled);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load exercises:', err);
                setLoading(false);
            });
    }, []);

    // Filter exercises by difficulty
    const filteredExercises = difficulty === 'all'
        ? exercises
        : exercises.filter(e => e.difficulty === difficulty);

    const currentExercise = filteredExercises[currentIndex];

    // Prepare structure for DifficultySelector
    const difficultyLevels = defaultLevels.map(level => {
        const count = level.id === 'all'
            ? exercises.length
            : exercises.filter(e => e.difficulty === level.id).length;

        return {
            ...level,
            count
        };
    });

    const handleCheck = () => {
        if (!currentExercise) return;

        const trimmedInput = userInput.trim().toLowerCase().replace(/^-/, '');
        const correctAnswer = currentExercise.correctEnding.toLowerCase();

        if (trimmedInput === correctAnswer) {
            setIsCorrect(true);
            setCorrectCount(prev => prev + 1);
            setTimeout(() => {
                nextExercise();
            }, 1000);
        } else {
            setIsCorrect(false);
            setIncorrectCount(prev => prev + 1);
            setShowHint(true);
        }
    };

    const nextExercise = () => {
        if (currentIndex < filteredExercises.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setUserInput('');
            setShowHint(false);
            setIsCorrect(null);
            inputRef.current?.focus();
        } else {
            setShowCompletion(true);
        }
    };

    const skipQuestion = () => {
        setIncorrectCount(prev => prev + 1);
        nextExercise();
    };

    const restartExercise = () => {
        const shuffled = [...exercises].sort(() => Math.random() - 0.5);
        setExercises(shuffled);
        setCurrentIndex(0);
        setCorrectCount(0);
        setIncorrectCount(0);
        setShowCompletion(false);
        setUserInput('');
        setShowHint(false);
        setIsCorrect(null);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (showHint) {
                nextExercise();
            } else {
                handleCheck();
            }
        }
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

    // Render sentence with highlighted gap
    const renderSentence = (sentence: string) => {
        const parts = sentence.split(/___+/);
        if (parts.length < 2) return <span>{sentence}</span>;

        return (
            <>
                {parts[0]}
                <span className="inline-block min-w-[60px] border-b-4 border-cyan-500 mx-1 text-cyan-600 font-bold">
                    {userInput || '___'}
                </span>
                {parts[1]}
            </>
        );
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
                totalCount={filteredExercises.length}
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
                                {Math.min(currentIndex + 1, filteredExercises.length)} / {filteredExercises.length} Aufgaben
                            </span>
                        </div>

                        <DifficultySelector
                            levels={difficultyLevels}
                            selected={difficulty}
                            onChange={(level) => {
                                setDifficulty(level);
                                setCurrentIndex(0);
                                setUserInput('');
                                setShowHint(false);
                                setIsCorrect(null);
                            }}
                        />

                        {/* Progress bar */}
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-green-600 font-semibold text-sm">✓ {correctCount}</span>
                            <span className="text-red-600 font-semibold text-sm">✗ {incorrectCount}</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-300"
                                    style={{ width: `${(currentIndex / filteredExercises.length) * 100}%` }}
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
                            <GlassCard className="p-8">
                                {/* Difficulty & Case badges */}
                                <div className="flex gap-2 mb-4 flex-wrap">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(currentExercise.difficulty)}`}>
                                        {getDifficultyLabel(currentExercise.difficulty)}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCaseColor(currentExercise.case)}`}>
                                        {currentExercise.case}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                                        {getGenderLabel(currentExercise.gender)}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
                                        {getArticleTypeLabel(currentExercise.articleType)}
                                    </span>
                                </div>

                                {/* Sentence */}
                                <div className="text-center mb-6">
                                    <p className="text-2xl font-bold text-gray-800 mb-2">
                                        {renderSentence(currentExercise.sentence)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Adjektiv: <span className="font-semibold text-cyan-600">{currentExercise.adjective}</span>
                                    </p>
                                </div>

                                {/* Input */}
                                <div className="flex gap-2 mb-4">
                                    <span className="text-2xl font-bold text-gray-400">-</span>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="e, en, er, es, em..."
                                        className={`flex-1 px-4 py-3 text-xl rounded-xl border-2 transition-colors ${isCorrect === true ? 'border-green-500 bg-green-50' :
                                            isCorrect === false ? 'border-red-500 bg-red-50' :
                                                'border-gray-300 focus:border-cyan-500'
                                            } outline-none`}
                                        disabled={showHint}
                                        autoFocus
                                    />
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
                                            <span className="text-lg font-semibold">Richtig! -{currentExercise.correctEnding}</span>
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
                                                        Richtige Antwort: <span className="text-lg">-{currentExercise.correctEnding}</span>
                                                    </p>
                                                    <p className="text-sm text-gray-700">{currentExercise.hint}</p>
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
                                                disabled={userInput.trim() === ''}
                                                variant="primary"
                                                className="flex-1 justify-center py-3"
                                            >
                                                Prüfen
                                            </Button>
                                            <Button
                                                onClick={skipQuestion}
                                                variant="secondary"
                                                className="justify-center"
                                                title="Überspringen"
                                            >
                                                <HelpCircle className="w-5 h-5" />
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            onClick={nextExercise}
                                            variant="primary"
                                            className="flex-1 justify-center py-3"
                                        >
                                            Nächste Aufgabe →
                                        </Button>
                                    )}
                                </div>
                            </GlassCard>
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

