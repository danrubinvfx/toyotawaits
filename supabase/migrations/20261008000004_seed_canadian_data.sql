-- ============================================================================
-- INITIAL CANADIAN SEED DATA: RAV4, SIENNA, GRAND HIGHLANDER, LAND CRUISER
-- Migration: 20261008000004_seed_canadian_data.sql
-- ============================================================================

DO $$
DECLARE
    -- Model UUIDs
    m_rav4 UUID;
    m_sienna UUID;
    m_gh UUID;
    m_lc UUID;

    -- Powertrain UUIDs
    p_rav4_gas UUID;
    p_rav4_hev UUID;
    p_rav4_phev UUID;
    p_sienna_hev UUID;
    p_gh_gas UUID;
    p_gh_hev UUID;
    p_gh_max UUID;
    p_lc_hev UUID;
BEGIN

    -- ------------------------------------------------------------------------
    -- 1. VEHICLE MODELS
    -- ------------------------------------------------------------------------
    INSERT INTO vehicle_models (slug, name, generation_start_year, sort_order)
    VALUES 
        ('rav4', 'RAV4', 2019, 10),
        ('sienna', 'Sienna', 2021, 20),
        ('grand-highlander', 'Grand Highlander', 2024, 30),
        ('land-cruiser', 'Land Cruiser', 2024, 40)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

    SELECT id INTO m_rav4 FROM vehicle_models WHERE slug = 'rav4';
    SELECT id INTO m_sienna FROM vehicle_models WHERE slug = 'sienna';
    SELECT id INTO m_gh FROM vehicle_models WHERE slug = 'grand-highlander';
    SELECT id INTO m_lc FROM vehicle_models WHERE slug = 'land-cruiser';

    -- ------------------------------------------------------------------------
    -- 2. VEHICLE POWERTRAINS
    -- ------------------------------------------------------------------------
    -- RAV4 Powertrains
    INSERT INTO vehicle_powertrains (model_id, slug, name, sort_order)
    VALUES 
        (m_rav4, 'hev', 'Hybrid (HEV)', 1),
        (m_rav4, 'phev', 'Prime / Plug-in Hybrid (PHEV)', 2),
        (m_rav4, 'gas', 'Gasoline', 3)
    ON CONFLICT (model_id, slug) DO UPDATE SET name = EXCLUDED.name;

    SELECT id INTO p_rav4_hev FROM vehicle_powertrains WHERE model_id = m_rav4 AND slug = 'hev';
    SELECT id INTO p_rav4_phev FROM vehicle_powertrains WHERE model_id = m_rav4 AND slug = 'phev';
    SELECT id INTO p_rav4_gas FROM vehicle_powertrains WHERE model_id = m_rav4 AND slug = 'gas';

    -- Sienna Powertrain (All Canadian Siennas are HEV standard)
    INSERT INTO vehicle_powertrains (model_id, slug, name, sort_order)
    VALUES 
        (m_sienna, 'hev', 'Hybrid (HEV)', 1)
    ON CONFLICT (model_id, slug) DO UPDATE SET name = EXCLUDED.name;

    SELECT id INTO p_sienna_hev FROM vehicle_powertrains WHERE model_id = m_sienna AND slug = 'hev';

    -- Grand Highlander Powertrains
    INSERT INTO vehicle_powertrains (model_id, slug, name, sort_order)
    VALUES 
        (m_gh, 'hev', 'Hybrid (HEV)', 1),
        (m_gh, 'hybrid-max', 'Hybrid MAX', 2),
        (m_gh, 'gas', 'Gasoline Turbo', 3)
    ON CONFLICT (model_id, slug) DO UPDATE SET name = EXCLUDED.name;

    SELECT id INTO p_gh_hev FROM vehicle_powertrains WHERE model_id = m_gh AND slug = 'hev';
    SELECT id INTO p_gh_max FROM vehicle_powertrains WHERE model_id = m_gh AND slug = 'hybrid-max';
    SELECT id INTO p_gh_gas FROM vehicle_powertrains WHERE model_id = m_gh AND slug = 'gas';

    -- Land Cruiser Powertrain (250 Series - i-FORCE MAX Hybrid standard in Canada)
    INSERT INTO vehicle_powertrains (model_id, slug, name, sort_order)
    VALUES 
        (m_lc, 'hev', 'i-FORCE MAX Hybrid', 1)
    ON CONFLICT (model_id, slug) DO UPDATE SET name = EXCLUDED.name;

    SELECT id INTO p_lc_hev FROM vehicle_powertrains WHERE model_id = m_lc AND slug = 'hev';

    -- ------------------------------------------------------------------------
    -- 3. CANADIAN TRIMS SEED DATA
    -- ------------------------------------------------------------------------

    -- RAV4 PHEV (Prime) Trims
    INSERT INTO vehicle_trims (model_id, powertrain_id, slug, name, msrp_cad, sort_order)
    VALUES 
        (m_rav4, p_rav4_phev, 'se-awd', 'SE AWD', 51150.00, 1),
        (m_rav4, p_rav4_phev, 'xse-awd', 'XSE AWD', 55950.00, 2),
        (m_rav4, p_rav4_phev, 'xse-technology-awd', 'XSE AWD Technology Package', 61390.00, 3)
    ON CONFLICT (powertrain_id, slug) DO NOTHING;

    -- RAV4 HEV Trims
    INSERT INTO vehicle_trims (model_id, powertrain_id, slug, name, msrp_cad, sort_order)
    VALUES 
        (m_rav4, p_rav4_hev, 'le-awd', 'LE AWD', 36350.00, 1),
        (m_rav4, p_rav4_hev, 'xle-awd', 'XLE AWD', 39250.00, 2),
        (m_rav4, p_rav4_hev, 'woodland-awd', 'Woodland Edition AWD', 42350.00, 3),
        (m_rav4, p_rav4_hev, 'se-awd', 'SE AWD', 41050.00, 4),
        (m_rav4, p_rav4_hev, 'xse-awd', 'XSE AWD', 43850.00, 5),
        (m_rav4, p_rav4_hev, 'limited-awd', 'Limited AWD', 47250.00, 6)
    ON CONFLICT (powertrain_id, slug) DO NOTHING;

    -- RAV4 Gas Trims
    INSERT INTO vehicle_trims (model_id, powertrain_id, slug, name, msrp_cad, sort_order)
    VALUES 
        (m_rav4, p_rav4_gas, 'le-fwd', 'LE FWD', 33550.00, 1),
        (m_rav4, p_rav4_gas, 'le-awd', 'LE AWD', 35650.00, 2),
        (m_rav4, p_rav4_gas, 'xle-awd', 'XLE AWD', 38550.00, 3),
        (m_rav4, p_rav4_gas, 'trail-awd', 'Trail AWD', 42450.00, 4),
        (m_rav4, p_rav4_gas, 'limited-awd', 'Limited AWD', 46050.00, 5)
    ON CONFLICT (powertrain_id, slug) DO NOTHING;

    -- Sienna HEV Trims
    INSERT INTO vehicle_trims (model_id, powertrain_id, slug, name, msrp_cad, sort_order)
    VALUES 
        (m_sienna, p_sienna_hev, 'le-fwd', 'LE FWD (8-Passenger)', 45950.00, 1),
        (m_sienna, p_sienna_hev, 'le-awd', 'LE AWD (8-Passenger)', 47950.00, 2),
        (m_sienna, p_sienna_hev, 'xle-fwd', 'XLE FWD (8-Passenger)', 49290.00, 3),
        (m_sienna, p_sienna_hev, 'xse-fwd', 'XSE FWD (7-Passenger)', 51290.00, 4),
        (m_sienna, p_sienna_hev, 'xse-awd', 'XSE AWD (7-Passenger)', 53290.00, 5),
        (m_sienna, p_sienna_hev, 'xse-technology-awd', 'XSE Technology Package AWD', 58790.00, 6),
        (m_sienna, p_sienna_hev, 'limited-awd', 'Limited AWD (7-Passenger)', 63890.00, 7),
        (m_sienna, p_sienna_hev, 'platinum-awd', 'Platinum AWD (7-Passenger)', 67190.00, 8)
    ON CONFLICT (powertrain_id, slug) DO NOTHING;

    -- Grand Highlander Trims
    INSERT INTO vehicle_trims (model_id, powertrain_id, slug, name, msrp_cad, sort_order)
    VALUES 
        (m_gh, p_gh_gas, 'xle-awd', 'XLE AWD', 52990.00, 1),
        (m_gh, p_gh_hev, 'xle-hybrid-awd', 'XLE Hybrid AWD', 56290.00, 2),
        (m_gh, p_gh_hev, 'limited-hybrid-awd', 'Limited Hybrid AWD', 63650.00, 3),
        (m_gh, p_gh_max, 'limited-max-awd', 'Limited Hybrid MAX AWD', 67950.00, 4),
        (m_gh, p_gh_max, 'platinum-max-awd', 'Platinum Hybrid MAX AWD', 72050.00, 5)
    ON CONFLICT (powertrain_id, slug) DO NOTHING;

    -- Land Cruiser (250 Series) Trims
    INSERT INTO vehicle_trims (model_id, powertrain_id, slug, name, msrp_cad, sort_order)
    VALUES 
        (m_lc, p_lc_hev, '1958-grade', '1958 Grade', 71950.00, 1),
        (m_lc, p_lc_hev, 'land-cruiser-grade', 'Land Cruiser Grade', 79950.00, 2),
        (m_lc, p_lc_hev, 'land-cruiser-premium', 'Land Cruiser Grade with Premium Package', 85950.00, 3),
        (m_lc, p_lc_hev, 'first-edition', 'First Edition', 92950.00, 4)
    ON CONFLICT (powertrain_id, slug) DO NOTHING;

    -- ------------------------------------------------------------------------
    -- 4. INITIAL CLOAKED AFFILIATE REDIRECT SEED DATA
    -- ------------------------------------------------------------------------
    INSERT INTO affiliate_links (slug, destination_url, title, category)
    VALUES 
        ('tuxmat-rav4', 'https://www.amazon.ca/dp/B08XYZ1234?tag=toyotawait-20', 'TuxMat Custom Floor Liners (RAV4)', 'accessories'),
        ('tuxmat-sienna', 'https://www.amazon.ca/dp/B09ABC5678?tag=toyotawait-20', 'TuxMat Custom Floor Liners (Sienna 7/8 Passenger)', 'accessories'),
        ('viofo-a229-pro', 'https://www.amazon.ca/dp/B0CK123456?tag=toyotawait-20', 'VIOFO A229 Pro 4K HDR Dual Dash Cam', 'electronics'),
        ('screen-protector-12-3', 'https://www.amazon.ca/dp/B0BYZ98765?tag=toyotawait-20', '12.3-inch Infotainment Tempered Glass Screen Protector', 'accessories'),
        ('no-drill-mud-flaps-rav4', 'https://www.amazon.ca/dp/B07XYZ9999?tag=toyotawait-20', 'A-Premium No-Drill Mud Flaps Set for Toyota RAV4', 'exterior')
    ON CONFLICT (slug) DO NOTHING;

END $$;
