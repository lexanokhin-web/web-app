import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WordBlock } from './WordBlock';
import { Button } from '../../Button';
import { RotateCcw, Lightbulb, CheckCircle2, Sparkles } from 'lucide-react';
import type { SentenceExercise } from '../../../data/sentences/types';
import { AIService, type AISentenceAnalysis } from '../../../services/ai/AIService';
import { AIAdviceModal } from './AIAdviceModal';

interface SentenceBuilderProps {
    exercise: SentenceExercise;
    onComplete: (isCorrect: boolean) => void;
}

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({ exercise, onComplete }) => {
    const [scrambledWords, setScrambledWords] = useState<string[]>(() =>
        [...exercise.correctSentence].sort(() => Math.random() - 0.5)
    );
    const [placedWords, setPlacedWords] = useState<(string | null)[]>(
        Array(exercise.correctSentence.length).fill(null)
    );
    const [draggedWord, setDraggedWord] = useState<{ word: string; index: number } | null>(null);
    const [selectedWord, setSelectedWord] = useState<{ word: string; index: number; fromBank: boolean } | null>(null);
    const [isChecked, setIsChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showHint, setShowHint] = useState(false);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState<AISentenceAnalysis | null>(null);
    const [isAILoading, setIsAILoading] = useState(false);

    const handleDragStart = (e: React.DragEvent, word: string, index: number) => {
        setDraggedWord({ word, index });
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDropOnSlot = (slotIndex: number) => {
        if (!draggedWord) return;

        // Remove word from bank
        const newScrambled = scrambledWords.filter((_, i) => i !== draggedWord.index);
        setScrambledWords(newScrambled);

        // Place word in slot
        const newPlaced = [...placedWords];
        newPlaced[slotIndex] = draggedWord.word;
        setPlacedWords(newPlaced);

        setDraggedWord(null);
        setIsChecked(false);
        setIsCorrect(null);
    };

    // Tap-to-select handlers for mobile
    const handleWordClick = (word: string, index: number, fromBank: boolean) => {
        if (isChecked) return;

        // If clicking the same word, deselect it
        if (selectedWord?.word === word && selectedWord?.index === index && selectedWord?.fromBank === fromBank) {
            setSelectedWord(null);
            return;
        }

        setSelectedWord({ word, index, fromBank });
    };

    const handleSlotClick = (slotIndex: number) => {
        if (isChecked) return;

        // If no word selected, do nothing
        if (!selectedWord) return;

        // If clicking on a filled slot, remove the word
        if (placedWords[slotIndex]) {
            handleRemoveFromSlot(slotIndex);
            return;
        }

        // Place selected word from bank into slot
        if (selectedWord.fromBank) {
            const newScrambled = scrambledWords.filter((_, i) => i !== selectedWord.index);
            setScrambledWords(newScrambled);

            const newPlaced = [...placedWords];
            newPlaced[slotIndex] = selectedWord.word;
            setPlacedWords(newPlaced);

            setSelectedWord(null);
            setIsChecked(false);
            setIsCorrect(null);
        }
    };

    const handleRemoveFromSlot = (slotIndex: number) => {
        const word = placedWords[slotIndex];
        if (!word) return;

        // Add word back to bank
        setScrambledWords([...scrambledWords, word]);

        // Remove from slot
        const newPlaced = [...placedWords];
        newPlaced[slotIndex] = null;
        setPlacedWords(newPlaced);

        setSelectedWord(null);
        setIsChecked(false);
        setIsCorrect(null);
    };

    const handleCheck = () => {
        const userSentence = placedWords.filter(w => w !== null);
        const correct = JSON.stringify(userSentence) === JSON.stringify(exercise.correctSentence);

        setIsCorrect(correct);
        setIsChecked(true);

        if (correct) {
            setTimeout(() => onComplete(true), 1500);
        }
    };

    const handleAIExplain = async () => {
        const userSentence = placedWords.filter(w => w !== null).join(' ');
        const correctSentence = exercise.correctSentence.join(' ');

        setIsAIModalOpen(true);
        setIsAILoading(true);
        setAiAnalysis(null);

        try {
            const analysis = await AIService.analyzeSentence(
                userSentence,
                correctSentence,
                exercise.translation,
                exercise.level
            );
            setAiAnalysis(analysis);
        } catch (error) {
            console.error('AI Explain Error:', error);
        } finally {
            setIsAILoading(false);
        }
    };

    const handleReset = () => {
        setScrambledWords([...exercise.correctSentence].sort(() => Math.random() - 0.5));
        setPlacedWords(Array(exercise.correctSentence.length).fill(null));
        setIsChecked(false);
        setIsCorrect(null);
        setShowHint(false);
        setSelectedWord(null);
    };

    const handleHint = () => {
        if (hintsUsed >= 2) return;

        // Find first empty slot and fill it with correct word
        const emptySlotIndex = placedWords.findIndex(w => w === null);
        if (emptySlotIndex === -1) return;

        const correctWord = exercise.correctSentence[emptySlotIndex];
        const wordIndexInScrambled = scrambledWords.indexOf(correctWord);

        if (wordIndexInScrambled !== -1) {
            const newScrambled = scrambledWords.filter((_, i) => i !== wordIndexInScrambled);
            setScrambledWords(newScrambled);

            const newPlaced = [...placedWords];
            newPlaced[emptySlotIndex] = correctWord;
            setPlacedWords(newPlaced);

            setHintsUsed(hintsUsed + 1);
        }

        setShowHint(true);
        setTimeout(() => setShowHint(false), 3000);
    };

    const allPlaced = placedWords.every(w => w !== null);

    return (
        <div className="space-y-6">
            {/* Level Badge */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className={`
                        px-3 py-1 rounded-full text-sm font-bold
                        ${exercise.level === 'A1' ? 'bg-green-100 text-green-700' : ''}
                        ${exercise.level === 'A2' ? 'bg-blue-100 text-blue-700' : ''}
                        ${exercise.level === 'B1' ? 'bg-orange-100 text-orange-700' : ''}
                        ${exercise.level === 'B2' ? 'bg-red-100 text-red-700' : ''}
                    `}>
                        {exercise.level}
                    </span>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-800">{exercise.subTopic}</span>
                        <span className="text-xs text-gray-500">{exercise.grammarFocus}</span>
                    </div>
                </div>
            </div>

            {/* Translation */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-gray-700">
                    <strong>Перевод:</strong> {exercise.translation}
                </p>
            </div>

            {/* Sentence Slots */}
            <div className="flex flex-wrap gap-2 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-dashed border-purple-300 min-h-[80px] items-center justify-center">
                {placedWords.map((word, index) => (
                    <div
                        key={index}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDropOnSlot(index)}
                        onClick={() => handleSlotClick(index)}
                        className="relative cursor-pointer"
                    >
                        {word ? (
                            <div
                                className={`
                                    px-4 py-3 rounded-lg border-2 font-medium transition-all duration-200
                                    ${isChecked && isCorrect ? 'bg-green-100 border-green-400 text-green-800' : ''}
                                    ${isChecked && !isCorrect ? 'bg-red-100 border-red-400 text-red-800' : ''}
                                    ${!isChecked ? 'bg-white border-purple-400 hover:bg-purple-50 hover:border-purple-500 active:scale-95' : ''}
                                `}
                            >
                                {word}
                            </div>
                        ) : (
                            <div className={`
                                w-24 h-12 rounded-lg border-2 border-dashed transition-all duration-200
                                ${selectedWord ? 'border-purple-500 bg-purple-100/50 animate-pulse' : 'border-gray-300 bg-white/50'}
                            `} />
                        )}
                    </div>
                ))}
            </div>

            {/* Result */}
            <AnimatePresence>
                {isChecked && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-xl border-2 flex flex-col md:flex-row md:items-center justify-between gap-4 ${isCorrect
                            ? 'bg-green-50 border-green-400 text-green-800'
                            : 'bg-red-50 border-red-400 text-red-800'
                            }`}
                    >
                        <p className="font-bold">
                            {isCorrect ? '✓ Правильно! Отлично!' : '✗ Неправильно. Попробуйте еще раз!'}
                        </p>

                        {!isCorrect && (
                            <button
                                onClick={handleAIExplain}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-white/50 hover:bg-white border-2 border-red-200 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
                            >
                                <Sparkles className="w-4 h-4 text-orange-500" />
                                ✨ Объяснить ошибку (AI)
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hint */}
            {showHint && exercise.hint && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-yellow-50 border border-yellow-300 rounded-lg"
                >
                    <p className="text-yellow-800 text-sm">
                        💡 <strong>Подсказка:</strong> {exercise.hint}
                    </p>
                </motion.div>
            )}

            {/* Word Bank */}
            <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-600">
                    Доступные слова:{selectedWord && selectedWord.fromBank && ' (Выберите слот ☝️)'}
                </h3>
                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-xl border border-gray-200 min-h-[60px]">
                    {scrambledWords.map((word, index) => (
                        <WordBlock
                            key={`${word}-${index}`}
                            word={word}
                            index={index}
                            onDragStart={handleDragStart}
                            onDrop={() => { }}
                            onClick={() => handleWordClick(word, index, true)}
                            isSelected={selectedWord?.word === word && selectedWord?.index === index && selectedWord?.fromBank === true}
                        />
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <Button onClick={handleReset} variant="secondary" className="flex-1">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Сброс
                </Button>
                <Button
                    onClick={handleHint}
                    variant="secondary"
                    className="flex-1"
                    disabled={hintsUsed >= 2 || allPlaced}
                >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Подсказка ({2 - hintsUsed})
                </Button>
                <Button
                    onClick={handleCheck}
                    variant="success"
                    className="flex-1"
                    disabled={!allPlaced || isChecked}
                >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Проверить
                </Button>
            </div>
            <AIAdviceModal
                isOpen={isAIModalOpen}
                onClose={() => setIsAIModalOpen(false)}
                title="AI Грамматический разбор"
                advice={aiAnalysis}
                isLoading={isAILoading}
                context={`Пользователь: "${placedWords.filter(w => w !== null).join(' ')}"\nПравильно: "${exercise.correctSentence.join(' ')}"`}
                topic={exercise.grammarFocus || exercise.subTopic}
            />
        </div>
    );
};
