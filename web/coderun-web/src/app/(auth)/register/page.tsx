import Link from 'next/link';
import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-h3 font-heading font-bold text-on-surface">Hesap oluştur</h1>
        <p className="text-body-sm text-on-surface-variant mt-1">
          Ücretsiz başla, kariyerini inşa et
        </p>
      </div>

      <RegisterForm />

      <p className="mt-6 text-center text-body-sm text-on-surface-variant">
        Zaten hesabın var mı?{' '}
        <Link href="/login" className="text-primary hover:underline font-semibold">
          Giriş yap
        </Link>
      </p>
    </div>
  );
}
