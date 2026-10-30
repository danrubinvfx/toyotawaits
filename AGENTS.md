<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Supabase Migration Standards: Mandatory Data API Grants (Post-October 30 Rules)

As of October 30, Supabase no longer automatically grants Data API (PostgREST / `supabase-js`) access to newly created tables in the `public` schema.

When authoring any migration in `supabase/migrations/`:
1. Every `CREATE TABLE` statement **MUST** be accompanied by explicit `GRANT` commands alongside `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`:
   ```sql
   ALTER TABLE public.<table_name> ENABLE ROW LEVEL SECURITY;

   -- Public client read/insert permissions:
   GRANT SELECT ON TABLE public.<table_name> TO anon, authenticated;
   -- If public submission/insert is allowed:
   GRANT INSERT ON TABLE public.<table_name> TO anon, authenticated;
   -- Full access for service scripts, workers, and route handlers:
   GRANT ALL ON TABLE public.<table_name> TO service_role;
   ```
2. For complete standards, table privilege matrices, and templates, consult `docs/database-migration-standards.md`.
3. Never create a table with RLS policies without corresponding `GRANT` statements.


## Amazon Affiliate & Outbound Link Standards

1. **Zero-404 Fallback Policy**: NEVER hardcode raw `/dp/[ASIN]` links for generic aftermarket accessories (screen protectors, console trays, harnesses, mud flaps).
2. **Hero Brands**: Reserve direct ASINs strictly for verified, permanent hero brands (e.g. TuxMat, Grizzl-E).
3. **Route via `buildAmazonAffiliateUrl`**:
   - CA: `https://www.amazon.ca/s?k=[encodedQuery]&tag=toyotawaits-20`
   - US: `https://www.amazon.com/s?k=[encodedQuery]&tag=toyotawaits07-20`
4. **Link Attributes**: `target="_blank" rel="sponsored noopener noreferrer nofollow"`.
5. **Mandatory CI Pre-Push Check**: Run `npx tsx scripts/audit-all-links.ts` (must exit code 0 with 0 dead links).
6. **Link Audit Request Method**: All link audits must use browser-simulated `GET` requests to catch false-positive 405s and Dogs of Amazon 404 pages.
