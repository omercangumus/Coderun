import { cn } from '@/lib/utils/cn';

interface ProgressProps {
  value: number;
  color?: 'primary' | 'gold' | 'orange';
  className?: string;
  showLabel?: boolean;
}

const colorClasses = {
  primary: 'bg-primary',
  gold: 'bg-xp-gold',
  orange: 'bg-streak-orange',
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
      <div className="h-2 w-full rounded-full bg-primary-fixed">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            colorClasses[color]
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="absolute right-0 -top-5 text-xs text-on-surface-variant">
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}
