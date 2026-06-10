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
  const response = await apiClient.post<MentorResponse>(MENTOR_ASK, data);
  return response.data;
};

export const getMentorStatus = async (): Promise<MentorStatus> => {
  const response = await apiClient.get<MentorStatus>(MENTOR_STATUS);
  return response.data;
};
