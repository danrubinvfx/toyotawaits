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
      // Fallback for unknown slugs: Redirect safely to home page
      return NextResponse.redirect(new URL('/', request.url), {
        status: 302,
      });
    }

    // 3. Safe Outbound Link Handler & Geolocation Strategy:
    // Default to Amazon Canada (amazon.ca) with universal OneLink tagging
    if (destinationUrl.includes('amazon.')) {
      try {
        const urlObj = new URL(destinationUrl);
        if (!urlObj.hostname.includes('amazon.ca')) {
          urlObj.hostname = 'www.amazon.ca';
        }
        const defaultTag =
          process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG ||
          process.env.AMAZON_AFFILIATE_TAG ||
          'toyotawaits-20';
        if (!urlObj.searchParams.has('tag')) {
          urlObj.searchParams.set('tag', defaultTag);
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
