import { NextRequest, NextResponse } from 'next/server';
import { affiliateSlugSchema } from '@/lib/validations/schemas';
import { getAffiliateRedirect } from '@/lib/db/affiliates';
import { createServerClient } from '@/lib/supabase/server';
import { buildAmazonDeepLinks, buildAmazonAffiliateUrl } from '@/lib/gear/affiliate';

export const dynamic = 'force-dynamic';

export const MUSLOGY_DIRECT_URLS: Record<string, string> = {
  'muslogy-rav4':
    'https://muslogy.net/discount/Toyotawaits?redirect=/products/muslogy-center-console-organizer-for-2026-toyota-rav4-accessories-black&rs_ref=3f6lkniA',
  'muslogy-armrest-cover':
    'https://muslogy.net/discount/Toyotawaits?redirect=/products/muslogy-center-console-armrest-cover-compatible-with-toyota-rav4-2019-2025-comfort-armrest-pad-arm-rest-cushion-vegan-leather-protector-1-inch-extra-thick&rs_ref=3f6lkniA',
  'muslogy-sienna':
    'https://muslogy.net/discount/Toyotawaits?redirect=/products/muslogy-hidden-storage-compartment-for-2021-2025-2026-toyota-sienna-2pcs&rs_ref=3f6lkniA',
  'muslogy-console':
    'https://muslogy.net/discount/Toyotawaits?redirect=/products/muslogy-hidden-storage-compartment-for-2021-2025-2026-toyota-sienna-2pcs&rs_ref=3f6lkniA',
  'muslogy-grand-highlander':
    'https://muslogy.net/discount/Toyotawaits?redirect=/collections/highlander&rs_ref=3f6lkniA',
  'muslogy-rav4-cargo-net':
    'https://muslogy.net/discount/Toyotawaits?redirect=/collections/cargo-net&rs_ref=3f6lkniA',
  'muslogy-sienna-cargo-net':
    'https://muslogy.net/discount/Toyotawaits?redirect=/collections/cargo-net&rs_ref=3f6lkniA',
  'muslogy-cargo-net':
    'https://muslogy.net/discount/Toyotawaits?redirect=/collections/cargo-net&rs_ref=3f6lkniA',
  'muslogy-grand-highlander-cargo-net':
    'https://muslogy.net/discount/Toyotawaits?redirect=/collections/cargo-net&rs_ref=3f6lkniA',
};

export const OUT_PROXY_URLS: Record<string, string> = {
  'spigen-screen-protector': buildAmazonAffiliateUrl(
    'Toyota tempered glass screen protector matte 9H',
    'CA'
  ),
  'spigen-toyota-screen-protector': buildAmazonAffiliateUrl(
    'Toyota tempered glass screen protector matte 9H',
    'CA'
  ),
  'faraday-key-pouch': buildAmazonAffiliateUrl(
    'Faraday pouch for car keys signal blocker 2-pack',
    'CA'
  ),
  'faraday-key-fob-pouch': buildAmazonAffiliateUrl(
    'Faraday pouch for car keys signal blocker 2-pack',
    'CA'
  ),
  'portable-tire-inflator': buildAmazonAffiliateUrl(
    'portable cordless tire inflator 150 PSI auto shut off',
    'CA'
  ),
  'fanttik-cordless-tire-inflator': buildAmazonAffiliateUrl(
    'portable cordless tire inflator 150 PSI auto shut off',
    'CA'
  ),
};

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
    if (MUSLOGY_DIRECT_URLS[validatedSlug]) {
      destinationUrl = MUSLOGY_DIRECT_URLS[validatedSlug];
    } else if (OUT_PROXY_URLS[validatedSlug]) {
      destinationUrl = OUT_PROXY_URLS[validatedSlug];
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
      const validPlacements = ['inventory_feed', 'submission_modal', 'donation_toast', 'guide_rav4_mods', 'while_you_wait', 'guide_ecp_warranty', 'guide_warranty'];
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

    // Detect admin opt-out flag from query params or cookies
    const isOptOut =
      searchParams.get('opt_out') === 'true' ||
      searchParams.get('tw_admin_opt_out') === 'true' ||
      request.cookies.get('opt_out')?.value === 'true' ||
      request.cookies.get('tw_admin_opt_out')?.value === 'true';

    // Detect market context from URL param, cookie, or hostname
    const marketParam = searchParams.get('market')?.toUpperCase();
    const cookieMarket = request.cookies.get('toyotawaits_market')?.value?.toUpperCase();
    const host = request.headers.get('host') || '';
    const isUS = marketParam === 'US' || cookieMarket === 'US' || host.includes('toyotawaits.com');

    // 3. Safe Outbound Link Handler & Geolocation Strategy:
    // Route to Amazon.com with US tag (toyotawaits07-20) for US visitors,
    // Amazon.ca with CA tag (toyotawaits-20) for CA visitors.
    // If admin opt-out is present, strip affiliate tracking tags completely.
    if (destinationUrl.includes('amazon.')) {
      try {
        const urlObj = new URL(destinationUrl);
        urlObj.hostname = isUS ? 'www.amazon.com' : 'www.amazon.ca';

        if (isOptOut) {
          urlObj.searchParams.delete('tag');
          urlObj.searchParams.delete('linkCode');
          urlObj.searchParams.delete('ascsubtag');
        } else {
          const marketTag = isUS
            ? process.env.NEXT_PUBLIC_AMAZON_US_TAG ||
              process.env.NEXT_PUBLIC_AMAZON_US_AFFILIATE_TAG ||
              'toyotawaits07-20'
            : process.env.NEXT_PUBLIC_AMAZON_CA_TAG ||
              process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG ||
              process.env.AMAZON_AFFILIATE_TAG ||
              'toyotawaits-20';

          urlObj.searchParams.set('tag', marketTag);
        }
        destinationUrl = urlObj.toString();
      } catch {
        // preserve original URL if parsing fails
      }
    } else if (isOptOut) {
      try {
        const urlObj = new URL(destinationUrl);
        urlObj.searchParams.delete('tag');
        urlObj.searchParams.delete('linkCode');
        urlObj.searchParams.delete('ascsubtag');
        destinationUrl = urlObj.toString();
      } catch {
        // preserve original URL if parsing fails
      }
    }

    // 4. Mobile OS-aware deep-link dispatching for Amazon affiliate destinations
    const userAgent = request.headers.get('user-agent') || '';
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !userAgent.includes('MSStream');

    if (destinationUrl.includes('amazon.')) {
      const deepLinks = buildAmazonDeepLinks(destinationUrl);

      // Android: Redirect to intent URI with 307 (native app launch or fallback)
      if (isAndroid) {
        const androidResponse = NextResponse.redirect(deepLinks.androidIntentUrl, {
          status: 307,
        });
        androidResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        androidResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
        return androidResponse;
      }

      // iOS: Handle iOS scheme bounce with mobile web fallback
      if (isIOS) {
        const acceptHeader = request.headers.get('accept') || '';
        const shouldBounce =
          searchParams.get('bounce') !== 'false' &&
          searchParams.get('direct') !== 'true' &&
          !acceptHeader.includes('application/json');

        if (shouldBounce) {
          const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Opening Amazon Shopping...</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="2;url=${deepLinks.webUrl}">
</head>
<body style="background:#09090b;color:#fff;font-family:-apple-system,BlinkMacSystemFont,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;padding:20px;text-align:center;">
  <div>
    <p style="font-size:15px;color:#a1a1aa;margin-bottom:12px;">Opening Amazon Shopping app...</p>
    <a href="${deepLinks.webUrl}" style="color:#f59e0b;font-size:13px;text-decoration:none;">Tap here if you are not redirected</a>
  </div>
  <script>
    var start = Date.now();
    window.location.href = ${JSON.stringify(deepLinks.iosSchemeUrl)};
    setTimeout(function() {
      if (Date.now() - start < 1500) {
        window.location.href = ${JSON.stringify(deepLinks.webUrl)};
      }
    }, 1200);
  </script>
</body>
</html>`;

          return new NextResponse(html, {
            status: 200,
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'no-store, no-cache, must-revalidate',
              'Referrer-Policy': 'strict-origin-when-cross-origin',
            },
          });
        }
      }
    }

    // 5. Return 307 Temporary Redirect with strict privacy headers (desktop & fallback)
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
