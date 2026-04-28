'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Trophy, User, Medal } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const navItems = [
  { href: '/', icon: Home, label: 'Ana Sayfa' },
  { href: '/learn', icon: BookOpen, label: 'Öğren' },
  { href: '/leaderboard', icon: Trophy, label: 'Liderboard' },
  { href: '/badges', icon: Medal, label: 'Rozetler' },
  { href: '/profile', icon: User, label: 'Profil' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex bg-secondary/95 backdrop-blur border-t border-slate-700/50">
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex-1 flex flex-col items-center gap-1 py-2 text-xs transition-colors',
              isActive ? 'text-accent' : 'text-slate-500'
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
