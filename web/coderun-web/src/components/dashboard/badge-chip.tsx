import { cn } from '@/lib/utils/cn';
import { BADGE_ICONS } from '@/lib/constants/app.constants';
import type { BadgeResponse } from '@/lib/types/gamification.types';

interface BadgeChipProps {
  badge: BadgeResponse;
  earned?: boolean;
  className?: string;
}

export function BadgeChip({ badge, earned = true, className }: BadgeChipProps) {
  const icon = BADGE_ICONS[badge.badgeType] ?? '🏅';

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center',
        earned
          ? 'border-xpGold/30 bg-xpGold/10'
          : 'border-slate-700 bg-slate-800/40 opacity-40 grayscale',
        className
      )}
      title={badge.description}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-xs font-medium text-slate-300 leading-tight">
        {badge.title}
      </span>
    </div>
  );
}
