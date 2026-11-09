'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  DollarSign,
  Clock,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Calculator,
  ExternalLink,
  Info,
  Car,
  FileText,
  BadgeAlert,
  Scale,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { buildAmazonAffiliateUrl } from '@/lib/gear/affiliate';

export interface DealerFeeItem {
  id: string;
  name: string;
  costRange: string;
  costValue: number; // for interactive savings tally
  classification: 'mandatory' | 'negotiable';
  statusLabel: string;
  authority: string;
  description: string;
  defenseAction: string;
}

export const CANADIAN_DEALER_FEES: DealerFeeItem[] = [
  // Mandatory / Statutory
  {
    id: 'freight-pdi',
    name: 'Freight & PDI',
    costRange: '~$1,930 – standard across Canada',
    costValue: 1930,
    classification: 'mandatory',
    statusLabel: 'Mandatory / Statutory',
    authority: 'Toyota Canada Standardized',
    description:
      'Factory freight shipping (via CN or CPKC railcar and auto-hauler transport truck) plus mandatory technician Pre-Delivery Inspection and fluid top-off.',
    defenseAction:
      'Legitimate factory charge set directly on the manufacturer window sticker. Non-negotiable.',
  },
  {
    id: 'air-tax',
    name: 'Air Tax',
    costRange: '$100 federal',
    costValue: 100,
    classification: 'mandatory',
    statusLabel: 'Mandatory / Statutory',
    authority: 'Government of Canada (Excise Tax Act)',
    description:
      'Federal excise tax levied under the Excise Tax Act on all air-conditioned passenger motor vehicles imported or manufactured in Canada.',
    defenseAction:
      'Statutory federal tax mandated by the Canada Revenue Agency. Non-negotiable.',
  },
  {
    id: 'tire-levy',
    name: 'Tire Levy',
    costRange: '$20–$30 provincial',
    costValue: 25,
    classification: 'mandatory',
    statusLabel: 'Mandatory / Statutory',
    authority: 'Provincial Stewardship (OTS / Tire Stewardship BC / ARMA)',
    description:
      'Provincial environmental recycling levy (typically $4–$5 per tire plus spare) funding scrap tire management programs.',
    defenseAction:
      'Mandatory provincial environmental fee remit to provincial government agencies. Non-negotiable.',
  },
  {
    id: 'council-levy',
    name: 'AMVIC / OMVIC / VSA council levies',
    costRange: '$10–$12 provincial',
    costValue: 10,
    classification: 'mandatory',
    statusLabel: 'Mandatory / Statutory',
    authority: 'Provincial Regulators (OMVIC / AMVIC / VSA)',
    description:
      'Statutory regulatory oversight levy mandated by provincial auto regulators ($10 OMVIC in ON, $6.25 AMVIC in AB, $10 VSA in BC) supporting consumer compensation funds.',
    defenseAction:
      'Statutory consumer protection fee mandated by provincial legislation. Non-negotiable.',
  },

  // 100% Negotiable Dealer Margin (Push to remove)
  {
    id: 'doc-fee',
    name: 'Doc Fee / Admin Fee',
    costRange: '$599–$999',
    costValue: 799,
    classification: 'negotiable',
    statusLabel: '100% Negotiable Dealer Margin (Push to remove)',
    authority: 'Dealership Discretionary Markup',
    description:
      'Internal dealership processing, clerk overhead, and file archiving fees disguised as mandatory closing costs.',
    defenseAction:
      'Explain AMVIC/OMVIC "All-in pricing" rules for advertised inventory: Dealers are legally forbidden from charging any fee above the advertised or agreed price (except HST/GST and tire levy). Demand its total removal or counter-deduct the equivalent dollar amount from the vehicle price.',
  },
  {
    id: 'block-heater',
    name: 'Block Heater',
    costRange: '$700–$900',
    costValue: 800,
    classification: 'negotiable',
    statusLabel: '100% Negotiable Dealer Margin (Push to remove)',
    authority: 'Dealer Installed Accessory',
    description:
      'Engine block heating cartridge installed prior to delivery on Canadian winter compound allocations.',
    defenseAction:
      'OEM part installed is ~$300–$350. Dealerships routinely charge $700–$900 CAD for a 45-minute install. Demand removal of the fee, install it at an independent mechanic for $350, or demand dealer parts counter wholesale pricing.',
  },
  {
    id: 'protection-packages',
    name: 'Protection Packages',
    costRange: '$1,000–$2,000',
    costValue: 1500,
    classification: 'negotiable',
    statusLabel: '100% Negotiable Dealer Margin (Push to remove)',
    authority: 'Dealership Business Office Bundle',
    description:
      '"Rust inhibitor modules" (ineffective on unibodies) and partial paint film. Often bundled with fabric spray or key fob insurance.',
    defenseAction:
      'Decline completely. Electronic "rust inhibitor modules" are scientifically ineffective on unibodies manufactured with factory electro-galvanized zinc steel. Partial paint protection film (partial 12-inch hood strip) is notoriously marked up 300% over certified pro PPF detailers.',
  },
  {
    id: 'etching-packs',
    name: 'Etching / Security Packs',
    costRange: '$399–$699',
    costValue: 499,
    classification: 'negotiable',
    statusLabel: '100% Negotiable Dealer Margin (Push to remove)',
    authority: 'Dealership F&I Profit Center',
    description:
      'Window glass VIN etching, catalytic converter spray, or door jamb micro-dots presented as mandatory security.',
    defenseAction:
      'Pure profit add-ons. Canadian insurance underwriters do not offer material premium discounts for window etching, and thieves ignore etched glass. Demand this line item be struck off your final bill of sale before signing.',
  },
];

export function DealerFeeAudit() {
  const [filter, setFilter] = useState<'all' | 'mandatory' | 'negotiable'>('all');
  const [checkedFees, setCheckedFees] = useState<Record<string, boolean>>({
    'doc-fee': true,
    'block-heater': true,
    'protection-packages': true,
    'etching-packs': true,
  });

  const filteredFees = CANADIAN_DEALER_FEES.filter((fee) => {
    if (filter === 'all') return true;
    return fee.classification === filter;
  });

  const toggleFee = (id: string) => {
    setCheckedFees((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Calculate live user potential savings from checked negotiable fees + ECP markup ($800)
  const negotiableTotal = Object.entries(checkedFees).reduce((acc, [id, checked]) => {
    if (!checked) return acc;
    const item = CANADIAN_DEALER_FEES.find((f) => f.id === id);
    return acc + (item?.costValue || 0);
  }, 0);

  // ECP typical dealer retail ($2,600) vs wholesale ($1,800) markup = $800
  const estimatedTotalSavings = negotiableTotal + 800;

  // Day-1 Protection Gear URLs routed via buildAmazonAffiliateUrl (tag toyotawaits-20 for CA)
  const tuxmatUrl = buildAmazonAffiliateUrl('TuxMat Toyota RAV4 custom all weather floor mats', 'CA');
  const fitcamxUrl = buildAmazonAffiliateUrl('Fitcamx dash cam Toyota OEM 4K', 'CA');
  const spigenUrl = buildAmazonAffiliateUrl('Spigen screen protector Toyota tempered glass matte 9H', 'CA');

  return (
    <section
      id="dealer-fee-audit"
      data-testid="dealer-fee-audit-section"
      className="space-y-6 pt-4"
      aria-labelledby="dealer-fee-audit-heading"
    >
      {/* 1. Header & Context */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-0.5 text-xs font-semibold text-rose-400">
          <BadgeAlert className="h-3.5 w-3.5" />
          <span>Finance Office Defense &amp; Dealer Fee Audit</span>
          <span className="text-zinc-600">•</span>
          <span>Canadian Consumer Bill of Sale Audit</span>
        </div>
        <h2
          id="dealer-fee-audit-heading"
          className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2"
        >
          <DollarSign className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>Canadian Dealer Fees: Mandatory vs. Negotiable</span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-3xl">
          When your vehicle arrives at Status G, the finance office will present your final bill of sale.
          Distinguish between legitimate statutory levies and 100% negotiable dealer margin packs before signing or transferring funds.
        </p>
      </div>

      {/* 2. Interactive Fee Filter Tabs & Savings Tally */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-zinc-100 text-zinc-950'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              All Canadian Fees (8)
            </button>
            <button
              onClick={() => setFilter('mandatory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                filter === 'mandatory'
                  ? 'bg-emerald-500 text-zinc-950'
                  : 'bg-zinc-900 text-emerald-400 hover:text-emerald-300 border border-emerald-500/20'
              }`}
            >
              <CheckCircle2 className="h-3 w-3" />
              <span>Mandatory / Statutory (4)</span>
            </button>
            <button
              onClick={() => setFilter('negotiable')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                filter === 'negotiable'
                  ? 'bg-rose-500 text-white'
                  : 'bg-zinc-900 text-rose-400 hover:text-rose-300 border border-rose-500/20'
              }`}
            >
              <XCircle className="h-3 w-3" />
              <span>100% Negotiable Margin (4)</span>
            </button>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold shrink-0">
            <Calculator className="h-3.5 w-3.5" />
            <span>Audit Tally: Up to ~${estimatedTotalSavings.toLocaleString()} CAD Saved</span>
          </div>
        </div>

        {/* Structured Table */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-left text-xs border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-semibold bg-zinc-900/40">
                <th className="py-3 px-3">Fee Name &amp; Authority</th>
                <th className="py-3 px-3">Typical Cost</th>
                <th className="py-3 px-3">Classification</th>
                <th className="py-3 px-3">Buyer Action / Legal Defense</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredFees.map((fee) => {
                const isMandatory = fee.classification === 'mandatory';
                return (
                  <tr
                    key={fee.id}
                    className={`transition-colors ${
                      isMandatory ? 'hover:bg-emerald-950/10' : 'hover:bg-rose-950/10'
                    }`}
                  >
                    <td className="py-3.5 px-3 align-top">
                      <div className="font-bold text-zinc-100 flex items-center gap-1.5">
                        {isMandatory ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                        )}
                        <span>{fee.name}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                        {fee.description}
                      </p>
                      <span className="inline-block mt-1 text-[10px] text-zinc-500 font-mono">
                        {fee.authority}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 align-top font-mono font-semibold text-zinc-200 whitespace-nowrap">
                      {fee.costRange}
                    </td>

                    <td className="py-3.5 px-3 align-top whitespace-nowrap">
                      {isMandatory ? (
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                          Mandatory / Statutory
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold bg-rose-500/15 border border-rose-500/30 text-rose-400">
                          100% Negotiable (Push to remove)
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 align-top text-zinc-300 text-[11px] leading-relaxed max-w-xs">
                      {fee.defenseAction}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. ECP Extended Warranty Strategy Box */}
      <div
        id="ecp-warranty-strategy-box"
        data-testid="ecp-warranty-defense-section"
        className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-zinc-900/95 via-zinc-950 to-zinc-900/90 p-5 sm:p-7 shadow-2xl space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-0.5 text-xs font-bold text-amber-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>ECP Extended Warranty Strategy</span>
            </div>
            <h3
              id="ecp-defense-heading"
              className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2"
            >
              Surviving the Finance Office: The 31-Day Toyota ECP Warranty Rule
            </h3>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Surviving the Business Office: Extended Warranty (ECP) Defense
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl">
              Wholesale cost baseline ($1,900–$2,100 on 7yr/120k Platinum vs $2,800+ dealer desk retail), reminder that ECP can be purchased from any Canadian dealer within 31 days of delivery. Target benchmark: Platinum 7yr/120,000km wholesale is ~$1,700–$2,000 CAD (vs. $2,600+ dealer retail).
            </p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/80 border border-amber-500/30 text-amber-300 text-xs font-semibold shrink-0">
            ⏳ <strong>Key Rule:</strong> 31-day grace window after delivery to shop ECP at ANY Canadian Toyota dealership. ECP can be purchased from any Canadian dealer within 31 days of delivery.
          </div>
        </div>

        {/* Dealer Fee Auditor & Quote Auditor Interactive Tools CTA */}
        <div className="rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-zinc-950 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <FileText className="h-4 w-4" />
              <span>Interactive Provincial Rules Engine</span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white">
              Got a quote or bill of sale from your dealer?
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed max-w-xl">
              Run it through our free Dealer Fee Auditor to inspect doc fees and add-ons before signing. Strip bogus charges with our 1-click provincial negotiation script (AMVIC, OMVIC, VSA).
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-center">
            <Link
              href="/tools/fee-auditor"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md transition-colors"
            >
              <Scale className="h-4 w-4" />
              <span>Launch Dealer Fee Auditor →</span>
            </Link>
            <Link
              href="/tools/quote-auditor"
              className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold text-xs transition-colors"
            >
              <span>Quote Auditor →</span>
            </Link>
          </div>
        </div>

        {/* 3 Strategic Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/70 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Clock className="h-4 w-4 shrink-0" />
              <span>The 31-Day Window</span>
            </div>
            <h4 className="text-sm font-bold text-zinc-100">Never Sign on Delivery Day Under Pressure</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Finance managers claim you forfeit the 3-year complimentary maintenance package unless you sign immediately.
              False: Toyota Canada honors the maintenance perks within <strong>31 days of registration</strong>.
              Buyers have a 31-day grace window after delivery to shop ECP at ANY Canadian Toyota dealership. Take the contract home to review.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/70 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <DollarSign className="h-4 w-4 shrink-0" />
              <span>Target Wholesale Cost</span>
            </div>
            <h4 className="text-sm font-bold text-zinc-100">The $1,900–$2,100 CAD Target (Never Pay Sticker)</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Dealerships mark up ECP by <strong>$800–$1,400 CAD</strong> above wholesale.
              Target benchmark: Platinum 7yr/120,000km wholesale is ~$1,700–$2,000 CAD (vs. $2,600+ dealer retail), while Platinum 7yr/160,000km wholesale is ~$1,900–$2,100 CAD.
              Counter-offer at dealer wholesale cost plus a modest $150–$200 margin, or choose to self-insure.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/70 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>The Named-Component Trap</span>
            </div>
            <h4 className="text-sm font-bold text-zinc-100">Avoid ECP Gold (Insist on Platinum Only)</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Gold is a restrictive named-component contract that denies claims for touchscreen digitizers, radar sensors, camera modules, and wiring harness corrosion.
              Modern failure points are high-tech sensors and harness lines excluded by named-component policies. If buying ECP, insist strictly on exclusionary Platinum.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-zinc-400">
            Unpack real Canadian repair costs, the 7% loan interest trap, and hybrid warranty overlap.
          </p>
          <Link
            href="/guides/toyota-ecp-warranty-guide"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md transition-colors duration-150 shrink-0 self-start sm:self-center"
          >
            <span>Read the Complete Toyota ECP Breakdown &amp; Net Cost Math →</span>
          </Link>
        </div>
      </div>

      {/* 4. Bridge to Day-1 Protection Gear */}
      <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/90 to-zinc-950/80 p-5 sm:p-6 shadow-xl space-y-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Smarter Allocation</span>
            <span className="text-zinc-600">•</span>
            <span>Day-One Protection</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">
            Put the $3,500 you saved where it counts: TuxMat floor liners, FitcamX OEM dashcam, and Spigen screen protectors.
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl">
            Instead of padding dealership finance margins with overpriced rust sprays and etching, redirect those savings into proven, community-vetted day-one protection essentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Item 1: TuxMat Floor Liners */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/70 flex flex-col justify-between space-y-3 shadow-md hover:border-zinc-700 transition-colors">
            <div className="space-y-3">
              <div className="relative w-full h-36 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <Image
                  src="/assets/gear/tuxmat-floor-liners.webp"
                  alt="TuxMat Custom High-Wall All-Weather Floor Liners"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-950/90 border border-emerald-500/30 text-emerald-400">
                  Hero Brand · Winter Protection
                </span>
              </div>
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-zinc-100">TuxMat Custom Floor Liners</h4>
                  <span className="text-xs font-mono font-semibold text-zinc-300">~$230–$340 CAD</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Maximum Canadian winter slush and road salt containment with high-wall laser coverage and integrated dead-pedal protection.
                </p>
              </div>
            </div>
            <a
              href={tuxmatUrl}
              target="_blank"
              rel="sponsored noopener noreferrer nofollow"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow transition-colors"
            >
              <span>Check on Amazon.ca</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Item 2: FitcamX OEM Dashcam */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/70 flex flex-col justify-between space-y-3 shadow-md hover:border-zinc-700 transition-colors">
            <div className="space-y-3">
              <div className="relative w-full h-36 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <Image
                  src="/assets/gear/fitcamx-rav4.webp"
                  alt="FitcamX OEM Integrated 4K Mirror Dashcam"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-950/90 border border-cyan-500/30 text-cyan-400">
                  OEM Look · 4K UHD
                </span>
              </div>
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-zinc-100">FitcamX OEM 4K Dashcam</h4>
                  <span className="text-xs font-mono font-semibold text-zinc-300">~$210–$260 CAD</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Discrete factory look replacing the rear-view mirror shroud. Taps directly into factory harness with zero dangling wires.
                </p>
              </div>
            </div>
            <a
              href={fitcamxUrl}
              target="_blank"
              rel="sponsored noopener noreferrer nofollow"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow transition-colors"
            >
              <span>Check on Amazon.ca</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Item 3: Spigen Screen Protector */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/70 flex flex-col justify-between space-y-3 shadow-md hover:border-zinc-700 transition-colors">
            <div className="space-y-3">
              <div className="relative w-full h-36 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <Image
                  src="/assets/gear/spigen-screen-protector.webp"
                  alt="Spigen 9H Matte Tempered Glass Screen Protector"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-950/90 border border-amber-500/30 text-amber-400">
                  Anti-Glare · 9H Glass
                </span>
              </div>
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-zinc-100">Spigen Screen Protectors</h4>
                  <span className="text-xs font-mono font-semibold text-zinc-300">~$35–$45 CAD</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Oleophobic anti-glare 9H tempered glass safeguarding 10.5&quot; and 12.3&quot; multimedia touchscreens against micro-scratches.
                </p>
              </div>
            </div>
            <a
              href={spigenUrl}
              target="_blank"
              rel="sponsored noopener noreferrer nofollow"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow transition-colors"
            >
              <span>Check on Amazon.ca</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
