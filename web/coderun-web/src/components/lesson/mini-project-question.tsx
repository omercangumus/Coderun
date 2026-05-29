'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { QuestionResponse } from '@/lib/types/module.types';

interface Props {
  question: QuestionResponse;
  currentAnswer: string;
  onChange: (answer: string) => void;
}

const MAX_LENGTH = 500;

export function MiniProjectQuestion({ question, currentAnswer, onChange }: Props) {
  const [showHint, setShowHint] = useState(false);
  const hint = (question.options as Record<string, string> | null)?.hint;

  return (
    <div className="flex flex-col gap-4">
      <p className="font-heading text-lg font-bold text-on-surface leading-relaxed">
        {question.questionText}
      </p>

      <div className="relative">
        <textarea
          value={currentAnswer}
          onChange={e => onChange(e.target.value.slice(0, MAX_LENGTH))}
          placeholder="Cevabınızı buraya yazın..."
          rows={8}
          className={cn(
            'w-full rounded-xl p-4 font-mono text-sm resize-none',
            'bg-surface-container border border-outline-variant',
            'text-on-surface placeholder:text-on-surface-variant/50',
            'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40'
          )}
        />
        <span className="absolute bottom-3 right-3 font-sans text-xs text-on-surface-variant">
          {currentAnswer.length}/{MAX_LENGTH}
        </span>
      </div>

      {hint && (
        <div className="border border-outline-variant rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowHint(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-xp-gold" />
              <span>İpucu Göster</span>
            </div>
            {showHint ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showHint && (
            <div className="px-4 py-3 bg-xp-gold/10 border-t border-outline-variant text-sm text-on-surface">
              {hint}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
