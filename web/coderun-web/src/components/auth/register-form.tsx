'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { registerSchema, type RegisterFormData } from '@/lib/utils/validators';

export function RegisterForm() {
  const { register: registerUser, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: { email: '', username: '', password: '', confirmPassword: '' },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerUser({
      email: data.email,
      username: data.username,
      password: data.password,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        id="email"
        type="email"
        label="E-posta"
        placeholder="ornek@email.com"
        error={errors.email?.message}
        autoComplete="email"
        {...register('email')}
      />
      <Input
        id="username"
        type="text"
        label="Kullanıcı Adı"
        placeholder="kullanici_adi"
        error={errors.username?.message}
        autoComplete="username"
        {...register('username')}
      />

      <div className="relative">
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          label="Şifre"
          placeholder="Min. 8 karakter, büyük harf ve rakam"
          error={errors.password?.message}
          autoComplete="new-password"
          className="pr-12"
          {...register('password')}
        />
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

      <div className="relative">
        <Input
          id="confirmPassword"
          type={showConfirm ? 'text' : 'password'}
          label="Şifre Tekrar"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          autoComplete="new-password"
          className="pr-12"
          {...register('confirmPassword')}
        />
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

      <Button type="submit" size="lg" isLoading={isLoading} className="w-full mt-2">
        Hesap Oluştur
      </Button>
    </form>
  );
}
