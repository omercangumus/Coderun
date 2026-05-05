'use client';

import { LogOut } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { useUserStats, useBadges } from '@/lib/hooks/use-gamification';
import { Avatar } from '@/components/ui/avatar';
import { BadgeChip } from '@/components/dashboard/badge-chip';
import { Skeleton } from '@/components/ui/skeleton';
import { BADGE_ICONS } from '@/lib/constants/app.constants';
import { CoderunCard, StatCard, SectionHeader } from '@/components/stitch/CoderunCard';
import { LeagueBadge } from '@/components/stitch/LeaderboardCard';
import { StatPill } from '@/components/stitch/StitchButton';

const ALL_BADGES = Object.entries(BADGE_ICONS).map(([type, icon]) => ({
  id: type,
  badgeType: type,
  earnedAt: '',
  title: type.replace(/_/g, ' '),
  description: '',
  icon,
}));

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { data: stats, isLoading } = useUserStats();
  const { data: earnedBadges } = useBadges();

  const earnedTypes = new Set(earnedBadges?.map((b) => b.badgeType) ?? []);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Profile Header */}
        <CoderunCard>
          <div className="flex items-center gap-4">
            {user ? (
              <Avatar username={user.username} size="lg" />
            ) : (
              <Skeleton className="h-16 w-16 rounded-full" />
            )}
            <div className="flex-1 min-w-0">
              <h1 className="font-heading text-h3 font-bold text-on-surface">
                {user?.username ?? '...'}
              </h1>
              <p className="font-sans text-body-sm text-on-surface-variant">
                {user?.email}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {stats && (
                  <>
                    <StatPill icon="⚡" value={`${stats.totalXp} XP`} color="primary" />
                    <StatPill icon="🔥" value={`${stats.streak} gün`} color="orange" />
                  </>
                )}
              </div>
            </div>
            <LeagueBadge league="Diamond" />
          </div>
        </CoderunCard>

        {/* XP Progress */}
        {stats && (
          <CoderunCard>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-label text-label-sm text-on-surface-variant uppercase tracking-wide">
                  Seviye İlerlemesi
                </p>
                <p className="font-heading text-h4 font-bold text-primary mt-0.5">
                  Seviye {stats.level}
                </p>
              </div>
              <p className="font-heading text-h3 font-bold text-primary">
                {Math.round(stats.levelProgress * 100)}%
              </p>
            </div>
            <div className="cr-progress-bar">
              <div
                className="cr-progress-fill"
                style={{ width: `${stats.levelProgress * 100}%` }}
              />
            </div>
            <p className="font-sans text-body-sm text-on-surface-variant mt-2">
              Sonraki seviyeye {100 - Math.round(stats.levelProgress * 100)} XP kaldı
            </p>
          </CoderunCard>
        )}

        {/* Stats Grid */}
        <div>
          <SectionHeader title="İstatistikler" className="mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))
            ) : (
              <>
                <StatCard
                  icon="⚡"
                  label="Toplam XP"
                  value={stats?.totalXp ?? 0}
                  color="primary"
                />
                <StatCard
                  icon="🏆"
                  label="Seviye"
                  value={stats?.level ?? 1}
                  color="purple"
                />
                <StatCard
                  icon="📖"
                  label="Ders"
                  value={stats?.totalLessonsCompleted ?? 0}
                  color="primary"
                />
                <StatCard
                  icon="🔥"
                  label="Streak"
                  value={stats?.streak ?? 0}
                  subValue={stats && stats.streak > 0 ? 'Devam ediyor!' : 'Başla'}
                  color="orange"
                />
              </>
            )}
          </div>
        </div>

        {/* Streak info */}
        {stats && (
          <CoderunCard>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                🔥
              </div>
              <div>
                <p className="font-heading text-h4 font-bold text-on-surface">
                  {stats.streak} Günlük Streak
                </p>
                <p className="font-sans text-body-sm text-on-surface-variant mt-0.5">
                  {stats.streakInfo?.isAlive
                    ? 'Streak devam ediyor! Bugün de giriş yap.'
                    : 'Streak bitti. Yeniden başla!'}
                </p>
                {stats.streakInfo?.daysToNextMilestone > 0 && (
                  <p className="font-sans text-body-sm text-primary mt-1">
                    Sonraki rozet için {stats.streakInfo.daysToNextMilestone} gün kaldı
                  </p>
                )}
              </div>
            </div>
          </CoderunCard>
        )}

        {/* Badges */}
        <div>
          <SectionHeader title="Rozetler" className="mb-4" />
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {ALL_BADGES.map((badge) => {
              const earned = earnedBadges?.find((b) => b.badgeType === badge.badgeType);
              return (
                <BadgeChip
                  key={badge.badgeType}
                  badge={earned ?? badge}
                  earned={earnedTypes.has(badge.badgeType)}
                />
              );
            })}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-full border-2 border-error/30 text-error font-sans font-semibold hover:bg-error-container/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}
