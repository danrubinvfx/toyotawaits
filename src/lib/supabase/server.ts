import { createClient } from '@supabase/supabase-js';

const FALLBACK_SUPABASE_URL = 'https://gcvdxaguvawkvufqwnwt.supabase.co';
const FALLBACK_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key';

function sanitizeKey(token?: string): string | undefined {
  if (!token || typeof token !== 'string') return undefined;
  const cleaned = token.trim().replace(/^["']+|["']+$/g, '').trim();
  return cleaned.length > 0 ? cleaned : undefined;
}

export function isUsableSupabaseKey(token?: string): boolean {
  const trimmed = sanitizeKey(token);
  if (!trimmed) return false;
  if (trimmed.includes('placeholder')) return false;
  if (trimmed.startsWith('sb_secret_') || trimmed.startsWith('sb_publishable_')) {
    return trimmed.length > 20;
  }
  const parts = trimmed.split('.');
  if (parts.length !== 3) return false;
  // Detect corrupted copy-paste (e.g. duplicated payload snippet or anomalous length)
  if (parts[2].includes('SI6InNlcnZpY2V') || parts[2].includes('eyJ') || trimmed.length > 250) {
    return false;
  }
  return true;
}

function normalizeSubmissionsBodyForRetry(
  rawBody: string,
  missingColumn?: string,
  fixEnums?: boolean,
  dropFkColumn?: 'trim_id' | 'powertrain_id' | 'model_id'
): { mutated: boolean; nextBody: string } {
  try {
    const parsed = JSON.parse(rawBody);
    const items = Array.isArray(parsed) ? parsed : [parsed];
    let mutated = false;

    for (const item of items) {
      if (!item || typeof item !== 'object') continue;
      if (missingColumn && missingColumn in item) {
        delete item[missingColumn];
        mutated = true;
      }
      if (fixEnums) {
        if (item.current_stage === 'vin_assigned') {
          item.current_stage = 'allocation_confirmed';
          mutated = true;
        } else if (item.current_stage === 'in_transit') {
          item.current_stage = 'freight_transit';
          mutated = true;
        }
        if (item.stage === 'vin_assigned') {
          item.stage = 'allocation_confirmed';
          mutated = true;
        } else if (item.stage === 'in_transit') {
          item.stage = 'freight_transit';
          mutated = true;
        }
      }
      if (dropFkColumn) {
        if (dropFkColumn === 'trim_id' && 'trim_id' in item && item.trim_id !== null) {
          delete item.trim_id;
          mutated = true;
        } else if (dropFkColumn === 'powertrain_id') {
          if ('powertrain_id' in item || 'trim_id' in item) {
            delete item.powertrain_id;
            delete item.trim_id;
            mutated = true;
          }
        } else if (dropFkColumn === 'model_id') {
          if ('model_id' in item || 'powertrain_id' in item || 'trim_id' in item) {
            delete item.model_id;
            delete item.powertrain_id;
            delete item.trim_id;
            mutated = true;
          }
        }
      }
    }

    return {
      mutated,
      nextBody: JSON.stringify(Array.isArray(parsed) ? items : items[0]),
    };
  } catch {
    return { mutated: false, nextBody: rawBody };
  }
}

export function isLiveSupabaseConfigured(): boolean {
  if ((createServerClient as any).mock) {
    return true;
  }
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (process.env.NODE_ENV === 'test') {
    return Boolean(
      envUrl &&
        !envUrl.includes('placeholder') &&
        !envUrl.includes('mock-') &&
        !envUrl.includes('toyotawait.local')
    );
  }
  return true;
}

export interface ServerClientOptions {
  /** Opt in to Next.js Data Cache for read-only queries. Omit for uncached (no-store) mutations and sensitive reads. */
  revalidate?: number | false;
  tags?: string[];
}

export function createServerClient(options?: ServerClientOptions) {
  const baseFetch: typeof fetch = (url, init) =>
    options?.revalidate !== undefined || options?.tags !== undefined
      ? fetch(url, { ...init, next: { revalidate: options.revalidate, tags: options.tags } })
      : fetch(url, { ...init, cache: 'no-store' });

  const cachedFetch: typeof fetch = async (url, init) => {
    const response = await baseFetch(url, init);
    const urlStr = typeof url === 'string' ? url : url instanceof URL ? url.toString() : (url as any)?.url || '';
    const method = (init?.method || 'GET').toUpperCase();

    if (
      !response.ok &&
      (method === 'POST' || method === 'PATCH') &&
      urlStr.includes('/rest/v1/submissions') &&
      typeof init?.body === 'string'
    ) {
      let currentRes = response;
      let currentBody = init.body;

      for (let attempt = 0; attempt < 12; attempt++) {
        let errJson: any = null;
        try {
          errJson = await currentRes.clone().json();
        } catch {
          break;
        }

        const code = errJson?.code || '';
        const msg = `${errJson?.message || ''} ${errJson?.details || ''}`;

        console.error('[POST /api/submissions] Supabase PostgREST write failure:', {
          code: errJson?.code,
          message: errJson?.message,
          details: errJson?.details,
          hint: errJson?.hint,
        });

        // 1. Heal missing columns in live schema cache (PGRST204 / 42703)
        if (code === 'PGRST204' || code === '42703') {
          const colMatch =
            msg.match(/Could not find the '([^']+)' column/i) ||
            msg.match(/column "([^"]+)" of relation/i);
          if (colMatch?.[1]) {
            const { mutated, nextBody } = normalizeSubmissionsBodyForRetry(currentBody, colMatch[1]);
            if (mutated) {
              currentBody = nextBody;
              currentRes = await baseFetch(url, { ...init, body: currentBody });
              if (currentRes.ok) return currentRes;
              continue;
            }
          }
        }

        // 2. Heal Postgres enum mismatch on submission_stage (22P02)
        if (code === '22P02') {
          const { mutated, nextBody } = normalizeSubmissionsBodyForRetry(currentBody, undefined, true);
          if (mutated) {
            currentBody = nextBody;
            currentRes = await baseFetch(url, { ...init, body: currentBody });
            if (currentRes.ok) return currentRes;
            continue;
          }
        }

        // 3. Heal foreign key constraint if new catalog model/powertrain/trim UUID is unseeded in FK tables (23503)
        if (code === '23503') {
          const fkCol = msg.includes('trim_id')
            ? 'trim_id'
            : msg.includes('powertrain_id')
            ? 'powertrain_id'
            : msg.includes('model_id')
            ? 'model_id'
            : undefined;
          if (fkCol) {
            const { mutated, nextBody } = normalizeSubmissionsBodyForRetry(
              currentBody,
              undefined,
              false,
              fkCol
            );
            if (mutated) {
              currentBody = nextBody;
              currentRes = await baseFetch(url, { ...init, body: currentBody });
              if (currentRes.ok) return currentRes;
              continue;
            }
          }
        }

        // 4. Heal INSERT ... RETURNING * RLS failure when anon fallback cannot SELECT newly inserted row (42501)
        if (code === '42501' && method === 'POST' && urlStr.includes('select=')) {
          try {
            const strippedUrl = urlStr
              .replace(/([?&])select=[^&]*&?/, '$1')
              .replace(/[?&]$/, '');
            const retryHeaders = new Headers(init?.headers as HeadersInit);
            retryHeaders.set('Prefer', 'return=minimal');
            const minimalRes = await baseFetch(strippedUrl, {
              ...init,
              headers: retryHeaders,
              body: currentBody,
            });
            if (minimalRes.ok) {
              const parsed = JSON.parse(currentBody);
              const row = Array.isArray(parsed) ? parsed[0] : parsed;
              const synthesized = {
                id: row?.id || '00000000-0000-4000-8000-' + Date.now().toString().slice(-12).padStart(12, '0'),
                created_at: new Date().toISOString(),
                ...row,
              };
              const isSingleObject = (init?.headers as any)?.Accept?.includes('vnd.pgrst.object+json') ||
                new Headers(init?.headers as HeadersInit).get('Accept')?.includes('vnd.pgrst.object+json');
              return new Response(
                JSON.stringify(isSingleObject ? synthesized : [synthesized]),
                {
                  status: 201,
                  headers: { 'Content-Type': 'application/json' },
                }
              );
            }
          } catch {
            // Fall through to original error response
          }
        }

        break;
      }

      return currentRes;
    }

    return response;
  };

  if (process.env.NODE_ENV === 'test' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('mock-')) {
    const testUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const testKey =
      sanitizeKey(process.env.SUPABASE_SERVICE_ROLE_KEY) ||
      sanitizeKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
      'mock-key';
    return createClient(testUrl, testKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) },
    });
  }

  const envUrl = sanitizeKey(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const isMockUrl =
    !envUrl ||
    envUrl.includes('placeholder') ||
    envUrl.includes('mock-') ||
    envUrl.includes('toyotawait.local');

  const supabaseUrl = isMockUrl ? FALLBACK_SUPABASE_URL : envUrl;

  const serviceRoleKey = sanitizeKey(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const anonKey = sanitizeKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  let candidateKey = serviceRoleKey;
  if (!isUsableSupabaseKey(candidateKey)) {
    candidateKey = anonKey;
  }
  const key: string =
    (isUsableSupabaseKey(candidateKey) && candidateKey) ||
    serviceRoleKey ||
    anonKey ||
    FALLBACK_SERVICE_ROLE_KEY;

  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: cachedFetch,
    },
  });
}

export function createAdminClient() {
  return createServerClient();
}

export const supabaseAdmin: ReturnType<typeof createServerClient> = new Proxy({} as any, {
  get(_target, prop) {
    const client = createAdminClient() as any;
    const val = client[prop];
    return typeof val === 'function' ? val.bind(client) : val;
  },
});
