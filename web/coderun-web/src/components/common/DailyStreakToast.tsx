'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import { useUserStats } from '@/lib/hooks/use-gamification';

const STORAGE_KEY = 'coderun-last-daily-bonus';

/**
 * Kullanıcı bugün ilk kez giriş yaptığında streak bonus toast gösterir.
 * LocalStorage ile kontrol edilir — gerçek bir API çağrısı yapmaz.
 */
export function DailyStreakToast() {
  const { user } = useAuth();
  const { data: stats } = useUserStats();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!user || !stats || dismissed) return;

    const today = new Date().toDateString();
    const lastBonus = localStorage.getItem(STORAGE_KEY);

    if (lastBonus !== today) {
      // İlk günlük giriş — toast göster
      localStorage.setItem(STORAGE_KEY, today);
      // Kısa bir gecikmeyle göster (sayfa tam yüklendikten sonra)
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, [user, stats, dismissed]);

  if (!visible || !stats) return null;

  const streak = stats.streak ?? 0;
  const isStreakAlive = stats.streakInfo?.isAlive ?? false;

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
  };

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up"
      style={{ maxWidth: '360px', width: 'calc(100vw - 32px)' }}
    >
      <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-2xl p-4 flex items-center gap-4">
        {/* Flame icon */}
        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 animate-pulse">
          🔥
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-base leading-tight">
            {isStreakAlive
              ? `${streak} günlük serin devam ediyor!`
              : 'Bugün giriş yaptın!'}
          </p>
          <p className="text-white/80 text-sm mt-0.5">
            {isStreakAlive
              ? 'Harika bir alışkanlık kuruyorsun 🎯'
              : 'Günlük hedefini tamamla, serini başlat!'}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              +10 XP günlük bonus
            </span>
            {streak >= 7 && (
              <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                🔥 {streak} gün seri
              </span>
            )}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white text-lg leading-none"
          aria-label="Kapat"
        >
          ×
        </button>
      </div>
    </div>
  );
}
