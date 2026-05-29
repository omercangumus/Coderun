'use client';

import { useMemo } from 'react';
import { useModules, useLessons } from '@/lib/hooks/use-modules';

export function useContinueLearning() {
  const { data: modules } = useModules();
  const primarySlug = modules?.[0]?.slug ?? 'python';
  const { data: lessons } = useLessons(primarySlug);

  return useMemo(() => {
    if (!modules?.length || !lessons?.length) {
      return {
        moduleSlug: primarySlug,
        moduleTitle: modules?.[0]?.title ?? 'Python',
        lessonId: null as string | null,
        lessonTitle: null as string | null,
        href: `/learn/${primarySlug}`,
        codingLesson: null as { id: string; title: string; href: string } | null,
      };
    }

    const next = lessons.find((l) => !l.isCompleted && !l.isLocked) ?? lessons.find((l) => !l.isCompleted);
    const coding = lessons.find((l) => l.lessonType === 'code_editor');

    return {
      moduleSlug: primarySlug,
      moduleTitle: modules[0].title,
      lessonId: next?.id ?? null,
      lessonTitle: next?.title ?? null,
      href: next
        ? `/learn/${primarySlug}/lesson/${next.id}`
        : `/learn/${primarySlug}`,
      codingLesson: coding
        ? {
            id: coding.id,
            title: coding.title,
            href: `/learn/${primarySlug}/lesson/${coding.id}`,
          }
        : null,
    };
  }, [modules, lessons, primarySlug]);
}
