import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

interface AffiliateClickPayload {
  accessory_id?: string;
  placement?: string;
  model_context?: string | null;
  target_url?: string;
}

export async function POST(request: NextRequest) {
  try {
    let payload: AffiliateClickPayload = {};

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

    const { accessory_id, placement, model_context, target_url } = payload;

    if (!accessory_id || typeof accessory_id !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid accessory_id' },
        { status: 400 }
      );
    }

    const validPlacements = ['inventory_feed', 'submission_modal', 'donation_toast'];
    if (!placement || !validPlacements.includes(placement)) {
      return NextResponse.json(
        { success: false, error: 'Invalid placement. Expected inventory_feed, submission_modal, or donation_toast' },
        { status: 400 }
      );
    }

    if (!target_url || typeof target_url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid target_url' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('telemetry_affiliate_clicks')
      .insert({
        accessory_id: accessory_id.trim(),
        placement,
        model_context: model_context ? String(model_context).trim() : null,
        target_url: target_url.trim(),
      })
      .select('id')
      .single();

    if (error) {
      console.warn('Telemetry affiliate click insert error:', error.message);
      // Non-fatal, return response without failing consumer navigation
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err: any) {
    console.error('Unhandled affiliate telemetry exception:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
