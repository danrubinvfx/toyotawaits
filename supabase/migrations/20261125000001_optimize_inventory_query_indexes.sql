-- ============================================================================
-- MIGRATION: 20261125000001_optimize_inventory_query_indexes.sql
-- Description:
-- Resolves Postgres 57014 statement timeouts on GET /api/inventory by adding:
--   1. Partial composite index on dealer_listings for active + last_observed_at DESC
--   2. Composite index on dealer_listings (lifecycle_status, current_status, last_observed_at DESC)
--   3. Covering index on observations (dealer_listing_id, observed_at DESC) INCLUDE (...)
--      to allow Index-Only Scans without fetching wide raw_payload JSONB heap pages.
--   4. Schema cache reload notification for PostgREST.
-- ============================================================================

-- 1. Partial composite index matching active 48h inventory feed filter + sort
CREATE INDEX IF NOT EXISTS idx_dealer_listings_active_observed
ON public.dealer_listings (lifecycle_status, last_observed_at DESC)
WHERE lifecycle_status = 'active';

-- 2. Composite index covering lifecycle_status + current_status + last_observed_at DESC
CREATE INDEX IF NOT EXISTS idx_dealer_listings_lifecycle_status_observed
ON public.dealer_listings (lifecycle_status, current_status, last_observed_at DESC);

-- 3. Covering index on observations so /api/inventory lateral join avoids reading raw_payload JSONB
CREATE INDEX IF NOT EXISTS idx_observations_listing_observed_covering
ON public.observations (dealer_listing_id, observed_at DESC)
INCLUDE (msrp, selling_price, mandatory_fees, has_unverified_fees);

-- 4. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
