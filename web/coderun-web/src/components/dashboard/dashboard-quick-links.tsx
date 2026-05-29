'use client';

import Link from 'next/link';
import { BookOpen, Code2, Trophy, Medal, Target, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const LINKS = [
  {
    href: '/learn',
    title: 'Öğrenme Yolları',
    description: 'Modüllere göz at',
    icon: BookOpen,
    accent: 'from-primary/15 to-primary/5 text-primary',
  },
  {
    href: '/learn/python',
    title: 'Kod Pratiği',
    description: 'Python kodlama ödevleri',
    icon: Code2,
    accent: 'from-secondary/15 to-secondary/5 text-secondary',
  },
  {
    href: '/badges',
    title: 'Rozetler',
    description: 'Başarılarını topla',
    icon: Medal,
    accent: 'from-tertiary/15 to-tertiary/5 text-tertiary',
  },
  {
    href: '/leaderboard',
    title: 'Liderboard',
    description: 'Sıralamada yüksel',
    icon: Trophy,
    accent: 'from-amber-500/15 to-amber-500/5 text-amber-600',
  },
];

export function DashboardQuickLinks({ className }: { className?: string }) {
  return (
    <div className={cn('grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4', className)}>
      {LINKS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group relative overflow-hidden rounded-2xl border border-outline-variant/70 bg-surface-container-lowest p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card-hover"
        >
          <div className={cn('mb-3 inline-flex rounded-xl bg-gradient-to-br p-2.5', item.accent)}>
            <item.icon className="h-5 w-5" />
          </div>
          <h3 className="font-heading text-sm font-bold text-on-surface">{item.title}</h3>
          <p className="mt-1 font-sans text-xs text-on-surface-variant">{item.description}</p>
        </Link>
      ))}

      <div className="relative overflow-hidden rounded-2xl border border-dashed border-primary/30 bg-primary-fixed/40 p-4 sm:col-span-2 xl:col-span-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-primary/15 p-2.5 text-primary">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className="font-label text-label-sm uppercase tracking-wide text-primary">Bugünün Hedefi</p>
              <p className="font-heading text-base font-bold text-on-surface">En az 1 ders veya 1 kod sorusu</p>
              <p className="mt-1 font-sans text-xs text-on-surface-variant">
                Streak&apos;ini korumak ve XP kazanmak için küçük bir adım yeterli.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-full bg-surface-container-lowest px-3 py-1.5 font-sans text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Ghostie seni destekliyor
          </div>
        </div>
      </div>
    </div>
  );
}
