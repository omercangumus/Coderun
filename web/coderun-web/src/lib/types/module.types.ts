import type { BadgeResponse } from './gamification.types';

export interface ModuleResponse {
  id: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export interface LessonResponse {
  id: string;
  moduleId: string;
  title: string;
  lessonType: 'quiz' | 'code_completion' | 'code_editor' | 'mini_project';
  order: number;
  xpReward: number;
  isActive: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  score: number | null;
  attemptCount: number;
}

export interface ModuleProgressResponse {
  module: ModuleResponse;
  completionRate: number;
  completedLessons: number;
  totalLessons: number;
}

export interface QuestionResponse {
  id: string;
  lessonId: string;
  questionType: 'multiple_choice' | 'code_completion' | 'code_editor';
  questionText: string;
  options: Record<string, string[]> | null;
  order: number;
}

export interface LessonDetailResponse extends LessonResponse {
  questions: QuestionResponse[];
}

export interface AnswerSubmit {
  questionId: string;
  answer: string;
}

export interface LessonResultResponse {
  lessonId: string;
  score: number;
  correctCount: number;
  wrongCount: number;
  xpEarned: number;
  isCompleted: boolean;
  message: string;
  levelUp: boolean;
  newLevel: number;
  newStreak: number;
  badgesEarned: BadgeResponse[];
}
