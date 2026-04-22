import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils/cn';
import { formatXP } from '@/lib/utils/format';
import type { LeaderboardEntry as LeaderboardEntryType } from '@/lib/types/gamification.types';

interface LeaderboardEntryProps {
  entry: LeaderboardEntryType;
  isCurrentUser?: boolean;
}

const rankColors: Record<number, string> = {
  1: 'text-xpGold',
  2: 'text-slate-300',
  3: 'text-amber-600',
};

export function LeaderboardEntry({ entry, isCurrentUser = false }: LeaderboardEntryProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
        isCurrentUser
          ? 'bg-accent/10 border border-accent/30'
          : 'hover:bg-slate-800/40'
      )}
    >
      <span
        className={cn(
          'w-6 text-center font-bold text-sm',
          rankColors[entry.rank] ?? 'text-slate-400'
        )}
      >
        {entry.rank}
      </span>
      <Avatar username={entry.username} size="sm" />
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium truncate', isCurrentUser ? 'text-accent' : 'text-white')}>
          {entry.username}
          {isCurrentUser && <span className="ml-1 text-xs">(Sen)</span>}
        </p>
        <p className="text-xs text-slate-400">Sv. {entry.level}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-xpGold">{formatXP(entry.weeklyXp)}</p>
        {entry.streak > 0 && (
          <p className="text-xs text-streakOrange">🔥 {entry.streak}</p>
        )}
      </div>
    </div>
  );
}
