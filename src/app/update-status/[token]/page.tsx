'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Clock,
  Car,
  AlertCircle,
  Loader2,
  Truck,
  Building2,
  Calendar,
  XCircle,
  Compass,
  ArrowRight,
  TrendingUp,
  MapPin,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ token: string }>;
}

interface SubmissionState {
  id: string;
  token: string;
  orderDate: string;
  deliveryDate?: string | null;
  model: string;
  modelSlug: string;
  powertrain?: string;
  trim?: string;
  province: string;
  status: string;
  currentStage: string;
  stage: string;
  queuePosition: number;
  provincialMedianDays: number;
  waitDays?: number | null;
}

const MILESTONES = [
  {
    id: 'deposit_placed',
    label: 'Still Waiting in Queue',
    subtitle: 'Deposit active, awaiting build assignment',
    icon: Clock,
    color: 'amber',
  },
  {
    id: 'build_assigned',
    label: 'Build Assigned / VIN Created',
    subtitle: 'Factory build slot confirmed or VIN issued',
    icon: Building2,
    color: 'blue',
  },
  {
    id: 'in_transit',
    label: 'Vehicle In Transit',
    subtitle: 'On freight train, vessel, or en route to dealer',
    icon: Truck,
    color: 'indigo',
  },
  {
    id: 'delivered',
    label: 'Delivered!',
    subtitle: 'Picked up vehicle with keys in hand',
    icon: CheckCircle2,
    color: 'emerald',
  },
  {
    id: 'canceled',
    label: 'Canceled / Bought Elsewhere',
    subtitle: 'Refunded deposit or chose another vehicle',
    icon: XCircle,
    color: 'zinc',
  },
] as const;

export default function UpdateStatusPage({ params }: PageProps) {
  const { token } = use(params);
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submission, setSubmission] = useState<SubmissionState | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [successData, setSuccessData] = useState<{
    queuePosition: number;
    provincialMedianDays: number;
    stage: string;
    status: string;
  } | null>(null);

  const handleMilestoneClick = async (milestoneId: string, currentSub?: SubmissionState) => {
    const sub = currentSub || submission;
    if (!sub || isUpdating) return;

    try {
      setIsUpdating(true);
      setActiveAction(milestoneId);
      setError(null);

      const res = await fetch(`/api/update-status/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestone: milestoneId }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error?.message || 'Failed to update order milestone. Please try again.');
        return;
      }

      setUpdateSuccess(true);
      setSuccessData({
        queuePosition: json.data.queuePosition,
        provincialMedianDays: json.data.provincialMedianDays,
        stage: json.data.stage,
        status: json.data.status,
      });

      setSubmission((prev) =>
        prev
          ? {
              ...prev,
              stage: json.data.stage,
              status: json.data.status,
              queuePosition: json.data.queuePosition,
              provincialMedianDays: json.data.provincialMedianDays,
              deliveryDate: json.data.deliveryDate,
              waitDays: json.data.waitDays,
            }
          : null
      );
    } catch (err: any) {
      setError(err?.message || 'Network error updating your order status.');
    } finally {
      setIsUpdating(false);
      setActiveAction(null);
    }
  };

  // Load submission data
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`/api/update-status/${token}`, { cache: 'no-store' });
        const json = await res.json();

        if (!isMounted) return;

        if (!res.ok || !json.success) {
          setError(json.error?.message || 'Unable to load submission. The link may be invalid or expired.');
          setIsLoading(false);
          return;
        }

        setSubmission(json.data);

        // Check if milestone was pre-requested in query param
        const prefillAction = searchParams?.get('action') || searchParams?.get('milestone');
        if (prefillAction) {
          handleMilestoneClick(prefillAction, json.data);
        }
      } catch (err: any) {
        if (!isMounted) return;
        setError(err?.message || 'Failed to connect to the server. Please try again.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [token]);

  if (isLoading) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-400 mx-auto" />
          <p className="text-sm text-zinc-400">Loading your queue tracking status...</p>
        </div>
      </main>
    );
  }

  if (error && !submission) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/80 shadow-2xl text-center">
          <CardHeader className="space-y-3 pb-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-950/60 text-red-400 border border-red-800/60">
              <AlertCircle className="h-7 w-7" />
            </div>
            <CardTitle className="text-xl font-bold text-zinc-100">Unable to Find Order</CardTitle>
            <CardDescription className="text-zinc-400 text-sm">
              {error}
            </CardDescription>
          </CardHeader>
          <CardFooter className="pt-2 justify-center">
            <Button asChild variant="outline" className="border-zinc-700 hover:bg-zinc-800 text-zinc-200">
              <Link href="/">Return to Live Tracker</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  if (!submission) return null;

  const currentStage = submission.stage || submission.currentStage || 'deposit_placed';
  const modelSlug = submission.modelSlug || 'rav4';
  const displayModel = submission.model || 'Toyota';
  const displayProvince = submission.province || 'BC';
  const displayOrderDate = submission.orderDate || 'Recent';

  return (
    <main className="min-h-[80vh] py-8 px-4 sm:px-6 max-w-2xl mx-auto space-y-6">
      {/* Header Cockpit Card */}
      <Card className="border-zinc-800 bg-zinc-900/90 shadow-2xl backdrop-blur-sm overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500" />
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-950/40 text-xs px-2.5 py-0.5">
              1-Click Status Update Cockpit
            </Badge>
            <span className="text-xs text-zinc-400 flex items-center gap-1">
              <MapPin className="h-3 w-3 text-zinc-400" />
              {displayProvince}
            </span>
          </div>
          <CardTitle className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <Car className="h-6 w-6 text-zinc-300" />
            {displayModel}
          </CardTitle>
          <CardDescription className="text-zinc-400 text-sm flex items-center gap-1.5 pt-0.5">
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            <span>{displayOrderDate}</span>
            <span>•</span>
            <span className="text-zinc-200 font-medium">{displayModel}</span>
            <span>•</span>
            <span className="text-zinc-200 font-medium">{displayProvince}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="p-3.5 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Immediate Reward Banner upon Update */}
          {updateSuccess && successData && (
            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-emerald-950/80 to-teal-950/60 border border-emerald-500/50 shadow-lg space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-emerald-200">
                    Status Updated Successfully!
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Thank you for keeping the crowd-sourced tracker accurate for all Canadians waiting in line.
                  </p>
                </div>
              </div>

              {/* Reward Metric Chips */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-lg bg-zinc-950/60 border border-emerald-500/20">
                  <div className="text-[11px] text-zinc-400 flex items-center gap-1 mb-0.5">
                    <TrendingUp className="h-3 w-3 text-emerald-400" />
                    Revised Queue Position
                  </div>
                  <div className="text-lg font-bold text-zinc-100">
                    #{successData.queuePosition}{' '}
                    <span className="text-xs font-normal text-zinc-400">in {displayProvince}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-zinc-950/60 border border-emerald-500/20">
                  <div className="text-[11px] text-zinc-400 flex items-center gap-1 mb-0.5">
                    <Clock className="h-3 w-3 text-amber-400" />
                    Provincial Median
                  </div>
                  <div className="text-lg font-bold text-zinc-100">
                    ~{successData.provincialMedianDays}{' '}
                    <span className="text-xs font-normal text-zinc-400">days</span>
                  </div>
                </div>
              </div>

              {/* Action Bridge: Live Local Allocations */}
              <div className="pt-1">
                <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold gap-2 shadow-md">
                  <Link href={`/inventory?model=${encodeURIComponent(modelSlug || displayModel)}`}>
                    <Compass className="h-4 w-4" />
                    View Live Local Allocations for {displayModel}
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Interactive 1-Tap Milestone Cockpit */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-200">
                Tap your current milestone to update:
              </h2>
              {isUpdating && (
                <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                  Writing to ledger...
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              {MILESTONES.map((item) => {
                const isSelected =
                  currentStage === item.id ||
                  (item.id === 'canceled' && (currentStage === 'cancelled' || submission.status === 'cancelled')) ||
                  (item.id === 'delivered' && submission.status === 'delivered') ||
                  (item.id === 'build_assigned' && (currentStage === 'vin_assigned' || currentStage === 'allocation_confirmed'));

                const isCurrentAction = activeAction === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleMilestoneClick(item.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 flex items-center gap-3.5 group ${
                      isSelected
                        ? 'border-emerald-500/80 bg-emerald-950/30 text-zinc-100 ring-1 ring-emerald-500/50 shadow-sm'
                        : 'border-zinc-800 bg-zinc-950/60 hover:bg-zinc-800/60 hover:border-zinc-700 text-zinc-300'
                    } ${isUpdating ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 group-hover:border-zinc-700'
                      }`}
                    >
                      {isCurrentAction ? (
                        <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-zinc-100">
                          {item.label}
                        </span>
                        {isSelected && (
                          <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-950/50 text-[10px] px-1.5 py-0 h-4">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>

                    <ArrowRight className={`h-4 w-4 shrink-0 transition-transform ${isSelected ? 'text-emerald-400' : 'text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-2 pb-5 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <div>
            Zero-login magic token authenticated • 1-click update
          </div>
          <Button asChild variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-200 text-xs h-8">
            <Link href={`/inventory?model=${encodeURIComponent(modelSlug || displayModel)}`}>
              Browse Live Allocations →
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
