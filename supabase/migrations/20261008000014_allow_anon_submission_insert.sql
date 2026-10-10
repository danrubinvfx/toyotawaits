-- ============================================================================
-- ENSURE ANONYMOUS INSERT PERMISSIONS & RLS FOR SUBMISSIONS
-- Migration: 20261008000014_allow_anon_submission_insert.sql
-- ============================================================================

-- Grant schema and table privileges to anon, authenticated, and service_role
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON submissions TO anon, authenticated;
GRANT SELECT ON vehicle_models TO anon, authenticated;
GRANT SELECT ON vehicle_powertrains TO anon, authenticated;
GRANT SELECT ON vehicle_trims TO anon, authenticated;

-- Ensure RLS is active
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Drop previous insert policy
DROP POLICY IF EXISTS "Public can create anonymous submissions" ON submissions;

-- Permissive insert policy for public/anonymous car buyers:
-- Allows both unflagged and flagged rows (so automated outlier detection never triggers 42501),
-- and includes a 1-day buffer for international/Canadian timezone alignment.
CREATE POLICY "Public can create anonymous submissions"
    ON submissions FOR INSERT
    TO anon, authenticated, public
    WITH CHECK (
        order_date <= (CURRENT_DATE + INTERVAL '1 day') AND
        (delivery_date IS NULL OR delivery_date <= (CURRENT_DATE + INTERVAL '1 day'))
    );
