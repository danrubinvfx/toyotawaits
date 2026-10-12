'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StoredSubmission {
  id: string;
  editKey?: string;
  edit_key?: string;
  editToken?: string;
  model?: string;
  modelName?: string;
  status?: string;
  submittedAt?: string;
}

export interface PostEstimateSubmissionCtaProps {
  className?: string;
}

export function PostEstimateSubmissionCta({ className }: PostEstimateSubmissionCtaProps) {
  const [submission, setSubmission] = useState<StoredSubmission | null>(null);
  const [activeSelection, setActiveSelection] = useState<{
    model?: string;
    powertrain?: string;
    province?: string;
    orderDate?: string;
  }>({});

  useEffect(() => {
    const handleModelSync = (e: Event) => {
      const customEvent = e as CustomEvent<{
        model?: string;
        powertrain?: string;
        province?: string;
        orderDate?: string;
        depositDate?: string;
      }>;
      if (customEvent.detail) {
        setActiveSelection((prev) => ({
          ...prev,
          model: customEvent.detail.model || prev.model,
          powertrain: customEvent.detail.powertrain || prev.powertrain,
          province: customEvent.detail.province || prev.province,
          orderDate: customEvent.detail.orderDate || customEvent.detail.depositDate || prev.orderDate,
        }));
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('toyotawait:model-sync', handleModelSync);
      return () => {
        window.removeEventListener('toyotawait:model-sync', handleModelSync);
      };
    }
  }, []);

  useEffect(() => {
    const checkSubmission = () => {
      try {
        const raw = localStorage.getItem('toyotawaits_submission');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && (parsed.id || parsed.editToken)) {
            setSubmission(parsed);
            return;
          }
        }
        const pendingRaw = localStorage.getItem('toyotawait_pending_submission');
        if (pendingRaw) {
          const parsed = JSON.parse(pendingRaw);
          if (parsed && (parsed.id || parsed.editToken)) {
            setSubmission(parsed);
            return;
          }
        }
        const mySubs = localStorage.getItem('toyotawait_my_submissions');
        if (mySubs) {
          const parsedList = JSON.parse(mySubs);
          if (Array.isArray(parsedList) && parsedList.length > 0) {
            setSubmission(parsedList[0]);
            return;
          }
        }
        setSubmission(null);
      } catch {
        // Fallback for SSR / disabled localStorage
      }
    };

    checkSubmission();

    if (typeof window !== 'undefined') {
      window.addEventListener('toyotawaits:submission-updated', checkSubmission);
      window.addEventListener('storage', checkSubmission);
      return () => {
        window.removeEventListener('toyotawaits:submission-updated', checkSubmission);
        window.removeEventListener('storage', checkSubmission);
      };
    }
  }, []);

  const buildSubmitHref = () => {
    if (submission) {
      return `/edit/${submission.id || submission.editToken}?key=${encodeURIComponent(
        submission.editKey || submission.edit_key || ''
      )}`;
    }
    const params = new URLSearchParams();
    if (activeSelection.model) params.set('model', activeSelection.model);
    if (activeSelection.powertrain) params.set('powertrain', activeSelection.powertrain);
    if (activeSelection.province) params.set('province', activeSelection.province);
    if (activeSelection.orderDate) params.set('orderDate', activeSelection.orderDate);
    const qs = params.toString();
    return qs ? `/submit?${qs}` : '/submit';
  };

  const editHref = buildSubmitHref();

  const modelDisplay = submission?.model || submission?.modelName || 'vehicle';

  return (
    <div
      data-testid="post-estimate-submission-cta"
      className={cn(
        'w-full bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/30 rounded-2xl p-4 my-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg shadow-amber-950/20',
        className
      )}
    >
      <div className="space-y-1 text-center sm:text-left min-w-0">
        <h3 className="text-sm sm:text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2 flex-wrap">
          {submission ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Tracking your {modelDisplay} order</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Active Order
              </span>
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 text-amber-400 shrink-0" />
              <span>Waiting on a delivery or picked up recently?</span>
            </>
          )}
        </h3>
        <p className="text-xs text-neutral-400">
          {submission
            ? 'Update your delivery milestone or mark as delivered to help the Canadian community.'
            : 'Help keep Canadian wait times accurate. 100% anonymous, takes 30s.'}
        </p>
      </div>

      <Link
        href={editHref}
        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs sm:text-sm shadow-md transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer"
      >
        {submission ? (
          <>
            <span>Update Status / Mark Delivered</span>
            <ArrowRight className="h-3.5 w-3.5 text-black" />
          </>
        ) : (
          <span>+ Add Your Wait Time</span>
        )}
      </Link>
    </div>
  );
}

export default PostEstimateSubmissionCta;
