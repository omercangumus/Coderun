'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Trophy, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/lib/hooks/use-auth';

const navItems = [
  { href: '/', icon: Home, label: 'Ana Sayfa' },
  { href: '/learn', icon: BookOpen, label: 'Öğren' },
  { href: '/leaderboard', icon: Trophy, label: 'Liderboard' },
  { href: '/profile', icon: User, label: 'Profil' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-secondary border-r border-slate-700/50 p-4">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 py-4 mb-6">
        <span className="text-2xl">🚀</span>
        <span className="text-xl font-bold text-white">Coderun</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent text-white'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      {user && (
        <div className="border-t border-slate-700/50 pt-4 mt-4">
          <div className="flex items-center gap-3 px-2 mb-3">
            <Avatar username={user.username} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.username}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Çıkış Yap
          </button>
        </div>
      )}
    </aside>
  );
}
