'use client';

import { LogOut, Smartphone, Bell, Sun, Moon, Palette } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { useUserStats, useBadges } from '@/lib/hooks/use-gamification';
import { useSettingsStore } from '@/store/settings-store';
import { Avatar } from '@/components/ui/avatar';
import { BadgeChip } from '@/components/dashboard/badge-chip';
import { Skeleton } from '@/components/ui/skeleton';
import { BADGE_ICONS } from '@/lib/constants/app.constants';
import { CoderunCard, StatCard, SectionHeader } from '@/components/stitch/CoderunCard';
import { LeagueBadge } from '@/components/stitch/LeaderboardCard';
import { StatPill } from '@/components/stitch/StitchButton';
import { cn } from '@/lib/utils/cn';

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
  const { hapticsEnabled, toggleHaptics, theme, setTheme } = useSettingsStore();

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
                {Math.round(stats.levelProgress.progressPercentage)}%
              </p>
            </div>
            <div className="cr-progress-bar">
              <div
                className="cr-progress-fill"
                style={{ width: `${stats.levelProgress.progressPercentage}%` }}
              />
            </div>
            <p className="font-sans text-body-sm text-on-surface-variant mt-2">
              Sonraki seviyeye {100 - Math.round(stats.levelProgress.progressPercentage)} XP kaldı
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
              <div className="w-14 h-14 bg-streak-orange/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
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

        {/* Ayarlar */}
        <div>
          <SectionHeader title="Ayarlar" className="mb-4" />
          <CoderunCard>
            <div className="flex flex-col gap-1 divide-y divide-outline-variant">
              {/* Titreşim toggle */}
              <div className="flex items-center justify-between py-3 first:pt-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-sans text-body-sm font-semibold text-on-surface">
                      Titreşim (Haptic Feedback)
                    </p>
                    <p className="font-sans text-xs text-on-surface-variant">
                      Doğru/yanlış cevaplarda titreşim
                    </p>
                  </div>
                </div>
                {/* Toggle switch */}
                <button
                  onClick={toggleHaptics}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                    hapticsEnabled ? 'bg-primary' : 'bg-outline-variant'
                  }`}
                  aria-checked={hapticsEnabled}
                  role="switch"
                  aria-label="Titreşimi aç/kapat"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                      hapticsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Tema Seçimi */}
              <div className="flex flex-col gap-3 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Palette className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-sans text-body-sm font-semibold text-on-surface">
                      Görünüm Teması
                    </p>
                    <p className="font-sans text-xs text-on-surface-variant">
                      Platform görünümünü kişiselleştirin
                    </p>
                  </div>
                </div>
                {/* Theme selectors */}
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {(['light', 'dark', 'coderun-comfort'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={cn(
                        'flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-150',
                        theme === t
                          ? 'bg-primary text-white border-primary shadow-[0_2px_8px_rgba(61,74,216,0.15)]'
                          : 'bg-surface-container text-on-surface-variant border-outline-variant hover:bg-surface-container-high'
                      )}
                    >
                      {t === 'light' && <Sun className="w-3.5 h-3.5" />}
                      {t === 'dark' && <Moon className="w-3.5 h-3.5" />}
                      {t === 'coderun-comfort' && <Palette className="w-3.5 h-3.5" />}
                      <span>
                        {t === 'light' && 'Açık'}
                        {t === 'dark' && 'Koyu'}
                        {t === 'coderun-comfort' && 'Comfort'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bildirimler placeholder */}
              <div className="flex items-center justify-between py-3 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-amber-500/10 rounded-xl flex items-center justify-center">
                    <Bell className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-sans text-body-sm font-semibold text-on-surface">
                      Bildirimler
                    </p>
                    <p className="font-sans text-xs text-on-surface-variant">
                      Streak hatırlatıcıları (yakında)
                    </p>
                  </div>
                </div>
                <span className="text-xs text-on-surface-variant bg-surface-container px-2 py-1 rounded-full">Yakında</span>
              </div>
            </div>
          </CoderunCard>
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
