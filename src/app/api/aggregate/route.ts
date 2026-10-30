import { NextRequest, NextResponse } from 'next/server';
import { aggregateQuerySchema, US_STATES, CANADIAN_PROVINCES } from '@/lib/validations/schemas';
import { getAggregateStats } from '@/lib/db/aggregate';
import { ApiResponse, RegionalWaitSummary } from '@/lib/types/contracts';
import { ACTIVE_TRACKED_MODELS } from '@/lib/db/stats';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rawProvince = searchParams.get('province')?.trim();
    const rawState = searchParams.get('state')?.trim();
    const rawCountry = (
      searchParams.get('country_code') ||
      searchParams.get('countryCode') ||
      searchParams.get('country')
    )?.trim();
    const rawTrim = searchParams.get('trim')?.trim();

    let normalizedProvince =
      rawProvince && rawProvince.toLowerCase() !== 'all'
        ? rawProvince.toUpperCase()
        : undefined;
    let normalizedState =
      rawState && rawState.toLowerCase() !== 'all'
        ? rawState.toUpperCase()
        : undefined;
    let normalizedCountry =
      rawCountry && rawCountry.toLowerCase() !== 'all'
        ? rawCountry.toUpperCase()
        : undefined;

    // Harmonize US State passed in province parameter or Canadian province passed in state parameter
    if (normalizedProvince && (US_STATES as readonly string[]).includes(normalizedProvince)) {
      normalizedState = normalizedState || normalizedProvince;
      normalizedProvince = undefined;
      normalizedCountry = normalizedCountry || 'US';
    } else if (normalizedState && (CANADIAN_PROVINCES as readonly string[]).includes(normalizedState)) {
      normalizedProvince = normalizedProvince || normalizedState;
      normalizedState = undefined;
      normalizedCountry = normalizedCountry || 'CA';
    }

    if (normalizedState && !normalizedCountry) {
      normalizedCountry = 'US';
    } else if (normalizedProvince && !normalizedCountry) {
      normalizedCountry = 'CA';
    }

    const queryParams = {
      model: searchParams.get('model')?.trim() || undefined,
      powertrain: searchParams.get('powertrain')?.trim() || undefined,
      province: normalizedProvince,
      state: normalizedState,
      country_code: normalizedCountry,
      trim:
        rawTrim && rawTrim.toLowerCase() !== 'all'
          ? rawTrim
          : undefined,
      timeframe: searchParams.get('timeframe')?.trim() || undefined,
    };

    const validation = aggregateQuerySchema.safeParse(queryParams);
    if (!validation.success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: 'INVALID_QUERY_PARAMS',
            message: 'Invalid parameters for aggregate analytics.',
            details: validation.error.flatten().fieldErrors as any,
          },
        },
        { status: 400 }
      );
    }

    const normalizedModel = validation.data.model.toLowerCase();
    if (!(ACTIVE_TRACKED_MODELS as readonly string[]).includes(normalizedModel)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: 'MODEL_NOT_TRACKED',
            message: `Model '${validation.data.model}' is not an actively tracked vehicle model.`,
          },
        },
        { status: 400 }
      );
    }

    const stats = await getAggregateStats(validation.data);

    return NextResponse.json<ApiResponse<RegionalWaitSummary>>(
      {
        success: true,
        data: stats,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
          'CDN-Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
          'Vercel-CDN-Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
        },
      }
    );
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) {
      throw error;
    }
    console.error('Unhandled error in GET /api/aggregate:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to compute aggregate analytics.',
        },
      },
      { status: 500 }
    );
  }
}
