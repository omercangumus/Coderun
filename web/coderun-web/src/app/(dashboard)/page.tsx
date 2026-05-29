'use client';

import Link from 'next/link';
import { Code2, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { useUserStats, useLeaderboard } from '@/lib/hooks/use-gamification';
import { useModules } from '@/lib/hooks/use-modules';
import { useContinueLearning } from '@/lib/hooks/use-continue-learning';
import { DashboardHero } from '@/components/dashboard/dashboard-hero';
import { GhostieMentorHub } from '@/components/dashboard/ghostie-mentor-hub';
import { DashboardQuickLinks } from '@/components/dashboard/dashboard-quick-links';
import { Skeleton } from '@/components/ui/skeleton';
import { CoderunCard, SectionHeader } from '@/components/stitch/CoderunCard';
import { GhostieMotivationCard } from '@/components/stitch/GhostieCard';
import { MODULE_EMOJIS } from '@/lib/constants/app.constants';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useUserStats();
  const { data: leaderboard, isLoading: lbLoading } = useLeaderboard(5);
  const { data: modules, isLoading: modulesLoading } = useModules();
  const continueLearning = useContinueLearning();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Günaydın';
    if (hour < 18) return 'İyi günler';
    return 'İyi akşamlar';
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-8">
      {statsLoading ? (
        <Skeleton className="h-64 rounded-3xl" />
      ) : (
        <DashboardHero
          username={user?.username ?? 'Öğrenci'}
          level={stats?.level ?? 1}
          totalXp={stats?.totalXp ?? 0}
          streak={stats?.streak ?? 0}
          levelProgress={stats?.levelProgress.progressPercentage ?? 0}
          greeting={greeting()}
          continueHref={continueLearning.href}
          continueTitle={continueLearning.lessonTitle ?? continueLearning.moduleTitle}
        />
      )}

      <DashboardQuickLinks />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="flex flex-col gap-6 xl:col-span-2">
          {continueLearning.codingLesson && (
            <Link href={continueLearning.codingLesson.href} className="group block">
              <CoderunCard
                variant="highlight"
                className="overflow-hidden border-secondary/25 bg-gradient-to-r from-secondary/10 via-surface-container-lowest to-primary/10 transition-all hover:shadow-primary-lg"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
                    <Code2 className="h-8 w-8" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-label text-label-sm uppercase tracking-wide text-secondary">
                      Kod Laboratuvarı
                    </p>
                    <h2 className="font-heading text-h4 font-bold text-on-surface">
                      {continueLearning.codingLesson.title}
                    </h2>
                    <p className="mt-1 font-sans text-body-sm text-on-surface-variant">
                      HackerRank tarzı split ekran — soru, editör, test sonuçları ve Ghostie mentor bir arada.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1 self-start rounded-xl bg-secondary px-4 py-2 font-sans text-sm font-bold text-on-secondary transition-transform group-hover:scale-[1.02] sm:self-center">
                    Pratiğe Başla
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </CoderunCard>
            </Link>
          )}

          <div>
            <SectionHeader
              title="Öğrenme Yolların"
              action={
                <Link href="/learn" className="font-sans text-body-sm font-semibold text-primary hover:underline">
                  Tümünü Gör →
                </Link>
              }
            />
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {modulesLoading
                ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)
                : modules?.slice(0, 4).map((module) => (
                    <Link key={module.id} href={`/learn/${module.slug}`}>
                      <CoderunCard className="h-full transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-2xl">
                            {MODULE_EMOJIS[module.slug] ?? '📚'}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-heading text-base font-bold text-on-surface">{module.title}</h4>
                            <p className="mt-1 line-clamp-2 font-sans text-body-sm text-on-surface-variant">
                              {module.description}
                            </p>
                          </div>
                        </div>
                      </CoderunCard>
                    </Link>
                  ))}
            </div>
          </div>

          <div>
            <SectionHeader
              title="Liderboard Önizleme"
              action={
                <Link href="/leaderboard" className="font-sans text-body-sm font-semibold text-primary hover:underline">
                  Tam Liste →
                </Link>
              }
            />
            <CoderunCard className="mt-4" padding="sm">
              {lbLoading ? (
                <Skeleton className="h-32" />
              ) : (leaderboard?.entries ?? []).length > 0 ? (
                <div className="divide-y divide-outline-variant">
                  {(leaderboard?.entries ?? []).map((entry, i) => (
                    <div key={entry.userId} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                      <span className="w-8 text-center text-lg">
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                      </span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-fixed font-semibold text-primary">
                        {entry.username.charAt(0).toUpperCase()}
                      </div>
                      <p className="flex-1 truncate font-sans text-sm font-semibold text-on-surface">
                        {entry.username}
                      </p>
                      <p className="font-heading text-sm font-bold text-primary">{entry.weeklyXp} XP</p>
                    </div>
                  ))}
                </div>
              ) : (
                <GhostieMotivationCard
                  title="Liderboard"
                  message="Henüz sıralama yok — ilk XP'yi sen kazan! (Demo veri yoksa boş kalır.)"
                  mood="helping"
                />
              )}
            </CoderunCard>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <GhostieMentorHub className="min-h-[420px]" />

          <CoderunCard>
            <SectionHeader title="Hızlı İstatistikler" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <MiniStat label="Ders" value={stats?.totalLessonsCompleted ?? 0} />
              <MiniStat label="XP" value={stats?.totalXp ?? 0} />
              <MiniStat label="Seri" value={stats?.streak ?? 0} />
              <MiniStat label="Seviye" value={stats?.level ?? 1} />
            </div>
          </CoderunCard>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-low p-3 text-center">
      <p className="font-label text-[10px] uppercase tracking-wide text-on-surface-variant">{label}</p>
      <p className="font-heading text-xl font-bold text-on-surface">{value}</p>
    </div>
  );
}
