-- ============================================================================
-- Migration: 20261025000003_free_30_day_verified_alerts.sql
-- Description: Upgrades inventory_alert_subscriptions with 30-day pass expiration,
--              double opt-in email verification (is_verified, verification_token,
--              verified_at, expires_at), composite matcher index, and mandatory
--              Post-October 30 Supabase Data API grants & RLS policies.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Ensure inventory_alert_subscriptions table exists with full 30-day verified schema
CREATE TABLE IF NOT EXISTS public.inventory_alert_subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL,
    model text NOT NULL,
    powertrain text DEFAULT 'ALL',
    trim text DEFAULT 'ALL',
    region text DEFAULT 'Lower Mainland, BC',
    is_active boolean DEFAULT true,
    is_verified boolean DEFAULT false,
    verification_token text UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
    created_at timestamptz DEFAULT now(),
    verified_at timestamptz,
    expires_at timestamptz DEFAULT (now() + interval '30 days'),
    last_notified_at timestamptz,
    token text UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
    CONSTRAINT chk_inventory_alert_subscriptions_email CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    ),
    CONSTRAINT uq_inventory_alert_subscriptions_criteria UNIQUE (email, model, powertrain, trim, region)
);

-- 2. Add 30-day verification columns if table already existed from prior migration
ALTER TABLE public.inventory_alert_subscriptions
    ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS verification_token text UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
    ADD COLUMN IF NOT EXISTS verified_at timestamptz,
    ADD COLUMN IF NOT EXISTS expires_at timestamptz DEFAULT (now() + interval '30 days');

-- Backfill verification_token and expires_at on any pre-existing rows
UPDATE public.inventory_alert_subscriptions
SET verification_token = encode(gen_random_bytes(24), 'hex')
WHERE verification_token IS NULL;

UPDATE public.inventory_alert_subscriptions
SET expires_at = COALESCE(created_at, now()) + interval '30 days'
WHERE expires_at IS NULL;

-- 3. Add composite matcher index for daily sweep worker
CREATE INDEX IF NOT EXISTS idx_alert_matcher
    ON public.inventory_alert_subscriptions (is_active, is_verified, expires_at);

CREATE UNIQUE INDEX IF NOT EXISTS idx_inventory_alert_subscriptions_verification_token
    ON public.inventory_alert_subscriptions (verification_token);

-- 4. Enable Row-Level Security & Mandatory Data API Grants (Post-October 30 Rules)
ALTER TABLE public.inventory_alert_subscriptions ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON TABLE public.inventory_alert_subscriptions TO anon, authenticated;
GRANT INSERT ON TABLE public.inventory_alert_subscriptions TO anon, authenticated;
GRANT UPDATE ON TABLE public.inventory_alert_subscriptions TO anon, authenticated;
GRANT ALL ON TABLE public.inventory_alert_subscriptions TO service_role;

-- 5. RLS Policies for public subscription creation and token verification
DROP POLICY IF EXISTS "Allow anon insert on inventory_alert_subscriptions" ON public.inventory_alert_subscriptions;
CREATE POLICY "Allow anon insert on inventory_alert_subscriptions"
    ON public.inventory_alert_subscriptions
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        email IS NOT NULL
        AND length(trim(email)) >= 5
        AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
        AND length(trim(model)) > 0
    );

DROP POLICY IF EXISTS "Allow anon update on inventory_alert_subscriptions" ON public.inventory_alert_subscriptions;
CREATE POLICY "Allow anon update on inventory_alert_subscriptions"
    ON public.inventory_alert_subscriptions
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (
        email IS NOT NULL
        AND length(trim(email)) >= 5
        AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
        AND length(trim(model)) > 0
    );

DROP POLICY IF EXISTS "Allow anon select on inventory_alert_subscriptions" ON public.inventory_alert_subscriptions;
CREATE POLICY "Allow anon select on inventory_alert_subscriptions"
    ON public.inventory_alert_subscriptions
    FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Service role full access on inventory_alert_subscriptions" ON public.inventory_alert_subscriptions;
CREATE POLICY "Service role full access on inventory_alert_subscriptions"
    ON public.inventory_alert_subscriptions
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

NOTIFY pgrst, 'reload schema';
