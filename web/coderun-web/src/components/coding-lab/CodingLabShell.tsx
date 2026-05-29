'use client';

import React, { ReactNode } from 'react';
import { Clock, Zap, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type ChallengeDifficulty = 'Kolay' | 'Orta' | 'Zor';

export interface CodingLabMeta {
  title: string;
  difficulty?: ChallengeDifficulty;
  xpReward?: number;
  estimatedMinutes?: number;
  topic?: string;
  questionIndex?: number;
  totalQuestions?: number;
}

interface CodingLabShellProps {
  meta: CodingLabMeta;
  problemPanel: ReactNode;
  editorPanel: ReactNode;
  resultsPanel?: ReactNode;
  mentorPanel?: ReactNode;
  toolbar?: ReactNode;
  onPrev?: () => void;
  onNext?: () => void;
  canPrev?: boolean;
  canNext?: boolean;
  className?: string;
}

const difficultyStyles: Record<ChallengeDifficulty, string> = {
  Kolay: 'bg-secondary/15 text-secondary border-secondary/30',
  Orta: 'bg-amber-500/15 text-amber-700 border-amber-500/30',
  Zor: 'bg-error-container text-error border-error/30',
};

export function CodingLabShell({
  meta,
  problemPanel,
  editorPanel,
  resultsPanel,
  mentorPanel,
  toolbar,
  onPrev,
  onNext,
  canPrev = false,
  canNext = false,
  className,
}: CodingLabShellProps) {
  const difficulty = meta.difficulty ?? 'Orta';

  return (
    <div
      className={cn(
        'flex min-h-[calc(100vh-5rem)] flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm',
        className,
      )}
    >
      {/* Top chrome */}
      <div className="flex flex-wrap items-center gap-3 border-b border-outline-variant bg-surface-container-low px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
              Kod Laboratuvarı
            </span>
            <span className={cn('rounded-lg border px-2 py-0.5 text-[10px] font-bold uppercase', difficultyStyles[difficulty])}>
              {difficulty}
            </span>
            {meta.topic && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-surface-container px-2 py-0.5 text-[10px] font-semibold text-on-surface-variant">
                <Tag className="h-3 w-3" />
                {meta.topic}
              </span>
            )}
            {meta.xpReward != null && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-primary-fixed px-2 py-0.5 text-[10px] font-bold text-primary">
                <Zap className="h-3 w-3" />
                +{meta.xpReward} XP
              </span>
            )}
            {meta.estimatedMinutes != null && (
              <span className="inline-flex items-center gap-1 text-[10px] text-on-surface-variant">
                <Clock className="h-3 w-3" />~{meta.estimatedMinutes} dk
              </span>
            )}
          </div>
          <h1 className="mt-1 truncate font-heading text-lg font-bold text-on-surface">{meta.title}</h1>
        </div>

        {(onPrev || onNext) && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrev}
              disabled={!canPrev}
              className="inline-flex items-center gap-1 rounded-xl border border-outline-variant px-3 py-1.5 text-xs font-semibold text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" /> Önceki
            </button>
            {meta.questionIndex != null && meta.totalQuestions != null && (
              <span className="font-mono text-xs text-on-surface-variant">
                {meta.questionIndex + 1}/{meta.totalQuestions}
              </span>
            )}
            <button
              type="button"
              onClick={onNext}
              disabled={!canNext}
              className="inline-flex items-center gap-1 rounded-xl border border-outline-variant px-3 py-1.5 text-xs font-semibold text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-40"
            >
              Sonraki <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {toolbar && <div className="flex shrink-0 flex-wrap items-center gap-2">{toolbar}</div>}
      </div>

      {/* Split body */}
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(280px,34%)_1fr] xl:grid-cols-[minmax(300px,32%)_1fr_minmax(260px,28%)]">
        <aside className="flex min-h-0 flex-col overflow-hidden border-b border-outline-variant lg:border-b-0 lg:border-r">
          <div className="border-b border-outline-variant px-4 py-2">
            <p className="font-label text-label-sm uppercase tracking-wide text-on-surface-variant">Soru & Talimatlar</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4">{problemPanel}</div>
        </aside>

        <main className="flex min-h-0 flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-hidden">{editorPanel}</div>
          {resultsPanel && (
            <div className="max-h-[220px] shrink-0 overflow-hidden border-t border-outline-variant">
              {resultsPanel}
            </div>
          )}
        </main>

        {mentorPanel && (
          <aside className="hidden min-h-0 flex-col overflow-hidden border-t border-outline-variant xl:flex xl:border-l xl:border-t-0">
            {mentorPanel}
          </aside>
        )}
      </div>
    </div>
  );
}

export function CodingLabProblemContent({
  instructions,
  hint,
  examples,
}: {
  instructions: string;
  hint?: string | null;
  examples?: Array<{ input: string; output: string }>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="prose prose-sm max-w-none">
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-on-surface">{instructions}</pre>
      </div>

      {examples && examples.length > 0 && (
        <div>
          <p className="mb-2 font-label text-label-sm uppercase tracking-wide text-on-surface-variant">Örnekler</p>
          <div className="space-y-2">
            {examples.map((ex, i) => (
              <div key={i} className="rounded-xl border border-outline-variant bg-surface-container-low p-3 font-mono text-xs">
                <p className="text-on-surface-variant">
                  <span className="font-bold text-primary">Girdi:</span> {ex.input || '(boş)'}
                </p>
                <p className="mt-1 text-on-surface">
                  <span className="font-bold text-secondary">Çıktı:</span> {ex.output}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {hint && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-200">
          💡 <span className="font-semibold">İpucu:</span> {hint}
        </div>
      )}
    </div>
  );
}
