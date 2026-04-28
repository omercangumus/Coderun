'use client';

import { useState, useCallback } from 'react';
import { moduleApi } from '@/lib/api/module-api';
import type { LessonDetailResponse, AnswerSubmit, LessonResultResponse } from '@/lib/types/module.types';

export function useLessonState(lessonId: string) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<LessonResultResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const answerQuestion = useCallback((questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  }, []);

  const nextQuestion = useCallback((total: number) => {
    setCurrentQuestionIndex(prev => Math.min(prev + 1, total - 1));
  }, []);

  const prevQuestion = useCallback(() => {
    setCurrentQuestionIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const submitLesson = useCallback(async (questions: LessonDetailResponse['questions']) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const submitAnswers: AnswerSubmit[] = questions.map(q => ({
        questionId: q.id,
        answer: answers[q.id] ?? '',
      }));
      const res = await moduleApi.submitLesson(lessonId, submitAnswers);
      setResult(res);
      return res;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ?? 'Bir hata oluştu';
      setError(msg);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [lessonId, answers]);

  const reset = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsSubmitting(false);
    setResult(null);
    setError(null);
  }, []);

  return {
    currentQuestionIndex,
    answers,
    isSubmitting,
    result,
    error,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    submitLesson,
    reset,
  };
}
