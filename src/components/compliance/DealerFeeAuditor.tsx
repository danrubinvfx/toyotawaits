'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  DollarSign,
  FileText,
  RotateCcw,
  Sparkles,
  ExternalLink,
  HelpCircle,
  Scale,
  Printer,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { buildAmazonAffiliateUrl } from '@/lib/gear/affiliate';

export type AuditorProvince = 'AB' | 'ON' | 'BC' | 'OTHER';

export interface FeeInputValues {
  docFee: number;
  etching: number;
  rustModule: number;
  blockHeater: number;
  ecp: number;
}

export interface ActiveFeeToggles {
  docFee: boolean;
  etching: boolean;
  rustModule: boolean;
  blockHeater: boolean;
  ecp: boolean;
}

const DEFAULT_FEE_VALUES: FeeInputValues = {
  docFee: 799,
  etching: 499,
  rustModule: 1295,
  blockHeater: 800,
  ecp: 2850,
};

const DEFAULT_TOGGLES: ActiveFeeToggles = {
  docFee: true,
  etching: true,
  rustModule: true,
  blockHeater: true,
  ecp: true,
};

// Target competitive wholesale baselines
const WHOLESALE_BENCHMARKS = {
  docFee: 0, // Should be $0 over advertised price under AMVIC/OMVIC
  etching: 0, // Unsolicited add-on; target $0
  rustModule: 0, // Scientifically ineffective on unibodies; target $0
  blockHeater: 350, // OEM part & labor standard cost ~$300-$350
  ecp: 2000, // 7yr/120k Platinum wholesale baseline is ~$1,900–$2,100 CAD
};

export function generateNegotiationScript(
  values: FeeInputValues,
  toggles: ActiveFeeToggles,
  province: AuditorProvince,
  dealerName?: string
): string {
  const recipient = dealerName?.trim() ? dealerName.trim() : 'Sales & Finance Management Team';
  const lines: string[] = [];

  lines.push(`Attention: ${recipient},`);
  lines.push('');
  lines.push(
    'Thank you for providing the vehicle pricing worksheet. I am looking forward to completing this purchase and finalizing delivery.'
  );
  lines.push('');
  lines.push(
    'In reviewing the line items against provincial consumer regulations and manufacturer pricing guidelines, I require the following adjustments prior to executing the final bill of sale and releasing certified funds:'
  );
  lines.push('');

  // 1. Doc Fee
  if (toggles.docFee && values.docFee > 0) {
    if (province === 'AB') {
      lines.push(
        `• Documentation / Admin Fee ($${values.docFee.toLocaleString()} CAD): Under Alberta AMVIC regulations (Consumer Protection Act, Vehicle Sales Regulation s. 11), all-in pricing is strictly mandatory on advertised inventory. Dealerships are legally prohibited from charging any extra documentation or admin fees over the advertised vehicle price. Please remove this fee in full or apply an equivalent credit.`
      );
    } else if (province === 'ON') {
      lines.push(
        `• Documentation / Admin Fee ($${values.docFee.toLocaleString()} CAD): Under Ontario OMVIC rules (Motor Vehicle Dealers Act, 2002 - O. Reg. 333/08, s. 36), all-in price advertising requires all administrative, preparation, and doc fees to be included in any advertised price or MSRP. Charging an extra doc fee is non-compliant with OMVIC regulations. Please remove this charge.`
      );
    } else if (province === 'BC') {
      lines.push(
        `• Documentation / Admin Fee ($${values.docFee.toLocaleString()} CAD): Under Vehicle Sales Authority of BC (VSA) all-in pricing guidelines and the BPCPA, doc fees are discretionary dealer markup and cannot be charged above the advertised vehicle price. Please strike this line item.`
      );
    } else {
      lines.push(
        `• Documentation / Admin Fee ($${values.docFee.toLocaleString()} CAD): Standard vehicle title registration and paperwork processing are standard dealer overhead. Please remove this administrative charge from the purchase worksheet.`
      );
    }
  }

  // 2. Security Etching
  if (toggles.etching && values.etching > 0) {
    lines.push(
      `• Window Security Etch / Security Pack ($${values.etching.toLocaleString()} CAD): I did not request this dealer-added protection pack. Canadian insurance underwriters do not offer material discounts for window etching. Please remove this line item.`
    );
  }

  // 3. Rust Module
  if (toggles.rustModule && values.rustModule > 0) {
    lines.push(
      `• Electronic Rust Module / Undercoating ($${values.rustModule.toLocaleString()} CAD): Modern Toyota vehicles are engineered with double-sided electro-galvanized sheet metal. Electronic rust inhibitor modules are ineffective on automotive unibodies and do not protect the chassis. Please strike this fee entirely.`
    );
  }

  // 4. Block Heater
  if (toggles.blockHeater && values.blockHeater > 0) {
    const target = WHOLESALE_BENCHMARKS.blockHeater;
    if (values.blockHeater > target) {
      lines.push(
        `• Engine Block Heater ($${values.blockHeater.toLocaleString()} CAD): Genuine Toyota OEM cartridge installation is valued at ~$${target} CAD. The quoted fee reflects an excessive markup. Please adjust this item to the OEM installed benchmark of $${target} CAD or remove it.`
      );
    }
  }

  // 5. ECP Extended Warranty
  if (toggles.ecp && values.ecp > 0) {
    const wholesaleTarget = WHOLESALE_BENCHMARKS.ecp;
    lines.push(
      `• Toyota ECP Extended Warranty ($${values.ecp.toLocaleString()} CAD): I am aware of Toyota Canada's 31-day grace rule allowing purchasers to buy official ECP Platinum coverage from any Canadian Toyota dealership within 31 days of delivery at competitive wholesale margins ($1,900–$2,100 CAD on 7yr/120k Platinum vs $2,800+ dealer desk retail). If you can match wholesale cost at $${wholesaleTarget.toLocaleString()} CAD today, I will gladly include it; otherwise, please remove it so I may exercise the 31-day window.`
    );
  }

  lines.push('');
  lines.push(
    'Once these non-compliant and discretionary add-ons are updated to reflect all-in pricing compliance, I am prepared to sign and provide certified draft payment immediately.'
  );
  lines.push('');
  lines.push('Thank you for your prompt cooperation.');

  return lines.join('\n');
}

export function DealerFeeAuditor({
  className,
  showTitle = true,
}: {
  className?: string;
  showTitle?: boolean;
}) {
  const [province, setProvince] = useState<AuditorProvince>('AB');
  const [dealerName, setDealerName] = useState<string>('');
  const [feeValues, setFeeValues] = useState<FeeInputValues>(DEFAULT_FEE_VALUES);
  const [activeToggles, setActiveToggles] = useState<ActiveFeeToggles>(DEFAULT_TOGGLES);
  const [copied, setCopied] = useState<boolean>(false);

  const handleValueChange = (key: keyof FeeInputValues, rawVal: string) => {
    const num = Math.max(0, parseFloat(rawVal) || 0);
    setFeeValues((prev) => ({ ...prev, [key]: num }));
  };

  const handleToggle = (key: keyof ActiveFeeToggles) => {
    setActiveToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleReset = () => {
    setFeeValues(DEFAULT_FEE_VALUES);
    setActiveToggles(DEFAULT_TOGGLES);
  };

  // Calculations
  const calculations = useMemo(() => {
    let totalQuoted = 0;
    let compliantTarget = 0;

    if (activeToggles.docFee) {
      totalQuoted += feeValues.docFee;
      compliantTarget += WHOLESALE_BENCHMARKS.docFee;
    }
    if (activeToggles.etching) {
      totalQuoted += feeValues.etching;
      compliantTarget += WHOLESALE_BENCHMARKS.etching;
    }
    if (activeToggles.rustModule) {
      totalQuoted += feeValues.rustModule;
      compliantTarget += WHOLESALE_BENCHMARKS.rustModule;
    }
    if (activeToggles.blockHeater) {
      totalQuoted += feeValues.blockHeater;
      compliantTarget += Math.min(feeValues.blockHeater, WHOLESALE_BENCHMARKS.blockHeater);
    }
    if (activeToggles.ecp) {
      totalQuoted += feeValues.ecp;
      compliantTarget += Math.min(feeValues.ecp, WHOLESALE_BENCHMARKS.ecp);
    }

    const totalSavings = Math.max(0, totalQuoted - compliantTarget);
    return { totalQuoted, compliantTarget, totalSavings };
  }, [feeValues, activeToggles]);

  // Generate negotiation script
  const scriptText = useMemo(() => {
    return generateNegotiationScript(feeValues, activeToggles, province, dealerName);
  }, [feeValues, activeToggles, province, dealerName]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(scriptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  const tuxmatUrl = buildAmazonAffiliateUrl('TuxMat Toyota RAV4 custom all weather floor mats', 'CA');
  const fitcamxUrl = buildAmazonAffiliateUrl('Fitcamx dash cam Toyota OEM 4K', 'CA');

  return (
    <div
      id="dealer-fee-auditor"
      data-testid="dealer-fee-auditor"
      className={`rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 sm:p-7 shadow-2xl space-y-6 text-zinc-100 ${className || ''}`}
    >
      {showTitle && (
        <div className="space-y-2 border-b border-zinc-800 pb-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-amber-400">
            <Scale className="h-3.5 w-3.5" />
            <span>Interactive Dealer Fee Auditor</span>
            <span className="text-zinc-600">•</span>
            <span>AMVIC &amp; OMVIC All-In Pricing Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>Interactive Dealer Fee &amp; Compliance Auditor</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-3xl">
            Input the line items quoted on your Toyota bill of sale or purchase worksheet.
            This tool audits extra doc fees, etching, rust modules, marked-up block heaters, and ECP extended warranty against Alberta AMVIC and Ontario OMVIC all-in pricing laws.
          </p>
        </div>
      )}

      {/* Configuration Controls: Province Selector & Dealer Name */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40">
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-bold text-zinc-300 block">
            Select Your Province (All-In Pricing Enforcement Jurisdiction):
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setProvince('AB')}
              data-testid="province-btn-ab"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                province === 'AB'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              Alberta (AMVIC Enforcement)
            </button>
            <button
              type="button"
              onClick={() => setProvince('ON')}
              data-testid="province-btn-on"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                province === 'ON'
                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              Ontario (OMVIC Enforcement)
            </button>
            <button
              type="button"
              onClick={() => setProvince('BC')}
              data-testid="province-btn-bc"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                province === 'BC'
                  ? 'bg-cyan-500 text-zinc-950 font-bold shadow-md'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              British Columbia (VSA)
            </button>
            <button
              type="button"
              onClick={() => setProvince('OTHER')}
              data-testid="province-btn-other"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                province === 'OTHER'
                  ? 'bg-zinc-100 text-zinc-950 font-bold shadow-md'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              Other Provinces / Territories
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="dealer-name-input" className="text-xs font-bold text-zinc-300 block">
            Dealership Name (Optional):
          </label>
          <input
            id="dealer-name-input"
            type="text"
            value={dealerName}
            onChange={(e) => setDealerName(e.target.value)}
            placeholder="e.g. South Pointe Toyota"
            className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Quote Line Items Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Audit Your Dealership Quote Line Items</span>
          </h3>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Defaults</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {/* 1. Doc Fee */}
          <div
            data-testid="fee-row-doc-fee"
            className={`p-3.5 rounded-xl border transition-all ${
              activeToggles.docFee
                ? 'bg-zinc-900/80 border-rose-500/40 shadow-sm'
                : 'bg-zinc-900/30 border-zinc-800/60 opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="toggle-doc-fee"
                  checked={activeToggles.docFee}
                  onChange={() => handleToggle('docFee')}
                  className="mt-0.5 h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-0 cursor-pointer"
                />
                <div>
                  <label htmlFor="toggle-doc-fee" className="text-xs font-bold text-zinc-100 cursor-pointer">
                    Documentation / Admin Fee (Doc Fee)
                  </label>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Internal dealership overhead charge. Under Alberta AMVIC and Ontario OMVIC regulations, adding extra doc fees above advertised price is non-compliant.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <span className="text-xs text-zinc-400">$ CAD</span>
                <input
                  type="number"
                  aria-label="Documentation / Admin Fee"
                  value={feeValues.docFee}
                  onChange={(e) => handleValueChange('docFee', e.target.value)}
                  disabled={!activeToggles.docFee}
                  className="w-24 px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-700 text-right font-mono text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Violation Flag Alert */}
            {activeToggles.docFee && feeValues.docFee > 0 && (
              <div className="mt-2.5 pt-2.5 border-t border-zinc-800/80 flex items-start gap-2 text-xs">
                <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-rose-400">
                    {province === 'AB'
                      ? '🚨 AMVIC Violation (Alberta All-In Pricing Law)'
                      : province === 'ON'
                      ? '🚨 OMVIC Violation (Ontario All-In Pricing Law)'
                      : '⚠️ Discretionary Dealership Margin'}
                    :
                  </span>{' '}
                  <span className="text-zinc-300">
                    {province === 'AB'
                      ? 'AMVIC strictly prohibits charging documentation fees over the advertised vehicle price under the Alberta Consumer Protection Act (Vehicle Sales Regulation s. 11).'
                      : province === 'ON'
                      ? 'OMVIC all-in pricing rules under the Motor Vehicle Dealers Act (MVDA 2002, O. Reg. 333/08 s. 36) forbid extra doc or admin fees on advertised vehicles.'
                      : 'Non-statutory dealership markup. Demand removal or price deduction.'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 2. Etching */}
          <div
            data-testid="fee-row-etching"
            className={`p-3.5 rounded-xl border transition-all ${
              activeToggles.etching
                ? 'bg-zinc-900/80 border-amber-500/40 shadow-sm'
                : 'bg-zinc-900/30 border-zinc-800/60 opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="toggle-etching"
                  checked={activeToggles.etching}
                  onChange={() => handleToggle('etching')}
                  className="mt-0.5 h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-0 cursor-pointer"
                />
                <div>
                  <label htmlFor="toggle-etching" className="text-xs font-bold text-zinc-100 cursor-pointer">
                    Window Security Etching / Police Trace Pack
                  </label>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Pre-printed VIN glass microdots or chemical etch sold as mandatory anti-theft protection.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <span className="text-xs text-zinc-400">$ CAD</span>
                <input
                  type="number"
                  aria-label="Window Security Etching"
                  value={feeValues.etching}
                  onChange={(e) => handleValueChange('etching', e.target.value)}
                  disabled={!activeToggles.etching}
                  className="w-24 px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-700 text-right font-mono text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {activeToggles.etching && feeValues.etching > 0 && (
              <div className="mt-2.5 pt-2.5 border-t border-zinc-800/80 flex items-start gap-2 text-xs">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-zinc-300">
                  <span className="font-bold text-amber-400">Pure Profit Add-On:</span> Canadian auto insurers offer zero premium discount for window etching. Dealers cannot mandate this unrequested add-on on factory orders.
                </p>
              </div>
            )}
          </div>

          {/* 3. Rust Module */}
          <div
            data-testid="fee-row-rust-module"
            className={`p-3.5 rounded-xl border transition-all ${
              activeToggles.rustModule
                ? 'bg-zinc-900/80 border-rose-500/40 shadow-sm'
                : 'bg-zinc-900/30 border-zinc-800/60 opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="toggle-rust-module"
                  checked={activeToggles.rustModule}
                  onChange={() => handleToggle('rustModule')}
                  className="mt-0.5 h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-0 cursor-pointer"
                />
                <div>
                  <label htmlFor="toggle-rust-module" className="text-xs font-bold text-zinc-100 cursor-pointer">
                    Electronic Rust Module / Undercoating Pack
                  </label>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Cathodic &quot;rust inhibitor modules&quot; wired to the 12V battery or spray undercoating.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <span className="text-xs text-zinc-400">$ CAD</span>
                <input
                  type="number"
                  aria-label="Electronic Rust Module"
                  value={feeValues.rustModule}
                  onChange={(e) => handleValueChange('rustModule', e.target.value)}
                  disabled={!activeToggles.rustModule}
                  className="w-24 px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-700 text-right font-mono text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {activeToggles.rustModule && feeValues.rustModule > 0 && (
              <div className="mt-2.5 pt-2.5 border-t border-zinc-800/80 flex items-start gap-2 text-xs">
                <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-zinc-300">
                  <span className="font-bold text-rose-400">Scientifically Ineffective on Unibodies:</span> Cathodic electronic rust protection requires full liquid immersion (like a ship hull). Toyota unibodies are built with factory double-sided electro-galvanized sheet metal. Strike this line item entirely.
                </p>
              </div>
            )}
          </div>

          {/* 4. Block Heater */}
          <div
            data-testid="fee-row-block-heater"
            className={`p-3.5 rounded-xl border transition-all ${
              activeToggles.blockHeater
                ? 'bg-zinc-900/80 border-cyan-500/40 shadow-sm'
                : 'bg-zinc-900/30 border-zinc-800/60 opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="toggle-block-heater"
                  checked={activeToggles.blockHeater}
                  onChange={() => handleToggle('blockHeater')}
                  className="mt-0.5 h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-0 cursor-pointer"
                />
                <div>
                  <label htmlFor="toggle-block-heater" className="text-xs font-bold text-zinc-100 cursor-pointer">
                    Engine Block Heater &amp; Cordset
                  </label>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Engine heating element installed before delivery. Standard factory cartridge installation value is ~$300–$350 CAD.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <span className="text-xs text-zinc-400">$ CAD</span>
                <input
                  type="number"
                  aria-label="Engine Block Heater"
                  value={feeValues.blockHeater}
                  onChange={(e) => handleValueChange('blockHeater', e.target.value)}
                  disabled={!activeToggles.blockHeater}
                  className="w-24 px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-700 text-right font-mono text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {activeToggles.blockHeater && feeValues.blockHeater > WHOLESALE_BENCHMARKS.blockHeater && (
              <div className="mt-2.5 pt-2.5 border-t border-zinc-800/80 flex items-start gap-2 text-xs">
                <AlertTriangle className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-zinc-300">
                  <span className="font-bold text-cyan-400">Padded Installation Markup:</span> You are being charged ${feeValues.blockHeater} CAD for a 45-minute install. Demand adjustment to the OEM standard benchmark of $350 CAD or purchase the OEM part over the parts counter.
                </p>
              </div>
            )}
          </div>

          {/* 5. Toyota ECP Extended Warranty */}
          <div
            data-testid="fee-row-ecp"
            className={`p-3.5 rounded-xl border transition-all ${
              activeToggles.ecp
                ? 'bg-zinc-900/80 border-amber-500/40 shadow-sm'
                : 'bg-zinc-900/30 border-zinc-800/60 opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="toggle-ecp"
                  checked={activeToggles.ecp}
                  onChange={() => handleToggle('ecp')}
                  className="mt-0.5 h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-0 cursor-pointer"
                />
                <div>
                  <label htmlFor="toggle-ecp" className="text-xs font-bold text-zinc-100 cursor-pointer">
                    Toyota ECP Extended Warranty (Extra Care Protection)
                  </label>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Dealer desk retail ($2,800+ CAD) vs wholesale cost baseline ($1,900–$2,100 CAD on 7yr/120k Platinum).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <span className="text-xs text-zinc-400">$ CAD</span>
                <input
                  type="number"
                  aria-label="Toyota ECP Warranty"
                  value={feeValues.ecp}
                  onChange={(e) => handleValueChange('ecp', e.target.value)}
                  disabled={!activeToggles.ecp}
                  className="w-24 px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-700 text-right font-mono text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {activeToggles.ecp && (
              <div className="mt-2.5 pt-2.5 border-t border-zinc-800/80 flex items-start gap-2 text-xs">
                <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-zinc-300">
                  <span className="font-bold text-amber-400">The 31-Day Rule:</span> Under Toyota Canada policy, ECP can be purchased from any Canadian dealer within 31 days of delivery. Never pay retail under finance office pressure.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Scorecard */}
      <div className="p-4 sm:p-5 rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-zinc-950 to-zinc-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
            Auditor Summary Scorecard
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-white">
              ${calculations.totalSavings.toLocaleString()} CAD
            </span>
            <span className="text-xs text-zinc-400">potential savings to remove or counter-offer</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            Quoted Total: ${calculations.totalQuoted.toLocaleString()} CAD • Target Fair Price: ${calculations.compliantTarget.toLocaleString()} CAD
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          data-testid="copy-script-btn"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer shrink-0"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 stroke-[3] text-emerald-950" />
              <span>Copied Negotiation Script!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy Polite Dealer Desk Negotiation Script</span>
            </>
          )}
        </button>
      </div>

      {/* Negotiation Script Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-amber-400" />
            <span>Generated Polite Dealer Desk Negotiation Script</span>
          </span>
          <span className="text-[11px] text-zinc-500">
            Paste directly into email or present at the business office desk
          </span>
        </div>
        <div className="relative">
          <pre
            data-testid="negotiation-script-preview"
            className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/90 text-[11px] sm:text-xs text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto"
          >
            {scriptText}
          </pre>
        </div>
      </div>
    </div>
  );
}
