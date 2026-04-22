'use client';

import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
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
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:border-slate-600',
        className
      )}
      onClick={() => router.push(`/learn/${module.slug}`)}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl">{emoji}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white">{module.title}</h3>
          <p className="text-sm text-slate-400 mt-0.5 line-clamp-2">
            {module.description}
          </p>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span>İlerleme</span>
              <span>{Math.round(completionRate)}%</span>
            </div>
            <Progress value={completionRate} color="primary" />
          </div>
        </div>
      </div>
    </Card>
  );
}
