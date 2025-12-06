import React, { useState, useEffect } from 'react';
import { MatchCard } from './MatchCard';
import type { MatchCardData } from './MatchCard';
import { Button } from '../../Button';
import { GlassCard } from '../../GlassCard';
import { Trophy, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MatchGameProps {
    pairs: { de: string; ru: string }[];
    onComplete: (stats: { matches: number; mistakes: number; timeSeconds: number }) => void;
    onExit: () => void;
}

export const MatchGame: React.FC<MatchGameProps> = ({ pairs, onComplete, onExit }) => {
    const [cards, setCards] = useState<MatchCardData[]>([]);
    const [firstSelection, setFirstSelection] = useState<MatchCardData | null>(null);
    const [secondSelection, setSecondSelection] = useState<MatchCardData | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
    const [incorrectPairs, setIncorrectPairs] = useState<Set<string>>(new Set());
    const [mistakes, setMistakes] = useState(0);
    const [startTime] = useState(() => Date.now());

    const createDeck = React.useCallback(() => {
        const cardList: MatchCardData[] = [];
        pairs.forEach((pair, index) => {
            const pairId = `pair_${index}`;
            cardList.push({ id: `de_${index}`, word: pair.de, language: 'de', pairId });
            cardList.push({ id: `ru_${index}`, word: pair.ru, language: 'ru', pairId });
        });
        return cardList.sort(() => Math.random() - 0.5);
    }, [pairs]);

    // Derived state for completion
    const isGameComplete = matchedPairs.size === pairs.length && pairs.length > 0;

    const checkMatch = React.useCallback(() => {
        if (!firstSelection || !secondSelection) return;

        if (firstSelection.pairId === secondSelection.pairId) {
            // Match
            setMatchedPairs(prev => new Set(prev).add(firstSelection.pairId));
            setFirstSelection(null);
            setSecondSelection(null);
        } else {
            // No match
            setMistakes(prev => prev + 1);
            setIncorrectPairs(new Set([firstSelection.id, secondSelection.id]));

            setTimeout(() => {
                setIncorrectPairs(new Set());
                setFirstSelection(null);
                setSecondSelection(null);
            }, 1000);
        }
    }, [firstSelection, secondSelection]);

    const initializeGame = React.useCallback(() => {
        setCards(createDeck());
        setMatchedPairs(new Set());
        setFirstSelection(null);
        setSecondSelection(null);
        setMistakes(0);
    }, [createDeck]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        initializeGame();
    }, [initializeGame]);

    useEffect(() => {
        if (secondSelection) {
            const timer = setTimeout(() => {
                checkMatch();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [secondSelection, checkMatch]);

    useEffect(() => {
        if (isGameComplete) {
            const timeSeconds = Math.floor((Date.now() - startTime) / 1000);
            const timer = setTimeout(() => {
                onComplete({ matches: pairs.length, mistakes, timeSeconds });
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isGameComplete, pairs.length, startTime, mistakes, onComplete]);

    const handleCardClick = (card: MatchCardData) => {
        if (matchedPairs.has(card.pairId)) return;
        if (secondSelection) return; // Wait for check
        if (firstSelection?.id === card.id) return; // Same card

        if (!firstSelection) {
            setFirstSelection(card);
        } else {
            setSecondSelection(card);
        }
    };

    const resetGame = () => {
        initializeGame();
    };

    return (
        <div className="space-y-6">
            {/* Stats */}
            <GlassCard className="p-4 flex justify-between items-center">
                <div className="flex gap-6">
                    <div>
                        <span className="text-sm text-gray-600">Найдено пар:</span>
                        <span className="ml-2 font-bold text-green-600">{matchedPairs.size}/{pairs.length}</span>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">Ошибок:</span>
                        <span className="ml-2 font-bold text-red-600">{mistakes}</span>
                    </div>
                </div>
                <Button onClick={resetGame} variant="secondary" className="!p-2">
                    <RotateCcw className="w-5 h-5" />
                </Button>
            </GlassCard>

            {/* Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cards.map(card => (
                    <MatchCard
                        key={card.id}
                        card={card}
                        isSelected={firstSelection?.id === card.id || secondSelection?.id === card.id}
                        isMatched={matchedPairs.has(card.pairId)}
                        isIncorrect={incorrectPairs.has(card.id)}
                        onClick={() => handleCardClick(card)}
                    />
                ))}
            </div>

            {/* Completion Animation */}
            <AnimatePresence>
                {isGameComplete && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                    >
                        <GlassCard className="p-8 text-center max-w-md">
                            <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Поздравляем!</h2>
                            <p className="text-gray-600 mb-4">Вы нашли все пары!</p>
                            <div className="flex justify-center gap-6 mb-6">
                                <div>
                                    <div className="text-2xl font-bold text-green-600">{pairs.length}</div>
                                    <div className="text-sm text-gray-500">Пар</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-red-600">{mistakes}</div>
                                    <div className="text-sm text-gray-500">Ошибок</div>
                                </div>
                            </div>
                        </GlassCard>
                        <div className="flex justify-center gap-4">
                            <Button onClick={resetGame} variant="primary">
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Играть еще
                            </Button>
                            <Button onClick={onExit} variant="secondary">
                                Назад
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
