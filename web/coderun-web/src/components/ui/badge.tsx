import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'gold' | 'orange' | 'green';
  className?: string;
}

const variantClasses = {
  default: 'bg-surface-container text-on-surface-variant border border-outline-variant',
  gold: 'bg-xp-gold/20 text-xp-gold border border-xp-gold/30',
  orange: 'bg-streak-orange/20 text-streak-orange border border-streak-orange/30',
  green: 'bg-secondary-container/30 text-secondary border border-secondary/30',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
