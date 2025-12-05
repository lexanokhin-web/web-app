import React from 'react';
import { motion } from 'framer-motion';

export interface MatchCardData {
    id: string;
    word: string;
    language: 'de' | 'ru';
    pairId: string; // ID пары для проверки совпадения
}

interface MatchCardProps {
    card: MatchCardData;
    isSelected: boolean;
    isMatched: boolean;
    isIncorrect: boolean;
    onClick: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
    card,
    isSelected,
    isMatched,
    isIncorrect,
    onClick
}) => {
    const getCardStyle = () => {
        if (isMatched) {
            return 'bg-green-100 border-green-400 text-green-800 cursor-default';
        }
        if (isSelected) {
            return 'bg-blue-100 border-blue-400 text-blue-800 scale-105 shadow-xl';
        }
        if (isIncorrect) {
            return 'bg-red-100 border-red-400 text-red-800';
        }
        return 'bg-white hover:bg-blue-50 hover:border-blue-300 cursor-pointer';
    };

    return (
        <motion.div
            onClick={isMatched ? undefined : onClick}
            className={`
                p-6 rounded-xl border-2 transition-all duration-200
                flex items-center justify-center
                min-h-[100px] text-center font-semibold text-lg
                ${getCardStyle()}
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: isMatched ? 0.5 : 1,
                y: 0,
                scale: isSelected ? 1.05 : 1
            }}
            whileHover={!isMatched ? { scale: 1.02 } : {}}
            whileTap={!isMatched ? { scale: 0.98 } : {}}
            // Shake animation on incorrect
            {...(isIncorrect && {
                animate: {
                    x: [0, -10, 10, -10, 10, 0],
                    transition: { duration: 0.4 }
                }
            })}
        >
            <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500 uppercase">
                    {card.language === 'de' ? '🇩🇪' : '🇷🇺'}
                </span>
                <span>{card.word}</span>
            </div>
        </motion.div>
    );
};
