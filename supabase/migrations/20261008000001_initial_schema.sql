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
