import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, isLiveSupabaseConfigured } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest | Request) {
  const reqUrl = new URL(request.url);
  const rawToken = reqUrl.searchParams.get('token')?.trim() || '';

  if (!rawToken) {
    return NextResponse.json(
      { success: false, error: 'Unsubscribe token is required.' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  if (!isLiveSupabaseConfigured()) {
    return NextResponse.redirect(new URL('/?newsletter=unsubscribed', reqUrl.origin), 302);
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createServerClient() as any;

    const { data: matched, error: selectError } = await supabase
      .from('newsletter_subscriptions')
      .select('id')
      .eq('unsubscribe_token', rawToken)
      .maybeSingle();

    if (selectError) {
      console.error('[/api/newsletter/unsubscribe] Select error:', selectError.message);
      return NextResponse.json(
        { success: false, error: 'Could not process unsubscribe request.' },
        { status: 500, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    if (!matched) {
      return NextResponse.json(
        { success: false, error: 'Invalid unsubscribe token.' },
        { status: 404, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const { error: updateError } = await supabase
      .from('newsletter_subscriptions')
      .update({
        is_active: false,
      })
      .eq('id', matched.id);

    if (updateError) {
      console.error('[/api/newsletter/unsubscribe] Update error:', updateError.message);
      return NextResponse.json(
        { success: false, error: 'Failed to unsubscribe from newsletter.' },
        { status: 500, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    return NextResponse.redirect(new URL('/?newsletter=unsubscribed', reqUrl.origin), 302);
  } catch (err: unknown) {
    console.error('[/api/newsletter/unsubscribe] Unexpected error:', err instanceof Error ? err.message : 'Unknown error');
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred during unsubscribe.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
