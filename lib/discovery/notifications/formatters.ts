/**
 * lib/discovery/notifications/formatters.ts
 *
 * Sprint 4: Transactional Outbox & Notification Dispatch
 * Master Plan V3.2 Page 4 & Appendix B3 Specifications:
 * - Epistemic honesty & transparent wording: "Matching listing detected - availability unconfirmed with dealer"
 * - Full vehicle specification: model, trim, dealer name, region, pricing basis (with unverified fees notice)
 * - Exact observed evidence status (e.g., "Advertised - availability unconfirmed", "Incoming availability unconfirmed")
 * - Last checked timestamp and canonical dealer source link
 * - CASL-compliant footer: sender identity, Canadian mailing address, and one-click unsubscribe mechanism
 */

import { buildDropAlertEnrichment } from '../../../src/lib/alerts/templates';
import { FormattedNotification } from '../types';

export interface AlertEmailVehicle {
  vin?: string | null;
  provisionalId?: string | null;
  isProvisionalVin?: boolean;
  make: string;
  model: string;
  trim?: string | null;
  modelYear: number;
  powertrain?: string | null;
  exteriorColor?: string | null;
}

export interface AlertEmailDealer {
  name: string;
  city?: string | null;
  province?: string | null;
  websiteUrl?: string | null;
}

export interface AlertEmailPricing {
  msrp?: number | null;
  sellingPrice?: number | null;
  mandatoryFees?: number | null;
  hasUnverifiedFees?: boolean;
}

export interface AlertEmailPayload {
  recipient: string;
  unsubscribeToken: string;
  listingId: string;
  eventId: string;
  status: string;
  observedAt: string;
  vdpUrl?: string | null;
  stockNumber?: string | null;
  vehicle: AlertEmailVehicle;
  dealer: AlertEmailDealer;
  pricing?: AlertEmailPricing | null;
}

/**
 * Generates transparent, CASL-compliant email notifications for matched dealer inventory listings.
 */
export function formatAlertEmail(payload: AlertEmailPayload): FormattedNotification {
  const {
    vehicle,
    dealer,
    pricing,
    status,
    observedAt,
    vdpUrl,
    stockNumber,
    unsubscribeToken,
  } = payload;

  const year = vehicle.modelYear || new Date().getFullYear();
  const trimDisplay = vehicle.trim ? ` ${vehicle.trim}` : '';
  const vehicleFullName = `${year} ${vehicle.make} ${vehicle.model}${trimDisplay}`;
  
  const dealerRegion = [dealer.city, dealer.province].filter(Boolean).join(', ') || 'Canada';
  const dealerDisplay = `${dealer.name}${dealerRegion ? ` (${dealerRegion})` : ''}`;

  // Subject line per Master Plan Page 4 & Appendix B3
  const subject = `ToyotaWaits Alert: Matching listing detected - availability unconfirmed with dealer (${vehicleFullName} at ${dealer.name})`;

  // Source link
  const sourceLink = vdpUrl || dealer.websiteUrl || 'https://toyotawaits.ca';
  const unsubscribeUrl = `https://toyotawaits.ca/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;

  // VIN vs Provisional stock identifier display
  const vinDisplay = vehicle.isProvisionalVin || !vehicle.vin
    ? `Provisional Stock Identifier: ${vehicle.provisionalId || stockNumber || 'Pending Allocation'} (True 17-char VIN not yet published by dealer)`
    : `VIN: ${vehicle.vin}`;

  // Pricing basis strings
  const msrpString = pricing?.msrp != null ? `$${pricing.msrp.toLocaleString('en-CA')}` : 'Contact dealer';
  const priceString = pricing?.sellingPrice != null ? `$${pricing.sellingPrice.toLocaleString('en-CA')}` : msrpString;
  const unverifiedFeesNotice = pricing?.hasUnverifiedFees
    ? 'Pricing Notice: Dealer fee items are unverified. Advertised price may exclude mandatory documentation fees, environmental levies, or dealer add-ons. Final purchase price is subject to in-person dealer confirmation.'
    : 'Pricing Note: Price reflects public advertised figure. Subject to dealer confirmation and applicable taxes.';

  const enrichment = buildDropAlertEnrichment({
    model: vehicle.model,
  });

  // Format Plain Text Version
  const text = `
ToyotaWaits.ca - Canadian Vehicle Inventory Discovery
================================================================================
Matching listing detected - availability unconfirmed with dealer

VEHICLE SPECIFICATION:
- Vehicle: ${vehicleFullName}
- ${vinDisplay}
${vehicle.powertrain ? `- Powertrain: ${vehicle.powertrain}\n` : ''}${vehicle.exteriorColor ? `- Exterior Color: ${vehicle.exteriorColor}\n` : ''}- Dealership: ${dealerDisplay}

CURRENT OBSERVED STATUS:
- Exact Status: ${status}
- Last Checked: ${observedAt}

PRICING BASIS:
- Advertised Selling Price: ${priceString}
- MSRP: ${msrpString}
${pricing?.mandatoryFees != null ? `- Disclosed Fees: $${pricing.mandatoryFees.toLocaleString('en-CA')}\n` : ''}- ${unverifiedFeesNotice}

CANONICAL DEALER SOURCE:
View Original Dealer Listing: ${sourceLink}

${enrichment.textSection}

IMPORTANT DISCLAIMER:
ToyotaWaits.ca is an independent public observation tool and does NOT confirm vehicle availability with dealer staff. Vehicles may have pre-existing deposits, pending customer handoffs, or internal allocations. Always contact ${dealer.name} directly to confirm physical status.

================================================================================
CASL Compliance & Sender Information:
Sender: ToyotaWaits.ca
Mailing Address: ToyotaWaits.ca, 1055 W Georgia St, Vancouver, BC V6E 3P3, Canada
Inquiries: support@toyotawaits.ca

Manage Preferences or One-Click Unsubscribe:
${unsubscribeUrl}
`.trim();

  // Format HTML Version
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #09090b;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e4e4e7;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 24px 16px;
    }
    .badge-unconfirmed {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      background-color: rgba(234, 179, 8, 0.15);
      color: #facc15;
      border: 1px solid rgba(234, 179, 8, 0.3);
      margin-bottom: 16px;
    }
    .header-title {
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 8px 0;
    }
    .subtitle {
      font-size: 14px;
      color: #a1a1aa;
      margin: 0 0 20px 0;
      line-height: 1.5;
    }
    .card {
      background-color: #18181b;
      border: 1px solid #27272a;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 16px;
    }
    .card-title {
      font-size: 15px;
      font-weight: 600;
      color: #ffffff;
      margin: 0 0 12px 0;
      border-bottom: 1px solid #27272a;
      padding-bottom: 8px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
    }
    .detail-label {
      color: #a1a1aa;
    }
    .detail-value {
      color: #ffffff;
      font-weight: 500;
      text-align: right;
    }
    .notice-box {
      background-color: rgba(39, 39, 42, 0.6);
      border-left: 3px solid #eab308;
      padding: 12px;
      font-size: 13px;
      color: #d4d4d8;
      border-radius: 4px;
      margin-top: 12px;
      line-height: 1.4;
    }
    .cta-button {
      display: block;
      width: 100%;
      text-align: center;
      background-color: #dc2626;
      color: #ffffff;
      font-weight: 600;
      padding: 12px 0;
      border-radius: 6px;
      text-decoration: none;
      margin-top: 16px;
    }
    .footer {
      font-size: 12px;
      color: #71717a;
      line-height: 1.6;
      border-top: 1px solid #27272a;
      padding-top: 16px;
      margin-top: 24px;
    }
    .footer a {
      color: #a1a1aa;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="badge-unconfirmed">
      ⚠️ Availability Unconfirmed With Dealer
    </div>
    <h1 class="header-title">Matching listing detected - availability unconfirmed with dealer</h1>
    <p class="subtitle">
      A public inventory listing matching your saved criteria was detected during our automated dealer sweep.
    </p>

    <!-- Vehicle Details Card -->
    <div class="card">
      <h2 class="card-title">Vehicle &amp; Dealership</h2>
      <div class="detail-row">
        <span class="detail-label">Vehicle</span>
        <span class="detail-value">${vehicleFullName}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Dealership</span>
        <span class="detail-value">${dealerDisplay}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Identification</span>
        <span class="detail-value" style="font-family: monospace; font-size: 12px;">${vinDisplay}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Observed Status</span>
        <span class="detail-value">${status}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Last Checked</span>
        <span class="detail-value">${observedAt}</span>
      </div>
    </div>

    <!-- Pricing Card -->
    <div class="card">
      <h2 class="card-title">Pricing Breakdown</h2>
      <div class="detail-row">
        <span class="detail-label">Advertised Selling Price</span>
        <span class="detail-value" style="color: #4ade80; font-size: 16px;">${priceString}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">MSRP</span>
        <span class="detail-value">${msrpString}</span>
      </div>
      <div class="notice-box">
        ${unverifiedFeesNotice}
      </div>
      <a href="${sourceLink}" class="cta-button" target="_blank" rel="noopener noreferrer">
        View Public Dealer Listing &rarr;
      </a>
    </div>

    ${enrichment.htmlSection}

    <!-- CASL & Compliance Footer -->
    <div class="footer">
      <p style="margin: 0 0 8px 0;">
        <strong>Important Disclaimer:</strong> ToyotaWaits.ca is an independent public observation platform. We do not sell vehicles or hold allocation quotas. Listings are scraped from public dealer portals; units may already be spoken for.
      </p>
      <p style="margin: 0 0 8px 0;">
        Sent by <strong>ToyotaWaits.ca</strong> &bull; 1055 W Georgia St, Vancouver, BC V6E 3P3, Canada.
      </p>
      <p style="margin: 0;">
        You received this notification because of an active saved search alert.
        <a href="${unsubscribeUrl}">One-Click Unsubscribe</a> &bull;
        <a href="https://toyotawaits.ca/privacy">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>
`.trim();

  return {
    subject,
    html,
    text,
    headers: {
      'List-Unsubscribe': `<mailto:unsubscribe@toyotawaits.ca?subject=unsubscribe-${unsubscribeToken}>, <https://toyotawaits.ca/unsubscribe?token=${unsubscribeToken}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  };
}
