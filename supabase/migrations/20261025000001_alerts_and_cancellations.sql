-- ============================================================================
-- Migration: 20261025000001_alerts_and_cancellations.sql
-- Description: Creates inventory_alert_subscriptions table and adds
--              likely cancellation & lifecycle tracking columns to listings
--              with mandatory Post-October 30 Data API grants and RLS policies.
-- ============================================================================

-- Ensure pgcrypto is available for gen_random_bytes()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Create inventory_alert_subscriptions table
CREATE TABLE IF NOT EXISTS public.inventory_alert_subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL,
    model text NOT NULL,
    powertrain text DEFAULT 'ALL',
    trim text DEFAULT 'ALL',
    region text DEFAULT 'Lower Mainland, BC',
    is_active boolean DEFAULT true,
    token text UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
    created_at timestamptz DEFAULT now(),
    last_notified_at timestamptz,
    CONSTRAINT chk_inventory_alert_subscriptions_email CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    ),
    CONSTRAINT uq_inventory_alert_subscriptions_criteria UNIQUE (email, model, powertrain, trim, region)
);

CREATE INDEX IF NOT EXISTS idx_inventory_alert_subscriptions_active_model
    ON public.inventory_alert_subscriptions (model, is_active)
    WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_inventory_alert_subscriptions_email
    ON public.inventory_alert_subscriptions (email);

-- 2. Add cancellation and lifecycle columns to dealer_listings (and discovery_listings if present)
ALTER TABLE public.dealer_listings
    ADD COLUMN IF NOT EXISTS is_likely_cancellation boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS lifecycle_status text DEFAULT 'active' CHECK (lifecycle_status IN ('active', 'sold', 'unlisted')),
    ADD COLUMN IF NOT EXISTS days_on_lot integer DEFAULT 0,
    ADD COLUMN IF NOT EXISTS sold_at timestamptz;

ALTER TABLE IF EXISTS public.discovery_listings
    ADD COLUMN IF NOT EXISTS is_likely_cancellation boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS lifecycle_status text DEFAULT 'active' CHECK (lifecycle_status IN ('active', 'sold', 'unlisted')),
    ADD COLUMN IF NOT EXISTS days_on_lot integer DEFAULT 0,
    ADD COLUMN IF NOT EXISTS sold_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_dealer_listings_likely_cancellation
    ON public.dealer_listings (is_likely_cancellation)
    WHERE is_likely_cancellation = true;

CREATE INDEX IF NOT EXISTS idx_dealer_listings_lifecycle_status
    ON public.dealer_listings (lifecycle_status);

-- 3. Enable Row-Level Security (RLS)
ALTER TABLE public.inventory_alert_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dealer_listings ENABLE ROW LEVEL SECURITY;

-- 4. Mandatory Data API Grants (Post-October 30 Supabase Rule)
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Public client read/insert/update permissions for inventory_alert_subscriptions (required for upsert + returning)
GRANT SELECT, INSERT, UPDATE ON TABLE public.inventory_alert_subscriptions TO anon, authenticated;
GRANT ALL ON TABLE public.inventory_alert_subscriptions TO service_role;

-- Public read permissions for dealer_listings (including is_likely_cancellation)
GRANT SELECT ON TABLE public.dealer_listings TO anon, authenticated;
GRANT ALL ON TABLE public.dealer_listings TO service_role;

-- 5. Row-Level Security Policies
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

DROP POLICY IF EXISTS "Public read access for dealer listings" ON public.dealer_listings;
CREATE POLICY "Public read access for dealer listings"
    ON public.dealer_listings
    FOR SELECT
    TO anon, authenticated
    USING (true);

NOTIFY pgrst, 'reload schema';
