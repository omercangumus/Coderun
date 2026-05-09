'use client';

import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

export default function QuestionsIndexPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-2 text-body-sm">
        <Link href="/admin" className="text-primary hover:underline">
          Admin
        </Link>
        <span className="text-on-surface-variant">/</span>
        <span className="text-on-surface">Questions</span>
      </div>

      <h1 className="text-h1 font-heading text-on-surface">Questions</h1>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-12 text-center">
        <HelpCircle size={48} className="text-on-surface-variant mx-auto mb-4" />
        <p className="text-body-lg text-on-surface-variant">
          Select a lesson from the{' '}
          <Link href="/admin/lessons" className="text-primary hover:underline">
            Lessons
          </Link>{' '}
          page to view and edit its questions.
        </p>
      </div>
    </div>
  );
}
