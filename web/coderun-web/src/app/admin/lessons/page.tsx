'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Plus, Pencil, Copy, Trash2 } from 'lucide-react';

// Mock data
const MOCK_LESSONS = [
  { id: '1', title: 'Basic Syntax', type: 'Multiple Choice', status: 'Active', completionRate: 85, avgScore: 90, wrongRate: 10 },
  { id: '2', title: 'Variables', type: 'Spot the Bug', status: 'Active', completionRate: 78, avgScore: 82, wrongRate: 18 },
  { id: '3', title: 'Data Types', type: 'Multiple Choice', status: 'Draft', completionRate: 0, avgScore: 0, wrongRate: 0 },
  { id: '4', title: 'Operators', type: 'Spot the Bug', status: 'Active', completionRate: 92, avgScore: 95, wrongRate: 5 },
];

type LessonItem = (typeof MOCK_LESSONS)[number];

const TYPE_COLORS: Record<string, string> = {
  'Multiple Choice': 'bg-primary-fixed text-primary',
  'Spot the Bug': 'bg-tertiary-fixed text-tertiary',
  'Fill in Blank': 'bg-secondary-container text-secondary',
  Reorder: 'bg-error-container text-error',
  'Multi Select': 'bg-surface-container-highest text-on-surface-variant',
};

function LessonsContent() {
  const searchParams = useSearchParams();
  const moduleSlug = searchParams.get('module') || 'python';
  const [lessons, setLessons] = useState<LessonItem[]>(MOCK_LESSONS);

  const handleDelete = (id: string) => {
    if (confirm('Bu dersi silmek istediğinizden emin misiniz?')) {
      setLessons(lessons.filter((l) => l.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-body-sm">
        <Link href="/admin" className="text-primary hover:underline">
          Admin
        </Link>
        <span className="text-on-surface-variant">›</span>
        <Link href="/admin/paths" className="text-primary hover:underline">
          {moduleSlug.charAt(0).toUpperCase() + moduleSlug.slice(1)} Path
        </Link>
        <span className="text-on-surface-variant">›</span>
        <span className="text-on-surface">Lessons</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-h1 font-heading text-on-surface">
          {moduleSlug.charAt(0).toUpperCase() + moduleSlug.slice(1)} Lessons
        </h1>
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-on font-semibold text-button hover:shadow-primary transition-all">
          <Plus size={20} />
          Add Lesson
        </button>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-low">
              <th className="text-left px-4 py-4 text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">
                Title
              </th>
              <th className="text-left px-4 py-4 text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">
                Type
              </th>
              <th className="text-left px-4 py-4 text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-4 py-4 text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">
                Completion Rate
              </th>
              <th className="text-left px-4 py-4 text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">
                Avg Score
              </th>
              <th className="text-left px-4 py-4 text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">
                Wrong Rate
              </th>
              <th className="text-right px-4 py-4 text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson) => (
              <tr
                key={lesson.id}
                className="border-b border-outline-variant last:border-b-0 hover:bg-surface-container-low transition-colors"
              >
                <td className="px-4 py-5">
                  <span className="text-body-md font-medium text-on-surface">
                    {lesson.title}
                  </span>
                </td>
                <td className="px-4 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-label-sm font-semibold ${TYPE_COLORS[lesson.type] || 'bg-surface-container text-on-surface-variant'}`}
                  >
                    {lesson.type}
                  </span>
                </td>
                <td className="px-4 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-label-sm font-semibold ${
                      lesson.status === 'Active'
                        ? 'bg-secondary-container text-secondary'
                        : 'bg-surface-container-highest text-on-surface-variant'
                    }`}
                  >
                    ● {lesson.status}
                  </span>
                </td>
                <td className="px-4 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary rounded-full transition-all"
                        style={{ width: `${lesson.completionRate}%` }}
                      />
                    </div>
                    <span className="text-body-sm text-on-surface-variant min-w-[40px]">
                      {lesson.completionRate}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-5 text-body-md text-on-surface">
                  {lesson.avgScore > 0 ? `${lesson.avgScore}%` : '--'}
                </td>
                <td className="px-4 py-5">
                  <span className={`text-body-md font-medium ${lesson.wrongRate > 15 ? 'text-error' : 'text-on-surface'}`}>
                    {lesson.wrongRate > 0 ? `${lesson.wrongRate}%` : '--'}
                  </span>
                </td>
                <td className="px-4 py-5">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/questions/${lesson.id}`}
                      className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                      title="Duplicate"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(lesson.id)}
                      className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 bg-surface-container-low text-body-sm text-on-surface-variant">
          Showing {lessons.length} of {lessons.length} lessons
        </div>
      </div>
    </div>
  );
}

export default function LessonsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-on-surface-variant">Yükleniyor...</div>}>
      <LessonsContent />
    </Suspense>
  );
}
