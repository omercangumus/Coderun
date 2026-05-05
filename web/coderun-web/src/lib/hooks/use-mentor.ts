'use client';

// useMentor hook — AI Mentor sohbet state yönetimi.

import { useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';

import { mentorApi, ChatMessage, MentorRequest } from '@/lib/api/mentor-api';

interface UseMentorOptions {
  moduleSlug?: string;
  lessonTitle?: string;
  questionText?: string;
  context?: 'lesson' | 'lab' | 'general';
}

interface UseMentorReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (userMessage: string) => Promise<void>;
  clearChat: () => void;
}

export function useMentor(options: UseMentorOptions = {}): UseMentorReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Merhaba! Ben Phantom 👻 Takıldığın bir yer mi var? Yardımcı olmaya hazırım!',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Stale closure'ı önlemek için ref kullan
  const messagesRef = useRef<ChatMessage[]>(messages);
  messagesRef.current = messages;

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim() || isLoading) return;

      const userMsg: ChatMessage = { role: 'user', content: userMessage };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const request: MentorRequest = {
          message: userMessage,
          context: options.context ?? 'general',
          // Güncel mesaj listesini ref'ten al (stale closure'dan kaçın)
          history: messagesRef.current,
          moduleSlug: options.moduleSlug,
          lessonTitle: options.lessonTitle,
          questionText: options.questionText,
        };

        const response = await mentorApi.sendMessage(request);
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: response.reply },
        ]);
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response
          ?.status;

        if (status === 429) {
          toast.error('Çok fazla istek! Biraz bekle ⏳');
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content:
                'Çok fazla istek gönderildi. Biraz bekleyip tekrar dene! ⏳',
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
    // isLoading ve options değiştiğinde yeniden oluştur
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, options.context, options.moduleSlug, options.lessonTitle, options.questionText],
  );

  const clearChat = useCallback(() => {
    setMessages([
      {
        role: 'assistant',
        content: 'Merhaba! Ben Phantom 👻 Takıldığın bir yer mi var?',
      },
    ]);
  }, []);

  return { messages, isLoading, sendMessage, clearChat };
}
