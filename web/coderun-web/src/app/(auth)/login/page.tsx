'use client';

import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-h3 font-heading font-bold text-on-surface">Tekrar hoş geldin!</h1>
        <p className="text-body-sm text-on-surface-variant mt-1">
          Hesabına giriş yap ve öğrenmeye devam et
        </p>
      </div>

      <LoginForm />

      <p className="mt-6 text-center text-body-sm text-on-surface-variant">
        Hesabın yok mu?{' '}
        <Link href="/register" className="text-primary hover:underline font-semibold">
          Ücretsiz kayıt ol
        </Link>
      </p>

      {/* Motivation text */}
      <p className="mt-8 text-center text-xs text-outline font-mono">
        &quot;Günlük serini kaybetme, kaldığın yerden devam et.&quot;
      </p>
    </div>
  );
}
