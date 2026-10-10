-- ============================================================================
-- MIGRATION: 20261010000002_granular_stages_and_notifications.sql
-- Description:
-- 1. Add granular 'stage' column and 'stage_updated_at' to submissions
-- 2. Create 'notification_requests' table with unique index & unsubscribe token
-- ============================================================================

-- 1. Granular Order Lifecycle Stages on submissions
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'submissions' AND column_name = 'stage'
    ) THEN
        ALTER TABLE submissions 
        ADD COLUMN stage text DEFAULT 'deposit_placed' 
        CHECK (stage IN ('deposit_placed', 'allocation_confirmed', 'in_transit', 'delivered', 'cancelled'));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'submissions' AND column_name = 'stage_updated_at'
    ) THEN
        ALTER TABLE submissions 
        ADD COLUMN stage_updated_at timestamptz DEFAULT now();
    END IF;
END $$;

-- Backfill stage column based on existing status and current_stage
UPDATE submissions
SET stage = CASE
    WHEN status = 'cancelled' THEN 'cancelled'
    WHEN status = 'delivered' THEN 'delivered'
    WHEN current_stage::text = 'freight_transit' THEN 'in_transit'
    WHEN current_stage::text = 'arrived_at_dealer' THEN 'delivered'
    WHEN current_stage::text = 'allocation_confirmed' THEN 'allocation_confirmed'
    ELSE 'deposit_placed'
END
WHERE stage IS NULL OR stage = 'deposit_placed';

CREATE INDEX IF NOT EXISTS idx_submissions_stage_col 
ON submissions(stage) 
WHERE is_flagged = false;

-- 2. Delivery Window / Notification Alerts Table
CREATE TABLE IF NOT EXISTS notification_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL,
    model text NOT NULL,
    trim text,
    province text NOT NULL,
    created_at timestamptz DEFAULT now(),
    is_active boolean DEFAULT true,
    unsubscribe_token uuid DEFAULT gen_random_uuid()
);

-- Ensure fast lookup by token for one-click unsubscribe
CREATE INDEX IF NOT EXISTS idx_notification_requests_unsub_token
ON notification_requests (unsubscribe_token);

-- Prevent duplicate alerts for same user + vehicle + province (upsert/reactivate capability)
CREATE UNIQUE INDEX IF NOT EXISTS idx_notification_requests_unique
ON notification_requests (lower(email), lower(model), upper(province));

-- RLS policies for notification_requests
ALTER TABLE notification_requests ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Allow public insert to notification_requests" ON notification_requests;
    DROP POLICY IF EXISTS "Allow public manage by token on notification_requests" ON notification_requests;
END $$;

CREATE POLICY "Allow public insert to notification_requests"
ON notification_requests FOR INSERT
TO anon, authenticated, service_role
WITH CHECK (true);

CREATE POLICY "Allow public manage by token on notification_requests"
ON notification_requests FOR ALL
TO anon, authenticated, service_role
USING (true)
WITH CHECK (true);
