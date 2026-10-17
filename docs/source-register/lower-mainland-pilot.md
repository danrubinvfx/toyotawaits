# Source Register: Lower Mainland Pilot (Sprint 1)

**Document Version:** 1.0  
**Master Plan Reference:** ToyotaWaits.ca Master Plan V3.2 (Page 2 & Section 2)  
**Audit Date:** 2026-10-17  
**Branch:** `feature/v3.2-sprint1-dealer-discovery`  
**Artifact Reference:** [`audit-artifacts/dealer-discovery/endpoint-validation-2026-10-17.json`](../../audit-artifacts/dealer-discovery/endpoint-validation-2026-10-17.json)

---

## 1. Overview & Gate 1 Mandate

Per Master Plan V3.2 Page 2, Gate 1 requires establishing at least one reproducible, permitted, and structured source feed meeting strict schema criteria (true 17-character VIN, explicit status declaration without inference, MSRP and fee breakdown, and pagination support) while formally documenting coverage limitations where sources enforce technical access controls.

### Operating Safeguards Applied
- **Sequential Requests Only:** Zero burst or concurrent traffic.
- **Polite Inter-Request Delay:** Minimum 1.2s delay enforced (configured to 1,500ms).
- **Request Timeout:** 6,000ms explicit timeout per probe.
- **User-Agent:** `Mozilla/5.0 (compatible; ToyotaWaitsLocalAuditor/1.0; +https://toyotawaits.ca/source-register)`
- **Policy Guardrail on Technical Controls:** We strictly do not bypass authentication, CAPTCHAs, or access restrictions. Sources requiring bypass are classified as Coverage Limitations rather than risking operational integrity.

---

## 2. Dealership Source Inventory

### 2.1. Jim Pattison Toyota Downtown
- **Dealership ID:** `jp-toyota-downtown`
- **Location:** 1290 Burrard Street, Vancouver, BC V6Z 1Z1
- **Platform Architecture:** Convertus (WordPress / Achilles theme with Convertus VMS backend)
- **Status:** **Validated (Gate 1 PASS)**
- **Public Ingestion Endpoint:**  
  `https://www.jptoyota-downtown.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Fcp%3D1250%26ln%3Den%26sc%3Dnew`
- **Contract Reference Fixture:** [`audit-artifacts/dealer-discovery/convertus-vms-sample.json`](../../audit-artifacts/dealer-discovery/convertus-vms-sample.json)
- **Schema Capabilities & Gate 1 Evaluation:**
  - **VIN Validation:** Provides true 17-character ISO-standard VIN in `vin` (e.g., `JTDACAAJ0T3038212`), strictly decoupled from the dealer `stock_number` (e.g., `D-26136`).
  - **Model & Trim Granularity:** Full specification delivered across `make`, `model`, `trim`, `model_code` (e.g., `ACAAJC`), and `package_code` (e.g., `B,PRE1`).
  - **Explicit Availability Status:** Explicit flags provided without heuristic inference: `sale_class: "New"`, `in_transit: 0`, `on_order: 0`, and `days_on_lot: 271`.
  - **Pricing Breakdown:** Full separation of financial attributes: `msrp`, `asking_price`, `sale_price`, `internet_price`, `initial_price`, and `final_price`, alongside structured `finance` and `lease` tier options.
  - **Pagination & Filtering:** Supported via `summary.total_vehicles` (42 live units audited) and multi-facet query parameters (`pg`, `limit`, `sc`, `ln`, `cp`).
- **Ingestion Recommendation for Sprint 2:** Approved as primary baseline feed for Sprint 2 normalization pipeline and parser tests.

---

### 2.2. OpenRoad Toyota Richmond
- **Dealership ID:** `openroad-toyota-richmond`
- **Location:** 13100 Smallwood Place, Richmond, BC V6V 1W8
- **Platform Architecture:** ASP.NET Core with custom React SPA (`/dist/react/VLP.bundle.js`)
- **Status:** **COVERAGE_LIMITATION**
- **Discovered API Surface:**  
  `https://inventory.oragdigital.com/inventory/search?startIndex=0&endIndex=5&sortCode=recent&searchPhrase=&businessUnitId=30&searchBusinessUnitId=30`
- **Audit Findings:**
  - Public inventory HTML (`/inventory?condition=new`) renders an empty client-side DOM shell (`<div id="root">`) with configuration metadata (`id="buId" value="30"`, `id="inventoryApiHost" value="https://inventory.oragdigital.com"`).
  - No vehicle records are server-side hydrated into the DOM or inline scripts.
  - Unauthenticated HTTP requests to `inventory.oragdigital.com` return `HTTP 401 Unauthorized` (`application/problem+json`).
- **Policy Guardrail Evaluation:**
  Per Master Plan V3.2 Page 2, ToyotaWaits will not inject credentials, reverse-engineer proprietary tokens, or bypass access controls. This source is officially documented as a **Coverage Limitation**.

---

### 2.3. Granville Toyota
- **Dealership ID:** `granville-toyota`
- **Location:** 8265 Fraser Street, Vancouver, BC V5X 3X9
- **Platform Architecture:** Generic CMS / Nginx behind Cloudflare WAF
- **Status:** **COVERAGE_LIMITATION**
- **Discovered API Surface:**  
  `https://www.granvilletoyota.com/api/inventory/?vehicle_type=new&limit=5`
- **Audit Findings:**
  - Route returns `HTTP 403 Forbidden` (`cf-mitigated: challenge`) triggering Cloudflare Managed Challenge.
  - Direct HTTP audit probes are blocked by anti-bot challenge policies.
- **Policy Guardrail Evaluation:**
  Per Master Plan V3.2 Section 2 and Page 2 safeguards, automated CAPTCHA solvers and headless browser circumvention tools (e.g., Playwright/Puppeteer) are strictly rejected. Granville Toyota is designated as an official **Coverage Limitation**.

---

## 3. Sprint 1 Sign-Off Summary

| Target Dealer | Platform | HTTP Status | Gate 1 Verdict | Pipeline Action |
| :--- | :--- | :---: | :---: | :--- |
| **Jim Pattison Toyota Downtown** | Convertus VMS | `200 OK` | **`PASS`** | Feed approved for Sprint 2 ingestion & parser testing |
| **OpenRoad Toyota Richmond** | ASP.NET / oragdigital | `401 Unauthorized` | **`COVERAGE_LIMITATION`** | Logged as Coverage Limitation (Protected API) |
| **Granville Toyota** | Cloudflare Protected | `403 Forbidden` | **`COVERAGE_LIMITATION`** | Logged as Coverage Limitation (Cloudflare WAF) |

**Gate 1 Status:** **SATISFIED** (1 reproducible, permitted, structured source feed established; coverage limitations formally disclosed).
