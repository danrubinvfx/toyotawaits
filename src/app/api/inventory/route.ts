import { NextResponse } from 'next/server';
import { createServerClient, isLiveSupabaseConfigured } from '@/lib/supabase/server';
import { INITIAL_SAMPLE_LISTINGS } from '@/components/discovery/InventoryExplorer';
import { VehicleListingCardProps } from '@/components/discovery/VehicleListingCard';
import { evaluateListingLifecycle } from '../../../../lib/discovery/services/lifecycle-service';

export const dynamic = 'force-dynamic';

const EDGE_CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
  'CDN-Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
  'Vercel-CDN-Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
};

export async function GET(request?: Request) {
  let isSummary = false;
  let includeStale = false;
  let modelFilter: string | null = null;
  let regionFilter: string | null = null;
  if (request) {
    try {
      const url = new URL(request.url);
      isSummary = url.searchParams.get('summary') === 'true';
      includeStale = url.searchParams.get('includeStale') === 'true';
      modelFilter = url.searchParams.get('model');
      regionFilter = url.searchParams.get('region') || url.searchParams.get('province');
    } catch {
      // Ignored in non-standard request context
    }
  }

  const nowMs = Date.now();
  const cutoffTime = nowMs - 48 * 3600 * 1000;

  const applyQueryFilters = <
    T extends {
      model?: string | null;
      dealerProvince?: string | null;
      dealer?: { province?: string | null } | null;
    }
  >(
    items: T[]
  ): T[] => {
    let result = items;
    if (modelFilter && modelFilter.trim()) {
      const normModel = modelFilter.trim().toLowerCase();
      result = result.filter((item) => {
        const m = (item.model || '').toLowerCase();
        return m === normModel || m.includes(normModel) || normModel.includes(m);
      });
    }
    if (regionFilter && regionFilter.trim()) {
      const normRegion = regionFilter.trim().toLowerCase();
      result = result.filter((item) => {
        const prov = (item.dealerProvince || item.dealer?.province || '').toLowerCase();
        return prov === normRegion || normRegion.includes(prov) || prov.includes(normRegion);
      });
    }
    return result;
  };

  const filterFreshListings = <
    T extends {
      lastChecked?: string;
      status?: string;
      lifecycleStatus?: string | null;
      lifecycle_status?: string | null;
    }
  >(
    items: T[],
    enforceTimeCutoff = true
  ): T[] => {
    if (includeStale) return items;
    return items.filter((item) => {
      if (enforceTimeCutoff && item.lastChecked) {
        const checkTime = new Date(item.lastChecked).getTime();
        if (!isNaN(checkTime) && checkTime < cutoffTime) {
          return false;
        }
      }
      const lc = (item.lifecycleStatus || item.lifecycle_status || 'active').toLowerCase();
      if (lc === 'sold' || lc === 'unlisted') {
        return false;
      }
      const st = (item.status || '').toLowerCase();
      if (
        st === 'stale' ||
        st === 'removed' ||
        st === 'quarantined' ||
        st === 'sold' ||
        st.includes('no longer observed') ||
        st.includes('stale')
      ) {
        return false;
      }
      return true;
    });
  };

  const getFallbackCounts = () => {
    const freshSampleListings = filterFreshListings(INITIAL_SAMPLE_LISTINGS);
    const counts: Record<string, number> = {};
    freshSampleListings.forEach((item) => {
      if (item.model) {
        counts[item.model] = (counts[item.model] || 0) + 1;
      }
    });
    return counts;
  };

  if (!isLiveSupabaseConfigured()) {
    const freshSampleListings = filterFreshListings(INITIAL_SAMPLE_LISTINGS);
    const filteredListings = applyQueryFilters(freshSampleListings);
    const countsByModel: Record<string, number> = {};
    filteredListings.forEach((item) => {
      if (item.model) {
        countsByModel[item.model] = (countsByModel[item.model] || 0) + 1;
      }
    });

    return NextResponse.json(
      {
        success: true,
        count: filteredListings.length,
        countsByModel,
        ...(isSummary ? {} : { listings: filteredListings }),
        source: 'sample_fallback',
      },
      { headers: EDGE_CACHE_HEADERS }
    );
  }

  try {
    const supabase = createServerClient({ revalidate: 120, tags: ['inventory'] });
    const cutoffIso = new Date(cutoffTime).toISOString();

    const selectClause = `
      *,
      vehicle:vehicles (*),
      dealer:dealers (*),
      observations (
        msrp,
        selling_price,
        mandatory_fees,
        has_unverified_fees,
        observed_at
      )
    `;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = supabase.from('dealer_listings').select(selectClause);

    // Strict 48h staleness cutoff: exclude older than 48h and stale/removed/quarantined unless includeStale=true
    if (!includeStale) {
      if (typeof query.gte === 'function') {
        query = query.gte('last_observed_at', cutoffIso);
      }
      if (typeof query.not === 'function') {
        query = query.not(
          'current_status',
          'in',
          '("stale","removed","quarantined","No longer observed / stale","No longer observed")'
        );
      }
    }

    const initialResult = await query.order('last_observed_at', { ascending: false });
    let data = initialResult.data;
    const error = initialResult.error;
    let enforceTimeCutoff = true;

    // If strict 48h window yielded 0 rows on live DB (e.g. between sweeps), query all active rows without 48h cutoff
    if (!includeStale && !error && (!data || data.length === 0)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let fallbackActiveQuery: any = supabase.from('dealer_listings').select(selectClause);
      if (typeof fallbackActiveQuery.not === 'function') {
        fallbackActiveQuery = fallbackActiveQuery.not(
          'current_status',
          'in',
          '("stale","removed","quarantined","No longer observed / stale","No longer observed")'
        );
      }
      if (typeof fallbackActiveQuery.order === 'function') {
        const fallbackResult = await fallbackActiveQuery.order('last_observed_at', {
          ascending: false,
        });
        if (!fallbackResult.error && Array.isArray(fallbackResult.data) && fallbackResult.data.length > 0) {
          data = fallbackResult.data;
          enforceTimeCutoff = false;
        }
      }
    }

    if (error) {
      console.error('[/api/inventory] Database query error:', error);
      return NextResponse.json({
        success: false,
        count: 0,
        countsByModel: {},
        ...(isSummary ? {} : { listings: [] }),
        source: 'supabase_error',
      });
    }

    const activeRows = Array.isArray(data) ? data : [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mappedListings: VehicleListingCardProps[] = activeRows.map((item: any) => {
      const obsList = Array.isArray(item.observations) ? item.observations : [];
      obsList.sort(
        (a: { observed_at?: string }, b: { observed_at?: string }) =>
          new Date(b.observed_at || 0).getTime() - new Date(a.observed_at || 0).getTime()
      );
      const latestObs = obsList[0] || {};

      const veh = item.vehicle || {};
      const dlr = item.dealer || {};

      const lifecycle = evaluateListingLifecycle({
        status: item.current_status,
        postedAt: item.posted_at,
        firstSeenAt: item.first_observed_at,
        existingDaysOnLot: item.days_on_lot,
      });

      const resolvedDaysOnLot =
        typeof item.days_on_lot === 'number' && item.days_on_lot > 0
          ? item.days_on_lot
          : lifecycle.daysOnLot;

      const resolvedLikelyCancellation =
        typeof item.is_likely_cancellation === 'boolean'
          ? item.is_likely_cancellation
          : lifecycle.isLikelyCancellation;

      const resolvedLifecycleStatus = item.lifecycle_status || lifecycle.lifecycleStatus;

      return {
        id: item.id,
        make: veh.make || 'Toyota',
        model: veh.model || 'Unknown',
        trim: veh.trim || null,
        modelYear: veh.model_year || 2026,
        vin: veh.vin || null,
        provisionalId: veh.provisional_id || null,
        isProvisionalVin: !veh.vin,
        dealerName: dlr.name || 'Jim Pattison Toyota Downtown',
        dealerCity: dlr.city || 'Vancouver',
        dealerProvince: dlr.province || 'BC',
        dealerBaseUrl: dlr.website_url || null,
        status: item.current_status,
        lastChecked: item.last_observed_at,
        postedAt: item.posted_at || item.first_observed_at || null,
        firstSeenAt: item.first_observed_at || null,
        vdpUrl: item.vdp_url || item.listing_url || null,
        listingUrl: item.listing_url || item.vdp_url || null,
        msrp: latestObs.msrp != null ? Number(latestObs.msrp) : null,
        sellingPrice:
          latestObs.selling_price != null
            ? Number(latestObs.selling_price)
            : latestObs.msrp != null
            ? Number(latestObs.msrp)
            : null,
        mandatoryFees:
          latestObs.mandatory_fees != null ? Number(latestObs.mandatory_fees) : null,
        hasUnverifiedFees: latestObs.has_unverified_fees ?? true,
        powertrain: veh.powertrain || null,
        driveTrain: veh.drive_train || null,
        exteriorColor: veh.exterior_color || null,
        stockNumber: item.stock_number || null,
        imageUrl: item.image_url || null,
        hasRealPhoto: Boolean(item.has_real_photo),
        imageSource: item.image_source || null,
        daysOnLot: resolvedDaysOnLot,
        days_on_lot: resolvedDaysOnLot,
        isLikelyCancellation: resolvedLikelyCancellation,
        is_likely_cancellation: resolvedLikelyCancellation,
        lifecycleStatus: resolvedLifecycleStatus,
        lifecycle_status: resolvedLifecycleStatus,
        soldAt: item.sold_at || null,
        sold_at: item.sold_at || null,
      };
    });

    if (!includeStale) {
      mappedListings = filterFreshListings(mappedListings, enforceTimeCutoff);
    }

    const filteredListings = applyQueryFilters(mappedListings);

    const countsByModel: Record<string, number> = {};
    filteredListings.forEach((item) => {
      if (item.model) {
        countsByModel[item.model] = (countsByModel[item.model] || 0) + 1;
      }
    });

    return NextResponse.json(
      {
        success: true,
        count: filteredListings.length,
        countsByModel,
        ...(isSummary ? {} : { listings: filteredListings }),
        source: 'supabase_dealer_listings',
      },
      { headers: EDGE_CACHE_HEADERS }
    );
  } catch (err) {
    console.error('[/api/inventory] Unexpected catch error:', err);
    return NextResponse.json({
      success: false,
      count: 0,
      countsByModel: {},
      ...(isSummary ? {} : { listings: [] }),
      source: 'supabase_catch_error',
    });
  }
}
