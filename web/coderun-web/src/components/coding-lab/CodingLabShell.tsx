'use client';

import React, { ReactNode, useState } from 'react';
import { Clock, Zap, Tag, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
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
  toolbar,
  onPrev,
  onNext,
  canPrev = false,
  canNext = false,
  className,
}: CodingLabShellProps) {
  const difficulty = meta.difficulty ?? 'Orta';
  const [problemOpen, setProblemOpen] = useState(true);

  return (
    <div
      className={cn(
        'relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm',
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-3 border-b border-outline-variant bg-surface-container-low px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
              Kod Labı
            </span>
            <span
              className={cn(
                'rounded-lg border px-2 py-0.5 text-[10px] font-bold uppercase',
                difficultyStyles[difficulty],
              )}
            >
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
              className="inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-400 transition-colors hover:text-white disabled:opacity-30"
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
              className="inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-400 transition-colors hover:text-white disabled:opacity-30"
            >
              Sonraki <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {toolbar && <div className="flex shrink-0 flex-wrap items-center gap-2">{toolbar}</div>}
      </div>

      <div
        className={cn(
          'grid min-h-0 flex-1 grid-cols-1',
          problemOpen
            ? 'lg:grid-cols-[minmax(260px,30%)_1fr]'
            : 'lg:grid-cols-1',
        )}
      >
        <aside
          className={cn(
            'flex min-h-0 flex-col overflow-hidden border-b border-outline-variant lg:border-b-0 lg:border-r',
            !problemOpen && 'hidden lg:hidden',
          )}
        >
          <div className="flex items-center justify-between border-b border-outline-variant px-4 py-2">
            <p className="font-label text-label-sm uppercase tracking-wide text-on-surface-variant">
              Soru & Talimatlar
            </p>
            <button
              type="button"
              onClick={() => setProblemOpen(false)}
              className="hidden rounded-lg p-1 text-on-surface-variant hover:bg-surface-container lg:inline-flex"
              aria-label="Sol paneli kapat"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">{problemPanel}</div>
        </aside>

        <main className="flex min-h-0 flex-col overflow-hidden">
          {!problemOpen && (
            <div className="border-b border-outline-variant px-3 py-2 lg:block">
              <button
                type="button"
                onClick={() => setProblemOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-outline-variant px-3 py-1.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
              >
                <PanelLeftOpen className="h-4 w-4" />
                Soruyu göster
              </button>
            </div>
          )}
          <div className="min-h-[300px] flex-1 overflow-hidden">{editorPanel}</div>
          {resultsPanel && (
            <div className="h-[220px] shrink-0 overflow-hidden border-t border-gray-700">
              {resultsPanel}
            </div>
          )}
        </main>
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
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-on-surface">
          {instructions}
        </pre>
      </div>

      {examples && examples.length > 0 && (
        <div>
          <p className="mb-2 font-label text-label-sm uppercase tracking-wide text-on-surface-variant">
            Örnekler
          </p>
          <div className="space-y-2">
            {examples.map((ex, i) => (
              <div
                key={i}
                className="rounded-xl border border-outline-variant bg-surface-container-low p-3 font-mono text-xs"
              >
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
