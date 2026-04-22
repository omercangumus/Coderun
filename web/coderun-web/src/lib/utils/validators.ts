import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'E-posta zorunludur').email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(1, 'Şifre zorunludur'),
});

export const registerSchema = z
  .object({
    email: z.string().min(1, 'E-posta zorunludur').email('Geçerli bir e-posta adresi girin'),
    username: z
      .string()
      .min(3, 'Kullanıcı adı en az 3 karakter olmalıdır')
      .max(30, 'Kullanıcı adı en fazla 30 karakter olabilir')
      .regex(/^[a-zA-Z0-9_]+$/, 'Sadece harf, rakam ve alt çizgi kullanılabilir'),
    password: z
      .string()
      .min(8, 'Şifre en az 8 karakter olmalıdır')
      .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
      .regex(/\d/, 'Şifre en az bir rakam içermelidir'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Şifreler eşleşmiyor',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
