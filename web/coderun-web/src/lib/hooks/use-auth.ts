'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { authApi } from '@/lib/api/auth-api';
import toast from 'react-hot-toast';
import type { LoginRequest, RegisterRequest } from '@/lib/types/auth.types';

export function useAuth() {
  const router = useRouter();
  const { user, isLoading, error, setUser, setLoading, setError, reset } =
    useAuthStore();

  const login = useCallback(
    async (data: LoginRequest) => {
      setLoading(true);
      try {
        const tokens = await authApi.login(data);
        authApi.saveTokens(tokens);
        const me = await authApi.getMe();
        setUser(me);
        toast.success('Hoş geldin!');
        router.push('/');
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { detail?: string } } })?.response?.data
            ?.detail ?? 'Giriş başarısız';
        setError(message);
        toast.error(message);
      }
    },
    [router, setLoading, setUser, setError]
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      setLoading(true);
      try {
        await authApi.register(data);
        // Otomatik login
        await login({ email: data.email, password: data.password });
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { detail?: string } } })?.response?.data
            ?.detail ?? 'Kayıt başarısız';
        setError(message);
        toast.error(message);
      }
    },
    [login, setError]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      authApi.clearTokens();
      reset();
      router.push('/login');
    }
  }, [router, reset]);

  const checkAuth = useCallback(async () => {
    if (!authApi.isLoggedIn()) {
      reset();
      return;
    }
    setLoading(true);
    try {
      const me = await authApi.getMe();
      setUser(me);
    } catch {
      authApi.clearTokens();
      reset();
    }
  }, [reset, setLoading, setUser]);

  return { user, isLoading, error, login, register, logout, checkAuth };
}
