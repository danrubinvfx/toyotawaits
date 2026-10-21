import { createServerClient } from '@/lib/supabase/server';
import { TickerItem, TickerItemType, TICKER_BADGE_COLORS } from '@/types/ticker';
import { SEASONAL_TICKER_GEAR_PICKS } from '@/config/gear';
import { INITIAL_SAMPLE_LISTINGS } from '@/components/discovery/InventoryExplorer';
import { INITIAL_COMMUNITY_RECORDS, INITIAL_US_COMMUNITY_RECORDS } from '@/lib/data/community-records';
import { calculateDaysWaited, getNewsWireItems } from '@/lib/db/ticker';
import { CountryCode } from '@/lib/types/contracts';

const TARGET_INVENTORY_MODELS = ['rav4', 'sienna', 'prius', 'grand highlander', 'tacoma'];

export const SEASONAL_ALLOCATION_BRIEFS: TickerItem[] = [
  {
    id: 'news-brief-bc-phev-rebate',
    type: 'news',
    badge: '[🗞️ UPDATE]',
    badgeColor: TICKER_BADGE_COLORS.news,
    text: 'BC PHEV clean energy rebate allocations update • Track latest eligible trims',
    linkUrl: '/',
    isExternal: false,
  },
  {
    id: 'news-brief-q4-hybrid-pipeline',
    type: 'news',
    badge: '[🗞️ UPDATE]',
    badgeColor: TICKER_BADGE_COLORS.news,
    text: 'Toyota Canada Q4 hybrid pipeline: wait-time estimates updated for Lower Mainland',
    linkUrl: '/',
    isExternal: false,
  },
  {
    id: 'news-brief-metro-van-sweep',
    type: 'news',
    badge: '[🗞️ UPDATE]',
    badgeColor: TICKER_BADGE_COLORS.news,
    text: 'Metro Vancouver 5-store dealer inventory sweep: live lot & transit VIN tracking active',
    linkUrl: '/inventory',
    isExternal: false,
  },
];

function matchesTargetInventoryModel(modelName: string): boolean {
  const normalized = (modelName || '').toLowerCase();
  return TARGET_INVENTORY_MODELS.some((target) => normalized.includes(target));
}

function isTransitStatus(status?: string | null): boolean {
  const normalized = (status || '').toLowerCase();
  return (
    normalized.includes('transit') ||
    normalized.includes('incoming') ||
    normalized.includes('allocated') ||
    normalized.includes('pipeline')
  );
}

function isStaleListing(status?: string | null): boolean {
  const normalized = (status || '').toLowerCase();
  return normalized.includes('stale') || normalized.includes('no longer observed') || normalized.includes('sold');
}

/**
 * 1. Inventory Sightings Stream:
 * Fetches top 5 active, fresh listings from `discovery_listings` (RAV4, Sienna, Prius, Grand Highlander, Tacoma),
 * falling back to `dealer_listings` or `INITIAL_SAMPLE_LISTINGS`.
 */
export async function getInventoryTickerItems(limit = 5): Promise<TickerItem[]> {
  const effectiveLimit = Math.max(1, Math.min(limit, 10));

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('discovery_listings')
      .select('id, year, model, trim, exterior_color, dealer_name, dealer_city, vin, status, updated_at')
      .order('updated_at', { ascending: false })
      .limit(25);

    if (!error && Array.isArray(data) && data.length > 0) {
      const filtered = data
        .filter((row: any) => !isStaleListing(row.status) && matchesTargetInventoryModel(row.model || ''))
        .slice(0, effectiveLimit);

      if (filtered.length > 0) {
        return filtered.map((row: any, idx: number) => {
          const year = row.year || row.model_year || 2026;
          const model = (row.model || 'RAV4').trim();
          const trim = (row.trim || 'AWD').trim();
          const color = (row.exterior_color || 'Factory Finish').trim();
          const dealerName = (row.dealer_name || 'Toyota Dealer').trim();
          const dealerCity = (row.dealer_city || 'BC').trim();
          const vin = (row.vin || row.provisional_id || row.stock_number || model).trim();
          const inTransit = isTransitStatus(row.status);

          return {
            id: `inv-${row.id || idx}`,
            type: 'inventory' as const,
            badge: inTransit ? '[🚢 IN TRANSIT]' : '[🟢 LIVE LOT]',
            badgeColor: TICKER_BADGE_COLORS.inventory,
            text: `${year} ${model} ${trim} (${color}) observed at ${dealerName} (${dealerCity})`,
            linkUrl: `/inventory?q=${encodeURIComponent(vin)}`,
            isExternal: false,
          };
        });
      }
    }
  } catch {
    // Fall back to curated live sample inventory
  }

  const activeSamples = INITIAL_SAMPLE_LISTINGS.filter(
    (item) => !isStaleListing(item.status) && matchesTargetInventoryModel(item.model)
  ).slice(0, effectiveLimit);

  return activeSamples.map((item) => {
    const year = item.modelYear || 2026;
    const model = (item.model || 'RAV4').trim();
    const trim = (item.trim || 'AWD').trim();
    const color = (item.exteriorColor || 'Factory Finish').trim();
    const dealerName = (item.dealerName || 'Toyota Dealer').trim();
    const dealerCity = (item.dealerCity || 'BC').trim();
    const queryIdentifier = item.vin || item.provisionalId || item.stockNumber || item.model;
    const inTransit = isTransitStatus(item.status);

    return {
      id: `inv-${item.id}`,
      type: 'inventory' as const,
      badge: inTransit ? '[🚢 IN TRANSIT]' : '[🟢 LIVE LOT]',
      badgeColor: TICKER_BADGE_COLORS.inventory,
      text: `${year} ${model} ${trim} (${color}) observed at ${dealerName} (${dealerCity})`,
      linkUrl: `/inventory?q=${encodeURIComponent(queryIdentifier)}`,
      isExternal: false,
    };
  });
}

/**
 * 2. User Delivery Milestones Stream:
 * Fetches latest 5 confirmed order/delivery events from Supabase `submissions`
 * with fallback to verified community records.
 */
export async function getDeliveryTickerItems(
  limit = 5,
  countryCode: CountryCode | string = 'CA'
): Promise<TickerItem[]> {
  const isUs = countryCode === 'US';
  const effectiveLimit = Math.max(1, Math.min(limit, 10));

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
        current_stage,
        updated_at,
        vehicle_models(name),
        vehicle_powertrains(name),
        vehicle_trims(name)
      `)
      .in('status', ['delivered', 'pending'])
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
      const deliveredOrAllocated = data.filter(
        (row: any) =>
          row.status === 'delivered' ||
          row.current_stage === 'allocation_confirmed' ||
          row.current_stage === 'vin_assigned'
      );

      if (deliveredOrAllocated.length > 0) {
        return deliveredOrAllocated.slice(0, effectiveLimit).map((item: any) => {
          const year = item.model_year ? Number(item.model_year) : 2026;
          const model = (item.vehicle_models?.name || 'RAV4').trim();
          const trim = (item.vehicle_trims?.name || 'AWD').trim();
          const province = item.province || item.state || (isUs ? 'CA' : 'BC');
          const waitDays = calculateDaysWaited(item.order_date, item.delivery_date, item.wait_days);
          const isAllocated = item.status !== 'delivered';

          return {
            id: `del-${item.id}`,
            type: 'delivery' as const,
            badge: isAllocated ? '[📝 ALLOCATED]' : '[📦 DELIVERED]',
            badgeColor: TICKER_BADGE_COLORS.delivery,
            text: `${year} ${model} ${trim} delivered in ${province} after ${waitDays} days`,
            linkUrl: '/',
            isExternal: false,
          };
        });
      }
    }
  } catch {
    // Fall back to verified community records below
  }

  const catalog = isUs ? INITIAL_US_COMMUNITY_RECORDS : INITIAL_COMMUNITY_RECORDS;
  const delivered = catalog
    .filter((r) => r.status === 'delivered' && r.deliveryDate)
    .sort((a, b) => {
      const timeA = new Date(a.deliveryDate || a.orderDate).getTime();
      const timeB = new Date(b.deliveryDate || b.orderDate).getTime();
      return timeB - timeA;
    })
    .slice(0, effectiveLimit);

  return delivered.map((r) => {
    const year = r.modelYear || 2026;
    const model = (r.model || 'RAV4').trim();
    const trim = (r.trim || 'AWD').trim();
    const province = r.province || (isUs ? 'CA' : 'BC');
    const waitDays = calculateDaysWaited(r.orderDate, r.deliveryDate, r.waitDays);

    return {
      id: `del-${r.id}`,
      type: 'delivery' as const,
      badge: '[📦 DELIVERED]',
      badgeColor: TICKER_BADGE_COLORS.delivery,
      text: `${year} ${model} ${trim} delivered in ${province} after ${waitDays} days`,
      linkUrl: '/',
      isExternal: false,
    };
  });
}

/**
 * 3. News / Allocation Briefs Stream:
 * Combines live `news_wire` updates with 2-3 seasonal/macro allocation ticker briefs.
 */
export async function getNewsTickerItems(limit = 3): Promise<TickerItem[]> {
  const effectiveLimit = Math.max(1, Math.min(limit, 10));
  const items: TickerItem[] = [];

  try {
    const liveWire = await getNewsWireItems(effectiveLimit);
    for (const row of liveWire) {
      const headline = (row.headline || row.title || '').trim();
      if (!headline) continue;
      const isExternal = Boolean(row.url && /^https?:\/\//i.test(row.url));
      items.push({
        id: row.id || `news-${items.length + 1}`,
        type: 'news',
        badge: '[🗞️ UPDATE]',
        badgeColor: TICKER_BADGE_COLORS.news,
        text: headline,
        linkUrl: row.url || '/',
        isExternal,
      });
    }
  } catch {
    // Ignore and fill with seasonal allocation briefs
  }

  for (const brief of SEASONAL_ALLOCATION_BRIEFS) {
    if (items.length >= effectiveLimit) break;
    if (!items.some((existing) => existing.text === brief.text)) {
      items.push(brief);
    }
  }

  return items.slice(0, effectiveLimit);
}

/**
 * 4. Essential Gear Highlights Stream:
 * Pulls 2-3 top-performing seasonal essentials from `src/config/gear.ts`.
 */
export function getGearTickerItems(limit = 3): TickerItem[] {
  const effectiveLimit = Math.max(1, Math.min(limit, 10));
  return SEASONAL_TICKER_GEAR_PICKS.slice(0, effectiveLimit).map((pick) => ({
    id: pick.id,
    type: 'gear' as const,
    badge: pick.badge || '[⚡ GEAR PICK]',
    badgeColor: TICKER_BADGE_COLORS.gear,
    text: pick.text,
    linkUrl: pick.linkUrl,
    isExternal: true,
    accessoryId: pick.accessoryId,
    modelContext: pick.modelContext ?? 'universal',
  }));
}

export interface TickerStreamBuckets {
  news: TickerItem[];
  inventory: TickerItem[];
  delivery: TickerItem[];
  gear: TickerItem[];
}

/**
 * Interleaves the 4 streams in a round-robin sequence:
 *   [News -> Inventory -> Delivery -> Gear -> Inventory -> Delivery...]
 * Strictly guarantees that no two items of the same type sit adjacent to each other
 * (both sequentially and across the marquee loop wrap-around when >1 item exists).
 */
export function interleaveTickerStreams(
  streams: TickerStreamBuckets,
  limit = 16
): TickerItem[] {
  const queues: Record<TickerItemType, TickerItem[]> = {
    news: [...(streams.news || [])],
    inventory: [...(streams.inventory || [])],
    delivery: [...(streams.delivery || [])],
    gear: [...(streams.gear || [])],
  };

  const cycleOrder: TickerItemType[] = ['news', 'inventory', 'delivery', 'gear'];
  const result: TickerItem[] = [];
  const maxItems = Math.max(1, limit);

  while (result.length < maxItems) {
    let addedInPass = false;

    for (const streamType of cycleOrder) {
      if (result.length >= maxItems) break;
      const queue = queues[streamType];
      if (!queue || queue.length === 0) continue;

      const lastType = result.length > 0 ? result[result.length - 1].type : null;
      if (lastType === streamType) {
        // Look for another available stream in cycleOrder to prevent adjacent identical types
        const alternateType = cycleOrder.find(
          (alt) => alt !== lastType && queues[alt] && queues[alt].length > 0
        );
        if (alternateType) {
          const altItem = queues[alternateType].shift()!;
          result.push(altItem);
          addedInPass = true;
        } else {
          // Try inserting into an earlier non-conflicting slot in result
          const candidate = queue[0];
          let inserted = false;
          for (let i = 1; i < result.length; i++) {
            if (result[i - 1].type !== candidate.type && result[i].type !== candidate.type) {
              result.splice(i, 0, queue.shift()!);
              inserted = true;
              addedInPass = true;
              break;
            }
          }
          if (!inserted) {
            // Cannot place without creating adjacent duplicate types; drop remaining from this queue
            queue.length = 0;
          }
        }
        continue;
      }

      result.push(queue.shift()!);
      addedInPass = true;
    }

    if (!addedInPass) break;
  }

  // Ensure circular marquee seam (last item -> first item) does not place same type adjacent
  if (result.length > 2 && result[result.length - 1].type === result[0].type) {
    const trailing = result[result.length - 1];
    const prev = result[result.length - 2];
    if (prev.type !== result[0].type) {
      // Swap last two items if that doesn't conflict with result[length - 3]
      const beforePrevType = result.length >= 3 ? result[result.length - 3].type : null;
      if (beforePrevType !== trailing.type) {
        result[result.length - 2] = trailing;
        result[result.length - 1] = prev;
      } else {
        result.pop();
      }
    } else {
      result.pop();
    }
  }

  return result;
}

/**
 * Fetches and interleaves all 4 streams (News, Live Dealer Inventory, User Deliveries, Gear Picks).
 */
export async function getAggregatedTickerItems(
  limit = 16,
  countryCode: CountryCode | string = 'CA'
): Promise<TickerItem[]> {
  const [news, inventory, delivery] = await Promise.all([
    getNewsTickerItems(3),
    getInventoryTickerItems(5),
    getDeliveryTickerItems(5, countryCode),
  ]);
  const gear = getGearTickerItems(3);

  return interleaveTickerStreams(
    {
      news,
      inventory,
      delivery,
      gear,
    },
    limit
  );
}
