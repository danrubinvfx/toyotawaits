-- ============================================================================
-- MODEL WAIT BENCHMARKS VIEW
-- Migration: 20261008000011_model_wait_benchmarks_view.sql
-- ============================================================================

DROP VIEW IF EXISTS model_wait_benchmarks;

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
  AND s.status = 'delivered' 
  AND s.wait_days IS NOT NULL
GROUP BY m.slug;

-- Grant public read access to the view
GRANT SELECT ON model_wait_benchmarks TO anon, authenticated;
