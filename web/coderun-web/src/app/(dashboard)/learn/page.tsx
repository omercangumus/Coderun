'use client';

import { ModuleCard } from '@/components/dashboard/module-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { useModules, useModuleProgress } from '@/lib/hooks/use-modules';

function ModuleCardWithProgress({ slug, module }: { slug: string; module: Parameters<typeof ModuleCard>[0]['module'] }) {
  const { data: progress } = useModuleProgress(slug);
  return (
    <ModuleCard
      module={module}
      completionRate={progress?.completionRate ?? 0}
    />
  );
}

const COMING_SOON = [
  { title: 'Terraform & IaC', emoji: '🏗️', description: 'Infrastructure as Code ile altyapı yönetimi' },
  { title: 'Kubernetes', emoji: '☸️', description: 'Container orchestration ve deployment' },
  { title: 'Go Programlama', emoji: '🐹', description: 'Backend geliştirme için Go dili' },
];

export default function LearnPage() {
  const { data: modules, isLoading } = useModules();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Öğrenme Yolları</h1>
        <p className="text-slate-400 mt-1">Kariyer hedefine göre bir yol seç</p>
      </div>

      {/* Aktif Modüller */}
      <div className="flex flex-col gap-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28" />)
          : modules?.map((module) => (
              <ModuleCardWithProgress
                key={module.id}
                module={module}
                slug={module.slug}
              />
            ))}
      </div>

      {/* Coming Soon */}
      <div>
        <h2 className="text-lg font-semibold text-slate-400 mb-3">Yakında</h2>
        <div className="flex flex-col gap-3">
          {COMING_SOON.map((item) => (
            <Card key={item.title} className="opacity-50 cursor-not-allowed">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{item.emoji}</span>
                <div>
                  <h3 className="font-medium text-slate-300">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.description}</p>
                </div>
                <span className="ml-auto text-xs bg-slate-700 text-slate-400 px-2 py-1 rounded-full">
                  Yakında
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
