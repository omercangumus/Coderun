'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { GhostieState } from '@/lib/ghostie-assets';

type AuthGhostieContextType = {
  ghostieState: GhostieState;
  setGhostieState: (state: GhostieState) => void;
};

const AuthGhostieContext = createContext<AuthGhostieContextType>({
  ghostieState: 'idle',
  setGhostieState: () => {},
});

export function AuthGhostieProvider({ children }: { children: React.ReactNode }) {
  const [ghostieState, setGhostieStateRaw] = useState<GhostieState>('idle');

  const setGhostieState = useCallback((state: GhostieState) => {
    setGhostieStateRaw(state);
  }, []);

  return (
    <AuthGhostieContext.Provider value={{ ghostieState, setGhostieState }}>
      {children}
    </AuthGhostieContext.Provider>
  );
}

export function useAuthGhostie() {
  return useContext(AuthGhostieContext);
}
