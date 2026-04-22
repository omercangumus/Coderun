import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div>
      <div className="mb-8 text-center">
        <div className="text-4xl mb-3 lg:hidden">🚀</div>
        <h1 className="text-2xl font-bold text-white">Tekrar hoş geldin!</h1>
        <p className="text-slate-400 mt-1">Hesabına giriş yap</p>
      </div>

      <LoginForm />

      <p className="mt-6 text-center text-sm text-slate-400">
        Hesabın yok mu?{' '}
        <Link href="/register" className="text-accent hover:underline font-medium">
          Kayıt ol
        </Link>
      </p>
    </div>
  );
}
