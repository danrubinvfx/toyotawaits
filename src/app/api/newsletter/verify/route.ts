import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, isLiveSupabaseConfigured } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest | Request) {
  const reqUrl = new URL(request.url);
  const rawToken = reqUrl.searchParams.get('token')?.trim() || '';

  if (!rawToken) {
    return NextResponse.json(
      { success: false, error: 'Verification token is required.' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  if (!isLiveSupabaseConfigured()) {
    return NextResponse.redirect(new URL('/?newsletter=verified', reqUrl.origin), 302);
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createServerClient() as any;

    const { data: matched, error: selectError } = await supabase
      .from('newsletter_subscriptions')
      .select('id')
      .eq('verification_token', rawToken)
      .maybeSingle();

    if (selectError) {
      console.error('[/api/newsletter/verify] Select error:', selectError.message);
      return NextResponse.json(
        { success: false, error: 'Could not verify subscription token.' },
        { status: 500, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    if (!matched) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired verification token.' },
        { status: 404, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const { error: updateError } = await supabase
      .from('newsletter_subscriptions')
      .update({
        is_verified: true,
        is_active: true,
        verified_at: new Date().toISOString(),
      })
      .eq('id', matched.id);

    if (updateError) {
      console.error('[/api/newsletter/verify] Update error:', updateError.message);
      return NextResponse.json(
        { success: false, error: 'Failed to activate newsletter subscription.' },
        { status: 500, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    return NextResponse.redirect(new URL('/?newsletter=verified', reqUrl.origin), 302);
  } catch (err: unknown) {
    console.error('[/api/newsletter/verify] Unexpected error:', err instanceof Error ? err.message : 'Unknown error');
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred during verification.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
