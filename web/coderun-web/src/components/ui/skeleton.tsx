import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
}

export function Skeleton({ className, rounded = false }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-slate-700/60',
        rounded ? 'rounded-full' : 'rounded-lg',
        className
      )}
    />
  );
}
