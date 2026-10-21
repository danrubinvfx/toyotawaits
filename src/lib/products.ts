/**
 * Product Catalog & Community Verified Upgrade Packages
 * Centralized specifications, fitment metadata, and Canadian storefront localization.
 */

export interface ProductAccessory {
  name: string;
  partNumber?: string;
  description: string;
  storeUrl: string;
  slug: string;
  priceEstCad?: string;
}

export interface CatalogProduct {
  id: string;
  slug: string;
  name: string;
  title: string;
  category: string;
  subCategory: 'Amplifiers' | 'Subwoofers' | 'Speakers' | 'Dashcam' | 'Protection' | 'Cargo' | 'Accessories';
  fullCategory: string;
  description: string;
  fitment: string;
  models: string[];
  powertrains?: string[];
  badge?: 'Essential' | 'Recommended' | 'Pro Tip' | 'Top Pick' | 'Recommended Upgrade';
  priceEst?: string;
  priceEstCad?: string;
  storeUrl: string;
  destinationUrl: string;
  affiliateUrl: string;
  asin?: string;
  amazonCaAsinOrUrl?: string;
  accessories?: ProductAccessory[];
}

/**
 * Verified RAV4 Stealth "OEM+" Audio Package Components
 * Non-JBL audio overhaul blueprint for Gas, Hybrid (HEV), and Plug-in Hybrid (PHEV) models.
 */
export const RAV4_AUDIO_PACKAGE: CatalogProduct[] = [
  {
    id: 'prod-beat-sonic-ena-3t3',
    slug: 'beat-sonic-ena-3t3',
    name: 'Beat-Sonic ENA-3T3 Micro Power Amplifier Kit',
    title: 'Beat-Sonic ENA-3T3 Micro Power Amplifier Kit (RAV4 Non-JBL)',
    category: 'Audio & Electronics',
    subCategory: 'Amplifiers',
    fullCategory: 'Audio & Electronics / Amplifiers',
    description:
      'Plug-and-play inline T-harness micro-amp (50W x 4) that mounts behind the head unit/glovebox. Zero factory wire splicing; includes dedicated RCA subwoofer preamp output.',
    fitment: '2019–2026 Toyota RAV4 (Non-JBL 8" and 10.5" multimedia screens).',
    models: ['rav4'],
    powertrains: ['gas', 'hybrid', 'hev', 'phev'],
    badge: 'Recommended',
    priceEst: 'Clean 50W x 4 inline amp + RCA sub out',
    priceEstCad: '~$380 CAD',
    storeUrl: 'https://www.beatsonicusa.com/products/ena-3t3',
    destinationUrl: 'https://www.beatsonicusa.com/products/ena-3t3',
    affiliateUrl: '/out/beat-sonic-ena-3t3',
  },
  {
    id: 'prod-alpine-pwe-s800',
    slug: 'alpine-pwe-s800',
    name: 'Alpine PWE-S800 / PWE-S8 8" Compact Powered Subwoofer',
    title: 'Alpine PWE-S800 8" Compact Powered Subwoofer (120W RMS Under-Seat)',
    category: 'Audio & Electronics',
    subCategory: 'Subwoofers',
    fullCategory: 'Audio & Electronics / Subwoofers',
    description:
      '240W peak / 120W RMS shallow cast-aluminum powered sub designed to fit completely flat under the front passenger seat frame.',
    fitment: 'Universal under-seat fitment (compatible with RAV4 hybrid battery clearances).',
    models: ['rav4'],
    powertrains: ['gas', 'hybrid', 'hev', 'phev'],
    badge: 'Recommended',
    priceEst: '120W RMS shallow cast-aluminum bass',
    priceEstCad: '~$399 CAD',
    storeUrl: 'https://www.amazon.ca/s?k=Alpine+PWE-S8+compact+powered+subwoofer&tag=toyotawaits-20',
    destinationUrl: 'https://www.amazon.ca/s?k=Alpine+PWE-S8+compact+powered+subwoofer&tag=toyotawaits-20',
    affiliateUrl: '/out/alpine-pwe-s800',
    amazonCaAsinOrUrl: 'https://www.amazon.ca/s?k=Alpine+PWE-S8+compact+powered+subwoofer&tag=toyotawaits-20',
  },
  {
    id: 'prod-dash-speakers-cerwin-kicker',
    slug: 'dash-speakers-rav4',
    name: 'Cerwin-Vega V3 3.5" (or Kicker KSC350) Dash Corner Speakers',
    title: 'Cerwin-Vega V3 3.5" / Kicker KSC350 3.5" Coaxial Dash Speakers',
    category: 'Audio & Electronics',
    subCategory: 'Speakers',
    fullCategory: 'Audio & Electronics / Speakers',
    description:
      '3.5" coaxial dash speaker upgrade to replace factory paper-cone dash speakers.',
    fitment: '2019–2026 Toyota RAV4 (Left & Right Dash Corners).',
    models: ['rav4'],
    powertrains: ['gas', 'hybrid', 'hev', 'phev'],
    badge: 'Recommended',
    priceEst: 'Concert-grade vocal and treble clarity',
    priceEstCad: '~$95 CAD',
    storeUrl: 'https://www.amazon.ca/s?k=Kicker+KSC350+3.5+coaxial+speakers&tag=toyotawaits-20',
    destinationUrl: 'https://www.amazon.ca/s?k=Kicker+KSC350+3.5+coaxial+speakers&tag=toyotawaits-20',
    affiliateUrl: '/out/dash-speakers-rav4',
    accessories: [
      {
        name: 'Metra 72-8110 Toyota Speaker Wiring Harness',
        partNumber: 'Metra 72-8110',
        description: 'Plug-and-play Toyota dash speaker wiring harness adapters (pair) for solder-free connection.',
        storeUrl: 'https://www.amazon.ca/s?k=Metra+72-8110+Toyota+speaker+harness&tag=toyotawaits-20',
        slug: 'metra-72-8110-harness',
        priceEstCad: '~$18 CAD',
      },
    ],
  },
  {
    id: 'prod-kicker-cs-door-speakers-rav4',
    slug: 'kicker-cs-door-speakers-rav4',
    name: 'Kicker CS Series 6.5" Door Speakers (Front & Rear)',
    title: 'Kicker CS Series 6.5" Door Speakers (Front & Rear Upgrade)',
    category: 'Audio & Electronics',
    subCategory: 'Speakers',
    fullCategory: 'Audio & Electronics / Speakers',
    description:
      '6.5" coaxial door speakers to replace factory low-power magnet drivers.',
    fitment: '2019–2026 Toyota RAV4 (Front & Rear Doors).',
    models: ['rav4'],
    powertrains: ['gas', 'hybrid', 'hev', 'phev'],
    badge: 'Recommended',
    priceEst: 'High-power mid-bass driver replacement',
    priceEstCad: '~$149 CAD',
    storeUrl: 'https://www.amazon.ca/s?k=Kicker+CS+Series+6.5+inch+speakers+CSC65&tag=toyotawaits-20',
    destinationUrl: 'https://www.amazon.ca/s?k=Kicker+CS+Series+6.5+inch+speakers+CSC65&tag=toyotawaits-20',
    affiliateUrl: '/out/kicker-cs-door-speakers-rav4',
    accessories: [
      {
        name: 'Metra 82-8148 6.5" Toyota Door Speaker Mounting Brackets',
        partNumber: 'Metra 82-8148',
        description: 'Custom brackets matching Toyota factory door rivet holes and sealing moisture barrier.',
        storeUrl: 'https://www.amazon.ca/s?k=Metra+82-8148+speaker+mounting+brackets+Toyota&tag=toyotawaits-20',
        slug: 'metra-82-8148-brackets',
        priceEstCad: '~$24 CAD',
      },
      {
        name: 'Metra 72-8104 Toyota Door Speaker Harness Leads',
        partNumber: 'Metra 72-8104',
        description: 'Direct plug-in wiring harness leads for Toyota door speaker connectors.',
        storeUrl: 'https://www.amazon.ca/s?k=Metra+72-8104+speaker+wiring+harness+Toyota&tag=toyotawaits-20',
        slug: 'metra-72-8104-harness',
        priceEstCad: '~$16 CAD',
      },
    ],
  },
];

import { MODS_CONFIG } from '@/data/mods';

export const ALL_PRODUCTS: CatalogProduct[] = [...RAV4_AUDIO_PACKAGE];

const ACCESSORY_PRODUCTS: CatalogProduct[] = RAV4_AUDIO_PACKAGE.flatMap((pkg) =>
  (pkg.accessories || []).map((acc) => ({
    id: `acc-${acc.slug}`,
    slug: acc.slug,
    name: acc.name,
    title: acc.name,
    category: pkg.category,
    subCategory: 'Accessories' as const,
    fullCategory: `${pkg.category} / Accessories`,
    description: acc.description,
    fitment: pkg.fitment,
    models: pkg.models,
    powertrains: pkg.powertrains,
    priceEstCad: acc.priceEstCad,
    storeUrl: acc.storeUrl,
    destinationUrl: acc.storeUrl,
    affiliateUrl: `/out/${acc.slug}`,
  }))
);

const ADDITIONAL_MOD_PRODUCTS: CatalogProduct[] = MODS_CONFIG.filter(
  (mod) => !ALL_PRODUCTS.some((p) => p.slug === mod.slug)
).map((mod) => ({
  id: mod.id,
  slug: mod.slug,
  name: mod.name || mod.title,
  title: mod.title,
  category: mod.category,
  subCategory: 'Accessories' as const,
  fullCategory: mod.category,
  description: mod.description || '',
  fitment: mod.compatibility || 'Verified Fitment',
  models: mod.models,
  powertrains: mod.powertrains,
  priceEst: mod.priceEst,
  storeUrl: mod.destinationUrl || mod.amazonCaAsinOrUrl,
  destinationUrl: mod.destinationUrl || mod.amazonCaAsinOrUrl,
  affiliateUrl: mod.affiliateUrl || `/out/${mod.slug}`,
  asin: mod.asin,
}));

export const PRODUCTS: CatalogProduct[] = [
  ...ALL_PRODUCTS,
  ...ACCESSORY_PRODUCTS,
  ...ADDITIONAL_MOD_PRODUCTS,
];

export function getProductsByModel(model: string): CatalogProduct[] {
  const cleanModel = model.toLowerCase().trim();
  return ALL_PRODUCTS.filter(
    (product) => product.models.includes(cleanModel) || product.models.includes('all')
  );
}

export function getProductBySlug(slug: string): CatalogProduct | undefined {
  return ALL_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
}

export default ALL_PRODUCTS;


