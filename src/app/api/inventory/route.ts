import { NextResponse } from 'next/server';
import { createServerClient, isLiveSupabaseConfigured } from '@/lib/supabase/server';
import { INITIAL_SAMPLE_LISTINGS } from '@/components/discovery/InventoryExplorer';
import { VehicleListingCardProps } from '@/components/discovery/VehicleListingCard';
import { evaluateListingLifecycle } from '../../../../lib/discovery/services/lifecycle-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request?: Request) {
  let isSummary = false;
  let includeStale = false;
  if (request) {
    try {
      const url = new URL(request.url);
      isSummary = url.searchParams.get('summary') === 'true';
      includeStale = url.searchParams.get('includeStale') === 'true';
    } catch {
      // Ignored in non-standard request context
    }
  }

  const nowMs = Date.now();
  const cutoffTime = nowMs - 48 * 3600 * 1000;

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
    const countsByModel = getFallbackCounts();
    return NextResponse.json({
      success: true,
      count: freshSampleListings.length,
      countsByModel,
      ...(isSummary ? {} : { listings: freshSampleListings }),
      source: 'sample_fallback',
    });
  }

  try {
    const supabase = createServerClient();
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

    let { data, error } = await query.order('last_observed_at', { ascending: false });
    let enforceTimeCutoff = true;

    // If strict 48h window yielded 0 rows on live DB (e.g. between sweeps), query all active rows without 48h cutoff
    if (!includeStale && !error && (!data || data.length === 0)) {
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

    let mappedListings: VehicleListingCardProps[] = activeRows.map((item: any) => {
      const obsList = Array.isArray(item.observations) ? item.observations : [];
      obsList.sort(
        (a: any, b: any) =>
          new Date(b.observed_at).getTime() - new Date(a.observed_at).getTime()
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

    const countsByModel: Record<string, number> = {};
    mappedListings.forEach((item) => {
      if (item.model) {
        countsByModel[item.model] = (countsByModel[item.model] || 0) + 1;
      }
    });

    return NextResponse.json({
      success: true,
      count: mappedListings.length,
      countsByModel,
      ...(isSummary ? {} : { listings: mappedListings }),
      source: 'supabase_dealer_listings',
    });
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
