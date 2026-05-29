'use client';

import { useQuery } from '@tanstack/react-query';
import { gamificationApi } from '@/lib/api/gamification-api';
import { QUERY_KEYS } from '@/lib/constants/api.constants';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { CoderunCard } from '@/components/stitch/CoderunCard';
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
        <p className="font-sans text-body-sm text-on-surface-variant mt-1">
          {earnedCount} / {totalCount} rozet kazanıldı
        </p>
      </div>

      <CoderunCard>
        <Progress value={(earnedCount / totalCount) * 100} color="primary" showLabel />
      </CoderunCard>

      <GhostieMotivationCard
        title="Ghostie Başarı Koçu"
        message={
          earnedCount === 0
            ? 'Henüz rozet kazanmadın ama yolculuk yeni başlıyor! İlk dersini tamamla ve İlk Adım rozetini aç. 🚀'
            : 'Rozetler seni motive etmek ve ilerlemelerini ödüllendirmek için tasarlandı. Streak serini koru! 🚀'
        }
        mood={earnedCount > 0 ? 'celebrating' : 'helping'}
      />

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-36" />)}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {earnedCount > 0 ? (
            <div className="flex flex-col gap-3">
              <h2 className="font-label text-label-caps text-primary uppercase tracking-wider">
                Kazanılan Rozetler
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {ALL_BADGES.filter(b => earnedTypes.has(b.type)).map(badge => {
                  const earned = badges?.find(b => b.badgeType === badge.type);
                  return (
                    <CoderunCard
                      key={badge.type}
                      className="text-center py-6 border-xp-gold/30 bg-gradient-to-br from-xp-gold/10 to-surface-container-lowest hover:shadow-card-hover hover:scale-[1.02] transition-all duration-200"
                    >
                      <div className="text-5xl mb-3 animate-bounce-once">{badge.emoji}</div>
                      <p className="font-heading text-base font-bold text-on-surface">{badge.title}</p>
                      <p className="font-sans text-xs text-on-surface-variant mt-1.5 px-2">{badge.description}</p>
                      {earned && (
                        <p className="font-label text-[11px] font-semibold mt-3 bg-xp-gold/15 text-xp-gold inline-block px-2 py-0.5 rounded-full">
                          {new Date(earned.earnedAt).toLocaleDateString('tr-TR')}
                        </p>
                      )}
                    </CoderunCard>
                  );
                })}
              </div>
            </div>
          ) : (
            <CoderunCard variant="ghost" className="text-center py-8">
              <p className="font-sans text-body-sm text-on-surface-variant">
                Henüz kazanılmış rozet yok. İlk dersini tamamlayarak başla!
              </p>
            </CoderunCard>
          )}

          <div className="flex flex-col gap-3">
            <h2 className="font-label text-label-caps text-on-surface-variant uppercase tracking-wider">
              Kilitli Rozetler
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {ALL_BADGES.filter(b => !earnedTypes.has(b.type)).map(badge => (
                <div
                  key={badge.type}
                  className={cn(
                    'group relative rounded-xl border border-outline-variant',
                    'bg-gradient-to-br from-surface-container-low/80 to-surface-container/40',
                    'p-6 text-center shadow-sm overflow-hidden',
                    'hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-help'
                  )}
                >
                  <div className="text-5xl mb-3 grayscale opacity-40">{badge.emoji}</div>
                  <Lock className="w-5 h-5 text-outline mx-auto mb-2" />
                  <p className="font-heading text-sm font-bold text-on-surface-variant/50">???</p>
                  <p className="font-sans text-xs text-on-surface-variant/40 mt-1">Gizemli Rozet</p>

                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 bg-primary/95 p-4 rounded-xl">
                    <p className="font-sans text-sm font-semibold text-white text-center">
                      {badge.condition}
                    </p>
                    <span className="font-label text-[10px] uppercase tracking-wide text-white/70">
                      Nasıl açılır?
                    </span>
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
