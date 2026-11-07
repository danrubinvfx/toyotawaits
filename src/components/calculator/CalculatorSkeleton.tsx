import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function CalculatorSkeleton() {
  return (
    <div
      data-testid="calculator-skeleton"
      className="space-y-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 p-4 sm:p-6 shadow-sm backdrop-blur-sm animate-pulse"
      aria-label="Loading calculator..."
      role="status"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 sm:w-64" />
          <Skeleton className="h-4 w-36 sm:w-48" />
        </div>
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3 bg-zinc-50 dark:bg-zinc-950/40">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3 bg-zinc-50 dark:bg-zinc-950/40">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>

      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 bg-zinc-50 dark:bg-zinc-950/40">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-56 sm:h-72 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default CalculatorSkeleton;
