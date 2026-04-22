import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  title: string;
  bgColor?: string;
  className?: string;
}

export function StatCard({
  icon: Icon,
  value,
  title,
  bgColor = 'bg-accent/10',
  className,
}: StatCardProps) {
  return (
    <Card className={cn('flex items-center gap-4', className)}>
      <div className={cn('p-3 rounded-xl', bgColor)}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-xl font-bold text-white">{value}</p>
        <p className="text-xs text-slate-400">{title}</p>
      </div>
    </Card>
  );
}
