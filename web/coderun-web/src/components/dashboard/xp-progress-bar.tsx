import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils/cn';
import type { LevelProgressResponse } from '@/lib/types/gamification.types';

interface XpProgressBarProps {
  levelProgress: LevelProgressResponse;
  className?: string;
}

export function XpProgressBar({ levelProgress, className }: XpProgressBarProps) {
  const { currentLevel, currentXp, xpRemaining, progressPercentage, isMaxLevel } =
    levelProgress;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className="text-sm font-bold text-xpGold whitespace-nowrap">
        Sv. {currentLevel}
      </span>
      <div className="flex-1">
        <Progress value={progressPercentage} color="gold" />
      </div>
      <span className="text-xs text-slate-400 whitespace-nowrap">
        {isMaxLevel ? 'MAX' : `${xpRemaining} XP kaldı`}
      </span>
    </div>
  );
}
