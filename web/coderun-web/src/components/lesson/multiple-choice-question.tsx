'use client';

import { cn } from '@/lib/utils/cn';
import type { QuestionResponse } from '@/lib/types/module.types';

interface Props {
  question: QuestionResponse;
  selectedAnswer: string | undefined;
  onSelect: (answer: string) => void;
}

const LABELS = ['A', 'B', 'C', 'D'];

export function MultipleChoiceQuestion({ question, selectedAnswer, onSelect }: Props) {
  const choices = (question.options?.choices ?? []) as string[];

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-bold text-white leading-relaxed">{question.questionText}</p>
      <div className="flex flex-col gap-2">
        {choices.map((choice, idx) => (
          <button
            key={choice}
            onClick={() => onSelect(choice)}
            className={cn(
              'flex items-center gap-3 text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150',
              selectedAnswer === choice
                ? 'border-accent bg-accent/20 text-white'
                : 'border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700/30'
            )}
          >
            <span className={cn(
              'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
              selectedAnswer === choice ? 'bg-accent text-white' : 'bg-slate-700 text-slate-400'
            )}>
              {LABELS[idx] ?? idx + 1}
            </span>
            <span>{choice}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
