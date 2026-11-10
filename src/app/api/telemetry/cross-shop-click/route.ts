import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const { instant } = { instant: false };

interface CrossShopClickPayload {
  source_model?: string;
  target_model?: string;
  timestamp?: string;
}

export async function POST(request: NextRequest) {
  try {
    let payload: CrossShopClickPayload = {};

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      payload = await request.json();
    } else {
      const rawText = await request.text();
      try {
        payload = JSON.parse(rawText);
      } catch {
        payload = {};
      }
    }

    // Guard against admin opt-out
    const isOptOut =
      request.cookies.get('tw_admin_opt_out')?.value === 'true' ||
      request.cookies.get('tw_ignore_analytics')?.value === 'true' ||
      request.nextUrl.searchParams.get('tw_admin_opt_out') === 'true' ||
      request.nextUrl.searchParams.get('tw_ignore_analytics') === 'true' ||
      request.headers.get('x-admin-opt-out') === 'true' ||
      request.headers.get('x-ignore-analytics') === 'true';

    if (isOptOut) {
      return NextResponse.json({ success: true, ignored: true });
    }

    const { source_model, target_model } = payload;

    if (!source_model || typeof source_model !== 'string' || !target_model || typeof target_model !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid source_model or target_model' },
        { status: 400 }
      );
    }

    const timestamp = payload.timestamp || new Date().toISOString();

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('telemetry_cross_shop_clicks')
      .insert({
        source_model: source_model.trim(),
        target_model: target_model.trim(),
        timestamp,
      })
      .select('id')
      .maybeSingle();

    if (error) {
      // Table may not have migration yet or RLS policy restricts; log non-fatally
      console.warn('[Telemetry] cross-shop click insert notice:', error.message);
      return NextResponse.json({ success: true, loggedLocally: true });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err: any) {
    console.warn('[Telemetry] unhandled cross-shop click exception:', err?.message || err);
    return NextResponse.json({ success: true, fallback: true });
  }
}
