# Supabase Database Migration Standards & Verification Rules

## 1. Context: Supabase Post-October 30 Data API Policy

As of October 30, Supabase no longer automatically grants Data API (PostgREST / `supabase-js`) privileges to newly created tables in the `public` schema.

* **Impact**: In any new table or freshly reset database (`supabase db reset`), queries from `@supabase/supabase-js` or HTTP REST calls will fail with `"permission denied for table ..."` (PostgreSQL error `42501`) if explicit `GRANT` statements are omitted—even if permissive Row-Level Security (RLS) policies exist.
* **Mechanism**: PostgreSQL evaluates table-level permissions (`GRANT SELECT`, `GRANT INSERT`, etc.) **before** evaluating Row-Level Security (RLS) policies. RLS filters rows; `GRANT` unlocks the table for the database role.

---

## 2. Mandatory Migration Rules for Every `CREATE TABLE`

Whenever creating a new table or materialized view in `supabase/migrations/`, **every migration MUST include**:

1. Table creation with `IF NOT EXISTS`
2. `ALTER TABLE public.<table_name> ENABLE ROW LEVEL SECURITY;`
3. Explicit `GRANT` statements for `anon`, `authenticated`, and `service_role`:
   ```sql
   GRANT SELECT ON TABLE public.<table_name> TO anon, authenticated;
   -- If public submission is allowed:
   GRANT INSERT ON TABLE public.<table_name> TO anon, authenticated;
   -- Full access for service scripts:
   GRANT ALL ON TABLE public.<table_name> TO service_role;
   ```
4. Targeted `CREATE POLICY` statements matching the table's privacy model

### Standard Permission Matrix

| Table Category | Examples | `anon` & `authenticated` | `service_role` |
| :--- | :--- | :--- | :--- |
| **Public Read-Only Reference** | `vehicle_models`, `dealers`, `vehicles`, `dealer_listings` | `GRANT SELECT` | `GRANT ALL` |
| **Public Submissions & Telemetry** | `submissions`, `telemetry_affiliate_clicks` | `GRANT SELECT, INSERT, UPDATE` (submissions) / `GRANT SELECT, INSERT` | `GRANT ALL` |
| **Write-Only Public Actions** | `notification_requests` | `GRANT INSERT` | `GRANT ALL` |
| **Worker / Service-Only** | `alert_outbox`, `source_health_logs` | *None* | `GRANT ALL` |
| **Materialized / Public Views** | `model_wait_benchmarks`, `view_accessory_popularity_30d` | `GRANT SELECT` | `GRANT ALL` |

---

## 3. Migration SQL Template

Use this boilerplate for any new table migration:

```sql
-- ============================================================================
-- Migration: YYYYMMDDHHMMSS_create_feature_table.sql
-- Description: Creates <table_name> with mandatory Data API grants & RLS
-- ============================================================================

-- 1. Create Table
CREATE TABLE IF NOT EXISTS public.example_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- 2. Indexes
CREATE INDEX IF NOT EXISTS idx_example_items_active 
    ON public.example_items (is_active) 
    WHERE is_active = true;

-- 3. Row-Level Security (RLS)
ALTER TABLE public.example_items ENABLE ROW LEVEL SECURITY;

-- 4. Mandatory Data API Grants (Post-October 30 Supabase Rule)
-- Grant schema usage
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant table privileges
GRANT SELECT ON TABLE public.example_items TO anon, authenticated;
-- If public client inserts are permitted:
-- GRANT INSERT ON TABLE public.example_items TO anon, authenticated;

-- Full service role management for backend routes and workers
GRANT ALL ON TABLE public.example_items TO service_role;

-- 5. Row-Level Security Policies
CREATE POLICY "Public read access for active example_items"
    ON public.example_items
    FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

CREATE POLICY "Service role full access on example_items"
    ON public.example_items
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
```

---

## 4. Verification Checklist

Before opening a pull request with new migrations:
- [ ] Every `CREATE TABLE` has a matching `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`
- [ ] Every `CREATE TABLE` has explicit `GRANT ... ON TABLE public.<table_name> TO anon, authenticated;`
- [ ] Every `CREATE TABLE` has `GRANT ALL ON TABLE public.<table_name> TO service_role;`
- [ ] Run test suite: `npm test`
- [ ] Verify migration grants test: `npx vitest run tests/unit/supabase-migration-grants.test.ts`
