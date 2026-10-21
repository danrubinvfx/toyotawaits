'use client';

import React from 'react';
import { KOFI_URL } from '@/components/common/kofi-button';
import { trackAffiliateClick } from '@/lib/gear';

export interface DonationToastProps {
  isOpen?: boolean;
  onDismiss: () => void;
  donationUrl?: string;
  modelContext?: string | null;
}

export function DonationToast({
  isOpen = true,
  onDismiss,
  donationUrl = KOFI_URL,
  modelContext = null,
}: DonationToastProps) {
  if (!isOpen) return null;

  const handleSupportClick = () => {
    trackAffiliateClick({
      accessory_id: 'kofi-coffee-support',
      placement: 'donation_toast',
      model_context: modelContext,
      target_url: donationUrl,
    });
  };

  return (
    <aside
      data-testid="donation-toast"
      role="region"
      aria-label="Support ToyotaWaits"
      className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 max-w-sm rounded-xl border border-amber-500/30 bg-zinc-950/95 p-4 shadow-xl backdrop-blur-md transition-all duration-200"
    >
      <div className="text-sm font-semibold text-white flex items-center gap-2">
        <span>☕ Finding this useful?</span>
      </div>
      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
        ToyotaWaits is free and ad-free. If this tracker helps you find your car or skip the wait, consider chipping in for server and scraping costs.
      </p>
      <div className="mt-3 flex items-center gap-2">
        <a
          href={donationUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="donation-toast-cta"
          onClick={handleSupportClick}
          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
        >
          ☕ Buy a Coffee
        </a>
        <button
          type="button"
          data-testid="donation-toast-dismiss"
          onClick={onDismiss}
          className="px-2.5 py-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          Maybe later
        </button>
      </div>
    </aside>
  );
}
