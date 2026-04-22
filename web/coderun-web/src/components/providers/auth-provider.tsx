'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { authApi } from '@/lib/api/auth-api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, reset } = useAuthStore();
  const checked = useRef(false);

  useEffect(() => {
    // Sadece bir kez çalıştır
    if (checked.current) return;
    checked.current = true;

    if (!authApi.isLoggedIn()) {
      // Token yoksa sadece user'ı temizle, loading'i değiştirme
      reset();
      return;
    }

    setLoading(true);
    authApi
      .getMe()
      .then((me) => setUser(me))
      .catch(() => {
        authApi.clearTokens();
        reset();
      })
      .finally(() => setLoading(false));
  }, [setUser, setLoading, reset]);

  return <>{children}</>;
}
