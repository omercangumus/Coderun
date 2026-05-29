'use client';

import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { CoderunCard } from '@/components/stitch/CoderunCard';
import { cn } from '@/lib/utils/cn';
import { MODULE_EMOJIS } from '@/lib/constants/app.constants';
import type { ModuleResponse } from '@/lib/types/module.types';

interface ModuleCardProps {
  module: ModuleResponse;
  completionRate?: number;
  className?: string;
}

export function ModuleCard({ module, completionRate = 0, className }: ModuleCardProps) {
  const router = useRouter();
  const emoji = MODULE_EMOJIS[module.slug] ?? '📚';

  return (
    <CoderunCard
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-card-hover hover:scale-[1.01]',
        className
      )}
      onClick={() => router.push(`/learn/${module.slug}`)}
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-primary-fixed rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-base font-bold text-on-surface">{module.title}</h3>
          <p className="font-sans text-body-sm text-on-surface-variant mt-0.5 line-clamp-2">
            {module.description}
          </p>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-on-surface-variant mb-1.5 font-sans">
              <span>İlerleme</span>
              <span>{Math.round(completionRate)}%</span>
            </div>
            <Progress value={completionRate} color="primary" />
          </div>
        </div>
      </div>
    </CoderunCard>
  );
}
