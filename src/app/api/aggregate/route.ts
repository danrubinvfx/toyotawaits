import { NextRequest, NextResponse } from 'next/server';
import { aggregateQuerySchema } from '@/lib/validations/schemas';
import { getAggregateStats } from '@/lib/db/aggregate';
import { ApiResponse, RegionalWaitSummary } from '@/lib/types/contracts';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      model: searchParams.get('model') || undefined,
      powertrain: searchParams.get('powertrain') || undefined,
      province: searchParams.get('province') || undefined,
      trim: searchParams.get('trim') || undefined,
      timeframe: searchParams.get('timeframe') || undefined,
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

    const stats = await getAggregateStats(validation.data);

    return NextResponse.json<ApiResponse<RegionalWaitSummary>>(
      {
        success: true,
        data: stats,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
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
