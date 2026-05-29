'use client';

import Link from 'next/link';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/lib/hooks/use-auth';
import { useUserStats } from '@/lib/hooks/use-gamification';
import { formatXP } from '@/lib/utils/format';
import { GhostieAvatar } from '../ghostie/GhostieAvatar';

export function Topbar() {
  const { user } = useAuth();
  const { data: stats } = useUserStats();

  return (
    <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-surface-container-lowest/95 backdrop-blur border-b border-outline-variant">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div className="w-7 h-7 flex items-center justify-center">
          <GhostieAvatar state="idle" size={28} />
        </div>
        <span className="font-heading text-base font-bold text-on-surface">Coderun</span>
      </Link>

      {/* Stats row */}
      <div className="flex items-center gap-2">
        {stats && (
          <>
            <span className="inline-flex items-center gap-1 bg-primary-fixed text-primary rounded-full px-2.5 py-1 text-xs font-semibold font-sans">
              ⚡ {formatXP(stats.totalXp)}
            </span>
            {stats.streak > 0 && (
              <span className="inline-flex items-center gap-1 bg-orange-500/10 text-streak-orange rounded-full px-2.5 py-1 text-xs font-semibold font-sans">
                🔥 {stats.streak}
              </span>
            )}
          </>
        )}
        {user && (
          <Link href="/profile">
            <Avatar username={user.username} size="sm" />
          </Link>
        )}
      </div>
    </header>
  );
}
