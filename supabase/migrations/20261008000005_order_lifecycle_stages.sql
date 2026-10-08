-- ============================================================================
-- ORDER LIFECYCLE STAGES: 5-STAGE MILESTONE PROGRESSION
-- Migration: 20261008000005_order_lifecycle_stages.sql
-- ============================================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_stage') THEN
        CREATE TYPE submission_stage AS ENUM (
            'deposit_placed',        -- Initial deposit placed in queue
            'allocation_confirmed',  -- Build sheet / allocation secured
            'freight_transit',       -- On ocean vessel or freight rail
            'arrived_at_dealer',     -- At dealership compound / PDI
            'delivered'              -- Customer delivered
        );
    END IF;
END $$;

-- Add current_stage column to submissions table if not already present
ALTER TABLE submissions
ADD COLUMN IF NOT EXISTS current_stage submission_stage NOT NULL DEFAULT 'deposit_placed';

-- Index for querying active stage counts and status filters
CREATE INDEX IF NOT EXISTS idx_submissions_stage 
    ON submissions(current_stage) 
    WHERE is_flagged = false;
