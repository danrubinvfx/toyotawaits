# Data Contracts & API Specifications: ToyotaWaits.ca
**Canadian Toyota Vehicle Delivery Wait-Time Community Tracker**  
*Document Version:* 2.0.0  
*Status:* Approved for Implementation  
*Target Domain:* `toyotawaits.ca`  

---

## 1. Core TypeScript Domain Interfaces & Types

```typescript
// ============================================================================
// DOMAIN ENUMS & UNION TYPES
// ============================================================================

export type CanadianProvince =
  | 'AB' // Alberta
  | 'BC' // British Columbia
  | 'MB' // Manitoba
  | 'NB' // New Brunswick
  | 'NL' // Newfoundland and Labrador
  | 'NS' // Nova Scotia
  | 'NT' // Northwest Territories
  | 'NU' // Nunavut
  | 'ON' // Ontario
  | 'PE' // Prince Edward Island
  | 'QC' // Quebec
  | 'SK' // Saskatchewan
  | 'YT'; // Yukon

export type SubmissionStatus = 'pending' | 'delivered' | 'cancelled';

export type SubmissionStage =
  | 'deposit_placed'        // Initial deposit in dealer queue
  | 'allocation_confirmed'  // Build sheet / temp VIN assigned
  | 'freight_transit'       // On vessel or rail
  | 'arrived_at_dealer'     // At dealership undergoing PDI
  | 'delivered';            // Customer took delivery

export type PricingType = 'at_msrp' | 'above_msrp' | 'below_msrp' | 'undisclosed';

// ============================================================================
// RELATIONAL ENTITY MODELS
// ============================================================================

export interface VehicleModel {
  id: string; // UUIDv4
  slug: string; // e.g. "rav4", "sienna"
  name: string; // e.g. "RAV4"
  manufacturer: string; // "Toyota"
  generationStartYear: number; // e.g. 2019
  isActive: boolean;
  sortOrder: number;
  createdAt: string; // ISO 8601
}

export interface VehiclePowertrain {
  id: string; // UUIDv4
  modelId: string; // UUIDv4 FK
  slug: string; // e.g. "hev", "phev", "gas"
  name: string; // e.g. "Hybrid (HEV)"
  sortOrder: number;
  createdAt: string; // ISO 8601
}

export interface VehicleTrim {
  id: string; // UUIDv4
  modelId: string; // UUIDv4 FK
  powertrainId: string; // UUIDv4 FK
  slug: string; // e.g. "xse-technology-awd"
  name: string; // e.g. "XSE AWD Technology Package"
  msrpCad: number; // MSRP in CAD
  sortOrder: number;
  createdAt: string; // ISO 8601
}

export interface Submission {
  id: string; // UUIDv4
  modelId: string;
  powertrainId: string;
  trimId: string;
  province: CanadianProvince;
  dealershipCity?: string | null;
  dealershipName?: string | null;
  modelYear: number;
  orderDate: string; // YYYY-MM-DD
  deliveryDate?: string | null; // YYYY-MM-DD
  status: SubmissionStatus;
  currentStage: SubmissionStage; // Active 5-stage milestone
  waitDays?: number | null; // Database-generated calendar days
  pricing: PricingType;
  mandatoryAddonsCad: number;
  tradeInRequired: boolean;
  notes?: string | null;
  isFlagged: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface AffiliateLink {
  id: string; // UUIDv4
  slug: string;
  destinationUrl: string;
  title: string;
  category: string;
  clickCount: number;
  isActive: boolean;
}

// ============================================================================
// STATISTICAL AGGREGATION CONTRACTS
// ============================================================================

export interface PercentileStats {
  p25: number; // 25th percentile (days)
  median: number; // 50th percentile (days)
  p75: number; // 75th percentile (days)
  mean: number; // Mean average (days)
  min: number; // Minimum recorded (days)
  max: number; // Maximum recorded (days)
  sampleCount: number; // Verified sample count
  deliveredCount: number; // Total delivered units
  waitingCount: number; // Active orders pacing the floor
}
```

---

## 2. API Endpoints Specification

### 2.1 Update Submission Milestone (`PATCH /api/submissions/:id`)
Advances an active order through the 5 delivery milestones or updates delivery date.

- **Headers**:
  - `Content-Type: application/json`
  - `x-edit-key: <string>` *(Optional if provided in body)*
- **Path Parameters**:
  - `id`: Submission UUIDv4.
- **Request Body**:
  ```json
  {
    "editKey": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "stage": "freight_transit",
    "status": "pending",
    "deliveryDate": null,
    "notes": "Vessel departed Nagoya, tracking via MOL ACE."
  }
  ```
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "data": {
        "id": "c4d5e6f7-8901-4234-5678-901234567890",
        "currentStage": "freight_transit",
        "status": "pending",
        "waitDays": null,
        "updatedAt": "2026-10-08T02:30:00.000Z"
      }
    }
    ```
  - `400 Bad Request`: Validation failure.
  - `401 Unauthorized`: Edit key hash mismatch.
  - `404 Not Found`: Submission record not found.

---

## 3. Active Buyer Tool Contracts

### 3.1 Client-Side Calendar Reminder (`.ics`) Contract
- **Function**: `generateCalendarReminder(params: CalendarReminderParams): string`
- **Params**:
  ```typescript
  export interface CalendarReminderParams {
    title: string;
    description: string;
    startDate: Date; // e.g. 180 days after deposit date
    durationHours?: number; // default: 1
    location?: string; // Dealership or online
    url?: string; // "https://toyotawaits.ca"
  }
  ```
- **Output**: RFC 5545 `.ics` formatted string with `BEGIN:VCALENDAR`, `SUMMARY`, `DESCRIPTION`, and `UID`.

### 3.2 Reddit Markdown Formatting Contract
- **Function**: `formatRedditMarkdown(params: RedditShareParams): string`
- **Params**:
  ```typescript
  export interface RedditShareParams {
    modelName: string;
    powertrainName: string;
    trimName: string;
    province: CanadianProvince;
    orderDate: string; // YYYY-MM-DD
    currentStage: SubmissionStage;
    status: SubmissionStatus;
    estDelivery?: string; // e.g. "Aug 2026 (~17 mos)"
  }
  ```
- **Output**:
  ```markdown
  > **2026 RAV4 Prime XSE** | BC | Ordered: Mar 2025 | Current Status: Freight Transit | Est. Delivery: Aug 2026 (~17 mos) — via [ToyotaWaits.ca](https://toyotawaits.ca)
  ```

---

## 4. Cloaked Affiliate Redirects (`GET /out/:slug`)

- **Method**: `GET /out/:slug`
- **Supported SE Mod Slugs**:
  - `jbl-club-dash-speakers`: JBL Club 3.5" (3412T/322F) dash tweeters.
  - `toyota-speaker-harness`: Red Wolf / Metra 72-8110 plug-and-play wiring harness.
  - `trim-removal-tools`: Non-marring automotive dash pry tool kit.
  - `clazzio-leather-covers`: Clazzio custom-fit PVC/leather seat covers for RAV4 Prime SE.
  - `ekr-seat-covers`: EKR tailored leatherette seat covers for RAV4 Prime.
- **Other Slugs**: `tuxmat-rav4`, `tuxmat-sienna`, `viofo-a229-pro`, `screen-protector-12-3`, `no-drill-mud-flaps-rav4`, `grizzl-e-charger`, `flo-g5`, `michelin-xice`, `bridgestone-blizzak`, `rates-ca-insurance`.
- **Response**:
  - `307 Temporary Redirect` to configured destination URL.
  - Headers: `Cache-Control: no-store, no-cache, must-revalidate`, `Referrer-Policy: strict-origin-when-cross-origin`.
- **Fallback**:
  - If a slug is unknown or unconfigured: 302 redirect to `/` (home page).

