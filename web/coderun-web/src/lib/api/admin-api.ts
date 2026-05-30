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
  QuestionUpdateData,
  UserAdminItem,
  UserProgressDetail,
  ReorderItem,
} from '@/lib/types/admin.types';

const PREFIX = '/admin';

// ---------------------------------------------------------------------------
// Helpers for mapping
// ---------------------------------------------------------------------------

function mapQuestionAdminItem(raw: any): QuestionAdminItem {
  return {
    id: raw.id,
    lessonId: raw.lesson_id,
    questionType: raw.question_type,
    questionText: raw.question_text,
    options: raw.options ?? null,
    correctAnswer: raw.correct_answer,
    hint: raw.hint ?? null,
    explanation: raw.explanation ?? null,
    codeBlock: raw.code_block ?? null,
    wordBank: raw.word_bank ?? null,
    correctLineIndex: raw.correct_line_index ?? null,
    order: raw.order,
    reinforcementQuestionId: raw.reinforcement_question_id ?? null,
    // Code assignment fields
    language: raw.language ?? null,
    starterCode: raw.starter_code ?? null,
    testCases: raw.test_cases
      ? raw.test_cases.map((tc: any) => ({
          name: tc.name,
          stdin: tc.stdin ?? '',
          expectedStdout: tc.expected_stdout ?? '',
          hidden: tc.hidden ?? false,
        }))
      : null,
    assignmentInstructions: raw.assignment_instructions ?? null,
    maxRuntimeMs: raw.max_runtime_ms ?? null,
    memoryLimitMb: raw.memory_limit_mb ?? null,
  };
}

function mapQuestionPayload(payload: any) {
  const mapped: any = {};
  if (payload.lessonId !== undefined) mapped.lesson_id = payload.lessonId;
  if (payload.questionType !== undefined) mapped.question_type = payload.questionType;
  if (payload.questionText !== undefined) mapped.question_text = payload.questionText;
  if (payload.options !== undefined) mapped.options = payload.options;
  if (payload.correctAnswer !== undefined) mapped.correct_answer = payload.correctAnswer;
  if (payload.hint !== undefined) mapped.hint = payload.hint;
  if (payload.explanation !== undefined) mapped.explanation = payload.explanation;
  if (payload.codeBlock !== undefined) mapped.code_block = payload.codeBlock;
  if (payload.wordBank !== undefined) mapped.word_bank = payload.wordBank;
  if (payload.correctLineIndex !== undefined) mapped.correct_line_index = payload.correctLineIndex;
  if (payload.order !== undefined) mapped.order = payload.order;
  if (payload.reinforcementQuestionId !== undefined) mapped.reinforcement_question_id = payload.reinforcementQuestionId;

  // Code runner fields
  if (payload.language !== undefined) mapped.language = payload.language;
  if (payload.starterCode !== undefined) mapped.starter_code = payload.starterCode;
  if (payload.assignmentInstructions !== undefined) mapped.assignment_instructions = payload.assignmentInstructions;
  if (payload.maxRuntimeMs !== undefined) mapped.max_runtime_ms = payload.maxRuntimeMs;
  if (payload.memoryLimitMb !== undefined) mapped.memory_limit_mb = payload.memoryLimitMb;

  if (payload.testCases !== undefined) {
    mapped.test_cases = payload.testCases
      ? payload.testCases.map((tc: any) => ({
          name: tc.name,
          stdin: tc.stdin ?? '',
          expected_stdout: tc.expectedStdout ?? '',
          hidden: tc.hidden ?? false,
        }))
      : null;
  }

  return mapped;
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

export async function getAdminStats(): Promise<AdminStats> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await axiosClient.get<any>(`${PREFIX}/stats`);
  // Backend returns snake_case — map to camelCase for frontend
  return {
    totalUsers: data.total_users ?? 0,
    activeToday: data.active_today ?? 0,
    lessonsCompletedToday: data.lessons_completed_today ?? 0,
    mostFailedQuestion: data.most_failed_question ?? null,
    mostSkippedLesson: data.most_skipped_lesson ?? null,
    growthData: data.growth_data ?? [],
  };
}

// ---------------------------------------------------------------------------
// Paths (Modules)
// ---------------------------------------------------------------------------

function mapPathListItem(raw: Record<string, unknown>): PathListItem {
  return {
    id: String(raw.id),
    title: String(raw.title ?? ''),
    slug: String(raw.slug ?? ''),
    description: String(raw.description ?? ''),
    order: Number(raw.order ?? 0),
    isActive: Boolean(raw.is_active),
    isPublished: Boolean(raw.is_published),
    lessonCount: Number(raw.lesson_count ?? 0),
    unitCount: Number(raw.unit_count ?? 0),
    completionRate: Number(raw.completion_rate ?? 0),
  };
}

export async function getPaths(): Promise<PathListItem[]> {
  const { data } = await axiosClient.get<Record<string, unknown>[]>(`${PREFIX}/paths`);
  return data.map(mapPathListItem);
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

function mapLessonAdminItem(raw: Record<string, unknown>): LessonAdminItem {
  return {
    id: String(raw.id),
    moduleId: String(raw.module_id),
    unitId: raw.unit_id != null ? String(raw.unit_id) : null,
    title: String(raw.title ?? ''),
    lessonType: String(raw.lesson_type ?? ''),
    order: Number(raw.order ?? 0),
    xpReward: Number(raw.xp_reward ?? 0),
    isActive: Boolean(raw.is_active),
    completionRate: Number(raw.completion_rate ?? 0),
    avgScore: Number(raw.avg_score ?? 0),
    wrongRate: Number(raw.wrong_rate ?? 0),
    questionCount: Number(raw.question_count ?? 0),
  };
}

export async function getLessonsAdmin(
  moduleId?: string
): Promise<LessonAdminItem[]> {
  const { data } = await axiosClient.get<Record<string, unknown>[]>(`${PREFIX}/lessons`, {
    params: moduleId ? { module_id: moduleId } : undefined,
  });
  return data.map(mapLessonAdminItem);
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
  const { data } = await axiosClient.get<any[]>(
    `${PREFIX}/questions`,
    { params: { lesson_id: lessonId } }
  );
  return data.map(mapQuestionAdminItem);
}

export async function createQuestion(
  payload: QuestionCreateData
): Promise<QuestionAdminItem> {
  const { data } = await axiosClient.post<any>(
    `${PREFIX}/questions`,
    mapQuestionPayload(payload)
  );
  return mapQuestionAdminItem(data);
}

export async function updateQuestion(
  questionId: string,
  payload: QuestionUpdateData
): Promise<QuestionAdminItem> {
  const { data } = await axiosClient.put<any>(
    `${PREFIX}/questions/${questionId}`,
    mapQuestionPayload(payload)
  );
  return mapQuestionAdminItem(data);
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
