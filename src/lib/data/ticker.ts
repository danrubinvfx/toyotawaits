import { createServerClient } from '@/lib/supabase/server';
import { TickerItem, TickerItemType, TICKER_BADGE_COLORS } from '@/types/ticker';
import { SEASONAL_TICKER_GEAR_PICKS } from '@/config/gear';
import { INITIAL_COMMUNITY_RECORDS, INITIAL_US_COMMUNITY_RECORDS } from '@/lib/data/community-records';
import { calculateDaysWaited, getNewsWireItems } from '@/lib/db/ticker';
import { CountryCode } from '@/lib/types/contracts';

const TARGET_INVENTORY_MODELS = ['rav4', 'sienna', 'prius', 'grand highlander', 'tacoma'];

export const DEFAULT_STATIC_TICKER_ITEMS: TickerItem[] = [
  {
    id: 'def-1',
    type: 'news',
    badge: '[🗞️ UPDATE]',
    badgeColor: TICKER_BADGE_COLORS.news,
    text: 'BC PHEV clean energy rebate allocations updated • Track eligible trims',
    linkUrl: '/',
    isExternal: false,
  },
  {
    id: 'def-2',
    type: 'gear',
    badge: '[⚡ GEAR PICK]',
    badgeColor: TICKER_BADGE_COLORS.gear,
    title: 'TPE All-Weather Floor & Cargo Liners',
    text: 'Laser-fit floor & trunk spill protection for Canadian winters',
    linkUrl:
      'https://www.amazon.ca/s?k=Toyota+custom+fit+all+weather+rubber+floor+liners+trunk+mat+TPE&tag=toyotawaits-20',
    isExternal: true,
    accessoryId: 'all-weather-floor-liners',
    modelContext: 'universal',
  },
  {
    id: 'def-3',
    type: 'news',
    badge: '[🗞️ STATUS]',
    badgeColor: TICKER_BADGE_COLORS.delivery,
    text: 'Tracking crowd-sourced Canadian Toyota delivery times & dealer inventory',
    linkUrl: '/',
    isExternal: false,
  },
];

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

interface FallbackInventorySighting {
  id: string;
  year: number;
  model: string;
  trim: string;
  exterior_color: string;
  dealer_name: string;
  dealer_city: string;
  vin: string;
  status: string;
}

/**
 * Pure server-safe fallback inventory sightings (avoids importing from 'use client' InventoryExplorer module).
 */
const FALLBACK_INVENTORY_SIGHTINGS: FallbackInventorySighting[] = [
  {
    id: 'jp-rav4-xse-01',
    year: 2026,
    model: 'RAV4 Hybrid',
    trim: 'XSE Technology Package AWD',
    exterior_color: 'Wind Chill Pearl / Black Roof',
    dealer_name: 'Jim Pattison Toyota Downtown',
    dealer_city: 'Vancouver',
    vin: 'JTDACAAJ0T3038212',
    status: 'Advertised - availability unconfirmed',
  },
  {
    id: 'jp-sienna-ltd-02',
    year: 2026,
    model: 'Sienna',
    trim: 'Limited AWD 7-Passenger',
    exterior_color: 'Blueprint',
    dealer_name: 'Jim Pattison Toyota Downtown',
    dealer_city: 'Vancouver',
    vin: 'PROV-SIENNA-881',
    status: 'Incoming availability unconfirmed',
  },
  {
    id: 'jp-grand-highlander-03',
    year: 2026,
    model: 'Grand Highlander Hybrid',
    trim: 'Limited MAX AWD',
    exterior_color: 'Storm Cloud',
    dealer_name: 'Jim Pattison Toyota Downtown',
    dealer_city: 'Vancouver',
    vin: '4T1B11HK5SU112233',
    status: 'Advertised - availability unconfirmed',
  },
  {
    id: 'jp-tacoma-04',
    year: 2026,
    model: 'Tacoma',
    trim: 'TRD Off-Road 4x4 Double Cab',
    exterior_color: 'Underground',
    dealer_name: 'Jim Pattison Toyota Downtown',
    dealer_city: 'Vancouver',
    vin: '3TYLB5EN8RT009988',
    status: 'Incoming availability unconfirmed',
  },
  {
    id: 'wc-toyota-prius-01',
    year: 2026,
    model: 'Prius Prime',
    trim: 'SE AWD',
    exterior_color: 'Guardian Gray',
    dealer_name: 'West Coast Toyota',
    dealer_city: 'Pitt Meadows',
    vin: 'JTDACACU3V3084482',
    status: 'Advertised - availability unconfirmed',
  },
];

function matchesTargetInventoryModel(modelName?: string | null): boolean {
  const normalized = String(modelName ?? '').toLowerCase();
  return TARGET_INVENTORY_MODELS.some((target) => normalized.includes(target));
}

function isTransitStatus(status?: string | null): boolean {
  const normalized = String(status ?? '').toLowerCase();
  return (
    normalized.includes('transit') ||
    normalized.includes('incoming') ||
    normalized.includes('allocated') ||
    normalized.includes('pipeline')
  );
}

function isStaleListing(status?: string | null): boolean {
  const normalized = String(status ?? '').toLowerCase();
  return normalized.includes('stale') || normalized.includes('no longer observed') || normalized.includes('sold');
}

function formatInventoryRowToTickerItem(listing: Record<string, any>, idx: number): TickerItem | null {
  if (!listing || typeof listing !== 'object') return null;

  const year = listing?.year ?? listing?.model_year ?? 2026;
  const model = String(listing?.model ?? 'RAV4').trim() || 'RAV4';
  const trim = String(listing?.trim ?? 'AWD').trim() || 'AWD';
  const color = String(listing?.exterior_color ?? 'Standard').trim() || 'Standard';
  const dealerName = String(listing?.dealer_name ?? 'Toyota Dealer').trim() || 'Toyota Dealer';
  const dealerCity = String(listing?.dealer_city ?? 'BC').trim() || 'BC';
  const vin = String(listing?.vin ?? listing?.provisional_id ?? listing?.stock_number ?? model).trim() || model;
  const inTransit = isTransitStatus(listing?.status);

  return {
    id: `inv-${listing?.id ?? idx}`,
    type: 'inventory',
    badge: inTransit ? '[🚢 IN TRANSIT]' : '[🟢 LIVE LOT]',
    badgeColor: TICKER_BADGE_COLORS.inventory,
    text: `${year} ${model} ${trim} (${color}) observed at ${dealerName} (${dealerCity})`,
    linkUrl: `/inventory?q=${encodeURIComponent(vin)}`,
    isExternal: false,
  };
}

/**
 * 1. Inventory Sightings Stream:
 * Fetches top 5 active, fresh listings from `discovery_listings` (RAV4, Sienna, Prius, Grand Highlander, Tacoma),
 * falling back to server-safe static sightings if query fails or returns empty.
 */
export async function getInventoryTickerItems(limit = 5): Promise<TickerItem[]> {
  const effectiveLimit = Math.max(1, Math.min(limit, 10));

  try {
    const supabase = createServerClient();
    const { data: listingsData, error } = await supabase
      .from('discovery_listings')
      .select('id, year, model, trim, exterior_color, dealer_name, dealer_city, vin, status, updated_at')
      .order('updated_at', { ascending: false })
      .limit(25);

    if (error) {
      // Log and fall back to server-safe static inventory sightings
      console.error('[Ticker] Failed to fetch live inventory data:', error.message || error);
    } else {
      const listings = Array.isArray(listingsData) ? listingsData : [];
      const filtered = listings
        .filter((row) => row && !isStaleListing(row?.status) && matchesTargetInventoryModel(row?.model))
        .slice(0, effectiveLimit);

      if (filtered.length > 0) {
        return filtered
          .map((row, idx) => formatInventoryRowToTickerItem(row, idx))
          .filter((item): item is TickerItem => Boolean(item));
      }
    }
  } catch (err) {
    console.error('[Ticker] Failed to fetch live data (inventory):', err);
  }

  return FALLBACK_INVENTORY_SIGHTINGS.slice(0, effectiveLimit)
    .map((row, idx) => formatInventoryRowToTickerItem(row, idx))
    .filter((item): item is TickerItem => Boolean(item));
}

/**
 * 2. User Delivery Milestones Stream:
 * Fetches latest 5 confirmed order/delivery events from Supabase `submissions`
 * with defensive fallback to verified community records.
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

    const { data: deliveriesData, error } = await query
      .order('delivery_date', { ascending: false })
      .limit(effectiveLimit);

    if (error) {
      console.error('[Ticker] Failed to fetch live delivery data:', error.message || error);
    } else {
      const deliveries = Array.isArray(deliveriesData) ? deliveriesData : [];
      const deliveredOrAllocated = deliveries.filter(
        (row: Record<string, any>) =>
          row &&
          (row.status === 'delivered' ||
            row.current_stage === 'allocation_confirmed' ||
            row.current_stage === 'vin_assigned')
      );

      if (deliveredOrAllocated.length > 0) {
        return deliveredOrAllocated
          .slice(0, effectiveLimit)
          .map((item: Record<string, any>, idx: number): TickerItem | null => {
            if (!item) return null;
            const year = item?.model_year ? Number(item.model_year) : 2026;
            const model = String(item?.vehicle_models?.name ?? 'RAV4').trim() || 'RAV4';
            const trim = String(item?.vehicle_trims?.name ?? 'AWD').trim() || 'AWD';
            const province = String(item?.province ?? item?.state ?? (isUs ? 'CA' : 'BC')).trim();
            const waitDays = calculateDaysWaited(item?.order_date, item?.delivery_date, item?.wait_days);
            const isAllocated = item?.status !== 'delivered';

            return {
              id: `del-${item?.id ?? idx}`,
              type: 'delivery',
              badge: isAllocated ? '[📝 ALLOCATED]' : '[📦 DELIVERED]',
              badgeColor: TICKER_BADGE_COLORS.delivery,
              text: `${year} ${model} ${trim} delivered in ${province} after ${waitDays} days`,
              linkUrl: '/',
              isExternal: false,
            };
          })
          .filter((item): item is TickerItem => Boolean(item));
      }
    }
  } catch (err) {
    console.error('[Ticker] Failed to fetch live data (deliveries):', err);
  }

  try {
    const rawCatalog = isUs ? INITIAL_US_COMMUNITY_RECORDS : INITIAL_COMMUNITY_RECORDS;
    const catalog = Array.isArray(rawCatalog) ? rawCatalog : [];
    const delivered = catalog
      .filter((r) => r && r.status === 'delivered' && r.deliveryDate)
      .sort((a, b) => {
        const timeA = new Date(a.deliveryDate || a.orderDate).getTime();
        const timeB = new Date(b.deliveryDate || b.orderDate).getTime();
        return timeB - timeA;
      })
      .slice(0, effectiveLimit);

    return delivered
      .map((r, idx): TickerItem | null => {
        if (!r) return null;
        const year = r?.modelYear ?? 2026;
        const model = String(r?.model ?? 'RAV4').trim() || 'RAV4';
        const trim = String(r?.trim ?? 'AWD').trim() || 'AWD';
        const province = String(r?.province ?? (isUs ? 'CA' : 'BC')).trim();
        const waitDays = calculateDaysWaited(r?.orderDate, r?.deliveryDate, r?.waitDays);

        return {
          id: `del-${r?.id ?? idx}`,
          type: 'delivery',
          badge: '[📦 DELIVERED]',
          badgeColor: TICKER_BADGE_COLORS.delivery,
          text: `${year} ${model} ${trim} delivered in ${province} after ${waitDays} days`,
          linkUrl: '/',
          isExternal: false,
        };
      })
      .filter((item): item is TickerItem => Boolean(item));
  } catch (fallbackErr) {
    console.error('[Ticker] Failed to build delivery fallback:', fallbackErr);
    return [];
  }
}

/**
 * 3. News / Allocation Briefs Stream:
 * Combines live `news_wire` updates with 2-3 seasonal/macro allocation ticker briefs.
 */
export async function getNewsTickerItems(limit = 3): Promise<TickerItem[]> {
  const effectiveLimit = Math.max(1, Math.min(limit, 10));
  const items: TickerItem[] = [];

  try {
    const liveWireData = await getNewsWireItems(effectiveLimit);
    const liveWire = Array.isArray(liveWireData) ? liveWireData : [];
    for (const row of liveWire) {
      if (!row) continue;
      const headline = String(row?.headline ?? row?.title ?? '').trim();
      if (!headline) continue;
      const isExternal = Boolean(row?.url && /^https?:\/\//i.test(row.url));
      items.push({
        id: String(row?.id ?? `news-${items.length + 1}`),
        type: 'news',
        badge: '[🗞️ UPDATE]',
        badgeColor: TICKER_BADGE_COLORS.news,
        text: headline,
        linkUrl: row?.url || '/',
        isExternal,
      });
    }
  } catch (err) {
    console.error('[Ticker] Failed to fetch live data (news):', err);
  }

  for (const brief of SEASONAL_ALLOCATION_BRIEFS) {
    if (items.length >= effectiveLimit) break;
    if (brief && !items.some((existing) => existing?.text === brief.text)) {
      items.push(brief);
    }
  }

  return items.filter(Boolean).slice(0, effectiveLimit);
}

/**
 * 4. Essential Gear Highlights Stream:
 * Pulls 2-3 top-performing seasonal essentials from `src/config/gear.ts`.
 */
export function getGearTickerItems(limit = 4): TickerItem[] {
  const effectiveLimit = Math.max(1, Math.min(limit, 10));
  try {
    const picks = Array.isArray(SEASONAL_TICKER_GEAR_PICKS) ? SEASONAL_TICKER_GEAR_PICKS : [];
    return picks
      .slice(0, effectiveLimit)
      .map((pick, idx): TickerItem | null => {
        if (!pick) return null;
        return {
          id: String(pick?.id ?? `gear-${idx}`),
          type: 'gear',
          badge: pick?.badge || '[⚡ GEAR PICK]',
          badgeColor: TICKER_BADGE_COLORS.gear,
          title: pick?.title ? String(pick.title) : 'TPE All-Weather Floor & Cargo Liners',
          text: String(pick?.text ?? 'Laser-fit floor & trunk spill protection for Canadian winters'),
          linkUrl: String(pick?.linkUrl ?? 'https://www.amazon.ca/s?k=Toyota+accessories&tag=toyotawaits-20'),
          isExternal: true,
          accessoryId: pick?.accessoryId,
          modelContext: pick?.modelContext ?? 'universal',
        };
      })
      .filter((item): item is TickerItem => Boolean(item));
  } catch (err) {
    console.error('[Ticker] Failed to load gear items:', err);
    return DEFAULT_STATIC_TICKER_ITEMS.filter((item) => item.type === 'gear');
  }
}

export interface TickerStreamBuckets {
  news?: TickerItem[] | null;
  inventory?: TickerItem[] | null;
  delivery?: TickerItem[] | null;
  gear?: TickerItem[] | null;
}

/**
 * Interleaves the 4 streams in a round-robin sequence:
 *   [News -> Inventory -> Delivery -> Gear -> Inventory -> Delivery...]
 * Safely handles empty/null arrays without index out-of-bounds or undefined entries,
 * and guarantees no two items of the same type sit adjacent to each other.
 */
export function interleaveTickerStreams(
  streams?: TickerStreamBuckets | null,
  limit = 16
): TickerItem[] {
  try {
    const safeStreams = streams ?? {};
    const queues: Record<TickerItemType, TickerItem[]> = {
      news: Array.isArray(safeStreams.news) ? safeStreams.news.filter(Boolean) : [],
      inventory: Array.isArray(safeStreams.inventory) ? safeStreams.inventory.filter(Boolean) : [],
      delivery: Array.isArray(safeStreams.delivery) ? safeStreams.delivery.filter(Boolean) : [],
      gear: Array.isArray(safeStreams.gear) ? safeStreams.gear.filter(Boolean) : [],
    };

    const cycleOrder: TickerItemType[] = ['news', 'inventory', 'delivery', 'gear'];
    const result: TickerItem[] = [];
    const maxItems = Math.max(1, limit);

    while (result.length < maxItems) {
      let addedInPass = false;

      for (const streamType of cycleOrder) {
        if (result.length >= maxItems) break;
        const queue = queues[streamType];
        if (!Array.isArray(queue) || queue.length === 0) continue;

        const lastItem = result.length > 0 ? result[result.length - 1] : null;
        const lastType = lastItem ? lastItem.type : null;

        if (lastType === streamType) {
          const alternateType = cycleOrder.find(
            (alt) => alt !== lastType && Array.isArray(queues[alt]) && queues[alt].length > 0
          );
          if (alternateType) {
            const altItem = queues[alternateType].shift();
            if (altItem) {
              result.push(altItem);
              addedInPass = true;
            }
          } else {
            const candidate = queue[0];
            let inserted = false;
            if (candidate) {
              for (let i = 1; i < result.length; i++) {
                if (
                  result[i - 1]?.type !== candidate.type &&
                  result[i]?.type !== candidate.type
                ) {
                  const shifted = queue.shift();
                  if (shifted) {
                    result.splice(i, 0, shifted);
                    inserted = true;
                    addedInPass = true;
                  }
                  break;
                }
              }
            }
            if (!inserted) {
              queue.length = 0;
            }
          }
          continue;
        }

        const nextItem = queue.shift();
        if (nextItem) {
          result.push(nextItem);
          addedInPass = true;
        }
      }

      if (!addedInPass) break;
    }

    const cleaned = result.filter(
      (item): item is TickerItem =>
        Boolean(item && typeof item === 'object' && typeof item.text === 'string' && item.text.length > 0)
    );

    // Ensure circular marquee seam (last item -> first item) does not place same type adjacent
    if (cleaned.length > 2 && cleaned[cleaned.length - 1]?.type === cleaned[0]?.type) {
      const trailing = cleaned[cleaned.length - 1];
      const prev = cleaned[cleaned.length - 2];
      if (prev && trailing && prev.type !== cleaned[0]?.type) {
        const beforePrevType = cleaned.length >= 3 ? cleaned[cleaned.length - 3]?.type : null;
        if (beforePrevType !== trailing.type) {
          cleaned[cleaned.length - 2] = trailing;
          cleaned[cleaned.length - 1] = prev;
        } else {
          cleaned.pop();
        }
      } else {
        cleaned.pop();
      }
    }

    return cleaned.filter(Boolean);
  } catch (err) {
    console.error('[Ticker] Interleaving error, returning static fallback:', err);
    return [...DEFAULT_STATIC_TICKER_ITEMS];
  }
}

/**
 * Fetches and interleaves all 4 streams (News, Live Dealer Inventory, User Deliveries, Gear Picks).
 * Never throws; returns guaranteed static fallback list if anything fails.
 */
export async function getAggregatedTickerItems(
  limit = 16,
  countryCode: CountryCode | string = 'CA'
): Promise<TickerItem[]> {
  try {
    const [newsData, inventoryData, deliveryData] = await Promise.all([
      getNewsTickerItems(3).catch((err) => {
        console.error('[Ticker] Failed to fetch live data (news stream):', err);
        return [] as TickerItem[];
      }),
      getInventoryTickerItems(5).catch((err) => {
        console.error('[Ticker] Failed to fetch live data (inventory stream):', err);
        return [] as TickerItem[];
      }),
      getDeliveryTickerItems(5, countryCode).catch((err) => {
        console.error('[Ticker] Failed to fetch live data (delivery stream):', err);
        return [] as TickerItem[];
      }),
    ]);

    const news = Array.isArray(newsData) ? newsData.filter(Boolean) : [];
    const inventory = Array.isArray(inventoryData) ? inventoryData.filter(Boolean) : [];
    const delivery = Array.isArray(deliveryData) ? deliveryData.filter(Boolean) : [];
    const gear = getGearTickerItems(4).filter(Boolean);

    const interleaved = interleaveTickerStreams(
      {
        news,
        inventory,
        delivery,
        gear,
      },
      limit
    ).filter(Boolean);

    if (interleaved.length === 0) {
      return DEFAULT_STATIC_TICKER_ITEMS.slice(0, Math.max(1, limit));
    }

    return interleaved.slice(0, Math.max(1, limit));
  } catch (err) {
    console.error('[Ticker] Failed to fetch live data:', err);
    return DEFAULT_STATIC_TICKER_ITEMS.slice(0, Math.max(1, limit));
  }
}
