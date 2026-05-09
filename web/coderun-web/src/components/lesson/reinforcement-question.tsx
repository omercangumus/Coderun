'use client';

import { useState } from 'react';

interface ReinforcementQuestionProps {
  questionText: string;
  questionType: string;
  options?: Record<string, unknown> | null;
  codeBlock?: string | null;
  wordBank?: { words: string[] } | null;
  onAnswer: (answer: string) => void;
  hint?: string;
}

export function ReinforcementQuestion({
  questionText,
  questionType,
  options,
  onAnswer,
  hint,
}: ReinforcementQuestionProps) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = () => {
    if (!answer.trim()) return;
    setSubmitted(true);
    onAnswer(answer);
  };

  const choices =
    questionType === 'multiple_choice' && options
      ? ((options as Record<string, string[]>).choices ?? [])
      : [];

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
            Bir önceki soruyu pekiştirmek için bu basit soruyu cevaplayın
          </p>
        </div>
      </div>

      <div className="space-y-4 p-4 rounded-xl border-2 border-secondary/30 bg-surface-container-lowest">
        <p className="text-body-lg text-on-surface font-medium">{questionText}</p>

        {/* Multiple choice variant */}
        {choices.length > 0 ? (
          <div className="space-y-2">
            {choices.map((choice: string, i: number) => (
              <button
                key={i}
                onClick={() => !submitted && setAnswer(choice)}
                disabled={submitted}
                className={`w-full p-3 rounded-lg border-2 text-left transition-all text-body-md ${
                  answer === choice
                    ? 'border-secondary bg-secondary-container text-on-surface font-medium'
                    : 'border-outline-variant bg-surface-container-lowest hover:border-secondary text-on-surface'
                }`}
              >
                {choice}
              </button>
            ))}
          </div>
        ) : (
          /* Text input variant */
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={submitted}
            placeholder="Cevabınızı yazın..."
            className="w-full p-3 rounded-lg border-2 border-outline-variant bg-surface-container-lowest text-on-surface text-body-md focus:border-secondary focus:outline-none transition-colors"
          />
        )}

        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={!answer.trim()}
            className={`w-full py-3 rounded-xl text-button font-semibold transition-all ${
              answer.trim()
                ? 'bg-secondary text-secondary-on hover:shadow-success'
                : 'bg-surface-container text-on-surface-variant cursor-not-allowed'
            }`}
          >
            Cevapla
          </button>
        )}

        {hint && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-body-sm text-secondary hover:text-secondary-container transition-colors"
          >
            {showHint ? '💡 ' + hint : '💡 İpucu göster'}
          </button>
        )}
      </div>
    </div>
  );
}
