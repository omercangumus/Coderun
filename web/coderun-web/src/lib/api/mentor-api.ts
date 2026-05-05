// AI Mentor API istemcisi.

import axiosClient from './axios-client';
import { MENTOR_ENDPOINTS } from '@/lib/constants/api.constants';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface MentorRequest {
  message: string;
  context: 'lesson' | 'lab' | 'general';
  history: ChatMessage[];
  lessonTitle?: string;
  moduleSlug?: string;
  questionText?: string;
}

export interface MentorResponse {
  reply: string;
  context: string;
}

// /mentor/ask endpoint için (attempt_count destekli)
export interface MentorAskRequest {
  message: string;
  user_level?: string;
  learning_path?: string;
  attempt_count?: number;
}

export interface MentorAskResponse {
  answer: string;
  model: string;
}

export interface MentorStatus {
  status: string;
  model: string;
  provider: string;
  rate_limit_remaining: number;
}

export const mentorApi = {
  // Sohbet geçmişi destekli (OpenAI SDK tabanlı)
  async sendMessage(request: MentorRequest): Promise<MentorResponse> {
    const response = await axiosClient.post(MENTOR_ENDPOINTS.chat, {
      message: request.message,
      context: request.context,
      history: request.history,
      lesson_title: request.lessonTitle,
      module_slug: request.moduleSlug,
      question_text: request.questionText,
    });
    return response.data as MentorResponse;
  },

  // attempt_count destekli (httpx tabanlı, daha akıllı ipucu mantığı)
  async ask(request: MentorAskRequest): Promise<MentorAskResponse> {
    const response = await axiosClient.post(MENTOR_ENDPOINTS.ask, {
      message: request.message,
      user_level: request.user_level ?? 'beginner',
      learning_path: request.learning_path,
      attempt_count: request.attempt_count ?? 1,
    });
    return response.data as MentorAskResponse;
  },

  async getStatus(): Promise<MentorStatus> {
    const response = await axiosClient.get(MENTOR_ENDPOINTS.status);
    return response.data as MentorStatus;
  },
};
