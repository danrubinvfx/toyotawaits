-- Idempotent migration: Add optional pricing transparency columns (doc_fee, mandatory_addons)
-- to public.submissions (and public.wait_time_submissions if aliased/present).

ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS doc_fee NUMERIC(10, 2) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS mandatory_addons NUMERIC(10, 2) DEFAULT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'submissions_doc_fee_range_check'
      AND conrelid = 'public.submissions'::regclass
  ) THEN
    ALTER TABLE public.submissions
      ADD CONSTRAINT submissions_doc_fee_range_check
      CHECK (doc_fee IS NULL OR (doc_fee >= 0 AND doc_fee <= 25000));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'submissions_mandatory_addons_range_check'
      AND conrelid = 'public.submissions'::regclass
  ) THEN
    ALTER TABLE public.submissions
      ADD CONSTRAINT submissions_mandatory_addons_range_check
      CHECK (mandatory_addons IS NULL OR (mandatory_addons >= 0 AND mandatory_addons <= 25000));
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.wait_time_submissions') IS NOT NULL THEN
    ALTER TABLE public.wait_time_submissions
      ADD COLUMN IF NOT EXISTS doc_fee NUMERIC(10, 2) DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS mandatory_addons NUMERIC(10, 2) DEFAULT NULL;
  END IF;
END $$;
