import { createClient } from '@supabase/supabase-js';

const FALLBACK_SUPABASE_URL = 'https://gcvdxaguvawkvufqwnwt.supabase.co';
const FALLBACK_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjdmR4YWd1dmF3a3Z1ZnF3bnd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1ODk2MTQsImV4cCI6MjEwNzE2NTYxNH0._P6X-VO0-gJMjENYg4nazILorq862YjfUQZQvemqgMs';

function getUrl(): string {
  const u = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (u && !u.includes('placeholder')) return u;
  return FALLBACK_SUPABASE_URL;
}

function getKey(): string {
  const k = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (k && !k.includes('placeholder') && !k.includes('SI6InNlcnZpY2V') && k.length < 250) return k;
  return FALLBACK_ANON_KEY;
}

export const supabase = createClient(getUrl(), getKey());

export function getBrowserClient() {
  return createClient(getUrl(), getKey());
}
