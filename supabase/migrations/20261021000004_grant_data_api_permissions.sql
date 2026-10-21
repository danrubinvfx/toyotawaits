-- ============================================================================
-- MIGRATION: 20261021000004_grant_data_api_permissions.sql
-- Description:
-- Explicit Data API & PostgREST role grants for Supabase (Mandatory post-Oct 30)
-- Ensures anon, authenticated, and service_role have explicit permissions
-- across all public tables, views, and sequences alongside RLS policies.
-- ============================================================================

-- 1. Ensure schema usage is granted
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 2. Core Vehicle Catalog & Reference Tables (Public Read)
GRANT SELECT ON TABLE public.vehicle_models TO anon, authenticated;
GRANT SELECT ON TABLE public.vehicle_powertrains TO anon, authenticated;
GRANT SELECT ON TABLE public.vehicle_trims TO anon, authenticated;
GRANT SELECT ON TABLE public.affiliate_links TO anon, authenticated;

GRANT ALL ON TABLE public.vehicle_models TO service_role;
GRANT ALL ON TABLE public.vehicle_powertrains TO service_role;
GRANT ALL ON TABLE public.vehicle_trims TO service_role;
GRANT ALL ON TABLE public.affiliate_links TO service_role;

-- 3. Submissions Table (Public Read & Anonymous Insert)
GRANT SELECT, INSERT ON TABLE public.submissions TO anon, authenticated;
GRANT ALL ON TABLE public.submissions TO service_role;

-- 4. Notification Requests Table (Public Insert Only, Service Role Manage)
GRANT INSERT ON TABLE public.notification_requests TO anon, authenticated;
GRANT ALL ON TABLE public.notification_requests TO service_role;

-- 5. Inventory Discovery Tables (Public Read on Verified Data, Worker Manage)
GRANT SELECT ON TABLE public.sources TO anon, authenticated;
GRANT SELECT ON TABLE public.dealers TO anon, authenticated;
GRANT SELECT ON TABLE public.vehicles TO anon, authenticated;
GRANT SELECT ON TABLE public.dealer_listings TO anon, authenticated;
GRANT SELECT ON TABLE public.observations TO anon, authenticated;
GRANT SELECT ON TABLE public.status_events TO anon, authenticated;
GRANT SELECT ON TABLE public.source_health_logs TO anon, authenticated;

GRANT ALL ON TABLE public.sources TO service_role;
GRANT ALL ON TABLE public.dealers TO service_role;
GRANT ALL ON TABLE public.vehicles TO service_role;
GRANT ALL ON TABLE public.dealer_listings TO service_role;
GRANT ALL ON TABLE public.observations TO service_role;
GRANT ALL ON TABLE public.status_events TO service_role;
GRANT ALL ON TABLE public.alert_outbox TO service_role;
GRANT ALL ON TABLE public.source_health_logs TO service_role;

-- 6. Telemetry & Analytics Tables (Public Insert & Aggregated Read)
GRANT SELECT, INSERT ON TABLE public.telemetry_affiliate_clicks TO anon, authenticated;
GRANT ALL ON TABLE public.telemetry_affiliate_clicks TO service_role;

-- 7. Views (Public Read)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_views WHERE schemaname = 'public' AND viewname = 'model_wait_benchmarks') THEN
        GRANT SELECT ON TABLE public.model_wait_benchmarks TO anon, authenticated, service_role;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_views WHERE schemaname = 'public' AND viewname = 'view_accessory_popularity_30d') THEN
        GRANT SELECT ON TABLE public.view_accessory_popularity_30d TO anon, authenticated, service_role;
    END IF;
END $$;

-- 8. Sequences (ID generation)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- 9. Default Privileges for any future tables/sequences created in schema public
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;
