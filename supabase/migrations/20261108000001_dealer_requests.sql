-- ============================================================================
-- Migration: 20261108000001_dealer_requests.sql
-- Description: Creates dealer_requests intake table with RLS & mandatory Data API grants
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.dealer_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_name text NOT NULL,
  city text NOT NULL,
  province text NOT NULL,
  website_url text,
  user_email text,
  notify_when_added boolean DEFAULT false,
  source_filter_state jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'added', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- Operational indexes for indexing triage
CREATE INDEX IF NOT EXISTS idx_dealer_requests_status 
  ON public.dealer_requests (status);

CREATE INDEX IF NOT EXISTS idx_dealer_requests_created_at 
  ON public.dealer_requests (created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.dealer_requests ENABLE ROW LEVEL SECURITY;

-- Post-October 30 Supabase Mandatory Grants (per AGENTS.md & docs/database-migration-standards.md)
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Public client insert permissions:
GRANT INSERT ON TABLE public.dealer_requests TO anon, authenticated;

-- Full service role management for backend routes, workers, and admin scripts:
GRANT ALL ON TABLE public.dealer_requests TO service_role;

-- Row-Level Security Policies
CREATE POLICY "Allow public insert on dealer_requests"
  ON public.dealer_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Service role full access on dealer_requests"
  ON public.dealer_requests
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
