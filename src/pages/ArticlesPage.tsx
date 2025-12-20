import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { ScoreCounter } from '../components/ScoreCounter';
import { ExpandableHint } from '../components/ExpandableHint';
import { useArticleSentences } from '../hooks/useLoadData';
import type { ArticleSentence } from '../types';
import { ArrowLeft, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Difficulty configuration
const difficultyConfig = {
    all: { label: 'Alle', bgActive: 'bg-gradient-to-r from-gray-500 to-gray-700 text-white', bgInactive: 'bg-gray-100 hover:bg-gray-200 text-gray-700' },
    Nom: { label: 'Nom', bgActive: 'bg-gradient-to-r from-blue-500 to-blue-700 text-white', bgInactive: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300' },
    Akk: { label: 'Akk', bgActive: 'bg-gradient-to-r from-purple-500 to-purple-700 text-white', bgInactive: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-300' },
    Dat: { label: 'Dat', bgActive: 'bg-gradient-to-r from-orange-500 to-orange-700 text-white', bgInactive: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-300' }
};

// Article tables
const articleTable = {
    definite: {
        header: 'Bestimmte Artikel',
        data: [
            ['', 'Mask.', 'Fem.', 'Neut.', 'Plural'],
            ['Nom.', 'der', 'die', 'das', 'die'],
            ['Akk.', 'den', 'die', 'das', 'die'],
            ['Dat.', 'dem', 'der', 'dem', 'den'],
            ['Gen.', 'des', 'der', 'des', 'der']
        ]
    },
    indefinite: {
        header: 'Unbestimmte Artikel',
        data: [
            ['', 'Mask.', 'Fem.', 'Neut.'],
            ['Nom.', 'ein', 'eine', 'ein'],
            ['Akk.', 'einen', 'eine', 'ein'],
            ['Dat.', 'einem', 'einer', 'einem'],
            ['Gen.', 'eines', 'einer', 'eines']
        ]
    }
};

// Gender hints
const genderHints: Record<string, string> = {
    'der': 'Männlich (Maskulinum) - z.B. der Mann, der Tisch, der Computer',
    'die': 'Weiblich (Femininum) - z.B. die Frau, die Lampe, die Universität',
    'das': 'Sächlich (Neutrum) - z.B. das Kind, das Buch, das Auto',
    'den': 'Akkusativ Maskulinum - Wen/Was sehe ich? Ich sehe den Mann.',
    'dem': 'Dativ Mask./Neut. - Wem gebe ich? Ich gebe dem Mann.',
    'einen': 'Akkusativ Mask. unbestimmt - Ich sehe einen Mann.',
    'einem': 'Dativ Mask./Neut. unbestimmt - Ich gebe einem Mann.',
    'einer': 'Dativ Fem. unbestimmt - Ich gebe einer Frau.',
    'eine': 'Akkusativ/Nominativ Fem. unbestimmt - Ich sehe eine Frau.'
};

export const ArticlesPage: React.FC = () => {
    const navigate = useNavigate();

    const { data: rawData, isLoading: isQueryLoading } = useArticleSentences();

    const [sentences, setSentences] = useState<ArticleSentence[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showCompletion, setShowCompletion] = useState(false);
    const [loading, setLoading] = useState(true);
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [caseFilter, setCaseFilter] = useState<'all' | 'Nom' | 'Akk' | 'Dat'>('all');
    const [options, setOptions] = useState<string[]>([]);

    useEffect(() => {
        if (rawData) {
            const shuffled = [...rawData].sort(() => Math.random() - 0.5);
            setSentences(shuffled);
            setLoading(false);
        }
    }, [rawData]);

    useEffect(() => {
        setLoading(isQueryLoading);
    }, [isQueryLoading]);

    const filteredSentences = caseFilter === 'all'
        ? sentences
        : sentences.filter(s => s.caseName?.includes(caseFilter) || s.caseName?.toLowerCase().includes(caseFilter.toLowerCase()));

    const currentSentence = filteredSentences[currentIndex];

    const getOptionsForSentence = (correct: string) => {
        const definite = ['der', 'die', 'das', 'den', 'dem', 'des'];
        const indefinite = ['ein', 'eine', 'einen', 'einem', 'einer', 'eines'];

        const isCapitalized = /^[A-Z]/.test(correct);
        const lowCorrect = correct.toLowerCase();

        const pool = definite.includes(lowCorrect) ? definite : indefinite;

        // Pick 3 distractors from the same pool
        const distractors = pool
            .filter(a => a !== lowCorrect)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        // Combine and restore casing
        const finalOptions = [lowCorrect, ...distractors]
            .map(opt => isCapitalized ? opt.charAt(0).toUpperCase() + opt.slice(1) : opt)
            .sort(() => Math.random() - 0.5);

        return finalOptions;
    };

    useEffect(() => {
        if (currentSentence) {
            setOptions(getOptionsForSentence(currentSentence.correctArticle));
        }
    }, [currentSentence]);

    const nextSentence = () => {
        setUserInput('');
        setShowHint(false);
        setIsCorrect(null);

        if (currentIndex + 1 < filteredSentences.length) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setShowCompletion(true);
        }
    };

    const handleOptionSelect = (option: string) => {
        if (showHint || isCorrect === true) return;
        setUserInput(option);

        const correct = currentSentence.correctArticle.toLowerCase();
        const input = option.trim().toLowerCase();

        if (input === correct) {
            setIsCorrect(true);
            setCorrectCount(prev => prev + 1);
            setTimeout(() => {
                nextSentence();
            }, 1000);
        } else {
            setIsCorrect(false);
            setIncorrectCount(prev => prev + 1);
            setShowHint(true);
        }
    };

    const handleRestart = () => {
        setSentences(prev => [...prev].sort(() => Math.random() - 0.5));
        setCurrentIndex(0);
        setCorrectCount(0);
        setIncorrectCount(0);
        setShowCompletion(false);
        setUserInput('');
        setShowHint(false);
        setIsCorrect(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
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
            <div className="min-h-screen py-8 px-4">
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
                                    Zurück
                                </Button>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <Button onClick={() => navigate('/')} variant="secondary" className="!p-3">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Artikel
                    </h1>
                </div>

                {/* Case Filter */}
                <GlassCard className="p-4 mb-6">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-600">Nach Kasus filtern:</span>
                            <span className="text-sm text-gray-500">
                                {currentIndex + 1} / {filteredSentences.length} Aufgaben
                            </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {(Object.keys(difficultyConfig) as Array<keyof typeof difficultyConfig>).map((level) => {
                                const config = difficultyConfig[level];
                                const isActive = caseFilter === level;

                                return (
                                    <button
                                        key={level}
                                        onClick={() => {
                                            setCaseFilter(level as typeof caseFilter);
                                            setCurrentIndex(0);
                                            setUserInput('');
                                            setShowHint(false);
                                            setIsCorrect(null);
                                        }}
                                        className={`relative px-3 py-3 rounded-xl font-semibold text-sm transition-all transform ${isActive
                                            ? `${config.bgActive} shadow-lg scale-105`
                                            : config.bgInactive
                                            }`}
                                    >
                                        <div>{config.label}</div>
                                    </button>
                                );
                            })}
                        </div>
                        {/* Progress bar and score */}
                        <div className="flex items-center gap-3">
                            <ScoreCounter correct={correctCount} incorrect={incorrectCount} />
                            <ProgressBar
                                current={currentIndex}
                                total={filteredSentences.length}
                                color="orange"
                            />
                        </div>
                    </div>
                </GlassCard>

                {/* Expandable Article Table */}
                <ExpandableHint
                    title="Artikel-Tabelle"
                    icon={<BookOpen className="w-3 h-3" />}
                    className="mb-6"
                    buttonClassName="py-1.5 text-xs font-black shadow-sm"
                >
                    <GlassCard className="p-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Definite Articles */}
                            <div>
                                <h4 className="font-bold text-sm mb-2 text-amber-700">{articleTable.definite.header}</h4>
                                <table className="w-full text-xs">
                                    <tbody>
                                        {articleTable.definite.data.map((row, i) => (
                                            <tr key={i} className={i === 0 ? 'font-bold bg-amber-100' : ''}>
                                                {row.map((cell, j) => (
                                                    <td key={j} className={`px-2 py-1 border ${j === 0 ? 'font-semibold bg-amber-50' : ''}`}>
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Indefinite Articles */}
                            <div>
                                <h4 className="font-bold text-sm mb-2 text-yellow-700">{articleTable.indefinite.header}</h4>
                                <table className="w-full text-xs">
                                    <tbody>
                                        {articleTable.indefinite.data.map((row, i) => (
                                            <tr key={i} className={i === 0 ? 'font-bold bg-yellow-100' : ''}>
                                                {row.map((cell, j) => (
                                                    <td key={j} className={`px-2 py-1 border ${j === 0 ? 'font-semibold bg-yellow-50' : ''}`}>
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </GlassCard>
                </ExpandableHint>

                {/* Main Exercise Card */}
                <AnimatePresence mode="wait">
                    {currentSentence && !showCompletion && (
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <GlassCard className="p-8" animate={false}>
                                <div className="space-y-6">
                                    {/* Case badge */}
                                    {currentSentence.caseName && (
                                        <div className="flex justify-center">
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                                                {currentSentence.caseName}
                                            </span>
                                        </div>
                                    )}

                                    {/* Sentence */}
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-gray-800 mb-2">
                                            {currentSentence.sentence}
                                        </p>
                                        {currentSentence.translation && (
                                            <p className="text-sm text-gray-500 font-medium">
                                                {currentSentence.translation}
                                            </p>
                                        )}
                                    </div>

                                    {/* Options Selection */}
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                        {options.map((option, idx) => {
                                            const isSelected = userInput === option;
                                            const isCorrectOption = (isCorrect === true || showHint) && option.toLowerCase() === currentSentence.correctArticle.toLowerCase();
                                            const isWrongSelection = isCorrect === false && isSelected;

                                            return (
                                                <motion.div
                                                    key={idx}
                                                    whileHover={!showHint && isCorrect === null ? { scale: 1.02 } : {}}
                                                    whileTap={!showHint && isCorrect === null ? { scale: 0.98 } : {}}
                                                >
                                                    <button
                                                        onClick={() => handleOptionSelect(option)}
                                                        disabled={showHint || isCorrect === true}
                                                        className={`
                                                            w-full p-4 sm:p-6 rounded-xl font-black text-lg sm:text-xl
                                                            tracking-tight
                                                            backdrop-blur-md border-2 transition-all duration-200
                                                            ${isSelected && isCorrect === null ? 'bg-amber-400/40 border-amber-500 shadow-md' : 'bg-white/30 border-white/50'}
                                                            ${isCorrectOption ? 'bg-green-400/40 border-green-500 text-green-700' : ''}
                                                            ${isWrongSelection ? 'bg-red-400/40 border-red-500 text-red-700' : ''}
                                                            ${!showHint && isCorrect === null ? 'hover:bg-white/50 cursor-pointer text-gray-700' : 'cursor-default'}
                                                            disabled:opacity-70
                                                        `}
                                                    >
                                                        {option}
                                                    </button>
                                                </motion.div>
                                            );
                                        })}
                                    </div>

                                    {/* Result Feedback */}
                                    <AnimatePresence>
                                        {isCorrect === true && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex items-center justify-center gap-2 text-green-600"
                                            >
                                                <CheckCircle className="w-6 h-6" />
                                                <span className="text-lg font-semibold">Richtig! {currentSentence.correctArticle}</span>
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
                                            >
                                                <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2">
                                                    <div className="flex items-center gap-2 text-red-600">
                                                        <XCircle className="w-5 h-5" />
                                                        <span className="font-semibold">
                                                            Richtige Antwort: {currentSentence.correctArticle}
                                                        </span>
                                                    </div>
                                                    {currentSentence.caseName && (
                                                        <p className="text-sm text-gray-600">
                                                            <strong>Kasus:</strong> {currentSentence.caseName}
                                                        </p>
                                                    )}
                                                    {currentSentence.translation && (
                                                        <p className="text-sm text-gray-600">
                                                            <strong>Übersetzung:</strong> {currentSentence.translation}
                                                        </p>
                                                    )}
                                                    {genderHints[currentSentence.correctArticle.toLowerCase()] && (
                                                        <p className="text-sm text-gray-500 italic">
                                                            💡 {genderHints[currentSentence.correctArticle.toLowerCase()]}
                                                        </p>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Buttons */}
                                    <div className="flex gap-2">
                                        {showHint && (
                                            <Button
                                                onClick={nextSentence}
                                                variant="primary"
                                                className="flex-1 justify-center py-4 font-black shadow-lg"
                                            >
                                                Nächste Aufgabe →
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div >
        </div >
    );
};
