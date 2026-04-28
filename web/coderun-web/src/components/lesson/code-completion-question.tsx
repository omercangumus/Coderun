'use client';

import { cn } from '@/lib/utils/cn';
import type { QuestionResponse } from '@/lib/types/module.types';

interface Props {
  question: QuestionResponse;
  currentAnswer: string;
  onChange: (answer: string) => void;
}

export function CodeCompletionQuestion({ question, currentAnswer, onChange }: Props) {
  const parts = question.questionText.split('___');

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-400 font-medium">Boşluğu doldurun:</p>
      <div className="bg-[#1e1e1e] rounded-xl p-4 font-mono text-sm">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-slate-500 text-xs ml-2">code.py</span>
        </div>
        <div className="flex flex-wrap items-center gap-1 text-slate-300 leading-relaxed">
          {parts.map((part, idx) => (
            <span key={idx}>
              <span className="whitespace-pre-wrap">{part}</span>
              {idx < parts.length - 1 && (
                <input
                  type="text"
                  value={currentAnswer}
                  onChange={e => onChange(e.target.value)}
                  placeholder="..."
                  className={cn(
                    'inline-block bg-transparent border-b-2 border-accent text-accent',
                    'font-mono text-sm px-1 min-w-[80px] focus:outline-none',
                    'placeholder:text-slate-600'
                  )}
                  style={{ width: Math.max(80, currentAnswer.length * 9) + 'px' }}
                />
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
