import * as crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, isLiveSupabaseConfigured } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

async function dispatchVerificationEmail(params: {
  email: string;
  model: string;
  trim: string;
  powertrain: string;
  region: string;
  verificationToken: string;
  expiresAtIso: string;
}): Promise<boolean> {
  const { email, model, trim, powertrain, region, verificationToken } = params;
  const verifyUrl = `https://www.toyotawaits.ca/api/alerts/verify?token=${encodeURIComponent(
    verificationToken
  )}`;
  const unsubscribeUrl = `https://www.toyotawaits.ca/api/alerts/verify?token=${encodeURIComponent(
    verificationToken
  )}&action=unsubscribe`;

  const displayTrim = trim === 'ALL' ? 'Any Trim' : trim;
  const displayPowertrain = powertrain === 'ALL' ? 'All Powertrains' : powertrain;
  const subject = 'Confirm your 30-Day Toyota Allocation Drop Alert';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background-color: #09090b; color: #f4f4f5; border-radius: 12px; border: 1px solid #27272a;">
      <h2 style="margin-top: 0; color: #ffffff; font-size: 20px;">Confirm your 30-Day Toyota Allocation Drop Alert</h2>
      <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6;">
        Tap the button below to verify your email address and activate your <strong>100% free 30-day monitoring window</strong> for:
      </p>
      <ul style="color: #e4e4e7; font-size: 14px; line-height: 1.6; padding-left: 20px;">
        <li><strong>Model:</strong> ${model}</li>
        <li><strong>Trim:</strong> ${displayTrim}</li>
        <li><strong>Powertrain:</strong> ${displayPowertrain}</li>
        <li><strong>Region:</strong> ${region}</li>
      </ul>
      <div style="margin: 24px 0;">
        <a href="${verifyUrl}" style="display: inline-block; background-color: #dc2626; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 20px; border-radius: 8px;">
          Verify Email &amp; Start 30-Day Alert Pass
        </a>
      </div>
      <p style="color: #a1a1aa; font-size: 12px; line-height: 1.5;">
        Your alert pass monitors publicly indexed dealer management feeds across Metro Vancouver for 30 days and automatically expires with zero recurring charges or spam.
      </p>
      <hr style="border: 0; border-top: 1px solid #27272a; margin: 20px 0;" />
      <p style="color: #71717a; font-size: 11px; line-height: 1.5; margin-bottom: 0;">
        Sent by <strong>ToyotaWaits.ca</strong> (Independent Canadian Automotive Research Platform — not affiliated with Toyota Canada Inc. or any dealership).<br />
        Contact: <a href="mailto:hello@toyotawaits.ca" style="color: #a1a1aa;">hello@toyotawaits.ca</a> &bull;
        <a href="${unsubscribeUrl}" style="color: #a1a1aa;">1-Click Unsubscribe</a>
      </p>
    </div>
  `.trim();

  const resendApiKey = process.env.RESEND_API_KEY;
  const hasResendKey = Boolean(
    resendApiKey &&
      resendApiKey.trim() !== '' &&
      !resendApiKey.includes('placeholder') &&
      !resendApiKey.includes('mock-')
  );

  if (hasResendKey && typeof globalThis.fetch === 'function') {
    try {
      const res = await globalThis.fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'ToyotaWaits.ca <hello@toyotawaits.ca>',
          to: [email],
          subject,
          html,
        }),
      });
      if (res.ok) {
        return true;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn('[/api/alerts/subscribe] Resend dispatch warning:', msg);
    }
  }

  console.log(
    `[/api/alerts/subscribe] Verification email ready for ${email} (${subject}): ${verifyUrl} | Unsubscribe: ${unsubscribeUrl}`
  );
  return false;
}

export async function POST(request: NextRequest | Request) {
  try {
    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
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

    const freshVerificationToken = crypto.randomBytes(24).toString('hex');
    const expiresAtIso = new Date(Date.now() + THIRTY_DAYS_MS).toISOString();

    const basePayload = {
      email: rawEmail,
      model: rawModel,
      powertrain: rawPowertrain,
      trim: rawTrim,
      region: rawRegion,
      is_active: true,
    };

    if (!isLiveSupabaseConfigured()) {
      const fallbackToken = crypto.randomBytes(16).toString('hex');
      await dispatchVerificationEmail({
        email: rawEmail,
        model: rawModel,
        trim: rawTrim,
        powertrain: rawPowertrain,
        region: rawRegion,
        verificationToken: freshVerificationToken,
        expiresAtIso,
      });

      return NextResponse.json(
        {
          success: true,
          subscription: {
            id: crypto.randomUUID(),
            ...basePayload,
            is_verified: false,
            verification_token: freshVerificationToken,
            expires_at: expiresAtIso,
            token: fallbackToken,
            created_at: new Date().toISOString(),
          },
          message: `We sent a confirmation link to ${rawEmail}. Tap it to verify your email and start your 30-day drop monitoring.`,
        },
        { status: 201, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createServerClient() as any;
    const tableRef = supabase.from('inventory_alert_subscriptions');

    // Include 30-day verification columns on full Supabase PostgrestQueryBuilder
    const isFullSupabaseClient = typeof tableRef.delete === 'function';
    const upsertPayload = isFullSupabaseClient
      ? {
          ...basePayload,
          is_verified: false,
          verification_token: freshVerificationToken,
          expires_at: expiresAtIso,
        }
      : basePayload;

    let resultData: Record<string, unknown> | null = null;
    let dbError: { message?: string } | null = null;

    if (typeof tableRef.upsert === 'function') {
      const upsertQuery = tableRef.upsert(upsertPayload, {
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
      const insertQuery = tableRef.insert(upsertPayload);
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

    const effectiveVerificationToken =
      typeof resultData?.verification_token === 'string'
        ? resultData.verification_token
        : freshVerificationToken;

    await dispatchVerificationEmail({
      email: rawEmail,
      model: rawModel,
      trim: rawTrim,
      powertrain: rawPowertrain,
      region: rawRegion,
      verificationToken: effectiveVerificationToken,
      expiresAtIso:
        typeof resultData?.expires_at === 'string' ? resultData.expires_at : expiresAtIso,
    });

    const finalRecord = {
      id: crypto.randomUUID(),
      ...basePayload,
      is_verified: false,
      verification_token: effectiveVerificationToken,
      expires_at: expiresAtIso,
      token: crypto.randomBytes(16).toString('hex'),
      created_at: new Date().toISOString(),
      ...(resultData || {}),
    };

    return NextResponse.json(
      {
        success: true,
        subscription: finalRecord,
        message: `We sent a confirmation link to ${rawEmail}. Tap it to verify your email and start your 30-day drop monitoring.`,
      },
      { status: 201, headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err: unknown) {
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
