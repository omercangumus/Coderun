'use client';

import { useState, useCallback } from 'react';
import { moduleApi } from '@/lib/api/module-api';
import type { AnswerSubmit, PlacementResultResponse } from '@/lib/types/module.types';

export function usePlacementState(moduleSlug: string) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<PlacementResultResponse | null>(null);

  const answerQuestion = useCallback((questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  }, []);

  const skipQuestion = useCallback((questionId: string, total: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: '' }));
    setCurrentIndex(prev => Math.min(prev + 1, total - 1));
  }, []);

  const next = useCallback((total: number) => {
    setCurrentIndex(prev => Math.min(prev + 1, total - 1));
  }, []);

  const submitTest = useCallback(async (questionIds: string[]) => {
    setIsSubmitting(true);
    try {
      const submitAnswers: AnswerSubmit[] = questionIds.map(id => ({
        questionId: id,
        answer: answers[id] ?? '',
      }));
      const res = await moduleApi.submitPlacementTest(moduleSlug, submitAnswers);
      setResult(res);
      return res;
    } finally {
      setIsSubmitting(false);
    }
  }, [moduleSlug, answers]);

  return {
    currentIndex,
    answers,
    isSubmitting,
    result,
    answerQuestion,
    skipQuestion,
    next,
    submitTest,
  };
}
