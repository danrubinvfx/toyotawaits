'use client';

import React, { useState, useId, useRef, useEffect } from 'react';
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
import { saveStoredSubmission, getStoredSubmissions } from '@/lib/storage/submission-storage';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Copy, AlertCircle, Loader2, KeyRound, ShieldAlert, Bookmark } from 'lucide-react';

export function getTodayLocalDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface SubmissionFormProps {
  initialOrderDate?: string;
}

export function SubmissionForm({ initialOrderDate }: SubmissionFormProps = {}) {
  const formId = useId();
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramModel = searchParams?.get('model');
  const paramProvince = searchParams?.get('province');
  const paramPowertrain = searchParams?.get('powertrain');
  const paramOrderDate = initialOrderDate || searchParams?.get('orderDate');

  // Cascading Selection State
  const initialModel =
    (paramModel && CANADIAN_VEHICLE_CATALOG.find((m) => m.slug === paramModel)) ||
    CANADIAN_VEHICLE_CATALOG[0];
  const initialPowertrain =
    (paramPowertrain && initialModel.powertrains.find((p) => p.slug === paramPowertrain)) ||
    initialModel.powertrains[0];
  const initialTrim = initialPowertrain?.trims[0];

  const [selectedModelSlug, setSelectedModelSlug] = useState<string>(initialModel.slug);
  const [selectedPowertrainSlug, setSelectedPowertrainSlug] = useState<string>(initialPowertrain?.slug || 'hev');
  const [selectedTrimId, setSelectedTrimId] = useState<string>(
    initialTrim?.id || '30000000-0000-4000-8000-000000000002'
  );

  // Form Fields State
  const [province, setProvince] = useState<string>(() => {
    if (paramProvince && CANADIAN_PROVINCES_LIST.some((p) => p.code === paramProvince)) {
      return paramProvince;
    }
    return 'ON';
  });
  const [dealershipCity, setDealershipCity] = useState<string>('');
  const [modelYear, setModelYear] = useState<number>(() => {
    if (paramOrderDate && /^\d{4}-\d{2}-\d{2}$/.test(paramOrderDate)) {
      const yr = new Date(paramOrderDate + 'T00:00:00').getFullYear();
      if (!isNaN(yr) && yr >= 2019 && yr <= 2028) return yr;
    }
    return 2026;
  });
  const [orderDate, setOrderDate] = useState<string>(() => {
    if (paramOrderDate && /^\d{4}-\d{2}-\d{2}$/.test(paramOrderDate)) {
      return paramOrderDate;
    }
    return getTodayLocalDate();
  });
  const [maxDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [stage, setStage] = useState<'deposit_placed' | 'allocation_confirmed' | 'in_transit' | 'delivered'>('deposit_placed');
  const [status, setStatus] = useState<'pending' | 'delivered'>('pending');
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [pricing, setPricing] = useState<'at_msrp' | 'above_msrp' | 'below_msrp' | 'undisclosed'>('undisclosed');
  const [mandatoryAddonsCad, setMandatoryAddonsCad] = useState<string>('');
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
    editToken?: string;
    editUrl?: string;
    status: string;
    waitDays?: number | null;
    modelSlug?: string;
    province?: string;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [persistentEditToken, setPersistentEditToken] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(5);
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    try {
      const stored = getStoredSubmissions();
      if (stored.length > 0 && (stored[0].editToken || stored[0].id)) {
        setPersistentEditToken(stored[0].editToken || stored[0].id);
      }
    } catch {
      // ignore
    }
  }, []);

  // Reset form inputs after successful submission
  const resetFormFields = () => {
    setSelectedModelSlug('rav4');
    setSelectedPowertrainSlug('hev');
    setSelectedTrimId('30000000-0000-4000-8000-000000000002');
    setProvince('ON');
    setDealershipCity('');
    setModelYear(2026);
    setOrderDate(getTodayLocalDate());
    setStage('deposit_placed');
    setStatus('pending');
    setDeliveryDate('');
    setPricing('undisclosed');
    setMandatoryAddonsCad('');
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

  const currentTrims: CatalogTrim[] = currentPowertrain.trims.filter((t) => {
    if (modelYear <= 2025) {
      if (t.minYear && t.minYear > 2025) return false;
      if (t.name.toLowerCase().includes('gr sport') || t.slug === 'gr-sport-awd') return false;
    }
    if (modelYear >= 2026) {
      if (t.maxYear && t.maxYear < 2026) return false;
    }
    return true;
  });

  const effectiveTrimId = currentTrims.some((t) => t.id === selectedTrimId)
    ? selectedTrimId
    : currentTrims[0]?.id || selectedTrimId;

  const isHistorical =
    Number(modelYear) < 2026 ||
    Boolean(orderDate && new Date(orderDate + (orderDate.includes('T') ? '' : 'T00:00:00')).getFullYear() < 2026);

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
      const currentTrim = currentTrims.find((t) => t.id === effectiveTrimId) || currentTrims[0];

      const payload = {
        modelId: currentModel.id,
        powertrainId: currentPowertrain.id,
        trimId: currentTrim.id,
        province,
        dealershipCity: dealershipCity.trim() || undefined,
        modelYear: Number(modelYear),
        orderDate,
        deliveryDate: stage === 'delivered' ? deliveryDate : undefined,
        status: stage === 'delivered' ? 'delivered' : 'pending',
        stage,
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

      const finalEditToken = result.data.editToken || result.data.id;
      setPersistentEditToken(finalEditToken);

      // Store persistent local submission recognition
      try {
        localStorage.setItem(
          'toyotawaits_submission',
          JSON.stringify({
            id: result.data.id,
            editKey: result.data.editKey || result.data.edit_key,
            edit_key: result.data.editKey || result.data.edit_key,
            editToken: finalEditToken,
            model: currentModel.name,
            status: result.data.status || status || 'waiting',
            submittedAt: new Date().toISOString(),
          })
        );
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('toyotawaits:submission-updated'));
        }
      } catch {
        // localStorage disabled fallback
      }

      // Save secret key locally for zero-account management
      saveStoredSubmission({
        id: result.data.id,
        editKey: result.data.editKey,
        editToken: finalEditToken,
        modelName: currentModel.name,
        trimName: currentTrim.name,
        province,
        orderDate,
        status,
        createdAt: new Date().toISOString(),
      });

      if (stage !== 'delivered') {
        try {
          localStorage.setItem(
            'toyotawait_pending_submission',
            JSON.stringify({
              id: result.data.id,
              editKey: result.data.editKey,
              editToken: finalEditToken,
              modelName: currentModel.name,
              powertrainName: currentPowertrain.name,
              trimName: currentTrim.name,
              province,
              orderDate,
              currentStage: stage,
              status: 'pending',
            })
          );
        } catch {
          // localStorage disabled fallback
        }
      }

      const submittedModelSlug = currentModel.slug;
      const submittedProvince = province;

      setSuccessModalData({
        ...result.data,
        modelSlug: submittedModelSlug,
        province: submittedProvince,
      });
      setSuccessBanner(
        'Submission received! Your timeline has been added to our Canadian database. Here are the updated wait-time estimates.'
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

  const handleDoneAndViewEstimates = () => {
    if (redirectTimerRef.current) {
      clearInterval(redirectTimerRef.current);
      redirectTimerRef.current = null;
    }
    const targetModel = successModalData?.modelSlug || selectedModelSlug;
    const targetProvince = successModalData?.province || province;
    setSuccessModalData(null);
    router.push(`/#estimator?submitted=true&model=${encodeURIComponent(targetModel)}&province=${encodeURIComponent(targetProvince)}`);
  };

  React.useEffect(() => {
    if (!successModalData) {
      if (redirectTimerRef.current) {
        clearInterval(redirectTimerRef.current);
        redirectTimerRef.current = null;
      }
      return;
    }

    setCountdown(5);
    redirectTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (redirectTimerRef.current) {
            clearInterval(redirectTimerRef.current);
            redirectTimerRef.current = null;
          }
          const targetModel = successModalData.modelSlug || selectedModelSlug;
          const targetProvince = successModalData.province || province;
          setSuccessModalData(null);
          router.push(`/#estimator?submitted=true&model=${encodeURIComponent(targetModel)}&province=${encodeURIComponent(targetProvince)}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (redirectTimerRef.current) {
        clearInterval(redirectTimerRef.current);
        redirectTimerRef.current = null;
      }
    };
  }, [successModalData, router, selectedModelSlug, province]);

  const copyEditKeyToClipboard = () => {
    if (successModalData?.editKey) {
      navigator.clipboard.writeText(successModalData.editKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2500);
    }
  };

  const copyEditLinkToClipboard = () => {
    const token = successModalData?.editToken || successModalData?.id;
    if (token) {
      const url = typeof window !== 'undefined'
        ? `${window.location.origin}/edit/${token}`
        : `https://toyotawaits.ca/edit/${token}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
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

          {persistentEditToken && (
            <div
              data-testid="persistent-edit-link-banner"
              className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 space-y-2.5 dark:border-amber-500/30 dark:bg-amber-950/20 animate-in fade-in"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-amber-900 dark:text-amber-300">
                <span className="flex items-center gap-1.5">
                  <Bookmark className="h-4 w-4 text-amber-500 shrink-0" />
                  Save your private link to update this order later
                </span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-normal">Private Link</span>
              </div>
              <div className="flex items-center justify-between gap-2 bg-white dark:bg-zinc-950 p-2 rounded border border-zinc-200 dark:border-zinc-800">
                <code className="text-xs font-mono select-all text-zinc-800 dark:text-zinc-200 truncate">
                  {typeof window !== 'undefined'
                    ? `${window.location.origin}/edit/${persistentEditToken}`
                    : `https://toyotawaits.ca/edit/${persistentEditToken}`}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={() => {
                    const url = typeof window !== 'undefined'
                      ? `${window.location.origin}/edit/${persistentEditToken}`
                      : `https://toyotawaits.ca/edit/${persistentEditToken}`;
                    navigator.clipboard.writeText(url);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2500);
                  }}
                  className="h-7 px-2.5 gap-1 shrink-0 text-xs"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copiedLink ? 'Copied!' : 'Copy Link'}
                </Button>
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Bookmark or save this private link to easily update your delivery date or toggle status to Delivered without logging in.
              </p>
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
                value={effectiveTrimId}
                onChange={(e) => setSelectedTrimId(e.target.value)}
                className="font-medium"
              >
                {currentTrims.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({isHistorical ? '2026 MSRP Ref: ' : ''}CAD ${t.msrpCad.toLocaleString()})
                  </option>
                ))}
              </Select>
              {isHistorical && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
                  Historical pricing varies by model year (current 2026 MSRP shown for reference).
                </p>
              )}
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

            {/* 3. Granular Order Milestones */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <Label>Order Lifecycle Milestone</Label>
                <span className="text-xs text-zinc-500">Milestone 1–4</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setStage('deposit_placed');
                    setStatus('pending');
                  }}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    stage === 'deposit_placed'
                      ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 ring-1 ring-amber-500 shadow-xs'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'
                  }`}
                >
                  <span className="text-xs font-bold">1. Deposit Placed</span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
                    Deposit queue initiated
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStage('allocation_confirmed');
                    setStatus('pending');
                  }}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    stage === 'allocation_confirmed'
                      ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 ring-1 ring-amber-500 shadow-xs'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'
                  }`}
                >
                  <span className="text-xs font-bold">2. Allocation Assigned</span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
                    Build slot / VIN confirmed
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStage('in_transit');
                    setStatus('pending');
                  }}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    stage === 'in_transit'
                      ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 ring-1 ring-amber-500 shadow-xs'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'
                  }`}
                >
                  <span className="text-xs font-bold">3. In Transit / Freight</span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
                    Rail or carrier in transit
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStage('delivered');
                    setStatus('delivered');
                  }}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    stage === 'delivered'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/50 dark:text-emerald-100 ring-1 ring-emerald-600 shadow-xs'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'
                  }`}
                >
                  <span className="text-xs font-bold">4. Delivered</span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
                    Vehicle received at dealer
                  </span>
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

              {stage === 'delivered' && (
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
                    <option value="undisclosed">Not Specified (Optional)</option>
                    <option value="at_msrp">Exact MSRP (No Markup)</option>
                    <option value="above_msrp">Above MSRP (Dealer Markup)</option>
                    <option value="below_msrp">Below MSRP (Discounted)</option>
                  </Select>
                  {isHistorical && (
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Pricing varies by model year.
                    </p>
                  )}
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
        <Dialog open={true} onOpenChange={(open) => { if (!open) handleDoneAndViewEstimates(); }}>
          <DialogContent className="w-[calc(100vw-2rem)] max-w-lg mx-auto p-4 sm:p-6 overflow-hidden overflow-x-hidden bg-zinc-950 border-zinc-800 text-zinc-100">
            <DialogHeader className="text-center sm:text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <DialogTitle className="text-center text-lg sm:text-xl font-bold tracking-tight text-white">
                Timeline Recorded Successfully!
              </DialogTitle>
              <DialogDescription className="text-center text-xs sm:text-sm text-neutral-400 mt-1 mb-4">
                Thank you for contributing to the Canadian car buyer community.
                {successModalData.waitDays != null && (
                  <span className="block font-semibold text-emerald-400 mt-1">
                    Total Wait: {successModalData.waitDays} days recorded.
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 overflow-x-hidden">
              {/* Bookmark Link Block */}
              <div className="rounded-lg bg-zinc-900/90 p-3 sm:p-3.5 border border-zinc-800 space-y-1.5 overflow-hidden">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                  <span className="flex items-center gap-1.5 truncate">
                    <Bookmark className="h-4 w-4 text-amber-500 shrink-0" />
                    <span className="truncate">Save your private link to update this order later</span>
                  </span>
                  <span className="text-[11px] text-zinc-400 font-normal shrink-0 ml-2 hidden sm:inline">Frictionless Edit Link</span>
                </div>
                <div className="flex items-center justify-between gap-2 bg-zinc-950 p-2 rounded-lg border border-zinc-800 min-w-0">
                  <code className="text-xs font-mono select-all text-zinc-200 truncate break-all overflow-x-auto min-w-0 flex-1">
                    {typeof window !== 'undefined'
                      ? `${window.location.origin}/edit/${successModalData.editToken || successModalData.id}`
                      : `https://toyotawaits.ca/edit/${successModalData.editToken || successModalData.id}`}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyEditLinkToClipboard}
                    className="h-8 px-2.5 gap-1 shrink-0 text-xs font-semibold border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 cursor-pointer"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                  </Button>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Bookmark or save this private link to easily update your delivery date or toggle status to Delivered without logging in.
                </p>
              </div>

              {/* Secret Edit Key Block */}
              <div className="rounded-lg bg-zinc-900/90 p-3 sm:p-3.5 border border-zinc-800 space-y-1.5 overflow-hidden">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="h-4 w-4 text-red-500 shrink-0" />
                    <span>Your Secret Edit Key</span>
                  </span>
                  <span className="text-[11px] text-zinc-400 font-normal shrink-0 ml-2 hidden sm:inline">Saved to this device</span>
                </div>
                <div className="flex items-center justify-between gap-2 bg-zinc-950 p-2 rounded-lg border border-zinc-800 min-w-0">
                  <code className="font-mono text-xs sm:text-sm break-all select-all text-zinc-200 min-w-0 flex-1">
                    {successModalData.editKey}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyEditKeyToClipboard}
                    className="h-8 px-2.5 gap-1 shrink-0 text-xs font-semibold border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 cursor-pointer"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copiedKey ? 'Copied!' : 'Copy Key'}</span>
                  </Button>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Keep this key if you want to update your status from another computer or browser later. No login or password needed!
                </p>
              </div>

              {/* Discrete Ko-fi Support Note */}
              <div className="pt-2 text-center border-t border-zinc-800/80">
                <a
                  href="https://ko-fi.com/toyotawaits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center text-xs text-neutral-400 hover:text-amber-400 transition-colors inline-block leading-relaxed"
                >
                  Thanks for contributing to the community! If ToyotaWaits helps you navigate your wait, consider supporting server costs on Ko-fi →
                </a>
              </div>
            </div>

            <DialogFooter className="flex flex-col items-center gap-2 pt-2 sm:space-x-0 w-full">
              <Button
                onClick={handleDoneAndViewEstimates}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm sm:text-base cursor-pointer"
              >
                <span className="truncate">Done & View Estimates</span>
              </Button>
              <p className="text-center text-xs text-neutral-500 mt-2">
                Redirecting to estimates in {countdown}s...
              </p>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
