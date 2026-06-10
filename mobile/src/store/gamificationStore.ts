// Gamification Zustand store — XP, streak, badges

import { create } from 'zustand';
import * as gamificationApi from '../api/gamification';
import type { Badge, Leaderboard, LevelProgress, StreakInfo, UserStats } from '../types/gamification';

interface GamificationState {
  stats: UserStats | null;
  leaderboard: Leaderboard | null;
  badges: Badge[];
  levelProgress: LevelProgress | null;
  streak: StreakInfo | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchStats: () => Promise<void>;
  fetchLeaderboard: () => Promise<void>;
  fetchBadges: () => Promise<void>;
  fetchAll: () => Promise<void>;
  reset: () => void;
}

export const useGamificationStore = create<GamificationState>((set) => ({
  stats: null,
  leaderboard: null,
  badges: [],
  levelProgress: null,
  streak: null,
  isLoading: false,
  error: null,

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const stats = await gamificationApi.getUserStats();
      set({
        stats,
        levelProgress: stats.level_progress,
        streak: stats.streak_info,
        badges: stats.badges,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'İstatistikler alınamadı';
      set({ isLoading: false, error: message });
    }
  },

  fetchLeaderboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const leaderboard = await gamificationApi.getLeaderboard();
      set({ leaderboard, isLoading: false });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Sıralama alınamadı';
      set({ isLoading: false, error: message });
    }
  },

  fetchBadges: async () => {
    try {
      const badges = await gamificationApi.getUserBadges();
      set({ badges });
    } catch {
      // Sessiz hata
    }
  },

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const [stats, leaderboard] = await Promise.all([
        gamificationApi.getUserStats(),
        gamificationApi.getLeaderboard(),
      ]);
      set({
        stats,
        leaderboard,
        levelProgress: stats.level_progress,
        streak: stats.streak_info,
        badges: stats.badges,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Veriler alınamadı';
      set({ isLoading: false, error: message });
    }
  },

  reset: () =>
    set({
      stats: null,
      leaderboard: null,
      badges: [],
      levelProgress: null,
      streak: null,
      isLoading: false,
      error: null,
    }),
}));
