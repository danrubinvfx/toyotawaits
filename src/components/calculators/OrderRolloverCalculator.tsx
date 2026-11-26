'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Calendar,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Calculator,
  FileText,
} from 'lucide-react';

export type PriceProtectionStatus = 'locked' | 'verbal' | 'msrp_at_delivery';

export type TaxRegionCode =
  | 'ON'
  | 'BC'
  | 'AB'
  | 'QC'
  | 'US_AVG'
  | 'CA_STATE'
  | 'TX'
  | 'FL'
  | 'NY'
  | 'OR';

export interface TaxRegionOption {
  code: TaxRegionCode;
  label: string;
  rate: number;
  market: 'CA' | 'US';
}

export const TAX_REGIONS: Record<TaxRegionCode, TaxRegionOption> = {
  ON: { code: 'ON', label: 'Ontario (13% HST)', rate: 0.13, market: 'CA' },
  BC: { code: 'BC', label: 'British Columbia (12% GST+PST)', rate: 0.12, market: 'CA' },
  AB: { code: 'AB', label: 'Alberta (5% GST)', rate: 0.05, market: 'CA' },
  QC: { code: 'QC', label: 'Quebec (14.975% GST+QST)', rate: 0.14975, market: 'CA' },
  US_AVG: { code: 'US_AVG', label: 'US State Average (7.5% Tax)', rate: 0.075, market: 'US' },
  CA_STATE: { code: 'CA_STATE', label: 'California (8.75% Tax)', rate: 0.0875, market: 'US' },
  TX: { code: 'TX', label: 'Texas (6.25% Tax)', rate: 0.0625, market: 'US' },
  FL: { code: 'FL', label: 'Florida (6.0% Tax)', rate: 0.06, market: 'US' },
  NY: { code: 'NY', label: 'New York (8.0% Tax)', rate: 0.08, market: 'US' },
  OR: { code: 'OR', label: 'Oregon / No Sales Tax (0%)', rate: 0, market: 'US' },
};

import {
  ROLLOVER_MODEL_DELTAS,
  getModelRolloverDeltas,
  type RolloverDeltaConfig,
} from '@/lib/data/rollover-deltas';

export { ROLLOVER_MODEL_DELTAS, getModelRolloverDeltas, type RolloverDeltaConfig };

export type RolloverRiskTier =
  | 'Likely 2026 Allocation'
  | 'High 2027 Rollover Risk'
  | 'Confirmed 2027 Build Window';

export interface RolloverCalculationResult {
  estimatedDate: Date;
  estimatedWindowLabel: string;
  riskTier: RolloverRiskTier;
  baseMsrp: number;
  my27Msrp: number;
  my27Delta: number;
  taxRate: number;
  addedTax: number;
  otdImpact: number;
  baseOtd: number;
  my27Otd: number;
}

export function getDefaultDepositDateString(referenceDate: Date = new Date()): string {
  const d = new Date(referenceDate.getTime());
  d.setUTCMonth(d.getUTCMonth() - 4);
  return d.toISOString().split('T')[0];
}

export function calculateRolloverProjection(params: {
  depositDateStr: string;
  medianWaitDays: number;
  baseMsrp: number;
  my27Delta: number;
  taxRate: number;
  isUS: boolean;
}): RolloverCalculationResult {
  const { depositDateStr, medianWaitDays, baseMsrp, my27Delta, taxRate, isUS } = params;

  const parsed = new Date(`${depositDateStr}T12:00:00Z`);
  const baseMs = Number.isNaN(parsed.getTime())
    ? new Date(`${getDefaultDepositDateString()}T12:00:00Z`).getTime()
    : parsed.getTime();

  const rawDeliveryMs = baseMs + Math.max(0, medianWaitDays) * 24 * 60 * 60 * 1000;
  const minMs = Date.UTC(2026, 0, 1, 12, 0, 0);
  const maxMs = Date.UTC(2027, 11, 31, 12, 0, 0);
  const clampedMs = Math.min(maxMs, Math.max(minMs, rawDeliveryMs));
  const estimatedDate = new Date(clampedMs);

  const rolloverStartMs = Date.UTC(2026, 9, 15, 0, 0, 0); // Oct 15, 2026
  const confirmed2027Ms = Date.UTC(2027, 1, 1, 0, 0, 0); // Feb 1, 2027

  let riskTier: RolloverRiskTier = 'Likely 2026 Allocation';
  if (clampedMs >= confirmed2027Ms) {
    riskTier = 'Confirmed 2027 Build Window';
  } else if (clampedMs >= rolloverStartMs) {
    riskTier = 'High 2027 Rollover Risk';
  }

  const locale = isUS ? 'en-US' : 'en-CA';
  const windowStart = new Date(Math.max(minMs, clampedMs - 15 * 24 * 60 * 60 * 1000));
  const windowEnd = new Date(Math.min(maxMs, clampedMs + 15 * 24 * 60 * 60 * 1000));
  const startLabel = windowStart.toLocaleDateString(locale, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const endLabel = windowEnd.toLocaleDateString(locale, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const estimatedWindowLabel =
    startLabel === endLabel ? startLabel : `${startLabel} – ${endLabel}`;

  const my27Msrp = baseMsrp + my27Delta;
  const baseOtd = Math.round(baseMsrp * (1 + taxRate));
  const my27Otd = Math.round(my27Msrp * (1 + taxRate));
  const otdImpact = my27Otd - baseOtd;
  const addedTax = otdImpact - my27Delta;

  return {
    estimatedDate,
    estimatedWindowLabel,
    riskTier,
    baseMsrp,
    my27Msrp,
    my27Delta,
    taxRate,
    addedTax,
    otdImpact,
    baseOtd,
    my27Otd,
  };
}

export interface OrderRolloverCalculatorProps {
  modelSlug: string;
  modelName: string;
  baseMsrpCad: number;
  baseMsrpUsd: number;
  my27DeltaCad: number;
  my27DeltaUsd: number;
  medianWaitDays: number;
  isUS?: boolean;
  initialMarket?: 'CA' | 'US';
}

export function OrderRolloverCalculator({
  modelSlug,
  modelName,
  baseMsrpCad,
  baseMsrpUsd,
  my27DeltaCad,
  my27DeltaUsd,
  medianWaitDays,
  isUS,
  initialMarket,
}: OrderRolloverCalculatorProps) {
  const initialIsUS = isUS ?? initialMarket === 'US';
  const [marketIsUS, setMarketIsUS] = useState<boolean>(initialIsUS);
  const [depositDate, setDepositDate] = useState<string>(() => getDefaultDepositDateString());
  const [regionCode, setRegionCode] = useState<TaxRegionCode>(initialIsUS ? 'US_AVG' : 'ON');
  const [protectionStatus, setProtectionStatus] =
    useState<PriceProtectionStatus>('msrp_at_delivery');

  const handleMarketSwitch = (nextIsUS: boolean) => {
    setMarketIsUS(nextIsUS);
    setRegionCode((prev) => {
      const currentRegion = TAX_REGIONS[prev];
      if (nextIsUS && currentRegion.market !== 'US') return 'US_AVG';
      if (!nextIsUS && currentRegion.market !== 'CA') return 'ON';
      return prev;
    });
  };

  const selectedRegion = TAX_REGIONS[regionCode] ?? (marketIsUS ? TAX_REGIONS.US_AVG : TAX_REGIONS.ON);
  const activeBaseMsrp = marketIsUS ? baseMsrpUsd : baseMsrpCad;
  const activeMy27Delta = marketIsUS ? my27DeltaUsd : my27DeltaCad;
  const currencyCode = marketIsUS ? 'USD' : 'CAD';

  const result = useMemo(
    () =>
      calculateRolloverProjection({
        depositDateStr: depositDate,
        medianWaitDays,
        baseMsrp: activeBaseMsrp,
        my27Delta: activeMy27Delta,
        taxRate: selectedRegion.rate,
        isUS: marketIsUS,
      }),
    [depositDate, medianWaitDays, activeBaseMsrp, activeMy27Delta, selectedRegion.rate, marketIsUS]
  );

  const fmt = useCallback(
    (amount: number) =>
      `${new Intl.NumberFormat(marketIsUS ? 'en-US' : 'en-CA', {
        style: 'currency',
        currency: currencyCode,
        maximumFractionDigits: 0,
      }).format(amount)} ${currencyCode}`,
    [marketIsUS, currencyCode]
  );

  const riskBadgeClass =
    result.riskTier === 'Likely 2026 Allocation'
      ? 'bg-emerald-600 text-white'
      : result.riskTier === 'High 2027 Rollover Risk'
        ? 'bg-amber-500 text-zinc-950'
        : 'bg-red-600 text-white';

  const checklistItems = useMemo(() => {
    if (protectionStatus === 'locked') {
      return [
        'Verify your signed Bill of Sale explicitly locks Manufacturer Suggested Retail Price (MSRP) rather than only dealer-installed accessories.',
        'Confirm whether factory freight/destination fee adjustments are capped or passed through upon 2027 VIN assignment.',
        'Keep a dated PDF/photo of your signed Bill of Sale and deposit receipt; request written confirmation when your order rolls to a 2027 VTN.',
      ];
    }
    if (protectionStatus === 'verbal') {
      return [
        'Request a signed Price Protection Addendum from the Sales Manager immediately—verbal promises are not enforceable at delivery.',
        'Confirm in writing that your deposit is 100% refundable if the 2027 MSRP increase exceeds your budget.',
        'Consider placing a second refundable deposit at a transparent, MSRP-only dealership as backup leverage.',
      ];
    }
    return [
      `Budget for an estimated +${fmt(result.otdImpact)} out-the-door increase if your allocation rolls into a 2027 build window.`,
      'Negotiate away non-mandatory dealer add-ons (VIN etching, nitrogen, admin/doc markups) to offset the MY27 MSRP bump.',
      'Ask your sales advisor to flag you for any cancelled incoming 2026 allocations so you can lock 2026 pricing before changeover.',
    ];
  }, [protectionStatus, result.otdImpact, fmt]);

  return (
    <Card
      id="rollover-calculator"
      data-testid={`order-rollover-calculator-${modelSlug}`}
      className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden"
    >
      <CardHeader className="bg-zinc-50 dark:bg-zinc-900/70 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="border-red-500/40 text-red-600 dark:text-red-400 text-xs font-bold">
                <Calculator className="w-3 h-3 mr-1" />
                2026 → 2027 Price-Protection Calculator
              </Badge>
              <Badge className={`text-xs font-bold ${riskBadgeClass}`} data-testid="rollover-risk-badge">
                {result.riskTier}
              </Badge>
            </div>
            <CardTitle className="text-lg sm:text-xl font-extrabold text-zinc-950 dark:text-zinc-50">
              {modelName} Order Rollover &amp; OTD Tax Impact
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              Estimate whether your deposit will clear as a 2026 build or roll into 2027 pricing (based on ~{medianWaitDays}-day median wait).
            </CardDescription>
          </div>

          <div
            className="inline-flex rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-0.5 self-start shrink-0"
            role="group"
            aria-label="Rollover Calculator Currency Market"
          >
            <button
              type="button"
              onClick={() => handleMarketSwitch(false)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                !marketIsUS
                  ? 'bg-red-600 text-white'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              CAD
            </button>
            <button
              type="button"
              onClick={() => handleMarketSwitch(true)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                marketIsUS
                  ? 'bg-red-600 text-white'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              USD
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-6">
        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor={`deposit-date-${modelSlug}`} className="text-xs font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              Deposit Placed Date
            </Label>
            <Input
              id={`deposit-date-${modelSlug}`}
              type="date"
              value={depositDate}
              onChange={(e) => setDepositDate(e.target.value)}
              className="text-sm bg-zinc-50 dark:bg-zinc-900"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`tax-region-${modelSlug}`} className="text-xs font-semibold">
              Province / State Tax Rate
            </Label>
            <select
              id={`tax-region-${modelSlug}`}
              value={regionCode}
              onChange={(e) => setRegionCode(e.target.value as TaxRegionCode)}
              className="w-full h-9 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <optgroup label="Canada">
                <option value="ON">{TAX_REGIONS.ON.label}</option>
                <option value="BC">{TAX_REGIONS.BC.label}</option>
                <option value="AB">{TAX_REGIONS.AB.label}</option>
                <option value="QC">{TAX_REGIONS.QC.label}</option>
              </optgroup>
              <optgroup label="United States">
                <option value="US_AVG">{TAX_REGIONS.US_AVG.label}</option>
                <option value="CA_STATE">{TAX_REGIONS.CA_STATE.label}</option>
                <option value="TX">{TAX_REGIONS.TX.label}</option>
                <option value="FL">{TAX_REGIONS.FL.label}</option>
                <option value="NY">{TAX_REGIONS.NY.label}</option>
                <option value="OR">{TAX_REGIONS.OR.label}</option>
              </optgroup>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`protection-status-${modelSlug}`} className="text-xs font-semibold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-zinc-500" />
              Dealer Price-Protection Status
            </Label>
            <select
              id={`protection-status-${modelSlug}`}
              value={protectionStatus}
              onChange={(e) => setProtectionStatus(e.target.value as PriceProtectionStatus)}
              className="w-full h-9 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="locked">Locked in writing on Bill of Sale</option>
              <option value="verbal">Verbal promise only</option>
              <option value="msrp_at_delivery">Standard MSRP-at-delivery clause</option>
            </select>
          </div>
        </div>

        {/* Computed Outputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Estimated Delivery Window
            </div>
            <div
              className="text-lg sm:text-xl font-extrabold text-zinc-900 dark:text-zinc-50"
              data-testid="rollover-delivery-window"
            >
              {result.estimatedWindowLabel}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              Deposit + {medianWaitDays} days (clamped 2026–2027)
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              2026 vs. 2027 MSRP Jump
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
              +{fmt(result.my27Delta)}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {fmt(result.baseMsrp)} → {fmt(result.my27Msrp)} MSRP
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border space-y-1 ${
              protectionStatus === 'locked'
                ? 'border-emerald-500/40 bg-emerald-50/60 dark:bg-emerald-950/20'
                : 'border-red-500/30 bg-red-50/60 dark:bg-red-950/20'
            }`}
          >
            <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Out-the-Door Impact (incl. {(selectedRegion.rate * 100).toFixed(selectedRegion.rate === 0.14975 ? 3 : 1).replace(/\.0$/, '')}% tax)
            </div>
            <div
              className={`text-lg sm:text-xl font-extrabold ${
                protectionStatus === 'locked'
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
              data-testid="rollover-otd-impact"
            >
              +{fmt(result.otdImpact)}
            </div>
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              {protectionStatus === 'locked'
                ? 'Protected by signed Bill of Sale'
                : `MSRP +${fmt(result.my27Delta)} & tax +${fmt(result.addedTax)}`}
            </div>
          </div>
        </div>

        {/* Actionable Negotiation Checklist */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 space-y-2.5">
          <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
            {protectionStatus === 'locked' ? (
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : protectionStatus === 'verbal' ? (
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            )}
            <span>Actionable Negotiation Checklist</span>
          </div>
          <ul className="space-y-1.5 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
            {checklistItems.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default OrderRolloverCalculator;
