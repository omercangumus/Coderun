// API URL sabitleri — Flutter codebase'den alınan gerçek endpoint yolları.
// Emülatörde: http://10.0.2.2:8000/api/v1
// iOS Simulator: http://localhost:8000/api/v1
// Fiziksel cihaz: http://<bilgisayar-IP>:8000/api/v1

export const API_BASE_URL =
  process.env['EXPO_PUBLIC_API_URL'] ?? 'http://10.0.2.2:8000/api/v1';

// Auth
export const AUTH_REGISTER = '/auth/register';
export const AUTH_LOGIN = '/auth/login';
export const AUTH_REFRESH = '/auth/refresh';
export const AUTH_ME = '/auth/me';
export const AUTH_LOGOUT = '/auth/logout';
export const AUTH_FCM_TOKEN = '/auth/fcm-token';

// Modüller
export const MODULES = '/modules';
export const getModuleBySlug = (slug: string) => `/modules/${slug}`;
export const getModuleProgress = (slug: string) => `/modules/${slug}/progress`;

// Dersler
export const getLessonsByModule = (moduleSlug: string) =>
  `/lessons/module/${moduleSlug}`;
export const getLessonDetail = (lessonId: string) => `/lessons/${lessonId}`;
export const submitLesson = (lessonId: string) => `/lessons/${lessonId}/submit`;

// Placement
export const getPlacementQuestions = (slug: string) => `/placement/${slug}`;
export const submitPlacement = (slug: string) => `/placement/${slug}/submit`;

// Gamification
export const LEADERBOARD = '/gamification/leaderboard';
export const STATS = '/gamification/stats';
export const BADGES = '/gamification/badges';
export const LEVEL_PROGRESS = '/gamification/level-progress';
export const STREAK = '/gamification/streak';

// Mentor
export const MENTOR_CHAT = '/mentor/chat';
export const MENTOR_CHAT_STREAM = '/mentor/chat/stream';
export const MENTOR_STATUS = '/mentor/status';
export const MENTOR_ASK = '/mentor/ask';

// Code Runner
export const CODE_RUN = '/code/run';
export const CODE_SUBMIT = '/code/submit';

// Timeout (ms)
export const CONNECT_TIMEOUT = 30000;
export const RECEIVE_TIMEOUT = 30000;
