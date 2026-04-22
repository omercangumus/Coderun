import { cn } from '@/lib/utils/cn';

interface ProgressProps {
  value: number;
  color?: 'primary' | 'gold' | 'orange';
  className?: string;
  showLabel?: boolean;
}

const colorClasses = {
  primary: 'bg-accent',
  gold: 'bg-xpGold',
  orange: 'bg-streakOrange',
};

export function Progress({
  value,
  color = 'primary',
  className,
  showLabel = false,
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('relative', className)}>
      <div className="h-2 w-full rounded-full bg-slate-700">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            colorClasses[color]
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="absolute right-0 -top-5 text-xs text-slate-400">
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}
