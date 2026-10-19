-- ============================================================================
-- ADD TOYOTA SEQUOIA LINEUP
-- Migration: 20261018000002_add_toyota_sequoia.sql
-- Integrates 3rd-Generation Toyota Sequoia (XK80) with i-FORCE MAX Hybrid 4WD
-- ============================================================================

DO $$
BEGIN
    -- 1. Sync Vehicle Model
    INSERT INTO vehicle_models (id, slug, name, generation_start_year, sort_order)
    VALUES
        ('10000000-0000-4000-8000-000000000010', 'sequoia', 'Sequoia', 2023, 90)
    ON CONFLICT (slug) DO UPDATE
    SET name = EXCLUDED.name,
        generation_start_year = EXCLUDED.generation_start_year,
        sort_order = EXCLUDED.sort_order;

    -- 2. Sync Vehicle Powertrains
    INSERT INTO vehicle_powertrains (id, model_id, slug, name, sort_order)
    VALUES
        ('20000000-0000-4000-8000-000000000100', '10000000-0000-4000-8000-000000000010', 'hev', 'i-FORCE MAX Twin-Turbo V6 Hybrid', 1)
    ON CONFLICT (model_id, slug) DO UPDATE
    SET name = EXCLUDED.name,
        sort_order = EXCLUDED.sort_order;

    -- 3. Sync Vehicle Trims
    INSERT INTO vehicle_trims (id, model_id, powertrain_id, slug, name, msrp_cad, sort_order)
    VALUES
        ('30000000-0000-4000-8000-000000000130', '10000000-0000-4000-8000-000000000010', '20000000-0000-4000-8000-000000000100', 'sr5-trd-off-road', 'SR5 TRD Off-Road', 84940.00, 1),
        ('30000000-0000-4000-8000-000000000131', '10000000-0000-4000-8000-000000000010', '20000000-0000-4000-8000-000000000100', 'limited-nightshade', 'Limited Nightshade', 88270.00, 2),
        ('30000000-0000-4000-8000-000000000132', '10000000-0000-4000-8000-000000000010', '20000000-0000-4000-8000-000000000100', 'platinum', 'Platinum', 99250.00, 3),
        ('30000000-0000-4000-8000-000000000133', '10000000-0000-4000-8000-000000000010', '20000000-0000-4000-8000-000000000100', 'trd-pro', 'TRD Pro', 100508.00, 4),
        ('30000000-0000-4000-8000-000000000134', '10000000-0000-4000-8000-000000000010', '20000000-0000-4000-8000-000000000100', 'capstone', 'Capstone', 102562.00, 5)
    ON CONFLICT (powertrain_id, slug) DO UPDATE
    SET name = EXCLUDED.name,
        msrp_cad = EXCLUDED.msrp_cad,
        sort_order = EXCLUDED.sort_order;

    -- Ensure Public/Anon Permissions
    GRANT SELECT ON vehicle_models TO anon, authenticated, public;
    GRANT SELECT ON vehicle_powertrains TO anon, authenticated, public;
    GRANT SELECT ON vehicle_trims TO anon, authenticated, public;
END $$;
