-- ============================================================================
-- MIGRATION: 20261021000006_donation_toast_telemetry.sql
-- Description: Expand telemetry_affiliate_clicks placement CHECK constraint
--              to include 'donation_toast' alongside 'inventory_feed' and 'submission_modal'.
-- ============================================================================

ALTER TABLE public.telemetry_affiliate_clicks
    DROP CONSTRAINT IF EXISTS telemetry_affiliate_clicks_placement_check;

ALTER TABLE public.telemetry_affiliate_clicks
    ADD CONSTRAINT telemetry_affiliate_clicks_placement_check
    CHECK (placement IN ('inventory_feed', 'submission_modal', 'donation_toast'));
