'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { updateStoredSubmissionByToken } from '@/lib/storage/submission-storage';
import {
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  MapPin,
  Car,
  ChevronLeft,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Truck,
} from 'lucide-react';
import { OrderStageIndicator } from '@/components/dashboard/order-stage-indicator';

interface EditPageProps {
  params: Promise<{ token: string }>;
}

export function getTodayLocalDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function EditSubmissionPage({ params }: EditPageProps) {
  const { token } = use(params);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submission, setSubmission] = useState<any | null>(null);

  // Form states
  const [stage, setStage] = useState<'deposit_placed' | 'allocation_confirmed' | 'in_transit' | 'delivered' | 'cancelled'>('deposit_placed');
  const [status, setStatus] = useState<'pending' | 'delivered' | 'cancelled'>('pending');
  const [deliveryDate, setDeliveryDate] = useState<string>(getTodayLocalDate());
  const [notes, setNotes] = useState<string>('');

  // UI state
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSubmission() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`/api/submissions/edit/${token}`, { cache: 'no-store' });
        const json = await res.json();

        if (!isMounted) return;

        if (!res.ok || !json.success) {
          setError(json.error?.message || 'Unable to load submission. The edit link may be invalid or expired.');
          setIsLoading(false);
          return;
        }

        const data = json.data;
        setSubmission(data);
        const resolvedStage = data.stage || data.currentStage || (data.status === 'delivered' ? 'delivered' : data.status === 'cancelled' ? 'cancelled' : 'deposit_placed');
        setStage(resolvedStage);
        setStatus(data.status || (resolvedStage === 'delivered' ? 'delivered' : resolvedStage === 'cancelled' ? 'cancelled' : 'pending'));
        if (data.deliveryDate) {
          setDeliveryDate(data.deliveryDate.split('T')[0]);
        }
        if (data.notes) {
          setNotes(data.notes);
        }
      } catch (err: any) {
        if (isMounted) {
          setError('Failed to connect to ToyotaWaits. Please check your internet connection.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (token) {
      loadSubmission();
    }

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    setSaveSuccess(false);
    setSaveMessage(null);

    try {
      const payload: Record<string, any> = {
        stage,
        status,
        notes: notes.trim() || null,
      };

      if (stage === 'delivered' || status === 'delivered') {
        payload.deliveryDate = deliveryDate;
      }

      const res = await fetch(`/api/submissions/edit/${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error?.message || 'Failed to update submission. Please verify input fields.');
        return;
      }

      // Update submission state in UI
      setSubmission((prev: any) => ({
        ...prev,
        stage,
        status,
        deliveryDate: stage === 'delivered' || status === 'delivered' ? deliveryDate : null,
        notes: notes.trim() || prev?.notes,
        waitDays: json.data?.waitDays ?? prev?.waitDays,
      }));

      // Update local storage
      updateStoredSubmissionByToken(token, {
        status,
      });

      setSaveSuccess(true);
      setSaveMessage('Your vehicle timeline was successfully updated! Estimates have been recalculated.');
    } catch (err: any) {
      console.error('Update submission error:', err);
      setError('A network error occurred while updating your submission.');
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate days waited so far
  const daysSoFar = submission?.orderDate
    ? Math.max(
        0,
        Math.floor(
          (new Date().getTime() - new Date(submission.orderDate).getTime()) / (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-44 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error && !submission) {
    return (
      <div className="container mx-auto max-w-xl px-4 py-16 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40 text-red-600">
          <AlertCircle className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50">Invalid or Expired Link</h1>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">{error}</p>
        </div>
        <div className="pt-2">
          <Button asChild variant="outline">
            <Link href="/" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 sm:py-12 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Live Tracker
        </Link>
        <Badge variant="outline" className="border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs">
          Order ID: {submission?.id?.slice(0, 8)}...
        </Badge>
      </div>

      {/* Vehicle Summary Banner */}
      <Card className="border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
                {submission?.modelYear} Toyota {submission?.model}
              </CardTitle>
            </div>
            <Badge
              className={`capitalize text-xs font-bold self-start sm:self-auto ${
                submission?.status === 'delivered'
                  ? 'bg-emerald-600 text-white'
                  : submission?.status === 'cancelled'
                  ? 'bg-zinc-600 text-white'
                  : 'bg-amber-500 text-zinc-950'
              }`}
            >
              {submission?.status === 'pending' ? 'Still Waiting' : submission?.status}
            </Badge>
          </div>
          <CardDescription className="text-xs text-zinc-500">
            {submission?.powertrain} &bull; {submission?.trim}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="text-zinc-400 text-[11px] uppercase tracking-wider block">Location</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
              <MapPin className="h-3 w-3 text-zinc-400" />
              {submission?.city ? `${submission.city}, ${submission.province}` : submission?.province}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-zinc-400 text-[11px] uppercase tracking-wider block">Order Date</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
              <Calendar className="h-3 w-3 text-zinc-400" />
              {submission?.orderDate}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-zinc-400 text-[11px] uppercase tracking-wider block">
              {submission?.status === 'delivered' ? 'Total Wait' : 'Waited So Far'}
            </span>
            <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Clock className="h-3 w-3 text-amber-500" />
              {submission?.waitDays != null ? `${submission.waitDays} days` : `${daysSoFar} days`}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-zinc-400 text-[11px] uppercase tracking-wider block">Pricing</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 capitalize">
              {submission?.pricing?.replace('_', ' ') || 'At MSRP'}
            </span>
          </div>
        </CardContent>

        <div className="px-6 pb-4 pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
          <OrderStageIndicator
            stage={submission?.stage || stage}
            status={submission?.status || status}
            compact={false}
          />
        </div>
      </Card>

      {/* Save Success Banner */}
      {saveSuccess && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-900 dark:text-emerald-100 flex items-start justify-between gap-3 shadow-sm">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-bold">{saveMessage}</p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Thank you for keeping the Canadian community delivery log accurate!
              </p>
              <p className="text-xs text-emerald-800 dark:text-emerald-200 pt-1">
                <a
                  href="https://ko-fi.com/toyotawaits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Thanks for contributing to the community! If ToyotaWaits helps you navigate your wait, consider supporting server costs on Ko-fi →
                </a>
              </p>
            </div>
          </div>
          <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs shrink-0">
            <Link href="/#estimator">View Estimates</Link>
          </Button>
        </div>
      )}

      {/* Main Edit Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader className="space-y-1 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/30 dark:bg-zinc-900/30">
            <CardTitle className="text-base sm:text-lg font-bold">Update Your Order Status</CardTitle>
            <CardDescription className="text-xs">
              Toggle your delivery status or add notes. Changes update our crowdsourced benchmarks instantly.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Milestone Selection Pills */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Current Milestone / Stage
                </Label>
                <span className="text-[11px] text-zinc-500">Advance order progress</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setStage('deposit_placed');
                    setStatus('pending');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    stage === 'deposit_placed'
                      ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 shadow-xs ring-1 ring-amber-500'
                      : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Clock
                      className={`h-4 w-4 shrink-0 ${
                        stage === 'deposit_placed' ? 'text-amber-500' : 'text-zinc-400'
                      }`}
                    />
                    <div>
                      <p className="text-xs font-bold">1. Deposit Placed</p>
                      <p className="text-[11px] text-zinc-500">Deposit on file with dealer</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStage('allocation_confirmed');
                    setStatus('pending');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    stage === 'allocation_confirmed'
                      ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 shadow-xs ring-1 ring-amber-500'
                      : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2
                      className={`h-4 w-4 shrink-0 ${
                        stage === 'allocation_confirmed' ? 'text-amber-500' : 'text-zinc-400'
                      }`}
                    />
                    <div>
                      <p className="text-xs font-bold">2. Allocation Assigned</p>
                      <p className="text-[11px] text-zinc-500">Build date / temp VIN confirmed</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStage('in_transit');
                    setStatus('pending');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    stage === 'in_transit'
                      ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 shadow-xs ring-1 ring-amber-500'
                      : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Truck
                      className={`h-4 w-4 shrink-0 ${
                        stage === 'in_transit' ? 'text-amber-500' : 'text-zinc-400'
                      }`}
                    />
                    <div>
                      <p className="text-xs font-bold">3. In Transit / Freight</p>
                      <p className="text-[11px] text-zinc-500">Shipped by rail or carrier</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStage('delivered');
                    setStatus('delivered');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    stage === 'delivered'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/50 dark:text-emerald-100 shadow-xs ring-1 ring-emerald-600'
                      : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2
                      className={`h-4 w-4 shrink-0 ${
                        stage === 'delivered' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400'
                      }`}
                    />
                    <div>
                      <p className="text-xs font-bold">4. Delivered at Dealership</p>
                      <p className="text-[11px] text-zinc-500">Took delivery &amp; received keys</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Secondary Cancelled Action Option */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setStage('cancelled');
                    setStatus('cancelled');
                  }}
                  className={`w-full p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    stage === 'cancelled'
                      ? 'border-zinc-500 bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 shadow-xs ring-1 ring-zinc-500'
                      : 'border-zinc-200 dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <XCircle
                      className={`h-4 w-4 shrink-0 ${
                        stage === 'cancelled' ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-400'
                      }`}
                    />
                    <span className="text-xs font-semibold">Order Cancelled / Deposit Refunded</span>
                  </div>
                  <span className="text-[11px] text-zinc-500">Moved on / refunded</span>
                </button>
              </div>
            </div>

            {/* Delivery Date Picker (shown when Delivered) */}
            {(stage === 'delivered' || status === 'delivered') && (
              <div className="space-y-1.5 p-4 rounded-xl border border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/20">
                <Label htmlFor="delivery-date-input" className="text-xs font-semibold text-emerald-950 dark:text-emerald-100 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                  Actual Delivery Date *
                </Label>
                <Input
                  id="delivery-date-input"
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  max={getTodayLocalDate()}
                  required
                  className="bg-white dark:bg-zinc-950 font-medium text-xs sm:text-sm"
                />
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                  This calculates your exact total wait time in days from deposit to delivery.
                </p>
              </div>
            )}

            {/* Notes Field */}
            <div className="space-y-1.5">
              <Label htmlFor="notes-input" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Dealership / Delivery Experience Notes (Optional)
              </Label>
              <textarea
                id="notes-input"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Richmond dealer delivered on schedule at MSRP. No mandatory paint protection."
                className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 pb-5 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-[11px] text-zinc-400 flex items-center gap-1 self-start sm:self-auto">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Zero-PII compliant &bull; Direct DB update
            </span>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm w-full sm:w-auto px-6 h-9"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
