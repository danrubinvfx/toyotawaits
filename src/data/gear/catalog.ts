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
  // Dashcams / FitcamX (Fit-Sensitive 2019-2026)
  // ==========================================
  'fitcamx-rav4': {
    slug: 'fitcamx-rav4',
    title: 'FitcamX OEM Integrated 4K Mirror Dashcam (RAV4)',
    searchKeywordsCA: 'fitcamx 4k dash cam rav4 2019-2026',
    searchKeywordsUS: 'fitcamx 4k dash cam rav4 2019-2026',
    compatibility: 'TSS 2.5 / 3.0 Mirror Cover (2019-2026)',
    whyBuy: 'Discrete OEM look tapping into rearview mirror power with zero dangling cables.',
  },
  'fitcamx-sienna': {
    slug: 'fitcamx-sienna',
    title: 'FitcamX OEM Integrated 4K Mirror Dashcam (Sienna)',
    searchKeywordsCA: 'fitcamx 4k dash cam sienna 2021-2026',
    searchKeywordsUS: 'fitcamx 4k dash cam sienna 2021-2026',
    compatibility: 'Gen 4 TSS 2.0 / 2.5 Shroud (2021-2026)',
    whyBuy: 'Seamless mirror tap installation protecting family trips without cluttering windshield glass.',
  },
  'fitcamx-grand-highlander': {
    slug: 'fitcamx-grand-highlander',
    title: 'FitcamX OEM Integrated 4K Mirror Dashcam (Grand Highlander)',
    searchKeywordsCA: 'fitcamx 4k dash cam grand highlander 2024-2026',
    searchKeywordsUS: 'fitcamx 4k dash cam grand highlander 2024-2026',
    compatibility: 'TSS 3.0 Digital / Standard Shroud (2024-2026)',
    whyBuy: 'Custom molded mirror housing integrating 4K recording under the digital mirror bracket.',
  },
  'fitcamx-land-cruiser': {
    slug: 'fitcamx-land-cruiser',
    title: 'FitcamX OEM Integrated 4K Mirror Dashcam (Land Cruiser 250)',
    searchKeywordsCA: 'fitcamx 4k dash cam land cruiser 2024-2026',
    searchKeywordsUS: 'fitcamx 4k dash cam land cruiser 2024-2026',
    compatibility: 'TSS 3.0 Mirror Cover (2024-2026 Land Cruiser / Prado)',
    whyBuy: 'Rugged plug-and-play harness designed for the 250-Series off-road cockpit.',
  },
  'fitcamx-prius': {
    slug: 'fitcamx-prius',
    title: 'FitcamX OEM Integrated 4K Dashcam (Gen 5 Prius)',
    searchKeywordsCA: 'fitcamx 4k dash cam prius 2023-2026',
    searchKeywordsUS: 'fitcamx 4k dash cam prius 2023-2026',
    compatibility: 'TSS 3.0 Gen 5 Prius & Prius Prime (2023-2026)',
    whyBuy: 'Factory-integrated mirror replacement for sleek Gen 5 Prius windshield aerodynamics.',
  },

  // ==========================================
  // Screen Protectors (Eliminate Cross-Model Bleed)
  // ==========================================
  'screen-protector-rav4': {
    slug: 'screen-protector-rav4',
    title: 'Anti-Glare 9H Tempered Glass Screen Protector (RAV4 & Corolla Cross)',
    searchKeywordsCA: 'rav4 screen protector 12.3 inch tempered glass 2019-2026',
    searchKeywordsUS: 'rav4 screen protector 12.3 inch tempered glass 2019-2026',
    compatibility: '10.5-inch / 12.3-inch Toyota Audio Multimedia Displays',
  },
  'screen-protector-sienna': {
    slug: 'screen-protector-sienna',
    title: 'Matte Anti-Glare Screen Protector (Toyota Sienna)',
    searchKeywordsCA: 'toyota sienna 2021-2026 screen protector tempered glass',
    searchKeywordsUS: 'toyota sienna 2021-2026 screen protector tempered glass',
    compatibility: '9-inch / 12.3-inch Sienna Infotainment',
  },
  'screen-protector-grand-highlander': {
    slug: 'screen-protector-grand-highlander',
    title: '12.3-inch Anti-Glare Tempered Glass (Grand Highlander)',
    searchKeywordsCA: 'Grand Highlander 2024 2025 2026 12.3-inch screen protector tempered glass',
    searchKeywordsUS: 'Grand Highlander 2024 2025 2026 12.3-inch screen protector tempered glass',
    compatibility: '12.3-inch Grand Highlander Touchscreen (2024-2026)',
    whyBuy: 'Prevents fingerprint oil buildup and eliminates harsh reflections across wide cabin glass.',
  },
  'screen-protector-land-cruiser': {
    slug: 'screen-protector-land-cruiser',
    title: 'Armor-Grade Multimedia Screen Shield (Land Cruiser 250)',
    searchKeywordsCA: 'land cruiser 250 2024-2026 screen protector 12.3 inch tempered glass',
    searchKeywordsUS: 'land cruiser 250 2024-2026 screen protector 12.3 inch tempered glass',
    compatibility: '12.3-inch Touchscreen (2024-2026 Land Cruiser 1958 & First Edition)',
  },
  'prius-screen-protector': {
    slug: 'prius-screen-protector',
    title: 'Matte Anti-Glare Tempered Glass Screen Protector (Prius 8" / 12.3")',
    searchKeywordsCA: 'toyota prius 2023-2026 screen protector 12.3 inch tempered glass',
    searchKeywordsUS: 'toyota prius 2023-2026 screen protector 12.3 inch tempered glass',
    compatibility: '8-inch & 12.3-inch Gen 5 Displays (2023-2026)',
  },

  // ==========================================
  // Console Organizers (Generation/Year Bounds)
  // ==========================================
  'console-tray-rav4': {
    slug: 'console-tray-rav4',
    title: 'Drop-In Center Console Divider & Coin Tray (RAV4)',
    searchKeywordsCA: 'rav4 2019-2026 center console organizer tray',
    searchKeywordsUS: 'rav4 2019-2026 center console organizer tray',
    compatibility: 'RAV4 LE, XLE, SE, XSE, Limited, Woodland (2019-2026)',
    whyBuy: 'Converts cavernous empty armrest bin into two accessible tiers with coin slot and USB pass-through.',
  },
  'console-tray-sienna': {
    slug: 'console-tray-sienna',
    title: 'Dual-Tier Center Console & Bridge Organizer (Sienna)',
    searchKeywordsCA: 'toyota sienna 2021-2026 center console bridge organizer tray',
    searchKeywordsUS: 'toyota sienna 2021-2026 center console bridge organizer tray',
    compatibility: 'Sienna LE, XLE, XSE, Limited, Platinum (2021-2026)',
    whyBuy: 'Tames the deep center bridge cubby and upper armrest cavity with non-slip rubber inserts.',
  },
  'console-tray-grand-highlander': {
    slug: 'console-tray-grand-highlander',
    title: 'Precision Armrest Divider & Upper Storage Tray (Grand Highlander)',
    searchKeywordsCA: 'grand highlander 2024-2026 center console organizer tray',
    searchKeywordsUS: 'grand highlander 2024-2026 center console organizer tray',
    compatibility: 'Grand Highlander XLE, Limited, Platinum (2024-2026)',
    whyBuy: 'Adds modular organization for keys, wallets, and pens above the oversized bottom bin.',
  },
  'console-tray-land-cruiser': {
    slug: 'console-tray-land-cruiser',
    title: 'Heavy-Duty Armrest Storage Organizer (Land Cruiser 250)',
    searchKeywordsCA: 'land cruiser 2024-2026 center console organizer tray',
    searchKeywordsUS: 'land cruiser 2024-2026 center console organizer tray',
    compatibility: 'Land Cruiser 250-Series with/without Cool Box (2024-2026)',
  },
  'prius-console-organizer': {
    slug: 'prius-console-organizer',
    title: 'Center Console 2-Tier Organizer Tray & Lower Cubby Insert (Prius)',
    searchKeywordsCA: 'gen 5 prius 2023-2026 center console organizer tray',
    searchKeywordsUS: 'gen 5 prius 2023-2026 center console organizer tray',
    compatibility: 'Gen 5 Prius & Prius Prime (2023-2026)',
  },

  // ==========================================
  // Floor Mats (Separate Sienna & Grand Highlander)
  // ==========================================
  'high-wall-floor-liners-rav4': {
    slug: 'high-wall-floor-liners-rav4',
    title: 'High-Wall All-Weather Floor Liners & Cargo Mat (RAV4 Hybrid & Prime)',
    searchKeywordsCA: 'toyota rav4 2019-2026 all weather floor mats liners',
    searchKeywordsUS: 'toyota rav4 2019-2026 all weather floor mats liners',
    compatibility: 'RAV4 Hybrid & Prime (2019-2026)',
  },
  '3-row-all-weather-liners': {
    slug: '3-row-all-weather-liners',
    title: '3-Row Heavy Duty All-Weather Floor Liners',
    searchKeywordsCA: 'toyota grand highlander sienna all weather floor mats 3 row',
    searchKeywordsUS: 'toyota grand highlander sienna all weather floor mats 3 row',
    compatibility: '3-Row Toyota Family Vehicles',
  },
  'sienna-all-weather-liners': {
    slug: 'sienna-all-weather-liners',
    title: 'Custom-Fit All-Weather 3-Row Floor Liners (Sienna 7/8 Passenger)',
    searchKeywordsCA: 'Toyota Sienna 2021-2026 all weather floor mats liners 7 8 passenger',
    searchKeywordsUS: 'Toyota Sienna 2021-2026 all weather floor mats liners 7 8 passenger',
    compatibility: 'Toyota Sienna 7-Passenger & 8-Passenger (2021-2026)',
    whyBuy: 'Maximized spill containment along sliding Super Long Slide tracks and cargo trunk well.',
  },
  'grand-highlander-all-weather-liners': {
    slug: 'grand-highlander-all-weather-liners',
    title: 'Custom-Fit All-Weather 3-Row Floor Liners (Grand Highlander)',
    searchKeywordsCA: 'Toyota Grand Highlander 2024-2026 all weather floor mats liners',
    searchKeywordsUS: 'Toyota Grand Highlander 2024-2026 all weather floor mats liners',
    compatibility: 'Toyota Grand Highlander Captain & Bench (2024-2026)',
    whyBuy: 'Precision laser-scanned edge protection covering all 3 passenger rows and cargo area.',
  },
  'prius-all-weather-liners': {
    slug: 'prius-all-weather-liners',
    title: 'Custom-Fit All-Weather 3D TPE Floor Liners & Trunk Mat (Prius)',
    searchKeywordsCA: 'toyota prius 2023-2026 all weather floor mats cargo liner',
    searchKeywordsUS: 'toyota prius 2023-2026 all weather floor mats cargo liner',
    compatibility: 'Prius & Prius Prime Gen 5 (2023-2026)',
  },

  // ==========================================
  // Roof Crossbars (Model Years Bound)
  // ==========================================
  'roof-rack-crossbars-rav4': {
    slug: 'roof-rack-crossbars-rav4',
    title: 'OEM-Style Lockable Aluminum Roof Rack Cross Bars (RAV4)',
    searchKeywordsCA: 'toyota rav4 2019-2026 roof rack cross bars OEM style',
    searchKeywordsUS: 'toyota rav4 2019-2026 roof rack cross bars OEM style',
    compatibility: 'RAV4 with Flush or Raised Roof Rails (2019-2026)',
  },
  'roof-rack-crossbars-grand-highlander': {
    slug: 'roof-rack-crossbars-grand-highlander',
    title: 'Heavy-Duty Roof Crossbar System (Grand Highlander)',
    searchKeywordsCA: 'toyota grand highlander 2024-2026 roof rack crossbars',
    searchKeywordsUS: 'toyota grand highlander 2024-2026 roof rack crossbars',
    compatibility: 'Grand Highlander Factory Roof Rail Mounts (2024-2026)',
  },
  'roof-rack-crossbars-corolla-cross': {
    slug: 'roof-rack-crossbars-corolla-cross',
    title: 'Low-Profile Cargo Roof Rack Bars (Corolla Cross)',
    searchKeywordsCA: 'toyota corolla cross 2022-2026 roof rack crossbars',
    searchKeywordsUS: 'toyota corolla cross 2022-2026 roof rack crossbars',
    compatibility: 'Corolla Cross with Raised Roof Rails (2022-2026)',
  },

  // ==========================================
  // Split 12-Pin & 16-Pin Mirror Adapter Harnesses
  // ==========================================
  'dongar-12pin-type-a': {
    slug: 'dongar-12pin-type-a',
    title: '12-Pin Mirror Tap / Dash Cam Power Adapter (Type A - 12-pin TSS connector)',
    searchKeywordsCA: 'toyota 12 pin dash cam mirror adapter harness',
    searchKeywordsUS: 'toyota 12 pin dash cam mirror adapter harness',
    compatibility: 'Type A (12-pin TSS connector) - Fits standard auto-dimming rearview mirrors. Please verify 12-pin plug behind mirror before ordering.',
    whyBuy: 'Powers dash cams and USB devices cleanly from the 12-pin mirror plug with zero wire splicing.',
    badge: 'Pro Tip',
  },
  'dongar-12pin': {
    slug: 'dongar-12pin',
    title: '12-Pin Mirror Tap / Dash Cam Power Adapter (Type A - 12-pin TSS connector)',
    searchKeywordsCA: 'toyota 12 pin dash cam mirror adapter harness',
    searchKeywordsUS: 'toyota 12 pin dash cam mirror adapter harness',
    compatibility: 'Type A (12-pin TSS connector) - Standard Auto-Dimming Mirror. Please verify 12-pin plug before ordering.',
    whyBuy: 'Powers dash cams cleanly from the 12-pin mirror plug with zero wire splicing.',
  },
  'dongar-16pin-type-b': {
    slug: 'dongar-16pin-type-b',
    title: '16-Pin Mirror Tap / Dash Cam Power Adapter (Type B - 16-pin TSS connector)',
    searchKeywordsCA: 'toyota 16 pin dash cam mirror adapter harness',
    searchKeywordsUS: 'toyota 16 pin dash cam mirror adapter harness',
    compatibility: 'Type B (16-pin TSS connector) - Fits digital display rearview mirrors (Limited / Platinum trims). Please verify 16-pin plug before ordering.',
    whyBuy: 'Powers dash cams directly from the 16-pin digital mirror harness with zero fuse-box tapping.',
    badge: 'Pro Tip',
  },
  'dongar-16pin': {
    slug: 'dongar-16pin',
    title: '16-Pin Mirror Tap / Dash Cam Power Adapter (Type B - 16-pin TSS connector)',
    searchKeywordsCA: 'toyota 16 pin dash cam mirror adapter harness',
    searchKeywordsUS: 'toyota 16 pin dash cam mirror adapter harness',
    compatibility: 'Type B (16-pin TSS connector) - Fits digital display rearview mirrors. Please verify 16-pin plug before ordering.',
    whyBuy: 'Powers dash cams directly from the 16-pin digital mirror harness.',
  },
  'dongar-12pin-type-b': {
    // Legacy alias pointing to 12-pin or 16-pin mirror adapter
    slug: 'dongar-12pin-type-b',
    title: '12-Pin / 16-Pin Mirror Tap Dash Cam Power Harness',
    searchKeywordsCA: 'toyota 12 pin 16 pin dash cam mirror adapter harness',
    searchKeywordsUS: 'toyota 12 pin 16 pin dash cam mirror adapter harness',
    compatibility: 'Type A (12-Pin) & Type B (16-Pin) Connectors. Check your mirror harness pin count before ordering.',
  },
  'dongar-10pin-type-a': {
    slug: 'dongar-10pin-type-a',
    title: '10-Pin Type A TSS Mirror Harness Adapter',
    searchKeywordsCA: 'Dongar 10-pin type A mirror dash cam adapter',
    searchKeywordsUS: 'Dongar 10-pin type A mirror dash cam adapter',
    compatibility: '10-Pin Toyota Safety Sense Mirror Plugs',
  },

  // ==========================================
  // Verified Dual-Market Identifiers (NOCO GB40)
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
  // Multi-Vehicle Shared Accessories (Dynamic Active Model Injection)
  // ==========================================
  'hybrid-battery-filter-mesh': {
    slug: 'hybrid-battery-filter-mesh',
    title: 'Hybrid Battery Intake Pre-Filter Mesh',
    searchKeywordsCA: 'Toyota RAV4 hybrid battery intake filter mesh G92DH-42010',
    searchKeywordsUS: 'Toyota RAV4 hybrid battery intake filter mesh G92DH-42010',
    compatibility: 'Toyota Hybrid Battery Air Intake Grille',
    whyBuy: 'Blocks pet fur and debris from choking the battery cooling fan and triggering high-voltage fault codes.',
    badge: 'Recommended',
  },
  'door-sill-scuff-guards': {
    slug: 'door-sill-scuff-guards',
    title: 'Stainless Steel / ABS Door Sill Scuff Guards',
    searchKeywordsCA: 'Toyota RAV4 door sill protector scuff plate',
    searchKeywordsUS: 'Toyota RAV4 door sill protector scuff plate',
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
  // Prius Guide Catalog Items
  // ==========================================
  'prius-mud-flaps': {
    slug: 'prius-mud-flaps',
    title: 'Molded Splash Guards & Mud Flap Kit (Prius Front & Rear)',
    searchKeywordsCA: '2023-2026 prius mud flaps splash guards',
    searchKeywordsUS: '2023-2026 prius mud flaps splash guards',
    compatibility: 'Gen 5 Prius & Prius Prime (2023-2026)',
  },
  'prius-bumper-protector': {
    slug: 'prius-bumper-protector',
    title: 'Textured Rear Bumper Sill Protector Guard (Prius)',
    searchKeywordsCA: 'gen 5 prius 2023-2026 rear bumper protector sill',
    searchKeywordsUS: 'gen 5 prius 2023-2026 rear bumper protector sill',
    compatibility: 'Gen 5 Prius & Prius Prime (2023-2026)',
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
    title: 'Custom-Fit All-Weather Floor Mats (Corolla Cross)',
    searchKeywordsCA: 'Toyota Corolla Cross all weather floor mats liners',
    searchKeywordsUS: 'Toyota Corolla Cross all weather floor mats liners',
  },
  'corolla-cross-all-weather-liners': {
    slug: 'corolla-cross-all-weather-liners',
    title: 'Custom-Fit All-Weather Floor Mats (Corolla Cross)',
    searchKeywordsCA: 'Toyota Corolla Cross all weather floor mats liners',
    searchKeywordsUS: 'Toyota Corolla Cross all weather floor mats liners',
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
    if (config.slug === '3-row-all-weather-liners') {
      if (activeModel === 'sienna') {
        return {
          ...config,
          searchKeywordsCA: 'Toyota Sienna 2021-2026 all weather floor mats liners 7 8 passenger',
          searchKeywordsUS: 'Toyota Sienna 2021-2026 all weather floor mats liners 7 8 passenger',
        };
      }
      if (activeModel === 'grand-highlander') {
        return {
          ...config,
          searchKeywordsCA: 'Toyota Grand Highlander 2024-2026 all weather floor mats liners',
          searchKeywordsUS: 'Toyota Grand Highlander 2024-2026 all weather floor mats liners',
        };
      }
    }

    return {
      ...config,
      searchKeywordsCA: injectActiveModelIntoQuery(config.searchKeywordsCA, activeModel),
      searchKeywordsUS: injectActiveModelIntoQuery(config.searchKeywordsUS, activeModel),
    };
  }

  return config;
}

export default GEAR_MARKET_CATALOG;
