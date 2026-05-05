// Coderun Stitch Design System — Ghostie Components

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { ReactNode } from 'react';

type GhostieSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type GhostieMood = 'happy' | 'thinking' | 'celebrating' | 'helping' | 'neutral';

const sizeMap: Record<GhostieSize, string> = {
  xs: 'w-6 h-6 text-sm',
  sm: 'w-8 h-8 text-base',
  md: 'w-12 h-12 text-2xl',
  lg: 'w-16 h-16 text-3xl',
  xl: 'w-24 h-24 text-5xl',
};

const moodEmoji: Record<GhostieMood, string> = {
  happy: '👻',
  thinking: '🤔',
  celebrating: '🎉',
  helping: '💡',
  neutral: '👻',
};

interface GhostieAvatarProps {
  size?: GhostieSize;
  mood?: GhostieMood;
  glow?: boolean;
  className?: string;
}

export function GhostieAvatar({
  size = 'md',
  mood = 'happy',
  glow = false,
  className,
}: GhostieAvatarProps) {
  return (
    <div
      className={cn(
        'rounded-full bg-primary-fixed flex items-center justify-center flex-shrink-0',
        sizeMap[size],
        glow && 'shadow-glow animate-pulse-glow',
        className
      )}
    >
      <span role="img" aria-label="Ghostie mascot">
        {moodEmoji[mood]}
      </span>
    </div>
  );
}

// Ghostie speech bubble
interface GhostieBubbleProps {
  message: string;
  size?: GhostieSize;
  mood?: GhostieMood;
  className?: string;
}

export function GhostieBubble({ message, size = 'sm', mood = 'helping', className }: GhostieBubbleProps) {
  return (
    <div className={cn('flex items-start gap-2', className)}>
      <GhostieAvatar size={size} mood={mood} />
      <div className="ghostie-bubble max-w-xs">
        <p className="font-sans text-body-sm text-on-surface leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

// Ghostie motivational card — used on dashboard and leaderboard
interface GhostieMotivationCardProps {
  message: string;
  title?: string;
  mood?: GhostieMood;
  className?: string;
}

export function GhostieMotivationCard({
  message,
  title = 'Ghostie AI',
  mood = 'happy',
  className,
}: GhostieMotivationCardProps) {
  return (
    <div
      className={cn(
        'cr-card p-4 bg-gradient-to-br from-primary-fixed to-white border-primary/20',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <GhostieAvatar size="md" mood={mood} glow />
        <div className="min-w-0">
          <p className="font-label text-label-sm text-primary uppercase tracking-wide mb-1">
            {title}
          </p>
          <p className="font-sans text-body-sm text-on-surface leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
}

// Ghostie AI mentor panel — right sidebar panel
interface GhostieMentorPanelProps {
  context?: string;
  messages?: Array<{ role: 'user' | 'assistant'; content: string }>;
  onSendMessage?: (message: string) => void;
  quickActions?: string[];
  isLoading?: boolean;
  className?: string;
}

export function GhostieMentorPanel({
  context,
  messages = [],
  onSendMessage,
  quickActions = ['Give me a hint', 'Explain simply', 'Show a tiny example', 'Why is this wrong?'],
  isLoading = false,
  className,
}: GhostieMentorPanelProps) {
  return (
    <div className={cn('flex flex-col h-full bg-white border-l border-outline-variant', className)}>
      {/* Header */}
      <div className="p-4 border-b border-outline-variant bg-primary-fixed/50">
        <div className="flex items-center gap-2 mb-1">
          <GhostieAvatar size="sm" mood="helping" />
          <div>
            <p className="font-heading text-sm font-bold text-on-surface">Ghostie AI</p>
            <p className="font-label text-label-sm text-on-surface-variant">AI Mentor</p>
          </div>
        </div>
        {context && (
          <div className="mt-2 px-2 py-1 bg-white/60 rounded-lg">
            <p className="font-label text-label-sm text-on-surface-variant truncate">
              📍 {context}
            </p>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        {messages.length === 0 && (
          <GhostieBubble
            message="Merhaba! Ben Ghostie AI. Herhangi bir konuda yardıma ihtiyacın olursa buradayım! 👋"
            mood="happy"
          />
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              'flex',
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {msg.role === 'assistant' && (
              <GhostieBubble message={msg.content} mood="helping" />
            )}
            {msg.role === 'user' && (
              <div className="max-w-[80%] bg-primary text-white rounded-tl-2xl rounded-tr rounded-bl-2xl rounded-br-2xl px-4 py-2">
                <p className="font-sans text-body-sm leading-relaxed">{msg.content}</p>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2">
            <GhostieAvatar size="xs" mood="thinking" />
            <div className="ghostie-bubble">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="px-4 py-2 border-t border-outline-variant">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {quickActions.map((action) => (
            <button
              key={action}
              onClick={() => onSendMessage?.(action)}
              className="cr-badge cr-badge-primary hover:bg-primary hover:text-white transition-colors cursor-pointer text-xs"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-outline-variant">
        <MentorInput onSend={onSendMessage} />
      </div>
    </div>
  );
}

function MentorInput({ onSend }: { onSend?: (msg: string) => void }) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const value = inputRef.current?.value.trim();
    if (value) {
      onSend?.(value);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 bg-surface-container rounded-full px-4 py-2">
      <input
        ref={inputRef}
        type="text"
        placeholder="Ghostie'ye sor..."
        className="flex-1 bg-transparent font-sans text-body-sm text-on-surface placeholder:text-outline outline-none"
        onKeyDown={handleKeyDown}
      />
      <button
        type="button"
        onClick={handleSend}
        className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary-container transition-colors"
        aria-label="Send message"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" />
        </svg>
      </button>
    </div>
  );
}
