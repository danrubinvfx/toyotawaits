/**
 * Comprehensive Gear Data Catalog & Market-Specific Affiliate Mapping
 * Ensures 100% reliable Amazon links across CA (Amazon.ca) and US (Amazon.com)
 * with verified ASINs and high-converting search fallbacks.
 */

import { injectActiveModelIntoQuery } from '@/lib/gear/affiliate';

export interface GearMarketConfig {
  slug: string;
  title: string;
  asin?: string;
  asin_ca?: string;
  asin_us?: string;
  searchQuery?: string;
  searchKeywordsCA: string;
  searchKeywordsUS: string;
  category?: string;
  compatibility?: string;
  whyBuy?: string;
  badge?: string;
  isDeliveryDayEssential?: boolean;
}

export const GEAR_MARKET_CATALOG: Record<string, GearMarketConfig> = {
  'rfid-faraday-key-fob-pouch': {
    slug: 'rfid-faraday-key-fob-pouch',
    title: 'Heavy-Duty RFID Faraday Key Fob Signal Blocker (2-Pack)',
    asin: 'B08CZ8PNF3',
    asin_ca: 'B08CZ8PNF3',
    asin_us: 'B08CZ8PNF3',
    searchQuery: 'faraday bag key fob protector RFID signal blocker car theft',
    searchKeywordsCA: 'faraday bag key fob protector RFID signal blocker car theft',
    searchKeywordsUS: 'faraday bag key fob protector RFID signal blocker car theft',
    category: 'Tech & Security',
    compatibility: 'Universal Toyota Smart Key',
    whyBuy: 'Dual-layer shielding Faraday pouch that blocks RF relay theft and clone attacks on your Toyota Smart Key.',
    badge: 'Delivery Day 1',
    isDeliveryDayEssential: true,
  },
  'fast-usbc-pd-car-charger': {
    slug: 'fast-usbc-pd-car-charger',
    title: 'Dual-Port 65W Fast USB-C PD Metal Car Charger',
    asin: 'B08HYQLV18',
    asin_ca: 'B08HYQLV18',
    asin_us: 'B08HYQLV18',
    searchQuery: '65W fast USB-C PD car charger metal compact dual port',
    searchKeywordsCA: '65W fast USB-C PD car charger metal compact dual port',
    searchKeywordsUS: '65W fast USB-C PD car charger metal compact dual port',
    category: 'Tech & Security',
    compatibility: 'Universal 12V Socket',
    whyBuy: 'High-speed compact metal 12V adapter with 65W Power Delivery to fast-charge devices simultaneously.',
    badge: 'Delivery Day 1',
    isDeliveryDayEssential: true,
  },

  // ==========================================
  // Dashcams / FitcamX (Fit-Sensitive Generation Bounds)
  // ==========================================
  'fitcamx-rav4': {
    slug: 'fitcamx-rav4',
    title: 'FitcamX OEM Integrated 4K Mirror Dashcam (RAV4 2019-2026)',
    asin: 'B08XLP89V8',
    asin_ca: 'B08XLP89V8',
    asin_us: 'B08XLP89V8',
    searchQuery: 'Fitcamx dash cam RAV4 2019-2026',
    searchKeywordsCA: 'Fitcamx dash cam RAV4 2019-2026',
    searchKeywordsUS: 'Fitcamx dash cam RAV4 2019-2026',
    category: 'Tech & Security',
    compatibility: 'RAV4 Gen 5 TSS 2.0 / 2.5 Shroud (2019-2026)',
    whyBuy: 'Discrete OEM look tapping into rearview mirror power with zero dangling cables. Verified for Gen 5 (2019-2026).',
    badge: 'Direct Fit',
      isDeliveryDayEssential: true,
  },
  'fitcamx-sienna': {
    slug: 'fitcamx-sienna',
    title: 'FitcamX OEM Integrated 4K Mirror Dashcam (Sienna 2021-2026)',
    asin: 'B09GFNZK3C',
    asin_ca: 'B09GFNZK3C',
    asin_us: 'B09GFNZK3C',
    searchQuery: 'fitcamx 4k dash cam sienna 2021-2026',
    searchKeywordsCA: 'fitcamx 4k dash cam sienna 2021-2026',
    searchKeywordsUS: 'fitcamx 4k dash cam sienna 2021-2026',
    category: 'Tech & Security',
    compatibility: 'Sienna Gen 4 TSS 2.0 / 2.5 Shroud (2021-2026)',
    whyBuy: 'Seamless mirror tap installation protecting family trips without cluttering windshield glass.',
    badge: 'Direct Fit',
      isDeliveryDayEssential: true,
  },
  'fitcamx-grand-highlander': {
    slug: 'fitcamx-grand-highlander',
    title: 'FitcamX OEM Integrated 4K Mirror Dashcam (Grand Highlander 2024-2026)',
    asin: 'B0CK5M3N7V',
    asin_ca: 'B0CK5M3N7V',
    asin_us: 'B0CK5M3N7V',
    searchQuery: 'fitcamx 4k dash cam grand highlander 2024-2026',
    searchKeywordsCA: 'fitcamx 4k dash cam grand highlander 2024-2026',
    searchKeywordsUS: 'fitcamx 4k dash cam grand highlander 2024-2026',
    category: 'Tech & Security',
    compatibility: 'Grand Highlander Gen 1 TSS 3.0 Shroud (2024-2026)',
    whyBuy: 'Custom molded mirror housing integrating 4K recording under the digital/standard mirror bracket.',
    badge: 'Direct Fit',
      isDeliveryDayEssential: true,
  },
  'fitcamx-land-cruiser': {
    slug: 'fitcamx-land-cruiser',
    title: 'FitcamX OEM Integrated 4K Mirror Dashcam (Land Cruiser 250 2024-2025)',
    searchKeywordsCA: 'fitcamx 4k dash cam land cruiser 2024-2025',
    searchKeywordsUS: 'fitcamx 4k dash cam land cruiser 2024-2025',
    compatibility: 'Land Cruiser 250-Series TSS 3.0 Mirror Cover (2024-2025)',
    whyBuy: 'Rugged plug-and-play harness designed for the 250-Series off-road cockpit.',
      isDeliveryDayEssential: true,
  },
  'fitcamx-prius': {
    slug: 'fitcamx-prius',
    title: 'FitcamX OEM Integrated 4K Dashcam (Gen 5 Prius 2023-2025)',
    searchKeywordsCA: 'fitcamx 4k dash cam prius 2023-2025',
    searchKeywordsUS: 'fitcamx 4k dash cam prius 2023-2025',
    compatibility: 'Gen 5 Prius & Prius Prime TSS 3.0 (2023-2025)',
    whyBuy: 'Factory-integrated mirror replacement for sleek Gen 5 Prius windshield aerodynamics.',
      isDeliveryDayEssential: true,
  },

  // ==========================================
  // Screen Protectors (Separated & Model-Specific)
  // ==========================================
  'screen-protector-grand-highlander': {
    slug: 'screen-protector-grand-highlander',
    title: '12.3-inch Anti-Glare Tempered Glass Screen Protector (Grand Highlander 2024-2026)',
    asin: 'B0CJJX5B57',
    asin_ca: 'B0CJJX5B57',
    asin_us: 'B0CJJX5B57',
    searchQuery: 'Grand Highlander 2024 2025 2026 12.3-inch screen protector tempered glass',
    searchKeywordsCA: 'Grand Highlander 2024 2025 2026 12.3-inch screen protector tempered glass',
    searchKeywordsUS: 'Grand Highlander 2024 2025 2026 12.3-inch screen protector tempered glass',
    category: 'Display Care',
    compatibility: '12.3-inch Grand Highlander Touchscreen (2024-2026)',
    whyBuy: 'Prevents fingerprint oil buildup and eliminates harsh reflections across wide cabin glass.',
    badge: 'Direct Fit',
      isDeliveryDayEssential: true,
  },
  'screen-protector-rav4': {
    slug: 'screen-protector-rav4',
    title: 'Spigen Tempered Glass Screen Protector (RAV4 10.5" / 12.3")',
    asin: 'B0B94Z7T98',
    asin_ca: 'B0B94Z7T98',
    asin_us: 'B0B94Z7T98',
    searchQuery: 'Spigen screen protector Toyota RAV4 10.5 12.3',
    searchKeywordsCA: 'Spigen screen protector Toyota RAV4 10.5 12.3',
    searchKeywordsUS: 'Spigen screen protector Toyota RAV4 10.5 12.3',
    category: 'Display Care',
    compatibility: 'Toyota RAV4 10.5-inch & 12.3-inch Multimedia Displays (2019-2026)',
    whyBuy: 'Spigen GlasTR EZ FIT 9H tempered glass repels fingerprint smudges and cuts daytime glare.',
    badge: 'Direct Fit',
      isDeliveryDayEssential: true,
  },
  'screen-protector-corolla-cross': {
    slug: 'screen-protector-corolla-cross',
    title: 'Anti-Glare 8-inch Tempered Glass (Corolla Cross 2022-2025)',
    searchKeywordsCA: 'Toyota Corolla Cross 2022-2025 screen protector 8 inch tempered glass',
    searchKeywordsUS: 'Toyota Corolla Cross 2022-2025 screen protector 8 inch tempered glass',
    compatibility: '8.0-inch Corolla Cross Touchscreen (2022-2025)',
    whyBuy: 'Precision cut for Corolla Cross 8-inch display bezels; avoids edge lifting.',
      isDeliveryDayEssential: true,
  },
  'screen-protector-sienna': {
    slug: 'screen-protector-sienna',
    title: 'Matte Anti-Glare Screen Protector (Toyota Sienna 2021-2025)',
    searchKeywordsCA: 'toyota sienna 2021-2025 screen protector tempered glass',
    searchKeywordsUS: 'toyota sienna 2021-2025 screen protector tempered glass',
    compatibility: '9-inch & 12.3-inch Sienna Infotainment (2021-2025)',
    whyBuy: 'Cuts blinding glare from panoramic glass and protects against finger smudges.',
      isDeliveryDayEssential: true,
  },
  'screen-protector-land-cruiser': {
    slug: 'screen-protector-land-cruiser',
    title: 'Armor-Grade Multimedia Screen Shield (Land Cruiser 250 2024-2025)',
    searchKeywordsCA: 'land cruiser 250 2024-2025 screen protector 12.3 inch tempered glass',
    searchKeywordsUS: 'land cruiser 250 2024-2025 screen protector 12.3 inch tempered glass',
    compatibility: '12.3-inch Touchscreen (2024-2025 Land Cruiser 1958 & First Edition)',
      isDeliveryDayEssential: true,
  },
  'prius-screen-protector': {
    slug: 'prius-screen-protector',
    title: 'Matte Anti-Glare Tempered Glass Screen Protector (Prius 2023-2025)',
    searchKeywordsCA: 'toyota prius 2023-2025 screen protector 12.3 inch tempered glass',
    searchKeywordsUS: 'toyota prius 2023-2025 screen protector 12.3 inch tempered glass',
    compatibility: '8-inch & 12.3-inch Gen 5 Displays (2023-2025)',
      isDeliveryDayEssential: true,
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
      isDeliveryDayEssential: true,
  },
  'console-tray-sienna': {
    slug: 'console-tray-sienna',
    title: 'Center Console Drop-In Divider Tray (Sienna 2021-2026)',
    asin: 'B094R8H7TG',
    asin_ca: 'B094R8H7TG',
    asin_us: 'B094R8H7TG',
    searchQuery: 'Sienna center console organizer tray 2021-2026',
    searchKeywordsCA: 'Sienna center console organizer tray 2021-2026',
    searchKeywordsUS: 'Sienna center console organizer tray 2021-2026',
    category: 'Interior Organization',
    compatibility: 'Sienna Gen 4 LE, XLE, XSE, Limited, Platinum (2021-2026)',
    whyBuy: 'Tames the deep center bridge cubby and upper armrest cavity with non-slip rubber inserts.',
    badge: 'Direct Fit',
      isDeliveryDayEssential: true,
  },
  'console-tray-grand-highlander': {
    slug: 'console-tray-grand-highlander',
    title: 'Precision Armrest Divider & Upper Storage Tray (Grand Highlander 2024-2026)',
    asin: 'B0CC9H5S4W',
    asin_ca: 'B0CC9H5S4W',
    asin_us: 'B0CC9H5S4W',
    searchQuery: 'grand highlander 2024-2026 center console organizer tray',
    searchKeywordsCA: 'grand highlander 2024-2026 center console organizer tray',
    searchKeywordsUS: 'grand highlander 2024-2026 center console organizer tray',
    category: 'Interior Organization',
    compatibility: 'Grand Highlander XLE, Limited, Platinum (2024-2026)',
    whyBuy: 'Adds modular organization for keys, wallets, and pens above the oversized bottom bin.',
    badge: 'Direct Fit',
      isDeliveryDayEssential: true,
  },
  'console-tray-land-cruiser': {
    slug: 'console-tray-land-cruiser',
    title: 'Heavy-Duty Armrest Storage Organizer (Land Cruiser 250 2024-2025)',
    searchKeywordsCA: 'land cruiser 2024-2025 center console organizer tray',
    searchKeywordsUS: 'land cruiser 2024-2025 center console organizer tray',
    compatibility: 'Land Cruiser 250-Series with/without Cool Box (2024-2025)',
      isDeliveryDayEssential: true,
  },
  'prius-console-organizer': {
    slug: 'prius-console-organizer',
    title: 'Center Console 2-Tier Organizer Tray (Prius 2023-2025)',
    searchKeywordsCA: 'gen 5 prius 2023-2025 center console organizer tray',
    searchKeywordsUS: 'gen 5 prius 2023-2025 center console organizer tray',
    compatibility: 'Gen 5 Prius & Prius Prime (2023-2025)',
      isDeliveryDayEssential: true,
  },

  // ==========================================
  // Floor Mats (Separated Sienna & Grand Highlander)
  // ==========================================
  'high-wall-floor-liners-rav4': {
    slug: 'high-wall-floor-liners-rav4',
    title: 'TuxMat Custom All-Weather Floor Liners (RAV4 2019-2026)',
    asin: 'B0833DT93B',
    asin_ca: 'B0833DT93B',
    asin_us: 'B0833DT93B',
    searchQuery: 'TuxMat Toyota RAV4 2019-2026',
    searchKeywordsCA: 'TuxMat Toyota RAV4 2019-2026',
    searchKeywordsUS: 'TuxMat Toyota RAV4 2019-2026',
    category: 'Floor Protection',
    compatibility: 'RAV4 Gen 5 Hybrid & Prime (2019-2026)',
    whyBuy: 'Maximum high-wall laser-measured coverage containing snow, salt, mud, and water spills.',
    badge: 'Direct Fit',
      isDeliveryDayEssential: true,
  },
  'sienna-all-weather-liners': {
    slug: 'sienna-all-weather-liners',
    title: '3-Row All-Weather High-Wall TPE Floor Mats (Sienna 2021-2026)',
    asin: 'B0CFV5R8QM',
    asin_ca: 'B0CFV5R8QM',
    asin_us: 'B0CFV5R8QM',
    searchQuery: 'Toyota Sienna all weather floor mats 2021-2026',
    searchKeywordsCA: 'Toyota Sienna all weather floor mats 2021-2026',
    searchKeywordsUS: 'Toyota Sienna all weather floor mats 2021-2026',
    category: 'Protection',
    compatibility: 'Toyota Sienna 7-Passenger & 8-Passenger (2021-2026)',
    whyBuy: 'Maximized spill containment along sliding Super Long Slide tracks and cargo trunk well.',
    badge: 'Direct Fit',
      isDeliveryDayEssential: true,
  },
  'grand-highlander-all-weather-liners': {
    slug: 'grand-highlander-all-weather-liners',
    title: 'Custom-Fit All-Weather 3-Row Floor Liners (Grand Highlander 2024-2026)',
    asin: 'B0B59M1W3K',
    asin_ca: 'B0B59M1W3K',
    asin_us: 'B0B59M1W3K',
    searchQuery: 'Toyota Grand Highlander 2024-2026 all weather floor mats liners',
    searchKeywordsCA: 'Toyota Grand Highlander 2024-2026 all weather floor mats liners',
    searchKeywordsUS: 'Toyota Grand Highlander 2024-2026 all weather floor mats liners',
    category: 'Protection',
    compatibility: 'Toyota Grand Highlander Captain & Bench (2024-2026)',
    whyBuy: 'Precision laser-scanned edge protection covering all 3 passenger rows and cargo area.',
    badge: 'Direct Fit',
      isDeliveryDayEssential: true,
  },
  '3-row-all-weather-liners': {
    slug: '3-row-all-weather-liners',
    title: '3-Row Heavy Duty All-Weather Floor Liners',
    searchQuery: 'Toyota Sienna all weather floor mats 2021-2026',
    searchKeywordsCA: 'Toyota Sienna all weather floor mats 2021-2026',
    searchKeywordsUS: 'Toyota Sienna all weather floor mats 2021-2026',
    category: 'Protection',
    compatibility: '3-Row Toyota Family Vehicles (Sienna & Grand Highlander)',
    badge: 'Direct Fit',
      isDeliveryDayEssential: true,
  },
  'prius-all-weather-liners': {
    slug: 'prius-all-weather-liners',
    title: 'Custom-Fit All-Weather 3D TPE Floor Liners & Trunk Mat (Prius 2023-2025)',
    searchKeywordsCA: 'toyota prius 2023-2025 all weather floor mats cargo liner',
    searchKeywordsUS: 'toyota prius 2023-2025 all weather floor mats cargo liner',
    compatibility: 'Prius & Prius Prime Gen 5 (2023-2025)',
      isDeliveryDayEssential: true,
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
  // Prius Guide Catalog Items (Standardized toyotawaits-20 on CA)
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
      isDeliveryDayEssential: true,
  },
  'corolla-cross-all-weather-liners': {
    slug: 'corolla-cross-all-weather-liners',
    title: 'Custom-Fit All-Weather Floor Mats (Corolla Cross 2022-2025)',
    searchKeywordsCA: 'Toyota Corolla Cross 2022-2025 all weather floor mats liners',
    searchKeywordsUS: 'Toyota Corolla Cross 2022-2025 all weather floor mats liners',
      isDeliveryDayEssential: true,
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
      isDeliveryDayEssential: true,
  },
  'fitcamx-corolla-cross': {
    slug: 'fitcamx-corolla-cross',
    title: 'FitcamX OEM Integrated 4K Mirror Dashcam (Corolla Cross)',
    searchKeywordsCA: 'fitcamx 4k dash cam toyota corolla cross',
    searchKeywordsUS: 'fitcamx 4k dash cam toyota corolla cross',
    compatibility: 'Corolla Cross TSS 3.0 Mirror Shroud (2022–2026)',
    whyBuy: 'Discrete factory appearance with 4K recording for Canadian road salt, commute, and parking lot protection.',
      isDeliveryDayEssential: true,
  },
  'corolla-all-weather-liners': {
    slug: 'corolla-all-weather-liners',
    title: 'TuxMat / WeatherTech Custom All-Weather Floor Liners (Corolla E210)',
    searchKeywordsCA: 'Toyota Corolla 2020-2026 all weather floor mats liners',
    searchKeywordsUS: 'Toyota Corolla 2020-2026 all weather floor mats liners',
    compatibility: 'Corolla Sedan & Hatchback (2020–2026)',
    whyBuy: 'Laser-scanned high-wall bucket coverage containing melted winter snow and slush.',
      isDeliveryDayEssential: true,
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
      isDeliveryDayEssential: true,
  },
  'corolla-cross-console-organizer': {
    slug: 'corolla-cross-console-organizer',
    title: 'Center Console Storage Divider Tray (Corolla Cross)',
    searchKeywordsCA: 'toyota corolla cross center console organizer tray',
    searchKeywordsUS: 'toyota corolla cross center console organizer tray',
    compatibility: 'Corolla Cross (2022–2026)',
    whyBuy: 'Drop-in dual-tier storage organizer for sunglasses, coins, and keys.',
      isDeliveryDayEssential: true,
  },
  'corolla-screen-protector': {
    slug: 'corolla-screen-protector',
    title: 'Anti-Glare 9H Tempered Glass Screen Protector (8-inch & 10.5-inch)',
    searchKeywordsCA: 'toyota corolla screen protector tempered glass 8-inch 10.5-inch',
    searchKeywordsUS: 'toyota corolla screen protector tempered glass 8-inch 10.5-inch',
    compatibility: 'Corolla & Corolla Cross 8" and 10.5" Touchscreens',
    whyBuy: 'Scratch-resistant 9H glass with oleophobic coating that repels fingerprints and cuts daytime glare.',
      isDeliveryDayEssential: true,
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

  // ==========================================
  // RAV4 Stealth "OEM+" Audio Package
  // ==========================================
  'beat-sonic-ena-3t3': {
    slug: 'beat-sonic-ena-3t3',
    title: 'Beat-Sonic ENA-3T3 Micro Power Amplifier Kit (RAV4 Non-JBL)',
    searchKeywordsCA: 'Beat-Sonic ENA-3T3 micro power amplifier Toyota',
    searchKeywordsUS: 'Beat-Sonic ENA-3T3 micro power amplifier Toyota',
    compatibility: '2019–2026 Toyota RAV4 (Non-JBL 8" and 10.5" Multimedia Screens)',
    whyBuy: 'Plug-and-play inline T-harness micro-amp boosting power without cutting wires or triggering hybrid battery drain codes. Dedicated RCA subwoofer pre-out.',
    badge: 'Recommended',
  },
  'alpine-pwe-s800': {
    slug: 'alpine-pwe-s800',
    title: 'Alpine PWE-S800 8" Compact Powered Subwoofer (Under-Seat)',
    searchKeywordsCA: 'Alpine PWE-S8 compact powered subwoofer',
    searchKeywordsUS: 'Alpine PWE-S8 compact powered subwoofer',
    compatibility: 'Universal under-seat fitment (compatible with RAV4 hybrid battery clearances)',
    whyBuy: '240W peak / 120W RMS shallow cast-aluminum sub fitting flat under front passenger seat. Preserves 100% trunk space.',
    badge: 'Recommended',
  },
  'alpine-pwe-s8': {
    slug: 'alpine-pwe-s8',
    title: 'Alpine PWE-S8 8" Compact Powered Subwoofer (Under-Seat)',
    searchKeywordsCA: 'Alpine PWE-S8 compact powered subwoofer',
    searchKeywordsUS: 'Alpine PWE-S8 compact powered subwoofer',
    compatibility: 'Universal under-seat fitment (compatible with RAV4 hybrid battery clearances)',
    whyBuy: '120W RMS shallow cast-aluminum sub fitting flat under front passenger seat.',
    badge: 'Recommended',
  },
  'dash-speakers-rav4': {
    slug: 'dash-speakers-rav4',
    title: 'Cerwin-Vega V3 3.5" / Kicker KSC350 Coaxial Dash Speakers',
    searchKeywordsCA: 'Kicker KSC350 3.5 coaxial speakers',
    searchKeywordsUS: 'Kicker KSC350 3.5 coaxial speakers',
    compatibility: '2019–2026 Toyota RAV4 Left & Right Dash Corners',
    whyBuy: 'Drop-in 3.5" coaxial upgrade replacing factory paper cones. Brings vocals up to ear level in 15 minutes.',
    badge: 'Recommended',
  },
  'metra-72-8110-harness': {
    slug: 'metra-72-8110-harness',
    title: 'Metra 72-8110 Toyota Speaker Harness Adapters (Pair)',
    searchKeywordsCA: 'Metra 72-8110 Toyota speaker harness',
    searchKeywordsUS: 'Metra 72-8110 Toyota speaker harness',
    compatibility: 'Toyota Dash Speaker Plugs',
    whyBuy: 'Plug-and-play adapter harness for clean, solder-free dash speaker installation.',
  },
  'kicker-cs-door-speakers-rav4': {
    slug: 'kicker-cs-door-speakers-rav4',
    title: 'Kicker CS Series 6.5" Door Speakers (Front & Rear Upgrade)',
    searchKeywordsCA: 'Kicker CS Series 6.5 inch speakers CSC65',
    searchKeywordsUS: 'Kicker CS Series 6.5 inch speakers CSC65',
    compatibility: '2019–2026 Toyota RAV4 Front & Rear Doors',
    whyBuy: 'Replaces weak factory paper cones with punchy mid-bass coaxial drivers.',
    badge: 'Recommended',
  },
  'metra-82-8148-brackets': {
    slug: 'metra-82-8148-brackets',
    title: 'Metra 82-8148 6.5" Toyota Door Speaker Mounting Brackets',
    searchKeywordsCA: 'Metra 82-8148 speaker mounting brackets Toyota',
    searchKeywordsUS: 'Metra 82-8148 speaker mounting brackets Toyota',
    compatibility: 'Toyota Front & Rear Door Speaker Cutouts',
    whyBuy: 'Precision bracket matching factory door rivet holes and sealing moisture barrier.',
  },
  'metra-72-8104-harness': {
    slug: 'metra-72-8104-harness',
    title: 'Metra 72-8104 Toyota Door Speaker Harness Leads (Pair)',
    searchKeywordsCA: 'Metra 72-8104 speaker wiring harness Toyota',
    searchKeywordsUS: 'Metra 72-8104 speaker wiring harness Toyota',
    compatibility: 'Toyota Door Speaker Harness Connectors',
    whyBuy: 'Solderless plug-and-play leads clicking into factory door speaker wiring.',
  },

  // ==========================================
  // Sequoia (3rd Gen XK80 2023-2026) Catalog Items
  // ==========================================
  'sequoia-all-weather-liners': {
    slug: 'sequoia-all-weather-liners',
    title: 'TuxMat / Husky 3-Row Custom All-Weather Floor Liners (Sequoia)',
    searchKeywordsCA: 'toyota sequoia 2023-2026 all weather floor mats liners 3 row',
    searchKeywordsUS: 'toyota sequoia 2023-2026 all weather floor mats liners 3 row',
    compatibility: '2023–2026 Toyota Sequoia (7- & 8-Passenger i-FORCE MAX)',
      isDeliveryDayEssential: true,
  },
  'sequoia-cargo-liner': {
    slug: 'sequoia-cargo-liner',
    title: 'Canvasback / OEM Split 3rd-Row Rear Cargo Liner & Shelf Mat (Sequoia)',
    searchKeywordsCA: 'toyota sequoia 2023-2026 cargo liner trunk mat hybrid battery',
    searchKeywordsUS: 'toyota sequoia 2023-2026 cargo liner trunk mat hybrid battery',
    compatibility: '2023–2026 Toyota Sequoia (Sliding 3rd-Row Cargo System)',
  },
  'sequoia-console-organizer': {
    slug: 'sequoia-console-organizer',
    title: 'Center Console Organizer Tray & Hidden Armrest Safe Box (Sequoia)',
    searchKeywordsCA: 'toyota sequoia tundra center console organizer tray armrest',
    searchKeywordsUS: 'toyota sequoia tundra center console organizer tray armrest',
    compatibility: '2023–2026 Toyota Sequoia & 2022–2026 Tundra',
      isDeliveryDayEssential: true,
  },
  'sequoia-screen-protector': {
    slug: 'sequoia-screen-protector',
    title: 'Tempered Glass Screen Protector for 14-inch Toyota Audio Multimedia (Sequoia)',
    searchKeywordsCA: 'toyota sequoia 14 inch screen protector tempered glass',
    searchKeywordsUS: 'toyota sequoia 14 inch screen protector tempered glass',
    compatibility: '2023–2026 Toyota Sequoia (14" Touchscreen)',
      isDeliveryDayEssential: true,
  },
  'sequoia-running-boards': {
    slug: 'sequoia-running-boards',
    title: 'Heavy-Duty Aluminum / Power Running Boards (Sequoia)',
    searchKeywordsCA: 'toyota sequoia 2023-2026 running boards side steps',
    searchKeywordsUS: 'toyota sequoia 2023-2026 running boards side steps',
    compatibility: '2023–2026 Toyota Sequoia (SR5, Limited, Platinum, TRD Pro, Capstone)',
  },
  'sequoia-trailer-brake-controller': {
    slug: 'sequoia-trailer-brake-controller',
    title: 'Curt / Redarc Tow-Pro Elite Electric Brake Controller & Harness (Sequoia)',
    searchKeywordsCA: 'toyota sequoia trailer brake controller harness curt redarc',
    searchKeywordsUS: 'toyota sequoia trailer brake controller harness curt redarc',
    compatibility: '2023–2026 Toyota Sequoia (9,000+ lb Tow Package)',
  },
  'sequoia-raptor-lights': {
    slug: 'sequoia-raptor-lights',
    title: 'Front TRD Heritage Grille Light Bar & Amber Marker Kit (Sequoia)',
    searchKeywordsCA: 'toyota sequoia 2023-2026 grille lights amber raptor led',
    searchKeywordsUS: 'toyota sequoia 2023-2026 grille lights amber raptor led',
    compatibility: '2023–2026 Toyota Sequoia (TRD Pro & Heritage Grille Conversion)',
  },
  'fitcamx-sequoia': {
    slug: 'fitcamx-sequoia',
    title: 'FitcamX OEM Integrated 4K Mirror Dashcam (Toyota Sequoia)',
    searchKeywordsCA: 'fitcamx 4k dash cam toyota sequoia 2023-2026',
    searchKeywordsUS: 'fitcamx 4k dash cam toyota sequoia 2023-2026',
    compatibility: '2023–2026 Toyota Sequoia (All Trims)',
      isDeliveryDayEssential: true,
  },
  'sequoia-leveling-kit': {
    slug: 'sequoia-leveling-kit',
    title: 'Westcott / Rough Country 3"/1" Preload Collar Leveling Lift (Sequoia)',
    searchKeywordsCA: 'toyota sequoia 2023-2026 leveling kit preload collar lift',
    searchKeywordsUS: 'toyota sequoia 2023-2026 leveling kit preload collar lift',
    compatibility: '2023–2026 Toyota Sequoia (3rd Gen XK80)',
  },
  'sequoia-rear-sway-bar': {
    slug: 'sequoia-rear-sway-bar',
    title: 'Heavy-Duty Rear Sway Bar & Towing Coils (Sequoia)',
    searchKeywordsCA: 'toyota sequoia rear sway bar heavy duty towing coil springs',
    searchKeywordsUS: 'toyota sequoia rear sway bar heavy duty towing coil springs',
    compatibility: '2023–2026 Toyota Sequoia (3rd Gen XK80)',
  },
  'sequoia-sound-deadening': {
    slug: 'sequoia-sound-deadening',
    title: 'Multi-Layer Butyl Sound Deadening (Kilmat 80 mil)',
    searchKeywordsCA: 'kilmat 80 mil car sound deadening mat butyl',
    searchKeywordsUS: 'kilmat 80 mil car sound deadening mat butyl',
    compatibility: 'Universal / 2023–2026 Toyota Sequoia',
  },
  'sequoia-cargo-drawers': {
    slug: 'sequoia-cargo-drawers',
    title: 'Rear Cargo Leveling Storage Shelf & Drawer System (Sequoia)',
    searchKeywordsCA: 'toyota sequoia rear cargo leveling drawer storage platform',
    searchKeywordsUS: 'toyota sequoia rear cargo leveling drawer storage platform',
    compatibility: '2023–2026 Toyota Sequoia (i-FORCE MAX Hybrid)',
  },

  // ==========================================
  // Corolla & Corolla Cross Mod Guide Slugs
  // ==========================================
  'corolla-strut-tower-brace': {
    slug: 'corolla-strut-tower-brace',
    title: 'Front Strut Tower Bar Brace (Corolla & Corolla Cross)',
    searchKeywordsCA: 'Toyota Corolla E210 front strut tower bar brace',
    searchKeywordsUS: 'Toyota Corolla E210 front strut tower bar brace',
    compatibility: '2020–2026 Toyota Corolla & 2022–2026 Corolla Cross',
  },
  'corolla-rear-sway-bar': {
    slug: 'corolla-rear-sway-bar',
    title: 'Upgraded Rear Sway Bar (Corolla & Corolla Cross AWD)',
    searchKeywordsCA: 'Toyota Corolla E210 2020-2026 rear sway bar upgrade',
    searchKeywordsUS: 'Toyota Corolla E210 2020-2026 rear sway bar upgrade',
    compatibility: '2020–2026 Toyota Corolla & Corolla Cross AWD',
  },
  'corolla-lowering-springs': {
    slug: 'corolla-lowering-springs',
    title: 'Performance Lowering Springs (RS-R Down / Eibach Pro-Kit)',
    searchKeywordsCA: 'RS-R Eibach lowering springs Toyota Corolla 2020-2026',
    searchKeywordsUS: 'RS-R Eibach lowering springs Toyota Corolla 2020-2026',
    compatibility: '2020–2026 Toyota Corolla & Corolla Cross',
  },
  'corolla-dash-speakers': {
    slug: 'corolla-dash-speakers',
    title: '3.5-Inch Coaxial Dash Speaker Upgrade & Toyota Harness (Corolla)',
    searchKeywordsCA: 'JBL Club 3412T Kicker KSC350 3.5 dash speakers Toyota Corolla',
    searchKeywordsUS: 'JBL Club 3412T Kicker KSC350 3.5 dash speakers Toyota Corolla',
    compatibility: '2020–2026 Toyota Corolla & 2022–2026 Corolla Cross (Non-JBL)',
  },
  'sound-deadening-mats': {
    slug: 'sound-deadening-mats',
    title: '80-Mil Butyl Sound Deadening Mats (Kilmat / Noico)',
    searchKeywordsCA: 'Kilmat 80 mil Noico car sound deadening mat butyl',
    searchKeywordsUS: 'Kilmat 80 mil Noico car sound deadening mat butyl',
    compatibility: 'Universal Automotive Acoustic Insulation',
  },
  'corolla-cold-air-intake': {
    slug: 'corolla-cold-air-intake',
    title: 'High-Flow Drop-In Air Filter & Cold Air Intake (Corolla 2.0L)',
    searchKeywordsCA: 'Toyota Corolla 2.0L M20A-FKS high flow air filter intake',
    searchKeywordsUS: 'Toyota Corolla 2.0L M20A-FKS high flow air filter intake',
    compatibility: '2020–2026 Toyota Corolla SE / XSE & Corolla Cross 2.0L',
  },
  'corolla-exhaust-system': {
    slug: 'corolla-exhaust-system',
    title: 'Stainless Steel Axle-Back / Cat-Back Exhaust (Corolla 2.0L)',
    searchKeywordsCA: 'Borla Remark axle back exhaust Toyota Corolla 2020-2026',
    searchKeywordsUS: 'Borla Remark axle back exhaust Toyota Corolla 2020-2026',
    compatibility: '2020–2026 Toyota Corolla SE / XSE & Hatchback',
  },

  // ==========================================
  // Towing & Trailer Hitches (Sienna & Multi-Model)
  // ==========================================
  'curt-13470-sienna-hitch': {
    slug: 'curt-13470-sienna-hitch',
    title: 'CURT 13470 Class 3 Trailer Hitch Receiver (Sienna 2021-2026)',
    asin: 'B09DTK5D9W',
    asin_ca: 'B09DTK5D9W',
    asin_us: 'B09DTK5D9W',
    searchQuery: 'Curt 13470 Toyota Sienna hitch',
    searchKeywordsCA: 'Curt 13470 Toyota Sienna hitch',
    searchKeywordsUS: 'Curt 13470 Toyota Sienna hitch',
    category: 'Towing & Cargo',
    compatibility: 'Toyota Sienna Gen 4 (2021-2026)',
    whyBuy: 'Direct bolt-on 2-inch receiver hitch supporting bike racks, cargo carriers, and up to 3,500 lbs towing capacity.',
    badge: 'Direct Fit',
  },
  'curt-13470': {
    slug: 'curt-13470',
    title: 'CURT 13470 Class 3 Trailer Hitch Receiver (Sienna 2021-2026)',
    asin: 'B09DTK5D9W',
    asin_ca: 'B09DTK5D9W',
    asin_us: 'B09DTK5D9W',
    searchQuery: 'Curt 13470 Toyota Sienna hitch',
    searchKeywordsCA: 'Curt 13470 Toyota Sienna hitch',
    searchKeywordsUS: 'Curt 13470 Toyota Sienna hitch',
    category: 'Towing & Cargo',
    compatibility: 'Toyota Sienna Gen 4 (2021-2026)',
    whyBuy: 'Direct bolt-on 2-inch receiver hitch supporting bike racks, cargo carriers, and up to 3,500 lbs towing capacity.',
    badge: 'Direct Fit',
  },
  'sienna-trailer-hitch': {
    slug: 'sienna-trailer-hitch',
    title: 'CURT 13470 Class 3 Trailer Hitch Receiver (Sienna 2021-2026)',
    asin: 'B09DTK5D9W',
    asin_ca: 'B09DTK5D9W',
    asin_us: 'B09DTK5D9W',
    searchQuery: 'Curt 13470 Toyota Sienna hitch',
    searchKeywordsCA: 'Curt 13470 Toyota Sienna hitch',
    searchKeywordsUS: 'Curt 13470 Toyota Sienna hitch',
    category: 'Towing & Cargo',
    compatibility: 'Toyota Sienna Gen 4 (2021-2026)',
    whyBuy: 'Direct bolt-on 2-inch receiver hitch supporting bike racks, cargo carriers, and up to 3,500 lbs towing capacity.',
    badge: 'Direct Fit',
  },

  // ==========================================
  // Toyota Tacoma (2016-2026) Accessories
  // ==========================================
  'console-tray-tacoma': {
    slug: 'console-tray-tacoma',
    title: 'Center Console Organizer Tray (Tacoma 2024-2026)',
    asin: 'B0D3XQ18W5',
    asin_ca: 'B0D3XQ18W5',
    asin_us: 'B0D3XQ18W5',
    searchQuery: 'Tacoma center console organizer tray 2024-2026',
    searchKeywordsCA: 'Tacoma center console organizer tray 2024-2026',
    searchKeywordsUS: 'Tacoma center console organizer tray 2024-2026',
    category: 'Interior Organization',
    compatibility: 'Toyota Tacoma 4th Gen (2024-2026)',
    whyBuy: 'Drop-in divider tray organizing smartphones, coins, and pens in the deep Tacoma console box.',
    badge: 'Direct Fit',
      isDeliveryDayEssential: true,
  },
  'screen-protector-tacoma': {
    slug: 'screen-protector-tacoma',
    title: '14-inch Anti-Glare Tempered Glass Screen Protector (Tacoma 2024-2026)',
    asin: 'B0CTHYB23H',
    asin_ca: 'B0CTHYB23H',
    asin_us: 'B0CTHYB23H',
    searchQuery: 'Tacoma 14-inch screen protector tempered glass 2024-2026',
    searchKeywordsCA: 'Tacoma 14-inch screen protector tempered glass 2024-2026',
    searchKeywordsUS: 'Tacoma 14-inch screen protector tempered glass 2024-2026',
    category: 'Display Care',
    compatibility: 'Toyota Tacoma 14-inch Touchscreen (2024-2026)',
    whyBuy: 'Ultra-clear 9H tempered glass with anti-fingerprint and matte glare-reducing coating.',
    badge: 'Direct Fit',
      isDeliveryDayEssential: true,
  },
  'tacoma-bed-cleats': {
    slug: 'tacoma-bed-cleats',
    title: 'Heavy-Duty Bed Rail Tie-Down Cleats (Tacoma 2016-2026)',
    asin: 'B075R5B7D7',
    asin_ca: 'B075R5B7D7',
    asin_us: 'B075R5B7D7',
    searchQuery: 'Tacoma bed rail tie down cleats PT278-35112',
    searchKeywordsCA: 'Tacoma bed rail tie down cleats PT278-35112',
    searchKeywordsUS: 'Tacoma bed rail tie down cleats PT278-35112',
    category: 'Cargo & Recovery',
    compatibility: 'Toyota Tacoma Bed Deck Rail System (2016-2026)',
    whyBuy: 'Heavy-duty slide-locking cleats providing high-tension anchor points for strapping down gear.',
    badge: 'Direct Fit',
  },
  'tacoma-recovery-tow-strap': {
    slug: 'tacoma-recovery-tow-strap',
    title: 'Heavy-Duty 3" x 30ft Recovery Tow Strap with D-Ring Shackles',
    asin: 'B07KBYQ73Y',
    asin_ca: 'B07KBYQ73Y',
    asin_us: 'B07KBYQ73Y',
    searchQuery: 'off road recovery tow strap 3 inch 30ft shackles',
    searchKeywordsCA: 'off road recovery tow strap 3 inch 30ft shackles',
    searchKeywordsUS: 'off road recovery tow strap 3 inch 30ft shackles',
    category: 'Cargo & Recovery',
    compatibility: 'Universal 4x4 Off-Road Recovery / Tacoma Receiver Points',
    whyBuy: 'Rated up to 30,000 lbs breaking strength for vehicle recovery in snow, mud, and trail conditions.',
    badge: 'Essential',
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
      if (cleanModel === 'sequoia') {
        return {
          ...config,
          searchKeywordsCA: 'Toyota Sequoia 2023-2026 all weather floor mats liners 3 row',
          searchKeywordsUS: 'Toyota Sequoia 2023-2026 all weather floor mats liners 3 row',
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
