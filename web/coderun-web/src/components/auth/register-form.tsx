'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { useAuthGhostie } from '@/components/auth/AuthGhostieContext';
import { registerSchema, type RegisterFormData } from '@/lib/utils/validators';

export function RegisterForm() {
  const { register: registerUser, isLoading, error: authError } = useAuth();
  const { setGhostieState } = useAuthGhostie();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [hasShake, setHasShake] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: { email: '', username: '', password: '', confirmPassword: '' },
  });

  // Watch fields to reset ghostie
  const watchedEmail = watch('email');
  const watchedUsername = watch('username');

  // React to auth error changes
  useEffect(() => {
    if (authError) {
      setGhostieState('wrong');
      setHasShake(true);
      const timer = setTimeout(() => setHasShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [authError, setGhostieState]);

  // React to validation errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setGhostieState('angry');
      setHasShake(true);
      const timer = setTimeout(() => setHasShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [errors, setGhostieState]);

  // Reset ghostie when user types
  useEffect(() => {
    if (!isLoading && !authError) {
      setGhostieState('idle');
    }
  }, [watchedEmail, watchedUsername, isLoading, authError, setGhostieState]);

  // Loading state
  useEffect(() => {
    if (isLoading) {
      setGhostieState('idle');
    }
  }, [isLoading, setGhostieState]);

  const onSubmit = (data: RegisterFormData) => {
    registerUser({
      email: data.email,
      username: data.username,
      password: data.password,
    });
  };

  return (
    <div className={hasShake ? 'animate-shake' : ''}>
      {/* Auth error banner */}
      {authError && (
        <div className="mb-4 p-4 rounded-xl bg-error-container border border-error/20 flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-error">Kayıt başarısız!</p>
            <p className="text-sm text-error-on-container mt-0.5">
              {authError}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Email */}
        <div className="relative">
          <Input
            id="register-email"
            type="email"
            label="E-posta"
            placeholder="ornek@email.com"
            error={errors.email?.message}
            autoComplete="email"
            className="pl-10"
            {...registerField('email')}
          />
          <Mail className="absolute left-3 top-[38px] w-4 h-4 text-outline pointer-events-none" />
        </div>

        {/* Username */}
        <div className="relative">
          <Input
            id="register-username"
            type="text"
            label="Kullanıcı Adı"
            placeholder="kullanici_adi"
            error={errors.username?.message}
            autoComplete="username"
            className="pl-10"
            {...registerField('username')}
          />
          <User className="absolute left-3 top-[38px] w-4 h-4 text-outline pointer-events-none" />
        </div>

        {/* Password */}
        <div className="relative">
          <Input
            id="register-password"
            type={showPassword ? 'text' : 'password'}
            label="Şifre"
            placeholder="Min. 8 karakter, büyük harf ve rakam"
            error={errors.password?.message}
            autoComplete="new-password"
            className="pl-10 pr-12"
            {...registerField('password')}
          />
          <Lock className="absolute left-3 top-[38px] w-4 h-4 text-outline pointer-events-none" />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-[38px] text-outline hover:text-on-surface transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <Input
            id="register-confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            label="Şifre Tekrar"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            autoComplete="new-password"
            className="pl-10 pr-12"
            {...registerField('confirmPassword')}
          />
          <Lock className="absolute left-3 top-[38px] w-4 h-4 text-outline pointer-events-none" />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-[38px] text-outline hover:text-on-surface transition-colors"
            tabIndex={-1}
            aria-label={showConfirm ? 'Şifreyi gizle' : 'Şifreyi göster'}
          >
            {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
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
          {isLoading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
        </Button>
      </form>
    </div>
  );
}
