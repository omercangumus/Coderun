// Auth Zustand store

import { create } from 'zustand';
import axios from 'axios';
import * as authApi from '../api/auth';
import { clearTokens, getAccessToken } from '../api/client';
import type { User } from '../types/auth';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

interface AuthState {
  user: User | null;
  status: AuthStatus;
  error: string | null;

  // Actions
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'idle',
  error: null,

  checkAuth: async () => {
    set({ status: 'loading' });
    try {
      const token = await getAccessToken();
      if (!token) {
        set({ status: 'unauthenticated', user: null });
        return;
      }
      const user = await authApi.getCurrentUser();
      set({ status: 'authenticated', user, error: null });
    } catch {
      await clearTokens();
      set({ status: 'unauthenticated', user: null });
    }
  },

  login: async (email: string, password: string) => {
    set({ status: 'loading', error: null });
    try {
      await authApi.login({ email, password });
      const user = await authApi.getCurrentUser();
      set({ status: 'authenticated', user, error: null });
    } catch (err: unknown) {
      console.error('[AuthStore] Login failed:', err);
      if (axios.isAxiosError(err)) {
        console.error('[AuthStore] Login API response:', err.response?.data);
        const detail = err.response?.data?.detail;
        const message = typeof detail === 'string' ? detail : (typeof detail === 'object' ? JSON.stringify(detail) : (err.response?.data?.message || err.message));
        set({ status: 'error', error: message });
      } else {
        const message = err instanceof Error ? err.message : 'Giriş yapılamadı';
        set({ status: 'error', error: message });
      }
    }
  },

  register: async (email: string, username: string, password: string) => {
    set({ status: 'loading', error: null });
    try {
      await authApi.register({ email, username, password });
      await authApi.login({ email, password });
      const user = await authApi.getCurrentUser();
      set({ status: 'authenticated', user, error: null });
    } catch (err: unknown) {
      console.error('[AuthStore] Register failed:', err);
      if (axios.isAxiosError(err)) {
        console.error('[AuthStore] Register API response:', err.response?.data);
        const detail = err.response?.data?.detail;
        const message = typeof detail === 'string' ? detail : (typeof detail === 'object' ? JSON.stringify(detail) : (err.response?.data?.message || err.message));
        set({ status: 'error', error: message });
      } else {
        const message = err instanceof Error ? err.message : 'Kayıt olunamadı';
        set({ status: 'error', error: message });
      }
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      await clearTokens();
    }
    set({ status: 'unauthenticated', user: null, error: null });
  },

  clearError: () => set({ error: null }),
}));
