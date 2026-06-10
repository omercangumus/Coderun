// Mentor API fonksiyonları

import apiClient from './client';
import { MENTOR_ASK, MENTOR_STATUS } from '../constants/api';

export interface MentorAskRequest {
  question: string;
  user_level?: string;
  learning_path?: string;
  attempt_count?: number;
  question_text?: string;
  lesson_title?: string;
  question_type?: string;
  code_block?: string;
}

export interface MentorResponse {
  answer: string;
  suggestion?: string;
}

export interface MentorStatus {
  status: string;
  provider: string;
  rate_limit_remaining: number;
}

export const askMentor = async (
  data: MentorAskRequest,
): Promise<MentorResponse> => {
  const payload = {
    message: data.question,
    user_level: data.user_level ?? 'beginner',
    learning_path: data.learning_path || null,
    attempt_count: data.attempt_count ?? 1,
    question_text: data.question_text || null,
    lesson_title: data.lesson_title || null,
    question_type: data.question_type || null,
    code_block: data.code_block || null,
  };
  const response = await apiClient.post<MentorResponse>(MENTOR_ASK, payload);
  return response.data;
};

export const getMentorStatus = async (): Promise<MentorStatus> => {
  const response = await apiClient.get<MentorStatus>(MENTOR_STATUS);
  return response.data;
};
