import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SentenceBuilder } from '../components/features/SentenceBuilder/SentenceBuilder';
import { Button } from '../components/Button';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { getExercisesByLevel, type SentenceExercise } from '../data/sentences';
import { GlassCard } from '../components/GlassCard';

export const SentenceBuilderPage: React.FC = () => {
    const navigate = useNavigate();
    const { addXP } = useProgress();
    const [selectedLevel, setSelectedLevel] = useState<'A1' | 'A2' | 'B1' | 'B2' | null>(null);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    // State for exercises to handle shuffling (side effect)
    const [exercises, setExercises] = useState<SentenceExercise[]>([]);

    React.useEffect(() => {
        if (!selectedLevel) {
            setExercises([]);
            return;
        }
        const levelExercises = getExercisesByLevel(selectedLevel);
        // Shuffle exercises
        setExercises([...levelExercises].sort(() => Math.random() - 0.5));
    }, [selectedLevel]);
    const [correctCount, setCorrectCount] = useState(0);



    const handleComplete = async (isCorrect: boolean) => {
        if (isCorrect) {
            // Award XP based on level
            const xpRewards = { A1: 15, A2: 20, B1: 25, B2: 30 };
            const xpAmount = xpRewards[selectedLevel!];

            if (addXP) {
                await addXP(xpAmount);
            }

            setCorrectCount(correctCount + 1);

            // Move to next exercise after delay
            setTimeout(() => {
                if (currentExerciseIndex < exercises.length - 1) {
                    setCurrentExerciseIndex(currentExerciseIndex + 1);
                } else {
                    // Finished all exercises
                    alert(`🎉 Уровень ${selectedLevel} завершён! Правильно: ${correctCount + 1}/${exercises.length}`);
                    setSelectedLevel(null);
                }
            }, 2000);
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
            case 'A1': return 'Базовые предложения';
            case 'A2': return 'Простые структуры';
            case 'B1': return 'Сложные конструкции';
            case 'B2': return 'Продвинутая грамматика';
            default: return '';
        }
    };

    if (!selectedLevel) {
        return (
            <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center">
                            <Button onClick={() => navigate('/')} variant="secondary">
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Назад
                            </Button>
                            <h1 className="text-3xl font-bold text-gray-800 ml-4">
                                🧩 Составь предложение
                            </h1>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <p className="text-gray-700">
                            <strong>Как играть:</strong> На компьютере перетаскивайте слова мышкой. На телефоне нажмите на слово, затем на пустой слот. Составьте корректное немецкое предложение!
                        </p>
                    </div>

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
                                    }}
                                >
                                    <div className={`w-full h-32 bg-gradient-to-r ${getLevelColor(level)} rounded-xl mb-4 flex items-center justify-center`}>
                                        <span className="text-5xl font-bold text-white">{level}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {getLevelDescription(level)}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3">
                                        {level === 'A1' && 'verb sein/haben, простые вопросы'}
                                        {level === 'A2' && 'Perfekt, модальные глаголы, предлоги'}
                                        {level === 'B1' && 'Придаточные предложения, Konjunktiv II'}
                                        {level === 'B2' && 'Сложные конструкции, Plusquamperfekt'}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">
                                            {levelExercises.length} упражнений
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

    const currentExercise = exercises[currentExerciseIndex];

    return (
        <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button onClick={() => setSelectedLevel(null)} variant="secondary">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Назад
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Уровень {selectedLevel}
                            </h1>
                            <p className="text-sm text-gray-600">
                                Упражнение {currentExerciseIndex + 1} / {exercises.length}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Правильно:</p>
                        <p className="text-2xl font-bold text-purple-600">
                            {correctCount} / {exercises.length}
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6 w-full bg-gray-200 rounded-full h-3">
                    <div
                        className={`h-3 rounded-full bg-gradient-to-r ${getLevelColor(selectedLevel)} transition-all duration-500`}
                        style={{ width: `${((currentExerciseIndex + 1) / exercises.length) * 100}%` }}
                    />
                </div>

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
