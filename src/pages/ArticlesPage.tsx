import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { DataProvider } from '../lib/dataProvider';
import type { ArticleSentence } from '../types';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ArticlesPage: React.FC = () => {
    const navigate = useNavigate();
    const [dataProvider] = useState(() => DataProvider.getInstance());

    const [sentences, setSentences] = useState<ArticleSentence[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [isFirstAttempt, setIsFirstAttempt] = useState(true);
    const [showCompletion, setShowCompletion] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const data = await dataProvider.loadArticleSentences();
            const shuffled = [...data].sort(() => Math.random() - 0.5);
            setSentences(shuffled);
            setLoading(false);
        };
        loadData();
    }, []);

    const nextSentence = () => {
        setUserInput('');
        setShowHint(false);
        setIsFirstAttempt(true);

        if (currentIndex + 1 < sentences.length) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setShowCompletion(true);
        }
    };

    const handleCheck = () => {
        if (sentences.length === 0) return;

        const correct = sentences[currentIndex].correctArticle.toLowerCase();
        const input = userInput.trim().toLowerCase();

        if (isFirstAttempt) {
            if (input === correct) {
                nextSentence();
            } else {
                setIsFirstAttempt(false);
                setShowHint(true);
            }
        } else {
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
                    {sentences.length > 0 && !showCompletion ? (
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <GlassCard className="p-8" animate={false}>
                                <div className="space-y-6">
                                    {/* Title */}
                                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                                        Артикли
                                    </h2>

                                    {/* Sentence */}
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-gray-800 mb-4">
                                            {sentences[currentIndex].sentence}
                                        </p>
                                    </div>

                                    {/* Input */}
                                    <Input
                                        value={userInput}
                                        onChange={setUserInput}
                                        placeholder="Введите артикль (der/die/das)"
                                        onSubmit={handleCheck}
                                    />

                                    {/* Hint */}
                                    <AnimatePresence>
                                        {showHint && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="space-y-2"
                                            >
                                                <div className="flex items-center justify-center space-x-2 text-red-600">
                                                    <XCircle className="w-5 h-5" />
                                                    <span className="text-lg font-semibold">
                                                        Правильный ответ: {sentences[currentIndex].correctArticle}
                                                    </span>
                                                </div>
                                                <p className="text-center text-gray-600">
                                                    Падеж: {sentences[currentIndex].caseName}
                                                </p>
                                                <p className="text-center text-gray-600">
                                                    Перевод: {sentences[currentIndex].translation}
                                                </p>
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
                                        <p>Вопрос {currentIndex + 1} из {sentences.length}</p>
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
                                    Упражнение завершено!
                                </h2>
                                <p className="text-xl text-gray-700 mb-8">
                                    Все предложения пройдены.
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
