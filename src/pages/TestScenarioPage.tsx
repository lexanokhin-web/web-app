import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { ScoreCounter } from '../components/ScoreCounter';
import { useTestScenario } from '../hooks/useLoadData';
import type { StandaloneScenarioModel } from '../types';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TestScenarioPageProps {
    filename?: string;
}

// Quiz length configuration
const quizLengthConfig = {
    10: { label: '10', bgActive: 'bg-gradient-to-r from-green-500 to-green-700 text-white', bgInactive: 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-300' },
    20: { label: '20', bgActive: 'bg-gradient-to-r from-blue-500 to-blue-700 text-white', bgInactive: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300' },
    30: { label: '30', bgActive: 'bg-gradient-to-r from-orange-500 to-orange-700 text-white', bgInactive: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-300' },
    all: { label: 'Alle', bgActive: 'bg-gradient-to-r from-purple-500 to-purple-700 text-white', bgInactive: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-300' }
};

export const TestScenarioPage: React.FC<TestScenarioPageProps> = ({ filename: propFilename }) => {
    const navigate = useNavigate();
    const { scenarioId } = useParams<{ scenarioId?: string }>();

    const filename = propFilename || scenarioId || 'verb_test_scenarios';
    const { data: rawData, isLoading: isQueryLoading } = useTestScenario(filename);

    const [allSentences, setAllSentences] = useState<StandaloneScenarioModel[]>([]);
    const [sentences, setSentences] = useState<StandaloneScenarioModel[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [incorrectIDs, setIncorrectIDs] = useState<string[]>([]);
    const [isFinished, setIsFinished] = useState(false);
    const [loading, setLoading] = useState(true);
    const [, setQuizLength] = useState<10 | 20 | 30 | 'all'>('all');
    const [showLengthSelector, setShowLengthSelector] = useState(true);

    useEffect(() => {
        if (rawData) {
            const shuffled = [...rawData].sort(() => Math.random() - 0.5);
            setAllSentences(shuffled);
            setSentences(shuffled);
            setLoading(false);
        }
    }, [rawData]);

    useEffect(() => {
        setLoading(isQueryLoading);
    }, [isQueryLoading]);

    const handleStartQuiz = (length: 10 | 20 | 30 | 'all') => {
        setQuizLength(length);
        const shuffled = [...allSentences].sort(() => Math.random() - 0.5);
        const selected = length === 'all'
            ? shuffled
            : shuffled.slice(0, Math.min(length, shuffled.length));
        setSentences(selected);
        setCurrentIndex(0);
        setCorrectCount(0);
        setIncorrectCount(0);
        setIncorrectIDs([]);
        setIsFinished(false);
        setShowAnswer(false);
        setSelectedOption(null);
        setShowLengthSelector(false);
    };

    const handleOptionSelect = (option: string) => {
        if (showAnswer) return;
        setSelectedOption(option);
        setShowAnswer(true);
        recordAnswer(option);
    };

    const recordAnswer = (chosen: string) => {
        if (sentences.length === 0) return;
        const current = sentences[currentIndex];

        if (chosen === current.targetWord) {
            setCorrectCount(prev => prev + 1);
        } else {
            setIncorrectCount(prev => prev + 1);
            if (!incorrectIDs.includes(current.id)) {
                setIncorrectIDs(prev => [...prev, current.id]);
            }
        }
    };

    const handleNext = () => {
        setShowAnswer(false);
        setSelectedOption(null);

        if (currentIndex + 1 < sentences.length) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setIsFinished(true);
        }
    };

    const handleRetryIncorrect = () => {
        const incorrectSentences = allSentences.filter(s => incorrectIDs.includes(s.id));
        if (incorrectSentences.length > 0) {
            setSentences(incorrectSentences);
            setCurrentIndex(0);
            setCorrectCount(0);
            setIncorrectCount(0);
            setIncorrectIDs([]);
            setIsFinished(false);
            setShowAnswer(false);
            setSelectedOption(null);
        }
    };

    const handleBackToSelector = () => {
        setShowLengthSelector(true);
        setIsFinished(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
                <GlassCard className="p-8">
                    <p className="text-xl text-gray-700">Test wird geladen...</p>
                </GlassCard>
            </div>
        );
    }

    // Quiz Length Selector
    if (showLengthSelector) {
        return (
            <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="max-w-2xl mx-auto">
                    <Button onClick={() => navigate(-1)} variant="secondary" className="mb-6">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Zurück
                    </Button>

                    <GlassCard className="p-8">
                        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                            Testlänge wählen
                        </h2>
                        <p className="text-gray-600 text-center mb-8">
                            Insgesamt verfügbar: {allSentences.length} Fragen
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {(Object.entries(quizLengthConfig) as [string, typeof quizLengthConfig[10]][]).map(([key, config]) => {
                                const numKey = key === 'all' ? 'all' : parseInt(key) as 10 | 20 | 30;
                                const count = numKey === 'all' ? allSentences.length : Math.min(numKey, allSentences.length);

                                return (
                                    <motion.button
                                        key={key}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleStartQuiz(numKey)}
                                        className={`px-6 py-6 rounded-xl font-semibold text-lg transition-all ${config.bgInactive} hover:shadow-lg`}
                                    >
                                        <div className="text-2xl font-bold mb-1">{config.label}</div>
                                        <div className="text-sm opacity-70">{count} Fragen</div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </GlassCard>
                </div>
            </div>
        );
    }

    // Completion Screen
    if (isFinished) {
        const score = correctCount + incorrectCount > 0
            ? Math.round((correctCount / (correctCount + incorrectCount)) * 100)
            : 0;
        return (
            <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <GlassCard className="p-12 text-center">
                            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                                Test abgeschlossen!
                            </h2>

                            <div className="flex justify-center gap-8 mb-8">
                                <div>
                                    <div className="text-3xl font-bold text-gray-700">{correctCount + incorrectCount}</div>
                                    <div className="text-sm text-gray-500">Gesamt</div>
                                </div>
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
                                {incorrectIDs.length > 0 && (
                                    <Button
                                        onClick={handleRetryIncorrect}
                                        variant="primary"
                                        className="w-full justify-center"
                                    >
                                        <RotateCcw className="w-5 h-5 mr-2" />
                                        Fehler wiederholen ({incorrectIDs.length})
                                    </Button>
                                )}
                                <Button
                                    onClick={handleBackToSelector}
                                    variant="secondary"
                                    className="w-full justify-center"
                                >
                                    Neuer Test
                                </Button>
                                <Button
                                    onClick={() => navigate(-1)}
                                    variant="secondary"
                                    className="w-full justify-center"
                                >
                                    Zurück
                                </Button>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Main Quiz
    return (
        <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <Button onClick={handleBackToSelector} variant="secondary">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Zurück
                    </Button>
                    <h1 className="text-xl font-bold text-gray-800">
                        Test ({sentences.length} Fragen)
                    </h1>
                </div>

                {/* Progress Card */}
                <GlassCard className="p-4 mb-6">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                Frage {currentIndex + 1} / {sentences.length}
                            </span>
                            <ScoreCounter correct={correctCount} incorrect={incorrectCount} showPercentage />
                        </div>
                        <ProgressBar
                            current={currentIndex}
                            total={sentences.length}
                            color="purple"
                        />
                    </div>
                </GlassCard>

                {/* Question Card */}
                <AnimatePresence mode="wait">
                    {sentences.length > 0 && (
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <GlassCard className="p-8" animate={false}>
                                <div className="space-y-6">
                                    {/* Sentence */}
                                    <div className="text-center mb-8">
                                        <p className="text-3xl font-bold text-gray-800 mb-4">
                                            {sentences[currentIndex].sentence.replace(
                                                sentences[currentIndex].targetWord,
                                                '...'
                                            )}
                                        </p>
                                        {sentences[currentIndex].sentenceTranslation && (
                                            <p className="text-lg text-gray-600">
                                                {sentences[currentIndex].sentenceTranslation}
                                            </p>
                                        )}
                                    </div>

                                    {/* Options */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {sentences[currentIndex].options.map((option, idx) => {
                                            const isSelected = selectedOption === option;
                                            const isCorrectOption = showAnswer && sentences[currentIndex].targetWord === option;
                                            const isWrongSelection = showAnswer && isSelected && !isCorrectOption;
                                            const letter = String.fromCharCode(65 + idx);

                                            return (
                                                <motion.div
                                                    key={idx}
                                                    whileHover={!showAnswer ? { scale: 1.02 } : {}}
                                                    whileTap={!showAnswer ? { scale: 0.98 } : {}}
                                                >
                                                    <button
                                                        onClick={() => handleOptionSelect(option)}
                                                        disabled={showAnswer}
                                                        className={`
                                                            w-full p-6 rounded-xl font-semibold text-lg text-left
                                                            backdrop-blur-md border-2 transition-all duration-200
                                                            ${isSelected && !showAnswer ? 'bg-blue-400/40 border-blue-500' : 'bg-white/30 border-white/50'}
                                                            ${isCorrectOption ? 'bg-green-400/40 border-green-500' : ''}
                                                            ${isWrongSelection ? 'bg-red-400/40 border-red-500' : ''}
                                                            ${!showAnswer ? 'hover:bg-white/50 cursor-pointer' : 'cursor-default'}
                                                            disabled:opacity-70
                                                        `}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span>{letter}. {option}</span>
                                                            {showAnswer && (
                                                                <>
                                                                    {isCorrectOption && (
                                                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                                                    )}
                                                                    {isWrongSelection && (
                                                                        <XCircle className="w-6 h-6 text-red-600" />
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </button>
                                                </motion.div>
                                            );
                                        })}
                                    </div>

                                    {/* Answer Details */}
                                    <AnimatePresence>
                                        {showAnswer && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="p-4 bg-white/20 rounded-xl space-y-2"
                                            >
                                                <p className="font-semibold text-gray-800">
                                                    Übersetzung: {sentences[currentIndex].targetWordTranslation}
                                                </p>
                                                <p className="font-bold text-gray-900">
                                                    Richtige Antwort: {sentences[currentIndex].targetWord}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Next Button */}
                                    <div className="flex justify-end">
                                        {showAnswer ? (
                                            <Button
                                                onClick={handleNext}
                                                variant="primary"
                                                className="text-lg px-8"
                                            >
                                                Weiter →
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() => {
                                                    setShowAnswer(true);
                                                    recordAnswer('');
                                                }}
                                                variant="secondary"
                                                className="text-lg"
                                            >
                                                Antwort zeigen
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
