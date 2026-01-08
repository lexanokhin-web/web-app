import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, BookOpen, Lightbulb, AlertCircle, Zap, ChevronDown } from 'lucide-react';
import { AIService } from '../../../services/ai/AIService';

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
    // Данные для глубокого анализа
    context?: string;
    topic?: string;
}

export const AIAdviceModal: React.FC<AIAdviceModalProps> = ({
    isOpen,
    onClose,
    title,
    advice,
    isLoading,
    context,
    topic
}) => {
    const [deepAnalysis, setDeepAnalysis] = useState<string | null>(null);
    const [isDeepLoading, setIsDeepLoading] = useState(false);

    // Сброс состояния при закрытии
    useEffect(() => {
        if (!isOpen) {
            setDeepAnalysis(null);
            setIsDeepLoading(false);
        }
    }, [isOpen]);

    // Prevent scrolling on the body when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleDeepAnalysis = async () => {
        if (!context || !topic) return;
        setIsDeepLoading(true);
        try {
            const result = await AIService.getDeepAnalysis(context, topic);
            setDeepAnalysis(result);
        } catch (error) {
            console.error('Deep Analysis Error:', error);
        } finally {
            setIsDeepLoading(false);
        }
    };

    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <AnimatePresence mode="wait">
                <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-lg bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[90vh] pointer-events-auto"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-4 sm:p-5 text-white flex justify-between items-center flex-shrink-0">
                            <div className="flex items-center space-x-3">
                                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                                <h2 className="text-lg sm:text-xl font-bold">{title}</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 min-h-0">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-gray-500 font-medium font-inter text-center">ИИ-репетитор анализирует...</p>
                                </div>
                            ) : advice ? (
                                <div className="space-y-6">
                                    {/* Normal Advice Content */}
                                    <div className="space-y-6">
                                        <section>
                                            <div className="flex items-center space-x-2 text-blue-600 mb-2">
                                                <AlertCircle className="w-5 h-5" />
                                                <h3 className="font-bold">Что не так?</h3>
                                            </div>
                                            <div className="text-gray-700 bg-blue-50/50 p-4 rounded-2xl border border-blue-100 leading-relaxed font-inter">
                                                {advice.explanation}
                                            </div>
                                        </section>

                                        <section>
                                            <div className="flex items-center space-x-2 text-cyan-600 mb-2">
                                                <BookOpen className="w-5 h-5" />
                                                <h3 className="font-bold">Правило</h3>
                                            </div>
                                            <div className="text-gray-700 bg-cyan-50/50 p-4 rounded-2xl border border-cyan-100 font-medium font-inter">
                                                {advice.rule}
                                            </div>
                                        </section>

                                        {(advice.tip || advice.mnemonic) && (
                                            <section>
                                                <div className="flex items-center space-x-2 text-amber-600 mb-2">
                                                    <Lightbulb className="w-5 h-5" />
                                                    <h3 className="font-bold">Совет</h3>
                                                </div>
                                                <div className="text-gray-700 bg-amber-50/50 p-4 rounded-2xl border border-amber-100 text-sm italic font-inter">
                                                    {advice.tip || advice.mnemonic}
                                                </div>
                                            </section>
                                        )}
                                    </div>

                                    {/* Deep Analysis Result */}
                                    {deepAnalysis && (
                                        <motion.section
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="pt-6 border-t border-dashed border-gray-200"
                                        >
                                            <div className="flex items-center space-x-2 text-purple-600 mb-3">
                                                <Zap className="w-5 h-5" />
                                                <h3 className="font-bold text-lg">Глубокий анализ AI (R1)</h3>
                                            </div>
                                            <div className="prose prose-sm max-w-none text-gray-700 bg-purple-50/50 p-5 rounded-2xl border border-purple-100 font-inter leading-relaxed whitespace-pre-wrap">
                                                {deepAnalysis}
                                            </div>
                                        </motion.section>
                                    )}

                                    {isDeepLoading && (
                                        <div className="flex flex-col items-center justify-center p-8 space-y-3 bg-purple-50/30 rounded-2xl border border-dashed border-purple-200">
                                            <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-purple-600 text-sm font-medium animate-pulse">Глубоко анализируем нюансы...</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-red-500 font-inter">
                                    Не удалось получить совет от ИИ.
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-gray-50/80 backdrop-blur-sm border-t flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
                            {!deepAnalysis && !isDeepLoading && advice && (
                                <button
                                    onClick={handleDeepAnalysis}
                                    className="flex items-center justify-center gap-2 px-6 py-2 bg-white border-2 border-purple-200 text-purple-600 rounded-xl text-sm font-bold hover:bg-purple-50 transition-all active:scale-95"
                                >
                                    <Sparkles className="w-4 h-4 text-purple-500" />
                                    Глубокий анализ AI
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="w-full sm:flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-xl transition-all active:scale-95"
                            >
                                Понятно
                            </button>
                        </div>
                    </motion.div>
                </div>
            </AnimatePresence>
        </div>
    );

    const target = document.getElementById('modal-root') || document.body;
    return createPortal(modalContent, target);
};
