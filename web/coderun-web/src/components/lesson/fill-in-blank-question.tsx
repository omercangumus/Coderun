'use client';

import { useState } from 'react';

interface FillInBlankQuestionProps {
  questionText: string;
  codeBlock: string;
  wordBank: { words: string[] };
  onAnswer: (answer: string) => void;
  hint?: string;
}

export function FillInBlankQuestion({
  questionText,
  codeBlock,
  wordBank,
  onAnswer,
  hint,
}: FillInBlankQuestionProps) {
  const blanks = (codeBlock.match(/___/g) || []).length;
  const [filledBlanks, setFilledBlanks] = useState<string[]>(Array(blanks).fill(''));
  const [usedWords, setUsedWords] = useState<Set<number>>(new Set());
  const [showHint, setShowHint] = useState(false);

  const handleWordClick = (word: string, wordIndex: number) => {
    if (usedWords.has(wordIndex)) return;

    const firstEmptyIndex = filledBlanks.findIndex((b) => b === '');
    if (firstEmptyIndex === -1) return;

    const newBlanks = [...filledBlanks];
    newBlanks[firstEmptyIndex] = word;
    setFilledBlanks(newBlanks);
    setUsedWords(new Set([...Array.from(usedWords), wordIndex]));

    // Check if all blanks are filled
    if (newBlanks.every((b) => b !== '')) {
      onAnswer(newBlanks.join(','));
    }
  };

  const handleBlankClick = (blankIndex: number) => {
    if (filledBlanks[blankIndex] === '') return;

    const word = filledBlanks[blankIndex];
    const wordIndex = wordBank.words.indexOf(word);

    const newBlanks = [...filledBlanks];
    newBlanks[blankIndex] = '';
    setFilledBlanks(newBlanks);

    const newUsed = new Set(Array.from(usedWords));
    if (wordIndex !== -1) newUsed.delete(wordIndex);
    setUsedWords(newUsed);
  };

  // Render code with blanks replaced by interactive slots
  const renderCode = () => {
    let blankIdx = 0;
    const parts = codeBlock.split('___');

    return (
      <pre className="bg-surface-container-highest rounded-lg p-4 font-mono text-body-sm overflow-x-auto">
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {i < parts.length - 1 && (
              <button
                onClick={() => handleBlankClick(blankIdx)}
                className={`inline-block min-w-[80px] px-2 py-1 mx-1 rounded-md border-2 border-dashed transition-all text-center ${
                  filledBlanks[blankIdx]
                    ? 'border-primary bg-primary-fixed text-on-surface font-semibold cursor-pointer hover:border-error'
                    : 'border-outline-variant bg-surface-container text-on-surface-variant'
                }`}
              >
                {filledBlanks[blankIdx++] || '___'}
              </button>
            )}
          </span>
        ))}
      </pre>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <p className="text-body-lg text-on-surface font-medium">{questionText}</p>

      {renderCode()}

      {/* Word Bank */}
      <div className="space-y-2">
        <p className="text-label-caps text-on-surface-variant uppercase tracking-wider">
          Kelime Bankası
        </p>
        <div className="flex flex-wrap gap-2">
          {wordBank.words.map((word, i) => (
            <button
              key={i}
              onClick={() => handleWordClick(word, i)}
              disabled={usedWords.has(i)}
              className={`px-4 py-2 rounded-full text-button-sm font-semibold transition-all ${
                usedWords.has(i)
                  ? 'bg-surface-container text-on-surface-variant opacity-40 cursor-not-allowed line-through'
                  : 'bg-primary-fixed text-primary hover:bg-primary-fixed-dim hover:shadow-primary cursor-pointer'
              }`}
            >
              {word}
            </button>
          ))}
        </div>
      </div>

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
