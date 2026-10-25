'use client';

import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle2, Loader2, ShieldCheck, X } from 'lucide-react';

export interface InventoryAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialModel?: string;
  initialTrim?: string;
  initialPowertrain?: string;
  initialRegion?: string;
  availableModels?: string[];
}

const QUICK_MODELS = [
  'Sienna',
  'RAV4 Hybrid',
  'RAV4 Plug-in Hybrid',
  'RAV4',
  'Tacoma',
  'Grand Highlander Hybrid',
  'Prius Prime',
  'Camry Hybrid',
  'Corolla Cross Hybrid',
  'Land Cruiser',
];

const QUICK_TRIMS = [
  'ALL',
  'LE',
  'XLE',
  'SE',
  'XSE',
  'Limited',
  'Platinum',
  'TRD Off-Road',
  'TRD Sport',
];

const POWERTRAIN_OPTIONS = ['ALL', 'Hybrid', 'Plug-in Hybrid', 'Gas'];

const REGION_OPTIONS = [
  'Lower Mainland, BC',
  'Vancouver, BC',
  'Surrey, BC',
  'Richmond, BC',
  'Pitt Meadows, BC',
  'Burnaby, BC',
  'Jim Pattison Toyota Downtown',
  'Jim Pattison Toyota Surrey',
  'West Coast Toyota',
  'Regency Toyota',
  'OpenRoad Toyota Richmond',
];

export function InventoryAlertModal({
  isOpen,
  onClose,
  initialModel = '',
  initialTrim = '',
  initialPowertrain = 'ALL',
  initialRegion = 'Lower Mainland, BC',
  availableModels = QUICK_MODELS,
}: InventoryAlertModalProps) {
  const [email, setEmail] = useState('');
  const [model, setModel] = useState(initialModel || 'Sienna');
  const [trim, setTrim] = useState(initialTrim || 'ALL');
  const [powertrain, setPowertrain] = useState(initialPowertrain || 'ALL');
  const [region, setRegion] = useState(initialRegion || 'Lower Mainland, BC');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync pre-filled criteria when modal opens or active filters change
  useEffect(() => {
    if (isOpen) {
      setModel(initialModel && initialModel.trim() ? initialModel.trim() : 'Sienna');
      setTrim(initialTrim && initialTrim.trim() ? initialTrim.trim() : 'ALL');
      setPowertrain(
        initialPowertrain && initialPowertrain.trim() ? initialPowertrain.trim() : 'ALL'
      );
      setRegion(
        initialRegion && initialRegion.trim() ? initialRegion.trim() : 'Lower Mainland, BC'
      );
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen, initialModel, initialTrim, initialPowertrain, initialRegion]);

  if (!isOpen) return null;

  const modelChoices = Array.from(
    new Set([...QUICK_MODELS, ...availableModels, ...(model ? [model] : [])])
  ).filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!model.trim()) {
      setErrorMessage('Please choose a model to monitor.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/alerts/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          model: model.trim(),
          powertrain: powertrain.trim() || 'ALL',
          trim: trim.trim() || 'ALL',
          region: region.trim() || 'Lower Mainland, BC',
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || (data && data.success === false)) {
        setErrorMessage(data?.error || 'Could not save alert subscription. Please try again.');
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage(
        data?.message ||
          `You're subscribed! We'll notify ${trimmedEmail} when a matching ${model} (${
            trim === 'ALL' ? 'Any Trim' : trim
          }) drops in ${region}.`
      );
      setIsSubmitting(false);
    } catch {
      setErrorMessage('Network error while subscribing. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      data-testid="inventory-alert-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inventory-alert-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4"
    >
      <div className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6 text-zinc-100 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Bell className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="inventory-alert-modal-title"
                className="text-base sm:text-lg font-bold text-white tracking-tight"
              >
                Allocation Drop Alerts (&ldquo;Notify Me&rdquo;)
              </h2>
              <p className="text-xs text-zinc-400">
                Get instant email alerts when matching dealer inventory or canceled allocations land.
              </p>
            </div>
          </div>
          <button
            type="button"
            data-testid="close-alert-modal-btn"
            onClick={onClose}
            aria-label="Close drop alerts modal"
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-white transition"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {successMessage ? (
          <div
            data-testid="alert-success-state"
            className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-5 text-center space-y-3"
          >
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="text-base font-bold text-white">Drop Alert Activated!</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">{successMessage}</p>
            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                type="button"
                data-testid="alert-done-btn"
                onClick={onClose}
                className="rounded-lg bg-zinc-800 hover:bg-zinc-700 px-4 py-2 text-xs font-semibold text-white transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Quick Model Toggles */}
            <div className="space-y-1.5">
              <label
                htmlFor="alert-model-select"
                className="text-xs font-semibold text-zinc-300 block"
              >
                1. Target Model
              </label>
              <div
                className="flex flex-wrap gap-1.5 pb-1"
                role="group"
                aria-label="Quick model toggles"
              >
                {QUICK_MODELS.slice(0, 6).map((quickModel) => {
                  const isSelected = model.toLowerCase() === quickModel.toLowerCase();
                  return (
                    <button
                      key={quickModel}
                      type="button"
                      data-testid={`quick-model-${quickModel.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                      onClick={() => setModel(quickModel)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium border transition ${
                        isSelected
                          ? 'bg-red-600/20 border-red-500 text-red-300 font-semibold'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      {quickModel}
                    </button>
                  );
                })}
              </div>
              <select
                id="alert-model-select"
                data-testid="alert-model-select"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                {modelChoices.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Trim & Powertrain Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="alert-trim-input"
                  className="text-xs font-semibold text-zinc-300 block"
                >
                  2. Trim Preference
                </label>
                <div className="flex flex-wrap gap-1">
                  {QUICK_TRIMS.slice(0, 6).map((t) => {
                    const isSelected = trim.toLowerCase() === t.toLowerCase();
                    return (
                      <button
                        key={t}
                        type="button"
                        data-testid={`quick-trim-${t.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                        onClick={() => setTrim(t)}
                        className={`rounded-md px-2 py-0.5 text-[11px] font-medium border transition ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {t === 'ALL' ? 'Any Trim' : t}
                      </button>
                    );
                  })}
                </div>
                <input
                  id="alert-trim-input"
                  data-testid="alert-trim-input"
                  type="text"
                  value={trim}
                  onChange={(e) => setTrim(e.target.value)}
                  placeholder="ALL or specific trim (e.g. XSE AWD)"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="alert-powertrain-select"
                  className="text-xs font-semibold text-zinc-300 block"
                >
                  3. Powertrain
                </label>
                <div className="flex flex-wrap gap-1">
                  {POWERTRAIN_OPTIONS.map((pt) => {
                    const isSelected = powertrain.toLowerCase() === pt.toLowerCase();
                    return (
                      <button
                        key={pt}
                        type="button"
                        data-testid={`quick-powertrain-${pt.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                        onClick={() => setPowertrain(pt)}
                        className={`rounded-md px-2 py-0.5 text-[11px] font-medium border transition ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {pt === 'ALL' ? 'All' : pt}
                      </button>
                    );
                  })}
                </div>
                <select
                  id="alert-powertrain-select"
                  data-testid="alert-powertrain-select"
                  value={powertrain}
                  onChange={(e) => setPowertrain(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-100 focus:border-red-500 focus:outline-none"
                >
                  {POWERTRAIN_OPTIONS.map((pt) => (
                    <option key={pt} value={pt}>
                      {pt === 'ALL' ? 'All Powertrains' : pt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dealership / Region */}
            <div className="space-y-1.5">
              <label
                htmlFor="alert-region-select"
                className="text-xs font-semibold text-zinc-300 block"
              >
                4. Dealership / Region
              </label>
              <select
                id="alert-region-select"
                data-testid="alert-region-select"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 focus:border-red-500 focus:outline-none"
              >
                {REGION_OPTIONS.map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>

            {/* Email Input + Zero-PII Disclaimer */}
            <div className="space-y-1.5">
              <label
                htmlFor="alert-email-input"
                className="text-xs font-semibold text-zinc-300 block"
              >
                5. Email Address
              </label>
              <input
                id="alert-email-input"
                data-testid="alert-email-input"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <p
                data-testid="alert-zero-pii-disclaimer"
                className="text-[11px] text-zinc-400 flex items-start gap-1.5 pt-0.5 leading-snug"
              >
                <ShieldCheck
                  className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>
                  We only use your email to alert you when a matching vehicle lands. Zero spam, unsubscribe anytime.
                </span>
              </p>
            </div>

            {errorMessage && (
              <div
                data-testid="alert-error-message"
                role="alert"
                className="rounded-lg border border-red-800/60 bg-red-950/50 px-3 py-2 text-xs text-red-300"
              >
                {errorMessage}
              </div>
            )}

            {/* Submit Actions */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 px-3.5 py-2 text-xs font-medium text-zinc-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                data-testid="alert-submit-btn"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-60 px-4 py-2 text-xs font-semibold text-white shadow-sm transition"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    <span>Saving Alert...</span>
                  </>
                ) : (
                  <>
                    <Bell className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Notify Me When In Stock</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
