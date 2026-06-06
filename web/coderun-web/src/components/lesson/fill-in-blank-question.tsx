'use client';

import { useState, useCallback } from 'react';
import { useHaptics } from '@/lib/hooks/use-haptics';
import { QuizHintCard, QuizQuestionHeader } from './quiz-ui';

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
  // Track which blank/word is animating for smooth transitions
  const [animatingBlank, setAnimatingBlank] = useState<number | null>(null);
  const [animatingWord, setAnimatingWord] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const { vibrateTap } = useHaptics();

  const allFilled = filledBlanks.every((b) => b !== '');

  const clearBlank = useCallback(
    (blankIndex: number) => {
      const word = filledBlanks[blankIndex];
      if (!word) return;

      const wordIndex = wordBank.words.findIndex(
        (w, i) => w === word && usedWords.has(i),
      );

      // Animate the word returning to the bank
      setAnimatingBlank(blankIndex);
      if (wordIndex !== -1) setAnimatingWord(wordIndex);

      setTimeout(() => {
        const newBlanks = [...filledBlanks];
        newBlanks[blankIndex] = '';
        setFilledBlanks(newBlanks);

        const newUsed = new Set(Array.from(usedWords));
        if (wordIndex !== -1) newUsed.delete(wordIndex);
        setUsedWords(newUsed);

        setAnimatingBlank(null);
        setAnimatingWord(null);
        setConfirmed(false);
      }, 200);
    },
    [filledBlanks, usedWords, wordBank.words],
  );

  const handleWordClick = useCallback(
    (word: string, wordIndex: number) => {
      if (usedWords.has(wordIndex) || confirmed) return;

      vibrateTap();

      // Find the first empty blank
      let targetBlankIndex = filledBlanks.findIndex((b) => b === '');

      // If no empty blank, replace the last filled one (swap behavior)
      if (targetBlankIndex === -1) {
        targetBlankIndex = filledBlanks.length - 1;
        // First remove the existing word from that blank
        const existingWord = filledBlanks[targetBlankIndex];
        if (existingWord) {
          const existingWordIndex = wordBank.words.findIndex(
            (w, i) => w === existingWord && usedWords.has(i),
          );
          // Animate out old word
          setAnimatingBlank(targetBlankIndex);
          if (existingWordIndex !== -1) setAnimatingWord(existingWordIndex);

          setTimeout(() => {
            const newBlanks = [...filledBlanks];
            newBlanks[targetBlankIndex] = word;
            setFilledBlanks(newBlanks);

            const newUsed = new Set(Array.from(usedWords));
            if (existingWordIndex !== -1) newUsed.delete(existingWordIndex);
            newUsed.add(wordIndex);
            setUsedWords(newUsed);

            setAnimatingBlank(null);
            setAnimatingWord(null);
          }, 200);
          return;
        }
      }

      // Place the word in the blank with animation
      setAnimatingBlank(targetBlankIndex);
      setTimeout(() => {
        const newBlanks = [...filledBlanks];
        newBlanks[targetBlankIndex] = word;
        setFilledBlanks(newBlanks);
        setUsedWords(new Set([...Array.from(usedWords), wordIndex]));
        setAnimatingBlank(null);
      }, 100);
    },
    [filledBlanks, usedWords, wordBank.words, vibrateTap, confirmed],
  );

  const handleBlankClick = (blankIndex: number) => {
    if (filledBlanks[blankIndex] === '' || confirmed) return;
    vibrateTap();
    clearBlank(blankIndex);
  };

  const handleConfirm = () => {
    if (!allFilled) return;
    vibrateTap();
    setConfirmed(true);
    onAnswer(filledBlanks.join(','));
  };

  // Render code with blanks replaced by interactive slots
  const renderCode = () => {
    let blankIdx = 0;
    const parts = codeBlock.split('___');

    return (
      <pre className="overflow-x-auto rounded-2xl border border-outline-variant bg-[#1E1E2E] p-4 font-mono text-sm leading-relaxed text-green-300">
        {parts.map((part, i) => {
          const currentBlankIdx = blankIdx;
          const isAnimating = animatingBlank === currentBlankIdx;

          return (
            <span key={i}>
              {part}
              {i < parts.length - 1 && (
                <button
                  onClick={() => handleBlankClick(currentBlankIdx)}
                  disabled={confirmed}
                  className={`inline-block min-w-[80px] px-2 py-1 mx-1 rounded-md border-2 border-dashed text-center
                    transition-all duration-200 ease-out
                    ${isAnimating ? 'scale-90 opacity-50' : 'scale-100 opacity-100'}
                    ${
                      filledBlanks[currentBlankIdx]
                        ? confirmed
                          ? 'border-secondary bg-secondary/20 text-on-surface font-semibold cursor-default'
                          : 'border-primary bg-primary-fixed text-on-surface font-semibold cursor-pointer hover:border-error hover:bg-error/10 active:scale-95'
                        : 'border-outline-variant bg-surface-container text-on-surface-variant animate-pulse'
                    }`}
                >
                  {filledBlanks[blankIdx++] || '___'}
                </button>
              )}
            </span>
          );
        })}
      </pre>
    );
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <QuizQuestionHeader questionText={questionText} />
      {hint && <QuizHintCard hint={hint} />}
      {renderCode()}

      {/* Word bank */}
      <div className="space-y-2">
        <p className="font-label text-label-sm uppercase tracking-wide text-on-surface-variant">
          Kelime bankası
        </p>
        <div className="flex flex-wrap gap-2">
          {wordBank.words.map((word, i) => {
            const isUsed = usedWords.has(i);
            const isReturning = animatingWord === i;

            return (
              <button
                key={i}
                onClick={() => handleWordClick(word, i)}
                disabled={isUsed && !isReturning || confirmed}
                className={`px-4 py-2 rounded-full text-button-sm font-semibold
                  transition-all duration-200 ease-out
                  ${isReturning ? 'scale-110 ring-2 ring-primary animate-bounce-in' : ''}
                  ${
                    isUsed && !isReturning
                      ? 'bg-surface-container text-on-surface-variant opacity-30 cursor-not-allowed scale-90'
                      : confirmed
                        ? 'bg-surface-container text-on-surface-variant opacity-50 cursor-not-allowed'
                        : 'bg-primary-fixed text-primary hover:bg-primary-fixed-dim hover:shadow-primary hover:scale-105 active:scale-95 cursor-pointer'
                  }`}
              >
                {word}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirm button — only shown when all blanks are filled */}
      {allFilled && !confirmed && (
        <button
          onClick={handleConfirm}
          className="w-full py-3 rounded-2xl bg-primary text-on-primary font-bold text-sm
            shadow-lg hover:bg-primary/90 active:scale-[0.98]
            transition-all duration-200 animate-fade-in"
        >
          Cevapla ✓
        </button>
      )}

      {confirmed && (
        <div className="flex items-center gap-2 py-2 px-4 rounded-xl bg-secondary/10 border border-secondary/20 animate-fade-in">
          <span className="text-secondary font-semibold text-sm">✓ Cevap kaydedildi</span>
        </div>
      )}
    </div>
  );
}
