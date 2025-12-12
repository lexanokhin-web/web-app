import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SentenceBuilder } from '../components/features/SentenceBuilder/SentenceBuilder';
import { Button } from '../components/Button';
import { ScoreCounter } from '../components/ScoreCounter';
import { ExpandableHint } from '../components/ExpandableHint';
import { ArrowLeft, ChevronRight, BookOpen, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProgress } from '../hooks/useProgress';
import { getExercisesByLevel, type SentenceExercise } from '../data/sentences';
import { GlassCard } from '../components/GlassCard';

// German word order rules
const wordOrderRules = [
    { title: 'Hauptsatz (SVO)', rule: 'Subjekt + Verb + Objekt', example: 'Ich esse einen Apfel.' },
    { title: 'Fragesatz', rule: 'Verb + Subjekt + Rest', example: 'Isst du einen Apfel?' },
    { title: 'Nebensatz', rule: 'Konjunktion + Subjekt + ... + Verb (am Ende)', example: '...weil ich müde bin.' },
    { title: 'Zeitangabe am Anfang', rule: 'Zeit + Verb + Subjekt', example: 'Heute gehe ich ins Kino.' }
];

export const SentenceBuilderPage: React.FC = () => {
    const navigate = useNavigate();
    const { addXP } = useProgress();
    const [selectedLevel, setSelectedLevel] = useState<'A1' | 'A2' | 'B1' | 'B2' | null>(null);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [exercises, setExercises] = useState<SentenceExercise[]>([]);
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [showCompletion, setShowCompletion] = useState(false);

    React.useEffect(() => {
        if (!selectedLevel) {
            setExercises([]);
            return;
        }
        const levelExercises = getExercisesByLevel(selectedLevel);
        setExercises([...levelExercises].sort(() => Math.random() - 0.5));
    }, [selectedLevel]);

    const handleComplete = async (isCorrect: boolean) => {
        if (isCorrect) {
            const xpRewards = { A1: 15, A2: 20, B1: 25, B2: 30 };
            const xpAmount = xpRewards[selectedLevel!];

            if (addXP) {
                await addXP(xpAmount);
            }

            setCorrectCount(correctCount + 1);

            setTimeout(() => {
                if (currentExerciseIndex < exercises.length - 1) {
                    setCurrentExerciseIndex(currentExerciseIndex + 1);
                } else {
                    setShowCompletion(true);
                }
            }, 2000);
        } else {
            setIncorrectCount(incorrectCount + 1);
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'A1': return 'from-green-400 to-green-600';
            case 'A2': return 'from-blue-400 to-blue-600';
            case 'B1': return 'from-orange-400 to-orange-600';
            case 'B2': return 'from-red-400 to-red-600';
            default: return 'from-gray-400 to-gray-600';
        }
    };

    const getLevelDescription = (level: string) => {
        switch (level) {
            case 'A1': return 'Einfache Sätze';
            case 'A2': return 'Alltägliche Strukturen';
            case 'B1': return 'Komplexe Konstruktionen';
            case 'B2': return 'Fortgeschrittene Grammatik';
            default: return '';
        }
    };

    const handleRestart = () => {
        const levelExercises = getExercisesByLevel(selectedLevel!);
        setExercises([...levelExercises].sort(() => Math.random() - 0.5));
        setCurrentExerciseIndex(0);
        setCorrectCount(0);
        setIncorrectCount(0);
        setShowCompletion(false);
    };

    // Level Selection View
    if (!selectedLevel) {
        return (
            <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center">
                            <Button onClick={() => navigate('/')} variant="secondary">
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Zurück
                            </Button>
                            <h1 className="text-3xl font-bold text-gray-800 ml-4">
                                🧩 Sätze bauen
                            </h1>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <p className="text-gray-700">
                            <strong>Anleitung:</strong> Am Computer Wörter mit der Maus ziehen. Am Handy auf ein Wort tippen, dann auf einen leeren Platz. Baue einen korrekten deutschen Satz!
                        </p>
                    </div>

                    {/* Grammar Hint */}
                    <ExpandableHint
                        title="Wortstellung-Regeln"
                        icon={<BookOpen className="w-4 h-4" />}
                        className="mb-6"
                    >
                        <GlassCard className="p-4">
                            <div className="space-y-3">
                                {wordOrderRules.map((rule, i) => (
                                    <div key={i} className="p-3 bg-purple-50 rounded-lg">
                                        <div className="font-semibold text-purple-700">{rule.title}</div>
                                        <div className="text-sm text-gray-600">{rule.rule}</div>
                                        <div className="text-sm italic text-gray-500">z.B. {rule.example}</div>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </ExpandableHint>

                    {/* Level Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(['A1', 'A2', 'B1', 'B2'] as const).map(level => {
                            const levelExercises = getExercisesByLevel(level);
                            return (
                                <GlassCard
                                    key={level}
                                    className="p-6 cursor-pointer hover:scale-105 transition-transform duration-200"
                                    onClick={() => {
                                        setSelectedLevel(level);
                                        setCurrentExerciseIndex(0);
                                        setCorrectCount(0);
                                        setIncorrectCount(0);
                                        setShowCompletion(false);
                                    }}
                                >
                                    <div className={`w-full h-32 bg-gradient-to-r ${getLevelColor(level)} rounded-xl mb-4 flex items-center justify-center`}>
                                        <span className="text-5xl font-bold text-white">{level}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {getLevelDescription(level)}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3">
                                        {level === 'A1' && 'sein/haben, W-Fragen'}
                                        {level === 'A2' && 'Perfekt, Modalverben, Präpositionen'}
                                        {level === 'B1' && 'Nebensätze, Konjunktiv II'}
                                        {level === 'B2' && 'Komplexe Strukturen, Plusquamperfekt'}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">
                                            {levelExercises.length} Übungen
                                        </span>
                                        <ChevronRight className="w-5 h-5 text-purple-600" />
                                    </div>
                                </GlassCard>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // Completion Screen
    if (showCompletion) {
        const score = correctCount + incorrectCount > 0
            ? Math.round((correctCount / exercises.length) * 100)
            : 0;
        return (
            <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full"
                >
                    <GlassCard className="p-12 text-center">
                        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            Level {selectedLevel} abgeschlossen! 🎉
                        </h2>
                        <div className="flex justify-center gap-8 mb-8">
                            <div>
                                <div className="text-3xl font-bold text-green-600">{correctCount}</div>
                                <div className="text-sm text-gray-500">Richtig</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-red-600">{incorrectCount}</div>
                                <div className="text-sm text-gray-500">Versuche</div>
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
                            <Button onClick={() => setSelectedLevel(null)} variant="secondary" className="w-full justify-center">
                                Anderes Level
                            </Button>
                            <Button onClick={() => navigate('/')} variant="secondary" className="w-full justify-center">
                                Zur Startseite
                            </Button>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        );
    }

    const currentExercise = exercises[currentExerciseIndex];

    // Exercise View
    return (
        <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Button onClick={() => setSelectedLevel(null)} variant="secondary">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Zurück
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Level {selectedLevel}
                            </h1>
                            <p className="text-sm text-gray-600">
                                Übung {currentExerciseIndex + 1} / {exercises.length}
                            </p>
                        </div>
                    </div>
                    <ScoreCounter correct={correctCount} incorrect={incorrectCount} />
                </div>

                {/* Progress Bar */}
                <div className="mb-6 w-full bg-gray-200 rounded-full h-3">
                    <div
                        className={`h-3 rounded-full bg-gradient-to-r ${getLevelColor(selectedLevel)} transition-all duration-500`}
                        style={{ width: `${((currentExerciseIndex + 1) / exercises.length) * 100}%` }}
                    />
                </div>

                {/* Word Order Hint */}
                <ExpandableHint
                    title="Wortstellung-Hilfe"
                    icon={<BookOpen className="w-4 h-4" />}
                    className="mb-4"
                >
                    <GlassCard className="p-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {wordOrderRules.map((rule, i) => (
                                <div key={i} className="p-2 bg-purple-50 rounded">
                                    <span className="font-semibold text-purple-700">{rule.title}:</span>
                                    <span className="text-gray-600 ml-1">{rule.rule}</span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </ExpandableHint>

                {/* Exercise */}
                {currentExercise && (
                    <GlassCard className="p-6">
                        <SentenceBuilder
                            key={currentExercise.id}
                            exercise={currentExercise}
                            onComplete={handleComplete}
                        />
                    </GlassCard>
                )}
            </div>
        </div>
    );
};
