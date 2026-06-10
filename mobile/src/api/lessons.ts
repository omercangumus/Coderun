// Ders ve modül API fonksiyonları

import apiClient from './client';
import {
  MODULES,
  getModuleBySlug,
  getModuleProgress,
  getLessonsByModule,
  getLessonDetail,
  submitLesson,
} from '../constants/api';
import type {
  Lesson,
  LessonDetail,
  LessonResult,
  AnswerSubmission,
  Module,
} from '../types/lesson';

export const getModules = async (): Promise<Module[]> => {
  const response = await apiClient.get<Module[]>(MODULES);
  return response.data;
};

export const getModuleDetails = async (slug: string): Promise<Module> => {
  const response = await apiClient.get<Module>(getModuleBySlug(slug));
  return response.data;
};

export const fetchModuleProgress = async (slug: string): Promise<unknown> => {
  const response = await apiClient.get(getModuleProgress(slug));
  return response.data;
};

export const getLessons = async (moduleSlug: string): Promise<Lesson[]> => {
  const response = await apiClient.get<Lesson[]>(
    getLessonsByModule(moduleSlug),
  );
  return response.data;
};

export const fetchLessonDetail = async (
  lessonId: string,
): Promise<LessonDetail> => {
  const response = await apiClient.get<LessonDetail>(
    getLessonDetail(lessonId),
  );
  return response.data;
};

export const submitLessonAnswers = async (
  lessonId: string,
  answers: AnswerSubmission[],
): Promise<LessonResult> => {
  const payload = answers.map((a) => ({
    question_id: a.question_id,
    answer: typeof a.answer === 'string' ? a.answer : JSON.stringify(a.answer),
  }));
  const response = await apiClient.post<LessonResult>(
    submitLesson(lessonId),
    payload,
  );
  return response.data;
};
