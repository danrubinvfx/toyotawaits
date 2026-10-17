import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ShieldAlert,
  Scale,
  DollarSign,
  FileText,
  AlertTriangle,
  Building2,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Legal Disclaimers, Non-Affiliation & Pricing Disclosures | ToyotaWaits',
  description:
    'Legal notices, nominative fair use disclaimers, crowdsourced wait-time estimations, and US/Canadian dealer pricing regulations (OMVIC/VSA & ADM).',
  alternates: {
    canonical: 'https://www.toyotawaits.ca/legal',
  },
};

export default function LegalPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16 space-y-10">
      {/* Page Header */}
      <div className="space-y-4 text-center sm:text-left">
        <BackButton className="mb-4" />

        <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
          <Badge className="bg-amber-600 hover:bg-amber-700 text-white gap-1 px-2.5">
            <Scale className="h-3.5 w-3.5" /> Legal &amp; Regulatory Disclosures
          </Badge>
          <Badge variant="outline" className="border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
            Dual-Market: 🇨🇦 Canada &amp; 🇺🇸 United States
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
          Legal Terms, Fair Use &amp; Consumer Pricing Disclosures
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
          ToyotaWaits is an independent, open-data community initiative designed to bring transparency to vehicle delivery timelines, allocations, and dealer pricing across Canada and the United States.
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader className="space-y-1 pb-2">
            <Building2 className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-base font-bold">Independent Project</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-zinc-500 leading-relaxed">
            Not affiliated with, endorsed by, or sponsored by Toyota Motor Corporation, Toyota Canada Inc., or Toyota Motor Sales, U.S.A., Inc.
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader className="space-y-1 pb-2">
            <DollarSign className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-base font-bold">Dual-Market Pricing</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-zinc-500 leading-relaxed">
            Clear distinction between Canadian provincial all-in pricing rules (OMVIC/AMVIC/VSA) and U.S. dealer market adjustments (ADM).
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader className="space-y-1 pb-2">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-base font-bold">Estimates Only</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-zinc-500 leading-relaxed">
            All wait times and allocation benchmarks are crowdsourced statistical estimates, not guaranteed delivery dates or manufacturer commitments.
          </CardContent>
        </Card>
      </div>

      {/* Detailed Legal Sections */}
      <div className="space-y-8 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
        {/* Section 1: Non-Affiliation & Fair Use */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-600" />
            1. Independent Community Project &amp; Nominative Fair Use
          </h2>
          <p>
            ToyotaWaits (accessible via <code>toyotawaits.ca</code> and <code>toyotawaits.com</code>) is an independent, grassroots community research tool and public data tracker.
          </p>
          <p>
            ToyotaWaits is <strong>NOT</strong> affiliated with, associated with, authorized by, endorsed by, or in any way officially connected with:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-600 dark:text-zinc-400">
            <li><strong>Toyota Motor Corporation</strong> (Japan)</li>
            <li><strong>Toyota Canada Inc.</strong> (Canada)</li>
            <li><strong>Toyota Motor Sales, U.S.A., Inc.</strong> / Toyota Motor North America, Inc. (United States)</li>
            <li>Any affiliated distributor, regional marketing council, or authorized franchise dealership.</li>
          </ul>
          <p className="text-xs text-zinc-500">
            The marks &ldquo;Toyota&rdquo;, &ldquo;RAV4&rdquo;, &ldquo;Sienna&rdquo;, &ldquo;Grand Highlander&rdquo;, &ldquo;Land Cruiser&rdquo;, &ldquo;Prius&rdquo;, &ldquo;Tacoma&rdquo;, &ldquo;Prime&rdquo;, &ldquo;Hybrid Synergy Drive&rdquo;, and related vehicle model names and logos are registered trademarks of Toyota Motor Corporation or its respective subsidiaries. All trademarks, service marks, and trade names used on this website are for nominative identification purposes only under the nominative fair use doctrine of trademark law.
          </p>
        </section>

        {/* Section 2: Canadian Market Pricing Regulations */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
            <Scale className="h-5 w-5 text-red-600" />
            2. Canadian Consumer Pricing &amp; Provincial Regulatory Disclosures
          </h2>
          <p>
            Automotive retail pricing and dealer transactions in Canada are regulated primarily at the provincial level by delegated administrative authorities:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-1">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">Ontario (OMVIC):</span>
              <p className="text-zinc-500">
                Under the Ontario Motor Vehicle Dealers Act (MVDA), registered dealers must provide <em>all-in price advertising</em>. An advertised vehicle price must include freight, PDI, air conditioning levy, and documentation fees; only HST and licensing may be added.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-1">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">British Columbia (VSA):</span>
              <p className="text-zinc-500">
                The Vehicle Sales Authority of British Columbia enforces transparent pricing rules. Dealers cannot charge mandatory accessory fees or prep packages above an agreed price unless consented to by the consumer in writing.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-1">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">Alberta (AMVIC):</span>
              <p className="text-zinc-500">
                The Alberta Motor Vehicle Industry Council mandates that the advertised price of a vehicle must be the total price a consumer can pay, excluding only GST and licensing.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-1">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">Quebec (OPC):</span>
              <p className="text-zinc-500">
                Under the Consumer Protection Act enforced by the Office de la protection du consommateur, merchant advertisements must display the all-inclusive price before sales tax.
              </p>
            </div>
          </div>
          <p className="text-xs text-zinc-500">
            Canadian crowd-submitted data helps prospective buyers identify dealers honoring factory MSRP and document compliance with provincial all-in pricing rules.
          </p>
        </section>

        {/* Section 3: US Market Pricing & ADM Disclosures */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-600" />
            3. United States Market Pricing &amp; Dealer Markup (ADM) Disclosures
          </h2>
          <p>
            In the United States automotive market, pricing operates under different federal and state regulatory frameworks:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>Monroney Window Sticker (MSRP):</strong> The Automobile Information Disclosure Act of 1958 requires the manufacturer&apos;s suggested retail price (MSRP) to be displayed on the Monroney window sticker. MSRP is a <em>recommendation</em> by the manufacturer and is not legally binding on franchised retail dealerships.
            </li>
            <li>
              <strong>Adjusted Dealer Markup (ADM):</strong> Independent U.S. dealerships may legally sell vehicles at, below, or above MSRP. When market demand exceeds allocation availability, dealers may attach secondary addendum stickers reflecting ADM, market adjustments, or mandatory dealer-installed options (DIO).
            </li>
            <li>
              <strong>Port-Installed Options (PIO) vs Dealer Options (DIO):</strong> PIO items (such as roof racks or all-weather floor liners added at regional distribution ports) appear directly on the official Monroney sticker, whereas DIO items are added at the local dealer facility.
            </li>
            <li>
              <strong>Dealer Documentation Fees (Doc Fees):</strong> Depending on the state, doc fees may be legally capped (e.g. California ~$85) or entirely unregulated (e.g. Florida, where doc fees can exceed $1,000).
            </li>
          </ul>
          <p className="text-xs text-zinc-500">
            ToyotaWaits tracks real-world U.S. consumer submissions to document dealer markup trends, allocation waitlists, and identify dealerships committed to selling at MSRP with zero ADM.
          </p>
        </section>

        {/* Section 4: Crowdsourced Estimates Notice */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            4. Crowdsourced Wait Times &amp; Not Financial/Legal Advice
          </h2>
          <p>
            All delivery wait times, baseline estimates, allocation distributions, and pricing metrics presented on ToyotaWaits are crowdsourced from self-reported consumer submissions and historical dealer benchmarks.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-600 dark:text-zinc-400">
            <li><strong>Statistical Estimates:</strong> Wait times are modeled statistically (median, 25th percentile, 75th percentile) and do NOT constitute guaranteed delivery dates, warranties, or manufacturer delivery promises.</li>
            <li><strong>Supply Chain Volatility:</strong> Actual delivery timelines are subject to port logistics, rail transport, allocation batch cycles, dealer queue management, and model trim availability.</li>
            <li><strong>No Professional Counsel:</strong> Information provided on this site does not constitute legal, tax, or financial advice. Buyers should independently review all purchase agreements, financing contracts, and bills of sale prior to executing a vehicle transaction.</li>
          </ul>
        </section>

        {/* Section 5: Monetization & Affiliate Transparency */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            5. Monetization &amp; Affiliate Disclosure
          </h2>
          <p>
            ToyotaWaits is an independent, community-supported resource. To keep our server infrastructure and databases running without paywalls or invasive banner advertising:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>Amazon Associates Program:</strong> ToyotaWaits participates in the Amazon Services LLC Associates Program and Amazon Associates Canada. When visitors purchase vehicle gear, floor mats, or accessories via curated recommendation links, we may earn a small referral commission at no additional cost to you.
            </li>
            <li>
              <strong>Community Donations:</strong> Users may voluntarily support hosting costs via <a href="https://ko-fi.com/toyotawaits" target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-amber-400 underline font-medium">Ko-fi donations</a>.
            </li>
            <li>
              <strong>Zero Paid Dealer Modifications:</strong> We do not accept payment from car dealerships or manufacturers to alter wait times, hide ADM reports, or promote specific inventories.
            </li>
          </ul>
        </section>

        {/* Section 6: Privacy Charter Reference */}
        <section className="space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-6">
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-zinc-600" />
            6. Privacy &amp; Data Rights
          </h2>
          <p>
            Order submissions on ToyotaWaits are strictly anonymous and require zero personally identifiable information (zero PII). For complete details on cryptographic edit keys, RAM-based anti-abuse defenses, and our zero-tracking architecture, please review our{' '}
            <Link href="/privacy" className="text-amber-600 dark:text-amber-400 underline font-semibold">
              Zero-PII Privacy Charter →
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
