'use client';

import { BookOpen, Zap, Flame, Trophy } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { useUserStats, useBadges } from '@/lib/hooks/use-gamification';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/dashboard/stat-card';
import { XpProgressBar } from '@/components/dashboard/xp-progress-bar';
import { StreakWidget } from '@/components/dashboard/streak-widget';
import { BadgeChip } from '@/components/dashboard/badge-chip';
import { Skeleton } from '@/components/ui/skeleton';
import { BADGE_ICONS } from '@/lib/constants/app.constants';

// Tüm mevcut rozetler (kazanılmamış olanlar için)
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
    <div className="flex flex-col gap-6">
      {/* Avatar + Kullanıcı Bilgisi */}
      <Card className="flex items-center gap-4">
        {user ? (
          <Avatar username={user.username} size="lg" />
        ) : (
          <Skeleton className="h-12 w-12" rounded />
        )}
        <div>
          <h1 className="text-xl font-bold text-white">{user?.username}</h1>
          <p className="text-sm text-slate-400">{user?.email}</p>
        </div>
      </Card>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-2 gap-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)
        ) : (
          <>
            <StatCard icon={Zap} value={`${stats?.totalXp ?? 0} XP`} title="Toplam XP" bgColor="bg-xpGold/20" />
            <StatCard icon={Trophy} value={stats?.level ?? 1} title="Seviye" bgColor="bg-purple-500/20" />
            <StatCard icon={BookOpen} value={stats?.totalLessonsCompleted ?? 0} title="Ders" bgColor="bg-blue-500/20" />
            <StatCard icon={Flame} value={stats?.streak ?? 0} title="Streak" bgColor="bg-streakOrange/20" />
          </>
        )}
      </div>

      {/* XP Progress */}
      {stats && (
        <Card>
          <p className="text-xs text-slate-400 mb-2">Seviye İlerlemesi</p>
          <XpProgressBar levelProgress={stats.levelProgress} />
        </Card>
      )}

      {/* Streak */}
      {stats && (
        <Card className="flex items-center gap-4">
          <StreakWidget streak={stats.streakInfo} />
          <div>
            <p className="text-white font-medium">
              {stats.streakInfo.isAlive ? 'Streak devam ediyor!' : 'Streak bitti'}
            </p>
            <p className="text-sm text-slate-400">
              Sonraki rozet: {stats.streakInfo.daysToNextMilestone} gün kaldı
            </p>
          </div>
        </Card>
      )}

      {/* Rozetler */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Rozetler</h2>
        <div className="grid grid-cols-3 gap-3">
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

      {/* Çıkış */}
      <Button variant="danger" onClick={logout} className="w-full">
        Çıkış Yap
      </Button>
    </div>
  );
}
