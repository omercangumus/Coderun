'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import type { QuestionResponse } from '@/lib/types/module.types';
import { QuizHintCard, QuizQuestionHeader } from './quiz-ui';

interface Props {
  question: QuestionResponse;
  currentAnswer: string;
  onChange: (answer: string) => void;
}

export function CodeCompletionQuestion({ question, currentAnswer, onChange }: Props) {
  const choices = (question.options as { choices?: string[] })?.choices;
  const hasChoices = choices && choices.length > 0;
  const [selectedChoice, setSelectedChoice] = useState<string | null>(currentAnswer || null);

  const handleChoiceSelect = (choice: string) => {
    setSelectedChoice(choice);
    onChange(choice);
  };

  // Code block display (if question has ___ pattern or code_block)
  const codeContent = question.codeBlock || question.questionText;
  const hasCodeBlock = codeContent.includes('___') || question.codeBlock;

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <QuizQuestionHeader questionText={question.questionText.replace(/___/g, '______')} />
      {question.hint && <QuizHintCard hint={question.hint} />}

      {/* Code block display */}
      {hasCodeBlock && (
        <div className="overflow-hidden rounded-2xl border border-outline-variant bg-[#1E1E2E] p-4 font-mono text-sm">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-slate-500 text-xs ml-2">code.py</span>
          </div>
          <div className="flex flex-wrap items-center gap-1 text-slate-300 leading-relaxed">
            {codeContent.split('___').map((part, idx, arr) => (
              <span key={idx}>
                <span className="whitespace-pre-wrap">{part}</span>
                {idx < arr.length - 1 && (
                  hasChoices ? (
                    <span
                      className={cn(
                        'inline-block min-w-[80px] px-2 py-0.5 mx-1 rounded-md border-2 border-dashed text-center transition-all duration-200',
                        selectedChoice
                          ? 'border-primary bg-primary/20 text-primary font-semibold'
                          : 'border-accent/50 text-accent/60 animate-pulse'
                      )}
                    >
                      {selectedChoice || '______'}
                    </span>
                  ) : (
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
                  )
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* If choices are available, show them as selectable buttons */}
      {hasChoices ? (
        <div className="space-y-2">
          <p className="font-label text-label-sm uppercase tracking-wide text-on-surface-variant">
            Seçenekler
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {choices.map((choice, idx) => {
              const isSelected = selectedChoice === choice;
              return (
                <button
                  key={idx}
                  onClick={() => handleChoiceSelect(choice)}
                  className={cn(
                    'relative p-4 rounded-xl border-2 text-left font-mono text-sm',
                    'transition-all duration-200 ease-out',
                    'hover:shadow-lg active:scale-[0.98]',
                    isSelected
                      ? 'border-primary bg-primary/10 text-on-surface shadow-primary ring-1 ring-primary/30'
                      : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary/50 hover:bg-surface-container',
                  )}
                >
                  <span className={cn(
                    'inline-flex items-center justify-center w-6 h-6 rounded-full mr-3 text-xs font-bold',
                    isSelected
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container text-on-surface-variant'
                  )}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className={cn(
                    'font-semibold',
                    isSelected ? 'text-on-surface' : ''
                  )}>
                    {choice}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : !hasCodeBlock ? (
        /* Fallback: simple text input when no code block and no choices */
        <div className="overflow-hidden rounded-2xl border border-outline-variant bg-[#1E1E2E] p-4 font-mono text-sm">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-slate-500 text-xs ml-2">code.py</span>
          </div>
          <div className="flex flex-wrap items-center gap-1 text-slate-300 leading-relaxed">
            <span className="whitespace-pre-wrap">{question.questionText}</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700">
            <input
              type="text"
              value={currentAnswer}
              onChange={e => onChange(e.target.value)}
              placeholder="Cevabınızı yazın..."
              className={cn(
                'w-full bg-transparent border-b-2 border-accent text-accent',
                'font-mono text-sm px-1 py-2 focus:outline-none',
                'placeholder:text-slate-600'
              )}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
