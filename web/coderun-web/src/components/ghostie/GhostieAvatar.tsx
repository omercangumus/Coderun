import React from 'react';
import Image from 'next/image';
import { GhostieState, ghostieImageByState } from '@/lib/ghostie-assets';
import { cn } from '@/lib/utils/cn';

export type GhostieAvatarProps = {
  state?: GhostieState;
  size?: number;
  className?: string;
};

export function GhostieAvatar({
  state = 'idle',
  size = 40,
  className,
}: GhostieAvatarProps) {
  return (
    <div
      className={cn("relative rounded-full bg-primary/10 overflow-hidden flex items-center justify-center border border-primary/20", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={ghostieImageByState[state]}
        alt={`Ghostie ${state}`}
        width={size * 0.8}
        height={size * 0.8}
        className="object-contain"
      />
    </div>
  );
}
