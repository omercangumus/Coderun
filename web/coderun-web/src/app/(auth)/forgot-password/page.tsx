'use client';

import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GhostieReaction } from '@/components/ghostie/GhostieReaction';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Decorative blurred blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary-fixed opacity-30 blur-[100px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-surface-variant opacity-40 blur-[80px]" />
      </div>

      <main className="w-full max-w-md z-10">
        {/* Ghostie mascot */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden shadow-[0_12px_40px_rgba(88,101,242,0.15)] bg-surface-container-lowest border border-surface-dim flex items-center justify-center">
            <GhostieReaction
              state="idle"
              size={110}
              preferAnimation
            />
          </div>
        </div>

        {/* Card */}
        <div className="auth-glass-card-light rounded-xl shadow-card p-8 w-full">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-h3 font-heading font-bold text-on-surface mb-2">
              Şifreni mi unuttun?
            </h1>
            <p className="text-body-sm text-on-surface-variant">
              Şifre sıfırlama özelliği yakında eklenecek.
            </p>
          </div>

          {/* Form — disabled placeholder */}
          <div className="space-y-4">
            <div className="relative">
              <Input
                id="forgot-email"
                type="email"
                label="E-posta Adresi"
                placeholder="ornek@email.com"
                disabled
                className="pl-10"
              />
              <Mail className="absolute left-3 top-[38px] w-4 h-4 text-outline pointer-events-none" />
            </div>

            <Button
              type="button"
              size="lg"
              disabled
              className="w-full bg-gradient-to-r from-primary to-primary-container opacity-50 cursor-not-allowed"
            >
              Bağlantı Gönder
            </Button>
          </div>

          {/* Back link */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-container transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Giriş ekranına dön
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
