'use client';

// useMentor hook — AI Mentor sohbet state yönetimi.
// attempt_count takibi ile akıllı ipucu mantığı.

import { useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';

import { mentorApi, ChatMessage } from '@/lib/api/mentor-api';

interface UseMentorOptions {
  moduleSlug?: string;
  lessonTitle?: string;
  questionText?: string;
  context?: 'lesson' | 'lab' | 'general';
}

interface UseMentorReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  attemptCount: number;
  sendMessage: (userMessage: string) => Promise<void>;
  clearChat: () => void;
}

export function useMentor(options: UseMentorOptions = {}): UseMentorReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Merhaba! Ben Ghostie 👻 Takıldığın bir yer mi var? Yardımcı olmaya hazırım!',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [attemptCount, setAttemptCount] = useState(1);

  // Stale closure'ı önlemek için ref kullan
  const attemptRef = useRef(1);

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim() || isLoading) return;

      const userMsg: ChatMessage = { role: 'user', content: userMessage };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      const currentAttempt = attemptRef.current;

      try {
        // /mentor/ask endpoint'i — attempt_count destekli, daha akıllı ipucu mantığı
        const response = await mentorApi.ask({
          message: userMessage,
          user_level: 'beginner',
          learning_path: options.moduleSlug,
          attempt_count: currentAttempt,
        });

        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: response.answer },
        ]);

        // Her başarılı soruda attempt_count artır (max 3'te sabit)
        const nextAttempt = Math.min(currentAttempt + 1, 3);
        attemptRef.current = nextAttempt;
        setAttemptCount(nextAttempt);

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
              content: 'Üzgünüm, şu an yanıt veremiyorum. 😔',
            },
          ]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, options.moduleSlug],
  );

  const clearChat = useCallback(() => {
    attemptRef.current = 1;
    setAttemptCount(1);
    setMessages([
      {
        role: 'assistant',
        content: 'Merhaba! Ben Ghostie 👻 Takıldığın bir yer mi var?',
      },
    ]);
  }, []);

  return { messages, isLoading, attemptCount, sendMessage, clearChat };
}
