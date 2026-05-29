import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils/cn';
import { formatXP } from '@/lib/utils/format';
import type { LeaderboardEntry as LeaderboardEntryType } from '@/lib/types/gamification.types';

interface LeaderboardEntryProps {
  entry: LeaderboardEntryType;
  isCurrentUser?: boolean;
}

const rankColors: Record<number, string> = {
  1: 'text-xp-gold',
  2: 'text-on-surface-variant',
  3: 'text-amber-600',
};

export function LeaderboardEntry({ entry, isCurrentUser = false }: LeaderboardEntryProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors border border-transparent',
        isCurrentUser
          ? 'bg-primary-fixed/30 border-primary/30'
          : 'hover:bg-surface-container'
      )}
    >
      <span
        className={cn(
          'w-6 text-center font-bold text-sm',
          rankColors[entry.rank] ?? 'text-on-surface-variant'
        )}
      >
        {entry.rank}
      </span>
      <Avatar username={entry.username} size="sm" />
      <div className="flex-1 min-w-0">
        <p className={cn('font-sans text-sm font-medium truncate', isCurrentUser ? 'text-primary' : 'text-on-surface')}>
          {entry.username}
          {isCurrentUser && <span className="ml-1 text-xs">(Sen)</span>}
        </p>
        <p className="font-sans text-xs text-on-surface-variant">Sv. {entry.level}</p>
      </div>
      <div className="text-right">
        <p className="font-heading text-sm font-semibold text-xp-gold">{formatXP(entry.weeklyXp)}</p>
        {entry.streak > 0 && (
          <p className="font-sans text-xs text-streak-orange">🔥 {entry.streak}</p>
        )}
      </div>
    </div>
  );
}
