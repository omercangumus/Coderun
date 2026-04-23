'use client';

import Link from 'next/link';
import { BookOpen, Zap, Flame } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { useUserStats, useLeaderboard } from '@/lib/hooks/use-gamification';
import { useModules } from '@/lib/hooks/use-modules';
import { XpProgressBar } from '@/components/dashboard/xp-progress-bar';
import { StreakWidget } from '@/components/dashboard/streak-widget';
import { StatCard } from '@/components/dashboard/stat-card';
import { ModuleCard } from '@/components/dashboard/module-card';
import { LeaderboardEntry } from '@/components/dashboard/leaderboard-entry';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useUserStats();
  const { data: leaderboard, isLoading: lbLoading } = useLeaderboard(3);
  const { data: modules, isLoading: modulesLoading } = useModules();

  return (
    <div className="flex flex-col gap-6">
      {/* Hoş geldin + Streak */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Merhaba, {user?.username ?? '...'}! 👋
          </h1>
          <p className="text-slate-400 mt-1">Bugün ne öğreniyoruz?</p>
        </div>
        {stats ? (
          <StreakWidget streak={stats.streakInfo} />
        ) : (
          <Skeleton className="h-20 w-20" rounded={true} />
        )}
      </div>

      {/* XP Progress */}
      <Card>
        <p className="text-xs text-slate-400 mb-2">Seviye İlerlemesi</p>
        {stats ? (
          <XpProgressBar levelProgress={stats.levelProgress} />
        ) : (
          <Skeleton className="h-4 w-full" />
        )}
      </Card>

      {/* Hızlı İstatistikler */}
      <div className="grid grid-cols-3 gap-3">
        {statsLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))
        ) : (
          <>
            <StatCard
              icon={BookOpen}
              value={stats?.totalLessonsCompleted ?? 0}
              title="Ders"
              bgColor="bg-blue-500/20"
            />
            <StatCard
              icon={Zap}
              value={stats ? `${stats.totalXp} XP` : '0 XP'}
              title="Toplam XP"
              bgColor="bg-xpGold/20"
            />
            <StatCard
              icon={Flame}
              value={stats?.streak ?? 0}
              title="Streak"
              bgColor="bg-streakOrange/20"
            />
          </>
        )}
      </div>

      {/* Modüller */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Öğrenme Yolları</h2>
          <Link href="/learn" className="text-sm text-accent hover:underline">
            Tümünü Gör
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {modulesLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))
            : modules?.slice(0, 3).map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
        </div>
      </div>

      {/* Liderboard Özeti */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Bu Haftanın Liderleri</h2>
          <Link href="/leaderboard" className="text-sm text-accent hover:underline">
            Tümünü Gör
          </Link>
        </div>
        <Card padding="sm">
          {lbLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 mb-2" />
              ))
            : (leaderboard?.entries ?? []).map((entry) => (
                <LeaderboardEntry
                  key={entry.userId}
                  entry={entry}
                  isCurrentUser={entry.userId === user?.id}
                />
              ))}
        </Card>
      </div>
    </div>
  );
}
