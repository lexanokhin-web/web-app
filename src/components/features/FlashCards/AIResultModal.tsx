import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, BookOpen, Repeat, Lightbulb } from 'lucide-react';
import type { AIExplanation } from '../../../services/ai/AIService';

interface AIResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    word: string;
    explanation: AIExplanation | null;
    isLoading: boolean;
}

export const AIResultModal: React.FC<AIResultModalProps> = ({
    isOpen,
    onClose,
    word,
    explanation,
    isLoading
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <Sparkles className="w-6 h-6 animate-pulse" />
                                <h2 className="text-xl font-bold">AI Помощник: {word}</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-gray-500 font-medium">DeepSeek думает...</p>
                                </div>
                            ) : explanation ? (
                                <>
                                    {/* Meaning */}
                                    <section>
                                        <div className="flex items-center space-x-2 text-indigo-600 mb-2">
                                            <BookOpen className="w-5 h-5" />
                                            <h3 className="font-bold">Значение</h3>
                                        </div>
                                        <p className="text-gray-700 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                                            {explanation.meaning}
                                        </p>
                                    </section>

                                    {/* Synonyms */}
                                    <section>
                                        <div className="flex items-center space-x-2 text-purple-600 mb-2">
                                            <Repeat className="w-5 h-5" />
                                            <h3 className="font-bold">Синонимы</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {explanation.synonyms.map((s, i) => (
                                                <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-sm">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Examples */}
                                    <section>
                                        <div className="flex items-center space-x-2 text-teal-600 mb-2">
                                            <Sparkles className="w-5 h-5" />
                                            <h3 className="font-bold">Примеры использования</h3>
                                        </div>
                                        <ul className="space-y-2">
                                            {explanation.examples.map((ex, i) => (
                                                <li key={i} className="text-gray-700 bg-teal-50/50 p-3 rounded-xl border border-teal-100 text-sm italic">
                                                    "{ex}"
                                                </li>
                                            ))}
                                        </ul>
                                    </section>

                                    {/* Usage Tips */}
                                    <section>
                                        <div className="flex items-center space-x-2 text-amber-600 mb-2">
                                            <Lightbulb className="w-5 h-5" />
                                            <h3 className="font-bold">Советы</h3>
                                        </div>
                                        <p className="text-gray-700 bg-amber-50/50 p-4 rounded-2xl border border-amber-100 text-sm">
                                            {explanation.usage_tips}
                                        </p>
                                    </section>
                                </>
                            ) : (
                                <div className="text-center py-8 text-red-500">
                                    Не удалось получить ответ от AI. Проверьте API ключ.
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-gray-50 border-t flex justify-center">
                            <button
                                onClick={onClose}
                                className="px-8 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"
                            >
                                Понятно
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
