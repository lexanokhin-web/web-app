import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import { useProgress } from '../hooks/useProgress';
import { AchievementsList } from '../components/features/Gamification/AchievementsList';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { ArrowLeft, User, Calendar, Zap, BookOpen, Trophy, Volume2, VolumeX, Sparkles, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { AIService } from '../services/ai/AIService';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const { progress } = useProgress();
    const { isMuted, volume, toggleMute, setVolume } = useAudio();
    const [aiTip, setAiTip] = useLocalStorage<string>('ai_profile_tip', '');
    const [isLoadingTip, setIsLoadingTip] = React.useState(false);
    const [lastTipDate, setLastTipDate] = useLocalStorage<string>('ai_profile_tip_date', '');

    React.useEffect(() => {
        const fetchTip = async () => {
            const today = new Date().toDateString();
            if (progress && (lastTipDate !== today || !aiTip)) {
                setIsLoadingTip(true);
                try {
                    const tip = await AIService.getPersonalizedTip({
                        level: progress.level || 1,
                        xp: progress.xp || 0,
                        streak: progress.streak || 0,
                        learnedCount: progress.learned_words?.length || 0
                    });
                    if (tip) {
                        setAiTip(tip);
                        setLastTipDate(today);
                    }
                } catch (error) {
                    console.error('Failed to fetch AI tip:', error);
                } finally {
                    setIsLoadingTip(false);
                }
            }
        };

        fetchTip();
    }, [progress, aiTip, lastTipDate, setAiTip, setLastTipDate]);

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

                {/* AI Insights Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8"
                >
                    <GlassCard className="p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-200/50">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg">
                                <Brain className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-bold text-gray-800">AI-совет дня</h3>
                                    <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
                                </div>
                                {isLoadingTip ? (
                                    <div className="h-12 flex items-center">
                                        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                                        <p className="text-sm text-gray-400 italic font-medium">Ваш репетитор готовит совет...</p>
                                    </div>
                                ) : (
                                    <p className="text-gray-700 leading-relaxed font-medium">
                                        {aiTip || "Продолжай в том же духе! Каждый шаг приближает тебя к цели."}
                                    </p>
                                )}
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Audio Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                        {isMuted ? <VolumeX className="w-6 h-6 mr-2 text-gray-500" /> : <Volume2 className="w-6 h-6 mr-2 text-blue-500" />}
                        Настройки звука
                    </h2>
                    <GlassCard className="p-6">
                        <div className="space-y-6">
                            {/* Mute Toggle */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-semibold text-gray-800">Звуковые эффекты</div>
                                    <div className="text-sm text-gray-500">Включить звуки при выполнении заданий</div>
                                </div>
                                <button
                                    onClick={toggleMute}
                                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${isMuted ? 'bg-gray-300' : 'bg-blue-500'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isMuted ? 'translate-x-1' : 'translate-x-7'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Volume Slider */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="font-semibold text-gray-800">Громкость</label>
                                    <span className="text-sm text-gray-600">{Math.round(volume * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    disabled={isMuted}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                        background: isMuted
                                            ? '#e5e7eb'
                                            : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`
                                    }}
                                />
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

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
