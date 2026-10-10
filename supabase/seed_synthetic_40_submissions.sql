-- ============================================================================
-- SYNTHETIC TEST SEED DATA: 40 REALISTIC CANADIAN SUBMISSIONS
-- Compatible with Supabase SQL Editor and Direct PostgreSQL Migration
-- ============================================================================

DO $$
DECLARE
    -- Models
    m_rav4 UUID;
    m_sienna UUID;
    m_gh UUID;
    m_lc UUID;
    m_prius UUID;
    m_prius_prime UUID;

    -- Powertrains
    p_rav4_hev UUID;
    p_rav4_phev UUID;
    p_sienna_hev UUID;
    p_gh_hev UUID;
    p_gh_max UUID;
    p_lc_hev UUID;
    p_prius_hev UUID;
    p_prius_prime_phev UUID;

    -- Trims (RAV4)
    t_rav4_xse_tech UUID;
    t_rav4_xse_phev UUID;
    t_rav4_se_phev UUID;
    t_rav4_xle_hev UUID;
    t_rav4_woodland_hev UUID;
    t_rav4_limited_hev UUID;

    -- Trims (Sienna)
    t_sienna_xse UUID;
    t_sienna_limited UUID;
    t_sienna_le UUID;
    t_sienna_xle UUID;

    -- Trims (Grand Highlander)
    t_gh_limited_hev UUID;
    t_gh_xle_hev UUID;
    t_gh_platinum_max UUID;

    -- Trims (Land Cruiser)
    t_lc_grade UUID;
    t_lc_1958 UUID;

    -- Trims (Prius & Prius Prime)
    t_prime_se UUID;
    t_prime_xse UUID;
    t_prime_xse_prem UUID;
    t_prius_le UUID;
    t_prius_xle UUID;
    t_prius_limited UUID;

    v_count INT := 0;
BEGIN
    -- 1. Lookup Models
    SELECT id INTO m_rav4 FROM vehicle_models WHERE slug = 'rav4';
    SELECT id INTO m_sienna FROM vehicle_models WHERE slug = 'sienna';
    SELECT id INTO m_gh FROM vehicle_models WHERE slug = 'grand-highlander';
    SELECT id INTO m_lc FROM vehicle_models WHERE slug = 'land-cruiser';
    SELECT id INTO m_prius FROM vehicle_models WHERE slug = 'prius';
    SELECT id INTO m_prius_prime FROM vehicle_models WHERE slug = 'prius-prime';

    -- 2. Lookup Powertrains
    SELECT id INTO p_rav4_hev FROM vehicle_powertrains WHERE model_id = m_rav4 AND slug = 'hev';
    SELECT id INTO p_rav4_phev FROM vehicle_powertrains WHERE model_id = m_rav4 AND slug = 'phev';
    SELECT id INTO p_sienna_hev FROM vehicle_powertrains WHERE model_id = m_sienna AND slug = 'hev';
    SELECT id INTO p_gh_hev FROM vehicle_powertrains WHERE model_id = m_gh AND slug = 'hev';
    SELECT id INTO p_gh_max FROM vehicle_powertrains WHERE model_id = m_gh AND slug = 'hybrid-max';
    SELECT id INTO p_lc_hev FROM vehicle_powertrains WHERE model_id = m_lc AND slug = 'hev';
    SELECT id INTO p_prius_hev FROM vehicle_powertrains WHERE model_id = m_prius AND slug = 'hev';
    SELECT id INTO p_prius_prime_phev FROM vehicle_powertrains WHERE model_id = m_prius_prime AND slug = 'phev';

    -- Fallback for Prius Prime if under Prius model
    IF p_prius_prime_phev IS NULL THEN
        SELECT id INTO p_prius_prime_phev FROM vehicle_powertrains WHERE model_id = m_prius AND slug = 'phev';
    END IF;

    -- 3. Lookup Trims
    SELECT id INTO t_rav4_xse_tech FROM vehicle_trims WHERE powertrain_id = p_rav4_phev AND slug = 'xse-technology-awd';
    SELECT id INTO t_rav4_xse_phev FROM vehicle_trims WHERE powertrain_id = p_rav4_phev AND slug = 'xse-awd';
    SELECT id INTO t_rav4_se_phev FROM vehicle_trims WHERE powertrain_id = p_rav4_phev AND slug = 'se-awd';
    SELECT id INTO t_rav4_xle_hev FROM vehicle_trims WHERE powertrain_id = p_rav4_hev AND slug = 'xle-awd';
    SELECT id INTO t_rav4_woodland_hev FROM vehicle_trims WHERE powertrain_id = p_rav4_hev AND slug = 'woodland-awd';
    SELECT id INTO t_rav4_limited_hev FROM vehicle_trims WHERE powertrain_id = p_rav4_hev AND slug = 'limited-awd';

    SELECT id INTO t_sienna_xse FROM vehicle_trims WHERE powertrain_id = p_sienna_hev AND slug LIKE 'xse%';
    SELECT id INTO t_sienna_limited FROM vehicle_trims WHERE powertrain_id = p_sienna_hev AND slug = 'limited-awd';
    SELECT id INTO t_sienna_le FROM vehicle_trims WHERE powertrain_id = p_sienna_hev AND slug LIKE 'le%';
    SELECT id INTO t_sienna_xle FROM vehicle_trims WHERE powertrain_id = p_sienna_hev AND slug LIKE 'xle%';

    SELECT id INTO t_gh_limited_hev FROM vehicle_trims WHERE powertrain_id = p_gh_hev AND slug LIKE '%limited%';
    SELECT id INTO t_gh_xle_hev FROM vehicle_trims WHERE powertrain_id = p_gh_hev AND slug LIKE '%xle%';
    SELECT id INTO t_gh_platinum_max FROM vehicle_trims WHERE powertrain_id = p_gh_max AND slug LIKE '%platinum%';

    SELECT id INTO t_lc_grade FROM vehicle_trims WHERE powertrain_id = p_lc_hev AND slug = 'land-cruiser-grade';
    SELECT id INTO t_lc_1958 FROM vehicle_trims WHERE powertrain_id = p_lc_hev AND slug LIKE '1958%';

    SELECT id INTO t_prime_se FROM vehicle_trims WHERE powertrain_id = p_prius_prime_phev AND slug = 'se';
    SELECT id INTO t_prime_xse FROM vehicle_trims WHERE powertrain_id = p_prius_prime_phev AND slug = 'xse';
    SELECT id INTO t_prime_xse_prem FROM vehicle_trims WHERE powertrain_id = p_prius_prime_phev AND slug = 'xse-premium';

    SELECT id INTO t_prius_le FROM vehicle_trims WHERE powertrain_id = p_prius_hev AND slug = 'le-awd';
    SELECT id INTO t_prius_xle FROM vehicle_trims WHERE powertrain_id = p_prius_hev AND slug = 'xle-awd';
    SELECT id INTO t_prius_limited FROM vehicle_trims WHERE powertrain_id = p_prius_hev AND slug = 'limited-awd';

    -- Delete any previous synthetic test records (idempotent seed)
    DELETE FROM submissions WHERE id >= 'b1000000-0000-4000-8000-000000000001' AND id <= 'b1000000-0000-4000-8000-000000000040';

    -- 4. Insert 40 Synthetic Submissions
    -- RAV4 Group (10 rows: 7 delivered, 3 pending)
    INSERT INTO submissions (id, model_id, powertrain_id, trim_id, province, dealership_city, dealership_name, model_year, order_date, delivery_date, status, pricing, mandatory_addons_cad, trade_in_required, notes, edit_key_hash, is_flagged, created_at)
    VALUES
    ('b1000000-0000-4000-8000-000000000001', m_rav4, p_rav4_phev, t_rav4_xse_tech, 'BC', 'Vancouver', 'Regency Toyota', 2026, '2025-05-10', '2026-06-15', 'delivered', 'at_msrp', 0, false, 'Waited 13 months, delivered at exact MSRP.', encode(digest('seed-syn-1', 'sha256'), 'hex'), false, NOW() - INTERVAL '28 days'),
    ('b1000000-0000-4000-8000-000000000002', m_rav4, p_rav4_phev, t_rav4_xse_phev, 'BC', 'Victoria', 'Metro Toyota Victoria', 2026, '2025-07-20', '2026-06-10', 'delivered', 'at_msrp', 0, false, 'XSE Technology arrived clean.', encode(digest('seed-syn-2', 'sha256'), 'hex'), false, NOW() - INTERVAL '27 days'),
    ('b1000000-0000-4000-8000-000000000003', m_rav4, p_rav4_phev, t_rav4_se_phev, 'QC', 'Montreal', 'Toyota Gabriel Centre-Ville', 2025, '2024-11-15', '2025-08-20', 'delivered', 'at_msrp', 0, false, 'Federal + provincial rebates applied smoothly.', encode(digest('seed-syn-3', 'sha256'), 'hex'), false, NOW() - INTERVAL '25 days'),
    ('b1000000-0000-4000-8000-000000000004', m_rav4, p_rav4_phev, t_rav4_xse_tech, 'ON', 'Toronto', 'Downtown Toyota', 2026, '2025-02-14', '2026-03-30', 'delivered', 'above_msrp', 850, false, 'Mandatory cargo mat and block heater package.', encode(digest('seed-syn-4', 'sha256'), 'hex'), false, NOW() - INTERVAL '24 days'),
    ('b1000000-0000-4000-8000-000000000005', m_rav4, p_rav4_phev, t_rav4_xse_tech, 'BC', 'Burnaby', 'Destination Toyota', 2026, '2025-11-05', NULL, 'pending', 'at_msrp', 0, false, 'Deposit placed, waiting on allocation build date.', encode(digest('seed-syn-5', 'sha256'), 'hex'), false, NOW() - INTERVAL '22 days'),
    ('b1000000-0000-4000-8000-000000000006', m_rav4, p_rav4_phev, t_rav4_se_phev, 'AB', 'Calgary', 'Canyon Creek Toyota', 2026, '2026-02-18', NULL, 'pending', 'at_msrp', 0, false, 'In queue for SE AWD in Alberta.', encode(digest('seed-syn-6', 'sha256'), 'hex'), false, NOW() - INTERVAL '20 days'),
    ('b1000000-0000-4000-8000-000000000007', m_rav4, p_rav4_hev, t_rav4_xle_hev, 'ON', 'Mississauga', 'Erin Park Toyota', 2026, '2025-09-12', '2026-02-15', 'delivered', 'at_msrp', 0, false, 'Hybrid XLE arrived ahead of estimate.', encode(digest('seed-syn-7', 'sha256'), 'hex'), false, NOW() - INTERVAL '19 days'),
    ('b1000000-0000-4000-8000-000000000008', m_rav4, p_rav4_hev, t_rav4_woodland_hev, 'AB', 'Edmonton', 'Mayfield Toyota', 2026, '2025-08-01', '2026-01-20', 'delivered', 'above_msrp', 350, false, 'Woodland edition with TRD roof rack.', encode(digest('seed-syn-8', 'sha256'), 'hex'), false, NOW() - INTERVAL '18 days'),
    ('b1000000-0000-4000-8000-000000000009', m_rav4, p_rav4_hev, t_rav4_limited_hev, 'MB', 'Winnipeg', 'Birchwood Toyota', 2026, '2025-06-10', '2025-12-05', 'delivered', 'at_msrp', 0, false, 'Delivered smoothly in Winnipeg.', encode(digest('seed-syn-9', 'sha256'), 'hex'), false, NOW() - INTERVAL '16 days'),
    ('b1000000-0000-4000-8000-000000000010', m_rav4, p_rav4_hev, t_rav4_xle_hev, 'NS', 'Halifax', 'O''Regan''s Toyota Halifax', 2026, '2026-04-10', NULL, 'pending', 'at_msrp', 0, false, 'Order confirmed, waiting for maritime shipment.', encode(digest('seed-syn-10', 'sha256'), 'hex'), false, NOW() - INTERVAL '15 days'),

    -- Sienna Group (8 rows: 5 delivered, 3 pending)
    ('b1000000-0000-4000-8000-000000000011', m_sienna, p_sienna_hev, t_sienna_xse, 'ON', 'Markham', 'Markville Toyota', 2026, '2025-01-10', '2026-02-25', 'delivered', 'at_msrp', 0, false, 'Long 13-month wait for 7-passenger XSE.', encode(digest('seed-syn-11', 'sha256'), 'hex'), false, NOW() - INTERVAL '26 days'),
    ('b1000000-0000-4000-8000-000000000012', m_sienna, p_sienna_hev, t_sienna_limited, 'BC', 'Richmond', 'OpenRoad Toyota Richmond', 2026, '2024-12-05', '2026-01-18', 'delivered', 'above_msrp', 1200, false, 'Protection package added by dealership.', encode(digest('seed-syn-12', 'sha256'), 'hex'), false, NOW() - INTERVAL '25 days'),
    ('b1000000-0000-4000-8000-000000000013', m_sienna, p_sienna_hev, t_sienna_le, 'QC', 'Laval', 'Chomedey Toyota Laval', 2025, '2024-10-15', '2025-09-30', 'delivered', 'at_msrp', 0, false, 'LE AWD 8-seater picked up at MSRP.', encode(digest('seed-syn-13', 'sha256'), 'hex'), false, NOW() - INTERVAL '23 days'),
    ('b1000000-0000-4000-8000-000000000014', m_sienna, p_sienna_hev, t_sienna_xle, 'AB', 'Calgary', 'Stampede Toyota', 2026, '2025-03-01', '2026-04-10', 'delivered', 'at_msrp', 0, false, 'Family van delivered right on timeline.', encode(digest('seed-syn-14', 'sha256'), 'hex'), false, NOW() - INTERVAL '21 days'),
    ('b1000000-0000-4000-8000-000000000015', m_sienna, p_sienna_hev, t_sienna_xse, 'SK', 'Saskatoon', 'Ens Toyota', 2026, '2025-05-15', '2026-05-20', 'delivered', 'at_msrp', 450, false, 'Block heater and all-weather mats included.', encode(digest('seed-syn-15', 'sha256'), 'hex'), false, NOW() - INTERVAL '19 days'),
    ('b1000000-0000-4000-8000-000000000016', m_sienna, p_sienna_hev, t_sienna_limited, 'ON', 'Ottawa', 'Mendes Toyota', 2026, '2025-08-20', NULL, 'pending', 'at_msrp', 0, false, 'Allocated for autumn build slot.', encode(digest('seed-syn-16', 'sha256'), 'hex'), false, NOW() - INTERVAL '14 days'),
    ('b1000000-0000-4000-8000-000000000017', m_sienna, p_sienna_hev, t_sienna_xse, 'BC', 'Surrey', 'Peace Arch Toyota', 2026, '2025-10-12', NULL, 'pending', 'at_msrp', 0, false, 'Still waiting on XSE AWD allocation.', encode(digest('seed-syn-17', 'sha256'), 'hex'), false, NOW() - INTERVAL '12 days'),
    ('b1000000-0000-4000-8000-000000000018', m_sienna, p_sienna_hev, t_sienna_le, 'QC', 'Quebec City', 'Ste-Foy Toyota', 2026, '2026-01-25', NULL, 'pending', 'at_msrp', 0, false, 'Deposit given in January 2026.', encode(digest('seed-syn-18', 'sha256'), 'hex'), false, NOW() - INTERVAL '10 days'),

    -- Grand Highlander Group (7 rows: 5 delivered, 2 pending)
    ('b1000000-0000-4000-8000-000000000019', m_gh, p_gh_hev, t_gh_limited_hev, 'BC', 'Vancouver', 'Jim Pattison Toyota Downtown', 2026, '2025-04-15', '2026-03-01', 'delivered', 'at_msrp', 0, false, 'Hybrid Limited AWD delivered at MSRP.', encode(digest('seed-syn-19', 'sha256'), 'hex'), false, NOW() - INTERVAL '27 days'),
    ('b1000000-0000-4000-8000-000000000020', m_gh, p_gh_hev, t_gh_xle_hev, 'ON', 'Oakville', 'Oakville Toyota', 2026, '2025-07-10', '2026-04-05', 'delivered', 'at_msrp', 0, false, 'XLE Hybrid delivered in 269 days.', encode(digest('seed-syn-20', 'sha256'), 'hex'), false, NOW() - INTERVAL '24 days'),
    ('b1000000-0000-4000-8000-000000000021', m_gh, p_gh_max, t_gh_platinum_max, 'AB', 'Edmonton', 'Sherwood Park Toyota', 2026, '2025-06-20', '2026-02-10', 'delivered', 'above_msrp', 995, false, 'Hybrid MAX powertrain is fantastic.', encode(digest('seed-syn-21', 'sha256'), 'hex'), false, NOW() - INTERVAL '22 days'),
    ('b1000000-0000-4000-8000-000000000022', m_gh, p_gh_hev, t_gh_limited_hev, 'QC', 'Montreal', 'Spinelli Toyota Lachine', 2025, '2024-11-20', '2025-09-15', 'delivered', 'at_msrp', 0, false, 'No forced dealer add-ons.', encode(digest('seed-syn-22', 'sha256'), 'hex'), false, NOW() - INTERVAL '20 days'),
    ('b1000000-0000-4000-8000-000000000023', m_gh, p_gh_max, t_gh_platinum_max, 'ON', 'Toronto', 'Ken Shaw Toyota', 2026, '2025-09-05', '2026-05-12', 'delivered', 'at_msrp', 0, false, 'Platinum MAX delivered smoothly.', encode(digest('seed-syn-23', 'sha256'), 'hex'), false, NOW() - INTERVAL '17 days'),
    ('b1000000-0000-4000-8000-000000000024', m_gh, p_gh_hev, t_gh_xle_hev, 'MB', 'Winnipeg', 'McPhillips Toyota', 2026, '2026-02-01', NULL, 'pending', 'at_msrp', 0, false, 'Order accepted by factory.', encode(digest('seed-syn-24', 'sha256'), 'hex'), false, NOW() - INTERVAL '11 days'),
    ('b1000000-0000-4000-8000-000000000025', m_gh, p_gh_max, t_gh_platinum_max, 'BC', 'Kelowna', 'Kelowna Toyota', 2026, '2026-03-15', NULL, 'pending', 'at_msrp', 0, false, 'Waiting on MAX allocation in Okanagan.', encode(digest('seed-syn-25', 'sha256'), 'hex'), false, NOW() - INTERVAL '8 days'),

    -- Land Cruiser Group (5 rows: 4 delivered, 1 pending)
    ('b1000000-0000-4000-8000-000000000026', m_lc, p_lc_hev, t_lc_grade, 'BC', 'North Vancouver', 'Jim Pattison Northshore', 2026, '2025-10-01', '2026-02-15', 'delivered', 'at_msrp', 0, false, 'Land Cruiser Grade in Meteor Shower.', encode(digest('seed-syn-26', 'sha256'), 'hex'), false, NOW() - INTERVAL '26 days'),
    ('b1000000-0000-4000-8000-000000000027', m_lc, p_lc_hev, t_lc_1958, 'AB', 'Calgary', 'Charlesglen Toyota', 2026, '2025-11-10', '2026-02-28', 'delivered', 'at_msrp', 0, false, '1958 round headlight model delivered fast.', encode(digest('seed-syn-27', 'sha256'), 'hex'), false, NOW() - INTERVAL '21 days'),
    ('b1000000-0000-4000-8000-000000000028', m_lc, p_lc_hev, t_lc_grade, 'ON', 'Toronto', 'Yorkdale Toyota', 2026, '2025-08-15', '2026-01-20', 'delivered', 'above_msrp', 1500, false, 'Dealer ceramic coat and rust module.', encode(digest('seed-syn-28', 'sha256'), 'hex'), false, NOW() - INTERVAL '18 days'),
    ('b1000000-0000-4000-8000-000000000029', m_lc, p_lc_hev, t_lc_grade, 'QC', 'Gatineau', 'Gatineau Toyota', 2026, '2025-12-01', '2026-04-10', 'delivered', 'at_msrp', 0, false, '130 days wait time, MSRP honored.', encode(digest('seed-syn-29', 'sha256'), 'hex'), false, NOW() - INTERVAL '15 days'),
    ('b1000000-0000-4000-8000-000000000030', m_lc, p_lc_hev, t_lc_1958, 'NS', 'Halifax', 'O''Regan''s Toyota Dartmouth', 2026, '2026-05-10', NULL, 'pending', 'at_msrp', 0, false, 'Waiting on Atlantic Canada allocation.', encode(digest('seed-syn-30', 'sha256'), 'hex'), false, NOW() - INTERVAL '7 days'),

    -- Prius Prime Group (5 rows: 4 delivered, 1 pending)
    ('b1000000-0000-4000-8000-000000000031', COALESCE(m_prius_prime, m_prius), p_prius_prime_phev, t_prime_xse, 'BC', 'Vancouver', 'Granville Toyota', 2026, '2025-05-01', '2026-03-15', 'delivered', 'at_msrp', 0, false, 'Gen 5 Prime XSE delivered in Vancouver.', encode(digest('seed-syn-31', 'sha256'), 'hex'), false, NOW() - INTERVAL '25 days'),
    ('b1000000-0000-4000-8000-000000000032', COALESCE(m_prius_prime, m_prius), p_prius_prime_phev, t_prime_se, 'QC', 'Montreal', 'Toyota Woodland Verdun', 2025, '2024-12-10', '2025-09-20', 'delivered', 'at_msrp', 0, false, 'Quebec subsidy $5000 + Federal $5000.', encode(digest('seed-syn-32', 'sha256'), 'hex'), false, NOW() - INTERVAL '23 days'),
    ('b1000000-0000-4000-8000-000000000033', COALESCE(m_prius_prime, m_prius), p_prius_prime_phev, t_prime_xse_prem, 'ON', 'Vaughan', 'Maple Toyota', 2026, '2025-03-15', '2026-02-01', 'delivered', 'above_msrp', 650, false, 'Window tinting and dashcam added.', encode(digest('seed-syn-33', 'sha256'), 'hex'), false, NOW() - INTERVAL '19 days'),
    ('b1000000-0000-4000-8000-000000000034', COALESCE(m_prius_prime, m_prius), p_prius_prime_phev, t_prime_xse, 'AB', 'Calgary', 'South Pointe Toyota', 2026, '2025-07-05', NULL, 'pending', 'at_msrp', 0, false, 'Deposit placed, waiting for build allocation in Calgary.', encode(digest('seed-syn-34', 'sha256'), 'hex'), false, NOW() - INTERVAL '14 days'),
    ('b1000000-0000-4000-8000-000000000035', COALESCE(m_prius_prime, m_prius), p_prius_prime_phev, t_prime_se, 'BC', 'Richmond', 'OpenRoad Toyota Richmond', 2026, '2026-01-10', NULL, 'pending', 'at_msrp', 0, false, 'Waiting on SE PHEV allocation.', encode(digest('seed-syn-35', 'sha256'), 'hex'), false, NOW() - INTERVAL '6 days'),

    -- Prius HEV Group (5 rows: 4 delivered, 1 pending)
    ('b1000000-0000-4000-8000-000000000036', m_prius, p_prius_hev, t_prius_xle, 'ON', 'Toronto', 'Toyota On Front', 2026, '2025-09-20', '2026-02-10', 'delivered', 'at_msrp', 0, false, 'XLE AWD delivered in 143 days.', encode(digest('seed-syn-36', 'sha256'), 'hex'), false, NOW() - INTERVAL '22 days'),
    ('b1000000-0000-4000-8000-000000000037', m_prius, p_prius_hev, t_prius_limited, 'BC', 'Victoria', 'Jim Pattison Toyota Victoria', 2026, '2025-10-15', '2026-03-30', 'delivered', 'at_msrp', 0, false, 'Limited AWD with solar roof.', encode(digest('seed-syn-37', 'sha256'), 'hex'), false, NOW() - INTERVAL '17 days'),
    ('b1000000-0000-4000-8000-000000000038', m_prius, p_prius_hev, t_prius_le, 'QC', 'Sherbrooke', 'Sherbrooke Toyota', 2025, '2025-02-10', '2025-06-25', 'delivered', 'at_msrp', 0, false, 'Delivered ahead of expected schedule.', encode(digest('seed-syn-38', 'sha256'), 'hex'), false, NOW() - INTERVAL '13 days'),
    ('b1000000-0000-4000-8000-000000000039', m_prius, p_prius_hev, t_prius_xle, 'MB', 'Brandon', 'Fowler Toyota', 2026, '2025-11-20', '2026-04-15', 'delivered', 'at_msrp', 0, false, 'XLE AWD winter package.', encode(digest('seed-syn-39', 'sha256'), 'hex'), false, NOW() - INTERVAL '9 days'),
    ('b1000000-0000-4000-8000-000000000040', m_prius, p_prius_hev, t_prius_limited, 'SK', 'Regina', 'Taylor Toyota', 2026, '2026-04-01', NULL, 'pending', 'at_msrp', 0, false, 'Pending delivery for autumn 2026.', encode(digest('seed-syn-40', 'sha256'), 'hex'), false, NOW() - INTERVAL '3 days');

    SELECT COUNT(*) INTO v_count FROM submissions WHERE id >= 'b1000000-0000-4000-8000-000000000001' AND id <= 'b1000000-0000-4000-8000-000000000040';
    RAISE NOTICE 'Successfully seeded % synthetic Canadian Toyota submissions into Supabase!', v_count;
END $$;
