import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, isLiveSupabaseConfigured } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest | Request) {
  const reqUrl = new URL(request.url);
  const rawToken = reqUrl.searchParams.get('token')?.trim() || '';

  if (!rawToken) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unsubscribe token is required.',
      },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  if (!isLiveSupabaseConfigured()) {
    return NextResponse.redirect(
      new URL('/inventory?alert_unsubscribed=true', reqUrl.origin),
      302
    );
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createServerClient() as any;
    const { data: matched, error: selectError } = await supabase
      .from('inventory_alert_subscriptions')
      .select('id')
      .eq('verification_token', rawToken)
      .maybeSingle();

    if (selectError) {
      console.error('[/api/alerts/unsubscribe] Select error:', selectError);
    }

    if (matched?.id) {
      await supabase
        .from('inventory_alert_subscriptions')
        .update({ is_active: false })
        .eq('id', matched.id);
    }

    return NextResponse.redirect(
      new URL('/inventory?alert_unsubscribed=true', reqUrl.origin),
      302
    );
  } catch (err) {
    console.error('[/api/alerts/unsubscribe] Error:', err);
    return NextResponse.redirect(
      new URL('/inventory?alert_unsubscribed=true', reqUrl.origin),
      302
    );
  }
}
