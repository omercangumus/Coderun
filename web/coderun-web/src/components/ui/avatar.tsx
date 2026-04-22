import { cn } from '@/lib/utils/cn';

interface AvatarProps {
  username: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-12 w-12 text-base',
};

// Deterministik renk: username hash'inden
function getColor(username: string): string {
  const colors = [
    'bg-purple-600',
    'bg-blue-600',
    'bg-green-600',
    'bg-yellow-600',
    'bg-red-600',
    'bg-pink-600',
    'bg-indigo-600',
    'bg-teal-600',
  ];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({ username, size = 'md', className }: AvatarProps) {
  const initial = username.charAt(0).toUpperCase();
  const color = getColor(username);

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full font-semibold text-white',
        color,
        sizeClasses[size],
        className
      )}
    >
      {initial}
    </div>
  );
}
