'use client';

import Link from 'next/link';
import { ModuleCard } from '@/components/dashboard/module-card';
import { Skeleton } from '@/components/ui/skeleton';
import { CoderunCard, SectionHeader } from '@/components/stitch/CoderunCard';
import { GhostieMotivationCard } from '@/components/stitch/GhostieCard';
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
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-h2 font-bold text-on-surface">Öğrenme Yolları</h1>
        <p className="font-sans text-body-sm text-on-surface-variant mt-1">
          Kariyer hedefine göre bir yol seç
        </p>
      </div>

      <GhostieMotivationCard
        title="Ghostie Rehberi"
        message="Python ile başla, temel kavramlardan kodlama ödevlerine kadar adım adım ilerle! 🚀"
        mood="helping"
      />

      <div className="flex flex-col gap-3">
        <SectionHeader title="Aktif Modüller" />
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

      <div>
        <SectionHeader title="Yakında" />
        <div className="mt-4 flex flex-col gap-3">
          {COMING_SOON.map((item) => (
            <CoderunCard key={item.title} className="opacity-60 cursor-not-allowed">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-base font-bold text-on-surface">{item.title}</h3>
                  <p className="font-sans text-body-sm text-on-surface-variant mt-0.5">
                    {item.description}
                  </p>
                </div>
                <span className="ml-auto text-xs bg-surface-container text-on-surface-variant px-2.5 py-1 rounded-full font-label font-semibold shrink-0">
                  Yakında
                </span>
              </div>
            </CoderunCard>
          ))}
        </div>
      </div>
    </div>
  );
}
