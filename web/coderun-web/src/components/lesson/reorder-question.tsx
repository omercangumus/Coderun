'use client';

import { useState, useCallback } from 'react';
import { useHaptics } from '@/lib/hooks/use-haptics';
import { QuizHintCard, QuizQuestionHeader } from './quiz-ui';

interface ReorderQuestionProps {
  questionText: string;
  items: string[];
  onAnswer: (answer: string) => void;
  hint?: string;
}

export function ReorderQuestion({
  questionText,
  items,
  onAnswer,
  hint,
}: ReorderQuestionProps) {
  const [order, setOrder] = useState<number[]>(
    items.map((_, i) => i).sort(() => Math.random() - 0.5) // shuffle initially
  );
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { vibrateTap } = useHaptics();

  const handleDragStart = (index: number) => {
    vibrateTap();
    setDragIndex(index);
  };

  const handleDragOver = useCallback(
    (e: React.DragEvent, overIndex: number) => {
      e.preventDefault();
      if (dragIndex === null || dragIndex === overIndex) return;

      const newOrder = [...order];
      const [removed] = newOrder.splice(dragIndex, 1);
      newOrder.splice(overIndex, 0, removed);
      setOrder(newOrder);
      setDragIndex(overIndex);
    },
    [dragIndex, order]
  );

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  const moveItem = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= order.length) return;

    vibrateTap();
    const newOrder = [...order];
    [newOrder[fromIndex], newOrder[toIndex]] = [newOrder[toIndex], newOrder[fromIndex]];
    setOrder(newOrder);
  };

  const handleSubmit = () => {
    vibrateTap();
    setSubmitted(true);
    onAnswer(JSON.stringify(order.map(String)));
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <QuizQuestionHeader questionText={questionText} />
      {hint && <QuizHintCard hint={hint} />}

      <div className="space-y-2">
        {order.map((itemIndex, i) => (
          <div
            key={itemIndex}
            draggable={!submitted}
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDragEnd={handleDragEnd}
            className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
              dragIndex === i
                ? 'border-primary bg-primary-fixed shadow-primary opacity-70'
                : 'border-outline-variant bg-surface-container-lowest hover:border-primary hover:shadow-card'
            } ${submitted ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
          >
            {/* Drag handle */}
            <div className="flex flex-col gap-0.5 text-on-surface-variant">
              <span className="text-body-sm">⋮⋮</span>
            </div>

            {/* Number badge */}
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-on flex items-center justify-center text-button-sm font-bold">
              {i + 1}
            </span>

            {/* Content */}
            <span className="flex-1 text-body-md text-on-surface">{items[itemIndex]}</span>

            {/* Up/Down buttons (mobile-friendly) */}
            {!submitted && (
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveItem(i, 'up')}
                  disabled={i === 0}
                  className="p-1 text-on-surface-variant hover:text-primary disabled:opacity-30 transition-colors"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveItem(i, 'down')}
                  disabled={i === order.length - 1}
                  className="p-1 text-on-surface-variant hover:text-primary disabled:opacity-30 transition-colors"
                >
                  ▼
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-primary text-primary-on font-semibold text-button hover:shadow-primary transition-all"
        >
          Sıralamayı Onayla
        </button>
      )}

    </div>
  );
}
