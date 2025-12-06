import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../hooks/useProgress';
import { AchievementsList } from '../components/features/Gamification/AchievementsList';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { ArrowLeft, User, Calendar, Zap, BookOpen, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const { progress } = useProgress();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Пожалуйста, войдите в систему.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button onClick={() => navigate('/')} variant="secondary">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        На главную
                    </Button>
                    <Button onClick={signOut} variant="secondary" className="text-red-600 hover:bg-red-50">
                        Выйти
                    </Button>
                </div>

                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <GlassCard className="p-8">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                                {user.email?.[0].toUpperCase()}
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                    {user.user_metadata?.username || user.email?.split('@')[0]}
                                </h1>
                                <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2">
                                    <Calendar className="w-4 h-4" />
                                    С нами с {new Date(user.created_at).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="text-sm text-gray-500 mb-1">Текущий уровень</div>
                                <div className="text-4xl font-bold text-blue-600">{progress?.level || 1}</div>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <GlassCard className="p-4 text-center">
                        <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-800">{progress?.streak || 0}</div>
                        <div className="text-xs text-gray-500">Дней подряд</div>
                    </GlassCard>

                    <GlassCard className="p-4 text-center">
                        <Trophy className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-800">{Math.floor(progress?.xp || 0)}</div>
                        <div className="text-xs text-gray-500">Всего XP</div>
                    </GlassCard>

                    <GlassCard className="p-4 text-center">
                        <BookOpen className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-800">{progress?.learned_words?.length || 0}</div>
                        <div className="text-xs text-gray-500">Выучено слов</div>
                    </GlassCard>

                    <GlassCard className="p-4 text-center">
                        <User className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-800">#{progress?.level || 1}</div>
                        <div className="text-xs text-gray-500">Место в топе</div>
                    </GlassCard>
                </div>

                {/* Achievements Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
                        Достижения
                    </h2>
                    <AchievementsList />
                </motion.div>
            </div>
        </div>
    );
};
