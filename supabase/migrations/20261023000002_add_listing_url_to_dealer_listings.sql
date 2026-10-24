-- ============================================================================
-- Migration: 20261023000002_add_listing_url_to_dealer_listings.sql
-- Description:
-- Adds listing_url column to dealer_listings table to store direct VDP permalinks
-- ============================================================================

ALTER TABLE public.dealer_listings
    ADD COLUMN IF NOT EXISTS listing_url TEXT;

-- Backfill listing_url from vdp_url for existing listings if null
UPDATE public.dealer_listings
SET listing_url = vdp_url
WHERE listing_url IS NULL AND vdp_url IS NOT NULL;
