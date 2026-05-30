'use client';

import { Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function QuizQuestionHeader({
  questionText,
  codeBlock,
}: {
  questionText: string;
  codeBlock?: string | null;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-heading text-lg font-bold leading-relaxed text-on-surface md:text-xl">
        {questionText}
      </p>
      {codeBlock && (
        <div className="overflow-hidden rounded-2xl border border-outline-variant bg-[#1E1E2E] shadow-sm">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
            <span className="ml-2 font-mono text-[10px] text-white/40">kod.py</span>
          </div>
          <pre className="overflow-x-auto px-4 py-3 font-mono text-sm leading-relaxed text-green-300">
            <code>{codeBlock}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

export function QuizHintCard({ hint }: { hint: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary-fixed/80 to-surface-container-lowest p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15">
        <Lightbulb className="h-4 w-4 text-primary" />
      </div>
      <div>
        <p className="font-label text-label-sm uppercase tracking-wide text-primary">İpucu</p>
        <p className="mt-1 font-sans text-sm leading-relaxed text-on-surface-variant">{hint}</p>
      </div>
    </div>
  );
}

const LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

const LABEL_COLORS = [
  'bg-blue-500/15 text-blue-600 border-blue-500/25',
  'bg-purple-500/15 text-purple-600 border-purple-500/25',
  'bg-emerald-500/15 text-emerald-600 border-emerald-500/25',
  'bg-amber-500/15 text-amber-600 border-amber-500/25',
  'bg-rose-500/15 text-rose-600 border-rose-500/25',
  'bg-cyan-500/15 text-cyan-600 border-cyan-500/25',
];

export function QuizOptionButton({
  label,
  index,
  isSelected,
  onClick,
  disabled,
}: {
  label: string;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  const labelColors = LABEL_COLORS[index % LABEL_COLORS.length];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left text-sm transition-all duration-150',
        isSelected
          ? 'scale-[1.01] border-primary bg-primary/10 text-on-surface shadow-md'
          : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary/40 hover:bg-primary/5 hover:text-on-surface active:scale-[0.99]',
        disabled && 'cursor-not-allowed opacity-60',
      )}
    >
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-xs font-bold transition-colors',
          isSelected ? 'border-primary bg-primary text-on-primary' : labelColors,
        )}
      >
        {LABELS[index] ?? index + 1}
      </span>
      <span className="flex-1 font-medium leading-snug">{label}</span>
      {isSelected && (
        <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-on-primary">
          Seçildi
        </span>
      )}
    </button>
  );
}
