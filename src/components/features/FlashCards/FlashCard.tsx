import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { SpeakButton } from '../../SpeakButton';
import { Check, X, RotateCcw } from 'lucide-react';

interface FlashCardProps {
    word: string;
    translation: string;
    example?: string;
    onKnown: () => void;
    onUnknown: () => void;
}

export const FlashCard: React.FC<FlashCardProps> = ({
    word,
    translation,
    example,
    onKnown,
    onUnknown
}) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);

    const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 100;

        if (info.offset.x > threshold) {
            // Swipe right - Знаю
            setDragDirection('right');
            setTimeout(() => {
                onKnown();
                setDragDirection(null);
                setIsFlipped(false);
            }, 300);
        } else if (info.offset.x < -threshold) {
            // Swipe left - Не знаю
            setDragDirection('left');
            setTimeout(() => {
                onUnknown();
                setDragDirection(null);
                setIsFlipped(false);
            }, 300);
        }
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div className="relative w-full max-w-md mx-auto">
            {/* Swipe Indicators */}
            <div className="absolute inset-0 flex justify-between items-center pointer-events-none z-0">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{
                        opacity: dragDirection === 'right' ? 1 : 0,
                        x: dragDirection === 'right' ? 0 : -50
                    }}
                    className="flex items-center space-x-2 text-green-500 font-bold text-xl"
                >
                    <Check className="w-8 h-8" />
                    <span>Знаю!</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{
                        opacity: dragDirection === 'left' ? 1 : 0,
                        x: dragDirection === 'left' ? 0 : 50
                    }}
                    className="flex items-center space-x-2 text-red-500 font-bold text-xl"
                >
                    <span>Повторить</span>
                    <X className="w-8 h-8" />
                </motion.div>
            </div>

            {/* Card */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={handleDragEnd}
                whileTap={{ cursor: 'grabbing' }}
                className="relative"
                style={{ perspective: 1000 }}
            >
                <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="relative w-full h-96 cursor-pointer"
                    onClick={handleFlip}
                >
                    {/* Front Side */}
                    <div
                        className="absolute inset-0 backface-hidden"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        <div className="h-full w-full bg-gradient-to-br from-blue-400 to-purple-600 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center text-white">
                            <div className="flex items-center space-x-4 mb-4">
                                <h2 className="text-5xl font-bold">{word}</h2>
                                <SpeakButton text={word} size="lg" />
                            </div>

                            {example && (
                                <p className="text-lg text-white/80 italic text-center mt-4">
                                    "{example}"
                                </p>
                            )}

                            <div className="mt-8 text-sm text-white/60">
                                👆 Tap to flip
                            </div>
                        </div>
                    </div>

                    {/* Back Side */}
                    <div
                        className="absolute inset-0 backface-hidden"
                        style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)'
                        }}
                    >
                        <div className="h-full w-full bg-gradient-to-br from-green-400 to-teal-600 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center text-white">
                            <RotateCcw className="w-8 h-8 mb-4 opacity-60" />
                            <h2 className="text-4xl font-bold mb-2">{translation}</h2>

                            {example && (
                                <div className="mt-8">
                                    <p className="text-sm text-white/60 mb-2">Пример:</p>
                                    <p className="text-lg text-white/90 italic text-center">
                                        "{example}"
                                    </p>
                                    <SpeakButton text={example} size="md" className="mt-4 mx-auto" />
                                </div>
                            )}

                            <div className="mt-8 text-sm text-white/60">
                                👆 Tap to flip back
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Action Buttons (альтернатива swipe) */}
            <div className="flex justify-center space-x-4 mt-6">
                <motion.button
                    onClick={() => {
                        onUnknown();
                        setIsFlipped(false);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg flex items-center space-x-2"
                >
                    <X className="w-5 h-5" />
                    <span>Повторить</span>
                </motion.button>

                <motion.button
                    onClick={() => {
                        onKnown();
                        setIsFlipped(false);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg flex items-center space-x-2"
                >
                    <Check className="w-5 h-5" />
                    <span>Знаю</span>
                </motion.button>
            </div>

            {/* Swipe Hint */}
            <div className="text-center mt-4 text-gray-500 text-sm">
                💡 Свайп влево - не знаю, вправо - знаю
            </div>
        </div>
    );
};
