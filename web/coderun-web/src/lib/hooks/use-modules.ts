'use client';

import { useQuery } from '@tanstack/react-query';
import { moduleApi } from '@/lib/api/module-api';
import { QUERY_KEYS } from '@/lib/constants/api.constants';

export function useModules() {
  return useQuery({
    queryKey: QUERY_KEYS.modules,
    queryFn: moduleApi.getAllModules,
    staleTime: 5 * 60 * 1000,
  });
}

export function useModuleProgress(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.moduleProgress(slug),
    queryFn: () => moduleApi.getModuleProgress(slug),
    enabled: !!slug,
  });
}

export function useLessons(moduleSlug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.lessons(moduleSlug),
    queryFn: () => moduleApi.getLessonsByModule(moduleSlug),
    enabled: !!moduleSlug,
  });
}

export function useLessonDetail(lessonId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.lessonDetail(lessonId),
    queryFn: () => moduleApi.getLessonDetail(lessonId),
    enabled: !!lessonId,
  });
}
