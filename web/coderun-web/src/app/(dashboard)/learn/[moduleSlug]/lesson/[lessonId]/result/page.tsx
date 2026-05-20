'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Trophy, RotateCcw, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { QUERY_KEYS } from '@/lib/constants/api.constants';
import type { LessonResultResponse } from '@/lib/types/module.types';
import { GhostieReaction } from '@/components/ghostie/GhostieReaction';
import { useHaptics } from '@/lib/hooks/use-haptics';

/** Basit confetti parçacıkları (CSS ile) */
function Confetti({ show }: { show: boolean }) {
  const colors = ['#3D4AD8', '#6BFE9C', '#FFD700', '#FF6B35', '#81419C', '#5865F2'];
  if (!show) return null;
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-sm opacity-0"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 20 + 5}px`,
            backgroundColor: colors[i % colors.length],
            animation: `confettiFall ${1.2 + Math.random() * 1.5}s ease-in ${Math.random() * 0.8}s forwards`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export default function ResultPage({
  params,
}: {
  params: { moduleSlug: string; lessonId: string };
}) {
  const { moduleSlug, lessonId } = params;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { vibrateSuccess, vibrateError } = useHaptics();
  const [result, setResult] = useState<LessonResultResponse | null>(null);
  const [xpVisible, setXpVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const vibratedRef = useRef(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('lesson_result');
    if (stored) {
      const parsed = JSON.parse(stored) as LessonResultResponse;
      setResult(parsed);
      sessionStorage.removeItem('lesson_result');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userStats });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.streak });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.levelProgress });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lessons(moduleSlug) });
      setTimeout(() => setXpVisible(true), 500);
      // Haptics & confetti
      const success = parsed.score >= 70;
      if (!vibratedRef.current) {
        vibratedRef.current = true;
        if (success) {
          vibrateSuccess();
          setTimeout(() => setShowConfetti(true), 200);
          setTimeout(() => setShowConfetti(false), 4000);
        } else {
          vibrateError();
        }
      }
    } else {
      router.push(`/learn/${moduleSlug}`);
    }
  }, [moduleSlug, router, queryClient, vibrateSuccess, vibrateError]);

  if (!result) return null;

  const success = result.score >= 70;
  const scoreColor = success
    ? 'from-emerald-400 to-teal-400'
    : result.score >= 50
    ? 'from-amber-400 to-orange-400'
    : 'from-red-400 to-rose-500';

  return (
    <>
      <Confetti show={showConfetti} />

      <div className="flex flex-col items-center gap-6 max-w-md mx-auto py-8 animate-fade-in">
        {/* Ghostie */}
        <div className="animate-bounce-once">
          <GhostieReaction state={success ? 'success' : 'wrong'} size={160} />
        </div>

        {/* Başlık */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-on-surface mb-1">
            {success ? 'Tebrikler! 🎉' : result.score >= 50 ? 'İyi deneme! 💪' : 'Neredeyse! 🤔'}
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">{result.message}</p>
        </div>

        {/* Skor dairesi */}
        <div className={`w-36 h-36 rounded-full bg-gradient-to-br ${scoreColor} flex flex-col items-center justify-center shadow-xl`}>
          <p className="text-5xl font-black text-white leading-none">
            {result.score}
          </p>
          <p className="text-white/80 text-sm font-semibold mt-0.5">puan</p>
        </div>

        {/* XP & streak card */}
        {success && (
          <div className={`w-full transition-all duration-700 ${xpVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                ⚡
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-xl leading-none">+{result.xpEarned} XP</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {result.newStreak > 0 && (
                    <span className="text-white/80 text-sm">🔥 {result.newStreak} günlük seri</span>
                  )}
                  {result.levelUp && (
                    <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      ⬆️ Seviye {result.newLevel}!
                    </span>
                  )}
                </div>
              </div>
              <Trophy className="w-8 h-8 text-white/60 flex-shrink-0" />
            </div>
          </div>
        )}

        {/* İstatistikler */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-emerald-500">{result.correctCount}</p>
            <p className="text-xs text-on-surface-variant mt-1">Doğru</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-red-400">{result.wrongCount}</p>
            <p className="text-xs text-on-surface-variant mt-1">Yanlış</p>
          </Card>
        </div>

        {/* Rozetler */}
        {result.badgesEarned.length > 0 && (
          <div className="w-full">
            <p className="text-sm text-on-surface-variant text-center mb-3 flex items-center justify-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              Yeni Rozetler Kazandın!
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {result.badgesEarned.map((badge, i) => (
                <div
                  key={badge.id}
                  className="bg-amber-500/20 border border-amber-500/40 rounded-xl px-4 py-2 text-center animate-fade-in"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <p className="text-sm font-semibold text-amber-500">{badge.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Butonlar */}
        <div className="flex flex-col gap-3 w-full">
          {!success && (
            <Link href={`/learn/${moduleSlug}/lesson/${lessonId}`} className="w-full">
              <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary text-white font-bold text-base shadow-md hover:bg-primary/90 active:scale-[0.98] transition-all">
                <RotateCcw className="w-5 h-5" />
                Tekrar Dene
              </button>
            </Link>
          )}
          <Link href={`/learn/${moduleSlug}`} className="w-full">
            <button
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-base transition-all ${
                success
                  ? 'bg-primary text-white shadow-md hover:bg-primary/90 active:scale-[0.98]'
                  : 'border-2 border-outline-variant text-on-surface-variant hover:bg-surface-container active:scale-[0.98]'
              }`}
            >
              Öğrenme Yoluna Dön
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes confettiFall {
          0%   { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
          100% { opacity: 0; transform: translateY(100vh) rotate(720deg) scale(0.5); }
        }
      `}</style>
    </>
  );
}
