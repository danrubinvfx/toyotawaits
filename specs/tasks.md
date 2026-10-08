# Actionable Task Breakdown: ToyotaWait.ca
**Canadian Toyota Vehicle Delivery Wait-Time Community Tracker**  
*Document Version:* 1.0.0  
*Status:* Approved for Architecture Review  
*Target Domain:* `toyotawait.ca`

---

## Milestone 1: Database Setup, Relational Architecture & Seed Data

### [x] TASK-101: Initialize Supabase Schema DDL & Enums
- **Description**: Implement database migration script `001_initial_schema.sql` defining custom enums (`canadian_province`, `submission_status`, `pricing_type`), core tables (`vehicle_models`, `vehicle_powertrains`, `vehicle_trims`, `submissions`, `affiliate_links`), and generated column `wait_days`.
- **Dependencies**: None.
- **Definition of Done (DoD)**:
  - Migration executes without errors against local Supabase/Postgres instance.
  - Foreign key cascades and check constraints validate properly.
  - Inserting a row with `delivery_date = '2024-05-20'` and `order_date = '2024-05-01'` automatically populates `wait_days = 19`.
- **Automated Test Requirements**:
  - `tests/db/schema.test.ts`: Integration test running DDL and verifying generated column calculations and date constraints.

---

### [x] TASK-102: Implement Materialized View & Statistical Percentile Functions
- **Description**: Implement migration `002_materialized_view.sql` creating `mv_model_wait_summary` using PostgreSQL `percentile_cont(0.25)`, `percentile_cont(0.50)`, and `percentile_cont(0.75)`, along with the concurrent refresh function `refresh_wait_summary_mv()`.
- **Dependencies**: TASK-101.
- **Definition of Done (DoD)**:
  - Materialized view successfully compiles and creates unique index on `(model_id, powertrain_id, trim_id, province)`.
  - Calling `REFRESH MATERIALIZED VIEW CONCURRENTLY` succeeds without table locks.
- **Automated Test Requirements**:
  - `tests/db/percentiles.test.ts`: Inserts synthetic test dataset with known wait times (100, 200, 300 days) and asserts median is exactly 200.

---

### [x] TASK-103: Implement Row-Level Security (RLS) Policies
- **Description**: Implement migration `003_rls_policies.sql` enforcing public read access to reference data, public insert for submissions, and restricted self-service updates via `edit_key_hash`.
- **Dependencies**: TASK-101.
- **Definition of Done (DoD)**:
  - Anonymous clients can SELECT unflagged submissions and INSERT valid submissions.
  - Anonymous clients CANNOT UPDATE or DELETE submissions without supplying the matching `x-edit-key-hash` header.
- **Automated Test Requirements**:
  - `tests/db/rls.test.ts`: Multi-role integration tests asserting unauthenticated write protection and edit key validation.

---

### [x] TASK-104: Populate Canadian Vehicle Trim Seed Data
- **Description**: Implement migration `004_seed_canadian_data.sql` seeding all official Canadian trims for RAV4 (Gas, HEV, PHEV), Sienna (HEV), Grand Highlander (Gas, HEV, MAX), and Land Cruiser (250 Series).
- **Dependencies**: TASK-101.
- **Definition of Done (DoD)**:
  - Exact Canadian trims, Canadian MSRPs, and powertrain mappings are inserted with idempotent `ON CONFLICT DO NOTHING`.
  - Database contains at least 25 Canadian trim configurations across the 4 core models.
- **Automated Test Requirements**:
  - `tests/db/seed.test.ts`: Asserts all 4 models and their respective powertrains and trims exist in the database.

---

## Milestone 2: Backend API Layer, Validation & Bot Defense

### [x] TASK-201: Implement Core TypeScript Interfaces & Zod Validation Schemas
- **Description**: Create `src/lib/types/contracts.ts` and `src/lib/validations/schemas.ts` defining all domain types, Zod schemas, date bounds logic, and PII regex filters (VIN, email, phone, postal code).
- **Dependencies**: None.
- **Definition of Done (DoD)**:
  - All schemas pass strict TypeScript compiler checks.
  - PII patterns are completely rejected by `sanitizedNotesSchema`.
  - Future dates and dates preceding model generation launch are rejected.
- **Automated Test Requirements**:
  - `tests/unit/validations.test.ts`: Unit tests verifying valid payloads, date boundary violations, and VIN/phone/email injection rejections.

---

### [x] TASK-202: Implement Cloudflare Turnstile & Honeypot Verification Module
- **Description**: Create `src/lib/security/turnstile.ts` to verify Cloudflare Turnstile tokens via `https://challenges.cloudflare.com/turnstile/v0/siteverify` and implement honeypot trap detection.
- **Dependencies**: TASK-201.
- **Definition of Done (DoD)**:
  - Successful challenge returns verification status.
  - Failed or expired tokens throw standardized 403 Forbidden errors.
  - Non-empty honeypot field triggers silent rejection without database insertion.
- **Automated Test Requirements**:
  - `tests/unit/turnstile.test.ts`: Mocked HTTP test verifying Turnstile validation outcomes and honeypot suppression.

---

### [x] TASK-203: Implement Ephemeral Rate Limiting Middleware
- **Description**: Configure Upstash Redis sliding-window rate limiter in `src/lib/security/ratelimit.ts` to restrict submissions to a maximum of 5 requests per IP per 24 hours.
- **Dependencies**: None.
- **Definition of Done (DoD)**:
  - Client IP is extracted from headers (`x-forwarded-for` or `cf-connecting-ip`) in memory only.
  - No IP address or device fingerprint is persisted to Postgres.
  - Returns HTTP 429 with `Retry-After` header when limit is exceeded.
- **Automated Test Requirements**:
  - `tests/integration/ratelimit.test.ts`: Rapid sequence test ensuring 6th submission from identical mock IP yields HTTP 429.

---

### [x] TASK-204: Build Submission Creation Route Handler (`POST /api/submissions`)
- **Description**: Implement `src/app/api/submissions/route.ts` handling anonymous submissions, generating one-time UUIDv4 edit keys, hashing with SHA-256, and writing to Supabase.
- **Dependencies**: TASK-101, TASK-201, TASK-202, TASK-203.
- **Definition of Done (DoD)**:
  - Valid submission returns HTTP 201 with created record ID and unhashed `editKey`.
  - Database stores only the SHA-256 hash of `editKey`.
  - Invalid submissions return HTTP 400 with structured Zod validation issues.
- **Automated Test Requirements**:
  - `tests/integration/submissions-post.test.ts`: End-to-end API test posting valid data and verifying database state and response envelope.

---

### [x] TASK-205: Build Submission Self-Service Update Route Handler (`PATCH /api/submissions/[id]`)
- **Description**: Implement `src/app/api/submissions/[id]/route.ts` enabling users to transition a pending order to `delivered` by verifying the secret edit key.
- **Dependencies**: TASK-103, TASK-204.
- **Definition of Done (DoD)**:
  - Correct `editKey` successfully updates `status = 'delivered'`, sets `delivery_date`, and updates `wait_days`.
  - Incorrect `editKey` returns HTTP 401 Unauthorized.
- **Automated Test Requirements**:
  - `tests/integration/submissions-patch.test.ts`: Verifies successful status transition and unauthorized rejection.

---

### [x] TASK-206: Build Aggregate Analytics Route Handler (`GET /api/aggregate`)
- **Description**: Implement `src/app/api/aggregate/route.ts` querying `mv_model_wait_summary` and returning percentiles, sample counts, and pricing transparency statistics.
- **Dependencies**: TASK-102, TASK-201.
- **Definition of Done (DoD)**:
  - Responds with HTTP 200 within $< 30\text{ms}$.
  - Supports query filters: `model`, `powertrain`, `province`, `timeframe`.
  - Returns `Cache-Control: public, s-maxage=120, stale-while-revalidate=600`.
- **Automated Test Requirements**:
  - `tests/integration/aggregate-get.test.ts`: Tests endpoint against seeded data and validates response schema.

---

### [x] TASK-207: Build RFC 4180 CSV Data Export Route Handler (`GET /api/export`)
- **Description**: Implement `src/app/api/export/route.ts` streaming sanitized public dataset in RFC 4180 CSV format with UTF-8 BOM encoding.
- **Dependencies**: TASK-101, TASK-201.
- **Definition of Done (DoD)**:
  - Output CSV omits all internal IDs, IP fields, and edit key hashes.
  - Response headers include `Content-Type: text/csv; charset=utf-8` and attachment `Content-Disposition`.
  - French accents in Quebec entries render properly in Microsoft Excel.
- **Automated Test Requirements**:
  - `tests/integration/export-get.test.ts`: Fetches CSV output, parses with CSV parser, and validates column headers and row count.

---

## Milestone 3: Mobile-First Core UX & Submission Wizard

### [x] TASK-301: Configure Tailwind CSS, shadcn/ui & Responsive Layout Shell
- **Description**: Setup project styling, mobile-first responsive container, brand theme (Toyota Red `#EB0A1E`, Slate, Zinc), dark/light mode toggle, header navigation, and mobile bottom tab bar.
- **Dependencies**: None.
- **Definition of Done (DoD)**:
  - Mobile layout passes Google Lighthouse Mobile accessibility score $> 95$.
  - Navigation operates seamlessly on screens from 320px (iPhone SE) to 1440px+ desktop.
- **Automated Test Requirements**:
  - `tests/e2e/layout.spec.ts`: Playwright test verifying viewport responsiveness across mobile and desktop.

---

### [x] TASK-302: Implement 60-Second Mobile Submission Wizard
- **Description**: Build `src/components/forms/submission-wizard.tsx` with cascading dynamic dropdowns (Model $\to$ Powertrain $\to$ Trim $\to$ Province), calendar date pickers, optional transparency toggles, and Cloudflare Turnstile widget.
- **Dependencies**: TASK-201, TASK-204, TASK-301.
- **Definition of Done (DoD)**:
  - Selecting Model dynamically filters Powertrain options.
  - Selecting Powertrain dynamically filters Trim options.
  - Delivery date picker is only shown if status is set to "Delivered".
  - Average completion time is under 60 seconds on mobile devices.
- **Automated Test Requirements**:
  - `tests/e2e/submission-flow.spec.ts`: Playwright test filling out full form on mobile viewport and asserting submission confirmation modal.

---

### [x] TASK-303: Implement Local Storage Edit Key Management
- **Description**: Build client utility `src/lib/storage/submission-storage.ts` that saves the returned `editKey` and `submissionId` to `localStorage` and provides a "Copy Secret Key" clipboard action.
- **Dependencies**: TASK-302.
- **Definition of Done (DoD)**:
  - After submission, secret key is stored locally.
  - Returning to the site on the same browser displays the user's active pending reservation with an "I Received My Vehicle" one-tap update button.
- **Automated Test Requirements**:
  - `tests/unit/submission-storage.test.ts`: Tests `localStorage` persistence, key retrieval, and clearing.

---

## Milestone 4: Statistical Engine, Aggregations & Interactive Estimator

### [x] TASK-401: Build Interactive Wait-Time Estimator Component
- **Description**: Build `src/components/calculator/wait-time-estimator.tsx` allowing prospective buyers to select Model, Powertrain, and Province to project an expected delivery calendar date range based on 25th, 50th, and 75th percentiles.
- **Dependencies**: TASK-206, TASK-301.
- **Definition of Done (DoD)**:
  - Instant client-side recalculation upon parameter change.
  - Displays sample size badge and statistical confidence indicator.
  - Renders expected calendar delivery window (e.g., *"Expected: Nov 2026 – Feb 2027"*).
- **Automated Test Requirements**:
  - `tests/unit/estimator-calc.test.ts`: Validates date projection math given varying percentile inputs.

---

### [x] TASK-402: Build Regional Comparison Dashboard & Visual Charts
- **Description**: Build `src/components/dashboard/provincial-comparison.tsx` and `src/components/dashboard/community-data-table.tsx` featuring responsive horizontal bar charts comparing median wait times across Canadian provinces and trims.
- **Dependencies**: TASK-206, TASK-301.
- **Definition of Done (DoD)**:
  - Mobile-responsive charts render cleanly without horizontal overflow.
  - Shows clear provincial contrasts (e.g. BC/QC EV-rebate wait times vs. ON/AB).
  - Includes dealer transparency metrics (MSRP compliance percentage).
- **Automated Test Requirements**:
  - `tests/components/provincial-comparison.test.tsx`: Tests chart rendering, metric cards, and province rebate indicators.

---

## Milestone 5: Dynamic Deep-Linking & Social Sharing (Reddit Optimization)

### [x] TASK-501: Implement Hierarchical URL Routing Structure
- **Description**: Implement dynamic App Router pages:
  - `src/app/[model]/page.tsx`
  - `src/app/[model]/[powertrain]/page.tsx`
  - `src/app/[model]/[powertrain]/[province]/page.tsx`
- **Dependencies**: TASK-206, TASK-401, TASK-402.
- **Definition of Done (DoD)**:
  - URLs such as `/rav4/phev/bc` render pre-filtered provincial stats via ISR with 300s cache revalidation.
  - Invalid route parameters (e.g., `/rav4/diesel/xx`) gracefully trigger `notFound()` returning 404.
- **Automated Test Requirements**:
  - `tests/components/deep-link.test.tsx`: Tests static param generation, valid deep links, and invalid route fallback.

---

### [x] TASK-502: Implement Dynamic OpenGraph Social Preview Generator
- **Description**: Build dynamic OpenGraph image generator at `src/app/api/og/route.tsx` using `@vercel/og` / `next/og` (Satori) rendering live median wait times, vehicle name, and Canadian province badge.
- **Dependencies**: TASK-501.
- **Definition of Done (DoD)**:
  - Accessing `/[model]/[powertrain]/[province]` includes `meta property="og:image"` pointing to `/api/og?model=...&powertrain=...&province=...`.
  - Image generates within $< 200\text{ms}$ returning PNG format at $1200 \times 630$ resolution.
- **Automated Test Requirements**:
  - `tests/integration/og-image.test.ts`: Asserts `/api/og` returns 200 with `image/png` content-type.

---

## Milestone 6: Non-Intrusive Monetization, Compliance & Launch Preparation

### [x] TASK-601: Implement First-Party Cloaked Affiliate Redirect Handler (`/out/[slug]`)
- **Description**: Build `src/app/out/[slug]/route.ts` handling first-party cloaked affiliate redirects, looking up target URLs in `affiliate_links`, asynchronously incrementing click counts, and returning HTTP 307.
- **Dependencies**: TASK-101.
- **Definition of Done (DoD)**:
  - Inbound request `/out/tuxmat-rav4` returns `307 Temporary Redirect` to the affiliate destination.
  - Database counter `click_count` is incremented.
  - Zero cookies or user tracking headers are injected into the redirect response.
  - Unknown slug redirects safely to `/checklist` with HTTP 302.
- **Automated Test Requirements**:
  - `tests/integration/affiliate-redirect.test.ts`: Tests redirection response code, target URL, and click count increments.

---

### [x] TASK-602: Build Canadian Delivery Inspection Checklist & Gear Guide Page
- **Description**: Build `src/app/checklist/page.tsx` providing an actionable checklist for vehicle pickup day (paint, hybrid battery vents, documentation fee verification, spare tire) with non-intrusive affiliate links.
- **Dependencies**: TASK-301, TASK-601.
- **Definition of Done (DoD)**:
  - Page is printable (`@media print` CSS cleanly formats to a 1-page PDF).
  - All external gear links route through `/out/[slug]` and include `rel="sponsored nofollow"`.
  - Prominent affiliate disclosure statement displayed pursuant to Canadian Competition Act and FTC guidelines.
- **Automated Test Requirements**:
  - `src/components/affiliate/gear-checklist.tsx` with toggleable check items and FTC/Competition Act disclosure.

---

### [x] TASK-603: Implement Cookieless Analytics Proxy Rewrite & Privacy Policy
- **Description**: Configure Next.js rewrites in `next.config.ts` for Umami/Plausible analytics proxy (`/stats/*`) and create `src/app/privacy/page.tsx` publishing the Zero-PII PIPEDA compliance charter.
- **Dependencies**: TASK-301.
- **Definition of Done (DoD)**:
  - Analytics script loads from first-party domain without third-party cookies.
  - Privacy policy explicitly confirms no names, emails, IPs, VINs, or device fingerprints are stored.
- **Automated Test Requirements**:
  - Verified Zero-PII privacy policy published at `src/app/privacy/page.tsx`.

---

### [x] TASK-604: Full E2E Integration Suite & Community Launch Readiness Verification
- **Description**: Execute complete test suite across viewports, verify build optimization, validate CSV export compliance, and prepare Reddit community launch post templates.
- **Dependencies**: All preceding tasks.
- **Definition of Done (DoD)**:
  - 100% automated test suite pass rate.
  - Core Web Vitals meet performance budgets on mobile viewports.
  - Turbopack production build succeeds with 0 errors.
- **Automated Test Requirements**:
  - `npm run test`: All unit, component, and integration tests green (64/64 tests).
  - `npm run build`: Production build passes with 0 errors (74 static/partially prerendered routes).
