import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useBlockSentences } from '../hooks/useLoadData';
import { useExerciseProgress } from '../hooks/useExerciseProgress';
import type { Sentence } from '../types';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ExercisePage: React.FC = () => {
    const navigate = useNavigate();
    const { blockId } = useParams<{ blockId: string }>();
    const inputRef = useRef<HTMLInputElement>(null);

    const { data: sentences, isLoading: isSentencesLoading } = useBlockSentences(blockId);
    const { progress, saveProgress } = useExerciseProgress(blockId);

    const [currentSentence, setCurrentSentence] = useState<Sentence | null>(null);
    const [userInput, setUserInput] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [isFirstAttempt, setIsFirstAttempt] = useState(true);
    const [showCompletion, setShowCompletion] = useState(false);
    const [sessionQueue, setSessionQueue] = useState<Sentence[]>([]);
    const [sessionRepeatQueue, setSessionRepeatQueue] = useState<Sentence[]>([]);
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);

    // Initialize session once data and progress are ready
    useEffect(() => {
        if (!initialized && sentences && blockId) {
            const newOnes = sentences.filter(s => !progress.learnedWordIDs.includes(s.id));
            const shuffled = [...newOnes].sort(() => Math.random() - 0.5);
            setSessionQueue(shuffled);
            setLoading(false);
            setInitialized(true);

            if (shuffled.length > 0) {
                setCurrentSentence(shuffled[0]);
                setSessionQueue(shuffled.slice(1));
            } else {
                setShowCompletion(true);
            }
        }
    }, [sentences, progress, blockId, initialized]);


    const nextSentence = () => {
        setUserInput('');
        setShowHint(false);
        setIsFirstAttempt(true);

        if (sessionQueue.length > 0) {
            setCurrentSentence(sessionQueue[0]);
            setSessionQueue(sessionQueue.slice(1));
        } else if (sessionRepeatQueue.length > 0) {
            const shuffled = [...sessionRepeatQueue].sort(() => Math.random() - 0.5);
            setSessionRepeatQueue([]);
            if (shuffled.length > 0) {
                setCurrentSentence(shuffled[0]);
                setSessionQueue(shuffled.slice(1));
            } else {
                setCurrentSentence(null);
                setShowCompletion(true);
            }
        } else {
            setCurrentSentence(null);
            setShowCompletion(true);
        }
    };

    const handleCheck = () => {
        if (!currentSentence) return;

        const trimmedInput = userInput.trim().toLowerCase();
        const correctWord = currentSentence.targetWord.toLowerCase();

        if (isFirstAttempt) {
            if (trimmedInput === correctWord) {
                const newProgress = {
                    ...progress,
                    learnedWordIDs: [...progress.learnedWordIDs, currentSentence.id],
                    toRepeatWordIDs: progress.toRepeatWordIDs.filter(id => id !== currentSentence.id),
                    totalCompleted: progress.totalCompleted + 1
                };
                saveProgress(newProgress);
                nextSentence();
            } else {
                setIsFirstAttempt(false);
                setShowHint(true);
            }
        } else {
            setSessionRepeatQueue([...sessionRepeatQueue, currentSentence]);
            const newProgress = {
                ...progress,
                toRepeatWordIDs: [...progress.toRepeatWordIDs, currentSentence.id],
                totalCompleted: progress.totalCompleted + 1
            };
            saveProgress(newProgress);
            nextSentence();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <GlassCard className="p-8">
                    <p className="text-xl text-gray-700">Загрузка...</p>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <Button
                    onClick={() => navigate('/')}
                    variant="secondary"
                    className="mb-6"
                >
                    <ArrowLeft className="w-5 h-5 inline mr-2" />
                    Назад
                </Button>

                <AnimatePresence mode="wait">
                    {currentSentence && !showCompletion ? (
                        <motion.div
                            key={currentSentence.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <GlassCard className="p-8" animate={false}>
                                <div className="space-y-6">
                                    {/* Sentence */}
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-gray-800 mb-4">
                                            {currentSentence.sentence.replace(currentSentence.targetWord, '_____')}
                                        </p>
                                        <p className="text-lg text-gray-600">
                                            Перевод: {currentSentence.targetWordTranslation}
                                        </p>
                                    </div>

                                    {/* Input */}
                                    <Input
                                        ref={inputRef}
                                        value={userInput}
                                        onChange={setUserInput}
                                        placeholder="Введите слово"
                                        onSubmit={handleCheck}
                                    />

                                    {/* Hint */}
                                    <AnimatePresence>
                                        {showHint && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex items-center justify-center space-x-2 text-red-600"
                                            >
                                                <XCircle className="w-5 h-5" />
                                                <span className="text-lg font-semibold">
                                                    Правильный ответ: {currentSentence.targetWord}
                                                </span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Check Button */}
                                    <Button
                                        onClick={handleCheck}
                                        disabled={userInput.trim() === ''}
                                        variant="primary"
                                        className="w-full text-lg py-4"
                                    >
                                        Проверить
                                    </Button>

                                    {/* Progress */}
                                    <div className="text-center text-sm text-gray-600">
                                        <p>Изучено: {progress.learnedWordIDs.length} | Всего выполнено: {progress.totalCompleted}</p>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ) : showCompletion ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <GlassCard className="p-12 text-center" animate={false}>
                                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                    Поздравляем!
                                </h2>
                                <p className="text-xl text-gray-700 mb-8">
                                    Все слова изучены или в очереди на повторение нет предложений.
                                </p>
                                <Button
                                    onClick={() => navigate('/')}
                                    variant="primary"
                                    className="text-lg"
                                >
                                    Главное меню
                                </Button>
                            </GlassCard>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>
        </div>
    );
};
