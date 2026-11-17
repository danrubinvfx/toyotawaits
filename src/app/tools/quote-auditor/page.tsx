import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { QuoteAuditorClient } from '@/components/compliance/QuoteAuditorClient';
import { DealerScorecard } from '@/components/transparency/DealerScorecard';
import { getDealerScorecards } from '@/lib/data/dealer-scorecard';

export const dynamic = 'force-dynamic';
export const { instant } = { instant: false };

export const metadata: Metadata = {
  title: 'Toyota Dealer Quote Auditor Canada | Check AMVIC, OMVIC & VSA Fees',
  description:
    'Audit your Toyota dealership bill of sale or quote. Strip doc fees, $800 block heaters, and unnecessary protection packages before signing.',
  alternates: {
    canonical: 'https://www.toyotawaits.ca/tools/quote-auditor',
  },
  openGraph: {
    title: 'Toyota Dealer Quote Auditor Canada | Check AMVIC, OMVIC & VSA Fees',
    description:
      'Audit your Toyota dealership bill of sale or quote. Strip doc fees, $800 block heaters, and unnecessary protection packages before signing.',
    url: 'https://www.toyotawaits.ca/tools/quote-auditor',
    type: 'website',
  },
};

export default async function QuoteAuditorPage() {
  const dealerEntries = await getDealerScorecards('CA');

  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
      <QuoteAuditorClient>
        <DealerScorecard entries={dealerEntries} />
      </QuoteAuditorClient>
    </Suspense>
  );
}
