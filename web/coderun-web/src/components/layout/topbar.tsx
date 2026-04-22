'use client';

import Link from 'next/link';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/lib/hooks/use-auth';
import { useUserStats } from '@/lib/hooks/use-gamification';
import { formatXP } from '@/lib/utils/format';

export function Topbar() {
  const { user } = useAuth();
  const { data: stats } = useUserStats();

  return (
    <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-secondary/95 backdrop-blur border-b border-slate-700/50">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <span className="text-xl">🚀</span>
        <span className="font-bold text-white">Coderun</span>
      </Link>

      {/* XP */}
      {stats && (
        <div className="flex items-center gap-1.5 bg-xpGold/10 border border-xpGold/30 rounded-full px-3 py-1">
          <span className="text-xpGold text-sm">⚡</span>
          <span className="text-xpGold text-sm font-semibold">
            {formatXP(stats.totalXp)}
          </span>
        </div>
      )}

      {/* Avatar */}
      {user && (
        <Link href="/profile">
          <Avatar username={user.username} size="sm" />
        </Link>
      )}
    </header>
  );
}
