# Functional Specification: ToyotaWaits.ca
**Canadian Toyota Vehicle Delivery Wait-Time Community Tracker & Noir Almanac**  
*Document Version:* 2.0.0  
*Status:* Approved for Implementation  
*Target Domain:* `toyotawaits.ca`  

---

## 1. Executive Summary & Brand Identity

### 1.1 The Problem
In the Canadian automotive market, severe allocation quotas, dealership markups, and long-standing supply backlogs have created unprecedented wait times for Toyota hybrid and plug-in hybrid electric vehicles (HEV/PHEV). Canadian consumers waiting for vehicles such as the **RAV4 Hybrid**, **RAV4 Plug-in Hybrid (formerly Prime)**, **Sienna**, **Grand Highlander Hybrid**, and **Land Cruiser (250 Series)** face delivery delays stretching between 6 and 24+ months.

Dealership communications are notoriously opaque:
- Sales reps provide optimistic or non-committal delivery estimates that continuously slide.
- Real-world buyer updates are fragmented across Reddit (`r/rav4club`, `r/Toyota`, `r/PersonalFinanceCanada`), Facebook owner groups, and RedFlagDeals threads.
- Ad-hoc community spreadsheets suffer from vandalism, broken formatting, and privacy leaks.

### 1.2 The Solution: ToyotaWaits.ca
`toyotawaits.ca` is an open, mobile-first, zero-signup, anonymous community data tracker and wait-time estimator built specifically for Canadian automotive buyers.

### 1.3 Brand Identity & Copywriting Pass (The Tom Waits Homage)
To set `ToyotaWaits.ca` apart from generic corporate automotive tools, the platform adopts a witty, gritty, noir late-night diner aesthetic inspired by the songwriting and persona of Tom Waits:

- **Site Brand & Header**: `ToyotaWaits.ca`
- **Official Tagline**: *"The piano has been drinking, and your Toyota is still on a boat."*
- **Visual Aesthetic**:
  - Deep obsidian/zinc background (`#09090b` / `zinc-950`) evoking a dimly lit late-night counter.
  - Warm amber and neon gold accents (`amber-500`, `amber-400`, `amber-600`) reminiscent of diner jukeboxes, vintage street lamps, and bourbon glasses.
  - Clean typography using Geist Sans with crisp, high-contrast readability.
- **Wait Time Tiers (Estimator Gauges)**:
  - `< 180 days`: **"Early Bird Special"** (Quick turnaround, short line at the diner counter).
  - `180–365 days`: **"Rain Dogs Queue"** (The standard Canadian purgatory; hunkered down in the drizzle).
  - `> 365 days`: **"Time Stands Still at 5th and Hennepin"** (Extended year-plus backlog; calendars peel away).
- **Milestone & Microcopy Badges**:
  - Waiting / Queued: **"Pacing the Floor"**
  - In Transit / Ocean Freight: **"Somewhere Between Tokyo and Vancouver"**
  - Delivered: **"Drove Away in a Blue Valentine"**
  - Dealer Markup / Mandatory Add-on Flag: **"The Carny Hustle (Mandatory Add-ons)"**
- **Empty State Notice (Unrepresented Region/Trim)**:
  - *"Nothin' but crickets and street sweepers in this province yet. Be the first to drop a dime."*

---

## 2. Order Lifecycle Milestones

To reflect the multi-month reality of Canadian vehicle delivery, the platform expands beyond a binary pending/delivered flag into an **Active 5-Stage Order Lifecycle**:

```
[1. Deposit Placed] ──► [2. Allocation Confirmed] ──► [3. Freight Transit] ──► [4. Arrived at Dealer] ──► [5. Delivered]
   (Pacing the Floor)       (Build Sheet Issued)      (Between Tokyo & Van)      (On Dealer Lot)       (Blue Valentine)
```

### 2.1 The Five Milestones
1. **`deposit_placed` (Initial)**:
   - Buyer places a refundable deposit ($500–$2,000) with a Canadian dealership and enters the dealership waitlist queue.
2. **`allocation_confirmed`**:
   - Dealership confirms an allocated vehicle build sheet with a temporary or partial VIN / build date window.
3. **`freight_transit`**:
   - Vehicle has left the manufacturing facility (vessel transit from Japan for RAV4 PHEV / Land Cruiser, or rail transit from Georgetown/Cambridge/Indiana for Sienna and Grand Highlander).
4. **`arrived_at_dealer`**:
   - Carrier unloads the vehicle at the dealership compound; PDI (Pre-Delivery Inspection) underway.
5. **`delivered`**:
   - Customer completes paperwork, takes keys, and drives off the lot. Requires final delivery arrival date.

### 2.2 Anonymous Self-Service Stage Progression
- Users receive a client-side secret edit key (UUIDv4) upon initial submission.
- The browser stores the key in `localStorage` under `toyotawaits_edit_keys`.
- Returning users are greeted with an **Active Order Stepper** widget showing their vehicle's current milestone.
- Users can click any subsequent milestone or "Mark as Delivered" directly from the stepper, sending `PATCH /api/submissions/[id]` authenticated via the `x-edit-key` header.

---

## 3. Active Buyer Tools

### 3.1 Calendar Check-in (.ics Export)
- **Problem**: Dealerships frequently fail to proactively update buyers, and buyers forget when to inquire about allocation cycles (typically monthly allocation drops).
- **Feature**: Generates and downloads standard RFC 5545 iCalendar (`.ics`) reminders:
  - **Month 6 Allocation Check-in**: Set for 180 days after order date (*"Check in with dealership sales manager regarding quarterly allocations"*).
  - **Estimated Arrival Window Reminder**: Calculated from regional median wait days.
- **Compatibility**: Direct one-click import into Apple Calendar, Google Calendar, and Microsoft Outlook.

### 3.2 Rebate Intelligence Engine
- **Contextual ZEV Rules**: When a user selects a plug-in hybrid powertrain (`phev`), the platform activates the dynamic Canadian incentive panel:
  - **Federal iZEV**: Up to **$5,000 CAD** point-of-sale rebate on qualifying PHEVs with electric range $\ge$ 50 km.
  - **British Columbia (CleanBC Go Electric)**: Up to **$2,000 CAD** provincial incentive (subject to BC individual income testing brackets: under $80k individual, $125k household).
  - **Quebec (Roulez vert)**: Provincial transition schedule details (noting historical $5,000 cap phasing down).
  - **Other Provinces**: New Brunswick ($5,000), Nova Scotia ($3,000), PEI ($3,250), Newfoundland ($2,500).

### 3.3 Reddit Share Generator
- **Workflow**: On the submission confirmation dialog and the estimator result card, a **"Share to Reddit"** button opens a formatted modal.
- **Format**:
  ```markdown
  > **2026 RAV4 Prime XSE** | BC | Ordered: Mar 2025 | Current Status: Freight Transit | Est. Delivery: Aug 2026 (~17 mos) — via [ToyotaWaits.ca](https://toyotawaits.ca)
  ```
- **One-Click Copy**: Copies clean Markdown to the user's clipboard ready for paste into Reddit threads (`r/rav4club`, `r/Toyota`, `r/PersonalFinanceCanada`).

### 3.4 Canadian Buyer Prep Guides (Prep Hub)
Static resource hub accessible from the header and footer providing practical Canadian delivery preparation, monetized through first-party cloaked redirects (`/out/[slug]`):
1. **`/guides/ev-charging`** — *Level 2 Home EVSE Charging Guide*:
   - Cold-weather charging specs for Canadian winters.
   - Recommended 240V 32A/40A EVSE units (Grizzl-E Classic made in Canada, Flo Home G5).
2. **`/guides/winter-tires`** — *Provincial Winter Tire Mandates & Fitments*:
   - BC Highway Mountain Pass winter tire laws (Oct 1 – Apr 30) & Quebec mandatory winter tire laws (Dec 1 – Mar 15).
   - Tire sizing and wheel downsizing specs for RAV4 (225/65R17), Sienna, Grand Highlander, and Land Cruiser.
   - Recommended studless packages (Michelin X-Ice Snow, Bridgestone Blizzak WS90).
3. **`/guides/insurance`** — *Canadian Auto Insurance Quote Comparison*:
   - How hybrid battery replacement riders and anti-theft tags (TAG system in Ontario/Quebec) affect comprehensive premiums.

---

## 4. Strict Privacy & Zero-PII Guarantees

`ToyotaWaits.ca` maintains an uncompromising zero-PII architecture:
- **Zero PII**: No names, email addresses, phone numbers, VINs, or postal codes stored.
- **Ephemeral IP Handling**: IP addresses exist purely in volatile memory during rate-limiting checks and are never persisted to the database.
- **Client-Side SHA-256 Edit Keys**: Self-service stage updates without accounts or passwords.
- **Sanitized Open Data**: All records are available for audit via `GET /api/export`.

---

## 5. Non-Intrusive Monetization Architecture

1. **First-Party Cloaked Redirects (`/out/[slug]`)**:
   - Clean 307 temporary redirects with `no-store` headers and strict cross-origin referrer policy.
2. **Disclosures**:
   - Compliant with Canadian Competition Act, FTC, and PIPEDA disclosures across all guide and accessory links.
