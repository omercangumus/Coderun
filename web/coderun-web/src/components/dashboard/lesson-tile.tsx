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
      <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-700/50 bg-slate-800/20 opacity-50 cursor-not-allowed">
        <Lock className="h-5 w-5 text-slate-500" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-400 truncate">{lesson.title}</p>
          <p className="text-xs text-slate-500">{lesson.xpReward} XP</p>
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
          ? 'border-green-500/30 bg-green-500/10 hover:bg-green-500/20'
          : 'border-slate-700/50 bg-slate-800/40 hover:border-accent/50 hover:bg-accent/5'
      )}
    >
      {lesson.isCompleted ? (
        <CheckCircle className="h-5 w-5 text-green-400 shrink-0" />
      ) : (
        <PlayCircle className="h-5 w-5 text-accent shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{lesson.title}</p>
        <p className="text-xs text-slate-400">
          {lesson.xpReward} XP
          {lesson.score !== null && ` · ${lesson.score}/100`}
        </p>
      </div>
    </Link>
  );
}
