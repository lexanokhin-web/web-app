import React, { useState } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
import type { QuizItem } from '../../hooks/useB1Quiz';

interface QuizQuestionCardProps {
    question: QuizItem;
    onComplete: (answer: string) => void;
    onNext: () => void;
}

export const QuizQuestionCard: React.FC<QuizQuestionCardProps> = ({ question, onComplete, onNext }) => {
    const [input, setInput] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        setIsSubmitted(true);
        onComplete(input);
    };

    const isCorrect = input.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-full">
            {/* Chapter Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-2 text-sm text-slate-500 font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                {question.chapterTitle}
            </div>

            <div className="p-6 md:p-8 space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-slate-800">
                        {question.instruction}
                    </h3>
                    <div className="p-6 bg-blue-50 rounded-xl text-blue-900 text-xl font-medium leading-relaxed">
                        {question.prompt}
                    </div>
                </div>

                {!isSubmitted ? (
                    <form onSubmit={handleSubmit}>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ihre Antwort..."
                                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-lg"
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-200"
                            >
                                Prüfen
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className={`rounded-xl p-6 border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {isCorrect ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                            </div>
                            <div className="flex-1 space-y-1">
                                <h4 className={`font-bold text-lg ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                                    {isCorrect ? 'Richtig!' : 'Leider falsch'}
                                </h4>
                                {!isCorrect && (
                                    <div className="text-red-700">
                                        Richtige Lösung: <span className="font-bold">{question.correctAnswer}</span>
                                    </div>
                                )}
                                {isCorrect && (
                                    <div className="text-green-700">
                                        Ihre Antwort: <span className="font-bold">{input}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={onNext}
                            className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${isCorrect
                                ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200'
                                : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200'
                                }`}
                        >
                            Nächste Frage
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
