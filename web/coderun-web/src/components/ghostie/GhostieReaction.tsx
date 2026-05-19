'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { GhostieState, ghostieAnimationByState, ghostieImageByState } from '@/lib/ghostie-assets';
import { cn } from '@/lib/utils/cn';

export type GhostieReactionProps = {
  state: GhostieState;
  message?: string;
  size?: number;
  preferAnimation?: boolean;
  className?: string;
};

export function GhostieReaction({
  state,
  message,
  size = 120,
  preferAnimation = true,
  className,
}: GhostieReactionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const animationSrc = ghostieAnimationByState[state];
  const imageSrc = ghostieImageByState[state];

  useEffect(() => {
    if (videoRef.current && preferAnimation) {
      videoRef.current.play().catch(e => {
        console.warn("Auto-play prevented for Ghostie animation", e);
      });
    }
  }, [state, preferAnimation]);

  const Visual = () => (
    <div
      className="relative rounded-full overflow-hidden"
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl" />
      {preferAnimation ? (
        <video
          ref={videoRef}
          src={animationSrc}
          className="relative z-10 w-full h-full object-contain"
          autoPlay
          loop
          muted
          playsInline
          onError={(e) => {
            // Fallback strategy if video fails to load
            e.currentTarget.style.display = 'none';
            if (e.currentTarget.nextElementSibling) {
              (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
            }
          }}
        />
      ) : null}
      
      {/* Fallback image (or primary image if preferAnimation is false) */}
      <Image
        src={imageSrc}
        alt={`Ghostie ${state}`}
        width={size}
        height={size}
        className={cn("relative z-10 w-full h-full object-contain", preferAnimation && "hidden")}
      />
    </div>
  );

  if (!message) {
    return <div className={cn("inline-block", className)}><Visual /></div>;
  }

  return (
    <div className={cn("flex items-center gap-4 p-4 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-surface-container-lowest", className)}>
      <Visual />
      <div className="flex flex-col">
        <span className="text-sm font-bold text-primary font-heading">
          Ghostie AI
        </span>
        <span className="text-sm text-on-surface-variant mt-1 leading-relaxed max-w-md">
          {message}
        </span>
      </div>
    </div>
  );
}
