import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export interface AchievementStats {
    lessons_completed: number;
    quizzes_completed: number;
    perfect_quizzes: number;
    words_learned: number;
    streak: number;
    level: number;
    [key: string]: unknown;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string; // Lucide icon name or emoji
    condition: (stats: AchievementStats) => boolean;
}

export const ACHIEVEMENTS_LIST: Achievement[] = [
    {
        id: 'first_steps',
        title: 'Первые шаги',
        description: 'Завершите свой первый урок или квиз',
        icon: '👣',
        condition: (stats) => stats.lessons_completed > 0 || stats.quizzes_completed > 0
    },
    {
        id: 'quiz_master',
        title: 'Мастер Квизов',
        description: 'Наберите 100% правильных ответов в квизе',
        icon: '🎯',
        condition: (stats) => stats.perfect_quizzes > 0
    },
    {
        id: 'vocab_builder',
        title: 'Словарный запас',
        description: 'Выучите 50 новых слов',
        icon: '📚',
        condition: (stats) => stats.words_learned >= 50
    },
    {
        id: 'streak_3',
        title: 'Постоянство',
        description: 'Занимайтесь 3 дня подряд',
        icon: '🔥',
        condition: (stats) => stats.streak >= 3
    },
    {
        id: 'level_5',
        title: 'Пятый уровень',
        description: 'Достигните 5 уровня',
        icon: '⭐',
        condition: (stats) => stats.level >= 5
    }
];

export class AchievementsService {
    static async getUnlockedAchievements(userId: string): Promise<string[]> {
        if (!userId || !isSupabaseConfigured()) return [];

        const { data, error } = await supabase!
            .from('achievements')
            .select('achievement_id')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching achievements:', error);
            return [];
        }

        return data.map(a => a.achievement_id);
    }

    static async checkAndUnlock(userId: string, stats: AchievementStats): Promise<string[]> {
        if (!userId || !isSupabaseConfigured()) return [];

        const unlockedIds = await this.getUnlockedAchievements(userId);
        const newUnlocks: string[] = [];

        for (const achievement of ACHIEVEMENTS_LIST) {
            if (!unlockedIds.includes(achievement.id)) {
                if (achievement.condition(stats)) {
                    // Unlock!
                    const { error } = await supabase!
                        .from('achievements')
                        .insert({
                            user_id: userId,
                            achievement_id: achievement.id
                        });

                    if (!error) {
                        newUnlocks.push(achievement.id);
                    } else {
                        console.error(`Error unlocking achievement ${achievement.id}:`, error);
                    }
                }
            }
        }

        return newUnlocks;
    }
}
