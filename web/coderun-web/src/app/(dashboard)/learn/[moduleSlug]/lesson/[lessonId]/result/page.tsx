'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { QUERY_KEYS } from '@/lib/constants/api.constants';
import type { LessonResultResponse } from '@/lib/types/module.types';

export default function ResultPage({
  params,
}: {
  params: Promise<{ moduleSlug: string; lessonId: string }>;
}) {
  const { moduleSlug, lessonId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [result, setResult] = useState<LessonResultResponse | null>(null);
  const [xpVisible, setXpVisible] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('lesson_result');
    if (stored) {
      const parsed = JSON.parse(stored) as LessonResultResponse;
      setResult(parsed);
      sessionStorage.removeItem('lesson_result');
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userStats });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.streak });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.levelProgress });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lessons(moduleSlug) });
      // XP animasyonu
      setTimeout(() => setXpVisible(true), 500);
    } else {
      router.push(`/learn/${moduleSlug}`);
    }
  }, [moduleSlug, lessonId, router, queryClient]);

  if (!result) return null;

  const success = result.score >= 70;

  return (
    <div className="flex flex-col items-center gap-6 max-w-md mx-auto py-8">
      {/* İkon animasyonu */}
      <div className="animate-bounce-once">
        {success
          ? <CheckCircle className="w-24 h-24 text-green-400" />
          : <XCircle className="w-24 h-24 text-red-400" />
        }
      </div>

      {/* Başlık */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-1">
          {success ? 'Tebrikler! 🎉' : 'Neredeyse! 💪'}
        </h1>
        <p className={`text-5xl font-black mt-3 ${success ? 'text-green-400' : 'text-red-400'}`}>
          %{result.score}
        </p>
        <p className="text-slate-400 mt-2 text-sm">{result.message}</p>
      </div>

      {/* XP animasyonu */}
      {success && (
        <div className={`transition-all duration-700 ${xpVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Card className="text-center px-8 py-4 border-yellow-500/30 bg-yellow-500/10">
            <p className="text-3xl font-black text-yellow-400">+{result.xpEarned} XP</p>
            {result.newStreak > 0 && (
              <p className="text-sm text-slate-400 mt-1">🔥 {result.newStreak} günlük seri</p>
            )}
            {result.levelUp && (
              <p className="text-sm text-yellow-300 font-semibold mt-1">⬆️ Seviye {result.newLevel}!</p>
            )}
          </Card>
        </div>
      )}

      {/* Rozetler */}
      {result.badgesEarned.length > 0 && (
        <div className="w-full">
          <p className="text-sm text-slate-400 text-center mb-3">Yeni Rozetler!</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {result.badgesEarned.map((badge, i) => (
              <div
                key={badge.id}
                className="bg-yellow-500/20 border border-yellow-500/40 rounded-xl px-4 py-2 text-center"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                <p className="text-sm font-semibold text-yellow-300">{badge.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* İstatistikler */}
      {!success && (
        <Card className="w-full text-center">
          <p className="text-slate-400 text-sm">
            {result.correctCount} doğru, {result.wrongCount} yanlış
          </p>
          <p className="text-slate-500 text-xs mt-1">En az %70 gerekiyor</p>
        </Card>
      )}

      {/* Butonlar */}
      <div className="flex flex-col gap-3 w-full">
        {!success && (
          <Link href={`/learn/${moduleSlug}/lesson/${lessonId}`}>
            <Button className="w-full" size="lg">Tekrar Dene</Button>
          </Link>
        )}
        <Link href={`/learn/${moduleSlug}`}>
          <Button variant={success ? 'primary' : 'outline'} className="w-full" size="lg">
            Öğrenme Yoluna Dön
          </Button>
        </Link>
      </div>
    </div>
  );
}
