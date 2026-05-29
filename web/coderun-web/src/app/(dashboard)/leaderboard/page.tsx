'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import { useLeaderboard } from '@/lib/hooks/use-gamification';
import { Skeleton } from '@/components/ui/skeleton';
import { CoderunCard, SectionHeader } from '@/components/stitch/CoderunCard';
import { GhostieMotivationCard } from '@/components/stitch/GhostieCard';
import { LeaderboardRow, LeaderboardPodium, LeagueBadge } from '@/components/stitch/LeaderboardCard';
import { cn } from '@/lib/utils/cn';

type Filter = 'weekly' | 'monthly' | 'global';

const filterLabels: Record<Filter, string> = {
  weekly: 'Bu Hafta',
  monthly: 'Bu Ay',
  global: 'Tüm Zamanlar',
};

export default function LeaderboardPage() {
  const { user } = useAuth();
  const { data: leaderboard, isLoading } = useLeaderboard(50);
  const [activeFilter, setActiveFilter] = useState<Filter>('weekly');

  const entries = leaderboard?.entries ?? [];

  const mappedEntries = entries.map((e) => ({
    rank: e.rank,
    username: e.username,
    xpThisWeek: e.weeklyXp,
    streak: e.streak ?? 0,
    level: e.level ?? 1,
    isCurrentUser: e.userId === user?.id,
  }));

  // Ensure we always have 3 podium entries
  const mockNames = ['GhostieBot 🤖', 'Gizemli Kodcu 👤', 'Sıradaki Sen 🫵'];
  const mockXps = [500, 250, 0];
  const mockStreaks = [7, 3, 0];
  const mockLevels = [10, 5, 1];

  const top3Mapped = [...mappedEntries].slice(0, 3);
  while (top3Mapped.length < 3) {
    const nextRank = top3Mapped.length + 1;
    top3Mapped.push({
      rank: nextRank,
      username: mockNames[nextRank - 1],
      xpThisWeek: mockXps[nextRank - 1],
      streak: mockStreaks[nextRank - 1],
      level: mockLevels[nextRank - 1],
      isCurrentUser: false,
    });
  }

  const restMapped = mappedEntries.slice(3);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-h2 font-bold text-on-surface">
              Liderboard 🏆
            </h1>
            {leaderboard && (
              <p className="font-sans text-body-sm text-on-surface-variant mt-1">
                {leaderboard.weekStart} – {leaderboard.weekEnd} haftası
              </p>
            )}
          </div>
          <LeagueBadge
            league="Diamond"
            rank={leaderboard?.userRank ?? undefined}
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {(Object.keys(filterLabels) as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                'px-4 py-2 rounded-full font-sans text-body-sm font-semibold transition-all duration-150',
                activeFilter === f
                  ? 'bg-primary text-white shadow-primary'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              )}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>

        {/* Podium */}
        {isLoading ? (
          <Skeleton className="h-48" />
        ) : (
          <CoderunCard>
            <LeaderboardPodium top3={top3Mapped} />
          </CoderunCard>
        )}

        {/* Full list */}
        <div>
          <SectionHeader title="Tam Sıralama" />
          <div className="mt-4 flex flex-col gap-2">
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-14" />
              ))
            ) : mappedEntries.length > 0 ? (
              mappedEntries.map((entry) => (
                <LeaderboardRow key={entry.username} entry={entry} />
              ))
            ) : (
              <div className="text-center py-8 px-4 border border-dashed border-outline-variant rounded-2xl bg-surface-container/50">
                <p className="font-sans text-body-md text-on-surface-variant font-medium">
                  Henüz sıralamada kimse yok. İlk dersini tamamla ve buradaki yerini al! 🚀
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Ghostie motivation */}
        <GhostieMotivationCard
          message="Harika! Sıralamada yükselmeye devam et. Her ders seni bir adım öne taşıyor! 💪"
          mood="celebrating"
        />

        {/* User rank sticky */}
        {leaderboard?.userRank && (
          <div className="sticky bottom-20 lg:bottom-4">
            <CoderunCard variant="highlight" className="text-center">
              <p className="font-sans text-body-sm font-semibold text-primary">
                Senin sıran:{' '}
                <span className="font-heading text-h4 font-bold">
                  #{leaderboard.userRank}
                </span>
              </p>
            </CoderunCard>
          </div>
        )}
      </div>
    </div>
  );
}
