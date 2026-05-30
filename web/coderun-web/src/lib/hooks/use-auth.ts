'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { authApi } from '@/lib/api/auth-api';
import { parseApiError } from '@/lib/utils/api-errors';
import toast from 'react-hot-toast';
import type { LoginRequest, RegisterRequest } from '@/lib/types/auth.types';

export function useAuth() {
  const router = useRouter();
  const { user, isLoading, error, setUser, setLoading, setError, reset } =
    useAuthStore();

  const login = useCallback(
    async (data: LoginRequest, options?: { silentToast?: boolean }) => {
      setError(null);
      setLoading(true);
      try {
        const tokens = await authApi.login(data);
        authApi.saveTokens(tokens);
        const me = await authApi.getMe();
        setUser(me);
        if (!options?.silentToast) {
          toast.success('Hoş geldin!');
        }
        window.location.href = '/';
        return true;
      } catch (err: unknown) {
        const message = parseApiError(err, 'Giriş başarısız. E-posta ve şifreni kontrol et.');
        setError(message);
        toast.error(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setUser, setError],
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      setError(null);
      setLoading(true);
      try {
        await authApi.register(data);
        toast.success('Kayıt başarılı! Giriş yapılıyor...');
      } catch (err: unknown) {
        const message = parseApiError(
          err,
          'Kayıt başarısız. Bilgilerini kontrol edip tekrar dene.',
        );
        setError(message);
        toast.error(message);
        setLoading(false);
        return;
      }

      const loggedIn = await login(
        { email: data.email, password: data.password },
        { silentToast: true },
      );
      if (!loggedIn) {
        setError('Kayıt tamamlandı ancak otomatik giriş yapılamadı. Lütfen giriş sayfasından devam et.');
        toast('Kayıt tamam. Giriş sayfasına yönlendiriliyorsun.', { icon: '✓' });
        router.push('/login');
      }
    },
    [login, router, setError, setLoading],
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
