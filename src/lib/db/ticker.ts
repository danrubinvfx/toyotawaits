import { createServerClient } from '@/lib/supabase/server';
import { NewsTickerItem, DeliveryTickerItem, TickerItem, CountryCode } from '@/lib/types/contracts';
import { INITIAL_COMMUNITY_RECORDS, INITIAL_US_COMMUNITY_RECORDS } from '@/lib/data/community-records';

// In-memory fallback news store for development, testing, and offline modes
const inMemoryNewsWire: NewsTickerItem[] = [
  {
    type: 'news',
    id: 'news-1',
    title: 'Q4 Canadian Allocation Update: High hybrid production slots allocated for BC, ON & AB',
    summary: 'Toyota Motor Manufacturing Canada ramps up 2026 hybrid deliveries across key provinces.',
    tag: 'ALLOCATION ALERT',
    url: '/estimates',
    timestamp: '2026-10-14T14:00:00Z',
  },
  {
    type: 'news',
    id: 'news-2',
    title: 'Federal iZEV Program: 2026 RAV4 Plug-in Hybrid qualifies for full $5,000 rebate',
    summary: 'Updated eligibility guidelines confirmed for current model year deliveries in Canada.',
    tag: 'ZEV REBATES',
    url: '/guides/ev-charging',
    timestamp: '2026-10-12T09:30:00Z',
  },
  {
    type: 'news',
    id: 'news-3',
    title: 'Winter Tire Fitment Guide: Factory OEM specs & 3PMSF ratings now live',
    summary: 'Check recommended wheel offsets and load indexes for Canadian winter roads.',
    tag: 'BUYER GUIDE',
    url: '/tires',
    timestamp: '2026-10-10T16:00:00Z',
  },
  {
    type: 'news',
    id: 'news-4',
    title: 'Toyota Sienna Wait Times: Prairie dealer allocations showing notable turnaround improvements',
    summary: 'Average delivery duration in Alberta and Saskatchewan contracts by 28 days this quarter.',
    tag: 'NEWS WIRE',
    url: '/#community-log',
    timestamp: '2026-10-08T11:15:00Z',
  },
];

/**
 * Calculates calendar days waited between order and delivery
 */
export function calculateDaysWaited(
  orderDate?: string | null,
  deliveredDate?: string | null,
  precalculatedWait?: number | null
): number {
  if (precalculatedWait != null && !isNaN(Number(precalculatedWait)) && Number(precalculatedWait) > 0) {
    return Number(precalculatedWait);
  }
  if (orderDate && deliveredDate) {
    const orderTime = new Date(orderDate).getTime();
    const deliveredTime = new Date(deliveredDate).getTime();
    if (!isNaN(orderTime) && !isNaN(deliveredTime)) {
      return Math.max(0, Math.round((deliveredTime - orderTime) / (1000 * 60 * 60 * 24)));
    }
  }
  return 120;
}

/**
 * Fetches active news wire items
 */
export async function getNewsWireItems(limit = 5): Promise<NewsTickerItem[]> {
  const effectiveLimit = Math.max(1, Math.min(limit, 20));

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock-')
  ) {
    try {
      const supabase = createServerClient();
      const { data, error } = await supabase
        .from('news_wire')
        .select('id, title, summary, tag, url, published_at, is_active')
        .eq('is_active', true)
        .order('published_at', { ascending: false })
        .limit(effectiveLimit);

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((item: any) => ({
          type: 'news' as const,
          id: String(item.id),
          title: item.title,
          summary: item.summary || null,
          tag: item.tag || null,
          url: item.url || null,
          timestamp: item.published_at || new Date().toISOString(),
        }));
      }
    } catch {
      // Gracefully fall back to in-memory items if table doesn't exist
    }
  }

  return inMemoryNewsWire.slice(0, effectiveLimit);
}

/**
 * Fetches verified delivered vehicle milestones
 */
export async function getDeliveredMilestones(
  limit = 5,
  countryCode: CountryCode | string = 'CA'
): Promise<DeliveryTickerItem[]> {
  const isUs = countryCode === 'US';
  const effectiveLimit = Math.max(1, Math.min(limit, 20));

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock-')
  ) {
    try {
      const supabase = createServerClient();
      let query = supabase
        .from('submissions')
        .select(`
          id,
          province,
          state,
          country_code,
          model_year,
          order_date,
          delivery_date,
          wait_days,
          status,
          updated_at,
          vehicle_models(name),
          vehicle_powertrains(name),
          vehicle_trims(name)
        `)
        .eq('status', 'delivered')
        .or('is_flagged.eq.false,is_flagged.is.null');

      if (isUs) {
        query = query.eq('country_code', 'US');
      } else {
        query = query.or('country_code.eq.CA,country_code.is.null');
      }

      const { data, error } = await query
        .order('delivery_date', { ascending: false })
        .limit(effectiveLimit);

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((item: any) => {
          const daysWaited = calculateDaysWaited(item.order_date, item.delivery_date, item.wait_days);
          return {
            type: 'delivery' as const,
            id: String(item.id),
            province: item.province || item.state || (isUs ? 'CA' : 'ON'),
            model_name: item.vehicle_models?.name || 'RAV4',
            trim_name: item.vehicle_trims?.name || '',
            powertrain: item.vehicle_powertrains?.name || '',
            model_year: item.model_year ? Number(item.model_year) : 2026,
            daysWaited,
            timestamp: item.delivery_date || item.updated_at || new Date().toISOString(),
          };
        });
      }
    } catch {
      // Gracefully fall back to local community records
    }
  }

  // Fallback to verified delivered community dataset
  const catalog = isUs ? INITIAL_US_COMMUNITY_RECORDS : INITIAL_COMMUNITY_RECORDS;
  const delivered = catalog.filter((r) => r.status === 'delivered' && r.deliveryDate);

  delivered.sort((a, b) => {
    const timeA = new Date(a.deliveryDate || a.orderDate).getTime();
    const timeB = new Date(b.deliveryDate || b.orderDate).getTime();
    return timeB - timeA;
  });

  return delivered.slice(0, effectiveLimit).map((r) => ({
    type: 'delivery' as const,
    id: r.id,
    province: r.province || (isUs ? 'CA' : 'ON'),
    model_name: r.model || 'RAV4',
    trim_name: r.trim || '',
    powertrain: r.powertrain || '',
    model_year: r.modelYear || 2026,
    daysWaited: calculateDaysWaited(r.orderDate, r.deliveryDate, r.waitDays),
    timestamp: r.deliveryDate || `${r.orderDate}T12:00:00Z`,
  }));
}

/**
 * Interleaves news wire alerts and verified delivery milestones
 */
export function interleaveFeeds(
  news: NewsTickerItem[],
  deliveries: DeliveryTickerItem[],
  limit = 10
): TickerItem[] {
  const combined: TickerItem[] = [];
  const maxLen = Math.max(deliveries.length, news.length);

  for (let i = 0; i < maxLen; i++) {
    if (deliveries[i]) combined.push(deliveries[i]);
    if (news[i]) combined.push(news[i]);
    if (combined.length >= limit) break;
  }

  return combined.slice(0, limit);
}

/**
 * Fetches combined ticker items alternating between verified deliveries and news wire alerts
 */
export async function getTickerItems(
  limit = 10,
  countryCode: CountryCode | string = 'CA'
): Promise<TickerItem[]> {
  const halfLimit = Math.max(1, Math.ceil(limit / 2));
  const [news, deliveries] = await Promise.all([
    getNewsWireItems(halfLimit),
    getDeliveredMilestones(halfLimit, countryCode),
  ]);

  return interleaveFeeds(news, deliveries, limit);
}

// Helper to push mock news items for testing
export function _addMockNewsItem(item: NewsTickerItem) {
  inMemoryNewsWire.unshift(item);
}

export function _resetMockNews() {
  inMemoryNewsWire.length = 4;
}
