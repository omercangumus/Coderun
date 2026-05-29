// Coderun Stitch Design System — Button Components

import { cn } from '@/lib/utils/cn';
import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'success' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface StitchButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white shadow-primary hover:bg-primary-container hover:shadow-primary-lg',
  secondary: 'bg-transparent text-primary border-2 border-primary hover:bg-primary-fixed',
  ghost: 'bg-transparent text-on-surface-variant hover:bg-surface-container',
  success: 'bg-secondary text-white hover:opacity-90',
  danger: 'bg-error text-white hover:opacity-90',
  outline: 'bg-surface-container-lowest text-on-surface border border-outline-variant hover:bg-surface-container',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-button-sm rounded-full',
  md: 'px-6 py-3 text-button rounded-full',
  lg: 'px-8 py-4 text-button rounded-full',
};

export function StitchButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}: StitchButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2',
        'font-sans font-semibold',
        'transition-all duration-200 active:scale-95',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin w-4 h-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// XP/Streak stat pill
interface StatPillProps {
  icon: string;
  value: string;
  color?: 'primary' | 'orange' | 'gold' | 'purple' | 'green';
  className?: string;
}

const pillColors: Record<string, string> = {
  primary: 'bg-primary-fixed text-primary',
  orange: 'bg-orange-50 text-orange-600',
  gold: 'bg-yellow-50 text-yellow-600',
  purple: 'bg-tertiary-fixed text-tertiary',
  green: 'bg-secondary-container/40 text-secondary',
};

export function StatPill({ icon, value, color = 'primary', className }: StatPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-sans text-body-sm font-semibold',
        pillColors[color],
        className
      )}
    >
      <span>{icon}</span>
      <span>{value}</span>
    </span>
  );
}

// Difficulty badge
interface DifficultyBadgeProps {
  level: 'easy' | 'medium' | 'hard';
  className?: string;
}

const difficultyConfig = {
  easy: { label: 'Kolay', color: 'bg-secondary-container/40 text-secondary' },
  medium: { label: 'Orta', color: 'bg-amber-50 text-amber-700' },
  hard: { label: 'Zor', color: 'bg-error-container text-error' },
};

export function DifficultyBadge({ level, className }: DifficultyBadgeProps) {
  const config = difficultyConfig[level];
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full font-label text-label-sm',
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
