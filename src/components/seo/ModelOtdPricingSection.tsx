import React from 'react';
import Link from 'next/link';
import { Calculator, ShieldCheck, DollarSign } from 'lucide-react';

export interface ModelOtdPricingSectionProps {
  modelSlug: string;
  modelName: string;
  baseMsrpCad: number;
  baseMsrpUsd?: number;
  isUS?: boolean;
  freightPdiCad?: number;
  destinationUsd?: number;
}

export interface ProvincialOtdRow {
  code: 'ON' | 'BC' | 'AB' | 'QC';
  province: string;
  taxLabel: string;
  taxRate: number;
  taxAmountCad: number;
  estimatedOtdCad: number;
  note: string;
}

export const STATUTORY_AC_TAX_CAD = 100;
export const DEFAULT_TIRE_LEVY_CAD = 20;

const TRUCK_AND_LARGE_SUV_SLUGS = new Set([
  'tundra',
  'sequoia',
  'land-cruiser',
  'lexus-gx550',
  'lexus-tx',
]);

const MIDSIZE_SUV_MINIVAN_SLUGS = new Set([
  'sienna',
  'grand-highlander',
  'highlander',
  'tacoma',
  '4runner',
  'lexus-nx',
  'lexus-rx',
]);

export function getDefaultFreightPdiCad(modelSlug: string): number {
  const clean = modelSlug.toLowerCase().trim();
  if (TRUCK_AND_LARGE_SUV_SLUGS.has(clean)) return 2095;
  if (MIDSIZE_SUV_MINIVAN_SLUGS.has(clean)) return 2030;
  return 1930;
}

export function getDefaultDestinationUsd(modelSlug: string): number {
  const clean = modelSlug.toLowerCase().trim();
  if (clean === 'tundra' || clean === 'sequoia') return 1850;
  if (TRUCK_AND_LARGE_SUV_SLUGS.has(clean) || MIDSIZE_SUV_MINIVAN_SLUGS.has(clean)) {
    return 1450;
  }
  return 1395;
}

export function formatBrandedModelName(modelSlug: string, modelName: string): string {
  const trimmed = modelName.trim();
  const isLexus = modelSlug.toLowerCase().startsWith('lexus-') || /^lexus\b/i.test(trimmed);
  if (isLexus) {
    return /^lexus\b/i.test(trimmed) ? trimmed : `Lexus ${trimmed}`;
  }
  return /^toyota\b/i.test(trimmed) ? trimmed : `Toyota ${trimmed}`;
}

export function formatCurrency(amount: number): string {
  return `$${Math.round(amount).toLocaleString('en-US')}`;
}

export function calculateCanadianOtdBreakdown(
  baseMsrpCad: number,
  freightPdiCad: number,
  acTaxCad: number = STATUTORY_AC_TAX_CAD,
  tireLevyCad: number = DEFAULT_TIRE_LEVY_CAD
): {
  subtotalCad: number;
  provinces: ProvincialOtdRow[];
} {
  const subtotalCad = baseMsrpCad + freightPdiCad + acTaxCad + tireLevyCad;

  const definitions: Array<{
    code: ProvincialOtdRow['code'];
    province: string;
    taxLabel: string;
    taxRate: number;
    note: string;
  }> = [
    {
      code: 'ON',
      province: 'Ontario',
      taxLabel: '13% HST',
      taxRate: 0.13,
      note: 'OMVIC all-in pricing enforced',
    },
    {
      code: 'BC',
      province: 'British Columbia',
      taxLabel: '5% GST + 7% PST (12%)',
      taxRate: 0.12,
      note: 'VSA all-in pricing enforced',
    },
    {
      code: 'AB',
      province: 'Alberta',
      taxLabel: '5% GST only',
      taxRate: 0.05,
      note: 'Lowest OTD in Canada (AMVIC)',
    },
    {
      code: 'QC',
      province: 'Quebec',
      taxLabel: '5% GST + 9.975% QST (14.975%)',
      taxRate: 0.14975,
      note: 'OPC advertised price rules',
    },
  ];

  const provinces = definitions.map((def) => {
    const taxAmountCad = Math.round(subtotalCad * def.taxRate);
    return {
      ...def,
      taxAmountCad,
      estimatedOtdCad: Math.round(subtotalCad * (1 + def.taxRate)),
    };
  });

  return { subtotalCad, provinces };
}

export function ModelOtdPricingSection({
  modelSlug,
  modelName,
  baseMsrpCad,
  baseMsrpUsd,
  isUS = false,
  freightPdiCad,
  destinationUsd,
}: ModelOtdPricingSectionProps) {
  const brandedName = formatBrandedModelName(modelSlug, modelName);

  if (isUS) {
    const resolvedUsdMsrp = baseMsrpUsd ?? Math.round(baseMsrpCad * 0.74);
    const resolvedDestination = destinationUsd ?? getDefaultDestinationUsd(modelSlug);
    const msrpPlusDest = resolvedUsdMsrp + resolvedDestination;
    const highDemandAdm = 2500;
    const msrpPlusAdm = msrpPlusDest + highDemandAdm;

    return (
      <section
        aria-label={`${brandedName} Out-the-Door Price Breakdown`}
        data-testid="model-otd-pricing-section"
        className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 sm:p-6 my-6 shadow-xs space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              <DollarSign className="h-3.5 w-3.5" />
              US Out-the-Door Pricing &amp; ADM Guide
            </span>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              2026–2027 {brandedName} Out-the-Door Price &amp; Dealer Markup (ADM) Guide
            </h2>
          </div>
          <Link
            href={`/tools/quote-auditor?model=${modelSlug}`}
            className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors whitespace-nowrap"
          >
            Check Dealer Addendum &amp; ADM ↗
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Starting US MSRP
            </span>
            <p className="text-lg font-bold font-mono text-zinc-950 dark:text-zinc-50">
              {formatCurrency(resolvedUsdMsrp)} USD
            </p>
            <p className="text-xs text-zinc-500">Base trim factory MSRP before destination</p>
          </div>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Destination &amp; Delivery
            </span>
            <p className="text-lg font-bold font-mono text-zinc-950 dark:text-zinc-50">
              +{formatCurrency(resolvedDestination)} USD
            </p>
            <p className="text-xs text-zinc-500">Standard OEM DPH (~$1,395–$1,850 USD)</p>
          </div>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Observed Crowdsourced ADM
            </span>
            <p className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">
              $0 – +$2,500
            </p>
            <p className="text-xs text-zinc-500">$0 MSRP to +$2,500 on high-demand hybrids</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-500">
                <th className="py-2.5 px-3 font-bold">US Pricing Tier</th>
                <th className="py-2.5 px-3 font-bold">Base MSRP + Dest.</th>
                <th className="py-2.5 px-3 font-bold">Dealer Markup (ADM)</th>
                <th className="py-2.5 px-3 font-bold text-right">Pre-Tax OTD Baseline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              <tr className="bg-white dark:bg-zinc-900/40">
                <td className="py-2.5 px-3 font-semibold text-emerald-700 dark:text-emerald-400">
                  No-Markup MSRP Dealer
                </td>
                <td className="py-2.5 px-3 font-mono text-zinc-700 dark:text-zinc-300">
                  {formatCurrency(msrpPlusDest)} USD
                </td>
                <td className="py-2.5 px-3 font-mono text-emerald-700 dark:text-emerald-400">
                  $0
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-right text-zinc-950 dark:text-zinc-50">
                  {formatCurrency(msrpPlusDest)} USD
                </td>
              </tr>
              <tr className="bg-white dark:bg-zinc-900/40">
                <td className="py-2.5 px-3 font-semibold text-amber-700 dark:text-amber-400">
                  High-Demand Hybrid / Allocation ADM
                </td>
                <td className="py-2.5 px-3 font-mono text-zinc-700 dark:text-zinc-300">
                  {formatCurrency(msrpPlusDest)} USD
                </td>
                <td className="py-2.5 px-3 font-mono text-amber-700 dark:text-amber-400">
                  +$2,500
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-right text-zinc-950 dark:text-zinc-50">
                  {formatCurrency(msrpPlusAdm)} USD
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Pre-tax baseline excludes state/local sales tax, title, registration, and state-capped doc fees. Watch for mandatory dealer addendums (nitrogen tires, VIN etching, ceramic coatings) disguised as factory options.
        </p>
      </section>
    );
  }

  const resolvedFreight = freightPdiCad ?? getDefaultFreightPdiCad(modelSlug);
  const { subtotalCad, provinces } = calculateCanadianOtdBreakdown(
    baseMsrpCad,
    resolvedFreight
  );

  return (
    <section
      aria-label={`${brandedName} Out-the-Door Price Breakdown`}
      data-testid="model-otd-pricing-section"
      className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 sm:p-6 my-6 shadow-xs space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
            <Calculator className="h-3.5 w-3.5" />
            Canadian Out-the-Door Price Estimator
          </span>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            2026–2027 {brandedName} Out-the-Door Price &amp; Dealer Fees in Canada
          </h2>
        </div>
        <Link
          href={`/tools/quote-auditor?model=${modelSlug}`}
          className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors whitespace-nowrap"
        >
          Audit Your Dealer Quote ↗
        </Link>
      </div>

      {/* Base Canadian Fee Stack */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 p-3.5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Starting MSRP (CAD)
          </span>
          <p className="text-base sm:text-lg font-bold font-mono text-zinc-950 dark:text-zinc-50">
            {formatCurrency(baseMsrpCad)}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 p-3.5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Freight &amp; PDI
          </span>
          <p className="text-base sm:text-lg font-bold font-mono text-zinc-950 dark:text-zinc-50">
            +{formatCurrency(resolvedFreight)}
          </p>
          <p className="text-[11px] text-zinc-500">~$1,930–$2,095 CAD by class</p>
        </div>
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 p-3.5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            A/C Excise &amp; Tire Levy
          </span>
          <p className="text-base sm:text-lg font-bold font-mono text-zinc-950 dark:text-zinc-50">
            +{formatCurrency(STATUTORY_AC_TAX_CAD + DEFAULT_TIRE_LEVY_CAD)}
          </p>
          <p className="text-[11px] text-zinc-500">$100 A/C tax + ~$20–$25 tire levy</p>
        </div>
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 p-3.5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Pre-Tax Subtotal
          </span>
          <p className="text-base sm:text-lg font-bold font-mono text-zinc-950 dark:text-zinc-50">
            {formatCurrency(subtotalCad)} CAD
          </p>
        </div>
      </div>

      {/* Provincial OTD Comparison Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-500">
              <th className="py-2.5 px-3 font-bold">Province</th>
              <th className="py-2.5 px-3 font-bold">Sales Tax Rate</th>
              <th className="py-2.5 px-3 font-bold">Est. Tax (CAD)</th>
              <th className="py-2.5 px-3 font-bold text-right">Estimated OTD (CAD)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {provinces.map((row) => (
              <tr
                key={row.code}
                data-testid={`otd-row-${row.code.toLowerCase()}`}
                className={
                  row.code === 'AB'
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'bg-white dark:bg-zinc-900/40'
                }
              >
                <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">
                  {row.province} ({row.code})
                  {row.code === 'AB' && (
                    <span className="ml-2 inline-block rounded-full bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                      Lowest OTD in Canada
                    </span>
                  )}
                </td>
                <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-300">
                  {row.taxLabel}
                </td>
                <td className="py-2.5 px-3 font-mono text-zinc-700 dark:text-zinc-300">
                  {formatCurrency(row.taxAmountCad)}
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-right text-zinc-950 dark:text-zinc-50">
                  {formatCurrency(row.estimatedOtdCad)} CAD
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Provincial All-In Pricing Rules Callout */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 p-4 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">
            Provincial All-In Pricing Rules (OMVIC in ON, VSA in BC, AMVIC in AB)
          </p>
          <p>
            Mandatory dealer documentation fees, admin charges, and pre-installed accessories (such as nitrogen tires, etching, or protection packages) cannot be added above a dealer&apos;s advertised all-in price—only HST/GST/PST and licensing/registration sit outside the advertised price.
          </p>
        </div>
      </div>
    </section>
  );
}
