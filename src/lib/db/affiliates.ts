import { createServerClient } from '@/lib/supabase/server';

export interface AffiliateRecord {
  id: string;
  slug: string;
  destinationUrl: string;
  title: string;
  category: string;
  clickCount: number;
  isActive: boolean;
}

// Fallback registry matching 004_seed_canadian_data.sql
const FALLBACK_AFFILIATES: Record<string, AffiliateRecord> = {
  'tuxmat-rav4': {
    id: 'f1111111-1111-4111-8111-111111111111',
    slug: 'tuxmat-rav4',
    destinationUrl: 'https://www.amazon.ca/dp/B08XYZ1234?tag=toyotawaits-20',
    title: 'TuxMat Custom Floor Liners (RAV4)',
    category: 'accessories',
    clickCount: 0,
    isActive: true,
  },
  'tuxmat-sienna': {
    id: 'f2222222-2222-4222-8222-222222222222',
    slug: 'tuxmat-sienna',
    destinationUrl: 'https://www.amazon.ca/dp/B09ABC5678?tag=toyotawaits-20',
    title: 'TuxMat Custom Floor Liners (Sienna 7/8 Passenger)',
    category: 'accessories',
    clickCount: 0,
    isActive: true,
  },
  'viofo-a229-pro': {
    id: 'f3333333-3333-4333-8333-333333333333',
    slug: 'viofo-a229-pro',
    destinationUrl: 'https://www.amazon.ca/dp/B0CK123456?tag=toyotawaits-20',
    title: 'VIOFO A229 Pro 4K HDR Dual Dash Cam',
    category: 'electronics',
    clickCount: 0,
    isActive: true,
  },
  'screen-protector-12-3': {
    id: 'f4444444-4444-4444-8444-444444444444',
    slug: 'screen-protector-12-3',
    destinationUrl: 'https://www.amazon.ca/dp/B0BYZ98765?tag=toyotawaits-20',
    title: '12.3-inch Infotainment Tempered Glass Screen Protector',
    category: 'accessories',
    clickCount: 0,
    isActive: true,
  },
  'no-drill-mud-flaps-rav4': {
    id: 'f5555555-5555-4555-8555-555555555555',
    slug: 'no-drill-mud-flaps-rav4',
    destinationUrl: 'https://www.amazon.ca/dp/B07XYZ9999?tag=toyotawaits-20',
    title: 'A-Premium No-Drill Mud Flaps Set for Toyota RAV4',
    category: 'exterior',
    clickCount: 0,
    isActive: true,
  },
  'grizzl-e-charger': {
    id: 'f6666666-6666-4666-8666-666666666666',
    slug: 'grizzl-e-charger',
    destinationUrl: 'https://www.amazon.ca/dp/B082LMVSLY?tag=toyotawaits-20',
    title: 'Grizzl-E Classic Level 2 EV Charger (40A, Canadian Winter Rated)',
    category: 'ev-charging',
    clickCount: 0,
    isActive: true,
  },
  'flo-g5': {
    id: 'f7777777-7777-4777-8777-777777777777',
    slug: 'flo-g5',
    destinationUrl: 'https://www.amazon.ca/dp/B09XYZG5G5?tag=toyotawaits-20',
    title: 'FLO Home G5 Level 2 30A EVSE Charging Station',
    category: 'ev-charging',
    clickCount: 0,
    isActive: true,
  },
  'michelin-xice': {
    id: 'f8888888-8888-4888-8888-888888888888',
    slug: 'michelin-xice',
    destinationUrl: 'https://www.quattrotires.com/tires/michelin-x-ice-snow?ref=toyotawaits',
    title: 'Michelin X-Ice Snow Winter Tires (SUV & Passenger fitments)',
    category: 'winter-tires',
    clickCount: 0,
    isActive: true,
  },
  'bridgestone-blizzak': {
    id: 'f9999999-9999-4999-8999-999999999999',
    slug: 'bridgestone-blizzak',
    destinationUrl: 'https://www.quattrotires.com/tires/bridgestone-blizzak-ws90?ref=toyotawaits',
    title: 'Bridgestone Blizzak WS90 / DM-V2 Winter Tires',
    category: 'winter-tires',
    clickCount: 0,
    isActive: true,
  },
  'rates-ca-insurance': {
    id: 'faaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    slug: 'rates-ca-insurance',
    destinationUrl: 'https://rates.ca/auto-insurance?ref=toyotawaits',
    title: 'Rates.ca Canadian Auto Insurance Quote Comparison',
    category: 'insurance',
    clickCount: 0,
    isActive: true,
  },
};

export async function getAffiliateRedirect(slug: string): Promise<string | null> {
  // If Supabase is connected in production
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock-')
  ) {
    try {
      const supabase = createServerClient();
      const { data, error } = await supabase
        .from('affiliate_links')
        .select('destination_url, click_count')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (!error && data) {
        // Increment count asynchronously without blocking
        supabase
          .from('affiliate_links')
          .update({ click_count: (data.click_count || 0) + 1 })
          .eq('slug', slug)
          .then();

        return data.destination_url;
      }
    } catch (err) {
      console.warn('Falling back to local affiliate registry:', err);
    }
  }

  // Fallback to static registry
  const record = FALLBACK_AFFILIATES[slug];
  if (record && record.isActive) {
    record.clickCount += 1;
    return record.destinationUrl;
  }

  return null;
}
