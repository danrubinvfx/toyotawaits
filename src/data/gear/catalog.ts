/**
 * Comprehensive Gear Data Catalog & Market-Specific Affiliate Mapping
 * Ensures 100% reliable Amazon links across CA (Amazon.ca) and US (Amazon.com)
 * with verified ASINs and high-converting search fallbacks.
 */

export interface GearMarketConfig {
  slug: string;
  title: string;
  asin_ca?: string;
  asin_us?: string;
  searchKeywordsCA: string;
  searchKeywordsUS: string;
}

export const GEAR_MARKET_CATALOG: Record<string, GearMarketConfig> = {
  // Key Featured Items with High-Converting Search Fallbacks
  'fitcamx-rav4': {
    slug: 'fitcamx-rav4',
    title: 'FitcamX OEM Integrated 4K Mirror Dashcam (RAV4)',
    searchKeywordsCA: 'fitcamx 4k dash cam rav4',
    searchKeywordsUS: 'fitcamx 4k dash cam rav4',
  },
  'fitcamx-sienna': {
    slug: 'fitcamx-sienna',
    title: 'FitcamX OEM Integrated 4K Mirror Dashcam (Sienna)',
    searchKeywordsCA: 'fitcamx 4k dash cam sienna',
    searchKeywordsUS: 'fitcamx 4k dash cam sienna',
  },
  'fitcamx-grand-highlander': {
    slug: 'fitcamx-grand-highlander',
    title: 'FitcamX OEM Integrated 4K Mirror Dashcam (Grand Highlander)',
    searchKeywordsCA: 'fitcamx 4k dash cam grand highlander',
    searchKeywordsUS: 'fitcamx 4k dash cam grand highlander',
  },
  'fitcamx-land-cruiser': {
    slug: 'fitcamx-land-cruiser',
    title: 'FitcamX OEM Integrated 4K Mirror Dashcam (Land Cruiser 250)',
    searchKeywordsCA: 'fitcamx 4k dash cam land cruiser 250',
    searchKeywordsUS: 'fitcamx 4k dash cam land cruiser 250',
  },
  'screen-protector-rav4': {
    slug: 'screen-protector-rav4',
    title: 'Anti-Glare 9H Tempered Glass Screen Protector (RAV4 & Corolla Cross)',
    searchKeywordsCA: 'rav4 screen protector 12.3 inch tempered glass',
    searchKeywordsUS: 'rav4 screen protector 12.3 inch tempered glass',
  },
  'screen-protector-sienna': {
    slug: 'screen-protector-sienna',
    title: 'Matte Anti-Glare Screen Protector (Toyota Sienna)',
    searchKeywordsCA: 'toyota sienna screen protector tempered glass',
    searchKeywordsUS: 'toyota sienna screen protector tempered glass',
  },
  'screen-protector-grand-highlander': {
    slug: 'screen-protector-grand-highlander',
    title: '12.3-inch Anti-Glare Tempered Glass (Grand Highlander & High-Trim RAV4)',
    searchKeywordsCA: 'rav4 screen protector 12.3 inch tempered glass',
    searchKeywordsUS: 'rav4 screen protector 12.3 inch tempered glass',
  },
  'screen-protector-land-cruiser': {
    slug: 'screen-protector-land-cruiser',
    title: 'Armor-Grade Multimedia Screen Shield (Land Cruiser 250)',
    searchKeywordsCA: 'land cruiser 250 screen protector tempered glass',
    searchKeywordsUS: 'land cruiser 250 screen protector tempered glass',
  },
  'console-tray-rav4': {
    slug: 'console-tray-rav4',
    title: 'Drop-In Center Console Divider & Coin Tray (RAV4)',
    searchKeywordsCA: 'rav4 center console organizer tray',
    searchKeywordsUS: 'rav4 center console organizer tray',
  },
  'console-tray-sienna': {
    slug: 'console-tray-sienna',
    title: 'Dual-Tier Center Console & Bridge Organizer (Sienna)',
    searchKeywordsCA: 'toyota sienna center console bridge organizer tray',
    searchKeywordsUS: 'toyota sienna center console bridge organizer tray',
  },
  'console-tray-grand-highlander': {
    slug: 'console-tray-grand-highlander',
    title: 'Precision Armrest Divider & Upper Storage Tray (Grand Highlander)',
    searchKeywordsCA: 'grand highlander center console organizer tray',
    searchKeywordsUS: 'grand highlander center console organizer tray',
  },
  'console-tray-land-cruiser': {
    slug: 'console-tray-land-cruiser',
    title: 'Heavy-Duty Armrest Storage Organizer (Land Cruiser 250)',
    searchKeywordsCA: 'land cruiser 250 center console organizer tray',
    searchKeywordsUS: 'land cruiser 250 center console organizer tray',
  },
  'high-wall-floor-liners-rav4': {
    slug: 'high-wall-floor-liners-rav4',
    title: 'High-Wall All-Weather Floor Liners & Cargo Mat (RAV4 Hybrid & Prime)',
    searchKeywordsCA: 'TuxMat RAV4',
    searchKeywordsUS: 'toyota rav4 all weather floor mats liners',
  },
  '3-row-all-weather-liners': {
    slug: '3-row-all-weather-liners',
    title: '3-Row Heavy Duty All-Weather Floor Liners (Grand Highlander & Sienna)',
    searchKeywordsCA: 'toyota grand highlander sienna all weather floor mats 3 row',
    searchKeywordsUS: 'toyota grand highlander sienna all weather floor mats 3 row',
  },
  'roof-rack-crossbars-rav4': {
    slug: 'roof-rack-crossbars-rav4',
    title: 'OEM-Style Lockable Aluminum Roof Rack Cross Bars (RAV4)',
    searchKeywordsCA: 'toyota rav4 roof rack cross bars OEM style',
    searchKeywordsUS: 'toyota rav4 roof rack cross bars OEM style',
  },
  'roof-rack-crossbars-grand-highlander': {
    slug: 'roof-rack-crossbars-grand-highlander',
    title: 'Heavy-Duty Roof Crossbar System (Highlander & Grand Highlander)',
    searchKeywordsCA: 'toyota grand highlander roof rack crossbars',
    searchKeywordsUS: 'toyota grand highlander roof rack crossbars',
  },
  'roof-rack-crossbars-corolla-cross': {
    slug: 'roof-rack-crossbars-corolla-cross',
    title: 'Low-Profile Cargo Roof Rack Bars (Corolla Cross)',
    searchKeywordsCA: 'toyota corolla cross roof rack crossbars',
    searchKeywordsUS: 'toyota corolla cross roof rack crossbars',
  },

  // Verified Identifiers for Dual Markets
  'noco-gb40-jump-pack': {
    slug: 'noco-gb40-jump-pack',
    title: 'NOCO Boost Plus GB40 1000A 12V UltraSafe Lithium Jump Starter',
    asin_ca: 'B015TKUPIC',
    asin_us: 'B015TKUPIC',
    searchKeywordsCA: 'NOCO Boost Plus GB40 1000A jump starter',
    searchKeywordsUS: 'NOCO Boost Plus GB40 1000A jump starter',
  },

  'j1772-charger-lock': {
    slug: 'j1772-charger-lock',
    title: 'J1772 Public EV Charging Port Combination Lock Ring',
    searchKeywordsCA: 'J1772 charger lock ring',
    searchKeywordsUS: 'J1772 charger lock ring',
  },
  'dongar-10pin-type-a': {
    slug: 'dongar-10pin-type-a',
    title: '10-Pin Type A TSS Mirror Harness Adapter (Dongar Style)',
    searchKeywordsCA: 'Dongar 10-pin type A mirror dash cam adapter',
    searchKeywordsUS: 'Dongar 10-pin type A mirror dash cam adapter',
  },
  'dongar-12pin-type-b': {
    slug: 'dongar-12pin-type-b',
    title: '12-Pin / 16-Pin Type B TSS Mirror Harness Adapter (Dongar Style)',
    searchKeywordsCA: 'Dongar 12-pin type B Toyota mirror dash cam adapter',
    searchKeywordsUS: 'Dongar 12-pin type B Toyota mirror dash cam adapter',
  },
  'hybrid-battery-filter-mesh': {
    slug: 'hybrid-battery-filter-mesh',
    title: 'Hybrid Battery Intake Pre-Filter Mesh',
    searchKeywordsCA: 'Toyota RAV4 hybrid battery intake filter mesh G92DH-42010',
    searchKeywordsUS: 'Toyota RAV4 hybrid battery intake filter mesh G92DH-42010',
  },
  'door-sill-scuff-guards': {
    slug: 'door-sill-scuff-guards',
    title: 'Stainless Steel / ABS Door Sill Scuff Guards',
    searchKeywordsCA: 'Toyota RAV4 door sill protector scuff plate',
    searchKeywordsUS: 'Toyota RAV4 door sill protector scuff plate',
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

export function getGearMarketConfig(slugOrId: string): GearMarketConfig | undefined {
  if (!slugOrId) return undefined;
  return (
    GEAR_MARKET_CATALOG[slugOrId] ||
    GEAR_MARKET_CATALOG[slugOrId.replace(/^prod-/, '')]
  );
}

export default GEAR_MARKET_CATALOG;
