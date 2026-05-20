'use client';

import { cn } from '@/lib/utils/cn';
import { useHaptics } from '@/lib/hooks/use-haptics';
import type { QuestionResponse } from '@/lib/types/module.types';

interface Props {
  question: QuestionResponse;
  selectedAnswer: string | undefined;
  onSelect: (answer: string) => void;
}

const LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

const LABEL_COLORS = [
  'bg-blue-500/20 text-blue-400 border-blue-500/30 group-hover:bg-blue-500/30',
  'bg-purple-500/20 text-purple-400 border-purple-500/30 group-hover:bg-purple-500/30',
  'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 group-hover:bg-emerald-500/30',
  'bg-amber-500/20 text-amber-400 border-amber-500/30 group-hover:bg-amber-500/30',
  'bg-rose-500/20 text-rose-400 border-rose-500/30 group-hover:bg-rose-500/30',
  'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 group-hover:bg-cyan-500/30',
];

export function MultipleChoiceQuestion({ question, selectedAnswer, onSelect }: Props) {
  const choices = (question.options?.choices ?? []) as string[];
  const { vibrateTap } = useHaptics();

  const handleSelect = (choice: string) => {
    vibrateTap();
    onSelect(choice);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Question text */}
      <div className="flex flex-col gap-3">
        <p className="text-lg font-bold text-on-surface leading-relaxed">{question.questionText}</p>
        {question.codeBlock && (
          <div className="rounded-xl bg-[#1E1E2E] border border-outline-variant overflow-hidden">
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            <pre className="px-4 py-3 text-sm text-green-300 font-mono overflow-x-auto leading-relaxed">
              <code>{question.codeBlock}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Choices */}
      <div className="flex flex-col gap-2.5">
        {choices.map((choice, idx) => {
          const isSelected = selectedAnswer === choice;
          const labelColors = LABEL_COLORS[idx % LABEL_COLORS.length];

          return (
            <button
              key={choice}
              onClick={() => handleSelect(choice)}
              className={cn(
                'group flex items-center gap-3 text-left px-4 py-3.5 rounded-2xl border-2 text-sm transition-all duration-150 w-full',
                isSelected
                  ? 'border-primary bg-primary/10 text-on-surface shadow-md scale-[1.01]'
                  : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary/50 hover:bg-primary/5 hover:text-on-surface active:scale-[0.99]'
              )}
            >
              {/* Label circle */}
              <span
                className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold border transition-colors duration-150',
                  isSelected
                    ? 'bg-primary text-white border-primary'
                    : labelColors
                )}
              >
                {LABELS[idx] ?? idx + 1}
              </span>

              {/* Choice text */}
              <span className="flex-1 font-medium leading-snug">{choice}</span>

              {/* Selected indicator */}
              {isSelected && (
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
