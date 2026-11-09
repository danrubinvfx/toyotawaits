'use client';

import React, { useState } from 'react';
import {
  Printer,
  FileCheck2,
  ShieldCheck,
  AlertOctagon,
  CheckSquare,
  Square,
  FileText,
  BadgeAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FeeRefusalWorksheet() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'doc-fee': true,
    etching: true,
    'rust-module': true,
    'block-heater': true,
    ecp: true,
    spacers: false,
    paint: false,
    key: false,
    hybrid: false,
    odometer: false,
  });

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <section
      id="fee-refusal-worksheet"
      data-testid="fee-refusal-worksheet-section"
      className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 sm:p-7 shadow-xl space-y-6"
      aria-labelledby="fee-refusal-heading"
    >
      {/* Header and Print Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-400">
            <FileCheck2 className="h-3.5 w-3.5" />
            <span>Printable Delivery Deliverable</span>
            <span className="text-zinc-600">•</span>
            <span>Business Office Reference</span>
          </div>
          <h3
            id="fee-refusal-heading"
            className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2"
          >
            <FileText className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>Printable Inspection Checklist &amp; Fee Refusal Worksheet</span>
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl">
            Take this physical worksheet into the business office. Audit pre-delivery vehicle condition and formally decline or counter-offer non-compliant and discretionary dealer fees.
          </p>
        </div>

        <Button
          type="button"
          onClick={handlePrint}
          data-testid="print-worksheet-btn"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs shadow-md transition-all cursor-pointer self-start sm:self-center shrink-0 print:hidden"
        >
          <Printer className="h-4 w-4" />
          <span>Print Inspection Checklist &amp; Fee Refusal Worksheet</span>
        </Button>
      </div>

      {/* Part 1: Delivery Inspection Checklist Overview */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
          <ShieldCheck className="h-4 w-4" />
          <span>Part 1: Pre-Delivery Vehicle Acceptance Inspection</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
          <div
            onClick={() => toggleItem('spacers')}
            className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/50 flex items-start gap-2.5 cursor-pointer hover:border-zinc-700 transition-colors select-none"
          >
            {checkedItems['spacers'] ? (
              <CheckSquare className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Square className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold text-zinc-100">Front Suspension Transport Spacers Removed</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Physically verified front coil springs are free of yellow/orange plastic shipping blocks.
              </p>
            </div>
          </div>

          <div
            onClick={() => toggleItem('paint')}
            className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/50 flex items-start gap-2.5 cursor-pointer hover:border-zinc-700 transition-colors select-none"
          >
            {checkedItems['paint'] ? (
              <CheckSquare className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Square className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold text-zinc-100">Bright Daylight Exterior Body &amp; Glass Audit</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Inspected outdoors in direct sunlight for rail dust, transport strap gouges, and paint chips.
              </p>
            </div>
          </div>

          <div
            onClick={() => toggleItem('key')}
            className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/50 flex items-start gap-2.5 cursor-pointer hover:border-zinc-700 transition-colors select-none"
          >
            {checkedItems['key'] ? (
              <CheckSquare className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Square className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold text-zinc-100">2nd Smart Key Allocation IOU Voucher</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                If vehicle is delivered with 1 smart key, official Toyota 2nd key IOU voucher signed in writing.
              </p>
            </div>
          </div>

          <div
            onClick={() => toggleItem('hybrid')}
            className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/50 flex items-start gap-2.5 cursor-pointer hover:border-zinc-700 transition-colors select-none"
          >
            {checkedItems['hybrid'] ? (
              <CheckSquare className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Square className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold text-zinc-100">Hybrid Battery Vent Filter &amp; Charging Cables</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Verified high-voltage cabin cooling vent filter is seated; confirmed PHEV Level 1 cord in sub-floor.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Fee Refusal & Negotiation Table */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
          <BadgeAlert className="h-4 w-4" />
          <span>Part 2: Finance Office Fee Refusal &amp; All-In Pricing Worksheet</span>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-left text-xs border-collapse min-w-[620px]">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-semibold bg-zinc-900/60">
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Line Item</th>
                <th className="py-2.5 px-3">Typical Dealer Markup</th>
                <th className="py-2.5 px-3">Legal Basis &amp; Buyer Action</th>
                <th className="py-2.5 px-3">Desk Initial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
              <tr className="hover:bg-zinc-900/40">
                <td className="py-2.5 px-3">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                    REFUSED
                  </span>
                </td>
                <td className="py-2.5 px-3 font-bold text-zinc-100 font-sans">
                  Documentation / Admin Fee
                </td>
                <td className="py-2.5 px-3 text-zinc-300">$599 – $999 CAD</td>
                <td className="py-2.5 px-3 text-zinc-400 font-sans leading-relaxed">
                  Struck out under AMVIC (Alberta Consumer Protection Act s. 11) and OMVIC (MVDA 2002 s. 36) all-in pricing rules prohibiting fees over advertised price.
                </td>
                <td className="py-2.5 px-3 text-zinc-500 border-l border-zinc-800">
                  ________
                </td>
              </tr>

              <tr className="hover:bg-zinc-900/40">
                <td className="py-2.5 px-3">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                    REFUSED
                  </span>
                </td>
                <td className="py-2.5 px-3 font-bold text-zinc-100 font-sans">
                  Window Security Etching
                </td>
                <td className="py-2.5 px-3 text-zinc-300">$399 – $699 CAD</td>
                <td className="py-2.5 px-3 text-zinc-400 font-sans leading-relaxed">
                  Unsolicited dealer add-on pack. Pure dealer gross margin with zero material insurance discount.
                </td>
                <td className="py-2.5 px-3 text-zinc-500 border-l border-zinc-800">
                  ________
                </td>
              </tr>

              <tr className="hover:bg-zinc-900/40">
                <td className="py-2.5 px-3">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                    REFUSED
                  </span>
                </td>
                <td className="py-2.5 px-3 font-bold text-zinc-100 font-sans">
                  Electronic Rust Module
                </td>
                <td className="py-2.5 px-3 text-zinc-300">$1,000 – $1,500 CAD</td>
                <td className="py-2.5 px-3 text-zinc-400 font-sans leading-relaxed">
                  Scientifically ineffective on automotive unibodies manufactured with factory electro-galvanized zinc steel. Struck out.
                </td>
                <td className="py-2.5 px-3 text-zinc-500 border-l border-zinc-800">
                  ________
                </td>
              </tr>

              <tr className="hover:bg-zinc-900/40">
                <td className="py-2.5 px-3">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    ADJUSTED
                  </span>
                </td>
                <td className="py-2.5 px-3 font-bold text-zinc-100 font-sans">
                  Engine Block Heater
                </td>
                <td className="py-2.5 px-3 text-zinc-300">$700 – $900 CAD</td>
                <td className="py-2.5 px-3 text-zinc-400 font-sans leading-relaxed">
                  Reduced to genuine Toyota OEM installed cost benchmark (~$350 CAD) or removed from bill of sale.
                </td>
                <td className="py-2.5 px-3 text-zinc-500 border-l border-zinc-800">
                  ________
                </td>
              </tr>

              <tr className="hover:bg-zinc-900/40">
                <td className="py-2.5 px-3">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                    DEFERRED
                  </span>
                </td>
                <td className="py-2.5 px-3 font-bold text-zinc-100 font-sans">
                  Toyota ECP Extended Warranty
                </td>
                <td className="py-2.5 px-3 text-zinc-300">$2,800+ CAD Retail</td>
                <td className="py-2.5 px-3 text-zinc-400 font-sans leading-relaxed">
                  Refused retail price. Exercising 31-day grace window to purchase from any Canadian Toyota dealership at wholesale cost baseline ($1,900–$2,100 on 7yr/120k Platinum).
                </td>
                <td className="py-2.5 px-3 text-zinc-500 border-l border-zinc-800">
                  ________
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sign-Off Block for Taking to Dealer Desk */}
      <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-3">
        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
          <strong>Mandatory Disclosure:</strong> By signing below, both parties confirm the purchase agreement conforms to provincial all-in price regulations. The purchaser retains the unilateral statutory right under Toyota Canada policy to purchase official ECP warranty coverage from any franchised Canadian Toyota dealership within 31 days of delivery.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-zinc-800/80 text-xs font-mono">
          <div>
            <span className="text-[10px] text-zinc-500 block uppercase">Purchaser Signature</span>
            <div className="h-8 border-b border-zinc-700 mt-1" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 block uppercase">Dealership Representative</span>
            <div className="h-8 border-b border-zinc-700 mt-1" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 block uppercase">Vehicle VIN (17 digits)</span>
            <div className="h-8 border-b border-zinc-700 mt-1" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 block uppercase">Date of Delivery</span>
            <div className="h-8 border-b border-zinc-700 mt-1" />
          </div>
        </div>
      </div>
    </section>
  );
}
