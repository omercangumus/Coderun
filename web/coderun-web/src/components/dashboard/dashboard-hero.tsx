'use client';

import Link from 'next/link';
import { Flame, Zap, Trophy, ChevronRight } from 'lucide-react';
import { GhostieReaction } from '@/components/ghostie/GhostieReaction';
import { cn } from '@/lib/utils/cn';

interface DashboardHeroProps {
  username: string;
  level: number;
  totalXp: number;
  streak: number;
  levelProgress: number;
  greeting: string;
  continueHref?: string;
  continueTitle?: string;
  className?: string;
}

export function DashboardHero({
  username,
  level,
  totalXp,
  streak,
  levelProgress,
  greeting,
  continueHref,
  continueTitle,
  className,
}: DashboardHeroProps) {
  const momentumMessage =
    streak >= 7
      ? 'İnanılmaz bir seri! Bu tempoyu koru 🔥'
      : streak >= 3
        ? 'Harika gidiyorsun, serini bozma!'
        : 'Bugün bir ders tamamla, momentumunu başlat!';

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/12 via-surface-container-lowest to-secondary/8 p-6 md:p-8',
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-label text-label-sm uppercase tracking-widest text-primary/80">
              Öğrenme Merkezi
            </p>
            <h1 className="mt-1 font-heading text-h2 font-bold text-on-surface md:text-h1">
              {greeting}, {username}! 👋
            </h1>
            <p className="mt-2 max-w-xl font-sans text-body-md text-on-surface-variant">
              {momentumMessage}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <StatChip icon={<Zap className="h-4 w-4" />} label="XP" value={String(totalXp)} tone="primary" />
            <StatChip icon={<Flame className="h-4 w-4" />} label="Seri" value={`${streak} gün`} tone="orange" />
            <StatChip icon={<Trophy className="h-4 w-4" />} label="Seviye" value={String(level)} tone="purple" />
          </div>

          <div className="max-w-md">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-on-surface-variant">Seviye {level} ilerlemesi</span>
              <span className="font-heading font-bold text-primary">{Math.round(levelProgress)}%</span>
            </div>
            <div className="cr-progress-bar h-2.5">
              <div
                className="cr-progress-fill transition-all duration-700"
                style={{ width: `${Math.min(100, levelProgress)}%` }}
              />
            </div>
          </div>

          {continueHref && continueTitle && (
            <Link
              href={continueHref}
              className="group inline-flex w-fit items-center gap-2 rounded-2xl bg-primary px-5 py-3 font-sans text-sm font-bold text-on-primary shadow-[0_8px_24px_rgba(61,74,216,0.35)] transition-all hover:scale-[1.02] hover:bg-primary-container active:scale-[0.98]"
            >
              Devam Et: {continueTitle}
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>

        <div className="flex justify-center lg:justify-end">
          <GhostieReaction
            state={streak > 0 ? 'very_happy' : 'idle'}
            message="Ben Ghostie! Bugün hangi hedefe odaklanıyoruz?"
            size={120}
            preferAnimation
            className="max-w-sm border-primary/25 bg-surface-container-lowest/80 backdrop-blur-sm"
          />
        </div>
      </div>
    </section>
  );
}

function StatChip({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: 'primary' | 'orange' | 'purple';
}) {
  const tones = {
    primary: 'bg-primary-fixed text-primary border-primary/20',
    orange: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    purple: 'bg-tertiary-fixed text-tertiary border-tertiary/20',
  };

  return (
    <div className={cn('flex items-center gap-2 rounded-2xl border px-3 py-2', tones[tone])}>
      {icon}
      <div>
        <p className="font-label text-[10px] uppercase tracking-wide opacity-70">{label}</p>
        <p className="font-heading text-sm font-bold">{value}</p>
      </div>
    </div>
  );
}
