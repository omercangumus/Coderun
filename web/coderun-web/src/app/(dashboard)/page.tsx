'use client';

import Link from 'next/link';
import { BookOpen, Zap, Flame, Trophy, Target, AlertCircle } from 'lucide-react';
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
import { CoderunCard, StatCard as StitchStatCard, SectionHeader } from '@/components/stitch/CoderunCard';
import { GhostieMotivationCard } from '@/components/stitch/GhostieCard';
import { StatPill } from '@/components/stitch/StitchButton';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useUserStats();
  const { data: leaderboard, isLoading: lbLoading } = useLeaderboard(3);
  const { data: modules, isLoading: modulesLoading } = useModules();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Günaydın';
    if (hour < 18) return 'İyi günler';
    return 'İyi akşamlar';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Welcome Section */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-h2 font-bold text-on-surface">
              {greeting()}, {user?.username ?? '...'}! 👋
            </h1>
            <p className="font-sans text-body-md text-on-surface-variant mt-1">
              Bugün ne öğrenmek istiyorsun?
            </p>
          </div>
          {stats && (
            <div className="flex items-center gap-2">
              <StatPill icon="⚡" value={`${stats.totalXp} XP`} color="primary" />
              <StatPill icon="🔥" value={`${stats.streak} gün`} color="orange" />
            </div>
          )}
        </div>

        {/* XP Progress Card */}
        <CoderunCard>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-label text-label-sm text-on-surface-variant uppercase tracking-wide">
                Seviye İlerlemesi
              </p>
              <p className="font-heading text-h4 font-bold text-primary mt-0.5">
                Seviye {stats?.level ?? 1}
              </p>
            </div>
            <div className="text-right">
              <p className="font-heading text-h3 font-bold text-primary">
                {stats ? Math.round(stats.levelProgress.progressPercentage) : 0}%
              </p>
            </div>
          </div>
          {stats ? (
            <div className="cr-progress-bar">
              <div
                className="cr-progress-fill"
                style={{ width: `${stats.levelProgress.progressPercentage}%` }}
              />
            </div>
          ) : (
            <Skeleton className="h-2 w-full" />
          )}
        </CoderunCard>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statsLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))
          ) : (
            <>
              <StitchStatCard
                icon="📖"
                label="Tamamlanan Ders"
                value={stats?.totalLessonsCompleted ?? 0}
                color="primary"
              />
              <StitchStatCard
                icon="⚡"
                label="Toplam XP"
                value={stats?.totalXp ?? 0}
                color="primary"
              />
              <StitchStatCard
                icon="🔥"
                label="Aktif Gün"
                value={stats?.streak ?? 0}
                subValue={stats && stats.streak > 0 ? 'Devam ediyor!' : 'Başla'}
                color="orange"
              />
            </>
          )}
        </div>

        {/* Continue Learning */}
        <div>
          <SectionHeader
            title="Devam Et"
            action={
              <Link
                href="/learn"
                className="font-sans text-body-sm font-semibold text-primary hover:text-primary-container transition-colors"
              >
                Tümünü Gör →
              </Link>
            }
          />
          <div className="mt-4">
            {modulesLoading ? (
              <Skeleton className="h-32" />
            ) : modules && modules.length > 0 ? (
              <Link href={`/learn/${modules[0].slug}`}>
                <CoderunCard variant="highlight" className="hover:shadow-primary-lg transition-shadow cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      📚
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-label text-label-sm text-primary/70 uppercase tracking-wide">
                        Devam Et
                      </p>
                      <h3 className="font-heading text-h4 font-bold text-primary mt-0.5">
                        {modules[0].title}
                      </h3>
                      <p className="font-sans text-body-sm text-on-surface-variant mt-1 line-clamp-1">
                        {modules[0].description}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="cr-btn-primary px-4 py-2 text-sm">
                        Devam Et →
                      </div>
                    </div>
                  </div>
                </CoderunCard>
              </Link>
            ) : (
              <CoderunCard variant="ghost">
                <p className="font-sans text-body-sm text-on-surface-variant text-center py-4">
                  Henüz modül yok.
                </p>
              </CoderunCard>
            )}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Modules & Leaderboard */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* All Modules */}
            <div>
              <SectionHeader title="Öğrenme Yolları" />
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {modulesLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-32" />
                    ))
                  : modules?.map((module) => (
                      <Link key={module.id} href={`/learn/${module.slug}`}>
                        <CoderunCard className="hover:shadow-card-hover transition-shadow cursor-pointer h-full">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                              📚
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-heading text-base font-bold text-on-surface line-clamp-1">
                                {module.title}
                              </h4>
                              <p className="font-sans text-body-sm text-on-surface-variant mt-1 line-clamp-2">
                                {module.description}
                              </p>
                            </div>
                          </div>
                        </CoderunCard>
                      </Link>
                    ))}
              </div>
            </div>

            {/* Leaderboard Preview */}
            <div>
              <SectionHeader
                title="Bu Haftanın Liderleri"
                action={
                  <Link
                    href="/leaderboard"
                    className="font-sans text-body-sm font-semibold text-primary hover:text-primary-container transition-colors"
                  >
                    Tümünü Gör →
                  </Link>
                }
              />
              <div className="mt-4">
                <CoderunCard padding="sm">
                  {lbLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 mb-2" />
                    ))
                  ) : (leaderboard?.entries ?? []).length > 0 ? (
                    <div className="divide-y divide-outline-variant">
                      {(leaderboard?.entries ?? []).map((entry, i) => (
                        <div
                          key={entry.userId}
                          className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                        >
                          <span className="text-xl flex-shrink-0">
                            {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                          </span>
                          <div className="w-8 h-8 bg-primary-fixed rounded-full flex items-center justify-center font-sans text-sm font-semibold text-primary flex-shrink-0">
                            {entry.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-sans text-body-sm font-semibold text-on-surface truncate">
                              {entry.username}
                            </p>
                          </div>
                          <p className="font-heading text-sm font-bold text-primary flex-shrink-0">
                            {entry.weeklyXp} XP
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="font-sans text-body-sm text-on-surface-variant text-center py-4">
                      Henüz sıralama yok.
                    </p>
                  )}
                </CoderunCard>
              </div>
            </div>
          </div>

          {/* Right Column - Ghostie & Quick Actions */}
          <div className="flex flex-col gap-6">
            {/* Ghostie Motivation */}
            <GhostieMotivationCard
              message="Harika gidiyorsun! Her gün biraz daha ilerliyorsun. Devam et! 🚀"
              mood="happy"
            />

            {/* Today's Goal */}
            <CoderunCard>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-secondary-container/40 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-label text-label-sm text-on-surface-variant uppercase tracking-wide">
                    Bugünün Hedefi
                  </p>
                  <p className="font-heading text-h4 font-bold text-on-surface mt-1">
                    1 Ders Tamamla
                  </p>
                  <p className="font-sans text-body-sm text-on-surface-variant mt-1">
                    Streak&apos;ini korumak için bugün en az 1 ders tamamla.
                  </p>
                </div>
              </div>
            </CoderunCard>

            {/* Review Due (if applicable) */}
            {stats && stats.totalLessonsCompleted > 0 && (
              <CoderunCard>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-label text-label-sm text-on-surface-variant uppercase tracking-wide">
                      Tekrar Zamanı
                    </p>
                    <p className="font-heading text-h4 font-bold text-on-surface mt-1">
                      3 Ders
                    </p>
                    <p className="font-sans text-body-sm text-on-surface-variant mt-1">
                      Öğrendiklerini pekiştirmek için tekrar et.
                    </p>
                  </div>
                </div>
              </CoderunCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
