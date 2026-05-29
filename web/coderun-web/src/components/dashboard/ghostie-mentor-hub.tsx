'use client';

import { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { GhostieReaction } from '@/components/ghostie/GhostieReaction';
import { useMentor } from '@/lib/hooks/use-mentor';
import { cn } from '@/lib/utils/cn';

const QUICK_PROMPTS = [
  'Bugün ne çalışmalıyım?',
  'Python ipucu ver',
  'Kod pratiği öner',
  'Motivasyon ver',
];

export function GhostieMentorHub({ className }: { className?: string }) {
  const [input, setInput] = useState('');
  const { messages, sendMessage, isLoading } = useMentor({ context: 'general' });

  const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant');

  const handleSend = (text?: string) => {
    const value = (text ?? input).trim();
    if (!value || isLoading) return;
    sendMessage(value);
    setInput('');
  };

  return (
    <section
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-b from-primary-fixed/60 to-surface-container-lowest',
        className,
      )}
    >
      <div className="border-b border-outline-variant/60 px-5 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <div>
            <h2 className="font-heading text-base font-bold text-on-surface">Ghostie AI Mentor</h2>
            <p className="font-sans text-xs text-on-surface-variant">Kişisel öğrenme koçun</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
        <GhostieReaction
          state={isLoading ? 'thinking' : 'idle'}
          message={
            lastAssistant?.content ??
            'Merhaba! Öğrenme planın, kod pratiğin veya motivasyonun için buradayım.'
          }
          size={88}
          preferAnimation
          className="border-none bg-transparent p-0 shadow-none"
        />

        <div className="flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="rounded-full border border-primary/25 bg-surface-container-lowest px-3 py-1.5 font-sans text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-on-primary disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-outline-variant/60 p-4">
        <div className="flex items-center gap-2 rounded-2xl border border-outline-variant bg-surface-container-lowest px-3 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ghostie'ye sor..."
            className="flex-1 bg-transparent font-sans text-sm text-on-surface outline-none placeholder:text-outline"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-on-primary transition-opacity hover:opacity-90 disabled:opacity-40"
            aria-label="Gönder"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
