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
          // Ignore invalid referer URL and fallback
        }
      }

      // 2. Safe proxy fallback: Redirect to /winter-prep if winter-related, else / (never throw notFound)
      const isWinter =
        validation.data.slug.includes('winter') ||
        (referer && referer.toLowerCase().includes('winter'));
      return NextResponse.redirect(new URL(isWinter ? '/winter-prep' : '/', request.url), {
        status: 302,
      });
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
    const searchParams = request.nextUrl.searchParams;
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
    return NextResponse.redirect(new URL('/', request.url), {
      status: 302,
    });
  }
}
