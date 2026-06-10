// Gamification API fonksiyonları

import apiClient from './client';
import {
  LEADERBOARD,
  STATS,
  BADGES,
  LEVEL_PROGRESS,
  STREAK,
} from '../constants/api';
import type {
  Badge,
  Leaderboard,
  LevelProgress,
  StreakInfo,
  UserStats,
} from '../types/gamification';

export const getUserStats = async (): Promise<UserStats> => {
  const response = await apiClient.get<UserStats>(STATS);
  return response.data;
};

export const getLeaderboard = async (): Promise<Leaderboard> => {
  const response = await apiClient.get<Leaderboard>(LEADERBOARD);
  return response.data;
};

export const getUserBadges = async (): Promise<Badge[]> => {
  const response = await apiClient.get<Badge[]>(BADGES);
  return response.data;
};

export const getLevelProgress = async (): Promise<LevelProgress> => {
  const response = await apiClient.get<LevelProgress>(LEVEL_PROGRESS);
  return response.data;
};

export const getStreak = async (): Promise<StreakInfo> => {
  const response = await apiClient.get<StreakInfo>(STREAK);
  return response.data;
};
