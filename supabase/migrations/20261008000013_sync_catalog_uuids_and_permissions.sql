-- ============================================================================
-- SYNC CANONICAL CATALOG UUIDS & SUBMISSIONS RLS/TABLE PERMISSIONS
-- Migration: 20261008000013_sync_catalog_uuids_and_permissions.sql
-- ============================================================================

-- 1. Ensure Table Privileges for Anonymous and Authenticated Roles
GRANT SELECT, INSERT, UPDATE ON submissions TO anon, authenticated;
GRANT SELECT ON vehicle_models TO anon, authenticated;
GRANT SELECT ON vehicle_powertrains TO anon, authenticated;
GRANT SELECT ON vehicle_trims TO anon, authenticated;

-- 2. Ensure RLS Policies allow SELECT and INSERT for both Delivered & Pending rows
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view unflagged submissions" ON submissions;
DROP POLICY IF EXISTS "Public can view all unflagged submissions" ON submissions;

CREATE POLICY "Public can view all unflagged submissions"
    ON submissions FOR SELECT
    TO anon, authenticated, public
    USING (
        is_flagged = false AND 
        status IN ('delivered', 'pending')
    );

DROP POLICY IF EXISTS "Public can create anonymous submissions" ON submissions;

CREATE POLICY "Public can create anonymous submissions"
    ON submissions FOR INSERT
    TO anon, authenticated, public
    WITH CHECK (
        is_flagged = false AND
        order_date <= CURRENT_DATE AND
        (delivery_date IS NULL OR delivery_date <= CURRENT_DATE)
    );

-- 3. Sync Reference Dimension Catalog UUIDs
DO $$
BEGIN
    -- Sync Models
    INSERT INTO vehicle_models (id, slug, name, generation_start_year, sort_order)
    VALUES 
        ('10000000-0000-4000-8000-000000000001', 'rav4', 'RAV4', 2019, 10),
        ('10000000-0000-4000-8000-000000000002', 'sienna', 'Sienna', 2021, 20),
        ('10000000-0000-4000-8000-000000000003', 'grand-highlander', 'Grand Highlander', 2024, 30),
        ('10000000-0000-4000-8000-000000000004', 'land-cruiser', 'Land Cruiser', 2024, 40),
        ('10000000-0000-4000-8000-000000000005', 'prius', 'Prius', 2023, 50),
        ('10000000-0000-4000-8000-000000000006', 'prius-prime', 'Prius Prime', 2023, 60)
    ON CONFLICT (slug) DO UPDATE 
    SET name = EXCLUDED.name,
        generation_start_year = EXCLUDED.generation_start_year,
        sort_order = EXCLUDED.sort_order;

    -- Sync Powertrains
    INSERT INTO vehicle_powertrains (id, model_id, slug, name, sort_order)
    VALUES 
        ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'hev', 'Hybrid (HEV)', 1),
        ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'phev', 'Plug-in Hybrid (PHEV)', 2),
        ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', 'gas', 'Gasoline', 3),
        ('20000000-0000-4000-8000-000000000030', '10000000-0000-4000-8000-000000000002', 'hev', 'Hybrid (HEV)', 1),
        ('20000000-0000-4000-8000-000000000040', '10000000-0000-4000-8000-000000000003', 'hev', 'Hybrid (HEV)', 1),
        ('20000000-0000-4000-8000-000000000043', '10000000-0000-4000-8000-000000000003', 'hybrid-max', 'Hybrid MAX', 2),
        ('20000000-0000-4000-8000-000000000046', '10000000-0000-4000-8000-000000000003', 'gas', 'Gasoline Turbo', 3),
        ('20000000-0000-4000-8000-000000000050', '10000000-0000-4000-8000-000000000004', 'hev', 'i-FORCE MAX Hybrid', 1),
        ('20000000-0000-4000-8000-000000000060', '10000000-0000-4000-8000-000000000005', 'hev', 'Hybrid (HEV)', 1),
        ('20000000-0000-4000-8000-000000000061', '10000000-0000-4000-8000-000000000005', 'phev', 'Plug-in Hybrid (PHEV)', 2),
        ('20000000-0000-4000-8000-000000000062', '10000000-0000-4000-8000-000000000006', 'phev', 'Plug-in Hybrid (PHEV)', 1)
    ON CONFLICT (model_id, slug) DO UPDATE
    SET name = EXCLUDED.name,
        sort_order = EXCLUDED.sort_order;

    -- Sync Trims
    INSERT INTO vehicle_trims (id, model_id, powertrain_id, slug, name, msrp_cad, sort_order)
    VALUES
        ('30000000-0000-4000-8000-000000000010', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000002', 'se-awd', 'SE AWD', 48750.00, 1),
        ('30000000-0000-4000-8000-000000000011', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000002', 'xse-awd', 'XSE AWD', 56400.00, 2),
        ('30000000-0000-4000-8000-000000000012', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000002', 'xse-technology-awd', 'XSE AWD Technology Package', 59350.00, 3),
        ('30000000-0000-4000-8000-000000000013', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000002', 'gr-sport-awd', 'GR SPORT AWD', 57500.00, 4)
    ON CONFLICT (powertrain_id, slug) DO UPDATE
    SET name = EXCLUDED.name,
        msrp_cad = EXCLUDED.msrp_cad,
        sort_order = EXCLUDED.sort_order;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Sync catalog UUIDs completed with notice: %', SQLERRM;
END $$;
