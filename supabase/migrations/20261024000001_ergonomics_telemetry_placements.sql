-- ============================================================================
-- MIGRATION: 20261024000001_ergonomics_telemetry_placements.sql
-- Description: Expand telemetry_affiliate_clicks placement CHECK constraint
--              to include 'guide_rav4_mods' and 'while_you_wait'.
-- ============================================================================

ALTER TABLE public.telemetry_affiliate_clicks
    DROP CONSTRAINT IF EXISTS telemetry_affiliate_clicks_placement_check;

ALTER TABLE public.telemetry_affiliate_clicks
    ADD CONSTRAINT telemetry_affiliate_clicks_placement_check
    CHECK (placement IN ('inventory_feed', 'submission_modal', 'donation_toast', 'guide_rav4_mods', 'while_you_wait'));
