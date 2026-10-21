import { NextRequest, NextResponse } from 'next/server';
import { getAggregatedTickerItems } from '@/lib/data/ticker';
import { ApiResponse } from '@/lib/types/contracts';
import { TickerItem } from '@/types/ticker';

export const dynamic = 'force-dynamic';

export async function GET(request?: NextRequest) {
  try {
    let limit = 16;
    let countryCode = 'CA';

    if (request && request.url) {
      try {
        const { searchParams } = new URL(request.url);
        const limitParam = searchParams.get('limit');
        if (limitParam) {
          const parsed = parseInt(limitParam, 10);
          if (!isNaN(parsed) && parsed > 0) {
            limit = Math.min(parsed, 50);
          }
        }

        const countryParam =
          searchParams.get('country') || searchParams.get('country_code') || searchParams.get('region');
        const headerRegion = request.headers.get('x-region');
        countryCode = (countryParam || headerRegion) === 'US' ? 'US' : 'CA';
      } catch {
        // Fallback to defaults
      }
    }

    const items = await getAggregatedTickerItems(limit, countryCode);

    return NextResponse.json<ApiResponse<TickerItem[]>>(
      {
        success: true,
        data: items,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (error: any) {
    console.error('Unhandled error in GET /api/ticker:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve ticker items.',
        },
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  }
}
