import { format, formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

export function formatXP(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}K XP`;
  return `${xp} XP`;
}

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), 'dd MMM yyyy', { locale: tr });
}

export function formatRelativeDate(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: tr });
}

export function formatLevel(level: number): string {
  return `Seviye ${level}`;
}

export function formatStreak(streak: number): string {
  return `${streak} gün`;
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}
