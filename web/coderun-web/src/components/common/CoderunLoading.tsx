import React from 'react';
import { GhostieReaction } from '../ghostie/GhostieReaction';

type CoderunLoadingProps = {
  message?: string;
};

export function CoderunLoading({ message = 'Yükleniyor...' }: CoderunLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full animate-fade-in">
      <GhostieReaction
        state="idle"
        size={160}
        preferAnimation={true}
      />
      <div className="mt-8 text-center">
        <h3 className="text-xl font-heading font-bold text-on-surface mb-4">
          {message}
        </h3>
        {/* Indeterminate Progress Bar */}
        <div className="w-64 h-2 bg-surface-container-highest rounded-full overflow-hidden relative mx-auto flex items-center justify-center">
          <div className="h-full w-1/2 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
