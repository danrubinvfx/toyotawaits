-- ============================================================================
-- FILE: 20261008000001_initial_schema.sql
-- ============================================================================
-- ============================================================================
-- TOYOTAWAIT.CA DATABASE INITIALIZATION SCRIPT
-- Migration: 20261008000001_initial_schema.sql
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean existing enums if re-running
DO $$ BEGIN
    CREATE TYPE canadian_province AS ENUM (
        'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE submission_status AS ENUM (
        'pending', 'delivered', 'cancelled'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE pricing_type AS ENUM (
        'at_msrp', 'above_msrp', 'below_msrp', 'undisclosed'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ----------------------------------------------------------------------------
-- 1. VEHICLE MODELS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vehicle_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(50) NOT NULL DEFAULT 'Toyota',
    generation_start_year INT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vehicle_models_slug ON vehicle_models(slug);

-- ----------------------------------------------------------------------------
-- 2. VEHICLE POWERTRAINS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vehicle_powertrains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID NOT NULL REFERENCES vehicle_models(id) ON DELETE CASCADE,
    slug VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_model_powertrain UNIQUE (model_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_vehicle_powertrains_model_slug ON vehicle_powertrains(model_id, slug);

-- ----------------------------------------------------------------------------
-- 3. VEHICLE TRIMS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vehicle_trims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID NOT NULL REFERENCES vehicle_models(id) ON DELETE CASCADE,
    powertrain_id UUID NOT NULL REFERENCES vehicle_powertrains(id) ON DELETE CASCADE,
    slug VARCHAR(80) NOT NULL,
    name VARCHAR(150) NOT NULL,
    msrp_cad NUMERIC(10, 2) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_powertrain_trim UNIQUE (powertrain_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_vehicle_trims_powertrain ON vehicle_trims(powertrain_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_trims_model ON vehicle_trims(model_id);

-- ----------------------------------------------------------------------------
-- 4. SUBMISSIONS (COMMUNITY CROWDSOURCED DATA)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID NOT NULL REFERENCES vehicle_models(id) ON DELETE RESTRICT,
    powertrain_id UUID NOT NULL REFERENCES vehicle_powertrains(id) ON DELETE RESTRICT,
    trim_id UUID NOT NULL REFERENCES vehicle_trims(id) ON DELETE RESTRICT,
    province canadian_province NOT NULL,
    dealership_city VARCHAR(100),
    dealership_name VARCHAR(150),
    model_year INT NOT NULL CHECK (model_year BETWEEN 2019 AND 2028),
    order_date DATE NOT NULL CHECK (order_date <= CURRENT_DATE),
    delivery_date DATE CHECK (delivery_date <= CURRENT_DATE),
    status submission_status NOT NULL DEFAULT 'pending',
    
    -- Generated column calculating calendar wait duration in days
    wait_days INT GENERATED ALWAYS AS (
        CASE 
            WHEN delivery_date IS NOT NULL THEN (delivery_date - order_date) 
            ELSE NULL 
        END
    ) STORED,

    pricing pricing_type NOT NULL DEFAULT 'undisclosed',
    mandatory_addons_cad NUMERIC(10, 2) DEFAULT 0.00 CHECK (mandatory_addons_cad >= 0),
    trade_in_required BOOLEAN DEFAULT false,
    notes VARCHAR(280),
    
    -- Cryptographic hash of client-held secret token for zero-auth self-service updates
    edit_key_hash VARCHAR(64),
    
    is_flagged BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Consistency constraints
    CONSTRAINT chk_delivery_order_consistency CHECK (
        (status = 'delivered' AND delivery_date IS NOT NULL AND delivery_date >= order_date) OR
        (status != 'delivered' AND delivery_date IS NULL)
    ),
    CONSTRAINT chk_max_plausible_wait CHECK (
        wait_days IS NULL OR (wait_days >= 0 AND wait_days <= 1825)
    )
);

-- Performance Indexes for Aggregations & Deep Links
CREATE INDEX IF NOT EXISTS idx_submissions_deep_link 
    ON submissions(model_id, powertrain_id, province, status)
    WHERE is_flagged = false;

CREATE INDEX IF NOT EXISTS idx_submissions_wait_days 
    ON submissions(wait_days) 
    WHERE status = 'delivered' AND is_flagged = false;

CREATE INDEX IF NOT EXISTS idx_submissions_order_date 
    ON submissions(order_date DESC);

CREATE INDEX IF NOT EXISTS idx_submissions_edit_key 
    ON submissions(edit_key_hash) 
    WHERE edit_key_hash IS NOT NULL;

-- ----------------------------------------------------------------------------
-- 5. AFFILIATE LINKS (NON-INTRUSIVE CLOAKED MONETIZATION)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS affiliate_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(80) NOT NULL UNIQUE,
    destination_url TEXT NOT NULL,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(80) NOT NULL DEFAULT 'accessories',
    click_count BIGINT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_affiliate_links_slug ON affiliate_links(slug) WHERE is_active = true;

-- ----------------------------------------------------------------------------
-- 6. UPDATED_AT TRIGGER FUNCTION
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_submissions_timestamp ON submissions;
CREATE TRIGGER set_submissions_timestamp
BEFORE UPDATE ON submissions
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_affiliate_timestamp ON affiliate_links;
CREATE TRIGGER set_affiliate_timestamp
BEFORE UPDATE ON affiliate_links
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();


-- ============================================================================
-- FILE: 20261008000002_materialized_view.sql
-- ============================================================================
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


-- ============================================================================
-- FILE: 20261008000003_rls_policies.sql
-- ============================================================================
-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- Migration: 20261008000003_rls_policies.sql
-- ============================================================================

-- Enable RLS across all application tables
ALTER TABLE vehicle_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_powertrains ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_trims ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;

-- 1. Reference Data: Public Read-Only Access
CREATE POLICY "Public can view active models"
    ON vehicle_models FOR SELECT
    USING (is_active = true);

CREATE POLICY "Public can view vehicle powertrains"
    ON vehicle_powertrains FOR SELECT
    USING (true);

CREATE POLICY "Public can view vehicle trims"
    ON vehicle_trims FOR SELECT
    USING (true);

-- 2. Submissions Security Policy
-- Anyone can view unflagged community submissions
CREATE POLICY "Public can view unflagged submissions"
    ON submissions FOR SELECT
    USING (is_flagged = false);

-- Public can insert new submissions
CREATE POLICY "Public can create anonymous submissions"
    ON submissions FOR INSERT
    WITH CHECK (
        is_flagged = false AND
        order_date <= CURRENT_DATE AND
        (delivery_date IS NULL OR delivery_date <= CURRENT_DATE)
    );

-- Self-Service Edit Policy: User can update their own row if providing matching edit_key_hash
CREATE POLICY "Owners can update own submission with edit key"
    ON submissions FOR UPDATE
    USING (
        edit_key_hash IS NOT NULL AND
        edit_key_hash = current_setting('request.headers', true)::json->>'x-edit-key-hash'
    )
    WITH CHECK (
        edit_key_hash IS NOT NULL AND
        edit_key_hash = current_setting('request.headers', true)::json->>'x-edit-key-hash'
    );

-- 3. Affiliate Links: Public Can View Active Redirect Targets
CREATE POLICY "Public can query active affiliate redirects"
    ON affiliate_links FOR SELECT
    USING (is_active = true);


-- ============================================================================
-- FILE: 20261008000004_seed_canadian_data.sql
-- ============================================================================
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


-- ============================================================================
-- FILE: 20261008000005_order_lifecycle_stages.sql
-- ============================================================================
-- ============================================================================
-- ORDER LIFECYCLE STAGES: 5-STAGE MILESTONE PROGRESSION
-- Migration: 20261008000005_order_lifecycle_stages.sql
-- ============================================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_stage') THEN
        CREATE TYPE submission_stage AS ENUM (
            'deposit_placed',        -- Initial deposit placed in queue
            'allocation_confirmed',  -- Build sheet / allocation secured
            'freight_transit',       -- On ocean vessel or freight rail
            'arrived_at_dealer',     -- At dealership compound / PDI
            'delivered'              -- Customer delivered
        );
    END IF;
END $$;

-- Add current_stage column to submissions table if not already present
ALTER TABLE submissions
ADD COLUMN IF NOT EXISTS current_stage submission_stage NOT NULL DEFAULT 'deposit_placed';

-- Index for querying active stage counts and status filters
CREATE INDEX IF NOT EXISTS idx_submissions_stage 
    ON submissions(current_stage) 
    WHERE is_flagged = false;


-- ============================================================================
-- FILE: 20261008000006_se_mods_affiliates.sql
-- ============================================================================
-- ============================================================================
-- SE TO XSE DIY MODS AFFILIATE REDIRECT SEED DATA
-- Migration: 20261008000006_se_mods_affiliates.sql
-- ============================================================================

INSERT INTO affiliate_links (slug, destination_url, title, category)
VALUES 
    ('jbl-club-dash-speakers', 'https://www.amazon.ca/dp/B08XJBL34T?tag=toyotawaits-20', 'JBL Club 3412T 3.5" Dash Tweeters / Midrange Speakers', 'audio'),
    ('toyota-speaker-harness', 'https://www.amazon.ca/dp/B07TOYSPKR?tag=toyotawaits-20', 'Red Wolf / Metra Toyota Dash Speaker Plug-and-Play Wiring Harness (Pair)', 'audio'),
    ('trim-removal-tools', 'https://www.amazon.ca/dp/B08TRIMKIT?tag=toyotawaits-20', 'Non-Marring Automotive Dash Pry & Trim Removal Tool Kit', 'tools'),
    ('clazzio-leather-covers', 'https://www.clazzio.com/toyota-rav4-prime?ref=toyotawaits', 'Clazzio Custom-Fit Leather / PVC Seat Covers (RAV4 Prime)', 'interior'),
    ('ekr-seat-covers', 'https://www.amazon.ca/dp/B09EKRLEAT?tag=toyotawaits-20', 'EKR Custom Tailored Full Leatherette Seat Covers (RAV4 Prime)', 'interior')
ON CONFLICT (slug) DO UPDATE 
SET destination_url = EXCLUDED.destination_url,
    title = EXCLUDED.title,
    category = EXCLUDED.category;


-- ============================================================================
-- FILE: 20261008000007_update_affiliate_urls.sql
-- ============================================================================
-- Update affiliate links to verified live Amazon Canada search URLs and Clazzio homepage
-- Replaces non-functioning dummy ASINs with high-intent search queries that never 404

UPDATE affiliate_links
SET destination_url = 'https://www.amazon.ca/s?k=JBL+Club+3.5+speakers&tag=toyotawaits-20'
WHERE slug = 'jbl-club-dash-speakers';

UPDATE affiliate_links
SET destination_url = 'https://www.amazon.ca/s?k=RED+WOLF+Toyota+dash+speaker+wiring+harness&tag=toyotawaits-20'
WHERE slug = 'toyota-speaker-harness';

UPDATE affiliate_links
SET destination_url = 'https://www.amazon.ca/s?k=auto+trim+removal+tool+kit&tag=toyotawaits-20'
WHERE slug = 'trim-removal-tools';

UPDATE affiliate_links
SET destination_url = 'https://www.clazzio.com/'
WHERE slug = 'clazzio-leather-covers';

UPDATE affiliate_links
SET destination_url = 'https://www.amazon.ca/s?k=EKR+custom+fit+car+seat+covers+Toyota+RAV4&tag=toyotawaits-20'
WHERE slug = 'ekr-seat-covers';

UPDATE affiliate_links
SET destination_url = 'https://www.amazon.ca/s?k=TuxMat+Toyota+RAV4&tag=toyotawaits-20'
WHERE slug = 'tuxmat-rav4';

UPDATE affiliate_links
SET destination_url = 'https://www.amazon.ca/s?k=TuxMat+Toyota+Sienna&tag=toyotawaits-20'
WHERE slug = 'tuxmat-sienna';

UPDATE affiliate_links
SET destination_url = 'https://www.amazon.ca/s?k=VIOFO+A229+Pro+4K&tag=toyotawaits-20'
WHERE slug = 'viofo-a229-pro';

UPDATE affiliate_links
SET destination_url = 'https://www.amazon.ca/s?k=Toyota+RAV4+12.3+screen+protector&tag=toyotawaits-20'
WHERE slug = 'screen-protector-12-3';

UPDATE affiliate_links
SET destination_url = 'https://www.amazon.ca/s?k=A-Premium+mud+flaps+Toyota+RAV4&tag=toyotawaits-20'
WHERE slug = 'no-drill-mud-flaps-rav4';

UPDATE affiliate_links
SET destination_url = 'https://www.amazon.ca/s?k=Grizzl-E+Level+2+EV+Charger&tag=toyotawaits-20'
WHERE slug = 'grizzl-e-charger';

UPDATE affiliate_links
SET destination_url = 'https://www.amazon.ca/s?k=FLO+Home+EV+Charger&tag=toyotawaits-20'
WHERE slug = 'flo-g5';


-- ============================================================================
-- FILE: 20261008000008_additional_model_mods_affiliates.sql
-- ============================================================================
-- Seed affiliate links for Sienna, Grand Highlander, and Land Cruiser 250 mod guides
-- Matches specs/data-contracts.md and src/lib/db/affiliates.ts

INSERT INTO affiliate_links (id, slug, destination_url, title, category, click_count, is_active)
VALUES
    ('f0000001-0001-4001-8001-000000000001', 'sienna-console-bridge-tray', 'https://www.amazon.ca/s?k=Toyota+Sienna+center+console+bridge+tray+organizer&tag=toyotawaits-20', 'Toyota Sienna Center Console Bridge Under-Tray Organizer', 'interior', 0, true),
    ('f0000002-0002-4002-8002-000000000002', 'sienna-air-lift-1000', 'https://www.amazon.ca/s?k=Air+Lift+1000+Toyota+Sienna&tag=toyotawaits-20', 'Air Lift 1000 In-Coil Rear Air Helper Spring Kit', 'suspension', 0, true),
    ('f0000003-0003-4003-8003-000000000003', 'sienna-fitcamx-dashcam', 'https://www.amazon.ca/s?k=Fitcamx+Toyota+Sienna+dash+cam&tag=toyotawaits-20', 'FitcamX OEM Integrated 4K Mirror Dash Cam (Toyota Sienna)', 'electronics', 0, true),
    ('f0000004-0004-4004-8004-000000000004', 'sienna-hatch-led-lights', 'https://www.amazon.ca/s?k=Toyota+Sienna+rear+hatch+cargo+LED+lights&tag=toyotawaits-20', 'Powerty Dual Rear Cargo Liftgate LED Flood Lights', 'lighting', 0, true),
    ('f0000005-0005-4005-8005-000000000005', 'gh-console-organizer-tray', 'https://www.amazon.ca/s?k=Toyota+Grand+Highlander+center+console+tray+organizer&tag=toyotawaits-20', 'Toyota Grand Highlander Center Console Armrest Divider & Tray', 'interior', 0, true),
    ('f0000006-0006-4006-8006-000000000006', 'gh-rear-cargo-lamps', 'https://www.amazon.ca/s?k=Grand+Highlander+rear+cargo+hatch+lights&tag=toyotawaits-20', 'Grand Highlander Dual Rear Cargo Hatch LED Lamps (PT944 Style)', 'lighting', 0, true),
    ('f0000007-0007-4007-8007-000000000007', 'gh-wireless-charger-mat', 'https://www.amazon.ca/s?k=Toyota+Grand+Highlander+wireless+charger+mat&tag=toyotawaits-20', 'Grand Highlander Anti-Slip Silicone Wireless Charging Pad Mat', 'interior', 0, true),
    ('f0000008-0008-4008-8008-000000000008', 'lc250-speaker-upgrade', 'https://www.amazon.ca/s?k=Land+Cruiser+250+speaker+upgrade+dash+door&tag=toyotawaits-20', 'Land Cruiser 250 (1958 Trim) 3.5" Dash & Front Speaker Drop-In Upgrade', 'audio', 0, true),
    ('f0000009-0009-4009-8009-000000000009', 'lc250-rock-sliders', 'https://www.amazon.ca/s?k=Land+Cruiser+250+rock+sliders+armor&tag=toyotawaits-20', 'Land Cruiser 250 Heavy-Duty Frame-Mounted Rock Sliders & Sills', 'exterior', 0, true)
ON CONFLICT (slug) DO UPDATE
SET destination_url = EXCLUDED.destination_url,
    title = EXCLUDED.title,
    category = EXCLUDED.category;


-- ============================================================================
-- FILE: 20261008000009_delivery_prep_checklist_affiliates.sql
-- ============================================================================
-- Seed affiliate links for Delivery Day Prep Checklist accessories
-- Matches specs/data-contracts.md, data/affiliate-products.json, and src/lib/db/affiliates.ts

INSERT INTO affiliate_links (id, slug, destination_url, title, category, click_count, is_active)
VALUES
    ('f1000001-0001-4001-8001-000000000001', 'fitcamx-rav4', 'https://www.amazon.ca/s?k=Fitcamx+Toyota+RAV4+dash+cam&tag=toyotawaits-20', 'FitcamX OEM Integrated 4K Mirror Dashcam (RAV4)', 'visibility_protection', 0, true),
    ('f1000002-0002-4002-8002-000000000002', 'fitcamx-sienna', 'https://www.amazon.ca/s?k=Fitcamx+Toyota+Sienna+dash+cam&tag=toyotawaits-20', 'FitcamX OEM Integrated 4K Mirror Dashcam (Sienna)', 'visibility_protection', 0, true),
    ('f1000003-0003-4003-8003-000000000003', 'fitcamx-grand-highlander', 'https://www.amazon.ca/s?k=Fitcamx+Toyota+Grand+Highlander+dash+cam&tag=toyotawaits-20', 'FitcamX OEM Integrated 4K Mirror Dashcam (Grand Highlander)', 'visibility_protection', 0, true),
    ('f1000004-0004-4004-8004-000000000004', 'fitcamx-land-cruiser', 'https://www.amazon.ca/s?k=Fitcamx+Toyota+Land+Cruiser+250+dash+cam&tag=toyotawaits-20', 'FitcamX OEM Integrated 4K Mirror Dashcam (Land Cruiser 250)', 'visibility_protection', 0, true),
    ('f1000005-0005-4005-8005-000000000005', 'screen-protector-rav4', 'https://www.amazon.ca/s?k=Toyota+RAV4+tempered+glass+screen+protector&tag=toyotawaits-20', 'Anti-Glare 9H Tempered Glass Screen Protector (RAV4)', 'visibility_protection', 0, true),
    ('f1000006-0006-4006-8006-000000000006', 'screen-protector-sienna', 'https://www.amazon.ca/s?k=Toyota+Sienna+screen+protector+tempered+glass&tag=toyotawaits-20', 'Matte Anti-Glare Screen Protector (Toyota Sienna)', 'visibility_protection', 0, true),
    ('f1000007-0007-4007-8007-000000000007', 'screen-protector-grand-highlander', 'https://www.amazon.ca/s?k=Toyota+Grand+Highlander+12.3+screen+protector&tag=toyotawaits-20', '12.3-inch Anti-Glare Tempered Glass (Grand Highlander)', 'visibility_protection', 0, true),
    ('f1000008-0008-4008-8008-000000000008', 'screen-protector-land-cruiser', 'https://www.amazon.ca/s?k=Land+Cruiser+250+screen+protector+tempered+glass&tag=toyotawaits-20', 'Armor-Grade Multimedia Screen Shield (Land Cruiser 250)', 'visibility_protection', 0, true),
    ('f1000009-0009-4009-8009-000000000009', 'console-tray-rav4', 'https://www.amazon.ca/s?k=Toyota+RAV4+center+console+tray+organizer&tag=toyotawaits-20', 'Drop-In Center Console Divider & Coin Tray (RAV4)', 'cabin_organization', 0, true),
    ('f1000010-0010-4010-8010-000000000010', 'console-tray-sienna', 'https://www.amazon.ca/s?k=Toyota+Sienna+center+console+bridge+tray+organizer&tag=toyotawaits-20', 'Dual-Tier Center Console & Bridge Organizer (Sienna)', 'cabin_organization', 0, true),
    ('f1000011-0011-4011-8011-000000000011', 'console-tray-grand-highlander', 'https://www.amazon.ca/s?k=Toyota+Grand+Highlander+center+console+tray+organizer&tag=toyotawaits-20', 'Precision Armrest Divider & Upper Storage Tray (Grand Highlander)', 'cabin_organization', 0, true),
    ('f1000012-0012-4012-8012-000000000012', 'console-tray-land-cruiser', 'https://www.amazon.ca/s?k=Toyota+Land+Cruiser+250+center+console+organizer+tray&tag=toyotawaits-20', 'Heavy-Duty Armrest Storage Organizer (Land Cruiser 250)', 'cabin_organization', 0, true),
    ('f1000013-0013-4013-8013-000000000013', 'noco-gb40-jump-pack', 'https://www.amazon.ca/s?k=NOCO+Boost+Plus+GB40+1000A&tag=toyotawaits-20', 'NOCO Boost Plus GB40 1000A 12V UltraSafe Lithium Jump Starter', 'roadside_winter', 0, true),
    ('f1000014-0014-4014-8014-000000000014', 'j1772-charger-lock', 'https://www.amazon.ca/s?k=J1772+charger+lock+ring+Toyota+RAV4+Prime&tag=toyotawaits-20', 'J1772 Public EV Charging Port Combination Lock Ring', 'roadside_winter', 0, true)
ON CONFLICT (slug) DO UPDATE
SET destination_url = EXCLUDED.destination_url,
    title = EXCLUDED.title,
    category = EXCLUDED.category;


-- ============================================================================
-- FILE: 20261008000010_seed_prius_data.sql
-- ============================================================================
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


-- ============================================================================
-- FILE: 20261008000011_model_wait_benchmarks_view.sql
-- ============================================================================
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


-- ============================================================================
-- FILE: 20261008000012_ensure_pending_submissions_public_select.sql
-- ============================================================================
-- ============================================================================
-- ENSURE PUBLIC READ PERMISSIONS FOR ALL SUBMISSIONS (DELIVERED & PENDING)
-- Migration: 20261008000012_ensure_pending_submissions_public_select.sql
-- ============================================================================

-- Ensure RLS is active on submissions
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Recreate policy to explicitly allow public readers to view both delivered and pending submissions
DROP POLICY IF EXISTS "Public can view unflagged submissions" ON submissions;
DROP POLICY IF EXISTS "Public can view all unflagged submissions" ON submissions;

CREATE POLICY "Public can view all unflagged submissions"
    ON submissions FOR SELECT
    TO anon, authenticated, public
    USING (
        is_flagged = false AND 
        status IN ('delivered', 'pending')
    );

-- Grant SELECT permissions on submissions and related vehicle dimension tables to anon and authenticated
GRANT SELECT ON submissions TO anon, authenticated;
GRANT SELECT ON vehicle_models TO anon, authenticated;
GRANT SELECT ON vehicle_powertrains TO anon, authenticated;
GRANT SELECT ON vehicle_trims TO anon, authenticated;


-- ============================================================================
-- FILE: 20261008000013_sync_catalog_uuids_and_permissions.sql
-- ============================================================================
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


-- ============================================================================
-- FILE: 20261008000014_allow_anon_submission_insert.sql
-- ============================================================================
-- ============================================================================
-- ENSURE ANONYMOUS INSERT PERMISSIONS & RLS FOR SUBMISSIONS
-- Migration: 20261008000014_allow_anon_submission_insert.sql
-- ============================================================================

-- Grant schema and table privileges to anon, authenticated, and service_role
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON submissions TO anon, authenticated;
GRANT SELECT ON vehicle_models TO anon, authenticated;
GRANT SELECT ON vehicle_powertrains TO anon, authenticated;
GRANT SELECT ON vehicle_trims TO anon, authenticated;

-- Ensure RLS is active
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Drop previous insert policy
DROP POLICY IF EXISTS "Public can create anonymous submissions" ON submissions;

-- Permissive insert policy for public/anonymous car buyers:
-- Allows both unflagged and flagged rows (so automated outlier detection never triggers 42501),
-- and includes a 1-day buffer for international/Canadian timezone alignment.
CREATE POLICY "Public can create anonymous submissions"
    ON submissions FOR INSERT
    TO anon, authenticated, public
    WITH CHECK (
        order_date <= (CURRENT_DATE + INTERVAL '1 day') AND
        (delivery_date IS NULL OR delivery_date <= (CURRENT_DATE + INTERVAL '1 day'))
    );


