// Ders ve modül türleri — Flutter lesson_model.dart + module_model.dart + question_model.dart'tan

export interface Module {
  id: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  is_active: boolean;
  created_at: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  lesson_type: string;
  order: number;
  xp_reward: number;
  is_active: boolean;
  is_completed: boolean;
  is_locked: boolean;
  locked_reason: string | null;
  score: number | null;
  attempt_count: number;
}

export interface Question {
  id: string;
  lesson_id: string;
  question_type: string;
  question_text: string;
  options: Record<string, unknown> | null;
  hint: string | null;
  explanation: string | null;
  code_block: string | null;
  word_bank: Record<string, unknown> | null;
  correct_line_index: number | null;
  is_reinforcement: boolean;
  order: number;
  reinforcement_question: Question | null;
  language: string | null;
  starter_code: string | null;
  test_cases: Array<Record<string, unknown>> | null;
  assignment_instructions: string | null;
  max_runtime_ms: number | null;
  memory_limit_mb: number | null;
}

export interface LessonDetail {
  lesson: Lesson;
  questions: Question[];
}

export interface AnswerSubmission {
  question_id: string;
  answer: unknown;
}

export interface LessonSubmitRequest {
  answers: AnswerSubmission[];
}

export interface LessonResult {
  lesson_id: string;
  score: number;
  xp_earned: number;
  is_completed: boolean;
  correct_count: number;
  wrong_count: number;
  total_questions: number;
  passed: boolean;
  message: string;
  level_up?: boolean;
  new_level?: number;
  new_streak?: number;
}
