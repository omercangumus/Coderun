import { cn } from '@/lib/utils/cn';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-body-sm font-semibold text-on-surface">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'w-full rounded-xl border bg-surface-container-lowest px-4 py-3 text-body-sm text-on-surface',
          'placeholder:text-outline',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
          'transition-all duration-150',
          error
            ? 'border-error ring-1 ring-error'
            : 'border-outline-variant hover:border-outline',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-label-sm text-error flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
