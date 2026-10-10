export interface NudgeEmailPayload {
  recipientEmail: string;
  model: string;
  modelSlug: string;
  powertrain?: string;
  trim?: string | null;
  province: string;
  orderDate: string;
  daysWaited: number;
  editToken: string;
  unsubscribeToken?: string;
  baseUrl?: string;
}

export interface GeneratedNudgeEmail {
  subject: string;
  html: string;
  text: string;
  headers: Record<string, string>;
}

export function generateNudgeEmail(data: NudgeEmailPayload): GeneratedNudgeEmail {
  const baseUrl = data.baseUrl || process.env.NEXT_PUBLIC_BASE_URL || 'https://toyotawaits.ca';
  const provinceUpper = data.province.toUpperCase();
  const modelTitle = data.model || 'Toyota';
  const vehicleFullName = `${modelTitle}${data.trim ? ` ${data.trim}` : ''}`.trim();

  const stillWaitingUrl = `${baseUrl}/api/orders/status-action?token=${encodeURIComponent(
    data.editToken
  )}&action=still_waiting`;

  const deliveredUrl = `${baseUrl}/api/orders/status-action?token=${encodeURIComponent(
    data.editToken
  )}&action=delivered`;

  const cancelledUrl = `${baseUrl}/api/orders/status-action?token=${encodeURIComponent(
    data.editToken
  )}&action=cancelled`;

  const modsUrl = `${baseUrl}/mods/${encodeURIComponent(data.modelSlug)}`;

  const unsubToken = data.unsubscribeToken || data.editToken;
  const unsubscribeUrl = `${baseUrl}/unsubscribe?token=${encodeURIComponent(unsubToken)}`;

  const subject = `ToyotaWaits.ca: Quick Status Check on Your ${modelTitle} Order (${data.daysWaited} Days)`;

  // Plain Text Version
  const text = `
ToyotaWaits.ca 🍁 Canada — Order Milestone Check-In
==================================================
Vehicle: ${vehicleFullName} (${provinceUpper})
Order Date: ${data.orderDate}
Days Waited So Far: ${data.daysWaited} days

Has your vehicle arrived, or are you still in the queue?
Please choose one option below to keep Canadian community estimates accurate:

[ 1. STILL WAITING ]
Click here to confirm you're still waiting (refreshes your order queue position):
${stillWaitingUrl}

[ 2. DELIVERED! ]
Click here if you have taken delivery (records today as your delivery date):
${deliveredUrl}

[ 3. CANCELLED / MOVED ON ]
Click here if you cancelled your deposit or chose another vehicle:
${cancelledUrl}

--------------------------------------------------
PREPARING FOR DELIVERY?
Browse popular community accessories & mods for your ${modelTitle}:
${modsUrl}

--------------------------------------------------
ToyotaWaits is an independent community project. If this tracker helped you, support hosting costs at https://ko-fi.com/toyotawaits

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
      font-size: 17px;
      font-weight: 700;
      color: #fafafa;
      margin: 0 0 12px 0;
    }
    .card-lead {
      font-size: 14px;
      line-height: 1.6;
      color: #d4d4d8;
      margin: 0 0 20px 0;
    }
    .action-btn {
      display: block;
      padding: 13px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 700;
      text-align: center;
      text-decoration: none;
      margin-bottom: 12px;
      transition: opacity 0.2s;
    }
    .btn-still-waiting {
      background-color: #d97706;
      color: #ffffff;
      border: 1px solid #f59e0b;
    }
    .btn-delivered {
      background-color: #059669;
      color: #ffffff;
      border: 1px solid #10b981;
    }
    .btn-cancelled {
      background-color: #27272a;
      color: #a1a1aa;
      border: 1px solid #3f3f46;
    }
    .prep-card {
      margin-top: 24px;
      background-color: #121214;
      border: 1px solid #27272a;
      border-radius: 12px;
      padding: 20px;
    }
    .prep-title {
      font-size: 14px;
      font-weight: 700;
      color: #fafafa;
      margin: 0 0 6px 0;
    }
    .prep-body {
      font-size: 12px;
      color: #a1a1aa;
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
      <span class="header-tag">Order Check-In</span>
    </div>

    <!-- Nudge Card -->
    <div class="card">
      <h3 class="card-title">Quick Status Check: ${vehicleFullName}</h3>
      <p class="card-lead">
        It has been <strong>${data.daysWaited} days</strong> since your deposit was placed on <strong>${data.orderDate}</strong> in <strong>${provinceUpper}</strong>.
        Please let the Canadian buyer community know your current status with a single click:
      </p>

      <!-- 3 Distinct Action Buttons -->
      <a href="${stillWaitingUrl}" class="action-btn btn-still-waiting" target="_blank">
        ⏳ Still Waiting (Keep Order Active)
      </a>

      <a href="${deliveredUrl}" class="action-btn btn-delivered" target="_blank">
        🎉 Delivered! (Record Today as Delivery Date)
      </a>

      <a href="${cancelledUrl}" class="action-btn btn-cancelled" target="_blank">
        ✕ Cancelled / Moved On
      </a>
    </div>

    <!-- Secondary Delivery Prep Card -->
    <div class="prep-card">
      <h4 class="prep-title">Planning Ahead? Community Accessories &amp; Mods</h4>
      <p class="prep-body">
        Explore popular community-recommended protection and mods curated for your ${modelTitle}.
      </p>
      <a href="${modsUrl}" class="prep-link" target="_blank">
        Browse Recommended Mods for ${modelTitle} &rarr;
      </a>
    </div>

    <!-- Footer with compliant List-Unsubscribe & Ko-fi -->
    <div class="footer">
      <p style="margin: 0 0 10px 0;">
        You received this check-in because you have an active crowdsourced order for ${modelTitle} in ${provinceUpper} on ToyotaWaits.ca.
      </p>
      <p style="margin: 0 0 10px 0;">
        ToyotaWaits is an independent community project. If this tracker helped you, support hosting costs at <a href="https://ko-fi.com/toyotawaits" target="_blank" rel="noopener noreferrer">https://ko-fi.com/toyotawaits</a>
      </p>
      <p style="margin: 0;">
        <a href="${unsubscribeUrl}">One-Click Unsubscribe</a> &bull; 
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
      'List-Unsubscribe': `<mailto:unsubscribe@toyotawaits.ca?subject=unsubscribe-${unsubToken}>, <${unsubscribeUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  };
}
