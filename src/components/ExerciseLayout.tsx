import React from 'react';
import { motion } from 'framer-motion';
import { ExerciseHeader } from './ExerciseHeader';
import { ProgressBar } from './ProgressBar';
import { ScoreCounter } from './ScoreCounter';

interface ExerciseLayoutProps {
    title: string;
    subtitle?: string;
    backPath?: string;
    onBack?: () => void;
    currentIndex: number;
    totalCount: number;
    correctCount: number;
    incorrectCount: number;
    progressColor?: 'cyan' | 'green' | 'purple' | 'orange' | 'blue';
    showScore?: boolean;
    children: React.ReactNode;
}

export const ExerciseLayout: React.FC<ExerciseLayoutProps> = ({
    title,
    subtitle,
    backPath,
    onBack,
    currentIndex,
    totalCount,
    correctCount,
    incorrectCount,
    progressColor = 'purple',
    showScore = true,
    children
}) => {

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <ExerciseHeader
                    title={title}
                    subtitle={subtitle || `Übung ${currentIndex + 1} / ${totalCount}`}
                    backPath={backPath}
                    onBack={onBack}
                    rightContent={showScore && (
                        <ScoreCounter correct={correctCount} incorrect={incorrectCount} />
                    )}
                />

                {/* Progress Bar */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <ProgressBar
                        current={currentIndex + 1}
                        total={totalCount}
                        color={progressColor}
                    />
                </motion.div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {children}
                </motion.div>
            </div>
        </div>
    );
};
