'use client';

import { useState } from 'react';

interface SpotTheBugQuestionProps {
  questionText: string;
  codeBlock: string;
  fixOptions: string[];
  onAnswer: (answer: string) => void;
  hint?: string;
}

export function SpotTheBugQuestion({
  questionText,
  codeBlock,
  fixOptions,
  onAnswer,
  hint,
}: SpotTheBugQuestionProps) {
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [selectedFix, setSelectedFix] = useState<number | null>(null);
  const [step, setStep] = useState<'line' | 'fix'>('line');
  const [showHint, setShowHint] = useState(false);

  const lines = codeBlock.split('\n');

  const handleLineClick = (lineIndex: number) => {
    setSelectedLine(lineIndex);
    setStep('fix');
  };

  const handleFixClick = (fixIndex: number) => {
    setSelectedFix(fixIndex);
    if (selectedLine !== null) {
      onAnswer(`${selectedLine}|${fixOptions[fixIndex]}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <p className="text-body-lg text-on-surface font-medium">{questionText}</p>

      {/* Code Block with Line Numbers */}
      <div className="rounded-xl border border-outline-variant overflow-hidden">
        <div className="bg-inverse-surface px-4 py-2">
          <span className="text-label-sm text-inverse-on-surface">
            🐛 Hatalı satırı tıklayın
          </span>
        </div>
        <div className="bg-surface-container-highest p-0 font-mono text-body-sm">
          {lines.map((line, i) => (
            <button
              key={i}
              onClick={() => step === 'line' && handleLineClick(i)}
              className={`w-full flex items-start text-left transition-all ${
                step === 'line' ? 'hover:bg-error-container/30 cursor-pointer' : 'cursor-default'
              } ${
                selectedLine === i
                  ? 'bg-error-container border-l-4 border-error'
                  : ''
              }`}
            >
              <span className="flex-shrink-0 w-10 py-1.5 text-center text-on-surface-variant select-none border-r border-outline-variant bg-surface-container-low">
                {i + 1}
              </span>
              <span className={`flex-1 py-1.5 px-3 whitespace-pre ${
                selectedLine === i ? 'text-error font-bold' : 'text-on-surface'
              }`}>
                {line || ' '}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Fix Options */}
      {step === 'fix' && selectedLine !== null && (
        <div className="space-y-3 animate-fade-in">
          <p className="text-label-caps text-on-surface-variant uppercase tracking-wider">
            Satır {selectedLine + 1} için doğru düzeltmeyi seçin:
          </p>
          <div className="space-y-2">
            {fixOptions.map((fix, i) => (
              <button
                key={i}
                onClick={() => handleFixClick(i)}
                className={`w-full p-4 rounded-lg border-2 text-left font-mono text-body-sm transition-all ${
                  selectedFix === i
                    ? 'border-secondary bg-secondary-container text-secondary-on-container'
                    : 'border-outline-variant bg-surface-container-lowest hover:border-secondary hover:shadow-card text-on-surface'
                }`}
              >
                {fix}
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
