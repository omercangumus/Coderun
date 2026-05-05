'use client';

// AI Mentor sidebar — OpenRouter API ile gerçek zamanlı sohbet.

import { useRef, useEffect } from 'react';
import { X, Send, Bot, Trash2 } from 'lucide-react';

import { useMentor } from '@/lib/hooks/use-mentor';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lessonContext?: string;
  moduleSlug?: string;
  lessonTitle?: string;
}

export function AiMentorSidebar({
  isOpen,
  onClose,
  lessonContext,
  moduleSlug,
  lessonTitle,
}: Props) {
  const { messages, isLoading, attemptCount, sendMessage, clearChat } = useMentor({
    context: 'lab',
    moduleSlug,
    lessonTitle,
    questionText: lessonContext,
  });

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const value = inputRef.current?.value.trim();
    if (!value || isLoading) return;
    if (inputRef.current) inputRef.current.value = '';
    await sendMessage(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl border-l border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-purple-600" />
          <span className="font-semibold text-gray-800">AI Mentor</span>
          <span className="text-xs text-gray-500">(Phantom)</span>
        </div>
        <div className="flex items-center gap-1">
          {/* Attempt count göstergesi */}
          <span className="text-xs text-purple-400 bg-purple-50 px-2 py-0.5 rounded-full">
            {attemptCount === 1 ? 'İpucu modu' : attemptCount === 2 ? 'Açık ipucu' : 'Örnek modu'}
          </span>
          <button
            onClick={clearChat}
            title="Sohbeti temizle"
            className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mesaj listesi */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Yükleniyor göstergesi */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2 text-sm text-gray-500 italic">
              Phantom düşünüyor...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input alanı */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            onKeyDown={handleKeyDown}
            placeholder="Soru sor..."
            disabled={isLoading}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400 disabled:opacity-60"
          />
          <button
            onClick={() => void handleSend()}
            disabled={isLoading}
            className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
