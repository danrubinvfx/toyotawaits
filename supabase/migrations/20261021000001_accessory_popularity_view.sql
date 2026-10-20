-- ============================================================================
-- MIGRATION: 20261021000001_accessory_popularity_view.sql
-- Description: 30-day popularity aggregation view for affiliate gear accessories
-- ============================================================================

-- Create 30-day rolling affiliate click popularity view
CREATE OR REPLACE VIEW view_accessory_popularity_30d AS
SELECT
    accessory_id,
    COUNT(*)::int AS click_count,
    MAX(created_at) AS last_clicked_at
FROM telemetry_affiliate_clicks
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY accessory_id
ORDER BY click_count DESC;

-- Allow anon and authenticated read access for public telemetry aggregation
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'telemetry_affiliate_clicks' 
        AND policyname = 'Allow anon read telemetry_affiliate_clicks'
    ) THEN
        CREATE POLICY "Allow anon read telemetry_affiliate_clicks"
            ON telemetry_affiliate_clicks
            FOR SELECT
            TO anon, authenticated
            USING (true);
    END IF;
END $$;

-- Grant permissions on the view
GRANT SELECT ON view_accessory_popularity_30d TO anon, authenticated, service_role;
