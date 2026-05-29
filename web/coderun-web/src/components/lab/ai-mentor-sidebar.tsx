'use client';

// AI Mentor sidebar — OpenRouter API ile gerçek zamanlı sohbet.

import { useRef, useEffect } from 'react';
import { X, Send, Bot, Trash2 } from 'lucide-react';

import { useMentor } from '@/lib/hooks/use-mentor';
import { GhostieAvatar } from '../ghostie/GhostieAvatar';
import { GhostieReaction } from '../ghostie/GhostieReaction';

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
    <div className="fixed right-0 top-0 h-full w-80 bg-surface-container-lowest shadow-2xl border-l border-outline-variant flex flex-col z-50 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-outline-variant bg-surface-container-low">
        <div className="flex items-center gap-2">
          <GhostieAvatar state="idle" size={24} />
          <span className="font-semibold text-on-surface">Ghostie AI</span>
          <span className="text-xs text-on-surface-variant">(Mentor)</span>
        </div>
        <div className="flex items-center gap-1">
          {/* Attempt count göstergesi */}
          <span className="text-xs text-tertiary bg-tertiary-container/30 px-2 py-0.5 rounded-full font-semibold">
            {attemptCount === 1 ? 'İpucu modu' : attemptCount === 2 ? 'Açık ipucu' : 'Örnek modu'}
          </span>
          <button
            onClick={clearChat}
            title="Sohbeti temizle"
            className="text-on-surface-variant hover:text-on-surface p-1 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mesaj listesi */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        {messages.length === 0 && (
           <div className="flex justify-center mb-6">
             <GhostieReaction state="idle" message="Merhaba! Ben Ghostie AI. Herhangi bir konuda yardıma ihtiyacın olursa buradayım! 👋" size={80} />
           </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-primary text-white rounded-br-sm'
                  : 'bg-surface-container text-on-surface rounded-bl-sm border border-outline/10'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Yükleniyor göstergesi */}
        {isLoading && (
          <div className="flex justify-start items-center gap-2">
            <GhostieAvatar state="thinking" size={24} />
            <div className="bg-surface-container rounded-2xl rounded-bl-sm px-4 py-2 text-sm text-on-surface-variant italic">
              Ghostie düşünüyor...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input alanı */}
      <div className="p-4 border-t border-outline-variant">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            onKeyDown={handleKeyDown}
            placeholder="Soru sor..."
            disabled={isLoading}
            className="flex-1 border border-outline-variant bg-surface-container text-on-surface rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary disabled:opacity-60"
          />
          <button
            onClick={() => void handleSend()}
            disabled={isLoading}
            className="p-2 bg-primary text-white rounded-lg hover:bg-primary-container disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
