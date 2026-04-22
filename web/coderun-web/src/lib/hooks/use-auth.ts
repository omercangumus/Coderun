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
      setError(null);
      setLoading(true);
      try {
        const tokens = await authApi.login(data);
        authApi.saveTokens(tokens);
        const me = await authApi.getMe();
        setUser(me);
        toast.success('Hoş geldin!');
        window.location.href = '/';
      } catch (err: unknown) {
        const errData = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
        const message = Array.isArray(errData)
          ? (errData[0] as { msg?: string })?.msg ?? 'Giriş başarısız'
          : typeof errData === 'string' ? errData : 'Giriş başarısız';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [router, setLoading, setUser, setError]
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      setError(null);
      setLoading(true);
      try {
        await authApi.register(data);
        // Otomatik login — login kendi loading/error state'ini yönetir
        await login({ email: data.email, password: data.password });
      } catch (err: unknown) {
        const errData = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
        const message = Array.isArray(errData)
          ? (errData[0] as { msg?: string })?.msg ?? 'Kayıt başarısız'
          : typeof errData === 'string' ? errData : 'Kayıt başarısız';
        setError(message);
        toast.error(message);
        setLoading(false);
      }
    },
    [login, setError, setLoading]
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

  return { user, isLoading, error, login, register, logout };
}
