import { NextResponse } from 'next/server';
import { getModelWaitBenchmarks } from '@/lib/db/stats';
import { ApiResponse } from '@/lib/types/contracts';
import { ModelWaitBenchmark } from '@/lib/db/stats';

// Caching handled via unstable_cache (revalidate: 3600, tags: ['wait_stats']) and Cache-Control headers

export async function GET() {
  try {
    const benchmarks = await getModelWaitBenchmarks();

    return NextResponse.json<ApiResponse<Record<string, ModelWaitBenchmark>>>(
      {
        success: true,
        data: benchmarks,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) {
      throw error;
    }
    console.error('Unhandled error in GET /api/stats:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve model wait benchmarks.',
        },
      },
      { status: 500 }
    );
  }
}
