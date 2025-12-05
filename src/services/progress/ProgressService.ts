import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export interface UserProgress {
    userId: string;
    xp: number;
    level: number;
    streak: number;
    lastActivityDate: Date;
    lessonsCompleted: number;
    wordsLearned: number;
    learned_words?: string[]; // Array of learned word IDs
}

export class ProgressService {
    private static STORAGE_KEY = 'user_progress_local';

    /**
     * Рассчитать уровень на основе XP
     * Формула: Level = 1 + sqrt(XP / 100)
     */
    static calculateLevel(xp: number): number {
        return Math.floor(1 + Math.sqrt(xp / 100));
    }

    /**
     * Получить прогресс пользователя
     */
    static async getProgress(userId?: string): Promise<UserProgress> {
        if (isSupabaseConfigured() && userId) {
            const { data, error } = await supabase!
                .from('user_progress')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (data) {
                return {
                    userId: data.user_id,
                    xp: data.xp,
                    level: data.level,
                    streak: data.streak,
                    lastActivityDate: new Date(data.last_activity_date),
                    lessonsCompleted: data.lessons_completed,
                    wordsLearned: data.words_learned,
                    learned_words: data.learned_words || []
                };
            }
        }

        return this.getLocalProgress();
    }

    /**
     * Добавить XP пользователю
     */
    static async addXP(amount: number, userId?: string): Promise<UserProgress> {
        const current = await this.getProgress(userId);
        const newXP = current.xp + amount;
        const newLevel = this.calculateLevel(newXP);
        const now = new Date();

        // Проверка стрика (если активность была вчера - увеличить, если сегодня - оставить, иначе сбросить)
        // Упрощенная логика для демо
        const lastDate = new Date(current.lastActivityDate);
        const isToday = now.toDateString() === lastDate.toDateString();
        const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === lastDate.toDateString();

        let newStreak = current.streak;
        if (!isToday) {
            if (isYesterday) {
                newStreak += 1;
            } else if (current.streak > 0) {
                // Если пропустил день - сброс (или можно сделать заморозку)
                // Пока оставим как есть или сбросим
                // newStreak = 1; 
            }
        }

        const updates = {
            xp: newXP,
            level: newLevel,
            streak: newStreak,
            last_activity_date: new Date().toISOString()
        };

        if (isSupabaseConfigured() && userId) {
            const { error } = await supabase!
                .from('user_progress')
                .upsert({
                    user_id: userId,
                    ...updates
                });

            if (error) console.error('Error updating progress:', error);
        }

        const updatedProgress = {
            ...current,
            xp: newXP,
            level: newLevel,
            streak: newStreak,
            lastActivityDate: new Date()
        };

        this.saveLocalProgress(updatedProgress);
        return updatedProgress;
    }

    // Private helpers
    private static getLocalProgress(): UserProgress {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (data) {
            const parsed = JSON.parse(data);
            return {
                ...parsed,
                lastActivityDate: new Date(parsed.lastActivityDate)
            };
        }
        return {
            userId: 'local',
            xp: 0,
            level: 1,
            streak: 0,
            lastActivityDate: new Date(),
            lessonsCompleted: 0,
            wordsLearned: 0
        };
    }

    private static saveLocalProgress(progress: UserProgress) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
    }
}
