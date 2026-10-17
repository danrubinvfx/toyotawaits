-- ============================================================================
-- MIGRATION: 20261017_inventory_discovery_schema.sql
-- Description:
-- Master Plan V3.2 Sprint 2: Inventory Discovery & Ingestion Schema
--
-- Appendix A & Section 3 Strict Adherence:
-- - Dedicated, isolated discovery tables (sources, dealers, vehicles, dealer_listings, observations, status_events, alert_outbox)
-- - Zero modification to existing production wait-time tracker tables (submissions, milestones, etc.)
-- - Strict 17-char VIN validation and provisional ID separation
-- - Composite uniqueness: (dealer_id, source_listing_id)
-- - Alert outbox with lease locking and idempotency keys (Appendix A5)
-- ============================================================================

-- 1. Ingestion Sources Table
CREATE TABLE IF NOT EXISTS sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    platform TEXT NOT NULL, -- e.g. 'convertus', 'dealer_inspire', 'generic'
    base_url TEXT NOT NULL,
    endpoint_url TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Dealership Catalog Table
CREATE TABLE IF NOT EXISTS dealers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
    dealer_code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    brand TEXT NOT NULL DEFAULT 'Toyota',
    address TEXT,
    city TEXT,
    province TEXT,
    country TEXT NOT NULL DEFAULT 'CA',
    postal_code TEXT,
    phone TEXT,
    website_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Canonical Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vin TEXT,
    provisional_id TEXT,
    is_provisional_vin BOOLEAN NOT NULL DEFAULT false,
    make TEXT NOT NULL DEFAULT 'Toyota',
    model TEXT NOT NULL,
    trim TEXT,
    model_year INTEGER NOT NULL,
    model_code TEXT,
    package_code TEXT,
    body_style TEXT,
    powertrain TEXT,
    transmission TEXT,
    drive_train TEXT,
    exterior_color TEXT,
    interior_color TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Constraints: Must have either a valid 17-char VIN or a provisional identifier
    CONSTRAINT vehicles_identifier_check CHECK (vin IS NOT NULL OR provisional_id IS NOT NULL),
    -- Strict 17-character ISO VIN format validation (excluding I, O, Q) when VIN is provided
    CONSTRAINT vehicles_vin_format_check CHECK (vin IS NULL OR vin ~ '^[A-HJ-NPR-Z0-9]{17}$')
);

-- Partial Unique Index on true VINs (allows multiple null VINs with provisional IDs)
CREATE UNIQUE INDEX IF NOT EXISTS idx_vehicles_unique_vin ON vehicles (vin) WHERE vin IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_vehicles_provisional ON vehicles (provisional_id) WHERE provisional_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_vehicles_make_model ON vehicles (make, model, model_year);

-- 4. Dealer Listings Table
CREATE TABLE IF NOT EXISTS dealer_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    source_listing_id TEXT NOT NULL,
    stock_number TEXT,
    vdp_url TEXT,
    current_status TEXT NOT NULL,
    raw_status TEXT,
    days_on_lot INTEGER DEFAULT 0,
    first_observed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_observed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Composite uniqueness per Master Plan Appendix A
    CONSTRAINT uq_dealer_listings_dealer_source UNIQUE (dealer_id, source_listing_id),
    -- Strictly enforced normalized statuses per Master Plan V3.2 Page 3
    CONSTRAINT dealer_listings_status_check CHECK (
        current_status IN (
            'Advertised - availability unconfirmed',
            'Incoming availability unconfirmed',
            'Reserved / sold'
        )
    )
);

CREATE INDEX IF NOT EXISTS idx_dealer_listings_status ON dealer_listings (current_status);
CREATE INDEX IF NOT EXISTS idx_dealer_listings_dealer ON dealer_listings (dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_listings_vehicle ON dealer_listings (vehicle_id);

-- 5. Listing Observations Table (Timestamped Snapshots)
CREATE TABLE IF NOT EXISTS observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_listing_id UUID NOT NULL REFERENCES dealer_listings(id) ON DELETE CASCADE,
    observed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    raw_status TEXT,
    normalized_status TEXT NOT NULL,
    msrp NUMERIC(10, 2),
    raw_msrp TEXT,
    advertised_price NUMERIC(10, 2),
    raw_advertised_price TEXT,
    selling_price NUMERIC(10, 2),
    raw_selling_price TEXT,
    mandatory_fees NUMERIC(10, 2) DEFAULT 0,
    has_unverified_fees BOOLEAN NOT NULL DEFAULT false,
    raw_payload_hash TEXT,
    raw_payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT observations_status_check CHECK (
        normalized_status IN (
            'Advertised - availability unconfirmed',
            'Incoming availability unconfirmed',
            'Reserved / sold'
        )
    )
);

CREATE INDEX IF NOT EXISTS idx_observations_listing_date ON observations (dealer_listing_id, observed_at DESC);

-- 6. Status Events Table (Transition Audit Trail)
CREATE TABLE IF NOT EXISTS status_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_listing_id UUID NOT NULL REFERENCES dealer_listings(id) ON DELETE CASCADE,
    observation_id UUID REFERENCES observations(id) ON DELETE SET NULL,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    transition_reason TEXT NOT NULL,
    evidence_payload JSONB,
    event_timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT status_events_previous_check CHECK (
        previous_status IS NULL OR previous_status IN (
            'Advertised - availability unconfirmed',
            'Incoming availability unconfirmed',
            'Reserved / sold'
        )
    ),
    CONSTRAINT status_events_new_check CHECK (
        new_status IN (
            'Advertised - availability unconfirmed',
            'Incoming availability unconfirmed',
            'Reserved / sold'
        )
    )
);

CREATE INDEX IF NOT EXISTS idx_status_events_listing ON status_events (dealer_listing_id, event_timestamp DESC);

-- 7. Alert Outbox Table (Worker Leases & Idempotent Delivery per Appendix A5)
CREATE TABLE IF NOT EXISTS alert_outbox (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_key TEXT NOT NULL,
    idempotency_key TEXT NOT NULL UNIQUE,
    recipient TEXT NOT NULL,
    channel TEXT NOT NULL CHECK (channel IN ('email', 'webhook')),
    payload JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'claimed', 'delivered', 'failed')),
    claim_token UUID,
    claim_expires_at TIMESTAMPTZ,
    attempts INTEGER NOT NULL DEFAULT 0,
    max_attempts INTEGER NOT NULL DEFAULT 5,
    last_error TEXT,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alert_outbox_queue ON alert_outbox (status, claim_expires_at)
WHERE status IN ('pending', 'claimed');

-- ============================================================================
-- Row-Level Security (RLS) Configuration
-- ============================================================================

ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_outbox ENABLE ROW LEVEL SECURITY;

-- Public Read Policies for verified inventory data
CREATE POLICY "Public read access for sources" ON sources
    FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "Public read access for dealers" ON dealers
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public read access for vehicles" ON vehicles
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public read access for dealer listings" ON dealer_listings
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public read access for observations" ON observations
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public read access for status events" ON status_events
    FOR SELECT TO anon, authenticated USING (true);

-- Alert Outbox is restricted to service_role worker tasks
CREATE POLICY "Service role full access on alert_outbox" ON alert_outbox
    FOR ALL TO service_role USING (true) WITH CHECK (true);
