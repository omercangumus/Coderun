'use client';

import { useQuery } from '@tanstack/react-query';
import { gamificationApi } from '@/lib/api/gamification-api';
import { QUERY_KEYS } from '@/lib/constants/api.constants';

export function useUserStats() {
  return useQuery({
    queryKey: QUERY_KEYS.userStats,
    queryFn: gamificationApi.getUserStats,
    staleTime: 2 * 60 * 1000,
  });
}

export function useLeaderboard(limit = 10) {
  return useQuery({
    queryKey: QUERY_KEYS.leaderboard(limit),
    queryFn: () => gamificationApi.getLeaderboard(limit),
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });
}

export function useStreak() {
  return useQuery({
    queryKey: QUERY_KEYS.streak,
    queryFn: gamificationApi.getStreak,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLevelProgress() {
  return useQuery({
    queryKey: QUERY_KEYS.levelProgress,
    queryFn: gamificationApi.getLevelProgress,
    staleTime: 2 * 60 * 1000,
  });
}

export function useBadges() {
  return useQuery({
    queryKey: QUERY_KEYS.badges,
    queryFn: gamificationApi.getBadges,
    staleTime: 5 * 60 * 1000,
  });
}
