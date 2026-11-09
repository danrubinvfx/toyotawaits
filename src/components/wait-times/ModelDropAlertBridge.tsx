'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { InventoryAlertModal } from '@/components/discovery/InventoryAlertModal';

export interface ModelDropAlertBridgeProps {
  modelSlug: string;
  modelName: string;
  estimatedWaitMonths?: number | string;
  className?: string;
}

export function ModelDropAlertBridge({
  modelSlug,
  modelName,
  estimatedWaitMonths,
  className = '',
}: ModelDropAlertBridgeProps) {
  const [isOpen, setIsOpen] = useState(false);

  const waitTimeDisplay = estimatedWaitMonths ? `${estimatedWaitMonths} months` : 'in line';

  return (
    <>
      <section
        aria-label={`Skip the Queue - ${modelName} Allocation Radar`}
        data-testid="model-drop-alert-bridge"
        className={`rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-zinc-900 to-zinc-950 p-5 sm:p-6 my-6 shadow-xl text-white ${className}`}
      >
        <div className="flex flex-col gap-4">
          {/* Eyebrow */}
          <div className="flex items-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Bell className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>⚡ SKIP THE QUEUE • ALLOCATION RADAR</span>
            </span>
          </div>

          {/* Headline & Subtitle */}
          <div className="space-y-1.5">
            <h2 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-white">
              Don&apos;t want to wait {waitTimeDisplay} for a {modelName}?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal max-w-2xl">
              Dealerships receive unreserved allocations and order cancellations every week across Canadian lots. Get notified before they hit public dealer listings.
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              data-testid="drop-alert-primary-button"
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all active:scale-95 shadow-md flex items-center justify-center cursor-pointer"
            >
              🔔 Set Free 30-Day Drop Alert
            </button>

            <Link
              href={`/inventory?model=${encodeURIComponent(modelSlug)}`}
              data-testid="drop-alert-secondary-link"
              className="border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all text-center inline-flex items-center justify-center cursor-pointer"
            >
              Browse Live {modelName} Stock ↗
            </Link>
          </div>
        </div>
      </section>

      {isOpen && (
        <InventoryAlertModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          initialModel={modelSlug}
        />
      )}
    </>
  );
}
