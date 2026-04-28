export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const AUTH_ENDPOINTS = {
  register: '/auth/register',
  login: '/auth/login',
  refresh: '/auth/refresh',
  me: '/auth/me',
  logout: '/auth/logout',
} as const;

export const MODULE_ENDPOINTS = {
  list: '/modules',
  detail: (slug: string) => `/modules/${slug}`,
  progress: (slug: string) => `/modules/${slug}/progress`,
  lessons: (moduleSlug: string) => `/lessons/module/${moduleSlug}`,
  lessonDetail: (lessonId: string) => `/lessons/${lessonId}`,
  submitLesson: (lessonId: string) => `/lessons/${lessonId}/submit`,
} as const;

export const GAMIFICATION_ENDPOINTS = {
  leaderboard: '/gamification/leaderboard',
  stats: '/gamification/stats',
  badges: '/gamification/badges',
  levelProgress: '/gamification/level-progress',
  streak: '/gamification/streak',
} as const;

export const PLACEMENT_ENDPOINTS = {
  questions: (slug: string) => `/placement/${slug}`,
  submit: (slug: string) => `/placement/${slug}/submit`,
} as const;

export const AI_ENDPOINTS = {
  mentor: '/ai/mentor',
} as const;

export const QUERY_KEYS = {
  modules: ['modules'] as const,
  moduleProgress: (slug: string) => ['module-progress', slug] as const,
  lessons: (moduleSlug: string) => ['lessons', moduleSlug] as const,
  lessonDetail: (lessonId: string) => ['lesson-detail', lessonId] as const,
  userStats: ['user-stats'] as const,
  leaderboard: (limit: number) => ['leaderboard', limit] as const,
  streak: ['streak'] as const,
  levelProgress: ['level-progress'] as const,
  badges: ['badges'] as const,
} as const;
