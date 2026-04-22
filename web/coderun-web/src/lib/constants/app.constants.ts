export const APP_NAME = 'Coderun';
export const APP_DESCRIPTION = 'DevOps, Cloud ve Python öğrenmek için gamification destekli platform';

export const MODULE_EMOJIS: Record<string, string> = {
  python: '🐍',
  devops: '⚙️',
  cloud: '☁️',
};

export const BADGE_ICONS: Record<string, string> = {
  first_lesson: '🎯',
  streak_7: '🔥',
  streak_30: '💎',
  module_complete: '🏆',
  level_5: '⭐',
  level_10: '🌟',
};

export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  learn: '/learn',
  leaderboard: '/leaderboard',
  profile: '/profile',
  module: (slug: string) => `/learn/${slug}`,
  lesson: (moduleSlug: string, lessonId: string) =>
    `/learn/${moduleSlug}/lesson/${lessonId}`,
} as const;
