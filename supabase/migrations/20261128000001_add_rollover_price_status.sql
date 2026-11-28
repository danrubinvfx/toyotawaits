-- Migration: Add optional rollover_price_status for 2026-to-2027 order rollover price-protection tracking
ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS rollover_price_status text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'submissions_rollover_price_status_check'
  ) THEN
    ALTER TABLE public.submissions
      ADD CONSTRAINT submissions_rollover_price_status_check
      CHECK (
        rollover_price_status IS NULL
        OR rollover_price_status IN ('not_applicable', 'honored_2026_msrp', 'adjusted_2027_msrp')
      );
  END IF;
END $$;
