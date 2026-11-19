import React, { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';
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
        <section
          aria-label="Toyota ECP Extended Warranty Audit Benchmark"
          className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-zinc-900/90 to-zinc-950 p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-0.5 text-xs font-bold text-amber-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>ECP Extended Warranty Benchmark</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
              Flagged an ECP Extended Warranty on Your Quote?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Before paying $2,800–$3,200 CAD at the finance desk, compare Toyota&apos;s factory 8-year/160,000 km hybrid &amp; 10-year/240,000 km battery coverage against ECP wholesale pricing ($1,900–$2,100 CAD) and the 31-day post-delivery rule.
            </p>
          </div>
          <Link
            href="/guides/toyota-ecp-warranty-guide"
            className="shrink-0 inline-flex items-center justify-center rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2.5 text-xs font-bold text-zinc-950 shadow-md transition-colors"
          >
            Compare Toyota Warranty &amp; ECP Pricing →
          </Link>
        </section>
        <DealerScorecard entries={dealerEntries} />
      </QuoteAuditorClient>
    </Suspense>
  );
}
