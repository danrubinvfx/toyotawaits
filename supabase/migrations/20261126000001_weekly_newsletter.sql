-- ============================================================================
-- Migration: 20261126000001_weekly_newsletter.sql
-- Description: Creates public.newsletter_subscriptions for the Weekly Pipeline Brief
--              with double opt-in verification, 1-click CASL unsubscribe tokens,
--              strict RLS (service_role full access; deny anonymous direct reads).
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  country TEXT DEFAULT 'CA' CHECK (country IN ('CA', 'US')),
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  verification_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  unsubscribe_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  created_at TIMESTAMPTZ DEFAULT now(),
  verified_at TIMESTAMPTZ NULL,
  last_sent_at TIMESTAMPTZ NULL,
  CONSTRAINT chk_newsletter_subscriptions_email CHECK (
    email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  )
);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_active_verified
  ON public.newsletter_subscriptions (is_active, is_verified, country)
  WHERE is_active = true AND is_verified = true;

CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_verification_token
  ON public.newsletter_subscriptions (verification_token);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_unsubscribe_token
  ON public.newsletter_subscriptions (unsubscribe_token);

-- Enable Row-Level Security (RLS)
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Post-October 30 Supabase Mandatory Grants:
-- Deny all direct anonymous / authenticated reads and writes; only service_role may access.
REVOKE ALL ON TABLE public.newsletter_subscriptions FROM anon, authenticated;
GRANT ALL ON TABLE public.newsletter_subscriptions TO service_role;

DROP POLICY IF EXISTS "Service role full access on newsletter_subscriptions" ON public.newsletter_subscriptions;
CREATE POLICY "Service role full access on newsletter_subscriptions"
  ON public.newsletter_subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
