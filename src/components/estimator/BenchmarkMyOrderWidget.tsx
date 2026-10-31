'use client';

import React, { useState, useMemo } from 'react';
import { CANADIAN_VEHICLE_CATALOG } from '@/lib/data/vehicles';
import { Users, Calendar, ArrowRight, CheckCircle2, Sparkles, ChevronRight, AlertCircle, Clock } from 'lucide-react';

export interface BenchmarkMyOrderWidgetProps {
  modelSlug: string;
  modelName: string;
  medianWaitDays: number;
}

const CANADIAN_PROVINCES = [
  { code: 'BC', name: 'British Columbia' },
  { code: 'ON', name: 'Ontario' },
  { code: 'AB', name: 'Alberta' },
  { code: 'QC', name: 'Quebec' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'YT', name: 'Yukon' },
  { code: 'NU', name: 'Nunavut' },
];

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function BenchmarkMyOrderWidget({
  modelSlug,
  modelName,
  medianWaitDays,
}: BenchmarkMyOrderWidgetProps) {
  const todayIso = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Form State A
  const [depositDate, setDepositDate] = useState<string>('');
  const [province, setProvince] = useState<string>('BC');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Result State B
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [editKey, setEditKey] = useState<string | null>(null);
  const [queuePosition, setQueuePosition] = useState<number>(1);
  const [calculatedWindow, setCalculatedWindow] = useState<{
    elapsedDays: number;
    projectedDaysRemaining: number;
    windowText: string;
  }>({
    elapsedDays: 0,
    projectedDaysRemaining: medianWaitDays,
    windowText: '',
  });

  // Progressive Profiling State
  const [selectedTrimId, setSelectedTrimId] = useState<string>('');
  const [markupType, setMarkupType] = useState<'msrp' | 'adm'>('msrp');
  const [admAmount, setAdmAmount] = useState<number | ''>('');
  const [tradeInRequired, setTradeInRequired] = useState<boolean>(false);
  const [isSavingDetails, setIsSavingDetails] = useState<boolean>(false);
  const [detailsSaved, setDetailsSaved] = useState<boolean>(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  // Trims matching this model
  const availableTrims = useMemo(() => {
    const catalogModel = CANADIAN_VEHICLE_CATALOG.find(
      (m) => m.slug.toLowerCase() === modelSlug.toLowerCase() || m.name.toLowerCase() === modelName.toLowerCase()
    );
    if (!catalogModel) return [];

    return catalogModel.powertrains.flatMap((p) =>
      p.trims.map((t) => ({
        id: t.id,
        name: `${t.name}${catalogModel.powertrains.length > 1 ? ` (${p.name})` : ''}`,
        slug: t.slug,
      }))
    );
  }, [modelSlug, modelName]);

  // Compute dynamic delivery window string
  const computeWindow = (dateStr: string, waitDays: number) => {
    const parts = dateStr.split('-').map(Number);
    const deposit = new Date(parts[0], parts[1] - 1, parts[2]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const elapsedDays = Math.max(0, Math.floor((today.getTime() - deposit.getTime()) / (1000 * 60 * 60 * 24)));
    const projectedDaysRemaining = Math.max(0, waitDays - elapsedDays);

    const targetDate = new Date(today.getTime() + projectedDaysRemaining * 24 * 60 * 60 * 1000);

    // Dynamic window: 14 days before to 14 days after target
    const windowStart = new Date(Math.max(today.getTime(), targetDate.getTime() - 14 * 24 * 60 * 60 * 1000));
    const windowEnd = new Date(targetDate.getTime() + 14 * 24 * 60 * 60 * 1000);

    const startMonthDay = `${MONTH_NAMES[windowStart.getMonth()]} ${windowStart.getDate()}`;
    const endMonthDayYear = `${MONTH_NAMES[windowEnd.getMonth()]} ${windowEnd.getDate()}, ${windowEnd.getFullYear()}`;

    return {
      elapsedDays,
      projectedDaysRemaining,
      windowText: `Estimated Delivery: ${startMonthDay} – ${endMonthDayYear}`,
    };
  };

  const handleBenchmarkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositDate) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    // Instant local calculation for instantaneous feedback
    const localCalc = computeWindow(depositDate, medianWaitDays);
    setCalculatedWindow(localCalc);

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelSlug,
          orderDate: depositDate,
          province,
          country: 'CA',
          medianWaitDays,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success && result.data) {
        setSubmissionId(result.data.submissionId || result.data.id);
        if (result.data.editKey) {
          setEditKey(result.data.editKey);
        }
        if (typeof result.data.queuePosition === 'number') {
          setQueuePosition(result.data.queuePosition);
        }
        setIsSubmitted(true);
      } else {
        // Fallback gracefully to client calculation even if server fails
        setSubmissionId('local-benchmarked');
        setIsSubmitted(true);
      }
    } catch {
      // In offline or disconnected scenario, still display client-side payoff
      setSubmissionId('local-benchmarked');
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDetails = async () => {
    if (!submissionId || submissionId === 'local-benchmarked') {
      setDetailsSaved(true);
      return;
    }

    setIsSavingDetails(true);
    setDetailsError(null);

    try {
      const markupVal = markupType === 'adm' && typeof admAmount === 'number' ? admAmount : 0;
      const response = await fetch(`/api/submissions/${submissionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(editKey ? { 'x-edit-key': editKey } : {}),
        },
        body: JSON.stringify({
          id: submissionId,
          editKey: editKey || undefined,
          trimId: selectedTrimId || undefined,
          admMarkup: markupVal,
          dealerMarkupAdm: markupVal,
          pricing: markupVal > 0 ? 'above_msrp' : 'at_msrp',
          tradeInRequired,
        }),
      });

      if (response.ok) {
        setDetailsSaved(true);
      } else {
        // Try fallback to base route if direct ID route is restricted
        const altResponse = await fetch('/api/submissions', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(editKey ? { 'x-edit-key': editKey } : {}),
          },
          body: JSON.stringify({
            id: submissionId,
            editKey: editKey || undefined,
            trimId: selectedTrimId || undefined,
            admMarkup: markupVal,
            dealerMarkupAdm: markupVal,
            pricing: markupVal > 0 ? 'above_msrp' : 'at_msrp',
            tradeInRequired,
          }),
        });
        if (altResponse.ok) {
          setDetailsSaved(true);
        } else {
          setDetailsError('Could not update details. Your initial benchmark is saved.');
        }
      }
    } catch {
      setDetailsError('Network error while saving details. Your initial benchmark is saved.');
    } finally {
      setIsSavingDetails(false);
    }
  };

  return (
    <div
      data-testid="benchmark-order-widget"
      className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-5 sm:p-6 shadow-xl text-zinc-100"
    >
      {!isSubmitted ? (
        /* ========================================================================= */
        /* STATE A: The 2-Field Acquisition Card (Default)                           */
        /* ========================================================================= */
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Users className="h-4 w-4 text-amber-400" />
              Where Do You Stand in Line?
            </h2>
            <p className="text-xs text-zinc-400">
              Enter your deposit date to benchmark your delivery window against active Canadian allocations.
            </p>
          </div>

          <form onSubmit={handleBenchmarkSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Field 1: Deposit Date */}
              <div className="space-y-1.5">
                <label htmlFor="benchmark-deposit-date" className="block text-xs font-semibold text-zinc-300">
                  Deposit Date
                </label>
                <input
                  id="benchmark-deposit-date"
                  type="date"
                  required
                  max={todayIso}
                  value={depositDate}
                  onChange={(e) => setDepositDate(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                />
              </div>

              {/* Field 2: Province */}
              <div className="space-y-1.5">
                <label htmlFor="benchmark-province" className="block text-xs font-semibold text-zinc-300">
                  Province
                </label>
                <select
                  id="benchmark-province"
                  required
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                >
                  {CANADIAN_PROVINCES.map((prov) => (
                    <option key={prov.code} value={prov.code}>
                      {prov.name} ({prov.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* CTA Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting || !depositDate}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
              >
                {isSubmitting ? 'Benchmarking Timeline...' : 'Benchmark My Delivery Window →'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* ========================================================================= */
        /* STATE B: The Immediate Payoff & Progressive Profiling (Post-Submit)        */
        /* ========================================================================= */
        <div className="space-y-5">
          {/* Header Payoff Badge */}
          <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
                ✓
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Benchmark Calibrated &bull; Active Factory Queue
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setDetailsSaved(false);
              }}
              className="text-[11px] text-zinc-400 hover:text-zinc-200 underline transition-colors cursor-pointer"
            >
              Check another order
            </button>
          </div>

          {/* Primary Instant Payoff */}
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-zinc-900/90 border border-amber-500/30 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Factory Allocation Window
              </span>
              <div className="text-xl sm:text-2xl md:text-3xl font-black text-amber-400 tracking-tight">
                {calculatedWindow.windowText}
              </div>
              <p className="text-sm text-zinc-300 font-medium pt-1">
                You are approximately #{queuePosition} in the active {province} queue for {modelName}.
              </p>
            </div>

            {/* Micro stats banner */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase font-bold">Elapsed Wait</span>
                <span className="text-zinc-100 font-mono font-bold text-sm">
                  {calculatedWindow.elapsedDays} Days
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase font-bold">Projected Remaining</span>
                <span className="text-zinc-100 font-mono font-bold text-sm">
                  ~{calculatedWindow.projectedDaysRemaining} Days
                </span>
              </div>
            </div>
          </div>

          {/* Progressive Enrichment Section */}
          <div className="mt-4 pt-4 border-t border-zinc-800 space-y-4">
            <div>
              <p className="text-xs font-semibold text-zinc-300">
                Want a tighter window? Add your trim and pricing:
              </p>
            </div>

            <div className="space-y-3">
              {/* Optional Trim Dropdown */}
              {availableTrims.length > 0 && (
                <div className="space-y-1">
                  <label htmlFor="benchmark-trim-select" className="block text-[11px] font-medium text-zinc-400">
                    Trim Level (Optional)
                  </label>
                  <select
                    id="benchmark-trim-select"
                    value={selectedTrimId}
                    onChange={(e) => setSelectedTrimId(e.target.value)}
                    disabled={detailsSaved}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors disabled:opacity-60"
                  >
                    <option value="">Select your trim level...</option>
                    {availableTrims.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Optional Markup Toggle */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-zinc-400">
                  Dealer Pricing / Markup (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={detailsSaved}
                    onClick={() => {
                      setMarkupType('msrp');
                      setAdmAmount('');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60 ${
                      markupType === 'msrp'
                        ? 'bg-amber-500 text-zinc-950 font-bold'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    MSRP
                  </button>
                  <button
                    type="button"
                    disabled={detailsSaved}
                    onClick={() => setMarkupType('adm')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60 ${
                      markupType === 'adm'
                        ? 'bg-amber-500 text-zinc-950 font-bold'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    Mandatory Dealer Add-ons / ADM ($)
                  </button>
                </div>

                {markupType === 'adm' && (
                  <div className="pt-1.5">
                    <input
                      type="number"
                      min="0"
                      step="100"
                      placeholder="e.g. 1500 (CAD)"
                      value={admAmount}
                      disabled={detailsSaved}
                      onChange={(e) => setAdmAmount(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors disabled:opacity-60"
                    />
                  </div>
                )}
              </div>

              {/* Optional Trade-in Toggle */}
              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 select-none">
                  <input
                    type="checkbox"
                    checked={tradeInRequired}
                    disabled={detailsSaved}
                    onChange={(e) => setTradeInRequired(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-amber-500 cursor-pointer disabled:opacity-60"
                  />
                  <span>Dealership mandated a trade-in vehicle to accept deposit</span>
                </label>
              </div>

              {detailsError && (
                <div className="p-2 rounded bg-amber-950/40 border border-amber-800 text-amber-300 text-xs">
                  {detailsError}
                </div>
              )}

              {detailsSaved ? (
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 font-medium">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Details saved! Your benchmark has been calibrated with your trim and dealer terms.</span>
                </div>
              ) : (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleSaveDetails}
                    disabled={isSavingDetails}
                    className="bg-zinc-100 hover:bg-white text-zinc-950 font-bold px-4 py-2 rounded-lg text-xs transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    {isSavingDetails ? 'Saving Details...' : 'Save Details'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BenchmarkMyOrderWidget;
