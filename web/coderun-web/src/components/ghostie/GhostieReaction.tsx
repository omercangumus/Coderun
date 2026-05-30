'use client';

import React, { useRef, useEffect, useState } from 'react';
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
  const [videoFailed, setVideoFailed] = useState(false);
  
  const animationSrc = ghostieAnimationByState[state];
  const imageSrc = ghostieImageByState[state];

  // Reset videoFailed when state changes so we try loading the new state's video
  useEffect(() => {
    setVideoFailed(false);
  }, [state]);

  useEffect(() => {
    if (videoRef.current && preferAnimation && !videoFailed) {
      videoRef.current.play().catch(e => {
        console.warn("Auto-play prevented for Ghostie animation", e);
      });
    }
  }, [state, preferAnimation, videoFailed]);

  const showVideo = preferAnimation && !videoFailed;

  const Visual = () => (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/25 via-primary-fixed/40 to-secondary/20" />
      {showVideo ? (
        <video
          ref={videoRef}
          src={animationSrc}
          className="relative z-10 h-full w-full object-contain [mix-blend-mode:multiply] dark:[mix-blend-mode:normal]"
          autoPlay
          loop
          muted
          playsInline
          onError={() => {
            console.warn(`Ghostie video failed to load for state: ${state}. Falling back to PNG.`);
            setVideoFailed(true);
          }}
        />
      ) : (
        <Image
          src={imageSrc}
          alt={`Ghostie ${state}`}
          width={size}
          height={size}
          className="relative z-10 h-full w-full object-contain [mix-blend-mode:multiply] dark:[mix-blend-mode:normal]"
        />
      )}
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
