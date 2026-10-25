import * as crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, isLiveSupabaseConfigured } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export async function POST(request: NextRequest | Request) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Malformed JSON payload in request body.',
        },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const rawEmail = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const rawModel = typeof body?.model === 'string' ? body.model.trim() : '';
    const rawPowertrain =
      typeof body?.powertrain === 'string' && body.powertrain.trim()
        ? body.powertrain.trim()
        : 'ALL';
    const rawTrim =
      typeof body?.trim === 'string' && body.trim.trim() ? body.trim.trim() : 'ALL';
    const rawRegion =
      typeof body?.region === 'string' && body.region.trim()
        ? body.region.trim()
        : 'Lower Mainland, BC';

    if (!rawEmail || !EMAIL_REGEX.test(rawEmail)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please enter a valid email address.',
        },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    if (!rawModel) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please select a vehicle model to monitor.',
        },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const subscriptionPayload = {
      email: rawEmail,
      model: rawModel,
      powertrain: rawPowertrain,
      trim: rawTrim,
      region: rawRegion,
      is_active: true,
    };

    if (!isLiveSupabaseConfigured()) {
      const fallbackToken = crypto.randomBytes(16).toString('hex');
      return NextResponse.json(
        {
          success: true,
          subscription: {
            id: crypto.randomUUID(),
            ...subscriptionPayload,
            token: fallbackToken,
            created_at: new Date().toISOString(),
          },
          message: `Drop alert active! We'll email ${rawEmail} as soon as a matching ${rawModel} (${rawTrim === 'ALL' ? 'Any Trim' : rawTrim}) lands in ${rawRegion}.`,
        },
        { status: 201, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const supabase = createServerClient() as any;
    const tableRef = supabase.from('inventory_alert_subscriptions');

    let resultData: any = null;
    let dbError: any = null;

    if (typeof tableRef.upsert === 'function') {
      const upsertQuery = tableRef.upsert(subscriptionPayload, {
        onConflict: 'email,model,powertrain,trim,region',
      });

      if (upsertQuery && typeof upsertQuery.select === 'function') {
        const selected = upsertQuery.select('*');
        if (selected && typeof selected.single === 'function') {
          const { data, error } = await selected.single();
          resultData = data;
          dbError = error;
        } else if (selected && typeof selected.maybeSingle === 'function') {
          const { data, error } = await selected.maybeSingle();
          resultData = data;
          dbError = error;
        } else {
          const { data, error } = await selected;
          resultData = Array.isArray(data) ? data[0] : data;
          dbError = error;
        }
      } else {
        const { data, error } = await upsertQuery;
        resultData = Array.isArray(data) ? data[0] : data;
        dbError = error;
      }
    } else if (typeof tableRef.insert === 'function') {
      const insertQuery = tableRef.insert(subscriptionPayload);
      if (insertQuery && typeof insertQuery.select === 'function') {
        const selected = insertQuery.select('*');
        if (selected && typeof selected.single === 'function') {
          const { data, error } = await selected.single();
          resultData = data;
          dbError = error;
        } else {
          const { data, error } = await selected;
          resultData = Array.isArray(data) ? data[0] : data;
          dbError = error;
        }
      } else {
        const { data, error } = await insertQuery;
        resultData = Array.isArray(data) ? data[0] : data;
        dbError = error;
      }
    }

    if (dbError) {
      return NextResponse.json(
        {
          success: false,
          error: dbError.message || 'Failed to save inventory alert subscription.',
        },
        { status: 500, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const finalRecord = resultData || {
      id: crypto.randomUUID(),
      ...subscriptionPayload,
      token: crypto.randomBytes(16).toString('hex'),
      created_at: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        subscription: finalRecord,
        message: `Drop alert active! We'll email ${rawEmail} as soon as a matching ${rawModel} (${rawTrim === 'ALL' ? 'Any Trim' : rawTrim}) lands in ${rawRegion}.`,
      },
      { status: 201, headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err: any) {
    console.error('[/api/alerts/subscribe] Error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred while saving your alert subscription.',
      },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
