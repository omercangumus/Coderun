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
  lockedReason: string | null;
  score: number | null;
  attemptCount: number;
}

export interface ModuleProgressResponse {
  module: ModuleResponse;
  completionRate: number;
  completedLessons: number;
  totalLessons: number;
}

export type QuestionType =
  | 'multiple_choice'
  | 'code_completion'
  | 'code_editor'
  | 'fill_in_blank'
  | 'reorder'
  | 'true_false_reason'
  | 'spot_the_bug'
  | 'multi_select';

export interface QuestionResponse {
  id: string;
  lessonId: string;
  questionType: QuestionType;
  questionText: string;
  options: Record<string, unknown> | null;
  hint: string | null;
  explanation: string | null;
  codeBlock: string | null;
  wordBank: { words: string[] } | null;
  correctLineIndex: number | null;
  isReinforcement: boolean;
  order: number;
  reinforcementQuestion: QuestionResponse | null;
  /** Zorluk seviyesi: "easy" | "medium" | "hard" */
  difficulty: 'easy' | 'medium' | 'hard' | null;
  // Code assignment fields (code_editor type)
  language: string | null;
  starterCode: string | null;
  testCases: Array<{ name: string; stdin: string; expectedStdout: string; hidden: boolean }> | null;
  assignmentInstructions: string | null;
  maxRuntimeMs: number | null;
  memoryLimitMb: number | null;
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
  reinforcementQuestion: QuestionResponse | null;
}

export interface PlacementTestResponse {
  moduleId: string;
  moduleTitle: string;
  questions: QuestionResponse[];
  totalQuestions: number;
}

export interface PlacementResultResponse {
  correctCount: number;
  totalCount: number;
  percentage: number;
  startingLessonOrder: number;
  skippedLessons: number;
  message: string;
}

export interface LessonState {
  currentQuestionIndex: number;
  answers: Record<string, string>;
  isSubmitting: boolean;
  result: LessonResultResponse | null;
  error: string | null;
}
