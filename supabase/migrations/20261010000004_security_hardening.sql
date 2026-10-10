-- ============================================================================
-- SECURITY HARDENING: SUBMISSIONS & NOTIFICATION REQUESTS RLS & GRANTS
-- Migration: 20261010000004_security_hardening.sql
-- ============================================================================

-- 1. Hardened submissions RLS & Permissions
-- Drop broad update and select policies that bypass flagging or permit direct client updates
DROP POLICY IF EXISTS "Owners can update own submission with edit token" ON submissions;
DROP POLICY IF EXISTS "Public can view submission by edit token" ON submissions;
DROP POLICY IF EXISTS "Public can view all unflagged submissions" ON submissions;
DROP POLICY IF EXISTS "Public can view unflagged submissions" ON submissions;

-- Restore secure public read policy (strictly unflagged rows)
CREATE POLICY "Public can view unflagged submissions"
ON submissions FOR SELECT
USING (is_flagged = false);

-- Restrict updates and deletes strictly to the backend using SUPABASE_SERVICE_ROLE_KEY
REVOKE UPDATE, DELETE ON submissions FROM anon, authenticated;

-- 2. Hardened notification_requests RLS & Grants
-- Revoke broad public permissions and grant strict scoped insert
DROP POLICY IF EXISTS "Allow public manage by token on notification_requests" ON notification_requests;
DROP POLICY IF EXISTS "Allow public insert to notification_requests" ON notification_requests;
DROP POLICY IF EXISTS "Service role full access on notification_requests" ON notification_requests;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON notification_requests TO anon, authenticated;
REVOKE SELECT, UPDATE, DELETE ON notification_requests FROM anon, authenticated;

-- Allow insert with email validation (non-null and reasonable max length)
CREATE POLICY "Allow public insert to notification_requests"
ON notification_requests FOR INSERT
TO anon, authenticated
WITH CHECK (email IS NOT NULL AND length(email) <= 255);

-- Service role full access for backend jobs and API routes
CREATE POLICY "Service role full access on notification_requests"
ON notification_requests FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
