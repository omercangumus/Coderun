'use client';

import React from 'react';
import { Code, Terminal, Cloud } from 'lucide-react';
import { GhostieReaction } from '@/components/ghostie/GhostieReaction';
import { AuthGhostieProvider, useAuthGhostie } from '@/components/auth/AuthGhostieContext';

function AuthLayoutInner({ children }: { children: React.ReactNode }) {
  const { ghostieState } = useAuthGhostie();

  return (
    <div className="min-h-screen flex">
      {/* ───── Left Brand Panel (desktop only) ───── */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] flex-shrink-0 flex-col justify-between p-10 bg-gradient-to-br from-primary via-[#2a329e] to-inverse-surface relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 auth-bg-pattern opacity-30 z-0" />
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary-container rounded-full mix-blend-screen blur-[100px] opacity-40 z-0" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-secondary-fixed-dim rounded-full mix-blend-screen blur-[120px] opacity-20 z-0" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <GhostieReaction state="idle" size={24} preferAnimation={false} />
          </div>
          <span className="text-2xl font-heading font-bold text-white tracking-tight">
            Coderun
          </span>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-sm mx-auto">
          {/* Ghostie mascot */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-primary-fixed-dim rounded-full blur-[60px] opacity-30 scale-75" />
            <GhostieReaction
              state={ghostieState}
              size={200}
              preferAnimation
              className="relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Headline */}
          <h1 className="text-[40px] leading-[1.1] font-heading font-extrabold text-white mb-3 tracking-tight">
            Kodla, öğren, <span className="auth-gradient-text">yüksel</span>.
          </h1>
          <p className="text-body-lg text-white/80 mb-8">
            Python, DevOps ve Cloud becerilerini interaktif derslerle geliştir.
          </p>

          {/* Feature cards — glassmorphism */}
          <div className="flex gap-3 w-full justify-center">
            {[
              { icon: Code, label: 'Python', color: 'text-amber-300' },
              { icon: Terminal, label: 'DevOps', color: 'text-emerald-300' },
              { icon: Cloud, label: 'AWS Cloud', color: 'text-blue-200' },
            ].map((item) => (
              <div
                key={item.label}
                className="auth-glass-card rounded-xl p-4 flex flex-col items-center gap-2 flex-1 hover:bg-white/10 transition-colors duration-300 cursor-default"
              >
                <item.icon className={`w-7 h-7 ${item.color}`} />
                <span className="text-sm font-semibold text-white">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer decoration */}
        <div className="relative z-10 text-center text-white/40 font-mono text-xs">
          {'</>'} Master the craft.
        </div>
      </div>

      {/* ───── Right Panel (form area) ───── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background min-h-screen overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="flex flex-col items-center gap-4 mb-6 lg:hidden">
            {/* Mobile logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-surface-variant flex items-center justify-center">
                <GhostieReaction state="idle" size={20} preferAnimation={false} />
              </div>
              <span className="text-2xl font-heading font-bold text-on-surface">Coderun</span>
            </div>
            {/* Mobile Ghostie — compact */}
            <GhostieReaction
              state={ghostieState}
              size={100}
              preferAnimation
            />
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGhostieProvider>
      <AuthLayoutInner>{children}</AuthLayoutInner>
    </AuthGhostieProvider>
  );
}
