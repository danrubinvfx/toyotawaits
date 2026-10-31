import { NextRequest, NextResponse } from 'next/server';
import { affiliateSlugSchema } from '@/lib/validations/schemas';
import { getAffiliateRedirect } from '@/lib/db/affiliates';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const MUSLOGY_DISCOUNT_URL = 'https://muslogy.myshopify.com/discount/Toyotawaits?rs_ref=3f6lkniA';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    // 1. Sanitize & validate slug format (reject path traversal, upper cases, symbols)
    const validation = affiliateSlugSchema.safeParse({ slug });
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_SLUG',
            message: 'Invalid affiliate slug format.',
          },
        },
        { status: 400 }
      );
    }

    const validatedSlug = validation.data.slug;

    // 2. Query target redirect URL (with direct Muslogy partner checkout mapping)
    let destinationUrl: string | null = null;
    if (
      validatedSlug === 'muslogy-rav4' ||
      validatedSlug === 'muslogy-console' ||
      validatedSlug === 'muslogy-armrest-cover'
    ) {
      destinationUrl = MUSLOGY_DISCOUNT_URL;
    } else {
      destinationUrl = await getAffiliateRedirect(validatedSlug);
    }

    if (!destinationUrl) {
      // Safe fallback for unmapped or unknown slugs:
      // 1. If a referring page is present and same-origin, redirect safely back to it
      const referer = request.headers.get('referer');
      if (referer) {
        try {
          const refererUrl = new URL(referer);
          if (refererUrl.origin === new URL(request.url).origin) {
            return NextResponse.redirect(refererUrl, 307);
          }
        } catch {
          // Ignore invalid referer URL and fallback
        }
      }

      // 2. Safe proxy fallback: Do NOT call notFound(). Safe redirect to /winter-prep
      return NextResponse.redirect(new URL('/winter-prep', request.url), 307);
    }

    // Telemetry click logging: ensure telemetry clicks log to telemetry_affiliate_clicks
    const searchParams = request.nextUrl.searchParams;
    try {
      const placementParam = searchParams.get('placement');
      const validPlacements = ['inventory_feed', 'submission_modal', 'donation_toast', 'guide_rav4_mods', 'while_you_wait'];
      const effectivePlacement = (placementParam && validPlacements.includes(placementParam)) ? placementParam : 'while_you_wait';
      const modelContext = searchParams.get('model') || null;

      const supabase = createServerClient();
      supabase
        .from('telemetry_affiliate_clicks')
        .insert({
          accessory_id: validatedSlug,
          placement: effectivePlacement,
          model_context: modelContext,
          target_url: destinationUrl,
        })
        .then();
    } catch {
      // Non-blocking telemetry delivery
    }

    // Eliminate any Google Search wrapping on destination URL
    if (destinationUrl.includes('google.com/search')) {
      try {
        const parsedGoogle = new URL(destinationUrl);
        const q = parsedGoogle.searchParams.get('q');
        if (q && (q.startsWith('http://') || q.startsWith('https://'))) {
          destinationUrl = q;
        }
      } catch {
        // ignore parsing error
      }
    }

    // Detect market context from URL param, cookie, or hostname
    const marketParam = searchParams.get('market')?.toUpperCase();
    const cookieMarket = request.cookies.get('toyotawaits_market')?.value?.toUpperCase();
    const host = request.headers.get('host') || '';
    const isUS = marketParam === 'US' || cookieMarket === 'US' || host.includes('toyotawaits.com');

    // 3. Safe Outbound Link Handler & Geolocation Strategy:
    // Route to Amazon.com with US tag (toyotawaits07-20) for US visitors,
    // Amazon.ca with CA tag (toyotawaits-20) for CA visitors.
    // Enforce associate tag hygiene and eliminate legacy tags.
    if (destinationUrl.includes('amazon.')) {
      try {
        const urlObj = new URL(destinationUrl);
        urlObj.hostname = isUS ? 'www.amazon.com' : 'www.amazon.ca';

        const marketTag = isUS
          ? process.env.NEXT_PUBLIC_AMAZON_US_TAG ||
            process.env.NEXT_PUBLIC_AMAZON_US_AFFILIATE_TAG ||
            'toyotawaits07-20'
          : process.env.NEXT_PUBLIC_AMAZON_CA_TAG ||
            process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG ||
            process.env.AMAZON_AFFILIATE_TAG ||
            'toyotawaits-20';

        urlObj.searchParams.set('tag', marketTag);
        destinationUrl = urlObj.toString();
      } catch {
        // preserve original URL if parsing fails
      }
    }

    // 4. Return 307 Temporary Redirect with strict privacy headers
    const redirectResponse = NextResponse.redirect(destinationUrl, {
      status: 307,
    });

    redirectResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    redirectResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return redirectResponse;
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) {
      throw error;
    }
    console.error('Error handling affiliate redirect:', error);
    return NextResponse.redirect(new URL('/winter-prep', request.url), 307);
  }
}
