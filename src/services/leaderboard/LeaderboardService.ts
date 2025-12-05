import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export interface LeaderboardEntry {
    user_id: string;
    username: string;
    total_xp: number;
    level: number;
    streak: number;
    avatar_url?: string;
}

export class LeaderboardService {
    static async getTopPlayers(limit: number = 10): Promise<LeaderboardEntry[]> {
        if (!isSupabaseConfigured()) return [];

        const { data, error } = await supabase!
            .from('leaderboard')
            .select('*')
            .order('total_xp', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }

        return data || [];
    }

    static async getUserRank(userId: string): Promise<number> {
        if (!isSupabaseConfigured()) return 0;

        // First get user's XP
        const { data: userStats } = await supabase!
            .from('leaderboard')
            .select('total_xp')
            .eq('user_id', userId)
            .single();

        if (!userStats) return 0;

        const { count, error } = await supabase!
            .from('leaderboard')
            .select('*', { count: 'exact', head: true })
            .gt('total_xp', userStats.total_xp);

        if (error) {
            console.error('Error fetching rank:', error);
            return 0;
        }

        return (count || 0) + 1;
    }
}
