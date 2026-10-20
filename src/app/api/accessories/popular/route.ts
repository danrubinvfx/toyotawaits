import { NextResponse } from 'next/server';
import { createServerClient, isLiveSupabaseConfigured } from '@/lib/supabase/server';

export const revalidate = 3600; // Cache popularity counts for 1 hour

export async function GET() {
  if (!isLiveSupabaseConfigured()) {
    return NextResponse.json({
      success: true,
      counts: {},
      cachedAt: new Date().toISOString(),
      source: 'fallback_offline',
    });
  }

  try {
    const supabase = createServerClient();
    
    // Attempt to query the 30-day popularity view first
    const { data: viewData, error: viewError } = await supabase
      .from('view_accessory_popularity_30d')
      .select('accessory_id, click_count');

    if (!viewError && Array.isArray(viewData)) {
      const counts: Record<string, number> = {};
      viewData.forEach((row: any) => {
        if (row.accessory_id) {
          counts[row.accessory_id] = Number(row.click_count) || 0;
        }
      });

      return NextResponse.json({
        success: true,
        counts,
        cachedAt: new Date().toISOString(),
        source: 'view_accessory_popularity_30d',
      });
    }

    // Direct table query fallback if view is unavailable
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: rawRows, error: rawError } = await supabase
      .from('telemetry_affiliate_clicks')
      .select('accessory_id')
      .gte('created_at', thirtyDaysAgo);

    if (rawError || !rawRows) {
      return NextResponse.json({
        success: true,
        counts: {},
        cachedAt: new Date().toISOString(),
        source: 'error_fallback',
      });
    }

    const counts: Record<string, number> = {};
    rawRows.forEach((row: any) => {
      if (row.accessory_id) {
        counts[row.accessory_id] = (counts[row.accessory_id] || 0) + 1;
      }
    });

    return NextResponse.json({
      success: true,
      counts,
      cachedAt: new Date().toISOString(),
      source: 'telemetry_affiliate_clicks_raw',
    });
  } catch {
    return NextResponse.json({
      success: true,
      counts: {},
      cachedAt: new Date().toISOString(),
      source: 'catch_fallback',
    });
  }
}
