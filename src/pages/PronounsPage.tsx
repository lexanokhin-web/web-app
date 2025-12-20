import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { ScoreCounter } from '../components/ScoreCounter';
import { ExpandableHint } from '../components/ExpandableHint';
import { usePronounExercises } from '../hooks/useLoadData';
import { ArrowLeft, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PersonalPronounSentence {
    id: string;
    sentence: string;
    correctPronoun: string;
    caseName: string;
    translation: string;
}

// Case filter configuration
const caseFilterConfig = {
    all: { label: 'Alle', bgActive: 'bg-gradient-to-r from-gray-500 to-gray-700 text-white', bgInactive: 'bg-gray-100 hover:bg-gray-200 text-gray-700' },
    Nom: { label: 'Nom', bgActive: 'bg-gradient-to-r from-blue-500 to-blue-700 text-white', bgInactive: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300' },
    Akk: { label: 'Akk', bgActive: 'bg-gradient-to-r from-purple-500 to-purple-700 text-white', bgInactive: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-300' },
    Dat: { label: 'Dat', bgActive: 'bg-gradient-to-r from-orange-500 to-orange-700 text-white', bgInactive: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-300' }
};

// Pronoun tables
const pronounTable = {
    header: 'Personalpronomen',
    data: [
        ['', 'Nominativ', 'Akkusativ', 'Dativ'],
        ['ich', 'ich', 'mich', 'mir'],
        ['du', 'du', 'dich', 'dir'],
        ['er', 'er', 'ihn', 'ihm'],
        ['sie', 'sie', 'sie', 'ihr'],
        ['es', 'es', 'es', 'ihm'],
        ['wir', 'wir', 'uns', 'uns'],
        ['ihr', 'ihr', 'euch', 'euch'],
        ['sie/Sie', 'sie/Sie', 'sie/Sie', 'ihnen/Ihnen']
    ]
};

// Pronoun hints by case
const pronounHints: Record<string, string> = {
    'Nominativ': 'Wer/Was? → ich, du, er, sie, es, wir, ihr, sie',
    'Akkusativ': 'Wen/Was? → mich, dich, ihn, sie, es, uns, euch, sie',
    'Dativ': 'Wem? → mir, dir, ihm, ihr, ihm, uns, euch, ihnen'
};

export const PronounsPage: React.FC = () => {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    const { data: rawData, isLoading: isQueryLoading } = usePronounExercises();

    const [sentences, setSentences] = useState<PersonalPronounSentence[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showCompletion, setShowCompletion] = useState(false);
    const [loading, setLoading] = useState(true);
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [caseFilter, setCaseFilter] = useState<'all' | 'Nom' | 'Akk' | 'Dat'>('all');

    useEffect(() => {
        if (rawData) {
            const shuffled = [...(rawData as PersonalPronounSentence[])].sort(() => Math.random() - 0.5);
            setSentences(shuffled);
            setLoading(false);
        }
    }, [rawData]);

    useEffect(() => {
        setLoading(isQueryLoading);
    }, [isQueryLoading]);

    // Filter sentences by case
    const filteredSentences = caseFilter === 'all'
        ? sentences
        : sentences.filter(s => s.caseName?.includes(caseFilter) || s.caseName?.toLowerCase().includes(caseFilter.toLowerCase()));

    const currentSentence = filteredSentences[currentIndex];


    const nextSentence = () => {
        setUserInput('');
        setShowHint(false);
        setIsCorrect(null);

        if (currentIndex + 1 < filteredSentences.length) {
            setCurrentIndex(currentIndex + 1);
            inputRef.current?.focus();
        } else {
            setShowCompletion(true);
        }
    };

    const handleCheck = () => {
        if (filteredSentences.length === 0 || !currentSentence) return;

        const correct = currentSentence.correctPronoun.toLowerCase();
        const input = userInput.trim().toLowerCase();

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

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (showHint) {
                nextSentence();
            } else {
                handleCheck();
            }
        }
    };

    const handleRestart = () => {
        const shuffled = [...sentences].sort(() => Math.random() - 0.5);
        setSentences(shuffled);
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
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
            <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-green-50 to-emerald-50">
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
        <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <Button onClick={() => navigate('/')} variant="secondary" className="!p-3">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Personalpronomen
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
                            {(Object.keys(caseFilterConfig) as Array<keyof typeof caseFilterConfig>).map((level) => {
                                const config = caseFilterConfig[level];
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
                                color="green"
                            />
                        </div>
                    </div>
                </GlassCard>

                {/* Expandable Pronoun Table */}
                <ExpandableHint
                    title="Pronomen-Tabelle"
                    icon={<BookOpen className="w-4 h-4" />}
                    className="mb-6"
                >
                    <GlassCard className="p-4">
                        <table className="w-full text-sm">
                            <tbody>
                                {pronounTable.data.map((row, i) => (
                                    <tr key={i} className={i === 0 ? 'font-bold bg-green-100' : ''}>
                                        {row.map((cell, j) => (
                                            <td key={j} className={`px-3 py-2 border ${j === 0 ? 'font-semibold bg-green-50' : ''}`}>
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
                                    <div className="flex justify-center">
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                            {currentSentence.caseName}
                                        </span>
                                    </div>

                                    {/* Sentence */}
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-gray-800 mb-4">
                                            {currentSentence.sentence}
                                        </p>
                                        <p className="text-lg text-gray-600">
                                            {currentSentence.translation}
                                        </p>
                                    </div>

                                    {/* Input */}
                                    <div className="flex gap-2">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={userInput}
                                            onChange={(e) => setUserInput(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="ich / mich / mir / du / dich / dir..."
                                            className={`flex-1 px-4 py-3 text-xl rounded-xl border-2 transition-colors ${isCorrect === true ? 'border-green-500 bg-green-50' :
                                                isCorrect === false ? 'border-red-500 bg-red-50' :
                                                    'border-gray-300 focus:border-green-500'
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
                                                className="flex items-center justify-center gap-2 text-green-600"
                                            >
                                                <CheckCircle className="w-6 h-6" />
                                                <span className="text-lg font-semibold">Richtig! {currentSentence.correctPronoun}</span>
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
                                                            Richtige Antwort: {currentSentence.correctPronoun}
                                                        </span>
                                                    </div>
                                                    {currentSentence.caseName && pronounHints[currentSentence.caseName] && (
                                                        <p className="text-sm text-gray-600">
                                                            💡 {pronounHints[currentSentence.caseName]}
                                                        </p>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Buttons */}
                                    <div className="flex gap-2">
                                        {!showHint ? (
                                            <Button
                                                onClick={handleCheck}
                                                disabled={userInput.trim() === ''}
                                                variant="primary"
                                                className="flex-1 justify-center py-3"
                                            >
                                                Prüfen
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={nextSentence}
                                                variant="primary"
                                                className="flex-1 justify-center py-3"
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
            </div>
        </div>
    );
};
