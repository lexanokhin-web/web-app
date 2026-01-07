import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, BookOpen, Lightbulb, AlertCircle } from 'lucide-react';

interface AIAdviceModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    advice: {
        explanation: string;
        rule: string;
        mnemonic?: string;
        tip?: string;
    } | null;
    isLoading: boolean;
}

export const AIAdviceModal: React.FC<AIAdviceModalProps> = ({
    isOpen,
    onClose,
    title,
    advice,
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
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 text-white flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <Sparkles className="w-6 h-6 animate-pulse" />
                                <h2 className="text-xl font-bold">{title}</h2>
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
                                    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-gray-500 font-medium">ИИ-репетитор анализирует...</p>
                                </div>
                            ) : advice ? (
                                <>
                                    {/* What's wrong? / Explanation */}
                                    <section>
                                        <div className="flex items-center space-x-2 text-blue-600 mb-2">
                                            <AlertCircle className="w-5 h-5" />
                                            <h3 className="font-bold">Что не так?</h3>
                                        </div>
                                        <div className="text-gray-700 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                                            {advice.explanation}
                                        </div>
                                    </section>

                                    {/* Rule */}
                                    <section>
                                        <div className="flex items-center space-x-2 text-cyan-600 mb-2">
                                            <BookOpen className="w-5 h-5" />
                                            <h3 className="font-bold">Правило</h3>
                                        </div>
                                        <div className="text-gray-700 bg-cyan-50/50 p-4 rounded-2xl border border-cyan-100 font-medium">
                                            {advice.rule}
                                        </div>
                                    </section>

                                    {/* Tip or Mnemonic */}
                                    {(advice.tip || advice.mnemonic) && (
                                        <section>
                                            <div className="flex items-center space-x-2 text-amber-600 mb-2">
                                                <Lightbulb className="w-5 h-5" />
                                                <h3 className="font-bold">Совет</h3>
                                            </div>
                                            <div className="text-gray-700 bg-amber-50/50 p-4 rounded-2xl border border-amber-100 text-sm italic">
                                                {advice.tip || advice.mnemonic}
                                            </div>
                                        </section>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-8 text-red-500">
                                    Не удалось получить совет от ИИ.
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-gray-50 border-t flex justify-center">
                            <button
                                onClick={onClose}
                                className="px-8 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-xl transition-all"
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
