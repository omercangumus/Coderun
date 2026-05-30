import type { LessonResponse } from '@/lib/types/module.types';

export function getLessonTypeBadge(lessonType: LessonResponse['lessonType']): {
  label: string;
  shortLabel: string;
  className: string;
} {
  switch (lessonType) {
    case 'code_editor':
      return {
        label: 'Kod Labı',
        shortLabel: 'Kod Çöz',
        className: 'bg-violet-500/15 text-violet-700 border-violet-500/30 dark:text-violet-300',
      };
    case 'code_completion':
      return {
        label: 'Kod Tamamlama',
        shortLabel: 'Kod',
        className: 'bg-cyan-500/15 text-cyan-800 border-cyan-500/30 dark:text-cyan-200',
      };
    case 'mini_project':
      return {
        label: 'Mini Proje',
        shortLabel: 'Proje',
        className: 'bg-amber-500/15 text-amber-800 border-amber-500/30 dark:text-amber-200',
      };
    case 'quiz':
    default:
      return {
        label: 'Quiz',
        shortLabel: 'Soru Çöz',
        className: 'bg-primary/15 text-primary border-primary/30',
      };
  }
}
