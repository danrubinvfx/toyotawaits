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

// Fallback registry matching 004_seed_canadian_data.sql and 006_se_mods_affiliates.sql
const FALLBACK_AFFILIATES: Record<string, AffiliateRecord> = {
  'tuxmat-rav4': {
    id: 'f1111111-1111-4111-8111-111111111111',
    slug: 'tuxmat-rav4',
    destinationUrl: 'https://www.amazon.ca/s?k=TuxMat+Toyota+RAV4&tag=toyotawaits-20',
    title: 'TuxMat Custom Floor Liners (RAV4)',
    category: 'accessories',
    clickCount: 0,
    isActive: true,
  },
  'tuxmat-sienna': {
    id: 'f2222222-2222-4222-8222-222222222222',
    slug: 'tuxmat-sienna',
    destinationUrl: 'https://www.amazon.ca/s?k=TuxMat+Toyota+Sienna&tag=toyotawaits-20',
    title: 'TuxMat Custom Floor Liners (Sienna 7/8 Passenger)',
    category: 'accessories',
    clickCount: 0,
    isActive: true,
  },
  'viofo-a229-pro': {
    id: 'f3333333-3333-4333-8333-333333333333',
    slug: 'viofo-a229-pro',
    destinationUrl: 'https://www.amazon.ca/s?k=VIOFO+A229+Pro+4K&tag=toyotawaits-20',
    title: 'VIOFO A229 Pro 4K HDR Dual Dash Cam',
    category: 'electronics',
    clickCount: 0,
    isActive: true,
  },
  'screen-protector-12-3': {
    id: 'f4444444-4444-4444-8444-444444444444',
    slug: 'screen-protector-12-3',
    destinationUrl: 'https://www.amazon.ca/s?k=Toyota+RAV4+12.3+screen+protector&tag=toyotawaits-20',
    title: '12.3-inch Infotainment Tempered Glass Screen Protector',
    category: 'accessories',
    clickCount: 0,
    isActive: true,
  },
  'no-drill-mud-flaps-rav4': {
    id: 'f5555555-5555-4555-8555-555555555555',
    slug: 'no-drill-mud-flaps-rav4',
    destinationUrl: 'https://www.amazon.ca/s?k=A-Premium+mud+flaps+Toyota+RAV4&tag=toyotawaits-20',
    title: 'A-Premium No-Drill Mud Flaps Set for Toyota RAV4',
    category: 'exterior',
    clickCount: 0,
    isActive: true,
  },
  'grizzl-e-charger': {
    id: 'f6666666-6666-4666-8666-666666666666',
    slug: 'grizzl-e-charger',
    destinationUrl: 'https://www.amazon.ca/s?k=Grizzl-E+Level+2+EV+Charger&tag=toyotawaits-20',
    title: 'Grizzl-E Classic Level 2 EV Charger (40A, Canadian Winter Rated)',
    category: 'ev-charging',
    clickCount: 0,
    isActive: true,
  },
  'flo-g5': {
    id: 'f7777777-7777-4777-8777-777777777777',
    slug: 'flo-g5',
    destinationUrl: 'https://www.amazon.ca/s?k=FLO+Home+EV+Charger&tag=toyotawaits-20',
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
  'jbl-club-dash-speakers': {
    id: 'fbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    slug: 'jbl-club-dash-speakers',
    destinationUrl: 'https://www.amazon.ca/s?k=JBL+Club+3.5+speakers&tag=toyotawaits-20',
    title: 'JBL Club 3.5" Dash Tweeters / Midrange Speakers',
    category: 'audio',
    clickCount: 0,
    isActive: true,
  },
  'toyota-speaker-harness': {
    id: 'fccccccc-cccc-4ccc-8ccc-cccccccccccc',
    slug: 'toyota-speaker-harness',
    destinationUrl: 'https://www.amazon.ca/s?k=RED+WOLF+Toyota+dash+speaker+wiring+harness&tag=toyotawaits-20',
    title: 'Red Wolf / Metra Toyota Dash Speaker Plug-and-Play Wiring Harness (Pair)',
    category: 'audio',
    clickCount: 0,
    isActive: true,
  },
  'trim-removal-tools': {
    id: 'fddddddd-dddd-4ddd-8ddd-dddddddddddd',
    slug: 'trim-removal-tools',
    destinationUrl: 'https://www.amazon.ca/s?k=auto+trim+removal+tool+kit&tag=toyotawaits-20',
    title: 'Non-Marring Automotive Dash Pry & Trim Removal Tool Kit',
    category: 'tools',
    clickCount: 0,
    isActive: true,
  },
  'clazzio-leather-covers': {
    id: 'feeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
    slug: 'clazzio-leather-covers',
    destinationUrl: 'https://www.clazzio.com/',
    title: 'Clazzio Custom-Fit Leather / PVC Seat Covers (RAV4 Prime)',
    category: 'interior',
    clickCount: 0,
    isActive: true,
  },
  'ekr-seat-covers': {
    id: 'ffffffff-ffff-4fff-8fff-ffffffffffff',
    slug: 'ekr-seat-covers',
    destinationUrl: 'https://www.amazon.ca/s?k=EKR+custom+fit+car+seat+covers+Toyota+RAV4&tag=toyotawaits-20',
    title: 'EKR Custom Tailored Full Leatherette Seat Covers (RAV4 Prime)',
    category: 'interior',
    clickCount: 0,
    isActive: true,
  },
};

function isLegacyPlaceholderUrl(url: string): boolean {
  return (
    url.includes('B08XYZ1234') ||
    url.includes('B08XJBL34T') ||
    url.includes('B07TOYSPKR') ||
    url.includes('B08TRIMKIT') ||
    url.includes('B09EKRLEAT') ||
    url.includes('B09ABC5678') ||
    url.includes('B0CK123456') ||
    url.includes('B0BYZ98765') ||
    url.includes('B07XYZ9999') ||
    url.includes('B09XYZG5G5') ||
    url.includes('404-page-not-found') ||
    url.includes('clazzio.com/toyota-rav4-prime')
  );
}

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

        // If the database URL is an old placeholder/broken URL, transparently return active URL
        if (isLegacyPlaceholderUrl(data.destination_url)) {
          const fallback = FALLBACK_AFFILIATES[slug];
          return fallback ? fallback.destinationUrl : data.destination_url;
        }

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
