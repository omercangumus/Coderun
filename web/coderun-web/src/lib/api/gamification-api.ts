import axiosClient from './axios-client';
import { GAMIFICATION_ENDPOINTS } from '@/lib/constants/api.constants';
import type {
  UserStatsResponse,
  LeaderboardResponse,
  LevelProgressResponse,
  StreakResponse,
  BadgeResponse,
} from '@/lib/types/gamification.types';

export const gamificationApi = {
  async getUserStats(): Promise<UserStatsResponse> {
    const response = await axiosClient.get(GAMIFICATION_ENDPOINTS.stats);
    const raw = response.data;
    return {
      totalXp: raw.total_xp,
      level: raw.level,
      streak: raw.streak,
      totalLessonsCompleted: raw.total_lessons_completed,
      totalModulesCompleted: raw.total_modules_completed,
      badges: (raw.badges ?? []).map(mapBadge),
      levelProgress: mapLevelProgress(raw.level_progress),
      streakInfo: mapStreakInfo(raw.streak_info),
    };
  },

  async getLeaderboard(limit = 10): Promise<LeaderboardResponse> {
    const response = await axiosClient.get(GAMIFICATION_ENDPOINTS.leaderboard, {
      params: { limit },
    });
    const raw = response.data;
    return {
      entries: (raw.entries ?? []).map(mapLeaderboardEntry),
      totalCount: raw.total_count,
      userRank: raw.user_rank ?? null,
      weekStart: raw.week_start,
      weekEnd: raw.week_end,
    };
  },

  async getLevelProgress(): Promise<LevelProgressResponse> {
    const response = await axiosClient.get(GAMIFICATION_ENDPOINTS.levelProgress);
    return mapLevelProgress(response.data);
  },

  async getStreak(): Promise<StreakResponse> {
    const response = await axiosClient.get(GAMIFICATION_ENDPOINTS.streak);
    return mapStreakInfo(response.data);
  },

  async getBadges(): Promise<BadgeResponse[]> {
    const response = await axiosClient.get(GAMIFICATION_ENDPOINTS.badges);
    return (response.data ?? []).map(mapBadge);
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBadge(raw: any): BadgeResponse {
  return {
    id: raw.id,
    badgeType: raw.badge_type,
    earnedAt: raw.earned_at,
    title: raw.title,
    description: raw.description,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapLevelProgress(raw: any): LevelProgressResponse {
  return {
    currentLevel: raw.current_level,
    currentXp: raw.current_xp,
    xpNeededForNext: raw.xp_needed_for_next,
    xpRemaining: raw.xp_remaining,
    progressPercentage: raw.progress_percentage,
    isMaxLevel: raw.is_max_level,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapStreakInfo(raw: any): StreakResponse {
  return {
    currentStreak: raw.current_streak,
    lastActiveDate: raw.last_active_date ?? null,
    isAlive: raw.is_alive,
    nextMilestone: raw.next_milestone,
    daysToNextMilestone: raw.days_to_next_milestone,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapLeaderboardEntry(raw: any) {
  return {
    rank: raw.rank,
    userId: raw.user_id,
    username: raw.username,
    weeklyXp: raw.weekly_xp,
    level: raw.level,
    streak: raw.streak,
  };
}
