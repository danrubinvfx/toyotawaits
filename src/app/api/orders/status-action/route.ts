import { NextRequest, NextResponse } from 'next/server';
import { handleNudgeAction } from '@/lib/db/submissions';
import { NudgeAction } from '@/lib/types/contracts';
import { nudgeActionSchema } from '@/lib/validations/schemas';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const actionParam = searchParams.get('action');

  if (!token || !actionParam) {
    const errorUrl = new URL('/orders/status-updated', request.url);
    errorUrl.searchParams.set('error', 'missing_params');
    return NextResponse.redirect(errorUrl, 303);
  }

  const validation = nudgeActionSchema.safeParse(actionParam);
  if (!validation.success) {
    const errorUrl = new URL('/orders/status-updated', request.url);
    errorUrl.searchParams.set('error', 'invalid_action');
    return NextResponse.redirect(errorUrl, 303);
  }

  const action = validation.data as NudgeAction;
  const result = await handleNudgeAction(token, action);

  const redirectUrl = new URL('/orders/status-updated', request.url);

  if (!result.success) {
    redirectUrl.searchParams.set('error', 'not_found');
    redirectUrl.searchParams.set('token', token);
    return NextResponse.redirect(redirectUrl, 303);
  }

  redirectUrl.searchParams.set('action', action);
  redirectUrl.searchParams.set('token', token);
  if (result.submission?.model) {
    redirectUrl.searchParams.set('model', result.submission.model);
  }
  if (result.submission?.trim) {
    redirectUrl.searchParams.set('trim', result.submission.trim);
  }
  if (result.submission?.province) {
    redirectUrl.searchParams.set('province', result.submission.province);
  }
  if (result.submission?.waitDays != null) {
    redirectUrl.searchParams.set('waitDays', String(result.submission.waitDays));
  }
  if (result.submission?.deliveryDate) {
    redirectUrl.searchParams.set('deliveryDate', result.submission.deliveryDate);
  }

  return NextResponse.redirect(redirectUrl, 303);
}

export async function POST(request: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // Fallback to URL search params
    }

    const { searchParams } = new URL(request.url);
    const token = body.token || searchParams.get('token');
    const actionParam = body.action || searchParams.get('action');

    if (!token || !actionParam) {
      return NextResponse.json(
        { success: false, error: 'Missing token or action.' },
        { status: 400 }
      );
    }

    const validation = nudgeActionSchema.safeParse(actionParam);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Must be still_waiting, delivered, or cancelled.' },
        { status: 400 }
      );
    }

    const result = await handleNudgeAction(token, validation.data);
    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (error: any) {
    console.error('Error in POST /api/orders/status-action:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing status action.' },
      { status: 500 }
    );
  }
}
