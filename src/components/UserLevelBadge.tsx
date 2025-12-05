import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';

export const UserLevelBadge: React.FC = () => {
    const { progress, loading } = useProgress();

    if (loading || !progress) return null;

    // Calculate progress to next level
    // Formula: Level = 1 + sqrt(XP / 100)
    // XP for current level = (Level - 1)^2 * 100
    // XP for next level = Level^2 * 100
    const currentLevelXP = Math.pow(progress.level - 1, 2) * 100;
    const nextLevelXP = Math.pow(progress.level, 2) * 100;
    const levelProgress = ((progress.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

    return (
        <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/50">
            <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {progress.level}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-[10px] text-white px-1.5 rounded-full border border-white">
                    LVL
                </div>
            </div>

            <div className="flex flex-col">
                <div className="flex items-center justify-between text-xs mb-1 min-w-[100px]">
                    <span className="font-bold text-gray-700 flex items-center">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                        {Math.floor(progress.xp)} XP
                    </span>
                    <span className="text-gray-500">
                        {Math.floor(nextLevelXP - progress.xp)} до след.
                    </span>
                </div>
                <div className="h-2 w-28 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, Math.max(0, levelProgress))}%` }}
                        transition={{ duration: 1 }}
                    />
                </div>
            </div>
        </div>
    );
};
