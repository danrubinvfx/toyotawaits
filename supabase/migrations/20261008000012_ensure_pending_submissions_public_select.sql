-- ============================================================================
-- ENSURE PUBLIC READ PERMISSIONS FOR ALL SUBMISSIONS (DELIVERED & PENDING)
-- Migration: 20261008000012_ensure_pending_submissions_public_select.sql
-- ============================================================================

-- Ensure RLS is active on submissions
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Recreate policy to explicitly allow public readers to view both delivered and pending submissions
DROP POLICY IF EXISTS "Public can view unflagged submissions" ON submissions;
DROP POLICY IF EXISTS "Public can view all unflagged submissions" ON submissions;

CREATE POLICY "Public can view all unflagged submissions"
    ON submissions FOR SELECT
    TO anon, authenticated, public
    USING (
        is_flagged = false AND 
        status IN ('delivered', 'pending')
    );

-- Grant SELECT permissions on submissions and related vehicle dimension tables to anon and authenticated
GRANT SELECT ON submissions TO anon, authenticated;
GRANT SELECT ON vehicle_models TO anon, authenticated;
GRANT SELECT ON vehicle_powertrains TO anon, authenticated;
GRANT SELECT ON vehicle_trims TO anon, authenticated;
