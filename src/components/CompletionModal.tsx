import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { Button } from './Button';
import { Trophy, CheckCircle, RotateCcw, Home, ArrowRight } from 'lucide-react';

interface CompletionModalProps {
    title?: string;
    correctCount: number;
    incorrectCount: number;
    totalCount: number;
    onRestart?: () => void;
    onBack?: () => void;
    onNext?: () => void;
    restartLabel?: string;
    backLabel?: string;
    nextLabel?: string;
    showPercentage?: boolean;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
    title = 'Geschafft! 🎉',
    correctCount,
    incorrectCount,
    totalCount,
    onRestart,
    onBack,
    onNext,
    restartLabel = 'Nochmal üben',
    backLabel = 'Zurück',
    nextLabel = 'Weiter',
    showPercentage = true
}) => {
    const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    const isPerfect = percentage === 100;
    const isGood = percentage >= 70;

    const getIcon = () => {
        if (isPerfect) return <Trophy className="w-20 h-20 text-yellow-500" />;
        if (isGood) return <CheckCircle className="w-20 h-20 text-green-500" />;
        return <CheckCircle className="w-20 h-20 text-blue-500" />;
    };

    const getMessage = () => {
        if (isPerfect) return 'Perfekt! 🌟';
        if (isGood) return 'Super gemacht! 👏';
        return 'Gut geübt! 💪';
    };

    return (
        <div className="min-h-screen py-8 px-4 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full"
            >
                <GlassCard className="p-8 text-center">
                    {getIcon()}

                    <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-2">
                        {title}
                    </h2>
                    <p className="text-xl text-gray-600 mb-6">{getMessage()}</p>

                    {/* Score Display */}
                    <div className="flex justify-center gap-6 mb-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">{correctCount}</div>
                            <div className="text-sm text-gray-500">Richtig</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-red-500">{incorrectCount}</div>
                            <div className="text-sm text-gray-500">Falsch</div>
                        </div>
                        {showPercentage && (
                            <div className="text-center">
                                <div className={`text-3xl font-bold ${isPerfect ? 'text-yellow-500' : isGood ? 'text-green-600' : 'text-blue-600'}`}>
                                    {percentage}%
                                </div>
                                <div className="text-sm text-gray-500">Ergebnis</div>
                            </div>
                        )}
                    </div>

                    {/* Progress Circle */}
                    <div className="relative w-32 h-32 mx-auto mb-8">
                        <svg className="transform -rotate-90" width="128" height="128">
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="#e5e7eb"
                                strokeWidth="10"
                                fill="none"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke={isPerfect ? '#eab308' : isGood ? '#22c55e' : '#3b82f6'}
                                strokeWidth="10"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 56 * percentage / 100} ${2 * Math.PI * 56}`}
                                className="transition-all duration-1000"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold text-gray-800">
                                {correctCount}/{totalCount}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        {onRestart && (
                            <Button onClick={onRestart} variant="primary" className="w-full justify-center">
                                <RotateCcw className="w-5 h-5 mr-2" />
                                {restartLabel}
                            </Button>
                        )}
                        {onNext && (
                            <Button onClick={onNext} variant="primary" className="w-full justify-center">
                                {nextLabel}
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        )}
                        {onBack && (
                            <Button onClick={onBack} variant="secondary" className="w-full justify-center">
                                <Home className="w-5 h-5 mr-2" />
                                {backLabel}
                            </Button>
                        )}
                    </div>
                </GlassCard>
            </motion.div>
        </div>
    );
};
