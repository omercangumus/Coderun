// Coderun Stitch Design System — Card Components

import { cn } from '@/lib/utils/cn';
import { ReactNode } from 'react';

interface CoderunCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'highlight' | 'success' | 'ghost';
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const variantMap = {
  default: 'bg-white border border-outline-variant shadow-card',
  highlight: 'bg-primary-fixed border border-primary/20 shadow-primary',
  success: 'bg-secondary-container/30 border border-secondary-fixed-dim',
  ghost: 'bg-surface-container border border-outline-variant/50',
};

export function CoderunCard({
  children,
  className,
  onClick,
  variant = 'default',
  padding = 'md',
}: CoderunCardProps) {
  const base = cn(
    'rounded-xl transition-all duration-200',
    variantMap[variant],
    paddingMap[padding],
    onClick && 'cursor-pointer hover:shadow-card-hover active:scale-[0.99]',
    className
  );

  if (onClick) {
    return (
      <button type="button" className={base} onClick={onClick}>
        {children}
      </button>
    );
  }

  return <div className={base}>{children}</div>;
}

// Stat card — compact metric display
interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  subValue?: string;
  color?: 'primary' | 'success' | 'warning' | 'purple' | 'orange';
  className?: string;
}

const statColorMap = {
  primary: { bg: 'bg-primary-fixed', text: 'text-primary', icon: 'text-primary' },
  success: { bg: 'bg-secondary-container/40', text: 'text-secondary', icon: 'text-secondary' },
  warning: { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'text-amber-500' },
  purple: { bg: 'bg-tertiary-fixed', text: 'text-tertiary', icon: 'text-tertiary' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'text-orange-500' },
};

export function StatCard({ icon, label, value, subValue, color = 'primary', className }: StatCardProps) {
  const colors = statColorMap[color];
  return (
    <div className={cn('cr-card p-4 flex items-center gap-3', className)}>
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-xl', colors.bg)}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="font-label text-label-sm text-on-surface-variant uppercase tracking-wide truncate">
          {label}
        </p>
        <p className={cn('font-heading text-h4 font-bold leading-tight', colors.text)}>
          {value}
        </p>
        {subValue && (
          <p className="font-sans text-body-sm text-on-surface-variant">{subValue}</p>
        )}
      </div>
    </div>
  );
}

// Section header
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, action, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div>
        <h2 className="font-heading text-h3 font-bold text-on-surface">{title}</h2>
        {subtitle && (
          <p className="font-sans text-body-sm text-on-surface-variant mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
