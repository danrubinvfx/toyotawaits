-- Migration: 20261021000002_staleness_and_48h_expiration.sql
-- Description: Adds stale_at column, expands dealer_listings status constraint, and adds last_observed_at index

-- 1. Add stale_at timestamp column if not exists
ALTER TABLE dealer_listings 
ADD COLUMN IF NOT EXISTS stale_at TIMESTAMPTZ;

-- 2. Update status constraint to include 'stale', 'removed', 'quarantined'
ALTER TABLE dealer_listings 
DROP CONSTRAINT IF EXISTS dealer_listings_status_check;

ALTER TABLE dealer_listings 
ADD CONSTRAINT dealer_listings_status_check CHECK (
    current_status IN (
        'Advertised - availability unconfirmed',
        'Incoming availability unconfirmed',
        'Reserved / sold',
        'No longer observed / stale',
        'No longer observed',
        'stale',
        'removed',
        'quarantined'
    )
);

-- 3. Add index on last_observed_at for 48h staleness cutoff query performance
CREATE INDEX IF NOT EXISTS idx_dealer_listings_last_observed 
ON dealer_listings (last_observed_at);
