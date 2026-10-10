import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditSubmissionLoading() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 sm:py-12 space-y-6">
      {/* Top Navigation Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-36 bg-zinc-200 dark:bg-zinc-800" />
        <Skeleton className="h-5 w-28 rounded-full bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Vehicle Summary Banner Skeleton */}
      <Card className="border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-52 bg-zinc-200 dark:bg-zinc-800" />
            <Skeleton className="h-5 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <Skeleton className="h-4 w-40 bg-zinc-200 dark:bg-zinc-800" />
        </CardHeader>
        <CardContent className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Skeleton className="h-10 w-full bg-zinc-200 dark:bg-zinc-800" />
          <Skeleton className="h-10 w-full bg-zinc-200 dark:bg-zinc-800" />
          <Skeleton className="h-10 w-full bg-zinc-200 dark:bg-zinc-800" />
          <Skeleton className="h-10 w-full bg-zinc-200 dark:bg-zinc-800" />
        </CardContent>
      </Card>

      {/* Edit Form Skeleton */}
      <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
        <CardHeader className="space-y-2 border-b border-zinc-100 dark:border-zinc-800">
          <Skeleton className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800" />
          <Skeleton className="h-4 w-72 bg-zinc-200 dark:bg-zinc-800" />
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-36 bg-zinc-200 dark:bg-zinc-800" />
            <Skeleton className="h-24 w-full rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800" />
            <Skeleton className="h-10 w-full rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800" />
            <Skeleton className="h-20 w-full rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <Skeleton className="h-10 w-full rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        </CardContent>
      </Card>
    </div>
  );
}
