import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LabPage({
  params,
}: {
  params: { moduleSlug: string; lessonId: string };
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/learn/${params.moduleSlug}/lesson/${params.lessonId}`}
          className="text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold text-white">Lab Ortamı</h1>
      </div>
      <div className="flex items-center justify-center h-64 border border-dashed border-slate-600 rounded-xl">
        <p className="text-slate-400">Lab ortamı yakında geliyor...</p>
      </div>
    </div>
  );
}
