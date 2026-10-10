'use client';

import React from 'react';
import { Check, Clock, Truck, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { SubmissionStage, OrderStage } from '@/lib/types/contracts';

export interface OrderStageIndicatorProps {
  stage?: OrderStage | SubmissionStage | string | null;
  status?: string | null;
  compact?: boolean;
  className?: string;
}

const MILESTONES: Array<{
  key: string;
  label: string;
  shortLabel: string;
}> = [
  { key: 'deposit_placed', label: 'Deposit Placed', shortLabel: 'Deposit' },
  { key: 'allocation_confirmed', label: 'Allocation Assigned', shortLabel: 'Allocated' },
  { key: 'in_transit', label: 'In Transit', shortLabel: 'In Transit' },
  { key: 'delivered', label: 'Delivered', shortLabel: 'Delivered' },
];

export function getStageStepIndex(stage?: string | null, status?: string | null): number {
  if (status === 'cancelled' || stage === 'cancelled') return -1;
  if (status === 'delivered' || stage === 'delivered' || stage === 'arrived_at_dealer') return 3;
  if (stage === 'in_transit' || stage === 'freight_transit') return 2;
  if (stage === 'allocation_confirmed') return 1;
  return 0; // default: deposit_placed
}

export function getStageDisplayLabel(stage?: string | null, status?: string | null): string {
  if (status === 'cancelled' || stage === 'cancelled') return 'Cancelled';
  if (status === 'delivered' || stage === 'delivered' || stage === 'arrived_at_dealer') return 'Delivered';
  if (stage === 'in_transit' || stage === 'freight_transit') return 'In Transit';
  if (stage === 'allocation_confirmed') return 'Allocation Assigned';
  return 'Deposit Placed';
}

export function OrderStageIndicator({
  stage,
  status,
  compact = false,
  className = '',
}: OrderStageIndicatorProps) {
  const isCancelled = status === 'cancelled' || stage === 'cancelled';
  const activeStep = getStageStepIndex(stage, status);
  const displayLabel = getStageDisplayLabel(stage, status);

  if (isCancelled) {
    return (
      <div className={`inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 ${className}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
        <span>Order Cancelled</span>
      </div>
    );
  }

  // Compact View (Ideal for table cells)
  if (compact) {
    return (
      <div
        data-testid="order-stage-indicator-compact"
        className={`flex flex-col gap-1 min-w-[120px] ${className}`}
        title={`Active Milestone: ${displayLabel}`}
      >
        <div className="flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400">
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">{displayLabel}</span>
          <span className="font-mono text-[9px]">{activeStep + 1}/4</span>
        </div>
        {/* 4-segment progress bar */}
        <div className="grid grid-cols-4 gap-1 h-1.5 w-full">
          {MILESTONES.map((m, idx) => {
            const isCompleted = idx < activeStep;
            const isCurrent = idx === activeStep;
            const isDeliveredStep = idx === 3 && activeStep === 3;

            return (
              <div
                key={m.key}
                className={`rounded-full transition-all duration-300 ${
                  isDeliveredStep
                    ? 'bg-emerald-500 shadow-xs'
                    : isCurrent
                    ? 'bg-amber-500 shadow-xs ring-1 ring-amber-400/50'
                    : isCompleted
                    ? 'bg-amber-400/80 dark:bg-amber-500/70'
                    : 'bg-zinc-200 dark:bg-zinc-800'
                }`}
              />
            );
          })}
        </div>
      </div>
    );
  }

  // Full / Expanded View (Ideal for Community Submission Cards)
  return (
    <div
      data-testid="order-stage-indicator"
      className={`rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 p-2.5 space-y-2 ${className}`}
    >
      <div className="flex items-center justify-between text-xs">
        <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
          Order Milestone
        </span>
        <span
          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
            activeStep === 3
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
          }`}
        >
          {displayLabel}
        </span>
      </div>

      {/* Stepper with connecting line */}
      <div className="relative pt-1 pb-1">
        <div className="absolute top-1/2 left-3 right-3 -translate-y-1/2 h-0.5 bg-zinc-200 dark:bg-zinc-800 z-0" />
        <div
          className="absolute top-1/2 left-3 -translate-y-1/2 h-0.5 bg-amber-500 transition-all duration-500 z-0"
          style={{ width: `${(activeStep / (MILESTONES.length - 1)) * 90}%` }}
        />

        <div className="grid grid-cols-4 relative z-10 text-center">
          {MILESTONES.map((m, idx) => {
            const isCompleted = idx < activeStep;
            const isCurrent = idx === activeStep;
            const isDeliveredFinal = idx === 3 && activeStep === 3;

            return (
              <div key={m.key} className="flex flex-col items-center gap-1">
                <div
                  className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                    isDeliveredFinal
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : isCurrent
                      ? 'bg-amber-500 text-zinc-950 border-amber-600 ring-2 ring-amber-400/30'
                      : isCompleted
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-400'
                      : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 border-zinc-300 dark:border-zinc-700'
                  }`}
                >
                  {isCompleted || isDeliveredFinal ? (
                    <Check className="h-3 w-3 stroke-[3]" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <span
                  className={`text-[10px] leading-tight ${
                    isCurrent
                      ? 'font-bold text-zinc-900 dark:text-zinc-100'
                      : isCompleted
                      ? 'font-medium text-zinc-600 dark:text-zinc-400'
                      : 'text-zinc-400 dark:text-zinc-600'
                  }`}
                >
                  {m.shortLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
