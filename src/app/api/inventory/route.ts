import { NextResponse } from 'next/server';
import { createServerClient, isLiveSupabaseConfigured } from '@/lib/supabase/server';
import { INITIAL_SAMPLE_LISTINGS } from '@/components/discovery/InventoryExplorer';
import { VehicleListingCardProps } from '@/components/discovery/VehicleListingCard';

export const dynamic = 'force-dynamic';

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

  const filterFreshListings = <T extends { lastChecked?: string; status?: string }>(
    items: T[]
  ): T[] => {
    if (includeStale) return items;
    return items.filter((item) => {
      if (item.lastChecked) {
        const checkTime = new Date(item.lastChecked).getTime();
        if (!isNaN(checkTime) && checkTime < cutoffTime) {
          return false;
        }
      }
      const st = (item.status || '').toLowerCase();
      if (
        st === 'stale' ||
        st === 'removed' ||
        st === 'quarantined' ||
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

    let query: any = supabase
      .from('dealer_listings')
      .select(`
        id,
        stock_number,
        vdp_url,
        current_status,
        last_observed_at,
        first_observed_at,
        posted_at,
        image_url,
        has_real_photo,
        image_source,
        vehicle:vehicles (
          make,
          model,
          trim,
          model_year,
          vin,
          provisional_id,
          powertrain,
          exterior_color,
          drive_train
        ),
        dealer:dealers (
          name,
          city,
          province
        ),
        observations (
          msrp,
          selling_price,
          mandatory_fees,
          has_unverified_fees,
          observed_at
        )
      `);

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

    const { data, error } = await query.order('last_observed_at', { ascending: false });

    if (error || !data || data.length === 0) {
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

    let mappedListings: VehicleListingCardProps[] = data.map((item: any) => {
      const obsList = Array.isArray(item.observations) ? item.observations : [];
      obsList.sort(
        (a: any, b: any) =>
          new Date(b.observed_at).getTime() - new Date(a.observed_at).getTime()
      );
      const latestObs = obsList[0] || {};

      const veh = item.vehicle || {};
      const dlr = item.dealer || {};

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
        status: item.current_status,
        lastChecked: item.last_observed_at,
        postedAt: item.posted_at || item.first_observed_at || null,
        firstSeenAt: item.first_observed_at || null,
        vdpUrl: item.vdp_url || null,
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
      };
    });

    if (!includeStale) {
      mappedListings = filterFreshListings(mappedListings);
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
  } catch {
    const freshSampleListings = filterFreshListings(INITIAL_SAMPLE_LISTINGS);
    const countsByModel = getFallbackCounts();
    return NextResponse.json({
      success: true,
      count: freshSampleListings.length,
      countsByModel,
      ...(isSummary ? {} : { listings: freshSampleListings }),
      source: 'sample_fallback_catch',
    });
  }
}
