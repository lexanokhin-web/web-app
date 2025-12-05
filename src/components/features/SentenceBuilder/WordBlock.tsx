import React from 'react';
import { motion } from 'framer-motion';

interface WordBlockProps {
    word: string;
    index: number;
    onDragStart: (e: React.DragEvent, word: string, index: number) => void;
    onDrop: (e: React.DragEvent) => void;
    isPlaced?: boolean;
    isCorrect?: boolean | null;
    onClick?: () => void;
}

export const WordBlock: React.FC<WordBlockProps> = ({
    word,
    index,
    onDragStart,
    onDrop,
    isPlaced = false,
    isCorrect = null,
    onClick
}) => {
    const handleDragStart = (e: React.DragEvent) => {
        onDragStart(e, word, index);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const getBackgroundColor = () => {
        if (isCorrect === true) return 'bg-green-100 border-green-400';
        if (isCorrect === false) return 'bg-red-100 border-red-400';
        if (isPlaced) return 'bg-blue-50 border-blue-300';
        return 'bg-white border-gray-300 hover:border-purple-400 hover:bg-purple-50';
    };

    return (
        <motion.div
            draggable={!isPlaced}
            onDragStart={handleDragStart as any}
            onDragOver={handleDragOver as any}
            onDrop={onDrop as any}
            onClick={onClick}
            className={`
                px-4 py-3 rounded-lg border-2 font-medium text-gray-800 cursor-move
                transition-all duration-200 select-none
                ${getBackgroundColor()}
                ${isPlaced ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md active:scale-95'}
            `}
            initial={{ scale: 1 }}
            animate={{
                scale: isCorrect === false ? [1, 1.05, 0.95, 1.05, 1] : 1,
            }}
            transition={{
                duration: 0.4,
                ease: "easeInOut"
            }}
        >
            {word}
        </motion.div>
    );
};
