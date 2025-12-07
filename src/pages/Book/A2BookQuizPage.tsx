import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Trophy, Home, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useA2Quiz } from '../../hooks/useA2Quiz';
import { A2QuizQuestionCard } from './A2QuizQuestionCard';

export const A2BookQuizPage: React.FC = () => {
    const navigate = useNavigate();
    const { state, startQuiz, submitAnswer, nextQuestion } = useA2Quiz();

    // 1. Loading State
    if (state.status === 'loading') {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md space-y-4 text-center">
                    <h2 className="text-xl font-semibold text-slate-700">Prüfung wird vorbereitet...</h2>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${state.loadingProgress}%` }}
                        ></div>
                    </div>
                    <p className="text-slate-500 text-sm">Zufällige Fragen werden ausgewählt...</p>
                </div>
            </div>
        );
    }

    // 2. Start Screen
    if (state.status === 'idle') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center space-y-6"
                >
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <Trophy className="w-10 h-10 text-blue-600" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-slate-800">A2 Abschlusstest</h1>
                        <p className="text-slate-600 text-lg">
                            Sind Sie bereit für die Prüfung?
                        </p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-6 text-left space-y-3 border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">1</div>
                            <p className="text-slate-700">10 zufällige Fragen aus dem ganzen Buch.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">2</div>
                            <p className="text-slate-700">Jede Frage kommt aus einem anderen Kapitel.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">3</div>
                            <p className="text-slate-700">Sofortiges Feedback nach jeder Antwort.</p>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => navigate('/a2-book')}
                            className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                        >
                            Zurück
                        </button>
                        <button
                            onClick={startQuiz}
                            className="flex-[2] px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                        >
                            Test starten
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // 3. Result Screen
    if (state.status === 'finished') {
        const percentage = Math.round((state.score / state.questions.length) * 100);

        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center space-y-8"
                >
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-800">Testergebnis</h2>
                        <div className="relative inline-flex items-center justify-center">
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle
                                    className="text-slate-100"
                                    strokeWidth="8"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="58"
                                    cx="64"
                                    cy="64"
                                />
                                <circle
                                    className={`${percentage >= 80 ? 'text-green-500' : percentage >= 50 ? 'text-blue-500' : 'text-red-500'} transition-all duration-1000 ease-out`}
                                    strokeWidth="8"
                                    strokeDasharray={365}
                                    strokeDashoffset={365 - (365 * percentage) / 100}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="58"
                                    cx="64"
                                    cy="64"
                                />
                            </svg>
                            <span className="absolute text-3xl font-bold text-slate-800">{percentage}%</span>
                        </div>
                        <p className="text-slate-600">
                            Sie haben {state.score} von {state.questions.length} Fragen richtig beantwortet.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={startQuiz}
                            className="w-full px-6 py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Neuer Test
                        </button>
                        <button
                            onClick={() => navigate('/a2-book')}
                            className="w-full px-6 py-4 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Home className="w-5 h-5" />
                            Zurück zur Übersicht
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // 4. Game Screen
    const currentQ = state.questions[state.currentIndex];

    return (
        <div className="min-h-screen bg-slate-50 p-4 pb-32">
            {/* Header */}
            <div className="max-w-2xl mx-auto mb-8 flex items-center justify-between">
                <button
                    onClick={() => navigate('/a2-book')}
                    className="p-2 hover:bg-white rounded-lg transition-colors text-slate-500"
                >
                    <X className="w-6 h-6" />
                </button>
                <div className="flex-1 mx-4">
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${((state.currentIndex + 1) / state.questions.length) * 100}%` }}
                        />
                    </div>
                </div>
                <span className="text-sm font-medium text-slate-500 whitespace-nowrap">
                    {state.currentIndex + 1} / {state.questions.length}
                </span>
            </div>

            {/* Question Card */}
            <div className="max-w-2xl mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQ.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
                    >
                        <A2QuizQuestionCard
                            question={currentQ}
                            onComplete={submitAnswer}
                            onNext={nextQuestion}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
