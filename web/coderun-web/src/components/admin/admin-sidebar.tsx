'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Route,
  BookOpen,
  HelpCircle,
  Users,
  Settings,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/paths', label: 'Learning Paths', icon: Route },
  { href: '/admin/lessons', label: 'Lessons', icon: BookOpen },
  { href: '/admin/questions', label: 'Questions', icon: HelpCircle },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings, disabled: true },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-sidebar bg-surface-container-lowest border-r border-outline-variant min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-outline-variant">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-on font-bold text-sm">C</span>
          </div>
          <span className="font-heading text-h4 text-on-surface">
            Coderun <span className="text-primary">Admin</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.disabled ? '#' : item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-body-md font-medium transition-all ${
                item.disabled
                  ? 'text-on-surface-variant/40 cursor-not-allowed'
                  : isActive
                  ? 'bg-primary text-primary-on shadow-primary'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
              onClick={(e) => item.disabled && e.preventDefault()}
            >
              <Icon size={20} />
              <span>{item.label}</span>
              {item.disabled && (
                <span className="ml-auto text-label-sm bg-surface-container px-2 py-0.5 rounded-full">
                  Soon
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-outline-variant">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center">
            <span className="text-tertiary-on text-sm font-bold">A</span>
          </div>
          <div>
            <p className="text-body-sm font-medium text-on-surface">Admin</p>
            <p className="text-label-sm text-on-surface-variant">Superuser</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
