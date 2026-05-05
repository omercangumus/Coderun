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

export interface MentorStatus {
  status: string;
  model: string;
  provider: string;
  rate_limit_remaining: number;
}

export const mentorApi = {
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

  async getStatus(): Promise<MentorStatus> {
    const response = await axiosClient.get(MENTOR_ENDPOINTS.status);
    return response.data as MentorStatus;
  },
};
