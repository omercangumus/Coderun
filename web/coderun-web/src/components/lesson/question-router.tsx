'use client';

import type { QuestionResponse } from '@/lib/types/module.types';
import { MultipleChoiceQuestion } from './multiple-choice-question';
import { CodeCompletionQuestion } from './code-completion-question';
import { MiniProjectQuestion } from './mini-project-question';
import { FillInBlankQuestion } from './fill-in-blank-question';
import { ReorderQuestion } from './reorder-question';
import { SpotTheBugQuestion } from './spot-the-bug-question';
import { MultiSelectQuestion } from './multi-select-question';
import { TrueFalseReasonQuestion } from './true-false-reason-question';
import { CodeRunnerAssignment } from './code-runner-assignment';

interface QuestionRouterProps {
  question: QuestionResponse;
  currentAnswer: string;
  selectedAnswer?: string;
  onAnswer: (answer: string) => void;
  questionIndex?: number;
  totalQuestions?: number;
  onPrevQuestion?: () => void;
  onNextQuestion?: () => void;
  canPrevQuestion?: boolean;
  canNextQuestion?: boolean;
}

export function QuestionRouter({
  question,
  currentAnswer,
  selectedAnswer,
  onAnswer,
  questionIndex,
  totalQuestions,
  onPrevQuestion,
  onNextQuestion,
  canPrevQuestion,
  canNextQuestion,
}: QuestionRouterProps) {
  const { questionType, questionText, options, hint, codeBlock, wordBank } = question;

  switch (questionType) {
    case 'multiple_choice': {
      return (
        <MultipleChoiceQuestion
          question={question}
          selectedAnswer={selectedAnswer ?? currentAnswer}
          onSelect={onAnswer}
        />
      );
    }

    case 'code_completion':
      return (
        <CodeCompletionQuestion
          question={question}
          currentAnswer={currentAnswer}
          onChange={onAnswer}
        />
      );

    case 'code_editor':
      return (
        <CodeRunnerAssignment
          question={question}
          currentAnswer={currentAnswer}
          onChange={onAnswer}
          questionIndex={questionIndex}
          totalQuestions={totalQuestions}
          onPrev={onPrevQuestion}
          onNext={onNextQuestion}
          canPrev={canPrevQuestion}
          canNext={canNextQuestion}
        />
      );

    case 'fill_in_blank': {
      if (!codeBlock || !wordBank) {
        return <FallbackQuestion questionText={questionText} />;
      }
      return (
        <FillInBlankQuestion
          questionText={questionText}
          codeBlock={codeBlock}
          wordBank={wordBank}
          onAnswer={onAnswer}
          hint={hint ?? undefined}
        />
      );
    }

    case 'reorder': {
      const items = (options as { items?: string[] })?.items ?? [];
      if (items.length === 0) {
        return <FallbackQuestion questionText={questionText} />;
      }
      return (
        <ReorderQuestion
          questionText={questionText}
          items={items}
          onAnswer={onAnswer}
          hint={hint ?? undefined}
        />
      );
    }

    case 'spot_the_bug': {
      if (!codeBlock) {
        return <FallbackQuestion questionText={questionText} />;
      }
      const fixOptions = (options as { fix_options?: string[] })?.fix_options ?? [];
      return (
        <SpotTheBugQuestion
          questionText={questionText}
          codeBlock={codeBlock}
          fixOptions={fixOptions}
          onAnswer={onAnswer}
          hint={hint ?? undefined}
        />
      );
    }

    case 'multi_select': {
      const choices = (options as { choices?: string[] })?.choices ?? [];
      if (choices.length === 0) {
        return <FallbackQuestion questionText={questionText} />;
      }
      return (
        <MultiSelectQuestion
          questionText={questionText}
          choices={choices}
          onAnswer={onAnswer}
          hint={hint ?? undefined}
        />
      );
    }

    case 'true_false_reason': {
      const reasons = (options as { reasons?: string[] })?.reasons ?? [];
      return (
        <TrueFalseReasonQuestion
          questionText={questionText}
          reasons={reasons}
          onAnswer={onAnswer}
          hint={hint ?? undefined}
        />
      );
    }

    default:
      // Bilinmeyen tip için multiple_choice fallback
      return (
        <MultipleChoiceQuestion
          question={question}
          selectedAnswer={selectedAnswer ?? currentAnswer}
          onSelect={onAnswer}
        />
      );
  }
}

function FallbackQuestion({ questionText }: { questionText: string }) {
  return (
    <div className="p-6 rounded-xl border-2 border-outline-variant bg-surface-container-lowest">
      <p className="text-body-sm text-on-surface-variant mb-2">Soru verisi eksik</p>
      <p className="text-body-lg text-on-surface">{questionText}</p>
    </div>
  );
}
