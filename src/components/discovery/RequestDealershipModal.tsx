'use client';

import React, { useEffect, useState } from 'react';
import { Building2, CheckCircle2, Loader2, MapPin, X } from 'lucide-react';
import type { FilterState } from './InventoryFilterBar';

export interface RequestDealershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCity?: string;
  initialProvince?: string;
  sourceFilterState?: FilterState | Record<string, unknown>;
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

export function RequestDealershipModal({
  isOpen,
  onClose,
  initialCity = '',
  initialProvince = 'BC',
  sourceFilterState = {},
}: RequestDealershipModalProps) {
  const [dealerName, setDealerName] = useState('');
  const [city, setCity] = useState(initialCity);
  const [province, setProvince] = useState(initialProvince || 'BC');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [notifyWhenAdded, setNotifyWhenAdded] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync state whenever the modal opens or props change
  useEffect(() => {
    if (isOpen) {
      setDealerName('');
      setCity(initialCity || '');
      setProvince(initialProvince || 'BC');
      setWebsiteUrl('');
      setUserEmail('');
      setNotifyWhenAdded(false);
      setIsSubmitting(false);
      setErrorMessage(null);
      setIsSubmitted(false);
    }
  }, [isOpen, initialCity, initialProvince]);

  // Handle ESC key press to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedDealerName = dealerName.trim();
    const trimmedCity = city.trim();
    const trimmedProvince = province.trim();
    const trimmedWebsite = websiteUrl.trim();
    const trimmedEmail = userEmail.trim().toLowerCase();

    if (!trimmedDealerName) {
      setErrorMessage('Please enter the dealership name.');
      return;
    }

    if (!trimmedCity) {
      setErrorMessage('Please enter the city or municipality.');
      return;
    }

    if (!trimmedProvince) {
      setErrorMessage('Please select a province.');
      return;
    }

    if (trimmedEmail) {
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(trimmedEmail)) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
    }

    if (notifyWhenAdded && !trimmedEmail) {
      setErrorMessage('Please enter your email so we can notify you when this dealer is added.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/dealers/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealerName: trimmedDealerName,
          city: trimmedCity,
          province: trimmedProvince,
          websiteUrl: trimmedWebsite || null,
          userEmail: trimmedEmail || null,
          notifyWhenAdded,
          sourceFilterState,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        setErrorMessage(
          data?.error || 'Unable to submit dealership request. Please try again.'
        );
        setIsSubmitting(false);
        return;
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Dealership request submission failed:', err);
      setErrorMessage('Network error occurred. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      data-testid="request-dealership-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-dealership-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 max-w-md w-full shadow-2xl text-zinc-100 space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 shrink-0">
              <Building2 className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="request-dealership-modal-title"
                className="text-base sm:text-lg font-bold text-white tracking-tight"
              >
                Request Dealership
              </h2>
              <p className="text-xs text-zinc-400">
                Help us expand live allocation coverage to your local Toyota dealer.
              </p>
            </div>
          </div>
          <button
            type="button"
            data-testid="close-dealership-modal-btn"
            onClick={onClose}
            aria-label="Close dealership request modal"
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-white transition"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {isSubmitted ? (
          /* Confirmation Screen */
          <div
            data-testid="dealer-request-success-state"
            className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-5 text-center space-y-3"
          >
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="text-base font-bold text-white">Dealership Request Received!</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Thanks for letting us know! We prioritize dealer inventory sweeps based on community demand.
              {notifyWhenAdded && userEmail
                ? ` We'll email ${userEmail} once ${dealerName || 'this store'} goes live.`
                : ''}
            </p>
            <div className="pt-2">
              <button
                type="button"
                data-testid="close-dealer-success-btn"
                onClick={onClose}
                className="w-full rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs py-2.5 transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Intake Form */
          <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
            {errorMessage && (
              <div
                role="alert"
                data-testid="dealer-request-error"
                className="rounded-lg border border-red-800/80 bg-red-950/40 p-2.5 text-xs text-red-200"
              >
                {errorMessage}
              </div>
            )}

            {/* Dealership Name */}
            <div className="space-y-1">
              <label
                htmlFor="request-dealer-name"
                className="text-xs font-medium text-zinc-300 block"
              >
                Dealership Name <span className="text-red-400">*</span>
              </label>
              <input
                id="request-dealer-name"
                data-testid="request-dealer-name-input"
                type="text"
                required
                placeholder="e.g. Regency Toyota or Erin Park Toyota"
                value={dealerName}
                onChange={(e) => setDealerName(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50"
              />
            </div>

            {/* City & Province Row */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label
                  htmlFor="request-dealer-city"
                  className="text-xs font-medium text-zinc-300 block"
                >
                  City / Municipality <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="request-dealer-city"
                    data-testid="request-dealer-city-input"
                    type="text"
                    required
                    placeholder="e.g. Vancouver"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 pl-7 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50"
                  />
                  <MapPin className="h-3.5 w-3.5 text-zinc-500 absolute left-2 top-2.5 pointer-events-none" aria-hidden="true" />
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="request-dealer-province"
                  className="text-xs font-medium text-zinc-300 block"
                >
                  Province <span className="text-red-400">*</span>
                </label>
                <select
                  id="request-dealer-province"
                  data-testid="request-dealer-province-select"
                  required
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-2 text-xs text-zinc-100 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50"
                >
                  {CANADIAN_PROVINCES.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name} ({p.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Website or Inventory URL */}
            <div className="space-y-1">
              <label
                htmlFor="request-dealer-url"
                className="text-xs font-medium text-zinc-300 block"
              >
                Website or Inventory URL <span className="text-zinc-500 font-normal">(Optional)</span>
              </label>
              <input
                id="request-dealer-url"
                data-testid="request-dealer-url-input"
                type="url"
                placeholder="https://www.exampletoyota.ca"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label
                htmlFor="request-dealer-email"
                className="text-xs font-medium text-zinc-300 block"
              >
                Your Email <span className="text-zinc-500 font-normal">(Optional)</span>
              </label>
              <input
                id="request-dealer-email"
                data-testid="request-dealer-email-input"
                type="email"
                placeholder="buyer@example.ca"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50"
              />
            </div>

            {/* Notify Me Checkbox */}
            <label className="flex items-start gap-2 pt-1 cursor-pointer select-none text-xs text-zinc-300">
              <input
                id="request-dealer-notify"
                data-testid="request-dealer-notify-checkbox"
                type="checkbox"
                checked={notifyWhenAdded}
                onChange={(e) => setNotifyWhenAdded(e.target.checked)}
                disabled={isSubmitting}
                className="mt-0.5 rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-0 h-3.5 w-3.5"
              />
              <span>Notify me when this dealer is added</span>
            </label>

            {/* Form Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="w-1/3 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs py-2.5 font-medium transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                data-testid="submit-dealer-request-btn"
                disabled={isSubmitting}
                className="w-2/3 inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs py-2.5 transition disabled:opacity-60 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Dealership Request</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
