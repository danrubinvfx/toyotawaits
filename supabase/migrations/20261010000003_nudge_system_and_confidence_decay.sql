-- ============================================================================
-- MIGRATION: 20261010000003_nudge_system_and_confidence_decay.sql
-- Description:
-- 1. Add last_nudged_at, cancelled_at, and optional email columns to submissions
-- 2. Add performance indexes on stage_updated_at, last_nudged_at, and active queue
-- 3. Update model_wait_benchmarks view to strictly calculate medians from delivered submissions
-- ============================================================================

DO $$
BEGIN
    -- 1. Add last_nudged_at column if it does not exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'submissions' AND column_name = 'last_nudged_at'
    ) THEN
        ALTER TABLE submissions ADD COLUMN last_nudged_at timestamptz DEFAULT NULL;
    END IF;

    -- 2. Add cancelled_at column if it does not exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'submissions' AND column_name = 'cancelled_at'
    ) THEN
        ALTER TABLE submissions ADD COLUMN cancelled_at timestamptz DEFAULT NULL;
    END IF;

    -- 3. Add email column if it does not exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'submissions' AND column_name = 'email'
    ) THEN
        ALTER TABLE submissions ADD COLUMN email text DEFAULT NULL;
    END IF;
END $$;

-- 4. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_submissions_stage_updated_at 
ON submissions(stage_updated_at);

CREATE INDEX IF NOT EXISTS idx_submissions_last_nudged_at 
ON submissions(last_nudged_at);

CREATE INDEX IF NOT EXISTS idx_submissions_active_queue
ON submissions(stage, order_date)
WHERE is_flagged = false AND stage IN ('deposit_placed', 'allocation_confirmed', 'in_transit');

-- 5. Ensure completed benchmarks strictly compute medians only from delivered rows
CREATE OR REPLACE VIEW model_wait_benchmarks AS
SELECT 
    m.slug AS model,
    COUNT(s.id) AS sample_size,
    MIN(s.wait_days) AS min_days,
    ROUND(CAST(percentile_cont(0.25) WITHIN GROUP (ORDER BY s.wait_days) AS numeric), 0) AS p25_days,
    ROUND(CAST(percentile_cont(0.50) WITHIN GROUP (ORDER BY s.wait_days) AS numeric), 0) AS median_days,
    ROUND(CAST(percentile_cont(0.75) WITHIN GROUP (ORDER BY s.wait_days) AS numeric), 0) AS p75_days,
    MAX(s.wait_days) AS max_days,
    ROUND(AVG(s.wait_days), 1) AS mean_days
FROM vehicle_models m
JOIN submissions s ON s.model_id = m.id
WHERE s.is_flagged = false 
  AND (s.status = 'delivered' OR s.stage = 'delivered')
  AND s.wait_days IS NOT NULL
  AND s.delivery_date IS NOT NULL
  AND s.order_date IS NOT NULL
  AND s.wait_days > 0
GROUP BY m.slug;

GRANT SELECT ON model_wait_benchmarks TO anon, authenticated;
