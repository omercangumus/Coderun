'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { parseApiError } from '@/lib/utils/api-errors';
import { useAuthGhostie } from '@/components/auth/AuthGhostieContext';
import Link from 'next/link';

export function LoginForm() {
  const { login, isLoading, error: authError } = useAuth();
  const { setGhostieState } = useAuthGhostie();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [hasShake, setHasShake] = useState(false);

  // React to auth error changes
  useEffect(() => {
    if (authError) {
      setGhostieState('wrong');
      setHasShake(true);
      const timer = setTimeout(() => setHasShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [authError, setGhostieState]);

  // Reset ghostie when user starts typing
  useEffect(() => {
    if (email || password) {
      if (!isLoading && !authError) {
        setGhostieState('idle');
      }
    }
  }, [email, password, isLoading, authError, setGhostieState]);

  // Loading state
  useEffect(() => {
    if (isLoading) {
      setGhostieState('idle');
    }
  }, [isLoading, setGhostieState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'E-posta zorunludur';
    }
    if (!password.trim()) {
      newErrors.password = 'Şifre zorunludur';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setGhostieState('wrong');
      setHasShake(true);
      setTimeout(() => setHasShake(false), 500);
      return;
    }

    setErrors({});
    login({ email: email.trim(), password });
  };

  return (
    <div className={hasShake ? 'animate-shake' : ''}>
      {/* Auth error banner */}
      {authError && (
        <div className="mb-4 p-4 rounded-xl bg-error-container border border-error/20 flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-error">Giriş başarısız!</p>
            <p className="text-sm text-error-on-container mt-0.5">
              {authError}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email */}
        <div className="relative">
          <Input
            id="login-email"
            type="text"
            label="E-posta"
            placeholder="ornek@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            error={errors.email}
            autoComplete="email"
            className="pl-10"
          />
          <Mail className="absolute left-3 top-[38px] w-4 h-4 text-outline pointer-events-none" />
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="login-password" className="text-body-sm font-semibold text-on-surface">
              Şifre
            </label>
            <Link
              href="/forgot-password"
              className="text-label-sm text-primary hover:text-primary-container transition-colors"
            >
              Şifremi unuttum
            </Link>
          </div>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={errors.password}
              autoComplete="current-password"
              className="pl-10 pr-12"
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Loading shimmer bar */}
        {isLoading && (
          <div className="auth-shimmer-bar" />
        )}

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full mt-2 bg-gradient-to-r from-primary to-primary-container hover:shadow-[0_0_20px_rgba(88,101,242,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </Button>
      </form>
    </div>
  );
}
