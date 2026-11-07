'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Zap, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InventoryAlertModal } from '@/components/discovery/InventoryAlertModal';

export interface ModelInventoryBridgeProps {
  modelSlug: string;
  modelName: string;
  className?: string;
}

export function ModelInventoryBridge({
  modelSlug,
  modelName,
  className = '',
}: ModelInventoryBridgeProps) {
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const inventoryHref = `/inventory?model=${encodeURIComponent(modelSlug)}`;

  return (
    <>
      <section
        aria-label={`Live ${modelName} Allocation & Inventory Bridge`}
        data-testid="model-inventory-bridge"
        className={`rounded-2xl border-2 border-amber-500/50 bg-gradient-to-br from-zinc-900 via-zinc-900 to-black p-4 sm:p-5 text-zinc-100 shadow-lg relative overflow-hidden ${className}`}
      >
        {/* Subtle decorative glow */}
        <div
          className="absolute -right-12 -bottom-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 sm:space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-300">
              <Zap className="h-4 w-4 fill-amber-300" aria-hidden="true" />
              <span>⚡ Skip the wait?</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
              Check observed dealer allocations and incoming transit units before waiting in queue.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <Button
              asChild
              size="sm"
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm h-10 px-4 rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
            >
              <Link href={inventoryHref} data-testid="bridge-inventory-link">
                <span>View Live {modelName} Stock ↗</span>
              </Link>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAlertModalOpen(true)}
              data-testid="bridge-alert-button"
              className="border-zinc-700 hover:border-zinc-500 bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 font-semibold text-xs sm:text-sm h-10 px-3.5 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
            >
              <Bell className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
              <span>Set Drop Alert</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Drop Alert Subscription Modal */}
      {isAlertModalOpen && (
        <InventoryAlertModal
          isOpen={isAlertModalOpen}
          onClose={() => setIsAlertModalOpen(false)}
          initialModel={modelName}
        />
      )}
    </>
  );
}
