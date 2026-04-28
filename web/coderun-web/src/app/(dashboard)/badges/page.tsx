'use client';

import { useQuery } from '@tanstack/react-query';
import { gamificationApi } from '@/lib/api/gamification-api';
import { QUERY_KEYS } from '@/lib/constants/api.constants';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const ALL_BADGES = [
  { type: 'first_lesson', emoji: '🎯', title: 'İlk Adım', description: 'İlk dersini tamamla', condition: 'İlk dersi tamamla' },
  { type: 'streak_7', emoji: '🔥', title: 'Haftalık Kahraman', description: '7 günlük seri yap', condition: '7 gün üst üste giriş yap' },
  { type: 'streak_30', emoji: '⚡', title: 'Aylık Şampiyon', description: '30 günlük seri yap', condition: '30 gün üst üste giriş yap' },
  { type: 'module_complete', emoji: '🏆', title: 'Modül Ustası', description: 'Bir modülü tamamla', condition: 'Tüm dersleri tamamla' },
  { type: 'level_5', emoji: '⭐', title: 'Yükselen Yıldız', description: '5. seviyeye ulaş', condition: '5. seviyeye ulaş' },
  { type: 'level_10', emoji: '💎', title: 'Usta Geliştirici', description: '10. seviyeye ulaş', condition: '10. seviyeye ulaş' },
];

export default function BadgesPage() {
  const { data: badges, isLoading } = useQuery({
    queryKey: QUERY_KEYS.badges,
    queryFn: gamificationApi.getBadges,
  });

  const earnedTypes = new Set(badges?.map(b => b.badgeType) ?? []);
  const earnedCount = earnedTypes.size;
  const totalCount = ALL_BADGES.length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Rozetlerim</h1>
        <p className="text-slate-400 mt-1 text-sm">{earnedCount} / {totalCount} rozet kazanıldı</p>
      </div>

      <Progress value={(earnedCount / totalCount) * 100} color="primary" showLabel />

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-36" />)}
        </div>
      ) : (
        <>
          {/* Kazanılan rozetler */}
          {earnedCount > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Kazanılan</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {ALL_BADGES.filter(b => earnedTypes.has(b.type)).map(badge => {
                  const earned = badges?.find(b => b.badgeType === badge.type);
                  return (
                    <Card key={badge.type} className="border-yellow-500/40 bg-yellow-500/10 text-center py-4">
                      <div className="text-4xl mb-2">{badge.emoji}</div>
                      <p className="text-white font-semibold text-sm">{badge.title}</p>
                      <p className="text-slate-400 text-xs mt-1">{badge.description}</p>
                      {earned && (
                        <p className="text-yellow-500/70 text-xs mt-2">
                          {new Date(earned.earnedAt).toLocaleDateString('tr-TR')}
                        </p>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Kazanılmayan rozetler */}
          <div>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Kilitli</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {ALL_BADGES.filter(b => !earnedTypes.has(b.type)).map(badge => (
                <div
                  key={badge.type}
                  className={cn(
                    'group relative rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 text-center opacity-50',
                    'hover:opacity-70 transition-opacity cursor-default'
                  )}
                >
                  <div className="text-4xl mb-2 grayscale">{badge.emoji}</div>
                  <Lock className="w-4 h-4 text-slate-500 mx-auto mb-1" />
                  <p className="text-slate-500 font-semibold text-sm">???</p>
                  {/* Hover tooltip */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 rounded-xl p-3">
                    <p className="text-xs text-slate-300 text-center">{badge.condition}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
