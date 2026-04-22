import Link from 'next/link';
import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-8 text-center">
        <div className="text-4xl mb-3 lg:hidden">🚀</div>
        <h1 className="text-2xl font-bold text-white">Hesap oluştur</h1>
        <p className="text-slate-400 mt-1">Ücretsiz başla, kariyer kur</p>
      </div>

      <RegisterForm />

      <p className="mt-6 text-center text-sm text-slate-400">
        Zaten hesabın var mı?{' '}
        <Link href="/login" className="text-accent hover:underline font-medium">
          Giriş yap
        </Link>
      </p>
    </div>
  );
}
