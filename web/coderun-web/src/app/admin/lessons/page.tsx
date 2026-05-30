'use client';

import { useCallback, useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Plus, Pencil, Trash2, Loader2, AlertCircle } from 'lucide-react';
import {
  getPaths,
  getLessonsAdmin,
  deleteLesson,
} from '@/lib/api/admin-api';
import type { LessonAdminItem } from '@/lib/types/admin.types';

const LESSON_TYPE_LABELS: Record<string, string> = {
  quiz: 'Quiz',
  code_lab: 'Kod Labı',
  reinforcement: 'Pekiştirme',
  mini_project: 'Mini Proje',
};

const TYPE_COLORS: Record<string, string> = {
  quiz: 'bg-primary-fixed text-primary',
  code_lab: 'bg-tertiary-fixed text-tertiary',
  reinforcement: 'bg-secondary-container text-secondary',
  mini_project: 'bg-error-container text-error',
};

function lessonTypeLabel(type: string): string {
  return LESSON_TYPE_LABELS[type] ?? type;
}

function LessonsContent() {
  const searchParams = useSearchParams();
  const moduleSlug = searchParams.get('module') || 'python';

  const [lessons, setLessons] = useState<LessonAdminItem[]>([]);
  const [moduleTitle, setModuleTitle] = useState(moduleSlug);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadLessons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const paths = await getPaths();
      const mod = paths.find((p) => p.slug === moduleSlug);
      if (!mod) {
        setError(`"${moduleSlug}" modülü bulunamadı. Önce seed çalıştırın.`);
        setLessons([]);
        return;
      }
      setModuleTitle(mod.title);
      const data = await getLessonsAdmin(mod.id);
      setLessons(data.sort((a, b) => a.order - b.order));
    } catch (err) {
      console.error('Admin lessons fetch failed:', err);
      setError('Dersler yüklenemedi. Giriş yaptığınızdan ve süper kullanıcı olduğunuzdan emin olun.');
      setLessons([]);
    } finally {
      setLoading(false);
    }
  }, [moduleSlug]);

  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  const handleDelete = async (lesson: LessonAdminItem) => {
    if (
      !confirm(
        `"${lesson.title}" dersini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`
      )
    ) {
      return;
    }
    setDeletingId(lesson.id);
    try {
      await deleteLesson(lesson.id);
      setLessons((prev) => prev.filter((l) => l.id !== lesson.id));
    } catch (err) {
      console.error('Delete lesson failed:', err);
      alert('Ders silinemedi.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-2 text-body-sm">
        <Link href="/admin" className="text-primary hover:underline">
          Admin
        </Link>
        <span className="text-on-surface-variant">›</span>
        <Link href="/admin/paths" className="text-primary hover:underline">
          Öğrenme Yolları
        </Link>
        <span className="text-on-surface-variant">›</span>
        <span className="text-on-surface">Dersler</span>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-h1 font-heading text-on-surface">{moduleTitle}</h1>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Canlı veri — backend /admin/lessons API
          </p>
        </div>
        <button
          type="button"
          disabled
          title="Yakında"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-container-highest text-on-surface-variant font-semibold text-button cursor-not-allowed opacity-60"
        >
          <Plus size={20} />
          Ders Ekle (yakında)
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-error/30 bg-error-container/10 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
          <p className="text-body-sm text-error">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-on-surface-variant">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span>Dersler yükleniyor...</span>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low">
                <th className="text-left px-4 py-4 text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">
                  Başlık
                </th>
                <th className="text-left px-4 py-4 text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">
                  Tür
                </th>
                <th className="text-left px-4 py-4 text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">
                  Sıra
                </th>
                <th className="text-left px-4 py-4 text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">
                  Durum
                </th>
                <th className="text-left px-4 py-4 text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">
                  Tamamlanma
                </th>
                <th className="text-left px-4 py-4 text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">
                  Ort. Puan
                </th>
                <th className="text-left px-4 py-4 text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">
                  Yanlış %
                </th>
                <th className="text-right px-4 py-4 text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {lessons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-on-surface-variant">
                    Bu modülde ders bulunamadı.
                  </td>
                </tr>
              ) : (
                lessons.map((lesson) => (
                  <tr
                    key={lesson.id}
                    className="border-b border-outline-variant last:border-b-0 hover:bg-surface-container-low transition-colors"
                  >
                    <td className="px-4 py-5">
                      <span className="text-body-md font-medium text-on-surface">
                        {lesson.title}
                      </span>
                      <span className="block text-label-sm text-on-surface-variant">
                        {lesson.questionCount} soru
                      </span>
                    </td>
                    <td className="px-4 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-label-sm font-semibold ${
                          TYPE_COLORS[lesson.lessonType] ||
                          'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        {lessonTypeLabel(lesson.lessonType)}
                      </span>
                    </td>
                    <td className="px-4 py-5 text-body-md text-on-surface">{lesson.order}</td>
                    <td className="px-4 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-label-sm font-semibold ${
                          lesson.isActive
                            ? 'bg-secondary-container text-secondary'
                            : 'bg-surface-container-highest text-on-surface-variant'
                        }`}
                      >
                        {lesson.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-3 min-w-[120px]">
                        <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                          <div
                            className="h-full bg-secondary rounded-full transition-all"
                            style={{ width: `${Math.min(100, lesson.completionRate)}%` }}
                          />
                        </div>
                        <span className="text-body-sm text-on-surface-variant min-w-[40px]">
                          {lesson.completionRate.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-5 text-body-md text-on-surface">
                      {lesson.avgScore > 0 ? `${lesson.avgScore.toFixed(0)}%` : '—'}
                    </td>
                    <td className="px-4 py-5">
                      <span
                        className={`text-body-md font-medium ${
                          lesson.wrongRate > 15 ? 'text-error' : 'text-on-surface'
                        }`}
                      >
                        {lesson.wrongRate > 0 ? `${lesson.wrongRate.toFixed(0)}%` : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/questions/${lesson.id}`}
                          className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                          title="Soruları düzenle"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(lesson)}
                          disabled={deletingId === lesson.id}
                          className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container transition-colors disabled:opacity-40"
                          title="Sil"
                        >
                          {deletingId === lesson.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="px-4 py-3 bg-surface-container-low text-body-sm text-on-surface-variant">
            {lessons.length} ders listeleniyor (gerçek API verisi)
          </div>
        </div>
      )}
    </div>
  );
}

export default function LessonsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-on-surface-variant">Yükleniyor...</div>
      }
    >
      <LessonsContent />
    </Suspense>
  );
}
