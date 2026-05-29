import { cn } from '@/lib/utils/cn';
import type { StreakResponse } from '@/lib/types/gamification.types';

interface StreakWidgetProps {
  streak: StreakResponse;
  className?: string;
}

export function StreakWidget({ streak, className }: StreakWidgetProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1 px-4 py-3 rounded-xl border',
        streak.isAlive
          ? 'border-streak-orange/40 bg-streak-orange/10'
          : 'border-outline-variant bg-surface-container-low opacity-70',
        className
      )}
    >
      <span className="text-2xl">{streak.isAlive ? '🔥' : '💤'}</span>
      <span className="font-heading text-2xl font-bold text-on-surface">{streak.currentStreak}</span>
      <span className="font-sans text-xs text-on-surface-variant">Günlük seri</span>
    </div>
  );
}
