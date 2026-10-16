import { NextRequest, NextResponse } from 'next/server';
import { affiliateSlugSchema } from '@/lib/validations/schemas';
import { getAffiliateRedirect } from '@/lib/db/affiliates';

export const dynamic = 'force-dynamic';

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

    // 2. Query target redirect URL
    let destinationUrl = await getAffiliateRedirect(validation.data.slug);

    if (!destinationUrl) {
      // Safe fallback for unmapped or unknown slugs:
      // 1. If a referring page is present and same-origin, redirect safely back to it
      const referer = request.headers.get('referer');
      if (referer) {
        try {
          const refererUrl = new URL(referer);
          if (refererUrl.origin === new URL(request.url).origin) {
            return NextResponse.redirect(refererUrl, {
              status: 302,
            });
          }
        } catch {
          // Ignore invalid referer URL and fallback to root
        }
      }

      // 2. Default safe fallback to home page instead of throwing a hard 404
      return NextResponse.redirect(new URL('/', request.url), {
        status: 302,
      });
    }

    // Detect market context from URL param, cookie, or hostname
    const searchParams = request.nextUrl.searchParams;
    const marketParam = searchParams.get('market')?.toUpperCase();
    const cookieMarket = request.cookies.get('toyotawaits_market')?.value?.toUpperCase();
    const host = request.headers.get('host') || '';
    const isUS = marketParam === 'US' || cookieMarket === 'US' || host.includes('toyotawaits.com');

    // 3. Safe Outbound Link Handler & Geolocation Strategy:
    // Route to Amazon.com with US tag for US visitors, Amazon.ca with CA tag for CA visitors
    if (destinationUrl.includes('amazon.')) {
      try {
        const urlObj = new URL(destinationUrl);
        urlObj.hostname = isUS ? 'www.amazon.com' : 'www.amazon.ca';

        const hasCustomTag =
          urlObj.searchParams.has('tag') &&
          urlObj.searchParams.get('tag') !== 'toyotawaits-20';

        const marketTag = isUS
          ? process.env.NEXT_PUBLIC_AMAZON_US_TAG ||
            process.env.NEXT_PUBLIC_AMAZON_TAG ||
            'toyotawaits-20'
          : process.env.NEXT_PUBLIC_AMAZON_CA_TAG ||
            process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG ||
            process.env.AMAZON_AFFILIATE_TAG ||
            'toyotawaits-20';

        if (isUS || !urlObj.searchParams.has('tag') || !hasCustomTag) {
          urlObj.searchParams.set('tag', marketTag);
        }

        destinationUrl = urlObj.toString();
      } catch {
        // preserve original URL if parsing fails
      }
    }

    // 3. Return 307 Temporary Redirect with strict privacy headers
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
    return NextResponse.redirect(new URL('/', request.url), {
      status: 302,
    });
  }
}
