'use client';

import Link from 'next/link';
import { Lock, CheckCircle, PlayCircle, Code2, ListChecks, FolderKanban } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { LessonResponse } from '@/lib/types/module.types';
import { getLessonTypeBadge } from '@/lib/utils/lesson-labels';
import { UI_TR } from '@/lib/constants/ui-tr';

interface LessonTileProps {
  lesson: LessonResponse;
  moduleSlug: string;
  /** Kilitliyse yönlendirilecek önceki ders (varsa) */
  unlockLessonId?: string | null;
}

function LessonTypeIcon({ lessonType }: { lessonType: LessonResponse['lessonType'] }) {
  if (lessonType === 'code_editor') return <Code2 className="h-3.5 w-3.5" />;
  if (lessonType === 'mini_project') return <FolderKanban className="h-3.5 w-3.5" />;
  return <ListChecks className="h-3.5 w-3.5" />;
}

export function LessonTile({ lesson, moduleSlug, unlockLessonId }: LessonTileProps) {
  const badge = getLessonTypeBadge(lesson.lessonType);
  const isCodingLab = lesson.lessonType === 'code_editor';

  if (lesson.isLocked) {
    const inner = (
      <div className="flex items-start gap-3 rounded-xl border border-dashed border-outline-variant bg-surface-container-low/80 p-3">
        <Lock className="mt-0.5 h-5 w-5 shrink-0 text-outline" />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className={cn('rounded-md border px-1.5 py-0.5 text-[10px] font-bold', badge.className)}>
              {badge.label}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant">
              Kilitli
            </span>
          </div>
          <p className="truncate font-sans text-body-sm font-medium text-on-surface">{lesson.title}</p>
          <p className="mt-1 font-sans text-xs leading-relaxed text-on-surface-variant">
            {lesson.lockedReason ?? UI_TR.lessonLockedPrefix}
          </p>
          {unlockLessonId && (
            <p className="mt-2 text-xs font-semibold text-primary">Önceki derse git →</p>
          )}
        </div>
      </div>
    );

    if (unlockLessonId) {
      return (
        <Link href={`/learn/${moduleSlug}/lesson/${unlockLessonId}`} className="block transition-opacity hover:opacity-90">
          {inner}
        </Link>
      );
    }

    return inner;
  }

  return (
    <Link
      href={`/learn/${moduleSlug}/lesson/${lesson.id}`}
      className={cn(
        'flex items-center gap-3 rounded-xl border p-3 transition-all',
        lesson.isCompleted
          ? 'border-secondary/30 bg-secondary-container/10 hover:bg-secondary-container/20'
          : isCodingLab
            ? 'border-violet-500/35 bg-violet-500/5 hover:border-violet-500/60 hover:bg-violet-500/10'
            : 'border-outline-variant bg-surface-container-lowest hover:border-primary/40 hover:bg-primary-fixed/20',
      )}
    >
      {lesson.isCompleted ? (
        <CheckCircle className="h-5 w-5 shrink-0 text-secondary" />
      ) : (
        <PlayCircle className={cn('h-5 w-5 shrink-0', isCodingLab ? 'text-violet-600' : 'text-primary')} />
      )}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-bold',
              badge.className,
            )}
          >
            <LessonTypeIcon lessonType={lesson.lessonType} />
            {badge.label}
          </span>
          {isCodingLab && (
            <span className="text-[10px] font-semibold text-violet-700 dark:text-violet-300">
              {UI_TR.startCoding} →
            </span>
          )}
        </div>
        <p className="truncate font-sans text-body-sm font-semibold text-on-surface">{lesson.title}</p>
        <p className="font-sans text-xs text-on-surface-variant">
          {lesson.xpReward} XP
          {lesson.score !== null && ` · ${lesson.score}/100`}
        </p>
      </div>
    </Link>
  );
}
