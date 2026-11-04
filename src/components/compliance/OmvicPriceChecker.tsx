'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertTriangle,
  Plus,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Phone,
  Scale,
  FileText,
  ArrowLeft,
} from 'lucide-react';
import {
  ONTARIO_MODEL_PRESETS,
  ONTARIO_STATUTORY_DEFAULTS,
  OMVIC_OFFICIAL_URL,
  OMVIC_CONSUMER_PHONE,
  getOntarioRegisteredDealers,
  auditOmvicQuote,
  type OmvicLineItemInput,
} from '@/lib/compliance/omvic';

interface EditableFeeRow extends OmvicLineItemInput {
  id: string;
}

const DEFAULT_FEE_ROWS: EditableFeeRow[] = [
  { id: 'fee-1', label: 'Documentation / Admin Fee', amount: 695 },
  { id: 'fee-2', label: 'Window Security Etch', amount: 499 },
];

const QUICK_FEE_PRESETS: Array<{ label: string; amount: number }> = [
  { label: 'Documentation / Admin Fee', amount: 695 },
  { label: 'Window Security Etch', amount: 499 },
  { label: 'Nitrogen Fill / Wheel Locks', amount: 299 },
  { label: 'Mandatory Protection Package', amount: 1495 },
];

export function OmvicPriceChecker() {
  const ontarioDealers = useMemo(() => getOntarioRegisteredDealers(), []);
  const defaultPreset = ONTARIO_MODEL_PRESETS[0];

  const [selectedModelId, setSelectedModelId] = useState<string>(defaultPreset.id);
  const [dealerName, setDealerName] = useState<string>('');
  const [msrp, setMsrp] = useState<number>(defaultPreset.msrp);
  const [freightPdi, setFreightPdi] = useState<number>(defaultPreset.freightPdi);
  const [acTax, setAcTax] = useState<number>(ONTARIO_STATUTORY_DEFAULTS.acTax);
  const [tireLevy, setTireLevy] = useState<number>(ONTARIO_STATUTORY_DEFAULTS.tireLevy);
  const [omvicFee, setOmvicFee] = useState<number>(ONTARIO_STATUTORY_DEFAULTS.omvicFee);
  const [licensing, setLicensing] = useState<number>(
    ONTARIO_STATUTORY_DEFAULTS.licensingNewPlates
  );
  const [feeRows, setFeeRows] = useState<EditableFeeRow[]>(DEFAULT_FEE_ROWS);
  const [copied, setCopied] = useState<boolean>(false);

  const selectedModel = useMemo(
    () =>
      ONTARIO_MODEL_PRESETS.find((preset) => preset.id === selectedModelId) ||
      ONTARIO_MODEL_PRESETS[0],
    [selectedModelId]
  );

  const handleModelChange = (modelId: string) => {
    setSelectedModelId(modelId);
    const preset = ONTARIO_MODEL_PRESETS.find((p) => p.id === modelId);
    if (preset) {
      setMsrp(preset.msrp);
      setFreightPdi(preset.freightPdi);
    }
  };

  const handleAddFeeRow = (preset?: { label: string; amount: number }) => {
    const nextId = `fee-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setFeeRows((prev) => [
      ...prev,
      {
        id: nextId,
        label: preset?.label ?? '',
        amount: preset?.amount ?? 0,
      },
    ]);
  };

  const handleRemoveFeeRow = (id: string) => {
    setFeeRows((prev) => prev.filter((row) => row.id !== id));
  };

  const handleUpdateFeeRow = (
    id: string,
    field: 'label' | 'amount',
    value: string | number
  ) => {
    setFeeRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        if (field === 'label') {
          return { ...row, label: String(value) };
        }
        const parsed = typeof value === 'number' ? value : parseFloat(value);
        return { ...row, amount: Number.isFinite(parsed) ? Math.max(0, parsed) : 0 };
      })
    );
  };

  const handleClearFees = () => {
    setFeeRows([]);
  };

  const auditResult = useMemo(
    () =>
      auditOmvicQuote({
        dealerName,
        modelName: selectedModel.name,
        msrp,
        freightPdi,
        acTax,
        tireLevy,
        omvicFee,
        licensing,
        additionalFees: feeRows,
      }),
    [
      dealerName,
      selectedModel.name,
      msrp,
      freightPdi,
      acTax,
      tireLevy,
      omvicFee,
      licensing,
      feeRows,
    ]
  );

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(auditResult.rebuttalScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Back Breadcrumb */}
        <div>
          <Link
            href="/inventory"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to Live Ontario &amp; BC Inventory Explorer</span>
          </Link>
        </div>

        {/* Hero Section */}
        <header className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              data-testid="omvic-hero-badge"
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-950/50 px-3 py-1 text-xs font-semibold text-amber-300"
            >
              <Scale className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
              Ontario Consumer Protection Tool
            </span>
            <span className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-0.5 text-[11px] font-medium text-zinc-400">
              MVDA O. Reg. 333/08 s. 36
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            OMVIC All-In Price Checker &amp; Dealer Quote Auditor
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 max-w-3xl leading-relaxed">
            Verify whether your Ontario Toyota dealership quote complies with provincial All-In
            Price Advertising laws. Under the Ontario Motor Vehicle Dealers Act (MVDA), advertised
            vehicle prices must already include Freight, PDI, administration fees, OMVIC fees, and
            pre-installed items—only 13% HST and actual ServiceOntario licensing may be added on
            top.
          </p>
        </header>

        {/* Main Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Quote Input Worksheet */}
          <section
            aria-label="Dealer Quote Worksheet Inputs"
            className="lg:col-span-7 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-amber-400" aria-hidden="true" />
                  1. Enter Your Dealer Worksheet Details
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Select your Toyota model and enter any extra line items added to your quote.
                </p>
              </div>
            </div>

            {/* Vehicle Selector & Dealership Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="omvic-model-select"
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5"
                >
                  Toyota Model
                </label>
                <select
                  id="omvic-model-select"
                  data-testid="omvic-model-select"
                  value={selectedModelId}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                >
                  {ONTARIO_MODEL_PRESETS.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name} (${preset.msrp.toLocaleString('en-CA')} MSRP)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="omvic-dealer-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5"
                >
                  Dealership Name (Optional)
                </label>
                <input
                  id="omvic-dealer-input"
                  data-testid="omvic-dealer-input"
                  type="text"
                  list="ontario-dealers-datalist"
                  value={dealerName}
                  onChange={(e) => setDealerName(e.target.value)}
                  placeholder="e.g. Erin Park Toyota, Ken Shaw Toyota..."
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none"
                />
                <datalist id="ontario-dealers-datalist">
                  {ontarioDealers.map((dealer) => (
                    <option key={dealer.id} value={dealer.name}>
                      {dealer.city}, ON
                    </option>
                  ))}
                </datalist>
              </div>
            </div>

            {/* Statutory / Factory Baseline Inputs */}
            <div className="rounded-xl border border-zinc-800/90 bg-zinc-950/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Statutory &amp; Factory Baseline (Permitted All-In Components)
                </h3>
                <span className="text-[11px] text-zinc-400">Editable</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label
                    htmlFor="omvic-msrp-input"
                    className="block text-[11px] font-medium text-zinc-400 mb-1"
                  >
                    Base / Trim MSRP ($ CAD)
                  </label>
                  <input
                    id="omvic-msrp-input"
                    data-testid="omvic-msrp-input"
                    type="number"
                    min={0}
                    value={msrp}
                    onChange={(e) => setMsrp(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="omvic-freight-input"
                    className="block text-[11px] font-medium text-zinc-400 mb-1"
                  >
                    Toyota Freight &amp; PDI ($)
                  </label>
                  <input
                    id="omvic-freight-input"
                    data-testid="omvic-freight-input"
                    type="number"
                    min={0}
                    value={freightPdi}
                    onChange={(e) => setFreightPdi(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="omvic-licensing-input"
                    className="block text-[11px] font-medium text-zinc-400 mb-1"
                  >
                    ServiceOntario Licensing ($)
                  </label>
                  <input
                    id="omvic-licensing-input"
                    data-testid="omvic-licensing-input"
                    type="number"
                    min={0}
                    value={licensing}
                    onChange={(e) => setLicensing(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="omvic-ac-input"
                    className="block text-[11px] font-medium text-zinc-400 mb-1"
                  >
                    Federal A/C Tax ($)
                  </label>
                  <input
                    id="omvic-ac-input"
                    type="number"
                    min={0}
                    value={acTax}
                    onChange={(e) => setAcTax(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="omvic-tire-input"
                    className="block text-[11px] font-medium text-zinc-400 mb-1"
                  >
                    Ontario Tire Levy ($)
                  </label>
                  <input
                    id="omvic-tire-input"
                    type="number"
                    min={0}
                    value={tireLevy}
                    onChange={(e) => setTireLevy(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="omvic-fee-input"
                    className="block text-[11px] font-medium text-zinc-400 mb-1"
                  >
                    OMVIC Transaction Fee ($)
                  </label>
                  <input
                    id="omvic-fee-input"
                    type="number"
                    min={0}
                    value={omvicFee}
                    onChange={(e) => setOmvicFee(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Dealer-Added Line Items */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    2. Extra Line Items Added by Dealership
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Add any mandatory dealer fees, admin charges, etching, or protection packages on
                    your worksheet.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {feeRows.length > 0 && (
                    <button
                      type="button"
                      data-testid="omvic-clear-fees-btn"
                      onClick={handleClearFees}
                      className="rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
                    >
                      Test Clean Quote ($0 Fees)
                    </button>
                  )}
                  <button
                    type="button"
                    data-testid="omvic-add-fee-btn"
                    onClick={() => handleAddFeeRow({ label: 'Dealer Fee', amount: 495 })}
                    className="inline-flex items-center gap-1 rounded-lg bg-amber-500/20 border border-amber-500/40 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/30 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    Add Line Item
                  </button>
                </div>
              </div>

              {/* Quick Add Common Non-Compliant Fees */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-zinc-400 mr-1">Quick Add:</span>
                {QUICK_FEE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleAddFeeRow(preset)}
                    className="rounded-full border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-[11px] text-zinc-300 hover:border-amber-500/40 hover:text-amber-300 transition-colors"
                  >
                    + {preset.label} (${preset.amount})
                  </button>
                ))}
              </div>

              {/* Fee Input Rows */}
              {feeRows.length === 0 ? (
                <div
                  data-testid="omvic-empty-fees"
                  className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 p-5 text-center text-xs text-zinc-400"
                >
                  No additional dealer line items entered. Click &ldquo;Add Line Item&rdquo; above
                  if your worksheet includes extra charges.
                </div>
              ) : (
                <div className="space-y-2.5" data-testid="omvic-fee-rows">
                  {feeRows.map((row, idx) => (
                    <div
                      key={row.id}
                      data-testid={`omvic-fee-row-${idx}`}
                      className="flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-950/80 p-2.5"
                    >
                      <div className="flex-1">
                        <label htmlFor={`fee-label-${row.id}`} className="sr-only">
                          Fee Name
                        </label>
                        <input
                          id={`fee-label-${row.id}`}
                          type="text"
                          value={row.label}
                          onChange={(e) => handleUpdateFeeRow(row.id, 'label', e.target.value)}
                          placeholder="Fee description (e.g. Doc Fee, Security Etch, Mats)"
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-white placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div className="w-32 sm:w-36">
                        <label htmlFor={`fee-amount-${row.id}`} className="sr-only">
                          Fee Amount ($ CAD)
                        </label>
                        <div className="relative">
                          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-xs text-zinc-400">
                            $
                          </span>
                          <input
                            id={`fee-amount-${row.id}`}
                            type="number"
                            min={0}
                            value={row.amount}
                            onChange={(e) => handleUpdateFeeRow(row.id, 'amount', e.target.value)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 pl-6 pr-2.5 py-1.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFeeRow(row.id)}
                        aria-label={`Remove ${row.label || 'fee row'}`}
                        className="rounded-lg p-2 text-zinc-400 hover:bg-red-950/50 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Audit Result Card & Defense Kit */}
          <section
            aria-label="OMVIC Compliance Audit Results"
            className="lg:col-span-5 space-y-6"
          >
            {/* Visual Scorecard Card */}
            <div
              data-testid="omvic-audit-scorecard"
              className={`rounded-2xl border p-5 sm:p-6 shadow-xl space-y-5 ${
                auditResult.isCompliant
                  ? 'border-emerald-500/40 bg-emerald-950/20'
                  : 'border-red-500/40 bg-red-950/20'
              }`}
            >
              <div className="flex items-start gap-3">
                {auditResult.isCompliant ? (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                    <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/20 border border-red-500/40 text-red-400">
                    <AlertTriangle className="h-6 w-6" aria-hidden="true" />
                  </div>
                )}

                <div>
                  <span
                    data-testid="omvic-status-badge"
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                      auditResult.isCompliant
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}
                  >
                    {auditResult.isCompliant
                      ? '🟢 Compliant All-In Quote'
                      : '🔴 Non-Compliant Fees Detected'}
                  </span>
                  <h2 className="text-lg font-extrabold text-white mt-1">
                    {auditResult.isCompliant
                      ? '0 Unapproved Mandatory Fees'
                      : `Non-Compliant Overcharge Total: $${auditResult.potentialOvercharge.toLocaleString('en-CA')} CAD`}
                  </h2>
                </div>
              </div>

              {/* Financial Breakdown Summary */}
              <div className="rounded-xl border border-zinc-800/90 bg-zinc-950/80 p-4 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-300">
                  <span>Statutory All-In Pre-Tax Price:</span>
                  <span className="font-semibold text-white">
                    ${auditResult.statutoryAllInPrice.toLocaleString('en-CA')} CAD
                  </span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Dealer Quoted Pre-Tax Total:</span>
                  <span className="font-semibold text-white">
                    ${auditResult.dealerQuotedTotal.toLocaleString('en-CA')} CAD
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Estimated 13% Ontario HST (on statutory):</span>
                  <span>${auditResult.hstAmount.toLocaleString('en-CA')} CAD</span>
                </div>
                <div className="border-t border-zinc-800 pt-2 flex justify-between text-sm font-bold">
                  <span className={auditResult.isCompliant ? 'text-emerald-400' : 'text-red-400'}>
                    Potential Non-Compliant Overcharge:
                  </span>
                  <span
                    data-testid="omvic-overcharge-amount"
                    className={auditResult.isCompliant ? 'text-emerald-400' : 'text-red-400'}
                  >
                    ${auditResult.potentialOvercharge.toLocaleString('en-CA')} CAD
                  </span>
                </div>
              </div>

              {/* Flagged Items Breakdown */}
              {auditResult.flaggedItems.length > 0 && (
                <div className="space-y-2.5" data-testid="omvic-flagged-items-list">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Flagged Non-Compliant Line Items ({auditResult.flaggedItems.length})
                  </h3>
                  <ul className="space-y-2">
                    {auditResult.flaggedItems.map((item) => (
                      <li
                        key={item.id}
                        className="rounded-xl border border-red-500/30 bg-zinc-950/90 p-3 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-bold text-red-300">
                          <span>{item.label}</span>
                          <span>+${item.amount.toLocaleString('en-CA')} CAD</span>
                        </div>
                        <div className="text-[11px] font-medium text-amber-400/90">
                          Category: {item.category}
                        </div>
                        <p className="text-zinc-300 leading-relaxed">{item.reason}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actionable Defense Kit: Rebuttal Email Generator */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white">
                    OMVIC-Backed Buyer Rebuttal Script
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Send this directly to your sales representative or finance manager to request a
                    compliant bill of sale.
                  </p>
                </div>
              </div>

              <div
                data-testid="omvic-rebuttal-script"
                className="rounded-xl border border-zinc-800 bg-zinc-950 p-3.5 text-xs sm:text-sm text-zinc-200 leading-relaxed font-mono select-all"
              >
                {auditResult.rebuttalScript}
              </div>

              <button
                type="button"
                data-testid="omvic-copy-script-btn"
                onClick={handleCopyScript}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm py-2.5 px-4 transition-colors shadow-sm cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" aria-hidden="true" />
                    <span>Copied Rebuttal Script to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" aria-hidden="true" />
                    <span>Copy Script to Clipboard</span>
                  </>
                )}
              </button>

              {/* Official OMVIC Consumer Protection Resources */}
              <div className="border-t border-zinc-800 pt-4 space-y-2.5 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-zinc-400">
                  Official OMVIC Consumer Support Resources
                </h4>
                <div className="flex flex-col gap-2">
                  <a
                    href={OMVIC_OFFICIAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="omvic-official-guide-link"
                    className="inline-flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-amber-400 hover:border-amber-500/40 hover:text-amber-300 font-semibold transition-colors"
                  >
                    <span>OMVIC All-In Price Advertising Consumer Guide</span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  </a>

                  <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-zinc-300">
                    <span className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                      <span>OMVIC Consumer Support Line:</span>
                    </span>
                    <a
                      href={`tel:${OMVIC_CONSUMER_PHONE}`}
                      data-testid="omvic-support-phone"
                      className="font-bold text-white hover:text-amber-400 transition-colors"
                    >
                      {OMVIC_CONSUMER_PHONE}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default OmvicPriceChecker;
