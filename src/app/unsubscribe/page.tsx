import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { unsubscribeByToken } from '@/lib/db/notifications';
import { CheckCircle2, AlertCircle, Home, BellOff } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Unsubscribe from Alerts | ToyotaWaits.ca',
  description: 'Manage your email notification and delivery alert preferences on ToyotaWaits.ca.',
};

interface UnsubscribePageProps {
  searchParams: Promise<{ token?: string }>;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function UnsubscribePage({ searchParams }: UnsubscribePageProps) {
  const { token } = await searchParams;

  let isValid = false;
  let isSuccess = false;
  let errorMessage = 'The unsubscribe token provided is missing or invalid.';

  if (token && UUID_REGEX.test(token)) {
    isValid = true;
    const res = await unsubscribeByToken(token);
    if (res.found) {
      isSuccess = true;
    } else {
      errorMessage = 'This unsubscribe link is invalid or has already been processed.';
    }
  }

  return (
    <div className="container mx-auto max-w-lg px-4 py-16 sm:py-24 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs font-semibold text-zinc-400">
          <BellOff className="h-3.5 w-3.5 text-amber-500" />
          <span>Alert Preferences</span>
        </div>
      </div>

      {isSuccess ? (
        <Card className="border-zinc-800 bg-zinc-950 text-zinc-100 shadow-xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400" />
          <CardHeader className="text-center pt-8 pb-4 space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Unsubscribed Successfully
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
              You have been successfully unsubscribed from delivery and wait-time alerts.
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center text-xs text-zinc-500 pb-6">
            You will no longer receive automated email alerts for matching Canadian vehicle allocations.
            You can always re-subscribe directly from the wait-time estimator.
          </CardContent>

          <CardFooter className="bg-zinc-900/40 border-t border-zinc-800/80 p-4 justify-center">
            <Button asChild className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold gap-2 text-xs h-9 px-5">
              <Link href="/">
                <Home className="h-3.5 w-3.5" />
                Return to ToyotaWaits.ca
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="border-zinc-800 bg-zinc-950 text-zinc-100 shadow-xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-rose-500 to-amber-500" />
          <CardHeader className="text-center pt-8 pb-4 space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertCircle className="h-7 w-7" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Invalid or Expired Link
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
              {errorMessage}
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center text-xs text-zinc-500 pb-6">
            If you need assistance managing your email alerts, please verify the link in your latest email or visit our homepage.
          </CardContent>

          <CardFooter className="bg-zinc-900/40 border-t border-zinc-800/80 p-4 justify-center">
            <Button asChild variant="outline" className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 gap-2 text-xs h-9 px-5">
              <Link href="/">
                <Home className="h-3.5 w-3.5" />
                Back to Home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
