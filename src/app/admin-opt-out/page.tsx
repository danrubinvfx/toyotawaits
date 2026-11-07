'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';

function AdminOptOutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const disableParam = searchParams.get('action') === 'disable' || searchParams.get('enable') === 'false';

  const [isOptedOut, setIsOptedOut] = useState<boolean>(!disableParam);
  const [countdown, setCountdown] = useState<number>(3);

  useEffect(() => {
    if (disableParam) {
      try {
        localStorage.removeItem('tw_admin_opt_out');
      } catch {
        // ignore localStorage access restrictions
      }
      document.cookie = 'tw_admin_opt_out=; path=/; max-age=0; SameSite=Lax';
      document.cookie = 'opt_out=; path=/; max-age=0; SameSite=Lax';
      setIsOptedOut(false);
    } else {
      try {
        localStorage.setItem('tw_admin_opt_out', 'true');
      } catch {
        // ignore localStorage access restrictions
      }
      document.cookie = 'tw_admin_opt_out=true; path=/; max-age=31536000; SameSite=Lax';
      document.cookie = 'opt_out=true; path=/; max-age=31536000; SameSite=Lax';
      setIsOptedOut(true);
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disableParam]);

  const handleToggle = () => {
    const next = !isOptedOut;
    setIsOptedOut(next);
    if (!next) {
      try {
        localStorage.removeItem('tw_admin_opt_out');
      } catch {}
      document.cookie = 'tw_admin_opt_out=; path=/; max-age=0; SameSite=Lax';
      document.cookie = 'opt_out=; path=/; max-age=0; SameSite=Lax';
    } else {
      try {
        localStorage.setItem('tw_admin_opt_out', 'true');
      } catch {}
      document.cookie = 'tw_admin_opt_out=true; path=/; max-age=31536000; SameSite=Lax';
      document.cookie = 'opt_out=true; path=/; max-age=31536000; SameSite=Lax';
    }
  };

  return (
    <div className="container mx-auto max-w-lg px-4 py-16 sm:py-24 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Admin Internal Opt-Out</span>
        </div>
      </div>

      <Card className="border-zinc-800 bg-zinc-950 text-zinc-100 shadow-xl overflow-hidden">
        <div className={`h-1.5 bg-gradient-to-r ${isOptedOut ? 'from-emerald-500 to-teal-400' : 'from-amber-500 to-orange-400'}`} />
        <CardHeader className="text-center pt-8 pb-4 space-y-3">
          <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
            isOptedOut
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          }`}>
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <CardTitle as="h1" className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {isOptedOut ? 'Admin Opt-Out Enabled' : 'Opt-Out Disabled'}
          </CardTitle>
          <CardDescription className="text-zinc-400 text-sm max-w-md mx-auto">
            {isOptedOut
              ? 'Amazon affiliate parameters (tag, linkCode, ascsubtag) are stripped from client link helpers and /out/ redirects to prevent reporting pollution.'
              : 'Affiliate tracking tags are restored to their standard state.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-xs text-zinc-400">
            <p>
              Stored in <code className="text-emerald-400 font-mono">localStorage(tw_admin_opt_out)</code> and cookie <code className="text-emerald-400 font-mono">tw_admin_opt_out=true</code>.
            </p>
          </div>
          <p className="text-xs text-zinc-500">
            Redirecting to home page in {countdown}s...
          </p>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            asChild
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
          >
            <Link href="/">
              Return to Home Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={handleToggle}
            className="w-full border-zinc-800 text-zinc-300 hover:bg-zinc-900"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {isOptedOut ? 'Disable Opt-Out' : 'Enable Opt-Out'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function AdminOptOutPage() {
  return (
    <Suspense fallback={<div className="container mx-auto max-w-lg px-4 py-16 text-center text-zinc-400">Loading opt-out status...</div>}>
      <AdminOptOutContent />
    </Suspense>
  );
}
