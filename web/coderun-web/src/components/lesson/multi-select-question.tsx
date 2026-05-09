'use client';

import { useState } from 'react';

interface MultiSelectQuestionProps {
  questionText: string;
  choices: string[];
  onAnswer: (answer: string) => void;
  hint?: string;
}

export function MultiSelectQuestion({
  questionText,
  choices,
  onAnswer,
  hint,
}: MultiSelectQuestionProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const toggleChoice = (index: number) => {
    if (submitted) return;
    const newSelected = new Set(selected);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelected(newSelected);
  };

  const handleSubmit = () => {
    if (selected.size === 0) return;
    setSubmitted(true);
    const answer = Array.from(selected)
      .map((i) => choices[i])
      .join(',');
    onAnswer(answer);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <p className="text-body-lg text-on-surface font-medium">{questionText}</p>
        <p className="text-body-sm text-on-surface-variant mt-1">
          Birden fazla seçenek işaretleyebilirsiniz
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {choices.map((choice, i) => (
          <button
            key={i}
            onClick={() => toggleChoice(i)}
            disabled={submitted}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
              selected.has(i)
                ? 'border-primary bg-primary-fixed text-on-surface shadow-primary'
                : 'border-outline-variant bg-surface-container-lowest hover:border-primary text-on-surface'
            } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
          >
            {/* Checkbox */}
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                selected.has(i)
                  ? 'border-primary bg-primary text-primary-on'
                  : 'border-outline-variant bg-surface-container'
              }`}
            >
              {selected.has(i) && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-body-md font-medium">{choice}</span>
          </button>
        ))}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={selected.size === 0}
          className={`w-full py-3 rounded-xl text-button font-semibold transition-all ${
            selected.size > 0
              ? 'bg-primary text-primary-on hover:shadow-primary'
              : 'bg-surface-container text-on-surface-variant cursor-not-allowed'
          }`}
        >
          {selected.size > 0
            ? `${selected.size} seçim ile onayla`
            : 'En az bir seçenek işaretleyin'}
        </button>
      )}

      {hint && (
        <button
          onClick={() => setShowHint(!showHint)}
          className="text-body-sm text-primary hover:text-primary-container transition-colors"
        >
          {showHint ? '💡 ' + hint : '💡 İpucu göster'}
        </button>
      )}
    </div>
  );
}
