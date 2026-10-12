import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { ACTIVE_TRACKED_MODELS } from '@/lib/db/stats';
import { INITIAL_COMMUNITY_RECORDS } from '@/lib/data/community-records';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // If live Supabase connection is active
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock-')
    ) {
      try {
        const supabase = createServerClient();
        const { data, error } = await supabase
          .from('submissions')
          .select(`
            id,
            status,
            wait_days,
            vehicle_models!inner(slug, name)
          `)
          .or('is_flagged.eq.false,is_flagged.is.null')
          .in('status', ['delivered', 'pending'])
          .in('vehicle_models.slug', [...ACTIVE_TRACKED_MODELS]);

        if (!error && Array.isArray(data)) {
          const totalTracked = data.length;
          const delivered = data.filter((d: any) => d.status === 'delivered').length;
          const pending = data.filter((d: any) => d.status === 'pending').length;

          const modelBreakdown: Record<string, { total: number; delivered: number; pending: number }> = {};
          for (const m of ACTIVE_TRACKED_MODELS) {
            const forModel = data.filter((d: any) => d.vehicle_models?.slug === m);
            modelBreakdown[m] = {
              total: forModel.length,
              delivered: forModel.filter((d: any) => d.status === 'delivered').length,
              pending: forModel.filter((d: any) => d.status === 'pending').length,
            };
          }

          return NextResponse.json({
            success: true,
            data: {
              totalTracked,
              delivered,
              pending,
              activeTrackedModels: [...ACTIVE_TRACKED_MODELS],
              modelBreakdown,
              excludedModels: ['tacoma', 'corolla-cross'],
            },
          });
        }
      } catch (err) {
        console.warn('Analytics Supabase fallback to in-memory public records:', err);
      }
    }

    // Fallback directly using verified public records matching the public delivery log
    const activeRecords = INITIAL_COMMUNITY_RECORDS.filter((r) =>
      (ACTIVE_TRACKED_MODELS as readonly string[]).includes(r.modelSlug)
    );
    const delivered = activeRecords.filter((r) => r.status === 'delivered').length;
    const pending = activeRecords.filter((r) => r.status === 'pending').length;

    const modelBreakdown: Record<string, { total: number; delivered: number; pending: number }> = {};
    for (const m of ACTIVE_TRACKED_MODELS) {
      const forModel = activeRecords.filter((r) => r.modelSlug === m);
      modelBreakdown[m] = {
        total: forModel.length,
        delivered: forModel.filter((r) => r.status === 'delivered').length,
        pending: forModel.filter((r) => r.status === 'pending').length,
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        totalTracked: activeRecords.length,
        delivered,
        pending,
        activeTrackedModels: [...ACTIVE_TRACKED_MODELS],
        modelBreakdown,
        excludedModels: ['tacoma', 'corolla-cross'],
      },
    });
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) {
      throw error;
    }
    console.error('Unhandled error in GET /api/analytics:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'ANALYTICS_FAILED',
          message: 'Failed to retrieve aggregate analytics.',
        },
      },
      { status: 500 }
    );
  }
}
