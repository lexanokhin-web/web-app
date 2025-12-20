import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress';
import { getExercisesByLevel, type SentenceExercise } from '../data/sentences';
import { TOPIC_DESCRIPTIONS } from '../data/topicDescriptions';
import { ArrowLeft, ChevronRight, BookOpen, CheckCircle } from 'lucide-react';
import { SentenceBuilder } from '../components/features/SentenceBuilder/SentenceBuilder';
import { Button } from '../components/Button';
import { ScoreCounter } from '../components/ScoreCounter';
import { ExpandableHint } from '../components/ExpandableHint';
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
    // console.log('SentenceBuilderPage rendering');
    const [selectedLevel, setSelectedLevel] = useState<'A1' | 'A2' | 'B1' | 'B2' | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null); // 'ALL' or specific topic
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [exercises, setExercises] = useState<SentenceExercise[]>([]);
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [showCompletion, setShowCompletion] = useState(false);

    // Load exercises based on selection
    React.useEffect(() => {
        if (!selectedLevel) {
            setExercises([]);
            return;
        }

        const levelExercises = getExercisesByLevel(selectedLevel);

        if (selectedTopic) {
            let filtered = levelExercises;
            if (selectedTopic !== 'ALL') {
                filtered = levelExercises.filter(ex => ex.topic === selectedTopic);
            }
            setExercises([...filtered].sort(() => Math.random() - 0.5));
            setCurrentExerciseIndex(0);
            setCorrectCount(0);
            setIncorrectCount(0);
            setShowCompletion(false);
        }
    }, [selectedLevel, selectedTopic]);

    // Group topics for current level
    const availableTopics = React.useMemo(() => {
        if (!selectedLevel) return [];
        const levelExercises = getExercisesByLevel(selectedLevel);
        const topics = new Set(levelExercises.map(ex => ex.topic).filter(Boolean));
        return Array.from(topics).sort();
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
        // Re-shuffle current set
        setExercises(prev => [...prev].sort(() => Math.random() - 0.5));
        setCurrentExerciseIndex(0);
        setCorrectCount(0);
        setIncorrectCount(0);
        setShowCompletion(false);
    };

    // 1. Level Selection View
    if (!selectedLevel) {
        return (
            <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center">
                            <Button onClick={() => navigate('/')} variant="secondary" className="!p-3">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <h1 className="text-3xl font-bold text-gray-800 ml-4">
                                🧩 Sätze bauen
                            </h1>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <p className="text-gray-700">
                            <strong>Anleitung:</strong> Wähle dein Niveau, um passende Übungen zu finden.
                        </p>
                    </div>


                    {/* Level Selection */}
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4">
                        {(['A1', 'A2', 'B1', 'B2'] as const).map(level => {
                            const levelExercises = getExercisesByLevel(level);
                            return (
                                <GlassCard
                                    key={level}
                                    className="p-3 sm:p-6 cursor-pointer hover:scale-[1.02] transition-transform duration-200 h-full flex flex-col"
                                    onClick={() => setSelectedLevel(level)}
                                >
                                    <div className={`w-full h-16 sm:h-32 bg-gradient-to-r ${getLevelColor(level)} rounded-xl mb-3 flex items-center justify-center`}>
                                        <span className="text-2xl sm:text-5xl font-bold text-white">{level}</span>
                                    </div>
                                    <h3 className="text-sm sm:text-xl font-black text-gray-800 mb-1 leading-tight">
                                        {getLevelDescription(level)}
                                    </h3>
                                    <div className="flex items-center justify-end mt-auto">
                                        <ChevronRight className="w-3 h-3 sm:w-5 sm:h-5 text-purple-600" />
                                    </div>
                                </GlassCard>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // 2. Topic Selection View
    if (!selectedTopic) {
        return (
            <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center mb-8">
                        <Button onClick={() => setSelectedLevel(null)} variant="secondary" className="!p-3">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 ml-4">
                            Level {selectedLevel}
                        </h1>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {/* ALL Button */}
                        <GlassCard
                            className="p-3 sm:p-6 cursor-pointer hover:scale-[1.02] transition-all border-2 border-purple-200 hover:border-purple-400 group h-full flex flex-col"
                            onClick={() => setSelectedTopic('ALL')}
                        >
                            <div className="flex items-center justify-between mb-2 sm:mb-4">
                                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors text-lg sm:text-2xl">
                                    🌟
                                </div>
                                <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:py-1 bg-purple-100 text-purple-700 rounded-full">
                                    Alle
                                </span>
                            </div>
                            <h3 className="text-sm sm:text-xl font-black text-gray-800 mb-1 leading-tight mt-auto">Alle Übungen</h3>
                            <p className="text-gray-600 text-[10px] sm:text-sm hidden sm:block">
                                Trainiere alle Themen von Level {selectedLevel} gemischt.
                            </p>
                        </GlassCard>

                        {/* Topic List */}
                        {availableTopics.map(topic => {
                            const count = getExercisesByLevel(selectedLevel).filter(ex => ex.topic === topic).length;
                            const description = TOPIC_DESCRIPTIONS[selectedLevel]?.[topic];

                            return (
                                <GlassCard
                                    key={topic}
                                    className="p-3 sm:p-6 cursor-pointer hover:scale-[1.02] transition-all h-full flex flex-col"
                                    onClick={() => setSelectedTopic(topic)}
                                >
                                    <h3 className="text-sm sm:text-xl font-black text-gray-800 mb-1 leading-tight">{topic}</h3>
                                    {description && (
                                        <div className="text-[10px] text-gray-500 mb-2 whitespace-pre-line leading-relaxed hidden sm:block">
                                            {description}
                                        </div>
                                    )}
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
                            {selectedTopic === 'ALL' ? `Level ${selectedLevel}` : selectedTopic} abgeschlossen! 🎉
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
                            <Button onClick={() => setSelectedTopic(null)} variant="secondary" className="w-full justify-center">
                                Anderes Thema
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
                        <Button onClick={() => setSelectedTopic(null)} variant="secondary" className="!p-3">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Level {selectedLevel}
                            </h1>
                            <p className="text-sm text-gray-600">
                                {selectedTopic === 'ALL' ? 'Alle Themen' : selectedTopic} • Übung {currentExerciseIndex + 1} / {exercises.length}
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
                    icon={<BookOpen className="w-3 h-3" />}
                    className="mb-3"
                    buttonClassName="py-1.5 text-xs font-black shadow-sm"
                >
                    <GlassCard className="p-2">
                        <div className="grid grid-cols-2 gap-1.5 text-[10px] sm:text-xs">
                            {wordOrderRules.map((rule, i) => (
                                <div key={i} className="p-1.5 bg-purple-50 rounded">
                                    <span className="font-black text-purple-700">{rule.title}:</span>
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
