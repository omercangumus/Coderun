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
          ? 'border-streakOrange/40 bg-streakOrange/10'
          : 'border-slate-700 bg-slate-800/40 opacity-60',
        className
      )}
    >
      <span className="text-2xl">{streak.isAlive ? '🔥' : '💤'}</span>
      <span className="text-2xl font-bold text-white">{streak.currentStreak}</span>
      <span className="text-xs text-slate-400">Günlük seri</span>
    </div>
  );
}
