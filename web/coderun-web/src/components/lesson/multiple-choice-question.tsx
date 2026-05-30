'use client';

import { useHaptics } from '@/lib/hooks/use-haptics';
import type { QuestionResponse } from '@/lib/types/module.types';
import { QuizHintCard, QuizOptionButton, QuizQuestionHeader } from './quiz-ui';

interface Props {
  question: QuestionResponse;
  selectedAnswer: string | undefined;
  onSelect: (answer: string) => void;
}

export function MultipleChoiceQuestion({ question, selectedAnswer, onSelect }: Props) {
  const choices = (question.options?.choices ?? []) as string[];
  const { vibrateTap } = useHaptics();

  const handleSelect = (choice: string) => {
    vibrateTap();
    onSelect(choice);
  };

  return (
    <div className="flex flex-col gap-5">
      <QuizQuestionHeader questionText={question.questionText} codeBlock={question.codeBlock} />
      {question.hint && <QuizHintCard hint={question.hint} />}
      <div className="flex flex-col gap-2.5">
        {choices.map((choice, idx) => (
          <QuizOptionButton
            key={choice}
            label={choice}
            index={idx}
            isSelected={selectedAnswer === choice}
            onClick={() => handleSelect(choice)}
          />
        ))}
      </div>
    </div>
  );
}
