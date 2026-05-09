// Admin API client — backend admin endpoints

import axiosClient from './axios-client';
import type {
  AdminStats,
  PathListItem,
  PathCreateData,
  PathUpdateData,
  UnitListItem,
  UnitCreateData,
  LessonAdminItem,
  LessonCreateData,
  QuestionAdminItem,
  QuestionCreateData,
  UserAdminItem,
  UserProgressDetail,
  ReorderItem,
} from '@/lib/types/admin.types';

const PREFIX = '/admin';

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

export async function getAdminStats(): Promise<AdminStats> {
  const { data } = await axiosClient.get<AdminStats>(`${PREFIX}/stats`);
  return data;
}

// ---------------------------------------------------------------------------
// Paths (Modules)
// ---------------------------------------------------------------------------

export async function getPaths(): Promise<PathListItem[]> {
  const { data } = await axiosClient.get<PathListItem[]>(`${PREFIX}/paths`);
  return data;
}

export async function createPath(payload: PathCreateData): Promise<PathListItem> {
  const { data } = await axiosClient.post<PathListItem>(`${PREFIX}/paths`, payload);
  return data;
}

export async function updatePath(
  pathId: string,
  payload: PathUpdateData
): Promise<PathListItem> {
  const { data } = await axiosClient.put<PathListItem>(
    `${PREFIX}/paths/${pathId}`,
    payload
  );
  return data;
}

export async function deletePath(pathId: string): Promise<void> {
  await axiosClient.delete(`${PREFIX}/paths/${pathId}`);
}

export async function reorderPaths(items: ReorderItem[]): Promise<void> {
  await axiosClient.patch(`${PREFIX}/paths/reorder`, { items });
}

// ---------------------------------------------------------------------------
// Units
// ---------------------------------------------------------------------------

export async function getUnits(moduleId: string): Promise<UnitListItem[]> {
  const { data } = await axiosClient.get<UnitListItem[]>(`${PREFIX}/units`, {
    params: { module_id: moduleId },
  });
  return data;
}

export async function createUnit(payload: UnitCreateData): Promise<UnitListItem> {
  const { data } = await axiosClient.post<UnitListItem>(`${PREFIX}/units`, payload);
  return data;
}

export async function deleteUnit(unitId: string): Promise<void> {
  await axiosClient.delete(`${PREFIX}/units/${unitId}`);
}

// ---------------------------------------------------------------------------
// Lessons
// ---------------------------------------------------------------------------

export async function getLessonsAdmin(
  moduleId?: string
): Promise<LessonAdminItem[]> {
  const { data } = await axiosClient.get<LessonAdminItem[]>(`${PREFIX}/lessons`, {
    params: moduleId ? { module_id: moduleId } : undefined,
  });
  return data;
}

export async function createLesson(
  payload: LessonCreateData
): Promise<LessonAdminItem> {
  const { data } = await axiosClient.post<LessonAdminItem>(
    `${PREFIX}/lessons`,
    payload
  );
  return data;
}

export async function deleteLesson(lessonId: string): Promise<void> {
  await axiosClient.delete(`${PREFIX}/lessons/${lessonId}`);
}

// ---------------------------------------------------------------------------
// Questions
// ---------------------------------------------------------------------------

export async function getQuestionsAdmin(
  lessonId: string
): Promise<QuestionAdminItem[]> {
  const { data } = await axiosClient.get<QuestionAdminItem[]>(
    `${PREFIX}/questions`,
    { params: { lesson_id: lessonId } }
  );
  return data;
}

export async function createQuestion(
  payload: QuestionCreateData
): Promise<QuestionAdminItem> {
  const { data } = await axiosClient.post<QuestionAdminItem>(
    `${PREFIX}/questions`,
    payload
  );
  return data;
}

export async function deleteQuestion(questionId: string): Promise<void> {
  await axiosClient.delete(`${PREFIX}/questions/${questionId}`);
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export async function getUsersAdmin(
  search?: string,
  skip = 0,
  limit = 50
): Promise<UserAdminItem[]> {
  const { data } = await axiosClient.get<UserAdminItem[]>(`${PREFIX}/users`, {
    params: { search, skip, limit },
  });
  return data;
}

export async function getUserProgress(
  userId: string
): Promise<UserProgressDetail> {
  const { data } = await axiosClient.get<UserProgressDetail>(
    `${PREFIX}/users/${userId}/progress`
  );
  return data;
}
