import { createClient } from '@supabase/supabase-js';

const FALLBACK_SUPABASE_URL = 'https://gcvdxaguvawkvufqwnwt.supabase.co';
const FALLBACK_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjdmR4YWd1dmF3a3Z1ZnF3bnd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1ODk2MTQsImV4cCI6MjEwNzE2NTYxNH0._P6X-VO0-gJMjENYg4nazILorq862YjfUQZQvemqgMs';

function isUsableSupabaseKey(token?: string): boolean {
  if (!token || typeof token !== 'string') return false;
  const trimmed = token.trim();
  if (trimmed.includes('placeholder')) return false;
  const parts = trimmed.split('.');
  if (parts.length !== 3) return false;
  // Detect corrupted copy-paste (e.g. duplicated payload snippet or anomalous length)
  if (parts[2].includes('SI6InNlcnZpY2V') || parts[2].includes('eyJ') || trimmed.length > 250) {
    return false;
  }
  return true;
}

export function createServerClient() {
  if (process.env.NODE_ENV === 'test' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('mock-')) {
    const testUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const testKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      'mock-key';
    return createClient(testUrl, testKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) },
    });
  }

  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseUrl =
    envUrl && !envUrl.includes('placeholder')
      ? envUrl
      : FALLBACK_SUPABASE_URL;

  let candidateKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!isUsableSupabaseKey(candidateKey)) {
    candidateKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  }
  const key: string = isUsableSupabaseKey(candidateKey) && candidateKey ? candidateKey : FALLBACK_ANON_KEY;

  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }),
    },
  });
}
