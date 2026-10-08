-- ============================================================================
-- STATISTICAL SUMMARY MATERIALIZED VIEW & REFRESH LOGIC
-- Migration: 20261008000002_materialized_view.sql
-- ============================================================================

DROP MATERIALIZED VIEW IF EXISTS mv_model_wait_summary;

CREATE MATERIALIZED VIEW mv_model_wait_summary AS
SELECT 
    m.id AS model_id,
    m.slug AS model_slug,
    m.name AS model_name,
    p.id AS powertrain_id,
    p.slug AS powertrain_slug,
    p.name AS powertrain_name,
    t.id AS trim_id,
    t.slug AS trim_slug,
    t.name AS trim_name,
    s.province,
    COUNT(*) AS total_samples,
    COUNT(*) FILTER (WHERE s.status = 'delivered') AS delivered_samples,
    COUNT(*) FILTER (WHERE s.status = 'pending') AS pending_samples,
    
    -- Percentile Calculations using continuous interpolation
    ROUND(CAST(percentile_cont(0.25) WITHIN GROUP (ORDER BY s.wait_days) AS numeric), 0) AS p25_wait_days,
    ROUND(CAST(percentile_cont(0.50) WITHIN GROUP (ORDER BY s.wait_days) AS numeric), 0) AS median_wait_days,
    ROUND(CAST(percentile_cont(0.75) WITHIN GROUP (ORDER BY s.wait_days) AS numeric), 0) AS p75_wait_days,
    ROUND(AVG(s.wait_days), 1) AS mean_wait_days,
    MIN(s.wait_days) AS min_wait_days,
    MAX(s.wait_days) AS max_wait_days,

    -- Dealer Transparency Aggregates
    COUNT(*) FILTER (WHERE s.pricing = 'above_msrp') AS above_msrp_count,
    COUNT(*) FILTER (WHERE s.pricing = 'at_msrp') AS at_msrp_count,
    ROUND(AVG(s.mandatory_addons_cad) FILTER (WHERE s.mandatory_addons_cad > 0), 2) AS avg_mandatory_addons,

    MAX(s.created_at) AS latest_submission_at
FROM submissions s
JOIN vehicle_models m ON s.model_id = m.id
JOIN vehicle_powertrains p ON s.powertrain_id = p.id
JOIN vehicle_trims t ON s.trim_id = t.id
WHERE s.is_flagged = false
GROUP BY 
    m.id, m.slug, m.name,
    p.id, p.slug, p.name,
    t.id, t.slug, t.name,
    s.province;

-- Unique index required for REFRESH MATERIALIZED VIEW CONCURRENTLY
CREATE UNIQUE INDEX IF NOT EXISTS uq_idx_mv_model_wait_summary 
    ON mv_model_wait_summary(model_id, powertrain_id, trim_id, province);

-- High-performance lookup indexes on the materialized view
CREATE INDEX IF NOT EXISTS idx_mv_summary_model_powertrain 
    ON mv_model_wait_summary(model_slug, powertrain_slug);

CREATE INDEX IF NOT EXISTS idx_mv_summary_deep_link 
    ON mv_model_wait_summary(model_slug, powertrain_slug, province);

-- Function to safely refresh materialized view
CREATE OR REPLACE FUNCTION refresh_wait_summary_mv()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_model_wait_summary;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
