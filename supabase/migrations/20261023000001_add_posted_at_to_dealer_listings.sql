-- ============================================================================
-- Migration: 20261023000001_add_posted_at_to_dealer_listings.sql
-- Description:
-- Adds posted_at column to dealer_listings table to store dealer original posting date
-- ============================================================================

ALTER TABLE dealer_listings
    ADD COLUMN IF NOT EXISTS posted_at TIMESTAMPTZ;

-- Backfill posted_at from first_observed_at for existing listings if null
UPDATE dealer_listings
SET posted_at = first_observed_at
WHERE posted_at IS NULL;

-- Index on posted_at for efficient chronological sorting
CREATE INDEX IF NOT EXISTS idx_dealer_listings_posted_at
    ON dealer_listings (posted_at DESC);
