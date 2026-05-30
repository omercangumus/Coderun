'use client';

import { ArrowLeft, FlaskConical } from 'lucide-react';
import Link from 'next/link';
import { useLessons, useModuleProgress } from '@/lib/hooks/use-modules';
import { LessonTile } from '@/components/dashboard/lesson-tile';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { MODULE_EMOJIS } from '@/lib/constants/app.constants';
import { CoderunCard } from '@/components/stitch/CoderunCard';
import { GhostieBubble } from '@/components/stitch/GhostieCard';
import { ProgressNode, NodeConnector, UnitHeader } from '@/components/stitch/ProgressNode';
import { cn } from '@/lib/utils/cn';
import type { NodeState, NodeType } from '@/components/stitch/ProgressNode';

export default function ModulePage({
  params,
}: {
  params: { moduleSlug: string };
}) {
  const { moduleSlug } = params;
  const { data: lessons, isLoading } = useLessons(moduleSlug);
  const { data: progress } = useModuleProgress(moduleSlug);
  
  const getUnits = () => {
    if (!lessons) return [];
    if (moduleSlug === 'python') {
      const PYTHON_UNITS = [
        {
          title: "Ünite 1: Python Temelleri",
          description: "Değişkenler, veri tipleri, sayılar, stringler, karşılaştırmalar ve basit I/O işlemleri.",
          indices: [0, 1, 2, 3, 4]
        },
        {
          title: "Ünite 2: Listeler",
          description: "Liste tanımı, indeks erişimi, eleman işlemleri, listelerde for döngüsü ve pratik görevler.",
          indices: [5, 6, 7, 8, 9]
        },
        {
          title: "Ünite 3: Koşullar",
          description: "if/elif/else blokları, karşılaştırma operatörleri ve iç içe mantıksal sorgulamalar.",
          indices: [10, 11, 12, 13, 14]
        },
        {
          title: "Ünite 4: Döngüler",
          description: "for ve while döngüleri, range fonksiyonu, break ve continue komutları.",
          indices: [15, 16, 17, 18, 19]
        },
        {
          title: "Ünite 5: Fonksiyonlar",
          description: "Fonksiyon tanımlama, parametreler, return anahtar kelimesi ve yerel/global scope.",
          indices: [20, 21, 22, 23, 24]
        },
        {
          title: "Ünite 6: Python Kodlama Ödevleri",
          description: "Derleyici üzerinde çalışan gerçek zamanlı algoritmik kodlama projeleri.",
          indices: [25, 26]
        }
      ];
      return PYTHON_UNITS.filter(u => u.indices[0] < lessons.length);
    }
    
    return [
      {
        title: `Ünite 1: ${moduleSlug.replace(/-/g, ' ').toUpperCase()}`,
        description: "Modüle ait tüm konu anlatımları ve pratik görevler.",
        indices: lessons.map((_, i) => i)
      }
    ];
  };

  const units = getUnits();

  const emoji = MODULE_EMOJIS[moduleSlug] ?? '📚';
  const allCompleted =
    progress && progress.completedLessons === progress.totalLessons && progress.totalLessons > 0;
  const noneCompleted = progress && progress.completedLessons === 0;

  const activeIndex = lessons?.findIndex((l) => !l.isCompleted) ?? -1;

  const getNodeState = (lesson: { isCompleted: boolean }, index: number): NodeState => {
    if (lesson.isCompleted) return 'completed';
    if (index === activeIndex) return 'active';
    return 'locked';
  };

  const getNodeType = (lesson: { title: string; lessonType?: string }, index: number): NodeType => {
    if (lesson.lessonType === 'code_editor') return 'miniProject';
    if (lesson.lessonType === 'quiz') return 'quiz';
    const title = lesson.title.toLowerCase();
    if (title.includes('kodlama') || title.includes('ödev') || title.includes('odev')) return 'miniProject';
    if (title.includes('quiz') || title.includes('test')) return 'quiz';
    if (title.includes('review') || title.includes('tekrar')) return 'review';
    if (title.includes('proje') || title.includes('project')) return 'miniProject';
    if ((index + 1) % 5 === 0) return 'checkpoint';
    return 'lesson';
  };

  const codingLesson = lessons?.find((l) => l.lessonType === 'code_editor');

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── LEFT: Journey Map ── */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              href="/learn"
              className="text-on-surface-variant hover:text-on-surface transition-colors"
              aria-label="Öğrenme yollarına geri dön"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{emoji}</span>
              <div>
                <h1 className="font-heading text-h3 font-bold text-on-surface capitalize">
                  {moduleSlug.replace(/-/g, ' ')}
                </h1>
                {progress && (
                  <p className="font-sans text-body-sm text-on-surface-variant">
                    {progress.completedLessons}/{progress.totalLessons} ders tamamlandı
                  </p>
                )}
              </div>
            </div>
          </div>

          {codingLesson && (
            codingLesson.isLocked ? (
              <CoderunCard className="border-dashed border-violet-500/30 bg-violet-500/5">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-2xl">
                    🔒
                  </div>
                  <div className="flex-1">
                    <p className="font-label text-label-sm uppercase tracking-wide text-violet-700 dark:text-violet-300">
                      Kod Labı · Ödevler (kilitli)
                    </p>
                    <p className="font-heading text-base font-bold text-on-surface">{codingLesson.title}</p>
                    <p className="mt-1 font-sans text-body-sm text-on-surface-variant">
                      {codingLesson.lockedReason ??
                        'Önceki dersleri tamamladığında kod laboratuvarı açılır.'}
                    </p>
                    {lessons && (() => {
                      const idx = lessons.findIndex((l) => l.id === codingLesson.id);
                      const prev = idx > 0 ? lessons[idx - 1] : null;
                      return prev ? (
                        <Link
                          href={`/learn/${moduleSlug}/lesson/${prev.id}`}
                          className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline"
                        >
                          Önceki derse git: {prev.title} →
                        </Link>
                      ) : null;
                    })()}
                  </div>
                </div>
              </CoderunCard>
            ) : (
              <Link href={`/learn/${moduleSlug}/lesson/${codingLesson.id}`}>
                <CoderunCard
                  variant="highlight"
                  className="cursor-pointer border-violet-500/40 bg-gradient-to-br from-violet-500/10 to-primary/10 transition-shadow hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20 text-2xl">
                      💻
                    </div>
                    <div className="flex-1">
                      <p className="font-label text-label-sm uppercase tracking-wide text-violet-700 dark:text-violet-300">
                        Kod Labı · Ödevler
                      </p>
                      <p className="font-heading text-base font-bold text-on-surface">{codingLesson.title}</p>
                      <p className="mt-1 font-sans text-body-sm text-on-surface-variant">
                        Gerçek Python editöründe kod yaz, çalıştır ve test et.
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-violet-600 px-3 py-1.5 text-xs font-bold text-white">
                      Kod çözmeye başla
                    </span>
                  </div>
                </CoderunCard>
              </Link>
            )
          )}

          {/* Placement test */}
          {noneCompleted && (
            <Link href={`/learn/${moduleSlug}/placement`}>
              <CoderunCard variant="highlight" className="cursor-pointer hover:shadow-primary-lg transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <FlaskConical className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading text-base font-bold text-primary">
                      Seviye Testi Yap
                    </p>
                    <p className="font-sans text-body-sm text-on-surface-variant">
                      Bilgi seviyeni ölç ve doğru yerden başla
                    </p>
                  </div>
                </div>
              </CoderunCard>
            </Link>
          )}

          {/* Completed banner */}
          {allCompleted && (
            <CoderunCard variant="success">
              <div className="text-center py-2">
                <p className="text-3xl mb-2">🎉</p>
                <p className="font-heading text-h4 font-bold text-secondary">
                  Modülü Tamamladın!
                </p>
                <p className="font-sans text-body-sm text-on-surface-variant mt-1">
                  Harika iş çıkardın!
                </p>
              </div>
            </CoderunCard>
          )}

          {/* Journey path — desktop shows visual nodes, mobile shows list */}
          <div className="hidden lg:block">
            {/* Desktop: Visual journey map */}
            {isLoading ? (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-8 py-4">
                {units.map((unit, unitIdx) => {
                  const unitLessons = unit.indices.map(idx => lessons?.[idx]).filter((l): l is NonNullable<typeof l> => !!l);
                  const completedInUnit = unitLessons.filter(l => l.isCompleted).length;
                  const totalInUnit = unitLessons.length;
                  const unitProgress = totalInUnit > 0 ? Math.round((completedInUnit / totalInUnit) * 100) : 0;
                  
                  return (
                    <div key={unit.title} className="w-full flex flex-col gap-4 border-b border-dashed border-outline-variant/30 pb-8 last:border-0 last:pb-0">
                      <UnitHeader
                        title={unit.title}
                        subtitle={unit.description}
                        progress={unitProgress}
                        lessonCount={totalInUnit}
                        completedCount={completedInUnit}
                      />
                      <div className="flex flex-col items-center py-4">
                        {unitLessons.map((lesson, idxWithinUnit) => {
                          const i = unit.indices[idxWithinUnit];
                          return (
                            <div key={lesson.id} className="w-full">
                              {/* Ghostie helper near active node */}
                              {i === activeIndex && (
                                <div className="flex justify-center mb-4">
                                  <div className="max-w-xs">
                                    <GhostieBubble
                                      message="Devam et! Bir sonraki ders seni bekliyor 🚀"
                                      mood="helping"
                                    />
                                  </div>
                                </div>
                              )}
                              <div className="flex justify-center">
                                <Link href={`/learn/${moduleSlug}/lesson/${lesson.id}`}>
                                  <ProgressNode
                                    state={getNodeState(lesson, i)}
                                    type={getNodeType(lesson, i)}
                                    label={lesson.title}
                                    side={i % 2 === 0 ? 'left' : 'right'}
                                  />
                                </Link>
                              </div>
                              {idxWithinUnit < unitLessons.length - 1 && (
                                <NodeConnector isCompleted={lesson.isCompleted} height={40} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mobile: List view */}
          <div className="lg:hidden flex flex-col gap-6">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)
            ) : (
              units.map((unit) => {
                const unitLessons = unit.indices.map(idx => lessons?.[idx]).filter((l): l is NonNullable<typeof l> => !!l);
                return (
                  <div key={unit.title} className="flex flex-col gap-3">
                    <div className="px-1">
                      <h3 className="font-heading text-base font-bold text-on-surface">{unit.title}</h3>
                      <p className="font-sans text-xs text-on-surface-variant mt-0.5">{unit.description}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {unitLessons.map((lesson, idxWithinUnit) => {
                        const globalIdx = unit.indices[idxWithinUnit];
                        const unlockId =
                          lesson.isLocked && globalIdx > 0 ? lessons?.[globalIdx - 1]?.id : null;
                        return (
                          <LessonTile
                            key={lesson.id}
                            lesson={lesson}
                            moduleSlug={moduleSlug}
                            unlockLessonId={unlockId}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── RIGHT: Unit Details Panel (desktop only) ── */}
        <div className="hidden lg:flex flex-col gap-4 w-72 flex-shrink-0">
          {/* Next lesson CTA */}
          {lessons && activeIndex >= 0 && (
            <CoderunCard variant="highlight">
              <p className="font-label text-label-sm text-primary/70 uppercase tracking-wide mb-1">
                Sıradaki Ders
              </p>
              <h3 className="font-heading text-base font-bold text-primary mb-3">
                {lessons[activeIndex]?.title}
              </h3>
              <Link href={`/learn/${moduleSlug}/lesson/${lessons[activeIndex]?.id}`}>
                <button className="cr-btn-primary w-full text-sm py-2.5">
                  Derse Başla →
                </button>
              </Link>
            </CoderunCard>
          )}

          {/* Progress stats */}
          {progress && (
            <CoderunCard>
              <p className="font-label text-label-sm text-on-surface-variant uppercase tracking-wide mb-3">
                İstatistikler
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-body-sm text-on-surface-variant">Tamamlanan</span>
                  <span className="font-heading text-sm font-bold text-secondary">
                    {progress.completedLessons} ders
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-body-sm text-on-surface-variant">Kalan</span>
                  <span className="font-heading text-sm font-bold text-on-surface">
                    {progress.totalLessons - progress.completedLessons} ders
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-body-sm text-on-surface-variant">İlerleme</span>
                  <span className="font-heading text-sm font-bold text-primary">
                    {Math.round(progress.completionRate)}%
                  </span>
                </div>
              </div>
            </CoderunCard>
          )}

          {/* Ghostie helper */}
          <GhostieBubble
            message="Her ders seni bir adım daha ileriye taşıyor. Devam et! 💪"
            mood="helping"
          />
        </div>
      </div>
    </div>
  );
}
