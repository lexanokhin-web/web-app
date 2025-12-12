import React from 'react';

interface ScoreCounterProps {
    correct: number;
    incorrect: number;
    showPercentage?: boolean;
    className?: string;
}

export const ScoreCounter: React.FC<ScoreCounterProps> = ({
    correct,
    incorrect,
    showPercentage = false,
    className = ''
}) => {
    const total = correct + incorrect;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    return (
        <div className={`flex items-center gap-4 ${className}`}>
            <span className="text-green-600 font-semibold text-sm">
                ✓ {correct}
            </span>
            <span className="text-red-600 font-semibold text-sm">
                ✗ {incorrect}
            </span>
            {showPercentage && total > 0 && (
                <span className="text-blue-600 font-semibold text-sm">
                    {percentage}%
                </span>
            )}
        </div>
    );
};
