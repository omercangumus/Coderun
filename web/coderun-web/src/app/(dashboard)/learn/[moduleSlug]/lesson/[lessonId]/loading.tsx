import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-64" />
      <Skeleton className="h-12 w-32 ml-auto" />
    </div>
  );
}
