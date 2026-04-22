import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'gold' | 'orange' | 'green';
  className?: string;
}

const variantClasses = {
  default: 'bg-slate-700 text-slate-300',
  gold: 'bg-xpGold/20 text-xpGold border border-xpGold/30',
  orange: 'bg-streakOrange/20 text-streakOrange border border-streakOrange/30',
  green: 'bg-green-500/20 text-green-400 border border-green-500/30',
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
