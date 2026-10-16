'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Clock,
  CheckCircle2,
  Ship,
  Building2,
  KeyRound,
  Calendar,
  Share2,
  Sparkles,
  ChevronRight,
  AlertCircle,
  ClipboardCheck,
} from 'lucide-react';
import Link from 'next/link';
import { SubmissionStage } from '@/lib/types/contracts';
import { generateCalendarReminder, downloadCalendarEvent } from '@/lib/utils/calendar';
import { RedditShareModal } from '@/components/modals/reddit-share-modal';

const STAGES: Array<{
  key: SubmissionStage;
  label: string;
  themeTitle: string;
  description: string;
  guidance: string;
}> = [
  {
    key: 'deposit_placed',
    label: 'Deposit Placed',
    themeTitle: 'Pacing the Floor',
    description: 'Deposit recorded on dealer waitlist queue.',
    guidance:
      'Keep your signed Bill of Sale and deposit receipt on file. Confirm your dealer allocation priority and ensure no mandatory dealer add-ons were bundled.',
  },
  {
    key: 'allocation_confirmed',
    label: 'Allocation Confirmed',
    themeTitle: 'Build Sheet Issued',
    description: 'Factory allocation slot and temp VIN secured.',
    guidance:
      'Request your temporary build VIN and estimated production week from your salesperson. Factory trim and exterior colour are now locked in.',
  },
  {
    key: 'freight_transit',
    label: 'Freight Transit',
    themeTitle: 'Between Tokyo and Vancouver',
    description: 'Vessel ocean voyage or rail carrier in motion.',
    guidance:
      'Your permanent 17-digit VIN is now generated. Track rail or ocean port arrival and arrange insurance quotes ahead of dealership arrival.',
  },
  {
    key: 'arrived_at_dealer',
    label: 'Arrived at Dealer',
    themeTitle: 'On the Dealer Compound',
    description: 'Carrier unloaded; Pre-Delivery Inspection underway.',
    guidance:
      'Dealership technicians are completing Pre-Delivery Inspection (PDI). Review our Delivery Day Prep checklist below before signing final handover paperwork.',
  },
  {
    key: 'delivered',
    label: 'Delivered',
    themeTitle: 'Drove Away in a Blue Valentine',
    description: 'Keys in hand, odometer rolling.',
    guidance:
      'Congratulations on your delivery! Audit your physical smart key fobs (or 2nd key IOU voucher), verify strut shipping spacers were removed, and share your timeline.',
  },
];

export function normalizeStepperStage(stage?: string | null, status?: string | null): SubmissionStage {
  if (status === 'delivered' || stage === 'delivered') return 'delivered';
  if (stage === 'arrived_at_dealer') return 'arrived_at_dealer';
  if (stage === 'freight_transit' || stage === 'in_transit') return 'freight_transit';
  if (stage === 'allocation_confirmed' || stage === 'vin_assigned') return 'allocation_confirmed';
  return 'deposit_placed';
}

interface LocalSubmission {
  id: string;
  editKey: string;
  modelName: string;
  powertrainName: string;
  trimName?: string;
  province: string;
  orderDate: string;
  currentStage: SubmissionStage;
  status: string;
}

export function ActiveOrderStepper() {
  const [localOrder, setLocalOrder] = useState<LocalSubmission | null>(null);
  const [selectedStep, setSelectedStep] = useState<SubmissionStage>('deposit_placed');
  const [updatingStage, setUpdatingStage] = useState<SubmissionStage | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Check for saved local submission in browser
      const saved =
        localStorage.getItem('toyotawait_pending_submission') ||
        localStorage.getItem('toyotawaits_submission');
      if (saved) {
        const parsed = JSON.parse(saved);
        const resolvedEditKey = parsed.editKey || parsed.edit_key || parsed.editToken;
        if (parsed.id && resolvedEditKey) {
          const normalizedStage = normalizeStepperStage(
            parsed.currentStage || parsed.stage,
            parsed.status
          );
          setLocalOrder({
            id: parsed.id,
            editKey: resolvedEditKey,
            modelName: parsed.modelName || parsed.model || 'RAV4',
            powertrainName: parsed.powertrainName || parsed.powertrain || 'Prime / Plug-in Hybrid',
            trimName: parsed.trimName || parsed.trim || 'XSE AWD',
            province: parsed.province || 'BC',
            orderDate: parsed.orderDate || new Date().toISOString().split('T')[0],
            currentStage: normalizedStage,
            status: parsed.status || 'pending',
          });
          setSelectedStep(normalizedStage);
        }
      }
    } catch {
      // Ignore parse errors from localStorage
    }
  }, []);

  if (!localOrder || localOrder.status === 'cancelled' || (localOrder.currentStage as string) === 'cancelled') {
    return null;
  }

  const effectiveStage = selectedStep || normalizeStepperStage(localOrder.currentStage, localOrder.status);
  const currentStageIndex = STAGES.findIndex((s) => s.key === effectiveStage);
  const activeIndex = currentStageIndex >= 0 ? currentStageIndex : 0;

  const handleAdvanceStage = async (nextStage: SubmissionStage) => {
    const normalizedNext = normalizeStepperStage(nextStage);
    const isDelivered = normalizedNext === 'delivered';

    // Immediately update UI selection and localStorage so mobile taps respond instantaneously
    setSelectedStep(normalizedNext);
    setUpdateError(null);

    const updatedOrder: LocalSubmission = {
      ...localOrder,
      currentStage: normalizedNext,
      status: isDelivered ? 'delivered' : 'pending',
    };
    setLocalOrder(updatedOrder);
    try {
      localStorage.setItem('toyotawait_pending_submission', JSON.stringify(updatedOrder));
    } catch {
      // Ignore storage errors
    }

    setUpdatingStage(normalizedNext);

    try {
      const today = new Date().toISOString().split('T')[0];

      const res = await fetch(`/api/submissions/${localOrder.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-edit-key': localOrder.editKey,
        },
        body: JSON.stringify({
          stage: normalizedNext,
          status: isDelivered ? 'delivered' : 'pending',
          deliveryDate: isDelivered ? today : undefined,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        console.warn('[Milestones] Background stage sync notice:', errJson?.error?.message || res.statusText);
      }
    } catch (err: any) {
      console.warn('[Milestones] Background stage sync failed:', err?.message || err);
    } finally {
      setUpdatingStage(null);
    }
  };

  const handleDownloadCalendar = () => {
    const depositDate = new Date(localOrder.orderDate);
    // Reminder at 180 days (6 months) post deposit
    const reminderDate = new Date(depositDate.getTime() + 180 * 24 * 60 * 60 * 1000);

    const ics = generateCalendarReminder({
      title: `Toyota Queue Check-in: ${localOrder.modelName} ${localOrder.powertrainName}`,
      description: `6-month allocation status check-in with dealership for ${localOrder.modelName} order (${localOrder.province}). Current milestone: ${STAGES[activeIndex].label}.`,
      startDate: reminderDate,
      location: `${localOrder.province} Dealership`,
    });

    downloadCalendarEvent(ics, `toyota-checkin-${localOrder.modelName.toLowerCase()}.ics`);
  };

  return (
    <>
      <Card className="border-amber-500/40 bg-zinc-950 text-zinc-100 shadow-xl overflow-hidden relative">
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />
        
        <CardHeader className="p-4 sm:p-6 pb-3 space-y-2 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-500 text-zinc-950 font-bold hover:bg-amber-400 gap-1 text-xs">
                <Sparkles className="h-3 w-3" /> Saved Anonymous Queue Order
              </Badge>
              <span className="text-xs text-zinc-400 font-mono">
                Key: ••••••••{localOrder.editKey.slice(-4)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadCalendar}
                className="h-8 text-xs border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 gap-1.5"
              >
                <Calendar className="h-3.5 w-3.5 text-amber-400" />
                Calendar Check-in (.ics)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsShareModalOpen(true)}
                className="h-8 text-xs border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 gap-1.5"
              >
                <Share2 className="h-3.5 w-3.5 text-amber-400" />
                Share to Reddit
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            <div>
              <CardTitle className="text-xl sm:text-2xl font-black text-white">
                {localOrder.modelName} {localOrder.powertrainName} {localOrder.trimName}
              </CardTitle>
              <p className="text-xs text-zinc-400">
                Ordered in <strong className="text-zinc-200">{localOrder.province}</strong> on {localOrder.orderDate} • Active Milestone: <span className="text-amber-400 font-semibold">{STAGES[activeIndex].themeTitle}</span>
              </p>
            </div>

            <Badge variant="outline" className="border-amber-500/40 text-amber-400 text-xs self-start sm:self-auto py-1 px-3">
              {STAGES[activeIndex].label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 pt-2 space-y-5 relative z-10">
          {/* 5-Step Visual Stepper */}
          <div className="relative z-10">
            <div className="pointer-events-none hidden md:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-zinc-800 z-0" />
            <div
              className="pointer-events-none hidden md:block absolute top-1/2 left-6 -translate-y-1/2 h-0.5 bg-amber-500 transition-all duration-500 z-0"
              style={{ width: `${(activeIndex / (STAGES.length - 1)) * 100}%` }}
            />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-2 relative z-10">
              {STAGES.map((step, idx) => {
                const isCompleted = idx < activeIndex;
                const isCurrent = idx === activeIndex;

                return (
                  <button
                    key={step.key}
                    type="button"
                    data-testid={`milestone-step-${step.key}`}
                    aria-pressed={isCurrent}
                    onClick={() => handleAdvanceStage(step.key)}
                    className={`w-full text-left rounded-xl p-3 border cursor-pointer select-none touch-manipulation active:scale-[0.99] transition-all flex flex-col justify-between relative z-10 ${
                      isCurrent
                        ? 'bg-amber-950/30 border-amber-500 ring-1 ring-amber-500/40 shadow-md shadow-amber-500/10'
                        : isCompleted
                        ? 'bg-zinc-900/90 border-emerald-900/60 hover:border-zinc-700'
                        : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full pb-1.5">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                          isCurrent ? 'text-amber-400' : 'text-zinc-500'
                        }`}
                      >
                        Step 0{idx + 1}
                      </span>
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : isCurrent ? (
                        <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-zinc-700" />
                      )}
                    </div>

                    <div className="space-y-0.5 w-full">
                      <div className="text-xs font-bold text-white leading-tight">
                        {step.label}
                      </div>
                      <div className="text-[10px] text-amber-400/90 font-medium italic">
                        &ldquo;{step.themeTitle}&rdquo;
                      </div>
                    </div>

                    <div className="text-[10px] text-zinc-400 leading-tight pt-2 border-t border-zinc-800/60 mt-2 w-full">
                      {step.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Milestone Guidance & Details Panel */}
          <div
            data-testid="active-milestone-details"
            className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 sm:p-4 space-y-1.5 relative z-10"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Step 0{activeIndex + 1} Active
                </span>
                <span className="text-xs sm:text-sm font-bold text-white">
                  {STAGES[activeIndex].label}
                </span>
              </div>
              <span className="text-[11px] text-amber-400 font-medium italic">
                &ldquo;{STAGES[activeIndex].themeTitle}&rdquo;
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {STAGES[activeIndex].guidance}
            </p>
          </div>

          {updateError && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{updateError}</span>
            </div>
          )}

          {/* Quick Advancement Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-800/80 text-xs text-zinc-400 relative z-10">
            <span>
              Tap or click any stage above to view milestone guidance and update your order in real time.
            </span>

            {activeIndex < STAGES.length - 1 && (
              <Button
                type="button"
                size="sm"
                onClick={() => handleAdvanceStage(STAGES[activeIndex + 1].key)}
                disabled={updatingStage !== null}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold gap-1 text-xs cursor-pointer select-none touch-manipulation active:scale-[0.99] transition-all"
              >
                Advance to {STAGES[activeIndex + 1].label}
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 flex justify-end">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="text-xs border-amber-500/30 bg-amber-500/5 text-amber-400 hover:bg-amber-500/10 gap-1.5"
        >
          <Link href="#gear">
            <ClipboardCheck className="h-3.5 w-3.5 text-amber-500" />
            <span>Delivery Day Prep &amp; Essential Gear</span>
          </Link>
        </Button>
      </div>

      <RedditShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareParams={{
          modelName: localOrder.modelName,
          powertrainName: localOrder.powertrainName,
          trimName: localOrder.trimName,
          province: localOrder.province as any,
          orderDate: localOrder.orderDate,
          currentStage: localOrder.currentStage,
          status: localOrder.status as any,
        }}
      />
    </>
  );
}
