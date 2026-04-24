'use client';

import { useAuth } from '@/lib/hooks/use-auth';
import { useLeaderboard } from '@/lib/hooks/use-gamification';
import { LeaderboardEntry } from '@/components/dashboard/leaderboard-entry';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { formatXP } from '@/lib/utils/format';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const { data: leaderboard, isLoading } = useLeaderboard(50);

  const top3 = leaderboard?.entries.slice(0, 3) ?? [];
  const rest = leaderboard?.entries.slice(3) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Liderboard</h1>
        {leaderboard && (
          <p className="text-slate-400 mt-1 text-sm">
            {leaderboard.weekStart} – {leaderboard.weekEnd} haftası
          </p>
        )}
      </div>

      {/* Podium */}
      {isLoading ? (
        <Skeleton className="h-40" />
      ) : top3.length >= 3 && top3[0] && top3[1] && top3[2] ? (
        <div className="flex items-end justify-center gap-3 py-4">
          {/* 2. sıra */}
          <div className="flex flex-col items-center gap-2">
            <Avatar username={top3[1].username} size="md" />
            <p className="text-sm text-slate-300 font-medium">{top3[1].username}</p>
            <p className="text-xs text-xpGold">{formatXP(top3[1].weeklyXp)}</p>
            <div className="w-20 h-16 bg-slate-600 rounded-t-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-300">2</span>
            </div>
          </div>
          {/* 1. sıra */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">👑</span>
            <Avatar username={top3[0].username} size="lg" />
            <p className="text-sm text-white font-bold">{top3[0].username}</p>
            <p className="text-xs text-xpGold font-semibold">{formatXP(top3[0].weeklyXp)}</p>
            <div className="w-20 h-24 bg-xpGold/30 border border-xpGold/50 rounded-t-lg flex items-center justify-center">
              <span className="text-3xl font-bold text-xpGold">1</span>
            </div>
          </div>
          {/* 3. sıra */}
          <div className="flex flex-col items-center gap-2">
            <Avatar username={top3[2].username} size="md" />
            <p className="text-sm text-slate-300 font-medium">{top3[2].username}</p>
            <p className="text-xs text-xpGold">{formatXP(top3[2].weeklyXp)}</p>
            <div className="w-20 h-12 bg-amber-700/40 rounded-t-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-amber-600">3</span>
            </div>
          </div>
        </div>
      ) : null}

      {/* Tam Liste */}
      <Card padding="sm">
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-14 mb-2" />
            ))
          : leaderboard?.entries.map((entry) => (
              <LeaderboardEntry
                key={entry.userId}
                entry={entry}
                isCurrentUser={entry.userId === user?.id}
              />
            ))}
      </Card>

      {/* Kullanıcının sırası */}
      {leaderboard?.userRank && (
        <div className="sticky bottom-20 lg:bottom-4">
          <Card className="border-accent/50 bg-accent/10">
            <p className="text-center text-sm text-white font-medium">
              Senin sıran: <span className="text-accent font-bold">#{leaderboard.userRank}</span>
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
