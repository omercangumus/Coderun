'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Copy, Trash2, GripVertical } from 'lucide-react';

// Mock data
const MOCK_PATHS = [
  { id: '1', title: 'Python Learning Path', slug: 'python', level: 'Beginner', status: 'Active', lessonCount: 12, order: 1 },
  { id: '2', title: 'DevOps Engineering', slug: 'devops', level: 'Intermediate', status: 'Active', lessonCount: 8, order: 2 },
  { id: '3', title: 'Cloud Architecture', slug: 'cloud', level: 'Advanced', status: 'Coming Soon', lessonCount: 5, order: 3 },
  { id: '4', title: 'Infrastructure as Code (IaC)', slug: 'iac', level: 'Intermediate', status: 'Coming Soon', lessonCount: 6, order: 4 },
];

type PathItem = (typeof MOCK_PATHS)[number];

const LEVEL_COLORS: Record<string, string> = {
  Beginner: 'bg-secondary-container text-secondary-on-container',
  Intermediate: 'bg-tertiary-fixed text-tertiary',
  Advanced: 'bg-surface-container-highest text-on-surface-variant',
};

const STATUS_COLORS: Record<string, string> = {
  Active: 'bg-secondary-container text-secondary',
  'Coming Soon': 'bg-surface-container-highest text-on-surface-variant',
};

export default function PathsPage() {
  const [paths, setPaths] = useState<PathItem[]>(MOCK_PATHS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPathTitle, setNewPathTitle] = useState('');
  const [newPathSlug, setNewPathSlug] = useState('');
  const [newPathLevel, setNewPathLevel] = useState('Beginner');

  const handleDelete = (id: string) => {
    if (confirm('Bu learning path\'i silmek istediğinizden emin misiniz?')) {
      setPaths(paths.filter((p) => p.id !== id));
    }
  };

  const handleDuplicate = (path: PathItem) => {
    const newPath = {
      ...path,
      id: Date.now().toString(),
      title: `${path.title} (Copy)`,
      slug: `${path.slug}-copy`,
      order: paths.length + 1,
    };
    setPaths([...paths, newPath]);
  };

  const handleCreate = () => {
    if (!newPathTitle.trim()) return;
    const newPath: PathItem = {
      id: Date.now().toString(),
      title: newPathTitle,
      slug: newPathSlug || newPathTitle.toLowerCase().replace(/\s+/g, '-'),
      level: newPathLevel,
      status: 'Coming Soon',
      lessonCount: 0,
      order: paths.length + 1,
    };
    setPaths([...paths, newPath]);
    setNewPathTitle('');
    setNewPathSlug('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-body-sm">
        <Link href="/admin" className="text-primary hover:underline">
          Admin
        </Link>
        <span className="text-on-surface-variant">›</span>
        <span className="text-on-surface">Learning Paths</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-h1 font-heading text-on-surface">Learning Paths</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-on font-semibold text-button hover:shadow-primary transition-all"
        >
          <Plus size={20} />
          Add New Path
        </button>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-low">
              <th className="w-10 px-4 py-4"></th>
              <th className="text-left px-4 py-4 text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">
                Title
              </th>
              <th className="text-left px-4 py-4 text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">
                Level
              </th>
              <th className="text-left px-4 py-4 text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">
                Status
              </th>
              <th className="text-right px-4 py-4 text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paths.map((path) => (
              <tr
                key={path.id}
                className="border-b border-outline-variant last:border-b-0 hover:bg-surface-container-low transition-colors"
              >
                <td className="px-4 py-5 text-on-surface-variant cursor-grab">
                  <GripVertical size={16} />
                </td>
                <td className="px-4 py-5">
                  <Link
                    href={`/admin/lessons?module=${path.slug}`}
                    className="text-body-md font-medium text-on-surface hover:text-primary transition-colors"
                  >
                    {path.title}
                  </Link>
                </td>
                <td className="px-4 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-label-sm font-semibold ${LEVEL_COLORS[path.level] || ''}`}
                  >
                    {path.level}
                  </span>
                </td>
                <td className="px-4 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-label-sm font-semibold ${STATUS_COLORS[path.status] || ''}`}
                  >
                    {path.status === 'Active' && '● '}
                    {path.status}
                  </span>
                </td>
                <td className="px-4 py-5">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/lessons?module=${path.slug}`}
                      className="flex items-center gap-1 text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <Pencil size={14} />
                      Edit
                    </Link>
                    <span className="text-outline-variant">|</span>
                    <button
                      onClick={() => handleDuplicate(path)}
                      className="flex items-center gap-1 text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <Copy size={14} />
                      Duplicate
                    </button>
                    <span className="text-outline-variant">|</span>
                    <button
                      onClick={() => handleDelete(path.id)}
                      className="flex items-center gap-1 text-body-sm text-on-surface-variant hover:text-error transition-colors"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-on-surface/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl shadow-card-hover p-8 w-full max-w-lg mx-4">
            <h2 className="text-h3 font-heading text-on-surface mb-6">
              Create New Learning Path
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">
                  Path Title
                </label>
                <input
                  type="text"
                  value={newPathTitle}
                  onChange={(e) => setNewPathTitle(e.target.value)}
                  placeholder="e.g. Python Fundamentals"
                  className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={newPathSlug}
                  onChange={(e) => setNewPathSlug(e.target.value)}
                  placeholder="e.g. python-fundamentals"
                  className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">
                  Level
                </label>
                <select
                  value={newPathLevel}
                  onChange={(e) => setNewPathLevel(e.target.value)}
                  className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:outline-none transition-colors"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 rounded-xl border border-outline-variant text-on-surface font-semibold hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newPathTitle.trim()}
                className="px-6 py-3 rounded-xl bg-primary text-primary-on font-semibold hover:shadow-primary transition-all disabled:opacity-50"
              >
                Create Path
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
