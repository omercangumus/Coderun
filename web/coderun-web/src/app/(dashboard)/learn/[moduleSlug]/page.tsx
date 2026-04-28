'use client';

import { use } from 'react';
import { ArrowLeft, FlaskConical } from 'lucide-react';
import Link from 'next/link';
import { useLessons, useModuleProgress } from '@/lib/hooks/use-modules';
import { LessonTile } from '@/components/dashboard/lesson-tile';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { MODULE_EMOJIS } from '@/lib/constants/app.constants';

export default function ModulePage({
  params,
}: {
  params: Promise<{ moduleSlug: string }>;
}) {
  const { moduleSlug } = use(params);
  const { data: lessons, isLoading } = useLessons(moduleSlug);
  const { data: progress } = useModuleProgress(moduleSlug);

  const emoji = MODULE_EMOJIS[moduleSlug] ?? '📚';
  const allCompleted = progress && progress.completedLessons === progress.totalLessons && progress.totalLessons > 0;
  const noneCompleted = progress && progress.completedLessons === 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Üst bar */}
      <div className="flex items-center gap-3">
        <Link href="/learn" className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-3xl">{emoji}</span>
          <div>
            <h1 className="text-xl font-bold text-white capitalize">{moduleSlug.replace(/-/g, ' ')}</h1>
            {progress && (
              <p className="text-sm text-slate-400">
                {progress.completedLessons}/{progress.totalLessons} ders tamamlandı
              </p>
            )}
          </div>
        </div>
      </div>

      {/* İlerleme */}
      {progress && (
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Progress value={progress.completionRate} color="primary" showLabel />
          </div>
          <span className="text-sm font-semibold text-accent flex-shrink-0">
            %{Math.round(progress.completionRate)}
          </span>
        </div>
      )}

      {/* Seviye testi butonu — sadece hiç ders tamamlanmamışsa */}
      {noneCompleted && (
        <Link href={`/learn/${moduleSlug}/placement`}>
          <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent/10 gap-2">
            <FlaskConical className="w-4 h-4" />
            Seviye Testi Yap
          </Button>
        </Link>
      )}

      {/* Tüm dersler tamamlandı banner */}
      {allCompleted && (
        <div className="bg-green-500/20 border border-green-500/40 rounded-xl p-4 text-center">
          <p className="text-2xl mb-1">🎉</p>
          <p className="text-green-400 font-bold">Modülü Tamamladın!</p>
          <p className="text-slate-400 text-sm mt-1">Harika iş çıkardın!</p>
        </div>
      )}

      {/* Ders listesi */}
      <div className="flex flex-col gap-2">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)
          : lessons?.map((lesson) => (
              <LessonTile key={lesson.id} lesson={lesson} moduleSlug={moduleSlug} />
            ))}
      </div>
    </div>
  );
}
