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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex bg-white/95 backdrop-blur border-t border-outline-variant safe-area-inset-bottom">
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-sans font-semibold transition-colors',
              isActive ? 'text-primary' : 'text-outline'
            )}
          >
            <Icon
              className={cn(
                'h-5 w-5 transition-colors',
                isActive ? 'text-primary' : 'text-outline'
              )}
            />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
