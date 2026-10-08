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
