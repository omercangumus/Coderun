'use client';

import { useState } from 'react';

interface TrueFalseReasonQuestionProps {
  questionText: string;
  reasons: string[];
  onAnswer: (answer: string) => void;
  hint?: string;
}

export function TrueFalseReasonQuestion({
  questionText,
  reasons,
  onAnswer,
  hint,
}: TrueFalseReasonQuestionProps) {
  const [step, setStep] = useState<'tf' | 'reason'>('tf');
  const [tfAnswer, setTfAnswer] = useState<'true' | 'false' | null>(null);
  const [selectedReason, setSelectedReason] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);

  const handleTfSelect = (answer: 'true' | 'false') => {
    setTfAnswer(answer);
    setStep('reason');
  };

  const handleReasonSelect = (index: number) => {
    setSelectedReason(index);
    if (tfAnswer) {
      onAnswer(`${tfAnswer}|${index}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Statement */}
      <div className="p-6 rounded-xl bg-surface-container-low border border-outline-variant">
        <p className="text-label-caps text-on-surface-variant uppercase tracking-wider mb-2">
          İfade
        </p>
        <p className="text-body-lg text-on-surface font-medium">{questionText}</p>
      </div>

      {/* Step 1: True/False */}
      {step === 'tf' && (
        <div className="space-y-3">
          <p className="text-label-caps text-on-surface-variant uppercase tracking-wider">
            Bu ifade doğru mu, yanlış mı?
          </p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleTfSelect('true')}
              className={`py-4 rounded-xl border-2 text-button font-bold transition-all ${
                tfAnswer === 'true'
                  ? 'border-secondary bg-secondary-container text-secondary-on-container'
                  : 'border-outline-variant bg-surface-container-lowest hover:border-secondary hover:shadow-card text-on-surface'
              }`}
            >
              ✓ Doğru
            </button>
            <button
              onClick={() => handleTfSelect('false')}
              className={`py-4 rounded-xl border-2 text-button font-bold transition-all ${
                tfAnswer === 'false'
                  ? 'border-error bg-error-container text-error-on-container'
                  : 'border-outline-variant bg-surface-container-lowest hover:border-error hover:shadow-card text-on-surface'
              }`}
            >
              ✗ Yanlış
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Reason */}
      {step === 'reason' && (
        <div className="space-y-3 animate-fade-in">
          <p className="text-label-caps text-on-surface-variant uppercase tracking-wider">
            Nedenini seçin:
          </p>
          <div className="space-y-2">
            {reasons.map((reason, i) => (
              <button
                key={i}
                onClick={() => handleReasonSelect(i)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all text-body-md ${
                  selectedReason === i
                    ? 'border-primary bg-primary-fixed text-on-surface font-medium'
                    : 'border-outline-variant bg-surface-container-lowest hover:border-primary hover:shadow-card text-on-surface'
                }`}
              >
                {reason}
              </button>
            ))}
          </div>
        </div>
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
