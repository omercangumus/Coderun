// Coderun Stitch Design System — Leaderboard Components

import { cn } from '@/lib/utils/cn';

export interface LeaderboardEntry {
  rank: number;
  username: string;
  xpThisWeek: number;
  streak: number;
  level: number;
  isCurrentUser?: boolean;
  league?: string;
}

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  className?: string;
}

const rankColors: Record<number, string> = {
  1: 'text-yellow-500',
  2: 'text-slate-400',
  3: 'text-amber-600',
};

const rankBg: Record<number, string> = {
  1: 'bg-yellow-50 border-yellow-200',
  2: 'bg-slate-50 border-slate-200',
  3: 'bg-amber-50 border-amber-200',
};

const rankEmoji: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

export function LeaderboardRow({ entry, className }: LeaderboardRowProps) {
  const isTop3 = entry.rank <= 3;

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-150',
        isTop3 ? rankBg[entry.rank] : 'bg-white border-outline-variant',
        entry.isCurrentUser && 'border-primary/40 bg-primary-fixed/30',
        className
      )}
    >
      {/* Rank */}
      <div className="w-8 flex-shrink-0 text-center">
        {isTop3 ? (
          <span className="text-xl">{rankEmoji[entry.rank]}</span>
        ) : (
          <span
            className={cn(
              'font-label text-label-sm font-bold',
              entry.isCurrentUser ? 'text-primary' : 'text-on-surface-variant'
            )}
          >
            #{entry.rank}
          </span>
        )}
      </div>

      {/* Avatar */}
      <div
        className={cn(
          'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
          entry.isCurrentUser ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'
        )}
      >
        {entry.username.charAt(0).toUpperCase()}
      </div>

      {/* Name + level */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'font-sans text-body-sm font-semibold truncate',
            entry.isCurrentUser ? 'text-primary' : 'text-on-surface'
          )}
        >
          {entry.username}
          {entry.isCurrentUser && (
            <span className="ml-1 font-label text-label-sm text-primary/60">(Sen)</span>
          )}
        </p>
        <p className="font-label text-label-sm text-on-surface-variant">
          Lv. {entry.level}
        </p>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <span className="text-sm">🔥</span>
        <span className="font-sans text-body-sm font-semibold text-streak-orange">
          {entry.streak}
        </span>
      </div>

      {/* XP */}
      <div className="text-right flex-shrink-0">
        <p className="font-heading text-sm font-bold text-primary">
          {entry.xpThisWeek.toLocaleString()}
        </p>
        <p className="font-label text-label-sm text-on-surface-variant">XP</p>
      </div>
    </div>
  );
}

// Top 3 podium
interface LeaderboardPodiumProps {
  top3: LeaderboardEntry[];
  className?: string;
}

export function LeaderboardPodium({ top3, className }: LeaderboardPodiumProps) {
  if (top3.length < 3) return null;

  const [first, second, third] = top3;

  return (
    <div className={cn('flex items-end justify-center gap-3 py-6', className)}>
      {/* 2nd place */}
      <PodiumSlot entry={second} height="h-20" />
      {/* 1st place */}
      <PodiumSlot entry={first} height="h-28" isFirst />
      {/* 3rd place */}
      <PodiumSlot entry={third} height="h-16" />
    </div>
  );
}

function PodiumSlot({
  entry,
  height,
  isFirst = false,
}: {
  entry: LeaderboardEntry;
  height: string;
  isFirst?: boolean;
}) {
  const emoji = rankEmoji[entry.rank];
  const bg = rankBg[entry.rank];

  return (
    <div className="flex flex-col items-center gap-2">
      {isFirst && <span className="text-2xl">👑</span>}
      <div
        className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold',
          entry.rank === 1 ? 'bg-yellow-400 text-white' :
          entry.rank === 2 ? 'bg-slate-300 text-white' :
          'bg-amber-400 text-white'
        )}
      >
        {entry.username.charAt(0).toUpperCase()}
      </div>
      <p className="font-sans text-xs font-semibold text-on-surface text-center max-w-[64px] truncate">
        {entry.username}
      </p>
      <p className="font-heading text-sm font-bold text-primary">
        {entry.xpThisWeek.toLocaleString()} XP
      </p>
      <div
        className={cn(
          'w-16 rounded-t-lg flex items-center justify-center border',
          height,
          bg
        )}
      >
        <span className="text-2xl">{emoji}</span>
      </div>
    </div>
  );
}

// League badge
interface LeagueBadgeProps {
  league: string;
  rank?: number;
  className?: string;
}

const leagueConfig: Record<string, { emoji: string; color: string; bg: string }> = {
  Diamond: { emoji: '💎', color: 'text-diamond-blue', bg: 'bg-blue-50 border-blue-200' },
  Gold: { emoji: '🥇', color: 'text-gold-league', bg: 'bg-yellow-50 border-yellow-200' },
  Silver: { emoji: '🥈', color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200' },
  Bronze: { emoji: '🥉', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
};

export function LeagueBadge({ league, rank, className }: LeagueBadgeProps) {
  const config = leagueConfig[league] ?? { emoji: '🏆', color: 'text-primary', bg: 'bg-primary-fixed border-primary/20' };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full border',
        config.bg,
        className
      )}
    >
      <span className="text-xl">{config.emoji}</span>
      <div>
        <p className={cn('font-heading text-sm font-bold', config.color)}>
          {league} League
        </p>
        {rank && (
          <p className="font-label text-label-sm text-on-surface-variant">
            #{rank} sırada
          </p>
        )}
      </div>
    </div>
  );
}
