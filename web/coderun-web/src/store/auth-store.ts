import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserResponse } from '@/lib/types/auth.types';

interface AuthState {
  user: UserResponse | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: UserResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user, error: null, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error, isLoading: false }),
      reset: () => set({ user: null, isLoading: false, error: null }),
    }),
    {
      name: 'coderun-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
