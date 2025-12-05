import { motion } from 'framer-motion';

interface WordBlockProps {
    word: string;
    index: number;
    onDragStart: (e: React.DragEvent, word: string, index: number) => void;
    onDrop: (e: React.DragEvent) => void;
    isPlaced?: boolean;
    isCorrect?: boolean | null;
    onClick?: () => void;
    isSelected?: boolean;
}

export const WordBlock: React.FC<WordBlockProps> = ({
    word,
    index,
    onDragStart,
    onDrop,
    isPlaced = false,
    isCorrect = null,
    onClick,
    isSelected = false
}) => {
    const handleDragStart = (e: React.DragEvent) => {
        onDragStart(e, word, index);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        // Prevent scrolling when touching word
        if (!isPlaced && onClick) {
            e.stopPropagation();
        }
    };

    const getBackgroundColor = () => {
        if (isCorrect === true) return 'bg-green-100 border-green-400';
        if (isCorrect === false) return 'bg-red-100 border-red-400';
        if (isPlaced) return 'bg-blue-50 border-blue-300';
        if (isSelected) return 'bg-purple-200 border-purple-500 shadow-lg ring-2 ring-purple-300';
        return 'bg-white border-gray-300 hover:border-purple-400 hover:bg-purple-50';
    };

    return (
        <motion.div
            draggable={!isPlaced}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onDragStart={handleDragStart as any}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onDragOver={handleDragOver as any}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onDrop={onDrop as any}
            onClick={onClick}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onTouchStart={handleTouchStart as any}
            className={`
                px-4 py-3 rounded-lg border-2 font-medium text-gray-800 cursor-pointer
                transition-all duration-200 select-none touch-none
                ${getBackgroundColor()}
                ${isPlaced ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md active:scale-95'}
                ${isSelected ? 'scale-105 z-10' : ''}
            `}
            initial={{ scale: 1 }}
            animate={{
                scale: isCorrect === false ? [1, 1.05, 0.95, 1.05, 1] : isSelected ? 1.05 : 1,
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
