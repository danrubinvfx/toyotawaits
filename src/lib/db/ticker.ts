import { createServerClient } from '@/lib/supabase/server';
import { NewsTickerItem, DeliveryTickerItem, TickerItem, CountryCode } from '@/lib/types/contracts';
import { INITIAL_COMMUNITY_RECORDS, INITIAL_US_COMMUNITY_RECORDS } from '@/lib/data/community-records';

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
 * Fetches active news wire items directly from Supabase news_wire table.
 * If query errors or table is empty, returns empty array (never mock items).
 */
export async function getNewsWireItems(limit = 10): Promise<NewsTickerItem[]> {
  const effectiveLimit = Math.max(1, Math.min(limit, 20));

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('news_wire')
      .select('id, created_at, url, headline, category')
      .order('created_at', { ascending: false })
      .limit(effectiveLimit);

    if (error) {
      console.error('[Ticker] news_wire query error:', error.message, error.details);
      return [];
    }

    if (Array.isArray(data)) {
      return data
        .filter((item: any) => {
          const cat = String(item?.category || '').toLowerCase();
          return (
            cat !== 'delivery' &&
            cat !== 'deliveries' &&
            cat !== 'user_delivery' &&
            item?.type !== 'delivery' &&
            item?.isUserSubmission !== true
          );
        })
        .map((item: any) => ({
          id: `news-${item.id}`,
          type: 'news' as const,
          headline: item.headline,
          title: item.headline || item.title || 'Toyota News Alert',
          category: item.category || 'MARKET_DATA',
          tag: item.category || 'MARKET_DATA',
          url: item.url || null,
          timestamp: item.created_at,
        }));
    }
  } catch (err: any) {
    console.error('[Ticker] news_wire query error:', err?.message || String(err), err?.details);
    return [];
  }

  return [];
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
          province: item.province || (item as any).state || (isUs ? 'CA' : 'ON'),
          model_name: item.vehicle_models?.name || 'RAV4',
          trim_name: item.vehicle_trims?.name || '',
          powertrain: item.vehicle_powertrains?.name || '',
          model_year: item.model_year ? Number(item.model_year) : 2026,
          daysWaited,
          timestamp: item.delivery_date || item.updated_at || new Date().toISOString(),
        };
      });
    }
  } catch (err: any) {
    console.error('[Ticker] delivered milestones query error:', err?.message || String(err));
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
 * Fetches the unified 4-stream interleaved ticker wire items:
 * News, Live Dealer Inventory, User Delivery Milestones, and Recommended Gear.
 */
export async function getTickerItems(
  limit = 16,
  countryCode: CountryCode | string = 'CA'
) {
  const { getAggregatedTickerItems } = await import('@/lib/data/ticker');
  return getAggregatedTickerItems(limit, countryCode);
}

