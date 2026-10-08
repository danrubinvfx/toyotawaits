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
4. **`/guides/rav4-se-mods`** — *Skipping the Wait: Turn Your RAV4 Prime SE into an XSE*:
   - **The Wait-Time Trade-off**: SE trims deliver significantly faster (median 180–240 days) compared to XSE / Technology Package queues (410–540+ days).
   - **The 20-Minute Dash Speaker Swap**: JBL Club 3.5" (3412T/322F) drop-in dash tweeters with plug-and-play wiring harnesses (`toyota-speaker-harness`) and non-marring trim pry tools (`trim-removal-tools`), delivering near-JBL premium audio clarity without cutting factory wires.
   - **Custom Leather Upholstery**: Clazzio / EKR custom-fit tailored leather seat covers (`clazzio-leather-covers`, `ekr-seat-covers`) vs. professional Katzkin re-upholstery, upgrading standard SE cloth to SofTex/leather appearance and feel.
   - **Cost vs. Wait-Time Calculator**: Comparison showing DIY mod cost (~$700 CAD total) vs. the $4,000–$8,000 CAD trim jump and 6–12 months of saved waiting.
   - **Zero-PII Monetization**: All recommended items route exclusively via `/out/[slug]` without third-party tracking pixels.
5. **`/guides/sienna-mods`** — *The Road Dog Cruiser: Essential Sienna Family & Road-Trip Mods*:
   - **Center Console Bridge & Under-Bridge Organizers** (`sienna-console-bridge-tray`): Reclaiming cavernous open floor space beneath the shifter bridge with custom dual-tier trays.
   - **Air Lift 1000 Air Helper Springs** (`sienna-air-lift-1000`): In-coil polyurethane air spring helper kits preventing rear suspension squat/bottoming when hauling cargo boxes, hitch bike racks, or fully loaded passenger cabins on Canadian highways.
   - **OEM-Look Windshield Dashcam** (`sienna-fitcamx-dashcam`): FitcamX integrated rearview mirror shroud tap providing discrete 4K recording with zero dangling power cables or fuse box taps.
   - **Powerty Trunk Hatch LED Lighting Swap** (`sienna-hatch-led-lights`): Replacing dim incandescent trunk bulbs with dual rear liftgate LED flood illumination for late-night hockey practice or road-trip luggage unloads.
6. **`/guides/grand-highlander-mods`** — *Big Rig Comfort: Grand Highlander Utility & Cabin Upgrades*:
   - **OEM-Style Rear Cargo Hatch Lamps** (`gh-rear-cargo-lamps`): Drop-in hatch illumination upgrade (compatible with OEM PT944-48260-C0 harness) eliminating pitch-black trunk blind spots.
   - **Anti-Slip Qi Wireless Charging & Console Trays** (`gh-wireless-charger-mat`, `gh-console-organizer-tray`): Textured silicone charging mats and upper armrest divider trays preventing phone sliding, rattling, and console clutter.
   - **Windshield & Hood Protection Prep**: Stone-chip deflector and high-wear front fascia protective film guidance for winter highway sand, gravel, and salt spray.
7. **`/guides/land-cruiser-mods`** — *Backroads & Borderlines: LC250 1958 Trim Upgrades*:
   - **Factory Speaker Drop-In Upgrades** (`lc250-speaker-upgrade`): Replacing the anemic base 6-speaker paper cones on the 1958 trim with high-sensitivity 3.5" dash and 6.5" door components.
   - **Heavy-Duty Rock Sliders & Underside Armor** (`lc250-rock-sliders`): Frame-mounted steel rock sliders safeguarding side sills and hybrid high-voltage harness conduits during rugged trail excursions.
### 3.5 Curated Delivery Day Prep Checklist

A model-specific, utility-first buyer prep checklist designed to guide buyers while they wait out their allocations:
- **UI Architecture & Visual Card Layout**:
  - Clean, collapsible card mounted directly below the regional wait-time estimation card and inside the active order tracking dashboard.
  - High-readability vertical stack of visual product cards featuring 80x80px product thumbnails with subtle borders and rounded corners.
  - Right side card details: concise title, warm amber estimated CAD price badge, 1-sentence practical utility note, and direct `/out/[slug]` CTA button.
  - Clickable top-corner checkbox toggling persistent strikethrough/checked state stored in `localStorage` (`toyotawaits_prep_checklist_checks`).
  - Mobile UX: strictly vertical stack avoiding horizontal carousels or scrollbars.
  - Category navigation tabs:
    1. **Visibility & Tech**: OEM-look rearview mirror dashcams (FitcamX with TSS sensor taps) and anti-glare 9H tempered glass screen protectors.
    2. **Interior Protection**: Precision laser-measured drop-in center console divider trays and under-bridge storage units.
    3. **Roadside Armor**: Ultra-compact 12V lithium starter jump packs (NOCO Boost GB40) and J1772 charge port anti-theft lock rings (exclusive to PHEVs).
- **Noir Voice & Tone**:
  - Dark slate/charcoal card background (`bg-zinc-900/60` with `border-zinc-800`) and warm amber accents.
  - Dry, seasoned, Tom Waits aesthetic (*"Glovebox essentials and rainy-day armor while you wait out the clock"*).
  - Explicit utility focus explaining the practical flaw or winter reality each item solves.
- **User Utility & Offline Persistence**:
  - Interactive top-corner checkboxes with instant persistence to `localStorage` (`toyotawaits_prep_checklist_checks`) so buyers can track purchases across multiple visits.
  - One-click **"Print / Save Checklist"** button generating a clean printable view for the glovebox or dealer delivery day.
- **Contextual Model Triggers**:
  - Dynamically filters accessories based on current vehicle selection (`RAV4`, `Sienna`, `Grand Highlander`, `Land Cruiser 250`).
  - PHEV-specific items (e.g., J1772 lock ring) render conditionally only when `powertrain === 'phev'`.
- **Zero-PII Privacy & Affiliate Routing**:
  - Strict absence of popup ads, modal overlays, tracking pixels, or sticky banners.
  - All outbound links route exclusively through the serverless first-party redirect engine (`/out/[slug]`).
  - Microcopy disclosure: *"Community-vetted gear. Outbound links support ToyotaWaits.ca without tracking your personal data."*

---

### 3.6 Mobile Menu & Desktop Navigation Hub

The mobile menu drawer (accessed via the top-right hamburger toggle) and desktop header navigation provide direct access to both the DIY mod guides and curated product links:

1. **Wait-Time Tracking Tools**:
   - Wait-Time Estimator (`/#estimator`) with smooth scroll and sticky header offset.
   - Provincial Analytics (`/#analytics`).
   - Community Delivery Log (`/#community-log`).

2. **DIY Mod Guides ("Mods Section")**:
   - Direct links with concise descriptions:
     - **RAV4 Prime**: SE to XSE Conversion Playbook (`/guides/rav4-se-mods`)
     - **Toyota Sienna**: Road-Trip & Family Cruiser Mods (`/guides/sienna-mods`)
     - **Grand Highlander**: Big Rig Cabin & Utility Upgrades (`/guides/grand-highlander-mods`)
     - **Land Cruiser 250**: 1958 Trim Overhaul (`/guides/land-cruiser-mods`)
     - **All Mod & Prep Guides**: Comprehensive guides index (`/guides`)

3. **Recommended Gear & Product Links ("Product Links")**:
   - **Delivery Day Prep Checklist**: Direct in-page link (`/#delivery-prep` or `/#accessories`) jumping straight to the interactive visual cards.
   - **Direct Curated Gear Links**: Privacy-safe first-party redirects (`/out/[slug]`) opening directly to vetted items:
     - FitcamX 4K Integrated Dashcam (`/out/fitcamx-rav4`)
     - NOCO Boost Plus GB40 Jump Starter (`/out/noco-gb40-jump-pack`)
     - Matte 9H Tempered Glass Screen Protector (`/out/screen-protector-rav4`)
     - Center Console Organizer Tray (`/out/console-tray-rav4`)
     - J1772 Charger Port Lock Ring (`/out/j1772-charger-lock`)

4. **Community Tools & Submission**:
   - Anonymous Wait Time Submission (`/submit`).
   - Open Community Data Export (`/api/export`).

5. **Mobile Viewport UX**:
   - Drawer container constrained to `max-h-[calc(100vh-4rem)] overflow-y-auto` to support smooth vertical scrolling on all mobile screens.
   - High-contrast card groupings, warm amber accents, and clean chevron indicators matching the Tom Waits noir aesthetic.

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

