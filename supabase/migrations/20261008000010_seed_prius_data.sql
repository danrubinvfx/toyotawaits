-- ============================================================================
-- SEED CANADIAN PRIUS & PRIUS PRIME DATA
-- Migration: 20261008000010_seed_prius_data.sql
-- ============================================================================

DO $$
DECLARE
    m_prius UUID;
    m_prius_prime UUID;
    p_prius_hev UUID;
    p_prius_phev UUID;
    p_prius_prime_phev UUID;
    t_pp_xse UUID;
    t_pp_se UUID;
    t_pp_xse_prem UUID;
    t_p_xle_awd UUID;
BEGIN

    -- ------------------------------------------------------------------------
    -- 1. VEHICLE MODELS
    -- ------------------------------------------------------------------------
    INSERT INTO vehicle_models (id, slug, name, generation_start_year, sort_order)
    VALUES 
        ('10000000-0000-4000-8000-000000000005', 'prius', 'Prius', 2023, 50),
        ('10000000-0000-4000-8000-000000000006', 'prius-prime', 'Prius Prime', 2023, 60)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

    SELECT id INTO m_prius FROM vehicle_models WHERE slug = 'prius';
    SELECT id INTO m_prius_prime FROM vehicle_models WHERE slug = 'prius-prime';

    -- ------------------------------------------------------------------------
    -- 2. VEHICLE POWERTRAINS
    -- ------------------------------------------------------------------------
    -- Prius Powertrains (HEV & PHEV)
    INSERT INTO vehicle_powertrains (id, model_id, slug, name, sort_order)
    VALUES 
        ('20000000-0000-4000-8000-000000000060', m_prius, 'hev', 'Hybrid (HEV)', 1),
        ('20000000-0000-4000-8000-000000000061', m_prius, 'phev', 'Plug-in Hybrid (PHEV)', 2)
    ON CONFLICT (model_id, slug) DO UPDATE SET name = EXCLUDED.name;

    -- Prius Prime Powertrain
    INSERT INTO vehicle_powertrains (id, model_id, slug, name, sort_order)
    VALUES 
        ('20000000-0000-4000-8000-000000000062', m_prius_prime, 'phev', 'Plug-in Hybrid (PHEV)', 1)
    ON CONFLICT (model_id, slug) DO UPDATE SET name = EXCLUDED.name;

    SELECT id INTO p_prius_hev FROM vehicle_powertrains WHERE model_id = m_prius AND slug = 'hev';
    SELECT id INTO p_prius_phev FROM vehicle_powertrains WHERE model_id = m_prius AND slug = 'phev';
    SELECT id INTO p_prius_prime_phev FROM vehicle_powertrains WHERE model_id = m_prius_prime AND slug = 'phev';

    -- ------------------------------------------------------------------------
    -- 3. VEHICLE TRIMS
    -- ------------------------------------------------------------------------
    -- Prius HEV Trims: LE AWD, XLE AWD, Limited AWD
    INSERT INTO vehicle_trims (id, model_id, powertrain_id, slug, name, msrp_cad, sort_order)
    VALUES 
        ('30000000-0000-4000-8000-000000000061', m_prius, p_prius_hev, 'le-awd', 'LE AWD', 37150.00, 1),
        ('30000000-0000-4000-8000-000000000062', m_prius, p_prius_hev, 'xle-awd', 'XLE AWD', 40650.00, 2),
        ('30000000-0000-4000-8000-000000000063', m_prius, p_prius_hev, 'limited-awd', 'Limited AWD', 44250.00, 3)
    ON CONFLICT (powertrain_id, slug) DO NOTHING;

    -- Prius PHEV Trims: SE, XSE, XSE Premium
    INSERT INTO vehicle_trims (id, model_id, powertrain_id, slug, name, msrp_cad, sort_order)
    VALUES 
        ('30000000-0000-4000-8000-000000000071', m_prius, p_prius_phev, 'se', 'SE', 39050.00, 1),
        ('30000000-0000-4000-8000-000000000072', m_prius, p_prius_phev, 'xse', 'XSE', 43750.00, 2),
        ('30000000-0000-4000-8000-000000000073', m_prius, p_prius_phev, 'xse-premium', 'XSE Premium', 47550.00, 3)
    ON CONFLICT (powertrain_id, slug) DO NOTHING;

    -- Prius Prime PHEV Trims: SE, XSE, XSE Premium
    INSERT INTO vehicle_trims (id, model_id, powertrain_id, slug, name, msrp_cad, sort_order)
    VALUES 
        ('30000000-0000-4000-8000-000000000081', m_prius_prime, p_prius_prime_phev, 'se', 'SE', 39050.00, 1),
        ('30000000-0000-4000-8000-000000000082', m_prius_prime, p_prius_prime_phev, 'xse', 'XSE', 43750.00, 2),
        ('30000000-0000-4000-8000-000000000083', m_prius_prime, p_prius_prime_phev, 'xse-premium', 'XSE Premium', 47550.00, 3)
    ON CONFLICT (powertrain_id, slug) DO NOTHING;

    SELECT id INTO t_pp_xse FROM vehicle_trims WHERE powertrain_id = p_prius_prime_phev AND slug = 'xse';
    SELECT id INTO t_pp_se FROM vehicle_trims WHERE powertrain_id = p_prius_prime_phev AND slug = 'se';
    SELECT id INTO t_pp_xse_prem FROM vehicle_trims WHERE powertrain_id = p_prius_prime_phev AND slug = 'xse-premium';
    SELECT id INTO t_p_xle_awd FROM vehicle_trims WHERE powertrain_id = p_prius_hev AND slug = 'xle-awd';

    -- ------------------------------------------------------------------------
    -- 4. REALISTIC INITIAL SUBMISSIONS
    -- ------------------------------------------------------------------------
    -- 1. Prius Prime, PHEV, XSE, ON, Toronto, Order: 2025-08-15, Delivery: 2026-02-12, delivered, at_msrp
    INSERT INTO submissions (
        id, model_id, powertrain_id, trim_id, province, dealership_city, dealership_name,
        model_year, order_date, delivery_date, status, pricing, mandatory_addons_cad,
        notes, edit_key_hash, is_flagged
    ) VALUES (
        'a1000000-0000-4000-8000-000000000010', m_prius_prime, p_prius_prime_phev, t_pp_xse, 'ON', 'Toronto', 'Ken Shaw Toyota',
        2026, '2025-08-15', '2026-02-12', 'delivered', 'at_msrp', 0,
        'Delivered at exact MSRP in Toronto.', encode(sha256('seed-key-prius-1'::bytea), 'hex'), false
    ) ON CONFLICT (id) DO NOTHING;

    -- 2. Prius Prime, PHEV, SE, BC, Langley, Order: 2026-04-10, Delivery: 2026-05-15, delivered, at_msrp
    INSERT INTO submissions (
        id, model_id, powertrain_id, trim_id, province, dealership_city, dealership_name,
        model_year, order_date, delivery_date, status, pricing, mandatory_addons_cad,
        notes, edit_key_hash, is_flagged
    ) VALUES (
        'a1000000-0000-4000-8000-000000000011', m_prius_prime, p_prius_prime_phev, t_pp_se, 'BC', 'Langley', 'Langley Toyota',
        2026, '2026-04-10', '2026-05-15', 'delivered', 'at_msrp', 0,
        'Quick delivery from dealer allocation batch in Langley.', encode(sha256('seed-key-prius-2'::bytea), 'hex'), false
    ) ON CONFLICT (id) DO NOTHING;

    -- 3. Prius Prime, PHEV, XSE Premium, AB, Calgary, Order: 2025-05-12, Delivery: 2026-04-18, delivered, at_msrp
    INSERT INTO submissions (
        id, model_id, powertrain_id, trim_id, province, dealership_city, dealership_name,
        model_year, order_date, delivery_date, status, pricing, mandatory_addons_cad,
        notes, edit_key_hash, is_flagged
    ) VALUES (
        'a1000000-0000-4000-8000-000000000012', m_prius_prime, p_prius_prime_phev, t_pp_xse_prem, 'AB', 'Calgary', 'Stampede Toyota',
        2026, '2025-05-12', '2026-04-18', 'delivered', 'at_msrp', 0,
        'Waited 11 months for XSE Premium at Calgary dealer.', encode(sha256('seed-key-prius-3'::bytea), 'hex'), false
    ) ON CONFLICT (id) DO NOTHING;

    -- 4. Prius, HEV, XLE AWD, ON, Ottawa, Order: 2026-05-02, Delivery: 2026-08-14, delivered, at_msrp
    INSERT INTO submissions (
        id, model_id, powertrain_id, trim_id, province, dealership_city, dealership_name,
        model_year, order_date, delivery_date, status, pricing, mandatory_addons_cad,
        notes, edit_key_hash, is_flagged
    ) VALUES (
        'a1000000-0000-4000-8000-000000000013', m_prius, p_prius_hev, t_p_xle_awd, 'ON', 'Ottawa', 'Mendes Toyota',
        2026, '2026-05-02', '2026-08-14', 'delivered', 'at_msrp', 0,
        'Clean deal at MSRP in Ottawa under 3.5 months wait.', encode(sha256('seed-key-prius-4'::bytea), 'hex'), false
    ) ON CONFLICT (id) DO NOTHING;

    -- 5. Prius Prime, PHEV, XSE, QC, Montreal, Order: 2026-03-01, Delivery: null, pending, at_msrp
    INSERT INTO submissions (
        id, model_id, powertrain_id, trim_id, province, dealership_city, dealership_name,
        model_year, order_date, delivery_date, status, pricing, mandatory_addons_cad,
        notes, edit_key_hash, is_flagged
    ) VALUES (
        'a1000000-0000-4000-8000-000000000014', m_prius_prime, p_prius_prime_phev, t_pp_xse, 'QC', 'Montreal', 'Alix Toyota',
        2026, '2026-03-01', NULL, 'pending', 'at_msrp', 0,
        'Deposit confirmed in Montreal awaiting allocation.', encode(sha256('seed-key-prius-5'::bytea), 'hex'), false
    ) ON CONFLICT (id) DO NOTHING;

END $$;
