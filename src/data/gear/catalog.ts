/**
 * Comprehensive Gear Data Catalog & Market-Specific Affiliate Mapping
 * Ensures 100% reliable Amazon links across CA (Amazon.ca) and US (Amazon.com)
 * with verified ASINs and high-converting search fallbacks.
 */

import { injectActiveModelIntoQuery } from '@/lib/gear/affiliate';

export interface GearMarketConfig {
  slug: string;
  title: string;
  asin_ca?: string;
  asin_us?: string;
  searchKeywordsCA: string;
  searchKeywordsUS: string;
  compatibility?: string;
  whyBuy?: string;
  badge?: string;
}

export const GEAR_MARKET_CATALOG: Record<string, GearMarketConfig> = {
  // ==========================================
  // Dashcams / FitcamX (Fit-Sensitive Generation Bounds)
  // ==========================================
  'fitcamx-rav4': {
    slug: 'fitcamx-rav4',
    title: 'FitcamX OEM Integrated 4K Mirror Dashcam (RAV4 2019-2025)',
    searchKeywordsCA: 'fitcamx 4k dash cam rav4 2019-2025',
    searchKeywordsUS: 'fitcamx 4k dash cam rav4 2019-2025',
    compatibility: 'RAV4 Gen 5 TSS 2.0 / 2.5 Shroud (2019-2025)',
    whyBuy: 'Discrete OEM look tapping into rearview mirror power with zero dangling cables. Verified for Gen 5 (2019-2025).',
  },
  'fitcamx-sienna': {
    slug: 'fitcamx-sienna',
    title: 'FitcamX OEM Integrated 4K Mirror Dashcam (Sienna 2021-2025)',
    searchKeywordsCA: 'fitcamx 4k dash cam sienna 2021-2025',
    searchKeywordsUS: 'fitcamx 4k dash cam sienna 2021-2025',
    compatibility: 'Sienna Gen 4 TSS 2.0 / 2.5 Shroud (2021-2025)',
    whyBuy: 'Seamless mirror tap installation protecting family trips without cluttering windshield glass.',
  },
  'fitcamx-grand-highlander': {
    slug: 'fitcamx-grand-highlander',
    title: 'FitcamX OEM Integrated 4K Mirror Dashcam (Grand Highlander 2024-2025)',
    searchKeywordsCA: 'fitcamx 4k dash cam grand highlander 2024-2025',
    searchKeywordsUS: 'fitcamx 4k dash cam grand highlander 2024-2025',
    compatibility: 'Grand Highlander Gen 1 TSS 3.0 Shroud (2024-2025)',
    whyBuy: 'Custom molded mirror housing integrating 4K recording under the digital/standard mirror bracket.',
  },
  'fitcamx-land-cruiser': {
    slug: 'fitcamx-land-cruiser',
    title: 'FitcamX OEM Integrated 4K Mirror Dashcam (Land Cruiser 250 2024-2025)',
    searchKeywordsCA: 'fitcamx 4k dash cam land cruiser 2024-2025',
    searchKeywordsUS: 'fitcamx 4k dash cam land cruiser 2024-2025',
    compatibility: 'Land Cruiser 250-Series TSS 3.0 Mirror Cover (2024-2025)',
    whyBuy: 'Rugged plug-and-play harness designed for the 250-Series off-road cockpit.',
  },
  'fitcamx-prius': {
    slug: 'fitcamx-prius',
    title: 'FitcamX OEM Integrated 4K Dashcam (Gen 5 Prius 2023-2025)',
    searchKeywordsCA: 'fitcamx 4k dash cam prius 2023-2025',
    searchKeywordsUS: 'fitcamx 4k dash cam prius 2023-2025',
    compatibility: 'Gen 5 Prius & Prius Prime TSS 3.0 (2023-2025)',
    whyBuy: 'Factory-integrated mirror replacement for sleek Gen 5 Prius windshield aerodynamics.',
  },

  // ==========================================
  // Screen Protectors (Separated & Model-Specific)
  // ==========================================
  'screen-protector-grand-highlander': {
    slug: 'screen-protector-grand-highlander',
    title: '12.3-inch Anti-Glare Tempered Glass (Grand Highlander 2024-2026)',
    searchKeywordsCA: 'Grand Highlander 2024 2025 2026 12.3-inch screen protector tempered glass',
    searchKeywordsUS: 'Grand Highlander 2024 2025 2026 12.3-inch screen protector tempered glass',
    compatibility: '12.3-inch Grand Highlander Touchscreen (2024-2026)',
    whyBuy: 'Prevents fingerprint oil buildup and eliminates harsh reflections across wide cabin glass.',
  },
  'screen-protector-rav4': {
    slug: 'screen-protector-rav4',
    title: 'Anti-Glare 9H Tempered Glass Screen Protector (RAV4 2019-2025)',
    searchKeywordsCA: 'toyota rav4 2019-2025 screen protector tempered glass',
    searchKeywordsUS: 'toyota rav4 2019-2025 screen protector tempered glass',
    compatibility: 'Toyota RAV4 8-inch & 10.5-inch Multimedia Displays (2019-2025)',
    whyBuy: '9H hardness eliminates fingerprint smudges and prevents hairline scratches on the touchscreen.',
  },
  'screen-protector-corolla-cross': {
    slug: 'screen-protector-corolla-cross',
    title: 'Anti-Glare 8-inch Tempered Glass (Corolla Cross 2022-2025)',
    searchKeywordsCA: 'Toyota Corolla Cross 2022-2025 screen protector 8 inch tempered glass',
    searchKeywordsUS: 'Toyota Corolla Cross 2022-2025 screen protector 8 inch tempered glass',
    compatibility: '8.0-inch Corolla Cross Touchscreen (2022-2025)',
    whyBuy: 'Precision cut for Corolla Cross 8-inch display bezels; avoids edge lifting.',
  },
  'screen-protector-sienna': {
    slug: 'screen-protector-sienna',
    title: 'Matte Anti-Glare Screen Protector (Toyota Sienna 2021-2025)',
    searchKeywordsCA: 'toyota sienna 2021-2025 screen protector tempered glass',
    searchKeywordsUS: 'toyota sienna 2021-2025 screen protector tempered glass',
    compatibility: '9-inch & 12.3-inch Sienna Infotainment (2021-2025)',
    whyBuy: 'Cuts blinding glare from panoramic glass and protects against finger smudges.',
  },
  'screen-protector-land-cruiser': {
    slug: 'screen-protector-land-cruiser',
    title: 'Armor-Grade Multimedia Screen Shield (Land Cruiser 250 2024-2025)',
    searchKeywordsCA: 'land cruiser 250 2024-2025 screen protector 12.3 inch tempered glass',
    searchKeywordsUS: 'land cruiser 250 2024-2025 screen protector 12.3 inch tempered glass',
    compatibility: '12.3-inch Touchscreen (2024-2025 Land Cruiser 1958 & First Edition)',
  },
  'prius-screen-protector': {
    slug: 'prius-screen-protector',
    title: 'Matte Anti-Glare Tempered Glass Screen Protector (Prius 2023-2025)',
    searchKeywordsCA: 'toyota prius 2023-2025 screen protector 12.3 inch tempered glass',
    searchKeywordsUS: 'toyota prius 2023-2025 screen protector 12.3 inch tempered glass',
    compatibility: '8-inch & 12.3-inch Gen 5 Displays (2023-2025)',
  },

  // ==========================================
  // Console Organizers (Generation Bounds 2019-2025)
  // ==========================================
  'console-tray-rav4': {
    slug: 'console-tray-rav4',
    title: 'Drop-In Center Console Divider & Coin Tray (RAV4 2019-2025)',
    searchKeywordsCA: 'toyota rav4 2019-2025 center console organizer tray',
    searchKeywordsUS: 'toyota rav4 2019-2025 center console organizer tray',
    compatibility: 'RAV4 Gen 5 LE, XLE, SE, XSE, Limited, Woodland (2019-2025)',
    whyBuy: 'Converts cavernous empty armrest bin into two accessible tiers with coin slot and USB pass-through.',
  },
  'console-tray-sienna': {
    slug: 'console-tray-sienna',
    title: 'Dual-Tier Center Console & Bridge Organizer (Sienna 2021-2025)',
    searchKeywordsCA: 'toyota sienna 2021-2025 center console bridge organizer tray',
    searchKeywordsUS: 'toyota sienna 2021-2025 center console bridge organizer tray',
    compatibility: 'Sienna Gen 4 LE, XLE, XSE, Limited, Platinum (2021-2025)',
    whyBuy: 'Tames the deep center bridge cubby and upper armrest cavity with non-slip rubber inserts.',
  },
  'console-tray-grand-highlander': {
    slug: 'console-tray-grand-highlander',
    title: 'Precision Armrest Divider & Upper Storage Tray (Grand Highlander 2024-2025)',
    searchKeywordsCA: 'grand highlander 2024-2025 center console organizer tray',
    searchKeywordsUS: 'grand highlander 2024-2025 center console organizer tray',
    compatibility: 'Grand Highlander XLE, Limited, Platinum (2024-2025)',
    whyBuy: 'Adds modular organization for keys, wallets, and pens above the oversized bottom bin.',
  },
  'console-tray-land-cruiser': {
    slug: 'console-tray-land-cruiser',
    title: 'Heavy-Duty Armrest Storage Organizer (Land Cruiser 250 2024-2025)',
    searchKeywordsCA: 'land cruiser 2024-2025 center console organizer tray',
    searchKeywordsUS: 'land cruiser 2024-2025 center console organizer tray',
    compatibility: 'Land Cruiser 250-Series with/without Cool Box (2024-2025)',
  },
  'prius-console-organizer': {
    slug: 'prius-console-organizer',
    title: 'Center Console 2-Tier Organizer Tray (Prius 2023-2025)',
    searchKeywordsCA: 'gen 5 prius 2023-2025 center console organizer tray',
    searchKeywordsUS: 'gen 5 prius 2023-2025 center console organizer tray',
    compatibility: 'Gen 5 Prius & Prius Prime (2023-2025)',
  },

  // ==========================================
  // Floor Mats (Separated Sienna & Grand Highlander)
  // ==========================================
  'high-wall-floor-liners-rav4': {
    slug: 'high-wall-floor-liners-rav4',
    title: 'High-Wall All-Weather Floor Liners & Cargo Mat (RAV4 2019-2025)',
    searchKeywordsCA: 'toyota rav4 2019-2025 all weather floor mats liners',
    searchKeywordsUS: 'toyota rav4 2019-2025 all weather floor mats liners',
    compatibility: 'RAV4 Gen 5 Hybrid & Prime (2019-2025)',
  },
  'sienna-all-weather-liners': {
    slug: 'sienna-all-weather-liners',
    title: 'Custom-Fit All-Weather 3-Row Floor Liners (Sienna 2021-2025)',
    searchKeywordsCA: 'Toyota Sienna 2021-2025 all weather floor mats liners 7 8 passenger',
    searchKeywordsUS: 'Toyota Sienna 2021-2025 all weather floor mats liners 7 8 passenger',
    compatibility: 'Toyota Sienna 7-Passenger & 8-Passenger (2021-2025)',
    whyBuy: 'Maximized spill containment along sliding Super Long Slide tracks and cargo trunk well.',
  },
  'grand-highlander-all-weather-liners': {
    slug: 'grand-highlander-all-weather-liners',
    title: 'Custom-Fit All-Weather 3-Row Floor Liners (Grand Highlander 2024-2025)',
    searchKeywordsCA: 'Toyota Grand Highlander 2024-2025 all weather floor mats liners',
    searchKeywordsUS: 'Toyota Grand Highlander 2024-2025 all weather floor mats liners',
    compatibility: 'Toyota Grand Highlander Captain & Bench (2024-2025)',
    whyBuy: 'Precision laser-scanned edge protection covering all 3 passenger rows and cargo area.',
  },
  '3-row-all-weather-liners': {
    slug: '3-row-all-weather-liners',
    title: '3-Row Heavy Duty All-Weather Floor Liners',
    searchKeywordsCA: 'toyota all weather floor mats 3 row',
    searchKeywordsUS: 'toyota all weather floor mats 3 row',
    compatibility: '3-Row Toyota Family Vehicles (Sienna & Grand Highlander)',
  },
  'prius-all-weather-liners': {
    slug: 'prius-all-weather-liners',
    title: 'Custom-Fit All-Weather 3D TPE Floor Liners & Trunk Mat (Prius 2023-2025)',
    searchKeywordsCA: 'toyota prius 2023-2025 all weather floor mats cargo liner',
    searchKeywordsUS: 'toyota prius 2023-2025 all weather floor mats cargo liner',
    compatibility: 'Prius & Prius Prime Gen 5 (2023-2025)',
  },

  // ==========================================
  // Roof Crossbars (Model Years Bound)
  // ==========================================
  'roof-rack-crossbars-rav4': {
    slug: 'roof-rack-crossbars-rav4',
    title: 'OEM-Style Lockable Aluminum Roof Rack Cross Bars (RAV4 2019-2025)',
    searchKeywordsCA: 'toyota rav4 2019-2025 roof rack cross bars OEM style',
    searchKeywordsUS: 'toyota rav4 2019-2025 roof rack cross bars OEM style',
    compatibility: 'RAV4 Gen 5 with Factory Roof Rails (2019-2025)',
  },
  'roof-rack-crossbars-grand-highlander': {
    slug: 'roof-rack-crossbars-grand-highlander',
    title: 'Heavy-Duty Roof Crossbar System (Grand Highlander 2024-2025)',
    searchKeywordsCA: 'toyota grand highlander 2024-2025 roof rack crossbars',
    searchKeywordsUS: 'toyota grand highlander 2024-2025 roof rack crossbars',
    compatibility: 'Grand Highlander Factory Roof Rail Mounts (2024-2025)',
  },
  'roof-rack-crossbars-corolla-cross': {
    slug: 'roof-rack-crossbars-corolla-cross',
    title: 'Low-Profile Cargo Roof Rack Bars (Corolla Cross 2022-2025)',
    searchKeywordsCA: 'toyota corolla cross 2022-2025 roof rack crossbars',
    searchKeywordsUS: 'toyota corolla cross 2022-2025 roof rack crossbars',
    compatibility: 'Corolla Cross with Raised Roof Rails (2022-2025)',
  },

  // ==========================================
  // Split 12-Pin & 16-Pin Mirror Adapter Harnesses
  // ==========================================
  'dongar-12pin-type-a': {
    slug: 'dongar-12pin-type-a',
    title: '12-Pin Mirror Tap / Dash Cam Power Adapter (Type A - 12-Pin Connector)',
    searchKeywordsCA: 'toyota 12 pin dash cam mirror adapter harness',
    searchKeywordsUS: 'toyota 12 pin dash cam mirror adapter harness',
    compatibility: '12-Pin Connector — Verify mirror plug before ordering. Pin count alone does not establish compatibility across all trims.',
    whyBuy: 'Powers dash cams from the 12-pin rearview mirror connector with zero wire splicing. Please confirm your vehicle mirror connector matches 12 pins before ordering.',
    badge: 'Pro Tip',
  },
  'dongar-12pin': {
    slug: 'dongar-12pin',
    title: '12-Pin Mirror Tap / Dash Cam Power Adapter (Type A - 12-Pin Connector)',
    searchKeywordsCA: 'toyota 12 pin dash cam mirror adapter harness',
    searchKeywordsUS: 'toyota 12 pin dash cam mirror adapter harness',
    compatibility: '12-Pin Connector — Please confirm your vehicle mirror connector matches 12 pins before ordering.',
    whyBuy: 'Powers dash cams cleanly from the 12-pin mirror plug with zero wire splicing.',
  },
  'dongar-16pin-type-b': {
    slug: 'dongar-16pin-type-b',
    title: '16-Pin Mirror Tap / Dash Cam Power Adapter (Type B - 16-Pin Connector)',
    searchKeywordsCA: 'toyota 16 pin dash cam mirror adapter harness',
    searchKeywordsUS: 'toyota 16 pin dash cam mirror adapter harness',
    compatibility: '16-Pin Connector — Digital rearview mirror trims. Verify connector pinout and plug shape before ordering.',
    whyBuy: 'Powers dash cams directly from the 16-pin digital mirror harness (commonly found on Limited / Platinum trims). Please check your mirror connector pin count and plug shape before ordering.',
    badge: 'Pro Tip',
  },
  'dongar-16pin': {
    slug: 'dongar-16pin',
    title: '16-Pin Mirror Tap / Dash Cam Power Adapter (Type B - 16-Pin Connector)',
    searchKeywordsCA: 'toyota 16 pin dash cam mirror adapter harness',
    searchKeywordsUS: 'toyota 16 pin dash cam mirror adapter harness',
    compatibility: '16-Pin Connector — Digital rearview mirror trims. Verify connector before ordering.',
    whyBuy: 'Powers dash cams directly from the 16-pin digital mirror harness.',
  },
  'dongar-12pin-type-b': {
    slug: 'dongar-12pin-type-b',
    title: '12-Pin / 16-Pin Mirror Tap Dash Cam Power Harness',
    searchKeywordsCA: 'toyota 12 pin dash cam mirror adapter harness',
    searchKeywordsUS: 'toyota 12 pin dash cam mirror adapter harness',
    compatibility: 'Check mirror harness pin count (12-Pin or 16-Pin) before ordering.',
  },
  'dongar-10pin-type-a': {
    slug: 'dongar-10pin-type-a',
    title: '10-Pin Type A TSS Mirror Harness Adapter',
    searchKeywordsCA: 'Dongar 10-pin type A mirror dash cam adapter',
    searchKeywordsUS: 'Dongar 10-pin type A mirror dash cam adapter',
    compatibility: '10-Pin Toyota Safety Sense Mirror Plugs. Verify pin count before ordering.',
  },

  // ==========================================
  // Verified Dual-Market Direct Link (NOCO GB40)
  // ==========================================
  'noco-gb40-jump-pack': {
    slug: 'noco-gb40-jump-pack',
    title: 'NOCO Boost Plus GB40 1000A 12V UltraSafe Lithium Jump Starter',
    asin_ca: 'B015TKUPIC',
    asin_us: 'B015TKUPIC',
    searchKeywordsCA: 'NOCO Boost Plus GB40 1000A jump starter',
    searchKeywordsUS: 'NOCO Boost Plus GB40 1000A jump starter',
    compatibility: 'Universal 12V Auxiliary Battery Jump Starting (HEV / PHEV / Gas)',
    whyBuy: 'Prevents getting stranded when the 12V auxiliary battery discharges under hybrid sleep drain.',
    badge: 'Essential',
  },

  // ==========================================
  // Vehicle-Specific Shared Accessories
  // ==========================================
  'hybrid-battery-filter-mesh': {
    slug: 'hybrid-battery-filter-mesh',
    title: 'Hybrid Battery Intake Pre-Filter Mesh',
    searchKeywordsCA: 'Toyota RAV4 2019-2025 hybrid battery intake filter mesh G92DH-42010',
    searchKeywordsUS: 'Toyota RAV4 2019-2025 hybrid battery intake filter mesh G92DH-42010',
    compatibility: 'Toyota Hybrid Battery Air Intake Grille',
    whyBuy: 'Blocks pet fur and debris from choking the battery cooling fan and triggering high-voltage fault codes.',
    badge: 'Recommended',
  },
  'door-sill-scuff-guards': {
    slug: 'door-sill-scuff-guards',
    title: 'Stainless Steel / ABS Door Sill Scuff Guards',
    searchKeywordsCA: 'Toyota RAV4 2019-2025 door sill protector scuff plate',
    searchKeywordsUS: 'Toyota RAV4 2019-2025 door sill protector scuff plate',
    compatibility: 'Front & Rear Door Sill Thresholds',
    whyBuy: 'Prevents boot gouges and paint chipping when stepping into the cabin.',
  },
  'silicone-key-fob-cover': {
    slug: 'silicone-key-fob-cover',
    title: 'Protective Silicone Smart Key Fob Cover',
    searchKeywordsCA: 'Toyota RAV4 silicone key fob cover',
    searchKeywordsUS: 'Toyota RAV4 silicone key fob cover',
    compatibility: 'Toyota Smart Key Transponder',
    whyBuy: 'Protects expensive smart proximity key shells against drops and water damage.',
  },
  'key-fob-cover': {
    slug: 'key-fob-cover',
    title: 'Protective Silicone Smart Key Fob Cover',
    searchKeywordsCA: 'Toyota RAV4 silicone key fob cover',
    searchKeywordsUS: 'Toyota RAV4 silicone key fob cover',
    compatibility: 'Toyota Smart Key Transponder',
  },

  // ==========================================
  // Prius Guide Catalog Items (Preserve danrubin03-20 on CA)
  // ==========================================
  'prius-mud-flaps': {
    slug: 'prius-mud-flaps',
    title: 'Molded Splash Guards & Mud Flap Kit (Prius Front & Rear 2023-2025)',
    searchKeywordsCA: '2023-2025 prius mud flaps splash guards',
    searchKeywordsUS: '2023-2025 prius mud flaps splash guards',
    compatibility: 'Gen 5 Prius & Prius Prime (2023-2025)',
  },
  'prius-bumper-protector': {
    slug: 'prius-bumper-protector',
    title: 'Textured Rear Bumper Sill Protector Guard (Prius 2023-2025)',
    searchKeywordsCA: 'gen 5 prius 2023-2025 rear bumper protector sill',
    searchKeywordsUS: 'gen 5 prius 2023-2025 rear bumper protector sill',
    compatibility: 'Gen 5 Prius & Prius Prime (2023-2025)',
  },
  'prius-prime-portable-charger': {
    slug: 'prius-prime-portable-charger',
    title: 'Dual-Voltage Portable Level 1 / Level 2 EV Charger (Prius Prime)',
    searchKeywordsCA: 'portable level 2 ev charger 16a 14-50 5-15 j1772',
    searchKeywordsUS: 'portable level 2 ev charger 16a 14-50 5-15 j1772',
    compatibility: 'J1772 PHEV / EV Charging (Prius Prime & RAV4 Prime)',
  },

  // ==========================================
  // Other Catalog Items
  // ==========================================
  'j1772-charger-lock': {
    slug: 'j1772-charger-lock',
    title: 'J1772 Public EV Charging Port Combination Lock Ring',
    searchKeywordsCA: 'J1772 charger lock ring',
    searchKeywordsUS: 'J1772 charger lock ring',
  },
  'custom-fit-all-weather-floor-mats-corolla-cross': {
    slug: 'custom-fit-all-weather-floor-mats-corolla-cross',
    title: 'Custom-Fit All-Weather Floor Mats (Corolla Cross 2022-2025)',
    searchKeywordsCA: 'Toyota Corolla Cross 2022-2025 all weather floor mats liners',
    searchKeywordsUS: 'Toyota Corolla Cross 2022-2025 all weather floor mats liners',
  },
  'corolla-cross-all-weather-liners': {
    slug: 'corolla-cross-all-weather-liners',
    title: 'Custom-Fit All-Weather Floor Mats (Corolla Cross 2022-2025)',
    searchKeywordsCA: 'Toyota Corolla Cross 2022-2025 all weather floor mats liners',
    searchKeywordsUS: 'Toyota Corolla Cross 2022-2025 all weather floor mats liners',
  },
  'magnetic-door-anchor-windshield-frost-guard': {
    slug: 'magnetic-door-anchor-windshield-frost-guard',
    title: 'Magnetic Door-Anchor Windshield Frost Guard',
    searchKeywordsCA: 'windshield snow frost cover magnetic door anchor',
    searchKeywordsUS: 'windshield snow frost cover magnetic door anchor',
  },
  'windshield-frost-guard': {
    slug: 'windshield-frost-guard',
    title: 'Magnetic Door-Anchor Windshield Frost Guard',
    searchKeywordsCA: 'windshield snow frost cover magnetic door anchor',
    searchKeywordsUS: 'windshield snow frost cover magnetic door anchor',
  },
  'fitcamx-corolla': {
    slug: 'fitcamx-corolla',
    title: 'FitcamX OEM Integrated 4K Mirror Dashcam (Corolla E210)',
    searchKeywordsCA: 'fitcamx 4k dash cam toyota corolla 2020-2026',
    searchKeywordsUS: 'fitcamx 4k dash cam toyota corolla 2020-2026',
    compatibility: 'Corolla E210 Sedan & Hatch TSS 2.0 / 3.0 (2020–2026)',
    whyBuy: 'Seamless mirror tap installation drawing power directly from factory rearview mirror harness with zero dangling cables.',
  },
  'fitcamx-corolla-cross': {
    slug: 'fitcamx-corolla-cross',
    title: 'FitcamX OEM Integrated 4K Mirror Dashcam (Corolla Cross)',
    searchKeywordsCA: 'fitcamx 4k dash cam toyota corolla cross',
    searchKeywordsUS: 'fitcamx 4k dash cam toyota corolla cross',
    compatibility: 'Corolla Cross TSS 3.0 Mirror Shroud (2022–2026)',
    whyBuy: 'Discrete factory appearance with 4K recording for Canadian road salt, commute, and parking lot protection.',
  },
  'corolla-all-weather-liners': {
    slug: 'corolla-all-weather-liners',
    title: 'TuxMat / WeatherTech Custom All-Weather Floor Liners (Corolla E210)',
    searchKeywordsCA: 'Toyota Corolla 2020-2026 all weather floor mats liners',
    searchKeywordsUS: 'Toyota Corolla 2020-2026 all weather floor mats liners',
    compatibility: 'Corolla Sedan & Hatchback (2020–2026)',
    whyBuy: 'Laser-scanned high-wall bucket coverage containing melted winter snow and slush.',
  },
  'corolla-cross-cargo-liner': {
    slug: 'corolla-cross-cargo-liner',
    title: 'Corolla Cross All-Weather Cargo Trunk Liner (FWD / AWD)',
    searchKeywordsCA: 'Toyota Corolla Cross cargo trunk liner mat',
    searchKeywordsUS: 'Toyota Corolla Cross cargo trunk liner mat',
    compatibility: 'Corolla Cross FWD & AWD (2022–2026)',
    whyBuy: 'Heavy-duty non-slip cargo protection engineered for both AWD raised spare floor and flat FWD deck.',
  },
  'wireless-carplay-adapter-corolla': {
    slug: 'wireless-carplay-adapter-corolla',
    title: 'Wireless CarPlay & Android Auto Adapter (Toyota Audio Multimedia)',
    searchKeywordsCA: 'wireless carplay adapter toyota corolla',
    searchKeywordsUS: 'wireless carplay adapter toyota corolla',
    compatibility: 'Toyota Audio Multimedia 8-inch & 10.5-inch systems',
    whyBuy: 'Instant auto-connecting wireless smartphone mirroring eliminating daily cable clutter.',
  },
  'corolla-console-organizer': {
    slug: 'corolla-console-organizer',
    title: 'Center Console Armrest Organizer Insert Tray (Corolla E210)',
    searchKeywordsCA: 'toyota corolla 2020-2026 center console organizer tray',
    searchKeywordsUS: 'toyota corolla 2020-2026 center console organizer tray',
    compatibility: 'Corolla E210 Sedan & Hatch (2020–2026)',
    whyBuy: 'Converts deep bottomless center console into organized upper and lower compartments with anti-rattle rubber mats.',
  },
  'corolla-cross-console-organizer': {
    slug: 'corolla-cross-console-organizer',
    title: 'Center Console Storage Divider Tray (Corolla Cross)',
    searchKeywordsCA: 'toyota corolla cross center console organizer tray',
    searchKeywordsUS: 'toyota corolla cross center console organizer tray',
    compatibility: 'Corolla Cross (2022–2026)',
    whyBuy: 'Drop-in dual-tier storage organizer for sunglasses, coins, and keys.',
  },
  'corolla-screen-protector': {
    slug: 'corolla-screen-protector',
    title: 'Anti-Glare 9H Tempered Glass Screen Protector (8-inch & 10.5-inch)',
    searchKeywordsCA: 'toyota corolla screen protector tempered glass 8-inch 10.5-inch',
    searchKeywordsUS: 'toyota corolla screen protector tempered glass 8-inch 10.5-inch',
    compatibility: 'Corolla & Corolla Cross 8" and 10.5" Touchscreens',
    whyBuy: 'Scratch-resistant 9H glass with oleophobic coating that repels fingerprints and cuts daytime glare.',
  },
  'corolla-custom-sunshade': {
    slug: 'corolla-custom-sunshade',
    title: 'Custom-Fit Reflective Windshield Sunshade (Corolla & Cross)',
    searchKeywordsCA: 'toyota corolla custom fit windshield sunshade',
    searchKeywordsUS: 'toyota corolla custom fit windshield sunshade',
    compatibility: 'Corolla E210 & Corolla Cross',
    whyBuy: 'Reflective silver barrier that drops cabin temperatures and shields electronic screens from UV fading.',
  },
  'corolla-window-visors': {
    slug: 'corolla-window-visors',
    title: 'OEM-Style Window Visors & Rain Guards (Corolla Sedan & Hatch)',
    searchKeywordsCA: 'toyota corolla window visors rain guards deflectors',
    searchKeywordsUS: 'toyota corolla window visors rain guards deflectors',
    compatibility: 'Corolla Sedan & Hatchback (2020–2026)',
    whyBuy: 'Allows cracking windows in rain or snow without water intrusion to reduce cabin humidity.',
  },
  'corolla-sedan-mud-flaps': {
    slug: 'corolla-sedan-mud-flaps',
    title: 'Molded Splash Guards & Mud Flap Kit (Corolla Sedan & Hatch)',
    searchKeywordsCA: 'toyota corolla sedan mud flaps splash guards',
    searchKeywordsUS: 'toyota corolla sedan mud flaps splash guards',
    compatibility: 'Corolla Sedan & Hatchback (2020–2026)',
    whyBuy: 'Protects rocker panels and door sills from winter road salt, sand, and flying gravel.',
  },
  'corolla-cross-mud-flaps': {
    slug: 'corolla-cross-mud-flaps',
    title: 'Molded Splash Guards & Mud Flap Kit (Corolla Cross)',
    searchKeywordsCA: 'toyota corolla cross mud flaps splash guards',
    searchKeywordsUS: 'toyota corolla cross mud flaps splash guards',
    compatibility: 'Corolla Cross (2022–2026)',
    whyBuy: 'Contoured mud flaps shielding rocker cladding and lower painted doors from gravel blast.',
  },
};

/**
 * Retrieves catalog configuration for a product slug, dynamically injecting
 * the active vehicle model into shared accessories when provided.
 */
export function getGearMarketConfig(
  slugOrId: string,
  activeModel?: string
): GearMarketConfig | undefined {
  if (!slugOrId) return undefined;
  const config =
    GEAR_MARKET_CATALOG[slugOrId] ||
    GEAR_MARKET_CATALOG[slugOrId.replace(/^prod-/, '')];

  if (!config) return undefined;

  // Dynamically adapt multi-vehicle cards to the active vehicle context
  if (activeModel && activeModel !== 'all') {
    const cleanModel = activeModel.toLowerCase().trim();

    if (config.slug === '3-row-all-weather-liners') {
      if (cleanModel === 'sienna') {
        return {
          ...config,
          searchKeywordsCA: 'Toyota Sienna 2021-2025 all weather floor mats liners 7 8 passenger',
          searchKeywordsUS: 'Toyota Sienna 2021-2025 all weather floor mats liners 7 8 passenger',
        };
      }
      if (cleanModel === 'grand-highlander') {
        return {
          ...config,
          searchKeywordsCA: 'Toyota Grand Highlander 2024-2025 all weather floor mats liners',
          searchKeywordsUS: 'Toyota Grand Highlander 2024-2025 all weather floor mats liners',
        };
      }
    }

    return {
      ...config,
      searchKeywordsCA: injectActiveModelIntoQuery(config.searchKeywordsCA, activeModel, config.slug),
      searchKeywordsUS: injectActiveModelIntoQuery(config.searchKeywordsUS, activeModel, config.slug),
    };
  }

  return config;
}

export default GEAR_MARKET_CATALOG;
