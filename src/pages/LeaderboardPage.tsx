import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LeaderboardService } from '../services/leaderboard/LeaderboardService';
import type { LeaderboardEntry } from '../services/leaderboard/LeaderboardService';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { ArrowLeft, Trophy, Medal, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

export const LeaderboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
    const [userRank, setUserRank] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const loadLeaderboard = useCallback(async () => {
        setLoading(true);
        try {
            const topPlayers = await LeaderboardService.getTopPlayers(10);
            setLeaders(topPlayers);

            if (user) {
                const rank = await LeaderboardService.getUserRank(user.id);
                setUserRank(rank);
            }
        } catch (error) {
            console.error('Failed to load leaderboard', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadLeaderboard();
    }, [loadLeaderboard]);

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0: return <Crown className="w-6 h-6 text-yellow-500" />;
            case 1: return <Medal className="w-6 h-6 text-gray-400" />;
            case 2: return <Medal className="w-6 h-6 text-orange-500" />;
            default: return <span className="font-bold text-gray-500 w-6 text-center">{index + 1}</span>;
        }
    };

    return (
        <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <Button onClick={() => navigate('/')} variant="secondary">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Назад
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-800 ml-4 flex items-center">
                        <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
                        Топ Учеников
                    </h1>
                </div>

                {/* User's Rank Card (if logged in) */}
                {user && userRank && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <GlassCard className="p-4 bg-blue-50 border-blue-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
                                        #{userRank}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800">Вы</div>
                                        <div className="text-sm text-gray-600">Ваше текущее место</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {/* XP would be nice here, but we need to fetch it or pass it */}
                                    <span className="text-blue-600 font-bold">Продолжайте учиться!</span>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}

                {/* Leaderboard List */}
                <div className="space-y-3">
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Загрузка рейтинга...</div>
                    ) : leaders.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">Пока нет данных. Станьте первым!</div>
                    ) : (
                        leaders.map((player, index) => (
                            <motion.div
                                key={player.user_id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <GlassCard className={`p-4 flex items-center ${player.user_id === user?.id ? 'border-2 border-blue-400' : ''}`}>
                                    <div className="mr-4 flex-shrink-0">
                                        {getRankIcon(index)}
                                    </div>

                                    <div className="flex-1 flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-700 font-bold">
                                            {player.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800">
                                                {player.username}
                                                {player.user_id === user?.id && <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Вы</span>}
                                            </div>
                                            <div className="text-xs text-gray-500">Уровень {player.level}</div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="font-bold text-indigo-600">{player.total_xp} XP</div>
                                        <div className="text-xs text-gray-500">🔥 {player.streak} дн.</div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
