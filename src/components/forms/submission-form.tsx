'use client';

import React, { useState, useId, useRef } from 'react';
import {
  CANADIAN_VEHICLE_CATALOG,
  CANADIAN_PROVINCES_LIST,
  CatalogModel,
  CatalogPowertrain,
  CatalogTrim,
} from '@/lib/data/vehicles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { saveStoredSubmission } from '@/lib/storage/submission-storage';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Copy, AlertCircle, Loader2, KeyRound, ShieldAlert } from 'lucide-react';

export function SubmissionForm() {
  const formId = useId();
  const router = useRouter();

  // Cascading Selection State
  const [selectedModelSlug, setSelectedModelSlug] = useState<string>('rav4');
  const [selectedPowertrainSlug, setSelectedPowertrainSlug] = useState<string>('hev');
  const [selectedTrimId, setSelectedTrimId] = useState<string>(
    '30000000-0000-4000-8000-000000000002' // Default XLE AWD
  );

  // Form Fields State
  const [province, setProvince] = useState<string>('ON');
  const [dealershipCity, setDealershipCity] = useState<string>('');
  const [modelYear, setModelYear] = useState<number>(2025);
  const [orderDate, setOrderDate] = useState<string>('2024-11-01');
  const [maxDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'pending' | 'delivered'>('pending');
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [pricing, setPricing] = useState<'at_msrp' | 'above_msrp' | 'below_msrp' | 'undisclosed'>('at_msrp');
  const [mandatoryAddonsCad, setMandatoryAddonsCad] = useState<string>('0');
  const [notes, setNotes] = useState<string>('');
  const [honeypot, setHoneypot] = useState<string>('');

  // UI States & Double-Submit Protection
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const isSubmittingRef = useRef<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [successModalData, setSuccessModalData] = useState<{
    id: string;
    editKey: string;
    status: string;
    waitDays?: number | null;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  // Reset form inputs after successful submission
  const resetFormFields = () => {
    setSelectedModelSlug('rav4');
    setSelectedPowertrainSlug('hev');
    setSelectedTrimId('30000000-0000-4000-8000-000000000002');
    setProvince('ON');
    setDealershipCity('');
    setModelYear(2025);
    setOrderDate('2024-11-01');
    setStatus('pending');
    setDeliveryDate('');
    setPricing('at_msrp');
    setMandatoryAddonsCad('0');
    setNotes('');
    setHoneypot('');
    setFieldErrors({});
  };

  // Derive catalog objects
  const currentModel: CatalogModel =
    CANADIAN_VEHICLE_CATALOG.find((m) => m.slug === selectedModelSlug) ||
    CANADIAN_VEHICLE_CATALOG[0];

  const currentPowertrains: CatalogPowertrain[] = currentModel.powertrains;
  const currentPowertrain: CatalogPowertrain =
    currentPowertrains.find((p) => p.slug === selectedPowertrainSlug) ||
    currentPowertrains[0];

  const currentTrims: CatalogTrim[] = currentPowertrain.trims;

  // Handle Model Change
  const handleModelChange = (modelSlug: string) => {
    setSelectedModelSlug(modelSlug);
    const newModel = CANADIAN_VEHICLE_CATALOG.find((m) => m.slug === modelSlug);
    if (newModel && newModel.powertrains.length > 0) {
      const defaultPowertrain = newModel.powertrains[0];
      setSelectedPowertrainSlug(defaultPowertrain.slug);
      if (defaultPowertrain.trims.length > 0) {
        setSelectedTrimId(defaultPowertrain.trims[0].id);
      }
    }
  };

  // Handle Powertrain Change
  const handlePowertrainChange = (powertrainSlug: string) => {
    setSelectedPowertrainSlug(powertrainSlug);
    const newPowertrain = currentModel.powertrains.find((p) => p.slug === powertrainSlug);
    if (newPowertrain && newPowertrain.trims.length > 0) {
      setSelectedTrimId(newPowertrain.trims[0].id);
    }
  };

  // Submission Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isSubmittingRef.current) {
      return;
    }
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessBanner(null);
    setFieldErrors({});

    try {
      const currentTrim = currentTrims.find((t) => t.id === selectedTrimId) || currentTrims[0];

      const payload = {
        modelId: currentModel.id,
        powertrainId: currentPowertrain.id,
        trimId: currentTrim.id,
        province,
        dealershipCity: dealershipCity.trim() || undefined,
        modelYear: Number(modelYear),
        orderDate,
        deliveryDate: status === 'delivered' ? deliveryDate : undefined,
        status,
        pricing,
        mandatoryAddonsCad: Number(mandatoryAddonsCad) || 0,
        tradeInRequired: false,
        notes: notes.trim() || undefined,
        turnstileToken: 'mock-valid-turnstile-token', // In test/dev environment fallback
        honeypot,
      };

      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        if (result.error?.details) {
          setFieldErrors(result.error.details);
        }
        setErrorMsg(result.error?.message || 'Failed to record your submission. Please check the inputs.');
        return;
      }

      // Save secret key locally for zero-account management
      saveStoredSubmission({
        id: result.data.id,
        editKey: result.data.editKey,
        modelName: currentModel.name,
        trimName: currentTrim.name,
        province,
        orderDate,
        status,
        createdAt: new Date().toISOString(),
      });

      setSuccessModalData(result.data);
      setSuccessBanner(
        'Wait time recorded successfully! Your timeline has been added to our Canadian database. The form has been reset for new entries.'
      );
      resetFormFields();
      try {
        router?.refresh?.();
      } catch {
        // Router unmounted fallback
      }
    } catch (err: any) {
      console.error('Submission request error:', err);
      setErrorMsg('A network error occurred. Please check your connection and try again.');
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const copyEditKeyToClipboard = () => {
    if (successModalData?.editKey) {
      navigator.clipboard.writeText(successModalData.editKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2500);
    }
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto shadow-md border-zinc-200 dark:border-zinc-800">
        <CardHeader className="space-y-1 bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 rounded-t-xl">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="border-red-200 text-red-700 dark:border-red-900 dark:text-red-400">
              🇨🇦 100% Anonymous & Zero-PII
            </Badge>
            <span className="text-xs text-zinc-500">~60 Seconds</span>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Submit Your Delivery Timeline
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            No accounts, emails, or VINs required. Help Canadians track genuine dealer wait times.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {successBanner && (
            <div
              data-testid="success-banner"
              className="mb-6 flex items-start justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-100 animate-in fade-in slide-in-from-top-1"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                <div>
                  <p className="font-semibold">Wait Time Recorded Successfully!</p>
                  <p className="text-xs mt-0.5 text-emerald-700 dark:text-emerald-300">
                    {successBanner}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSuccessBanner(null)}
                className="text-xs text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100 hover:underline shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <p className="font-semibold">Unable to submit timeline</p>
                <p className="text-xs mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot anti-bot trap */}
            <input
              type="text"
              name="website_url"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            {/* 1. Vehicle Cascading Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor={`${formId}-model`}>Vehicle Model</Label>
                <Select
                  id={`${formId}-model`}
                  value={selectedModelSlug}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="font-medium"
                >
                  {CANADIAN_VEHICLE_CATALOG.map((m) => (
                    <option key={m.slug} value={m.slug}>
                      {m.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`${formId}-powertrain`}>Powertrain</Label>
                <Select
                  id={`${formId}-powertrain`}
                  value={selectedPowertrainSlug}
                  onChange={(e) => handlePowertrainChange(e.target.value)}
                  className="font-medium"
                >
                  {currentPowertrains.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Trim Selection */}
            <div className="space-y-1.5">
              <Label htmlFor={`${formId}-trim`}>Trim Level (Canada)</Label>
              <Select
                id={`${formId}-trim`}
                value={selectedTrimId}
                onChange={(e) => setSelectedTrimId(e.target.value)}
                className="font-medium"
              >
                {currentTrims.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (CAD ${t.msrpCad.toLocaleString()})
                  </option>
                ))}
              </Select>
            </div>

            {/* 2. Geography & Model Year */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor={`${formId}-province`}>Province / Territory</Label>
                <Select
                  id={`${formId}-province`}
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                >
                  {CANADIAN_PROVINCES_LIST.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name} ({p.code})
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`${formId}-city`}>City (Optional)</Label>
                <Input
                  id={`${formId}-city`}
                  placeholder="e.g. Richmond, Calgary"
                  value={dealershipCity}
                  onChange={(e) => setDealershipCity(e.target.value)}
                  maxLength={100}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`${formId}-year`}>Model Year</Label>
                <Select
                  id={`${formId}-year`}
                  value={modelYear}
                  onChange={(e) => setModelYear(Number(e.target.value))}
                >
                  <option value={2026}>2026</option>
                  <option value={2025}>2025</option>
                  <option value={2024}>2024</option>
                  <option value={2023}>2023</option>
                </Select>
              </div>
            </div>

            {/* 3. Delivery Timeline Status */}
            <div className="space-y-2 pt-1">
              <Label>Delivery Status</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('pending')}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                    status === 'pending'
                      ? 'border-red-600 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-200 dark:border-red-700'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'
                  }`}
                >
                  ⏳ Still Waiting
                  <span className="text-[11px] font-normal text-zinc-500 mt-0.5">Order deposit placed</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('delivered')}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                    status === 'delivered'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-700'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'
                  }`}
                >
                  🎉 Vehicle Received
                  <span className="text-[11px] font-normal text-zinc-500 mt-0.5">Took delivery</span>
                </button>
              </div>
            </div>

            {/* Dates Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor={`${formId}-order-date`}>Order / Deposit Date</Label>
                <Input
                  id={`${formId}-order-date`}
                  type="date"
                  value={orderDate}
                  max={maxDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  required
                />
                {fieldErrors['orderDate'] && (
                  <p className="text-xs text-rose-600">{fieldErrors['orderDate'][0]}</p>
                )}
              </div>

              {status === 'delivered' && (
                <div className="space-y-1.5 animate-in fade-in-50">
                  <Label htmlFor={`${formId}-delivery-date`}>Delivery Date</Label>
                  <Input
                    id={`${formId}-delivery-date`}
                    type="date"
                    value={deliveryDate}
                    min={orderDate}
                    max={maxDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    required
                  />
                  {fieldErrors['deliveryDate'] && (
                    <p className="text-xs text-rose-600">{fieldErrors['deliveryDate'][0]}</p>
                  )}
                </div>
              )}
            </div>

            {/* 4. Transparency & Pricing (Optional) */}
            <div className="rounded-lg border border-zinc-200 p-4 space-y-3 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/40">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Dealer Pricing Transparency (Optional)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor={`${formId}-pricing`}>Pricing Status</Label>
                  <Select
                    id={`${formId}-pricing`}
                    value={pricing}
                    onChange={(e) => setPricing(e.target.value as any)}
                  >
                    <option value="at_msrp">Exact MSRP (No Markup)</option>
                    <option value="above_msrp">Above MSRP (Dealer Markup)</option>
                    <option value="below_msrp">Below MSRP (Discounted)</option>
                    <option value="undisclosed">Prefer not to say</option>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={`${formId}-addons`}>Mandatory Add-ons (CAD $)</Label>
                  <Input
                    id={`${formId}-addons`}
                    type="number"
                    min="0"
                    step="50"
                    placeholder="0"
                    value={mandatoryAddonsCad}
                    onChange={(e) => setMandatoryAddonsCad(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <Label htmlFor={`${formId}-notes`}>Notes / Experience (Max 280 chars)</Label>
                <Input
                  id={`${formId}-notes`}
                  placeholder="e.g. Dealer honored price, required no mandatory tint packages."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={280}
                />
                <p className="text-[11px] text-zinc-500 flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3 text-zinc-400" />
                  Zero-PII Filter: VINs, emails, phone numbers, and postal codes are strictly rejected.
                </p>
                {fieldErrors['notes'] && (
                  <p className="text-xs text-rose-600">{fieldErrors['notes'][0]}</p>
                )}
              </div>
            </div>

            {/* Submit Action */}
            <Button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="w-full h-11 text-base font-semibold shadow-md gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Recording Secure Submission...
                </>
              ) : (
                'Submit Wait Time Anonymously'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Success Modal with Secret Edit Key */}
      {successModalData && (
        <Dialog open={true} onOpenChange={() => setSuccessModalData(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-2">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <DialogTitle className="text-center text-xl font-bold">
                Timeline Recorded Successfully!
              </DialogTitle>
              <DialogDescription className="text-center text-sm">
                Thank you for contributing to the Canadian car buyer community.
                {successModalData.waitDays != null && (
                  <span className="block font-semibold text-emerald-700 dark:text-emerald-400 mt-1">
                    Total Wait: {successModalData.waitDays} days recorded.
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <div className="rounded-lg bg-zinc-100 dark:bg-zinc-900 p-3.5 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="h-4 w-4 text-red-600" />
                    Your Secret Edit Key
                  </span>
                  <span className="text-[11px] text-zinc-400 font-normal">Saved to this device</span>
                </div>
                <div className="flex items-center justify-between gap-2 bg-white dark:bg-zinc-950 p-2 rounded border border-zinc-200 dark:border-zinc-800">
                  <code className="text-xs font-mono select-all text-zinc-800 dark:text-zinc-200 truncate">
                    {successModalData.editKey}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyEditKeyToClipboard}
                    className="h-7 px-2.5 gap-1 shrink-0 text-xs"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {copiedKey ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Keep this key if you want to update your status from another computer or browser later. No login or
                  password needed!
                </p>
              </div>
            </div>

            <DialogFooter className="sm:justify-center">
              <Button onClick={() => setSuccessModalData(null)} className="w-full sm:w-auto px-8">
                Done & View Estimates
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
