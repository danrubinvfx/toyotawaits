-- =============================================================================
-- Migration: 20261025000004_inventory_alert_dispatches.sql
-- Description: Creates inventory_alert_dispatches table to guarantee idempotent
--              VIN-level de-duplication so the same VIN is never emailed twice
--              to the same subscriber.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.inventory_alert_dispatches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES public.inventory_alert_subscriptions(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    vin TEXT NOT NULL,
    model TEXT NOT NULL,
    trim TEXT,
    dealer_name TEXT,
    provider_message_id TEXT,
    dispatched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_inventory_alert_dispatches_email_vin UNIQUE (email, vin)
);

CREATE INDEX IF NOT EXISTS idx_inventory_alert_dispatches_email_vin
    ON public.inventory_alert_dispatches (email, vin);

CREATE INDEX IF NOT EXISTS idx_inventory_alert_dispatches_subscription
    ON public.inventory_alert_dispatches (subscription_id);

-- Mandatory Post-October 30 Supabase Data API Grants & RLS
ALTER TABLE public.inventory_alert_dispatches ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON TABLE public.inventory_alert_dispatches TO anon, authenticated;
GRANT ALL ON TABLE public.inventory_alert_dispatches TO service_role;

DROP POLICY IF EXISTS "Service role full access on inventory_alert_dispatches" ON public.inventory_alert_dispatches;
CREATE POLICY "Service role full access on inventory_alert_dispatches"
    ON public.inventory_alert_dispatches
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
