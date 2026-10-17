import { createClient } from '@supabase/supabase-js';

const FALLBACK_SUPABASE_URL = 'https://gcvdxaguvawkvufqwnwt.supabase.co';
const FALLBACK_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

function getUrl(): string {
  const u = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (
    u &&
    !u.includes('placeholder') &&
    !u.includes('mock-') &&
    !u.includes('toyotawait.local')
  ) {
    return u;
  }
  return FALLBACK_SUPABASE_URL;
}

function getKey(): string {
  const k = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (
    k &&
    !k.includes('placeholder') &&
    !k.includes('mock-') &&
    !k.includes('SI6InNlcnZpY2V') &&
    k.length < 250 &&
    k.split('.').length === 3
  ) {
    return k;
  }
  return FALLBACK_ANON_KEY;
}

export const supabase = createClient(getUrl(), getKey());

export function getBrowserClient() {
  return createClient(getUrl(), getKey());
}
