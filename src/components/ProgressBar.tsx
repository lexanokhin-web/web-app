import React from 'react';

interface ProgressBarProps {
    current: number;
    total: number;
    color?: 'cyan' | 'green' | 'purple' | 'orange' | 'blue';
    showLabel?: boolean;
    className?: string;
}

const colorClasses = {
    cyan: 'from-cyan-500 to-teal-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-orange-500 to-red-500',
    blue: 'from-blue-500 to-indigo-500'
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
    current,
    total,
    color = 'cyan',
    showLabel = false,
    className = ''
}) => {
    const percentage = total > 0 ? (current / total) * 100 : 0;

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {showLabel && (
                <span className="text-sm text-gray-600 whitespace-nowrap">
                    {current} / {total}
                </span>
            )}
        </div>
    );
};
