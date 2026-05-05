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

  const getNodeType = (lesson: { title: string }, index: number): NodeType => {
    const title = lesson.title.toLowerCase();
    if (title.includes('quiz') || title.includes('test')) return 'quiz';
    if (title.includes('review') || title.includes('tekrar')) return 'review';
    if (title.includes('proje') || title.includes('project')) return 'miniProject';
    if ((index + 1) % 5 === 0) return 'checkpoint';
    return 'lesson';
  };

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

          {/* Unit header */}
          {progress && (
            <UnitHeader
              title={moduleSlug.replace(/-/g, ' ')}
              progress={Math.round(progress.completionRate)}
              lessonCount={progress.totalLessons}
              completedCount={progress.completedLessons}
            />
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
              <div className="flex flex-col items-center py-4">
                {lessons?.map((lesson, i) => (
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
                    {i < (lessons?.length ?? 0) - 1 && (
                      <NodeConnector isCompleted={lesson.isCompleted} height={40} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile: List view */}
          <div className="lg:hidden flex flex-col gap-2">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)
              : lessons?.map((lesson) => (
                  <LessonTile key={lesson.id} lesson={lesson} moduleSlug={moduleSlug} />
                ))}
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
