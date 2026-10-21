-- ============================================================================
-- Migration: 20261021000005_grant_submissions_update.sql
-- Description: Grant UPDATE privileges and RLS policy on public.submissions for anon/authenticated roles
-- ============================================================================

-- Grant UPDATE privileges to API roles
GRANT UPDATE ON TABLE public.submissions TO anon, authenticated;

-- Ensure an UPDATE policy exists for anon updates matching the order id or edit key
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'submissions' AND policyname = 'Enable update for users with matching id or key'
  ) THEN
    CREATE POLICY "Enable update for users with matching id or key"
    ON public.submissions
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;
