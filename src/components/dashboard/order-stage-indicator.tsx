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
  guidance: string;
}> = [
  {
    key: 'deposit_placed',
    label: 'Deposit Placed',
    shortLabel: 'Deposit',
    guidance: 'Step 01: Order deposit recorded in dealership allocation queue.',
  },
  {
    key: 'allocation_confirmed',
    label: 'Allocation Assigned',
    shortLabel: 'Allocated',
    guidance: 'Step 02: Factory build slot and temporary VIN assigned.',
  },
  {
    key: 'in_transit',
    label: 'In Transit',
    shortLabel: 'In Transit',
    guidance: 'Step 03: Permanent VIN issued; rail or ocean freight carrier in motion.',
  },
  {
    key: 'delivered',
    label: 'Delivered',
    shortLabel: 'Delivered',
    guidance: 'Step 04: Pre-Delivery Inspection complete and vehicle handed over.',
  },
];

export function getStageStepIndex(stage?: string | null, status?: string | null): number {
  if (status === 'cancelled' || stage === 'cancelled') return -1;
  if (status === 'delivered' || stage === 'delivered' || stage === 'arrived_at_dealer') return 3;
  if (stage === 'in_transit' || stage === 'freight_transit') return 2;
  if (stage === 'vin_assigned' || stage === 'allocation_confirmed') return 1;
  return 0; // default: deposit_placed
}

export function getStageDisplayLabel(stage?: string | null, status?: string | null): string {
  if (status === 'cancelled' || stage === 'cancelled') return 'Cancelled';
  if (status === 'delivered' || stage === 'delivered' || stage === 'arrived_at_dealer') return 'Delivered';
  if (stage === 'in_transit' || stage === 'freight_transit') return 'In Transit';
  if (stage === 'vin_assigned') return 'Build Assigned / VIN Generated';
  if (stage === 'allocation_confirmed') return 'Allocation Assigned';
  return 'Deposit Placed';
}

export interface OrderStageBadgeProps {
  stage?: OrderStage | SubmissionStage | string | null;
  status?: string | null;
  className?: string;
  showStepNumber?: boolean;
}

export function OrderStageBadge({
  stage,
  status,
  className = '',
  showStepNumber = true,
}: OrderStageBadgeProps) {
  const stepIndex = getStageStepIndex(stage, status);
  const displayLabel = getStageDisplayLabel(stage, status);

  if (stepIndex === -1) {
    return (
      <span
        data-testid="order-stage-badge-cancelled"
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-200/60 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700 ${className}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
        <span>Cancelled</span>
      </span>
    );
  }

  // Visual styling for the 4 discrete lifecycle states
  const styles = [
    // 0. deposit_placed
    'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 ring-amber-400/20',
    // 1. vin_assigned
    'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 ring-blue-400/20',
    // 2. in_transit
    'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 ring-purple-400/20',
    // 3. delivered
    'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 ring-emerald-400/20',
  ];

  const currentStyle = styles[stepIndex] || styles[0];

  return (
    <span
      data-testid="order-stage-badge"
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold border transition-colors ${currentStyle} ${className}`}
    >
      {showStepNumber && (
        <span className="font-mono text-[9px] px-1 py-0.2 rounded-full bg-black/10 dark:bg-white/10">
          {stepIndex + 1}/4
        </span>
      )}
      <span>{displayLabel}</span>
    </span>
  );
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
  const [selectedStep, setSelectedStep] = React.useState<number>(Math.max(0, activeStep));

  React.useEffect(() => {
    if (activeStep >= 0) {
      setSelectedStep(activeStep);
    }
  }, [activeStep]);

  if (isCancelled) {
    if (compact) {
      return (
        <div
          data-testid="order-stage-indicator-compact"
          className={`inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 ${className}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
          <span>Order Cancelled</span>
        </div>
      );
    }

    return (
      <div
        data-testid="order-stage-indicator"
        className={`rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 p-2.5 space-y-2.5 ${className}`}
      >
        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            Order Milestone
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700">
            Cancelled / Refunded
          </span>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-md bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 text-xs">
          <ShieldAlert className="h-4 w-4 shrink-0 text-zinc-500" />
          <span>This order has been marked as cancelled. Removed from active wait-time benchmarks.</span>
        </div>

        {/* Grayed-out / reset 4-stage stepper */}
        <div className="relative pt-1 pb-1 opacity-40 grayscale">
          <div className="pointer-events-none absolute top-1/2 left-3 right-3 -translate-y-1/2 h-0.5 bg-zinc-200 dark:bg-zinc-800 z-0" />
          <div className="grid grid-cols-4 relative z-10 text-center">
            {MILESTONES.map((m, idx) => (
              <div key={m.key} className="flex flex-col items-center gap-1">
                <div className="h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-zinc-300 dark:border-zinc-700 bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600">
                  <span>{idx + 1}</span>
                </div>
                <span className="text-[10px] leading-tight text-zinc-400 dark:text-zinc-600">
                  {m.shortLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
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

  const effectiveSelectedIdx =
    selectedStep >= 0 && selectedStep < MILESTONES.length ? selectedStep : Math.max(0, activeStep);
  const selectedMilestone = MILESTONES[effectiveSelectedIdx] || MILESTONES[0];

  // Full / Expanded View (Ideal for Community Submission Cards)
  return (
    <div
      data-testid="order-stage-indicator"
      className={`rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 p-2.5 space-y-2 relative z-10 ${className}`}
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
      <div className="relative pt-1 pb-1 z-10">
        <div className="pointer-events-none absolute top-1/2 left-3 right-3 -translate-y-1/2 h-0.5 bg-zinc-200 dark:bg-zinc-800 z-0" />
        <div
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 h-0.5 bg-amber-500 transition-all duration-500 z-0"
          style={{ width: `${(effectiveSelectedIdx / (MILESTONES.length - 1)) * 90}%` }}
        />

        <div className="grid grid-cols-4 relative z-10 text-center gap-1">
          {MILESTONES.map((m, idx) => {
            const isCompleted = idx < activeStep;
            const isCurrent = idx === activeStep;
            const isSelected = idx === effectiveSelectedIdx;
            const isDeliveredFinal = idx === 3 && activeStep === 3;

            return (
              <button
                key={m.key}
                type="button"
                data-testid={`order-stage-step-${m.key}`}
                aria-pressed={isSelected}
                onClick={() => setSelectedStep(idx)}
                className={`flex flex-col items-center gap-1 p-1 rounded-md cursor-pointer select-none touch-manipulation active:scale-[0.99] transition-all relative z-10 ${
                  isSelected
                    ? 'bg-amber-500/10 border border-amber-500/40'
                    : 'border border-transparent hover:bg-zinc-200/40 dark:hover:bg-zinc-800/40'
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                    isDeliveredFinal
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : isCurrent || isSelected
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
                    isCurrent || isSelected
                      ? 'font-bold text-zinc-900 dark:text-zinc-100'
                      : isCompleted
                      ? 'font-medium text-zinc-600 dark:text-zinc-400'
                      : 'text-zinc-400 dark:text-zinc-600'
                  }`}
                >
                  {m.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Step Details */}
      <div
        data-testid="order-stage-guidance"
        className="text-[11px] text-zinc-600 dark:text-zinc-400 bg-zinc-100/80 dark:bg-zinc-800/50 rounded-md px-2.5 py-1.5 border border-zinc-200/60 dark:border-zinc-800"
      >
        {selectedMilestone.guidance}
      </div>
    </div>
  );
}
