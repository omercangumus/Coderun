'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { registerSchema, type RegisterFormData } from '@/lib/utils/validators';

export function RegisterForm() {
  const { register: registerUser, isLoading } = useAuth();

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
        {...register('email')}
      />
      <Input
        id="username"
        type="text"
        label="Kullanıcı Adı"
        placeholder="kullanici_adi"
        error={errors.username?.message}
        {...register('username')}
      />
      <Input
        id="password"
        type="password"
        label="Şifre"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />
      <Input
        id="confirmPassword"
        type="password"
        label="Şifre Tekrar"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      <Button type="submit" size="lg" isLoading={isLoading} className="w-full mt-2">
        Hesap Oluştur
      </Button>
    </form>
  );
}
