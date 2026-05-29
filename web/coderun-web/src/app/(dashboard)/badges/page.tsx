'use client';

import { useQuery } from '@tanstack/react-query';
import { gamificationApi } from '@/lib/api/gamification-api';
import { QUERY_KEYS } from '@/lib/constants/api.constants';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { GhostieMotivationCard } from '@/components/stitch/GhostieCard';

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
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-heading text-h2 font-bold text-on-surface">Rozetlerim 🏆</h1>
        <p className="font-sans text-body-sm text-on-surface-variant mt-1">{earnedCount} / {totalCount} rozet kazanıldı</p>
      </div>

      <div className="bg-white rounded-xl p-4 border border-outline-variant shadow-sm">
        <Progress value={(earnedCount / totalCount) * 100} color="primary" showLabel />
      </div>

      {/* Ghostie Başarı Koçu */}
      <GhostieMotivationCard
        title="Ghostie Başarı Koçu"
        message="Rozetler seni motive etmek ve ilerlemelerini ödüllendirmek için tasarlandı. Yeni rozetler açmak için dersleri tamamla ve streak serini koru! 🚀"
        mood="celebrating"
      />

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-36" />)}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Kazanılan rozetler */}
          {earnedCount > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="font-label text-label-caps text-primary uppercase tracking-wider">Kazanılan Rozetler</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {ALL_BADGES.filter(b => earnedTypes.has(b.type)).map(badge => {
                  const earned = badges?.find(b => b.badgeType === badge.type);
                  return (
                    <Card key={badge.type} className="border-amber-300 bg-gradient-to-br from-amber-50/70 to-white text-center py-6 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
                      <div className="text-5xl mb-3 animate-bounce-once">{badge.emoji}</div>
                      <p className="text-on-surface font-bold text-base font-heading">{badge.title}</p>
                      <p className="text-on-surface-variant text-xs mt-1.5 font-sans px-2">{badge.description}</p>
                      {earned && (
                        <p className="text-amber-700/80 font-semibold text-[11px] font-label mt-3 bg-amber-100/50 inline-block px-2 py-0.5 rounded-full">
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
          <div className="flex flex-col gap-3">
            <h2 className="font-label text-label-caps text-on-surface-variant uppercase tracking-wider">Kilitli Rozetler</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {ALL_BADGES.filter(b => !earnedTypes.has(b.type)).map(badge => (
                <div
                  key={badge.type}
                  className={cn(
                    'group relative rounded-xl border border-outline-variant bg-white/60 p-6 text-center shadow-sm overflow-hidden',
                    'hover:shadow-md transition-all duration-200 cursor-help'
                  )}
                >
                  <div className="text-5xl mb-3 grayscale opacity-30">{badge.emoji}</div>
                  <Lock className="w-5 h-5 text-outline mx-auto mb-2" />
                  <p className="text-on-surface-variant/40 font-bold text-sm font-heading">???</p>
                  <p className="text-on-surface-variant/30 text-xs mt-1 font-sans">Kilitli Rozet</p>
                  
                  {/* Hover tooltip */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-primary/95 p-4 rounded-xl shadow-primary-lg">
                    <p className="text-sm font-semibold text-white text-center font-sans">{badge.condition}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
