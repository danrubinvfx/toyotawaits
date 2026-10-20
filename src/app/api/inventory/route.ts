import { NextResponse } from 'next/server';
import { createServerClient, isLiveSupabaseConfigured } from '@/lib/supabase/server';
import { INITIAL_SAMPLE_LISTINGS } from '@/components/discovery/InventoryExplorer';
import { VehicleListingCardProps } from '@/components/discovery/VehicleListingCard';

export const dynamic = 'force-dynamic';

export async function GET(request?: Request) {
  let isSummary = false;
  if (request) {
    try {
      const url = new URL(request.url);
      isSummary = url.searchParams.get('summary') === 'true';
    } catch {
      // Ignored in non-standard request context
    }
  }

  const getFallbackCounts = () => {
    const counts: Record<string, number> = {};
    INITIAL_SAMPLE_LISTINGS.forEach((item) => {
      if (item.model) {
        counts[item.model] = (counts[item.model] || 0) + 1;
      }
    });
    return counts;
  };

  if (!isLiveSupabaseConfigured()) {
    const countsByModel = getFallbackCounts();
    return NextResponse.json({
      success: true,
      count: INITIAL_SAMPLE_LISTINGS.length,
      countsByModel,
      ...(isSummary ? {} : { listings: INITIAL_SAMPLE_LISTINGS }),
      source: 'sample_fallback',
    });
  }

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('dealer_listings')
      .select(`
        id,
        stock_number,
        vdp_url,
        current_status,
        last_observed_at,
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
      `)
      .order('last_observed_at', { ascending: false });

    if (error || !data || data.length === 0) {
      const countsByModel = getFallbackCounts();
      return NextResponse.json({
        success: true,
        count: INITIAL_SAMPLE_LISTINGS.length,
        countsByModel,
        ...(isSummary ? {} : { listings: INITIAL_SAMPLE_LISTINGS }),
        source: 'sample_fallback',
      });
    }

    const mappedListings: VehicleListingCardProps[] = data.map((item: any) => {
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
      };
    });

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
    const countsByModel = getFallbackCounts();
    return NextResponse.json({
      success: true,
      count: INITIAL_SAMPLE_LISTINGS.length,
      countsByModel,
      ...(isSummary ? {} : { listings: INITIAL_SAMPLE_LISTINGS }),
      source: 'sample_fallback_catch',
    });
  }
}
