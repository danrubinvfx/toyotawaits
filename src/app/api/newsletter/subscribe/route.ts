import * as crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServerClient, isLiveSupabaseConfigured } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const VALID_COUNTRIES = new Set(['CA', 'US']);

function getBaseUrl(country: 'CA' | 'US'): string {
  return country === 'US' ? 'https://www.toyotawaits.com' : 'https://www.toyotawaits.ca';
}

function buildConfirmationEmail(params: {
  country: 'CA' | 'US';
  verificationToken: string;
  unsubscribeToken: string;
}) {
  const { country, verificationToken, unsubscribeToken } = params;
  const baseUrl = getBaseUrl(country);
  const verifyUrl = `${baseUrl}/api/newsletter/verify?token=${encodeURIComponent(verificationToken)}`;
  const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;
  const subject = 'Confirm your ToyotaWaits Weekly Pipeline Brief subscription';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background-color: #09090b; color: #f4f4f5; border-radius: 12px; border: 1px solid #27272a;">
      <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #f59e0b;">
        ToyotaWaits Weekly Pipeline Brief
      </p>
      <h2 style="margin-top: 0; color: #ffffff; font-size: 20px;">Confirm your Monday digest subscription</h2>
      <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6;">
        Tap the button below to verify your email address. You&apos;ll receive 1 email every Monday morning with:
      </p>
      <ul style="color: #e4e4e7; font-size: 14px; line-height: 1.6; padding-left: 20px;">
        <li>7-day median wait-time shifts across high-demand Toyota &amp; Lexus models</li>
        <li>Fresh unreserved lot sightings summary</li>
        <li>Recent community-verified deliveries &amp; seasonal gear deals</li>
      </ul>
      <div style="margin: 24px 0;">
        <a href="${verifyUrl}" style="display: inline-block; background-color: #f59e0b; color: #09090b; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 20px; border-radius: 8px;">
          Verify Email &amp; Join Weekly Brief
        </a>
      </div>
      <p style="color: #a1a1aa; font-size: 12px; line-height: 1.5;">
        If you didn&apos;t request this brief, you can safely ignore this email or click unsubscribe below.
      </p>
      <hr style="border: 0; border-top: 1px solid #27272a; margin: 20px 0;" />
      <p style="color: #71717a; font-size: 11px; line-height: 1.5; margin-bottom: 0;">
        Sent by <strong>ToyotaWaits</strong> &lt;hello@toyotawaits.ca&gt; &bull; Burnaby, BC, Canada.<br />
        Independent automotive research tracker — not affiliated with Toyota Canada Inc., Toyota Motor Sales, U.S.A., Inc., or any dealership.<br />
        <a href="${unsubscribeUrl}" style="color: #fbbf24; text-decoration: underline;">1-Click Unsubscribe</a>
      </p>
    </div>
  `.trim();

  const text = [
    'ToyotaWaits Weekly Pipeline Brief — Confirm Your Subscription',
    '',
    'Tap the link below to verify your email address and receive 1 email every Monday:',
    verifyUrl,
    '',
    '1-Click Unsubscribe: ' + unsubscribeUrl,
    'Sent by ToyotaWaits <hello@toyotawaits.ca>, Burnaby, BC, Canada.',
  ].join('\n');

  return { subject, html, text, verifyUrl, unsubscribeUrl };
}

function hasLiveResendKey(): boolean {
  const key = process.env.RESEND_API_KEY?.trim() || '';
  return Boolean(key && !key.includes('placeholder') && !key.includes('mock-'));
}

export async function POST(request: NextRequest | Request) {
  try {
    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { success: false, error: 'Malformed JSON payload in request body.' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const rawEmail = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const rawCountry =
      typeof body?.country === 'string' && body.country.trim()
        ? body.country.trim().toUpperCase()
        : 'CA';

    if (!rawEmail || !EMAIL_REGEX.test(rawEmail)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    if (!VALID_COUNTRIES.has(rawCountry)) {
      return NextResponse.json(
        { success: false, error: 'Country must be CA or US.' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const country = rawCountry as 'CA' | 'US';
    const verificationToken = crypto.randomBytes(24).toString('hex');
    const unsubscribeToken = crypto.randomBytes(24).toString('hex');
    const fromEmail = process.env.RESEND_FROM_EMAIL?.trim() || 'ToyotaWaits <hello@toyotawaits.ca>';

    if (!isLiveSupabaseConfigured()) {
      if (hasLiveResendKey()) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const emailPayload = buildConfirmationEmail({
          country,
          verificationToken,
          unsubscribeToken,
        });
        const { error: resendError } = await resend.emails.send({
          from: fromEmail,
          to: [rawEmail],
          subject: emailPayload.subject,
          html: emailPayload.html,
          text: emailPayload.text,
        });
        if (resendError) {
          console.error('[/api/newsletter/subscribe] Resend send error:', resendError.message);
          return NextResponse.json(
            { success: false, error: 'Failed to send confirmation email.' },
            { status: 502, headers: { 'Cache-Control': 'no-store' } }
          );
        }
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Check your inbox to confirm your Weekly Pipeline Brief subscription.',
          simulated: !hasLiveResendKey(),
        },
        { status: 200, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createServerClient() as any;

    const { data: existing, error: selectError } = await supabase
      .from('newsletter_subscriptions')
      .select('id, is_verified, is_active, verification_token, unsubscribe_token')
      .eq('email', rawEmail)
      .maybeSingle();

    if (selectError) {
      console.error('[/api/newsletter/subscribe] Select error:', selectError.message);
      return NextResponse.json(
        { success: false, error: 'Unable to process newsletter subscription.' },
        { status: 500, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    if (existing && existing.is_verified && existing.is_active) {
      await supabase
        .from('newsletter_subscriptions')
        .update({ country })
        .eq('id', existing.id);

      return NextResponse.json(
        {
          success: true,
          alreadySubscribed: true,
          message: 'You are already subscribed to the Weekly Pipeline Brief.',
        },
        { status: 200, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const activeUnsubToken = existing?.unsubscribe_token || unsubscribeToken;

    const { error: upsertError } = await supabase
      .from('newsletter_subscriptions')
      .upsert(
        {
          email: rawEmail,
          country,
          is_verified: false,
          is_active: true,
          verification_token: verificationToken,
          unsubscribe_token: activeUnsubToken,
        },
        { onConflict: 'email' }
      );

    if (upsertError) {
      console.error('[/api/newsletter/subscribe] Upsert error:', upsertError.message);
      return NextResponse.json(
        { success: false, error: 'Unable to save newsletter subscription.' },
        { status: 500, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const emailPayload = buildConfirmationEmail({
      country,
      verificationToken,
      unsubscribeToken: activeUnsubToken,
    });

    if (hasLiveResendKey() || process.env.NODE_ENV === 'production') {
      if (!hasLiveResendKey()) {
        console.error('[/api/newsletter/subscribe] Missing RESEND_API_KEY');
        return NextResponse.json(
          { success: false, error: 'Email service is not configured.' },
          { status: 500, headers: { 'Cache-Control': 'no-store' } }
        );
      }

      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error: resendError } = await resend.emails.send({
        from: fromEmail,
        to: [rawEmail],
        subject: emailPayload.subject,
        html: emailPayload.html,
        text: emailPayload.text,
      });

      if (resendError) {
        console.error('[/api/newsletter/subscribe] Resend error:', resendError.message);
        return NextResponse.json(
          { success: false, error: 'Failed to send confirmation email. Please try again.' },
          { status: 502, headers: { 'Cache-Control': 'no-store' } }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Check your inbox to confirm your Weekly Pipeline Brief subscription.',
      },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err: unknown) {
    console.error('[/api/newsletter/subscribe] Unexpected error:', err instanceof Error ? err.message : 'Unknown error');
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
