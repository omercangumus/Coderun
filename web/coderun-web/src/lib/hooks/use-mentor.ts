'use client';

// useMentor hook — AI Mentor sohbet state yönetimi.
// attempt_count takibi ile akıllı ipucu mantığı.

import { useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';

import { mentorApi, ChatMessage } from '@/lib/api/mentor-api';
import { parseMentorSuggestion } from '@/lib/utils/mentor-suggestion';

interface UseMentorOptions {
  moduleSlug?: string;
  lessonTitle?: string;
  questionText?: string;
  questionType?: string;
  codeBlock?: string | null;
  context?: 'lesson' | 'lab' | 'general';
  initialGreeting?: string;
}

interface UseMentorReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  attemptCount: number;
  lastSuggestion: string | null;
  sendMessage: (userMessage: string) => Promise<void>;
  clearChat: () => void;
}

const DEFAULT_GREETING =
  'Merhaba! Ben Ghostie 👻 Takıldığın bir yer mi var? Soruyu birlikte çözelim — hemen cevabı vermem, önce konuşuruz!';

export function useMentor(options: UseMentorOptions = {}): UseMentorReturn {
  const greeting = options.initialGreeting ?? DEFAULT_GREETING;

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: greeting },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [attemptCount, setAttemptCount] = useState(1);
  const [lastSuggestion, setLastSuggestion] = useState<string | null>(null);

  const attemptRef = useRef(1);
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim() || isLoading) return;

      const userMsg: ChatMessage = { role: 'user', content: userMessage };
      const historyForApi = messagesRef.current;
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      const currentAttempt = attemptRef.current;
      const ctx = optionsRef.current;
      const isLessonQuiz =
        ctx.context === 'lesson' &&
        Boolean(ctx.questionText?.trim());

      try {
        let replyText: string;

        if (isLessonQuiz) {
          const response = await mentorApi.ask({
            message: userMessage,
            user_level: 'beginner',
            learning_path: ctx.moduleSlug,
            attempt_count: currentAttempt,
            question_text: ctx.questionText,
            lesson_title: ctx.lessonTitle,
            question_type: ctx.questionType,
            code_block: ctx.codeBlock ?? undefined,
          });
          replyText = response.answer;

          const nextAttempt = currentAttempt + 1;
          attemptRef.current = nextAttempt;
          setAttemptCount(nextAttempt);
        } else {
          const response = await mentorApi.sendMessage({
            message: userMessage,
            context: ctx.context ?? 'general',
            history: historyForApi,
            lessonTitle: ctx.lessonTitle,
            moduleSlug: ctx.moduleSlug,
            questionText: ctx.questionText,
          });
          replyText = response.reply;
        }

        const { displayText, suggestion } = parseMentorSuggestion(replyText);
        if (suggestion) {
          setLastSuggestion(suggestion);
        }

        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: displayText },
        ]);
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response?.status;

        if (status === 429) {
          toast.error('Çok fazla istek! Biraz bekle ⏳');
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: 'Çok fazla istek gönderildi. Biraz bekleyip tekrar dene! ⏳',
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: 'Üzgünüm, şu an yanıt veremiyorum. 😔 Biraz sonra tekrar dene.',
            },
          ]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading],
  );

  const clearChat = useCallback(() => {
    attemptRef.current = 1;
    setAttemptCount(1);
    setLastSuggestion(null);
    setMessages([{ role: 'assistant', content: greeting }]);
  }, [greeting]);

  return { messages, isLoading, attemptCount, lastSuggestion, sendMessage, clearChat };
}
