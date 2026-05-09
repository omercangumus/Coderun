// Admin panel TypeScript types

export interface AdminStats {
  totalUsers: number;
  activeToday: number;
  lessonsCompletedToday: number;
  mostFailedQuestion: ProblemAreaItem | null;
  mostSkippedLesson: ProblemAreaItem | null;
  growthData: GrowthDataPoint[];
}

export interface ProblemAreaItem {
  title: string;
  subtitle: string;
  rate: number;
}

export interface GrowthDataPoint {
  day: string;
  count: number;
}

export interface PathListItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  isActive: boolean;
  isPublished: boolean;
  lessonCount: number;
  unitCount: number;
  completionRate: number;
}

export interface PathCreateData {
  title: string;
  slug: string;
  description: string;
  order?: number;
  isActive?: boolean;
  isPublished?: boolean;
}

export interface PathUpdateData {
  title?: string;
  slug?: string;
  description?: string;
  order?: number;
  isActive?: boolean;
  isPublished?: boolean;
}

export interface UnitListItem {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
  lessonCount: number;
}

export interface UnitCreateData {
  moduleId: string;
  title: string;
  description?: string;
  order?: number;
  isActive?: boolean;
}

export interface LessonAdminItem {
  id: string;
  moduleId: string;
  unitId: string | null;
  title: string;
  lessonType: string;
  order: number;
  xpReward: number;
  isActive: boolean;
  completionRate: number;
  avgScore: number;
  wrongRate: number;
  questionCount: number;
}

export interface LessonCreateData {
  moduleId: string;
  unitId?: string | null;
  title: string;
  lessonType: string;
  order?: number;
  xpReward?: number;
  isActive?: boolean;
}

export interface QuestionAdminItem {
  id: string;
  lessonId: string;
  questionType: string;
  questionText: string;
  options: Record<string, unknown> | null;
  correctAnswer: string;
  hint: string | null;
  explanation: string | null;
  codeBlock: string | null;
  wordBank: Record<string, unknown> | null;
  correctLineIndex: number | null;
  order: number;
  reinforcementQuestionId: string | null;
}

export interface QuestionCreateData {
  lessonId: string;
  questionType: string;
  questionText: string;
  options?: Record<string, unknown> | null;
  correctAnswer: string;
  hint?: string | null;
  explanation?: string | null;
  codeBlock?: string | null;
  wordBank?: Record<string, unknown> | null;
  correctLineIndex?: number | null;
  order?: number;
  reinforcementQuestionId?: string | null;
}

export interface UserAdminItem {
  id: string;
  username: string;
  email: string;
  xp: number;
  level: number;
  streak: number;
  isActive: boolean;
  isSuperuser: boolean;
  createdAt: string;
  lastActiveDate: string | null;
}

export interface UserProgressDetail {
  userId: string;
  completedLessons: number;
  totalLessons: number;
  totalXp: number;
  currentLevel: number;
  currentStreak: number;
  badgeCount: number;
}

export interface ReorderItem {
  id: string;
  order: number;
}
