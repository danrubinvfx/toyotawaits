'use client';

import React from 'react';
import { useMarket } from '@/context/MarketContext';

export function MarketAssociateDisclaimer() {
  const { isUs } = useMarket();
  return (
    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 italic">
      Outbound links route through our privacy-safe proxy. As an Amazon Associate, {isUs ? 'toyotawaits.com' : 'toyotawaits.ca'} earns from qualifying purchases at no extra cost to you.
    </p>
  );
}
