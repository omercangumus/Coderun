'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { GhostieReaction } from '@/components/ghostie/GhostieReaction';
import type { GhostieState } from '@/lib/ghostie-assets';
import { cn } from '@/lib/utils/cn';

interface FloatingGhostieMentorProps {
  state: GhostieState;
  message: string;
  scoreBanner?: React.ReactNode;
  className?: string;
}

/** Kod labında sağ sütun yerine kompakt yüzen mentor. */
export function FloatingGhostieMentor({
  state,
  message,
  scoreBanner,
  className,
}: FloatingGhostieMentorProps) {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={cn(
        'pointer-events-none fixed bottom-6 right-6 z-40 flex max-w-[min(100vw-1.5rem,320px)] flex-col items-end gap-2',
        className,
      )}
    >
      {open && (
        <div className="pointer-events-auto animate-fade-in rounded-2xl border border-outline-variant bg-surface-container-lowest/95 p-3 shadow-lg backdrop-blur-md">
          <div className="flex items-start gap-3">
            <GhostieReaction state={state} size={56} preferAnimation className="shrink-0" />
            <p className="flex-1 pt-1 text-sm leading-snug text-on-surface">{message}</p>
          </div>
          {scoreBanner && <div className="mt-3">{scoreBanner}</div>}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary px-4 py-2 text-xs font-bold text-on-primary shadow-md transition-transform hover:scale-105 active:scale-95"
        aria-expanded={open}
        aria-label={open ? 'Mentoru gizle' : 'Mentoru göster'}
      >
        <Sparkles className="h-4 w-4" />
        Ghostie
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </button>
    </div>
  );
}
