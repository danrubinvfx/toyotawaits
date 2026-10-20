-- ============================================================================
-- MIGRATION: 20261020000001_telemetry_affiliate_clicks.sql
-- Description: Telemetry table for outbound affiliate link clicks
-- ============================================================================

CREATE TABLE IF NOT EXISTS telemetry_affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    accessory_id TEXT NOT NULL,
    placement TEXT NOT NULL CHECK (placement IN ('inventory_feed', 'submission_modal')),
    model_context TEXT,
    target_url TEXT NOT NULL
);

-- Index for analytics querying
CREATE INDEX IF NOT EXISTS idx_telemetry_affiliate_clicks_created
    ON telemetry_affiliate_clicks (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_telemetry_affiliate_clicks_accessory
    ON telemetry_affiliate_clicks (accessory_id, placement);

-- Row Level Security
ALTER TABLE telemetry_affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Allow anonymous client-side logging
CREATE POLICY "Allow anon insert to telemetry_affiliate_clicks"
    ON telemetry_affiliate_clicks
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow service role full read access
CREATE POLICY "Allow service role read telemetry_affiliate_clicks"
    ON telemetry_affiliate_clicks
    FOR SELECT
    TO service_role
    USING (true);
