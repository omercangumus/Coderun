'use client';

import Link from 'next/link';
import { Lock, CheckCircle, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { LessonResponse } from '@/lib/types/module.types';

interface LessonTileProps {
  lesson: LessonResponse;
  moduleSlug: string;
}

export function LessonTile({ lesson, moduleSlug }: LessonTileProps) {
  if (lesson.isLocked) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant bg-surface-container-low/60 opacity-60 cursor-not-allowed">
        <Lock className="h-5 w-5 text-outline shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-sans text-body-sm text-on-surface-variant truncate">{lesson.title}</p>
          <p className="font-sans text-xs text-on-surface-variant/70">{lesson.xpReward} XP</p>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/learn/${moduleSlug}/lesson/${lesson.id}`}
      className={cn(
        'flex items-center gap-3 p-3 rounded-xl border transition-all',
        lesson.isCompleted
          ? 'border-secondary/30 bg-secondary-container/10 hover:bg-secondary-container/20'
          : 'border-outline-variant bg-surface-container-lowest hover:border-primary/40 hover:bg-primary-fixed/20'
      )}
    >
      {lesson.isCompleted ? (
        <CheckCircle className="h-5 w-5 text-secondary shrink-0" />
      ) : (
        <PlayCircle className="h-5 w-5 text-primary shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-sans text-body-sm font-semibold text-on-surface truncate">{lesson.title}</p>
        <p className="font-sans text-xs text-on-surface-variant">
          {lesson.xpReward} XP
          {lesson.score !== null && ` · ${lesson.score}/100`}
        </p>
      </div>
    </Link>
  );
}
