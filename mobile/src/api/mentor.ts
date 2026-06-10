// Mentor API fonksiyonları

import apiClient from './client';
import { MENTOR_ASK, MENTOR_STATUS } from '../constants/api';

export interface MentorAskRequest {
  question: string;
  context?: string;
  attempt_count?: number;
}

export interface MentorResponse {
  answer: string;
  suggestion?: string;
}

export interface MentorStatus {
  available: boolean;
  message?: string;
}

export const askMentor = async (
  data: MentorAskRequest,
): Promise<MentorResponse> => {
  const payload = {
    message: data.question,
    user_level: 'beginner',
    learning_path: data.context || null,
    attempt_count: data.attempt_count || 1,
  };
  const response = await apiClient.post<MentorResponse>(MENTOR_ASK, payload);
  return response.data;
};

export const getMentorStatus = async (): Promise<MentorStatus> => {
  const response = await apiClient.get<MentorStatus>(MENTOR_STATUS);
  return response.data;
};
