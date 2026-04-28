import axiosClient from './axios-client';
import { MODULE_ENDPOINTS, PLACEMENT_ENDPOINTS } from '@/lib/constants/api.constants';
import type {
  ModuleResponse,
  ModuleProgressResponse,
  LessonResponse,
  LessonDetailResponse,
  AnswerSubmit,
  LessonResultResponse,
  PlacementTestResponse,
  PlacementResultResponse,
} from '@/lib/types/module.types';

export const moduleApi = {
  async getAllModules(): Promise<ModuleResponse[]> {
    const response = await axiosClient.get(MODULE_ENDPOINTS.list);
    return response.data.map(mapModule);
  },

  async getModuleBySlug(slug: string): Promise<ModuleResponse> {
    const response = await axiosClient.get(MODULE_ENDPOINTS.detail(slug));
    return mapModule(response.data);
  },

  async getModuleProgress(slug: string): Promise<ModuleProgressResponse> {
    const response = await axiosClient.get(MODULE_ENDPOINTS.progress(slug));
    const raw = response.data;
    return {
      module: mapModule(raw.module),
      completionRate: raw.completion_rate,
      completedLessons: raw.completed_lessons,
      totalLessons: raw.total_lessons,
    };
  },

  async getLessonsByModule(moduleSlug: string): Promise<LessonResponse[]> {
    const response = await axiosClient.get(MODULE_ENDPOINTS.lessons(moduleSlug));
    return response.data.map(mapLesson);
  },

  async getLessonDetail(lessonId: string): Promise<LessonDetailResponse> {
    const response = await axiosClient.get(MODULE_ENDPOINTS.lessonDetail(lessonId));
    const raw = response.data;
    return {
      ...mapLesson(raw),
      questions: (raw.questions ?? []).map(mapQuestion),
    };
  },

  async submitLesson(
    lessonId: string,
    answers: AnswerSubmit[]
  ): Promise<LessonResultResponse> {
    const payload = answers.map((a) => ({
      question_id: a.questionId,
      answer: a.answer,
    }));
    const response = await axiosClient.post(
      MODULE_ENDPOINTS.submitLesson(lessonId),
      payload
    );
    const raw = response.data;
    return {
      lessonId: raw.lesson_id,
      score: raw.score,
      correctCount: raw.correct_count,
      wrongCount: raw.wrong_count,
      xpEarned: raw.xp_earned,
      isCompleted: raw.is_completed,
      message: raw.message,
      levelUp: raw.level_up,
      newLevel: raw.new_level,
      newStreak: raw.new_streak,
      badgesEarned: (raw.badges_earned ?? []).map(mapBadge),
    };
  },

  async getPlacementQuestions(slug: string): Promise<PlacementTestResponse> {
    const response = await axiosClient.get(PLACEMENT_ENDPOINTS.questions(slug));
    const raw = response.data;
    return {
      moduleId: raw.module_id,
      moduleTitle: raw.module_title,
      questions: (raw.questions ?? []).map(mapQuestion),
      totalQuestions: raw.total_questions,
    };
  },

  async submitPlacementTest(
    slug: string,
    answers: AnswerSubmit[]
  ): Promise<PlacementResultResponse> {
    const payload = answers.map((a) => ({
      question_id: a.questionId,
      answer: a.answer,
    }));
    const response = await axiosClient.post(PLACEMENT_ENDPOINTS.submit(slug), payload);
    const raw = response.data;
    return {
      correctCount: raw.correct_count,
      totalCount: raw.total_count,
      percentage: raw.percentage,
      startingLessonOrder: raw.starting_lesson_order,
      skippedLessons: raw.skipped_lessons,
      message: raw.message,
    };
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapModule(raw: any): ModuleResponse {
  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    description: raw.description,
    order: raw.order,
    isActive: raw.is_active,
    createdAt: raw.created_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapLesson(raw: any): LessonResponse {
  return {
    id: raw.id,
    moduleId: raw.module_id,
    title: raw.title,
    lessonType: raw.lesson_type,
    order: raw.order,
    xpReward: raw.xp_reward,
    isActive: raw.is_active,
    isCompleted: raw.is_completed ?? false,
    isLocked: raw.is_locked ?? false,
    score: raw.score ?? null,
    attemptCount: raw.attempt_count ?? 0,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapQuestion(raw: any) {
  return {
    id: raw.id,
    lessonId: raw.lesson_id,
    questionType: raw.question_type,
    questionText: raw.question_text,
    options: raw.options ?? null,
    order: raw.order,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBadge(raw: any) {
  return {
    id: raw.id,
    badgeType: raw.badge_type,
    earnedAt: raw.earned_at,
    title: raw.title,
    description: raw.description,
  };
}
