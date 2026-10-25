import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, isLiveSupabaseConfigured } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest | Request) {
  const reqUrl = new URL(request.url);
  const rawToken = reqUrl.searchParams.get('token')?.trim() || '';
  const action = reqUrl.searchParams.get('action')?.trim().toLowerCase() || 'verify';

  if (!rawToken) {
    return NextResponse.json(
      {
        success: false,
        error: 'Verification token is required.',
      },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  if (!isLiveSupabaseConfigured()) {
    const targetPath =
      action === 'unsubscribe'
        ? '/inventory?alert_unsubscribed=true'
        : '/inventory?alert_verified=true';
    return NextResponse.redirect(new URL(targetPath, reqUrl.origin), 302);
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createServerClient() as any;
    const nowIso = new Date().toISOString();
    const expiresAtIso = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    // Match active record by verification_token
    const { data: matched, error: selectError } = await supabase
      .from('inventory_alert_subscriptions')
      .select('*')
      .eq('verification_token', rawToken)
      .eq('is_active', true)
      .maybeSingle();

    if (selectError) {
      console.error('[/api/alerts/verify] Select error:', selectError);
      return NextResponse.json(
        {
          success: false,
          error: 'Could not verify subscription token.',
        },
        { status: 500, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    if (!matched) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or expired verification token.',
        },
        { status: 404, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    if (action === 'unsubscribe') {
      const { error: unsubError } = await supabase
        .from('inventory_alert_subscriptions')
        .update({
          is_active: false,
        })
        .eq('id', matched.id);

      if (unsubError) {
        return NextResponse.json(
          {
            success: false,
            error: 'Failed to unsubscribe alert pass.',
          },
          { status: 500, headers: { 'Cache-Control': 'no-store' } }
        );
      }

      return NextResponse.redirect(
        new URL('/inventory?alert_unsubscribed=true', reqUrl.origin),
        302
      );
    }

    const { error: updateError } = await supabase
      .from('inventory_alert_subscriptions')
      .update({
        is_verified: true,
        verified_at: nowIso,
        expires_at: matched.expires_at || expiresAtIso,
      })
      .eq('id', matched.id);

    if (updateError) {
      console.error('[/api/alerts/verify] Update error:', updateError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to activate 30-day alert pass.',
        },
        { status: 500, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    return NextResponse.redirect(
      new URL('/inventory?alert_verified=true', reqUrl.origin),
      302
    );
  } catch (err: unknown) {
    console.error('[/api/alerts/verify] Unexpected error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred during email verification.',
      },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
