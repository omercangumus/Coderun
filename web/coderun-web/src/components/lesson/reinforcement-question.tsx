'use client';

import { QuestionRouter } from './question-router';
import type { QuestionResponse } from '@/lib/types/module.types';

interface ReinforcementQuestionProps {
  question: QuestionResponse;
  onAnswer: (answer: string) => void;
}

/**
 * ReinforcementQuestion — renders a reinforcement question using QuestionRouter.
 * Supports all question types (fill_in_blank, multiple_choice, reorder, etc.)
 * by delegating to QuestionRouter internally.
 */
export function ReinforcementQuestion({
  question,
  onAnswer,
}: ReinforcementQuestionProps) {
  return (
    <div className="animate-fade-in">
      {/* Reinforcement header */}
      <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-secondary-container/30 border border-secondary/20">
        <span className="text-2xl">🔄</span>
        <div>
          <p className="text-label-caps text-secondary font-bold uppercase tracking-wider">
            Pekiştirme Sorusu
          </p>
          <p className="text-body-sm text-on-surface-variant">
            Bir önceki soruyu pekiştirmek için bu soruyu cevaplayın
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl border-2 border-secondary/30 bg-surface-container-lowest">
        <QuestionRouter
          question={question}
          currentAnswer=""
          onAnswer={onAnswer}
        />
      </div>
    </div>
  );
}
