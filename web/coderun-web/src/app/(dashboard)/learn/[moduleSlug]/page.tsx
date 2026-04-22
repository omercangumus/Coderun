'use client';

import { use } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useLessons, useModuleProgress } from '@/lib/hooks/use-modules';
import { LessonTile } from '@/components/dashboard/lesson-tile';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/learn" className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-3xl">{emoji}</span>
          <div>
            <h1 className="text-xl font-bold text-white capitalize">{moduleSlug}</h1>
            {progress && (
              <p className="text-sm text-slate-400">
                {progress.completedLessons}/{progress.totalLessons} ders tamamlandı
              </p>
            )}
          </div>
        </div>
      </div>

      {progress && (
        <Progress value={progress.completionRate} color="primary" showLabel />
      )}

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
