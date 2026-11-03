import { useState, useEffect, useCallback } from 'react';
import { getActiveInventoryCountByModel } from '@/lib/inventory/counts';

export interface MatchingInventoryParams {
  modelName: string;
  province?: string;
  region?: string;
}

export interface DropAlertSubscribeParams {
  email: string;
  model: string;
  province?: string;
  region?: string;
  powertrain?: string;
  trim?: string;
}

export interface DropAlertSubscribeResult {
  success: boolean;
  message?: string;
  error?: string;
}

function getOrigin(): string {
  if (typeof window !== 'undefined' && window.location?.origin && window.location.origin !== 'null') {
    return window.location.origin;
  }
  return 'http://localhost:3000';
}

/**
 * Client-side / lightweight helper to query active inventory count matching
 * modelName and province/region from /api/inventory, with fallback to active counts.
 */
export async function fetchMatchingInventoryCount({
  modelName,
  province,
  region,
}: MatchingInventoryParams): Promise<number> {
  if (!modelName || !modelName.trim()) {
    return 0;
  }

  const cleanModel = modelName.trim();
  const cleanRegion = (province || region || '').trim();

  try {
    const baseUrl = getOrigin();
    const url = new URL('/api/inventory', baseUrl);
    url.searchParams.set('model', cleanModel);
    if (cleanRegion) {
      url.searchParams.set('region', cleanRegion);
    }
    url.searchParams.set('summary', 'true');

    const res = await fetch(url.toString());
    if (res.ok) {
      const data = await res.json();
      if (typeof data.count === 'number') {
        return data.count;
      }
    }
  } catch (err) {
    console.warn('[inventory] fetchMatchingInventoryCount error, falling back:', err);
  }

  // Graceful fallback to static / sample inventory count
  return getActiveInventoryCountByModel(cleanModel);
}

/**
 * 1-click subscription action reusing submitted email, model, and province/region.
 * POSTs to /api/alerts/subscribe with standard payload.
 */
export async function subscribeToDropAlerts({
  email,
  model,
  province,
  region,
  powertrain = 'ALL',
  trim = 'ALL',
}: DropAlertSubscribeParams): Promise<DropAlertSubscribeResult> {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanModel = (model || '').trim();
  const cleanRegion = (province || region || 'Lower Mainland, BC').trim();

  if (!cleanEmail || !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(cleanEmail)) {
    return {
      success: false,
      error: 'Please enter a valid email address.',
    };
  }

  if (!cleanModel) {
    return {
      success: false,
      error: 'Vehicle model is required.',
    };
  }

  try {
    const baseUrl = getOrigin();
    const url = new URL('/api/alerts/subscribe', baseUrl);
    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: cleanEmail,
        model: cleanModel,
        powertrain,
        trim,
        region: cleanRegion,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || data?.success === false) {
      return {
        success: false,
        error: data?.error || 'Could not activate drop alerts. Please try again.',
      };
    }

    return {
      success: true,
      message:
        data?.message ||
        'Subscribed! You will get email alerts when unreserved allocations land.',
    };
  } catch (err) {
    console.error('[inventory] subscribeToDropAlerts network error:', err);
    return {
      success: false,
      error: 'Network error while subscribing. Please try again.',
    };
  }
}

/**
 * React hook to fetch live matching inventory count for model & region.
 */
export function useMatchingInventory({
  modelName,
  province,
  region,
}: MatchingInventoryParams) {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCount = useCallback(async () => {
    if (!modelName) {
      setCount(0);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const matchCount = await fetchMatchingInventoryCount({ modelName, province, region });
      setCount(matchCount);
    } catch (err: any) {
      setError(err?.message || 'Failed to load inventory count');
      setCount(getActiveInventoryCountByModel(modelName));
    } finally {
      setIsLoading(false);
    }
  }, [modelName, province, region]);

  useEffect(() => {
    let isMounted = true;
    fetchMatchingInventoryCount({ modelName, province, region })
      .then((c) => {
        if (isMounted) {
          setCount(c);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || 'Failed to load inventory count');
          setCount(getActiveInventoryCountByModel(modelName));
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [modelName, province, region]);

  return { count: count ?? 0, isLoading, error, refreshCount };
}

/**
 * React hook for 1-click drop alert opt-in.
 */
export function useDropAlertSubscription({
  email: initialEmail = '',
  modelName,
  province,
  region,
}: {
  email?: string;
  modelName: string;
  province?: string;
  region?: string;
}) {
  const [email, setEmail] = useState<string>(initialEmail);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialEmail && initialEmail !== email) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  const subscribe = useCallback(
    async (emailToUse?: string): Promise<boolean> => {
      const targetEmail = (emailToUse || email || '').trim();
      if (!targetEmail) {
        setErrorMessage('Please provide an email address.');
        return false;
      }

      setIsSubmitting(true);
      setErrorMessage(null);

      const result = await subscribeToDropAlerts({
        email: targetEmail,
        model: modelName,
        province,
        region,
      });

      setIsSubmitting(false);

      if (result.success) {
        setIsSubscribed(true);
        setStatusMessage(
          result.message ||
            'Subscribed! You will get email alerts when unreserved allocations land.'
        );
        return true;
      } else {
        setErrorMessage(result.error || 'Failed to subscribe to drop alerts.');
        return false;
      }
    },
    [email, modelName, province, region]
  );

  return {
    email,
    setEmail,
    isSubscribed,
    isSubmitting,
    statusMessage,
    errorMessage,
    subscribe,
  };
}
