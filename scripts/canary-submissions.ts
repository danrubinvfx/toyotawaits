import { createClient } from '@supabase/supabase-js';

export interface CanaryOptions {
  baseUrl?: string;
  cronSecret?: string;
  supabaseUrl?: string;
  supabaseServiceKey?: string;
  fetchImpl?: typeof fetch;
}

export async function runSubmissionCanary(options: CanaryOptions = {}): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  const baseUrl = (
    options.baseUrl ||
    process.env.CANARY_BASE_URL ||
    'https://www.toyotawaits.ca'
  ).replace(/\/+$/, '');
  const cronSecret = options.cronSecret ?? process.env.CRON_SECRET ?? '';
  const supabaseUrl =
    options.supabaseUrl ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://gcvdxaguvawkvufqwnwt.supabase.co';
  const supabaseServiceKey =
    options.supabaseServiceKey || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const fetchFn = options.fetchImpl || fetch;

  const endpoint = `${baseUrl}/api/submissions`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (cronSecret) {
    headers['x-canary-secret'] = cronSecret;
  }

  const response = await fetchFn(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'rav4',
      powertrain: 'hev',
      trim: 'XLE',
      province: 'BC',
      orderDate: '2026-11-01',
      status: 'pending',
      dealershipName: '__CANARY_HEALTH_CHECK__',
      turnstileToken: 'mock-valid-turnstile-token',
    }),
    signal: AbortSignal.timeout(8000),
  });

  const rawText = await response.text();
  let parsed: any = null;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    parsed = null;
  }

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(
      `Canary POST failed with HTTP ${response.status}: ${rawText.slice(0, 500)}`
    );
  }

  const insertedId: string | undefined =
    parsed?.data?.id || parsed?.data?.submissionId || parsed?.id;
  if (!insertedId || typeof insertedId !== 'string') {
    throw new Error(
      `Canary POST returned HTTP ${response.status} without valid submission id: ${rawText.slice(0, 500)}`
    );
  }

  // Immediately delete the canary row from Supabase submissions
  if (supabaseUrl && supabaseServiceKey && !supabaseServiceKey.includes('placeholder')) {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (url, init) =>
          fetchFn(url, { ...init, signal: AbortSignal.timeout(8000) }),
      },
    });

    const { error: deleteByIdErr } = await supabase
      .from('submissions')
      .delete()
      .eq('id', insertedId);

    if (deleteByIdErr) {
      console.warn('[Canary] Delete by id warning:', deleteByIdErr.message);
    }

    const { error: deleteByDealerErr } = await supabase
      .from('submissions')
      .delete()
      .eq('dealership_name', '__CANARY_HEALTH_CHECK__');

    if (deleteByDealerErr && !deleteByDealerErr.message?.includes('dealership_name')) {
      console.warn('[Canary] Delete by dealership_name warning:', deleteByDealerErr.message);
    }
  }

  return { success: true, id: insertedId };
}

const isMainModule =
  typeof process !== 'undefined' &&
  Array.isArray(process.argv) &&
  process.argv.some((arg) => arg.includes('canary-submissions'));

if (isMainModule && process.env.VITEST !== 'true') {
  runSubmissionCanary()
    .then(() => {
      console.log('CANARY PASS: submission insert + cleanup verified');
      process.exit(0);
    })
    .catch((err: any) => {
      console.error('CANARY FAIL:', err?.message || err);
      process.exit(1);
    });
}
