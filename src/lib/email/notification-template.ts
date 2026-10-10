export interface NotificationEmailData {
  recipientEmail: string;
  model: string;
  modelSlug: string;
  trim?: string | null;
  powertrain?: string | null;
  province: string;
  city?: string | null;
  orderDate?: string | null;
  deliveryDate?: string | null;
  waitDays?: number | null;
  medianWaitDays: number;
  momTrendPercent?: number | string | null; // e.g. -5% or "+12 days"
  activeOrdersCount: number;
  unsubscribeToken: string;
}

export interface GeneratedEmailMessage {
  subject: string;
  html: string;
  text: string;
  headers: Record<string, string>;
}

export function generateNotificationEmail(data: NotificationEmailData): GeneratedEmailMessage {
  const modelTitle = data.model || 'Toyota';
  const trimDisplay = data.trim ? ` ${data.trim}` : '';
  const vehicleFullName = `${modelTitle}${trimDisplay}`;
  const provinceUpper = data.province.toUpperCase();
  const locationDisplay = data.city ? `${data.city}, ${provinceUpper}` : provinceUpper;
  const daysDisplay = data.waitDays != null ? `${data.waitDays} days` : 'Pending';

  const estimatesUrl = `https://toyotawaits.ca/estimates?model=${encodeURIComponent(
    data.modelSlug
  )}&province=${encodeURIComponent(provinceUpper)}&utm_source=email_alert&utm_medium=email`;

  const modsUrl = `https://toyotawaits.ca/mods/${encodeURIComponent(
    data.modelSlug
  )}?utm_source=email_alert&utm_medium=email`;

  const unsubscribeUrl = `https://toyotawaits.ca/unsubscribe?token=${encodeURIComponent(
    data.unsubscribeToken
  )}`;

  const subject = `ToyotaWaits.ca Alert: New ${vehicleFullName} Delivery Recorded in ${provinceUpper}`;

  const trendText =
    data.momTrendPercent != null
      ? typeof data.momTrendPercent === 'number'
        ? `${data.momTrendPercent > 0 ? '+' : ''}${data.momTrendPercent}%`
        : String(data.momTrendPercent)
      : 'Stable';

  // Plain Text Version
  const text = `
ToyotaWaits.ca 🍁 Canada
==================================================
New Delivery Alert: ${vehicleFullName} in ${locationDisplay}

MATCH DETAILS:
• Vehicle Spec: ${vehicleFullName} ${data.powertrain ? `(${data.powertrain})` : ''}
• Location: ${locationDisplay}
• Deposit / Order Date: ${data.orderDate || 'Recent'}
• Delivery Date: ${data.deliveryDate || 'Recently Delivered'}
• Total Days Waited: ${daysDisplay}

REGIONAL BENCHMARK DELTA (${provinceUpper}):
• Provincial Median Wait: ${data.medianWaitDays} Days
• Month-over-Month Trend: ${trendText}
• Active Waiting Orders: ${data.activeOrdersCount} Canadian Buyers

View Live Benchmark & Provincial Data:
${estimatesUrl}

--------------------------------------------------
PREPARING FOR DELIVERY?
Explore popular community-recommended protection and accessories for your ${modelTitle}.
${modsUrl}

--------------------------------------------------
Manage your alerts or unsubscribe instantly:
${unsubscribeUrl}
`.trim();

  // Dark-Mode Responsive HTML Template
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
      color: #f4f4f5;
    }
    .wrapper {
      max-width: 600px;
      margin: 0 auto;
      padding: 32px 20px;
      background-color: #09090b;
    }
    .header {
      padding-bottom: 24px;
      border-bottom: 1px solid #27272a;
      text-align: left;
    }
    .header-logo {
      font-size: 20px;
      font-weight: 800;
      color: #ffffff;
      text-decoration: none;
      letter-spacing: -0.5px;
    }
    .header-tag {
      display: inline-block;
      margin-left: 8px;
      padding: 2px 8px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 600;
      background-color: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }
    .card {
      margin-top: 24px;
      background-color: #18181b;
      border: 1px solid #27272a;
      border-radius: 12px;
      padding: 24px;
    }
    .card-title {
      font-size: 16px;
      font-weight: 700;
      color: #fafafa;
      margin: 0 0 16px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #27272a;
      font-size: 13px;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      color: #a1a1aa;
    }
    .detail-value {
      color: #ffffff;
      font-weight: 600;
      text-align: right;
    }
    .grid-benchmarks {
      margin-top: 16px;
      display: table;
      width: 100%;
    }
    .bench-col {
      display: table-cell;
      width: 33.33%;
      padding: 12px;
      background-color: #09090b;
      border: 1px solid #27272a;
      border-radius: 8px;
      text-align: center;
    }
    .bench-label {
      font-size: 11px;
      color: #a1a1aa;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .bench-value {
      font-size: 18px;
      font-weight: 800;
      color: #fbbf24;
      margin-top: 4px;
    }
    .cta-container {
      margin-top: 28px;
      text-align: center;
    }
    .cta-button {
      display: inline-block;
      width: 100%;
      box-sizing: border-box;
      padding: 14px 24px;
      background-color: #f59e0b;
      color: #09090b;
      font-weight: 700;
      font-size: 14px;
      border-radius: 8px;
      text-decoration: none;
      text-align: center;
    }
    .prep-card {
      margin-top: 24px;
      background: linear-gradient(135deg, #18181b 0%, #1c1917 100%);
      border: 1px solid #3f3f46;
      border-radius: 12px;
      padding: 20px;
    }
    .prep-title {
      font-size: 14px;
      font-weight: 700;
      color: #fbbf24;
      margin: 0 0 6px 0;
    }
    .prep-body {
      font-size: 12px;
      color: #d4d4d8;
      margin: 0 0 12px 0;
      line-height: 1.5;
    }
    .prep-link {
      font-size: 12px;
      font-weight: 600;
      color: #ffffff;
      text-decoration: underline;
    }
    .footer {
      margin-top: 32px;
      padding-top: 20px;
      border-top: 1px solid #27272a;
      text-align: center;
      font-size: 11px;
      color: #71717a;
      line-height: 1.6;
    }
    .footer a {
      color: #a1a1aa;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <!-- Header -->
    <div class="header">
      <span class="header-logo">ToyotaWaits.ca 🍁 Canada</span>
      <span class="header-tag">Live Allocation Alert</span>
    </div>

    <!-- Match Details Card -->
    <div class="card">
      <h3 class="card-title">New Verified Delivery Recorded</h3>
      <div class="detail-row">
        <span class="detail-label">Vehicle Spec:</span>
        <span class="detail-value">${vehicleFullName} ${data.powertrain ? `(${data.powertrain})` : ''}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Location:</span>
        <span class="detail-value">${locationDisplay}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Deposit Date:</span>
        <span class="detail-value">${data.orderDate || 'N/A'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Delivery Date:</span>
        <span class="detail-value">${data.deliveryDate || 'Recent'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Total Days Waited:</span>
        <span class="detail-value" style="color: #34d399;">${daysDisplay}</span>
      </div>
    </div>

    <!-- Regional Benchmark Delta -->
    <div class="card">
      <h3 class="card-title">${provinceUpper} Regional Benchmark Delta</h3>
      <table style="width: 100%; border-collapse: separate; border-spacing: 8px 0;">
        <tr>
          <td style="padding: 12px; background-color: #09090b; border: 1px solid #27272a; border-radius: 8px; text-align: center;">
            <div style="font-size: 10px; color: #a1a1aa; text-transform: uppercase;">Median Wait</div>
            <div style="font-size: 18px; font-weight: 800; color: #fbbf24; margin-top: 4px;">${data.medianWaitDays} Days</div>
          </td>
          <td style="padding: 12px; background-color: #09090b; border: 1px solid #27272a; border-radius: 8px; text-align: center;">
            <div style="font-size: 10px; color: #a1a1aa; text-transform: uppercase;">MoM Trend</div>
            <div style="font-size: 18px; font-weight: 800; color: #60a5fa; margin-top: 4px;">${trendText}</div>
          </td>
          <td style="padding: 12px; background-color: #09090b; border: 1px solid #27272a; border-radius: 8px; text-align: center;">
            <div style="font-size: 10px; color: #a1a1aa; text-transform: uppercase;">In Queue</div>
            <div style="font-size: 18px; font-weight: 800; color: #f4f4f5; margin-top: 4px;">${data.activeOrdersCount} Orders</div>
          </td>
        </tr>
      </table>

      <!-- Primary CTA -->
      <div class="cta-container">
        <a href="${estimatesUrl}" class="cta-button" target="_blank">
          View Updated Estimates &amp; Delivery Log &rarr;
        </a>
      </div>
    </div>

    <!-- Secondary Delivery Prep Card -->
    <div class="prep-card">
      <h4 class="prep-title">Delivery Day Prep &amp; Community Mods</h4>
      <p class="prep-body">
        Explore popular community-recommended protection and accessories for your ${modelTitle}.
      </p>
      <a href="${modsUrl}" class="prep-link" target="_blank">
        Browse Recommended Mods &amp; Accessories &rarr;
      </a>
    </div>

    <!-- Footer with compliant List-Unsubscribe -->
    <div class="footer">
      <p>
        You received this email because you subscribed to wait-time alerts for the ${modelTitle} in ${provinceUpper} on ToyotaWaits.ca.
      </p>
      <p>
        <a href="${unsubscribeUrl}">One-Click Unsubscribe</a> &bull; Unsubscribe with one click &bull; 
        <a href="https://toyotawaits.ca/privacy">Privacy Policy</a> &bull; 
        Zero-PII Canadian Automotive Analytics
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
      'List-Unsubscribe': `<mailto:unsubscribe@toyotawaits.ca?subject=unsubscribe-${data.unsubscribeToken}>, <https://toyotawaits.ca/unsubscribe?token=${data.unsubscribeToken}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  };
}
