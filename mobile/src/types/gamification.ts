// Gamification türleri — Flutter badge_model.dart, streak_model.dart,
// level_progress_model.dart, leaderboard_model.dart, user_stats_model.dart'tan

export interface Badge {
  id: string;
  badge_type: string;
  earned_at: string;
  title: string;
  description: string;
}

export interface StreakInfo {
  current_streak: number;
  last_active_date: string | null;
  is_alive: boolean;
  next_milestone: number;
  days_to_next_milestone: number;
}

export interface LevelProgress {
  current_level: number;
  current_xp: number;
  xp_needed_for_next: number;
  xp_remaining: number;
  progress_percentage: number;
  is_max_level: boolean;
}

export interface UserStats {
  total_xp: number;
  level: number;
  streak: number;
  total_lessons_completed: number;
  total_modules_completed: number;
  badges: Badge[];
  level_progress: LevelProgress;
  streak_info: StreakInfo;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  weekly_xp: number;
  level: number;
  streak: number;
}

export interface Leaderboard {
  entries: LeaderboardEntry[];
  total_count: number;
  user_rank: number | null;
  week_start: string;
  week_end: string;
}
