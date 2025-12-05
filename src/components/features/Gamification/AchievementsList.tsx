import React from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle } from 'lucide-react';
import { useAchievements } from '../../../hooks/useAchievements';
import { GlassCard } from '../../GlassCard';

export const AchievementsList: React.FC = () => {
    const { achievements, unlockedIds, loading } = useAchievements();

    if (loading) {
        return <div className="text-center py-8">Загрузка достижений...</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => {
                const isUnlocked = unlockedIds.includes(achievement.id);

                return (
                    <GlassCard
                        key={achievement.id}
                        className={`p-4 flex items-center space-x-4 transition-all duration-300 ${isUnlocked ? 'bg-white/60 border-green-200' : 'bg-gray-100/40 opacity-70 grayscale'
                            }`}
                        animate={false}
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm ${isUnlocked ? 'bg-gradient-to-br from-yellow-200 to-orange-100' : 'bg-gray-200'
                            }`}>
                            {achievement.icon}
                        </div>

                        <div className="flex-1">
                            <h3 className={`font-bold ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                                {achievement.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {achievement.description}
                            </p>
                        </div>

                        <div>
                            {isUnlocked ? (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-green-500"
                                >
                                    <CheckCircle className="w-6 h-6" />
                                </motion.div>
                            ) : (
                                <Lock className="w-5 h-5 text-gray-400" />
                            )}
                        </div>
                    </GlassCard>
                );
            })}
        </div>
    );
};
