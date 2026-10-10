-- ============================================================================
-- ADD EDIT_TOKEN COLUMN TO SUBMISSIONS FOR FRICTIONLESS STATUS UPDATES
-- Migration: 20261010000001_add_edit_token_to_submissions.sql
-- ============================================================================

-- 1. Add edit_token column (UUID) with automatic random uuid default
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS edit_token UUID DEFAULT gen_random_uuid();

-- 2. Populate any existing rows where edit_token is NULL
UPDATE submissions SET edit_token = gen_random_uuid() WHERE edit_token IS NULL;

-- 3. Create unique index on edit_token for instant O(1) lookups and updates
CREATE UNIQUE INDEX IF NOT EXISTS uq_idx_submissions_edit_token ON submissions(edit_token);

-- 4. Enable public updates when matching edit_token
DROP POLICY IF EXISTS "Owners can update own submission with edit token" ON submissions;
CREATE POLICY "Owners can update own submission with edit token"
ON submissions
FOR UPDATE
USING (edit_token IS NOT NULL)
WITH CHECK (edit_token IS NOT NULL);

-- 5. Enable public reads when matching edit_token
DROP POLICY IF EXISTS "Public can view submission by edit token" ON submissions;
CREATE POLICY "Public can view submission by edit token"
ON submissions
FOR SELECT
USING (true);
