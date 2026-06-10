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
  LessonSubmitRequest,
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
  data: LessonSubmitRequest,
): Promise<LessonResult> => {
  const response = await apiClient.post<LessonResult>(
    submitLesson(lessonId),
    data,
  );
  return response.data;
};
