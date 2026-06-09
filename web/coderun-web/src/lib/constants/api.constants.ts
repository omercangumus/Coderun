// Production'da NEXT_PUBLIC_API_URL zorunludur.
// Development'ta localhost fallback kullanılır.
const _configuredApiUrl = process.env.NEXT_PUBLIC_API_URL;

if (process.env.NODE_ENV === 'production' && !_configuredApiUrl) {
  throw new Error(
    '[Coderun] NEXT_PUBLIC_API_URL is required in production. ' +
    'Set it in your deployment environment variables.'
  );
}

export const API_BASE_URL = _configuredApiUrl || '/api/v1';

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

export const MENTOR_ENDPOINTS = {
  chat: '/mentor/chat',
  // Note: /mentor/chat/stream is available on backend but not yet implemented in frontend
  // stream: '/mentor/chat/stream',
  status: '/mentor/status',
  ask: '/mentor/ask',
} as const;

export const ADMIN_ENDPOINTS = {
  stats: '/admin/stats',
  paths: '/admin/paths',
  pathDetail: (id: string) => `/admin/paths/${id}`,
  pathsReorder: '/admin/paths/reorder',
  units: '/admin/units',
  unitDetail: (id: string) => `/admin/units/${id}`,
  lessons: '/admin/lessons',
  lessonDetail: (id: string) => `/admin/lessons/${id}`,
  questions: '/admin/questions',
  questionDetail: (id: string) => `/admin/questions/${id}`,
  users: '/admin/users',
  userProgress: (id: string) => `/admin/users/${id}/progress`,
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
  // Admin
  adminStats: ['admin-stats'] as const,
  adminPaths: ['admin-paths'] as const,
  adminUnits: (moduleId: string) => ['admin-units', moduleId] as const,
  adminLessons: (moduleId?: string) => ['admin-lessons', moduleId] as const,
  adminQuestions: (lessonId: string) => ['admin-questions', lessonId] as const,
  adminUsers: (search?: string) => ['admin-users', search] as const,
} as const;
