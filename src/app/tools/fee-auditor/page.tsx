import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { BackButton } from '@/components/common/back-button';
import { GuideDisclaimer } from '@/components/common/GuideDisclaimer';
import { DealerFeeAuditor } from '@/components/compliance/DealerFeeAuditor';
import { FeeRefusalWorksheet } from '@/components/delivery-prep/fee-refusal-worksheet';
import { ShieldCheck, Scale, ArrowRight, FileCheck2 } from 'lucide-react';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.toyotawaits.ca'),
  title: 'Toyota Dealer Fee Auditor Canada | AMVIC & OMVIC All-In Pricing Compliance',
  description:
    'Interactive dealer fee auditor for Canadian Toyota buyers. Audit quote line items (doc fees, etching, rust module, block heater, ECP) against Alberta AMVIC and Ontario OMVIC all-in pricing regulations.',
  keywords: [
    'toyota dealer fee auditor canada',
    'amvic all-in pricing violation',
    'omvic doc fee rules toyota',
    'toyota delivery fee refusal worksheet',
    'toyota ecp warranty wholesale baseline',
    'toyota finance office script',
    'toyota doc fee negotiation canada',
  ],
  alternates: {
    canonical: 'https://www.toyotawaits.ca/tools/fee-auditor',
  },
  openGraph: {
    title: 'Toyota Dealer Fee Auditor Canada | AMVIC & OMVIC All-In Pricing Compliance',
    description:
      'Interactive dealer fee auditor for Canadian Toyota buyers. Audit quote line items (doc fees, etching, rust module, block heater, ECP) against Alberta AMVIC and Ontario OMVIC all-in pricing regulations.',
    url: 'https://www.toyotawaits.ca/tools/fee-auditor',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toyota Dealer Fee Auditor Canada | AMVIC & OMVIC All-In Pricing Compliance',
    description:
      'Interactive dealer fee auditor for Canadian Toyota buyers. Audit quote line items (doc fees, etching, rust module, block heater, ECP) against Alberta AMVIC and Ontario OMVIC all-in pricing regulations.',
  },
};

export default function FeeAuditorPage() {
  return (
    <main className="min-h-screen pt-4 sm:pt-6 pb-16 bg-zinc-950 text-zinc-100">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 space-y-8">
        <BackButton className="mb-2" />

        {/* Page Hero */}
        <div className="border border-zinc-800 rounded-2xl bg-gradient-to-br from-zinc-900/90 to-zinc-950/80 p-5 sm:p-7 shadow-xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-amber-400">
              <Scale className="h-3.5 w-3.5" />
              <span>Provincial Compliance Engine</span>
              <span className="text-zinc-600">•</span>
              <span>AMVIC &amp; OMVIC Fee Auditor</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Toyota Dealer Fee &amp; Compliance Auditor
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
              Verify your Canadian Toyota dealership purchase agreement or bill of sale before signing.
              Audit documentation fees, etching packs, rust modules, block heaters, and ECP extended warranty against provincial all-in pricing statutes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-zinc-800/80 text-xs">
            <Link
              href="/delivery-prep"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Delivery Prep &amp; Status Tracking</span>
            </Link>
            <Link
              href="/guides/toyota-ecp-warranty-guide"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-semibold transition-colors"
            >
              <FileCheck2 className="h-3.5 w-3.5" />
              <span>Toyota ECP Warranty Guide</span>
            </Link>
          </div>
        </div>

        {/* Interactive Auditor Component */}
        <DealerFeeAuditor showTitle={false} />

        {/* Printable Inspection Checklist & Fee Refusal Worksheet */}
        <FeeRefusalWorksheet />

        {/* Legal Disclaimer */}
        <GuideDisclaimer />
      </div>
    </main>
  );
}
