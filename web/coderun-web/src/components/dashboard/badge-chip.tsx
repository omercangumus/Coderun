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
        'flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all',
        earned
          ? 'border-xp-gold/30 bg-xp-gold/10 shadow-sm'
          : 'border-outline-variant bg-surface-container-low/50 opacity-70 grayscale hover:opacity-90',
        className
      )}
      title={badge.description}
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-sans text-xs font-medium text-on-surface leading-tight">
        {badge.title}
      </span>
    </div>
  );
}
