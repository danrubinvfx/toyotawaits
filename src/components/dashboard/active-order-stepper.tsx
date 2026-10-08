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
} from 'lucide-react';
import { SubmissionStage } from '@/lib/types/contracts';
import { generateCalendarReminder, downloadCalendarEvent } from '@/lib/utils/calendar';
import { RedditShareModal } from '@/components/modals/reddit-share-modal';

const STAGES: Array<{
  key: SubmissionStage;
  label: string;
  themeTitle: string;
  description: string;
}> = [
  {
    key: 'deposit_placed',
    label: 'Deposit Placed',
    themeTitle: 'Pacing the Floor',
    description: 'Deposit recorded on dealer waitlist queue.',
  },
  {
    key: 'allocation_confirmed',
    label: 'Allocation Confirmed',
    themeTitle: 'Build Sheet Issued',
    description: 'Factory allocation slot and temp VIN secured.',
  },
  {
    key: 'freight_transit',
    label: 'Freight Transit',
    themeTitle: 'Between Tokyo and Vancouver',
    description: 'Vessel ocean voyage or rail carrier in motion.',
  },
  {
    key: 'arrived_at_dealer',
    label: 'Arrived at Dealer',
    themeTitle: 'On the Dealer Compound',
    description: 'Carrier unloaded; Pre-Delivery Inspection underway.',
  },
  {
    key: 'delivered',
    label: 'Delivered',
    themeTitle: 'Drove Away in a Blue Valentine',
    description: 'Keys in hand, odometer rolling.',
  },
];

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
  const [updatingStage, setUpdatingStage] = useState<SubmissionStage | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Check for saved local submission in browser
      const saved = localStorage.getItem('toyotawait_pending_submission');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.id && parsed.editKey) {
          setLocalOrder({
            id: parsed.id,
            editKey: parsed.editKey,
            modelName: parsed.modelName || 'RAV4',
            powertrainName: parsed.powertrainName || 'Prime / Plug-in Hybrid',
            trimName: parsed.trimName || 'XSE AWD',
            province: parsed.province || 'BC',
            orderDate: parsed.orderDate || new Date().toISOString().split('T')[0],
            currentStage: parsed.currentStage || (parsed.status === 'delivered' ? 'delivered' : 'deposit_placed'),
            status: parsed.status || 'pending',
          });
        }
      }
    } catch {
      // Ignore parse errors from localStorage
    }
  }, []);

  if (!localOrder) {
    return null;
  }

  const currentStageIndex = STAGES.findIndex((s) => s.key === localOrder.currentStage);
  const activeIndex = currentStageIndex >= 0 ? currentStageIndex : 0;

  const handleAdvanceStage = async (nextStage: SubmissionStage) => {
    setUpdatingStage(nextStage);
    setUpdateError(null);

    try {
      const isDelivered = nextStage === 'delivered';
      const today = new Date().toISOString().split('T')[0];

      const res = await fetch(`/api/submissions/${localOrder.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-edit-key': localOrder.editKey,
        },
        body: JSON.stringify({
          stage: nextStage,
          status: isDelivered ? 'delivered' : 'pending',
          deliveryDate: isDelivered ? today : undefined,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson?.error?.message || 'Failed to update milestone.');
      }

      // Update local state and localStorage
      const updatedOrder = {
        ...localOrder,
        currentStage: nextStage,
        status: isDelivered ? 'delivered' : localOrder.status,
      };
      setLocalOrder(updatedOrder);
      localStorage.setItem('toyotawait_pending_submission', JSON.stringify(updatedOrder));
    } catch (err: any) {
      setUpdateError(err.message || 'Milestone update failed.');
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
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />
        
        <CardHeader className="p-4 sm:p-6 pb-3 space-y-2">
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

        <CardContent className="p-4 sm:p-6 pt-2 space-y-6">
          {/* 5-Step Visual Stepper */}
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-zinc-800 z-0" />
            <div
              className="hidden md:block absolute top-1/2 left-6 -translate-y-1/2 h-0.5 bg-amber-500 transition-all duration-500 z-0"
              style={{ width: `${(activeIndex / (STAGES.length - 1)) * 100}%` }}
            />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-2 relative z-10">
              {STAGES.map((step, idx) => {
                const isCompleted = idx < activeIndex;
                const isCurrent = idx === activeIndex;
                const isFuture = idx > activeIndex;

                return (
                  <div
                    key={step.key}
                    onClick={() => {
                      if (!isCurrent) handleAdvanceStage(step.key);
                    }}
                    className={`rounded-xl p-3 border transition-all cursor-pointer flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-amber-950/30 border-amber-500 shadow-md shadow-amber-500/10'
                        : isCompleted
                        ? 'bg-zinc-900/90 border-emerald-900/60 hover:border-zinc-700'
                        : 'bg-zinc-900/40 border-zinc-850 hover:border-zinc-700 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
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

                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-white leading-tight">
                        {step.label}
                      </div>
                      <div className="text-[10px] text-amber-400/90 font-medium italic">
                        &ldquo;{step.themeTitle}&rdquo;
                      </div>
                    </div>

                    <div className="text-[10px] text-zinc-400 leading-tight pt-2 border-t border-zinc-800/60 mt-2">
                      {step.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {updateError && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{updateError}</span>
            </div>
          )}

          {/* Quick Advancement Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-800/80 text-xs text-zinc-400">
            <span>
              Click any stage above to update your order in real time.
            </span>

            {activeIndex < STAGES.length - 1 && (
              <Button
                size="sm"
                onClick={() => handleAdvanceStage(STAGES[activeIndex + 1].key)}
                disabled={updatingStage !== null}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold gap-1 text-xs"
              >
                Advance to {STAGES[activeIndex + 1].label}
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

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
