import React from 'react';
import { motion } from 'framer-motion';

interface DifficultyLevel {
    id: string;
    label: string;
    count: number;
    color: {
        active: string;
        inactive: string;
    };
}

interface DifficultySelectorProps {
    levels: DifficultyLevel[];
    selected: string;
    onChange: (level: string) => void;
    className?: string;
}

const defaultLevels: DifficultyLevel[] = [
    {
        id: 'all',
        label: 'Alle',
        count: 0,
        color: {
            active: 'bg-gradient-to-r from-gray-500 to-gray-700 text-white',
            inactive: 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }
    },
    {
        id: 'easy',
        label: 'Leicht',
        count: 0,
        color: {
            active: 'bg-gradient-to-r from-green-500 to-green-700 text-white',
            inactive: 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-300'
        }
    },
    {
        id: 'medium',
        label: 'Mittel',
        count: 0,
        color: {
            active: 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white',
            inactive: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-300'
        }
    },
    {
        id: 'hard',
        label: 'Schwer',
        count: 0,
        color: {
            active: 'bg-gradient-to-r from-red-500 to-red-700 text-white',
            inactive: 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-300'
        }
    }
];

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
    levels = defaultLevels,
    selected,
    onChange,
    className = ''
}) => {
    return (
        <div className={`grid grid-cols-4 gap-2 ${className}`}>
            {levels.map((level) => {
                const isActive = selected === level.id;
                return (
                    <motion.button
                        key={level.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onChange(level.id)}
                        className={`relative px-3 py-3 rounded-xl font-semibold text-sm transition-all ${isActive
                                ? `${level.color.active} shadow-lg`
                                : level.color.inactive
                            }`}
                    >
                        <div>{level.label}</div>
                        {level.count > 0 && (
                            <div className={`text-xs mt-1 ${isActive ? 'text-white/80' : 'opacity-60'}`}>
                                {level.count} Aufgaben
                            </div>
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
};

export { defaultLevels };
export type { DifficultyLevel };
