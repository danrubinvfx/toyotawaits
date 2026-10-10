'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ChevronLeft,
  Car,
  FileEdit,
  BarChart3,
  Heart,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

function StatusUpdatedContent() {
  const searchParams = useSearchParams();

  const action = searchParams.get('action');
  const token = searchParams.get('token') || '';
  const model = searchParams.get('model') || 'Toyota Vehicle';
  const trim = searchParams.get('trim');
  const province = searchParams.get('province') || '';
  const waitDays = searchParams.get('waitDays');
  const error = searchParams.get('error');

  if (error || !action) {
    return (
      <Card className="border-zinc-800 bg-zinc-900/60 shadow-xl max-w-lg mx-auto text-center">
        <CardHeader className="pb-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-950/60 text-red-400 mb-3 border border-red-800/60">
            <AlertCircle className="h-7 w-7" />
          </div>
          <CardTitle className="text-xl font-bold text-zinc-100">
            {error === 'not_found' ? 'Order Not Found' : 'Unable to Update Status'}
          </CardTitle>
          <CardDescription className="text-zinc-400 text-sm">
            {error === 'not_found'
              ? 'The order link or token provided could not be matched. It may have expired or already been removed.'
              : 'The requested status action was missing or invalid.'}
          </CardDescription>
        </CardHeader>
        <CardFooter className="pt-2 justify-center">
          <Button asChild variant="outline" className="border-zinc-800 hover:bg-zinc-800">
            <Link href="/" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Return to Live Tracker
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Card className="border-zinc-800 bg-zinc-900/70 shadow-2xl backdrop-blur-sm overflow-hidden">
        {/* Header Visual Indicator */}
        <div
          className={`h-2 w-full ${
            action === 'delivered'
              ? 'bg-emerald-500'
              : action === 'cancelled'
              ? 'bg-zinc-600'
              : 'bg-amber-500'
          }`}
        />

        <CardHeader className="text-center pb-4 pt-6">
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-3 border ${
              action === 'delivered'
                ? 'bg-emerald-950/70 text-emerald-400 border-emerald-800/80 shadow-emerald-950/50 shadow-lg'
                : action === 'cancelled'
                ? 'bg-zinc-800/70 text-zinc-400 border-zinc-700/80'
                : 'bg-amber-950/70 text-amber-400 border-amber-800/80 shadow-amber-950/50 shadow-lg'
            }`}
          >
            {action === 'delivered' ? (
              <CheckCircle2 className="h-8 w-8" />
            ) : action === 'cancelled' ? (
              <XCircle className="h-8 w-8" />
            ) : (
              <Clock className="h-8 w-8" />
            )}
          </div>

          <CardTitle className="text-2xl font-extrabold tracking-tight text-zinc-50">
            {action === 'delivered'
              ? '🎉 Delivery Confirmed!'
              : action === 'cancelled'
              ? 'Order Marked as Cancelled'
              : 'Status Confirmed: Still Waiting'}
          </CardTitle>

          <CardDescription className="text-zinc-300 text-sm max-w-md mx-auto pt-1 leading-relaxed">
            {action === 'delivered'
              ? "Congratulations! Today's date has been logged as your delivery arrival. Your record now directly helps benchmark realistic delivery timelines for other Canadian buyers."
              : action === 'cancelled'
              ? 'Thank you for keeping the community informed. Your record has been cleanly removed from active queue calculations to keep community forecasts accurate.'
              : 'Thank you for the check-in! Your queue position has been refreshed as active and fresh. Long waits stay fully counted when verified.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 px-6">
          {/* Order Snapshot Pill */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 font-semibold text-zinc-300">
                <Car className="h-4 w-4 text-amber-500" />
                {model}
              </span>
              {province && (
                <Badge variant="outline" className="border-zinc-700 text-zinc-300 font-mono text-[11px]">
                  {province.toUpperCase()}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-zinc-800/80">
              {trim && <span className="text-zinc-400 truncate max-w-[260px]">{trim}</span>}
              {waitDays != null && waitDays !== '' && (
                <span className="text-emerald-400 font-bold ml-auto">
                  {action === 'delivered' ? `Total Wait: ${waitDays} days` : `Waited So Far: ${waitDays} days`}
                </span>
              )}
            </div>
          </div>

          {/* Conditional Next-Step Prompt for Delivered Orders */}
          {action === 'delivered' && token && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-4 space-y-2.5 text-xs text-emerald-200">
              <div className="flex items-center gap-2 font-bold text-emerald-100 text-sm">
                <FileEdit className="h-4 w-4 text-emerald-400" />
                Optional: Record Final Dealership Details
              </div>
              <p className="leading-relaxed text-zinc-300">
                Did the dealer honor MSRP? Were there mandatory add-on packages or unexpected delays? Adding these details takes 30 seconds and protects the next Canadian buyer.
              </p>
              <div className="pt-1">
                <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold w-full sm:w-auto">
                  <Link href={`/edit/${encodeURIComponent(token)}`}>
                    Complete Final Purchase Details &rarr;
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Discrete Ko-fi Support Link */}
          <div className="pt-2 text-center">
            <a
              href="https://ko-fi.com/toyotawaits"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-500 hover:text-amber-400 dark:text-zinc-400 dark:hover:text-amber-400 transition-colors inline-block leading-relaxed"
            >
              Thanks for contributing to the community! If ToyotaWaits helps you navigate your wait, consider supporting server costs on Ko-fi →
            </a>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-950/40 border-t border-zinc-800/80 p-4">
          <Button asChild variant="outline" size="sm" className="w-full sm:w-auto border-zinc-800 hover:bg-zinc-850 text-zinc-300">
            <Link href="/" className="gap-1.5">
              <ChevronLeft className="h-4 w-4" />
              Live Community Table
            </Link>
          </Button>

          <Button asChild size="sm" className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold gap-1.5">
            <Link href="/#estimator">
              <BarChart3 className="h-4 w-4" />
              View Regional Estimates
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function StatusUpdatedPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:py-20 min-h-[70vh] flex items-center justify-center">
      <Suspense
        fallback={
          <div className="h-80 w-full max-w-lg mx-auto rounded-2xl bg-zinc-900/50 animate-pulse border border-zinc-800" />
        }
      >
        <StatusUpdatedContent />
      </Suspense>
    </div>
  );
}
