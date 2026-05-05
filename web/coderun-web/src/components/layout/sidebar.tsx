'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BookOpen,
  Trophy,
  User,
  LogOut,
  Medal,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/lib/hooks/use-auth';

const navItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/learn', icon: BookOpen, label: 'Öğrenme Yolları' },
  { href: '/leaderboard', icon: Trophy, label: 'Liderboard' },
  { href: '/badges', icon: Medal, label: 'Başarılar' },
  { href: '/profile', icon: User, label: 'Profil' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-sidebar min-h-screen bg-white border-r border-outline-variant">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-outline-variant">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-base">
          👻
        </div>
        <span className="font-heading text-lg font-bold text-on-surface">Coderun</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-0.5 p-3 pt-4">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

          return (
            <Link
              key={label}
              href={href}
              className={cn(
                'cr-sidebar-item',
                isActive && 'cr-sidebar-item-active'
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Ghostie AI shortcut */}
      <div className="px-3 pb-3">
        <Link
          href="/learn"
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl',
            'bg-gradient-to-r from-primary-fixed to-white',
            'border border-primary/20',
            'transition-all duration-150 hover:shadow-primary cursor-pointer'
          )}
        >
          <span className="text-xl">👻</span>
          <div className="min-w-0">
            <p className="font-sans text-xs font-semibold text-primary">Ghostie AI</p>
            <p className="font-sans text-[11px] text-on-surface-variant truncate">
              AI Mentor
            </p>
          </div>
        </Link>
      </div>

      {/* User */}
      {user && (
        <div className="border-t border-outline-variant p-3">
          <div className="flex items-center gap-3 px-2 py-2 mb-1">
            <Avatar username={user.username} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="font-sans text-sm font-semibold text-on-surface truncate">
                {user.username}
              </p>
              <p className="font-sans text-xs text-on-surface-variant truncate">
                {user.email}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm font-sans text-on-surface-variant hover:text-error hover:bg-error-container/30 rounded-xl transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Çıkış Yap
          </button>
        </div>
      )}
    </aside>
  );
}
