'use client';

import { cn } from '@/lib/utils/cn';

interface Props {
  total: number;
  current: number;
  answered: number[];
}

export function QuestionProgress({ total, current, answered }: Props) {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center justify-center gap-1.5">
        {Array.from({ length: total }).map((_, idx) => (
          <div
            key={idx}
            className={cn(
              'rounded-full transition-all duration-200',
              idx === current
                ? 'w-4 h-4 bg-accent'
                : answered.includes(idx)
                ? 'w-2.5 h-2.5 bg-green-500'
                : 'w-2.5 h-2.5 bg-slate-600'
            )}
          />
        ))}
      </div>
    </div>
  );
}
