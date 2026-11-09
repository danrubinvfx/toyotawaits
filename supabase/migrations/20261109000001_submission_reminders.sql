-- ============================================================================
-- SUBMISSION QUEUE REMINDERS & TOKENIZED STATUS UPDATE EXTENSIONS
-- Migration: 20261109000001_submission_reminders.sql
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
    -- 1. Add email column if not already present
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'submissions' AND column_name = 'email'
    ) THEN
        ALTER TABLE public.submissions ADD COLUMN email TEXT NULL;
    ELSE
        ALTER TABLE public.submissions ALTER COLUMN email TYPE TEXT;
    END IF;

    -- 2. Add reminder_opt_in column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'submissions' AND column_name = 'reminder_opt_in'
    ) THEN
        ALTER TABLE public.submissions ADD COLUMN reminder_opt_in BOOLEAN DEFAULT false;
    END IF;

    -- 3. Ensure edit_token is TEXT with default encode(gen_random_bytes(24), 'hex')
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'submissions' AND column_name = 'edit_token'
    ) THEN
        ALTER TABLE public.submissions ADD COLUMN edit_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex');
    ELSE
        ALTER TABLE public.submissions ALTER COLUMN edit_token TYPE TEXT USING edit_token::text;
        ALTER TABLE public.submissions ALTER COLUMN edit_token SET DEFAULT encode(gen_random_bytes(24), 'hex');
    END IF;

    -- 4. Add last_reminded_at column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'submissions' AND column_name = 'last_reminded_at'
    ) THEN
        ALTER TABLE public.submissions ADD COLUMN last_reminded_at TIMESTAMPTZ NULL;
    END IF;

    -- 5. Expand submissions_stage_check constraint to include modern milestones (build_assigned, canceled)
    ALTER TABLE public.submissions DROP CONSTRAINT IF EXISTS submissions_stage_check;
    ALTER TABLE public.submissions ADD CONSTRAINT submissions_stage_check
        CHECK (stage IN ('deposit_placed', 'build_assigned', 'vin_assigned', 'allocation_confirmed', 'in_transit', 'delivered', 'canceled', 'cancelled'));
END $$;

-- Populate any existing rows where edit_token is NULL
UPDATE public.submissions SET edit_token = encode(gen_random_bytes(24), 'hex') WHERE edit_token IS NULL;

-- Unique index on edit_token for instant O(1) lookups and updates
CREATE UNIQUE INDEX IF NOT EXISTS uq_idx_submissions_edit_token ON public.submissions (edit_token);

-- Index on (reminder_opt_in, status, last_reminded_at) for scheduled reminder batching
CREATE INDEX IF NOT EXISTS idx_submissions_reminder_batching 
    ON public.submissions (reminder_opt_in, status, last_reminded_at);

-- Explicit Data API & Role Grants (Supabase mandatory standards)
GRANT SELECT, INSERT, UPDATE ON TABLE public.submissions TO anon, authenticated;
GRANT ALL ON TABLE public.submissions TO service_role;
