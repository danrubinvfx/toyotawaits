import { NextRequest, NextResponse } from 'next/server';
import { getSubmissionByEditToken, updateSubmissionByEditToken, getCommunitySubmissions } from '@/lib/db/submissions';
import { getModelConfig } from '@/lib/data/model-registry';
import { isLiveSupabaseConfigured, createServerClient } from '@/lib/supabase/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

async function calculateQueuePosition(
  modelSlug: string,
  province: string,
  orderDate: string,
  countryCode: string = 'CA'
): Promise<number> {
  try {
    if (isLiveSupabaseConfigured()) {
      const supabase = createServerClient();
      const { count, error } = await supabase
        .from('submissions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending')
        .eq('province', province || 'BC')
        .lte('order_date', orderDate);

      if (!error && typeof count === 'number' && count > 0) {
        return count;
      }
    } else {
      const communityRecords = await getCommunitySubmissions(countryCode);
      const aheadCount = communityRecords.filter((r) => {
        const isPending = r.status === 'pending';
        const matchesProv = (r.province || '').toUpperCase() === (province || 'BC').toUpperCase();
        const targetModel = (modelSlug || '').toLowerCase();
        const matchesModel =
          !targetModel ||
          r.modelSlug?.toLowerCase() === targetModel ||
          r.model?.toLowerCase().includes(targetModel);
        return isPending && matchesProv && matchesModel && r.orderDate <= orderDate;
      }).length;
      return Math.max(1, aheadCount + 1);
    }
  } catch {
    // fallback
  }
  return 1;
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params;
    if (!token) {
      return NextResponse.json(
        { success: false, error: { message: 'Token is required' } },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const submission = await getSubmissionByEditToken(token);
    if (!submission) {
      return NextResponse.json(
        { success: false, error: { message: 'Order submission not found or link has expired.' } },
        { status: 404, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const modelSlug = submission.modelSlug || 'rav4';
    const modelConfig = getModelConfig(modelSlug);
    const provincialMedianDays = modelConfig?.baseMedian || 180;
    const province = submission.province || submission.state || 'BC';
    const queuePosition = await calculateQueuePosition(
      modelSlug,
      province,
      submission.orderDate,
      submission.countryCode || 'CA'
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          id: submission.id,
          token,
          orderDate: submission.orderDate,
          deliveryDate: submission.deliveryDate,
          model: submission.model,
          modelSlug,
          powertrain: submission.powertrain,
          trim: submission.trim,
          province,
          status: submission.status,
          currentStage: submission.currentStage || submission.stage,
          stage: submission.stage || submission.currentStage || 'deposit_placed',
          queuePosition,
          provincialMedianDays,
          waitDays: submission.waitDays,
        },
      },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err: any) {
    console.error('Error in GET /api/update-status/[token]:', err);
    return NextResponse.json(
      { success: false, error: { message: err?.message || 'Failed to fetch order status.' } },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params;
    if (!token) {
      return NextResponse.json(
        { success: false, error: { message: 'Token is required' } },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const existing = await getSubmissionByEditToken(token);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: { message: 'Order submission not found or link has expired.' } },
        { status: 404, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // Body may be empty if called via query params
    }

    const rawAction = body.milestone || body.stage || body.status || request.nextUrl.searchParams.get('action') || request.nextUrl.searchParams.get('milestone');
    if (!rawAction) {
      return NextResponse.json(
        { success: false, error: { message: 'Milestone or status action is required.' } },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const action = String(rawAction).toLowerCase().trim();
    const todayYmd = new Date().toISOString().split('T')[0];

    let updateStatus: 'pending' | 'delivered' | 'cancelled' = 'pending';
    let updateStage = 'deposit_placed';
    let deliveryDate: string | null = null;

    if (action === 'deposit_placed' || action === 'still_waiting') {
      updateStatus = 'pending';
      updateStage = 'deposit_placed';
    } else if (action === 'build_assigned' || action === 'vin_assigned' || action === 'allocation_confirmed') {
      updateStatus = 'pending';
      updateStage = 'build_assigned';
    } else if (action === 'in_transit' || action === 'freight_transit') {
      updateStatus = 'pending';
      updateStage = 'in_transit';
    } else if (action === 'delivered') {
      updateStatus = 'delivered';
      updateStage = 'delivered';
      deliveryDate = body.deliveryDate || todayYmd;
    } else if (action === 'canceled' || action === 'cancelled') {
      updateStatus = 'cancelled';
      updateStage = 'canceled';
    } else {
      return NextResponse.json(
        { success: false, error: { message: `Invalid milestone: ${action}` } },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const updated = await updateSubmissionByEditToken(token, {
      status: updateStatus,
      stage: updateStage,
      deliveryDate,
      notes: body.notes !== undefined ? body.notes : existing.notes,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: { message: 'Failed to update order status.' } },
        { status: 500, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // Cache revalidation
    try {
      revalidateTag('submissions', 'max');
      (revalidateTag as any)('submissions');
      revalidateTag('stats', 'max');
      revalidateTag('recent_submissions', 'max');
      revalidatePath('/');
      revalidatePath('/api/submissions');
      revalidatePath(`/update-status/${token}`);
    } catch {
      // test environment fallback
    }

    const modelSlug = existing.modelSlug || 'rav4';
    const modelConfig = getModelConfig(modelSlug);
    const provincialMedianDays = modelConfig?.baseMedian || 180;
    const province = existing.province || existing.state || 'BC';
    const queuePosition = await calculateQueuePosition(
      modelSlug,
      province,
      existing.orderDate,
      existing.countryCode || 'CA'
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          id: updated.id,
          token,
          status: updated.status,
          stage: updated.stage || updateStage,
          deliveryDate: updated.deliveryDate,
          waitDays: updated.waitDays,
          queuePosition,
          provincialMedianDays,
          model: existing.model,
          modelSlug,
          province,
          message: 'Status updated successfully.',
        },
      },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err: any) {
    console.error('Error in POST /api/update-status/[token]:', err);
    return NextResponse.json(
      { success: false, error: { message: err?.message || 'Failed to update order status.' } },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
