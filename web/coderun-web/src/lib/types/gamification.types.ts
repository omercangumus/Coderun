export interface LevelProgressResponse {
  currentLevel: number;
  currentXp: number;
  xpNeededForNext: number;
  xpRemaining: number;
  progressPercentage: number;
  isMaxLevel: boolean;
}

export interface StreakResponse {
  currentStreak: number;
  lastActiveDate: string | null;
  isAlive: boolean;
  nextMilestone: number;
  daysToNextMilestone: number;
}

export interface BadgeResponse {
  id: string;
  badgeType: string;
  earnedAt: string;
  title: string;
  description: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  weeklyXp: number;
  level: number;
  streak: number;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  totalCount: number;
  userRank: number | null;
  weekStart: string;
  weekEnd: string;
}

export interface UserStatsResponse {
  totalXp: number;
  level: number;
  streak: number;
  totalLessonsCompleted: number;
  totalModulesCompleted: number;
  badges: BadgeResponse[];
  levelProgress: LevelProgressResponse;
  streakInfo: StreakResponse;
}
