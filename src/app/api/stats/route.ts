import { NextResponse } from 'next/server';
import { getModelWaitBenchmarks, ACTIVE_TRACKED_MODELS } from '@/lib/db/stats';
import { ApiResponse } from '@/lib/types/contracts';
import { ModelWaitBenchmark } from '@/lib/db/stats';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const benchmarks = await getModelWaitBenchmarks();

    // Ensure orphan or mock models (e.g. Tacoma) are purged from public aggregate counts
    const filteredBenchmarks: Record<string, ModelWaitBenchmark> = {};
    for (const [key, val] of Object.entries(benchmarks)) {
      const lower = key.toLowerCase();
      if ((ACTIVE_TRACKED_MODELS as readonly string[]).includes(lower) && lower !== 'tacoma') {
        filteredBenchmarks[lower] = val;
      }
    }

    return NextResponse.json<ApiResponse<Record<string, ModelWaitBenchmark>>>(
      {
        success: true,
        data: filteredBenchmarks,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=600',
          'CDN-Cache-Control': 'public, s-maxage=60, stale-while-revalidate=600',
          'Vercel-CDN-Cache-Control': 'public, s-maxage=60, stale-while-revalidate=600',
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
