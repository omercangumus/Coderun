'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
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
      <p className="text-lg font-bold text-white leading-relaxed">{question.questionText}</p>

      <div className="relative">
        <textarea
          value={currentAnswer}
          onChange={e => onChange(e.target.value.slice(0, MAX_LENGTH))}
          placeholder="Cevabınızı buraya yazın..."
          rows={8}
          className="w-full bg-slate-800/50 border border-slate-600 rounded-xl p-4 font-mono text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
        />
        <span className="absolute bottom-3 right-3 text-xs text-slate-500">
          {currentAnswer.length}/{MAX_LENGTH}
        </span>
      </div>

      {hint && (
        <div className="border border-slate-700 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowHint(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-400 hover:text-white hover:bg-slate-700/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <span>İpucu Göster</span>
            </div>
            {showHint ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showHint && (
            <div className="px-4 py-3 bg-yellow-500/10 border-t border-slate-700 text-sm text-yellow-200">
              {hint}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
