/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outDir = path.resolve(__dirname, '..', 'public', 'images', 'accessories');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function getBaseSvg(content, badgeText, badgeColor = '#f59e0b') {
  return `
<svg width="240" height="240" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#27272a"/>
      <stop offset="100%" stop-color="#09090b"/>
    </radialGradient>
    <linearGradient id="amberGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <linearGradient id="lensGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect x="2" y="2" width="236" height="236" rx="20" fill="url(#bgGrad)" stroke="#3f3f46" stroke-width="2"/>

  <!-- Subtle inner grid / tech texture -->
  <path d="M 20 60 L 220 60 M 20 180 L 220 180" stroke="#27272a" stroke-width="1" stroke-dasharray="4 4" />
  <path d="M 60 20 L 60 220 M 180 20 L 180 220" stroke="#27272a" stroke-width="1" stroke-dasharray="4 4" />

  <!-- Main Illustration Content -->
  <g filter="url(#shadow)">
    ${content}
  </g>

  <!-- Top Badge -->
  ${badgeText ? `
  <rect x="16" y="16" width="${badgeText.length * 8 + 18}" height="20" rx="4" fill="#18181b" stroke="${badgeColor}" stroke-width="1"/>
  <text x="${16 + (badgeText.length * 8 + 18) / 2}" y="30" fill="${badgeColor}" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700" text-anchor="middle" letter-spacing="0.5">${badgeText}</text>
  ` : ''}
</svg>`;
}

const products = [
  // FitcamX Dashcams
  {
    slug: 'fitcamx-rav4',
    badge: 'RAV4 • TSS TAP',
    svg: `
      <!-- Mirror Shroud Body -->
      <path d="M 70 85 L 170 85 L 185 145 C 185 160 160 170 120 170 C 80 170 55 160 55 145 Z" fill="#27272a" stroke="#52525b" stroke-width="2"/>
      <!-- Housing Shroud Vent -->
      <path d="M 85 98 L 155 98 M 90 106 L 150 106" stroke="#3f3f46" stroke-width="2" stroke-linecap="round"/>
      <!-- 4K Camera Outer Ring -->
      <circle cx="120" cy="140" r="24" fill="#18181b" stroke="#71717a" stroke-width="2.5"/>
      <!-- Camera Lens Element -->
      <circle cx="120" cy="140" r="16" fill="url(#lensGlow)"/>
      <circle cx="120" cy="140" r="8" fill="#0f172a"/>
      <circle cx="116" cy="136" r="3" fill="#ffffff" opacity="0.8"/>
      <!-- Rec Indicator -->
      <circle cx="160" cy="120" r="3.5" fill="#ef4444"/>
      <!-- 4K Label -->
      <text x="120" y="185" fill="#a1a1aa" font-family="monospace" font-size="9" font-weight="700" text-anchor="middle">4K INTEGRATED</text>
    `
  },
  {
    slug: 'fitcamx-sienna',
    badge: 'SIENNA • TSS 2.5',
    svg: `
      <!-- Mirror Shroud Body for Sienna -->
      <path d="M 65 80 L 175 80 L 185 140 C 185 165 165 175 120 175 C 75 175 55 165 55 140 Z" fill="#27272a" stroke="#52525b" stroke-width="2"/>
      <path d="M 80 95 L 160 95" stroke="#3f3f46" stroke-width="2" stroke-linecap="round"/>
      <circle cx="120" cy="138" r="24" fill="#18181b" stroke="#71717a" stroke-width="2.5"/>
      <circle cx="120" cy="138" r="16" fill="url(#lensGlow)"/>
      <circle cx="120" cy="138" r="8" fill="#0f172a"/>
      <circle cx="116" cy="134" r="3" fill="#ffffff" opacity="0.8"/>
      <circle cx="162" cy="118" r="3.5" fill="#ef4444"/>
      <text x="120" y="190" fill="#a1a1aa" font-family="monospace" font-size="9" font-weight="700" text-anchor="middle">4K MIRROR TAP</text>
    `
  },
  {
    slug: 'fitcamx-grand-highlander',
    badge: 'GRAND HIGHLANDER',
    svg: `
      <!-- Grand Highlander Digital Mirror Fitment -->
      <path d="M 60 75 L 180 75 L 190 140 C 190 165 165 178 120 178 C 75 178 50 165 50 140 Z" fill="#27272a" stroke="#52525b" stroke-width="2"/>
      <path d="M 80 90 L 160 90 M 85 98 L 155 98" stroke="#3f3f46" stroke-width="2" stroke-linecap="round"/>
      <circle cx="120" cy="142" r="25" fill="#18181b" stroke="#71717a" stroke-width="2.5"/>
      <circle cx="120" cy="142" r="17" fill="url(#lensGlow)"/>
      <circle cx="120" cy="142" r="8.5" fill="#0f172a"/>
      <circle cx="116" cy="138" r="3" fill="#ffffff" opacity="0.8"/>
      <circle cx="166" cy="120" r="3.5" fill="#ef4444"/>
      <text x="120" y="195" fill="#a1a1aa" font-family="monospace" font-size="9" font-weight="700" text-anchor="middle">4K TSS 3.0 TAP</text>
    `
  },
  {
    slug: 'fitcamx-land-cruiser',
    badge: 'LC250 • TRAIL 4K',
    svg: `
      <!-- Ruggedized Mirror Shroud LC250 -->
      <path d="M 58 75 L 182 75 L 192 142 C 192 168 165 180 120 180 C 75 180 48 168 48 142 Z" fill="#27272a" stroke="#d97706" stroke-width="1.5"/>
      <path d="M 75 90 L 165 90" stroke="#52525b" stroke-width="2" stroke-linecap="round"/>
      <circle cx="120" cy="144" r="26" fill="#18181b" stroke="#71717a" stroke-width="2.5"/>
      <circle cx="120" cy="144" r="18" fill="url(#lensGlow)"/>
      <circle cx="120" cy="144" r="9" fill="#0f172a"/>
      <circle cx="116" cy="140" r="3" fill="#ffffff" opacity="0.8"/>
      <circle cx="168" cy="122" r="3.5" fill="#ef4444"/>
      <text x="120" y="198" fill="#d97706" font-family="monospace" font-size="9" font-weight="700" text-anchor="middle">RUGGED 4K TAP</text>
    `
  },

  // Screen Protectors
  {
    slug: 'screen-protector-rav4',
    badge: 'RAV4 • 10.5" / 8"',
    svg: `
      <!-- Bezel Frame -->
      <rect x="42" y="70" width="156" height="100" rx="8" fill="#18181b" stroke="#52525b" stroke-width="2"/>
      <!-- Glass Screen -->
      <rect x="48" y="76" width="144" height="88" rx="5" fill="#27272a" stroke="#38bdf8" stroke-width="1.5"/>
      <!-- Reflection Sheen -->
      <path d="M 60 76 L 110 76 L 70 164 L 50 164 Z" fill="url(#glassReflection)"/>
      <path d="M 120 76 L 150 76 L 110 164 L 90 164 Z" fill="url(#glassReflection)"/>
      <!-- 9H Shield Badge -->
      <circle cx="120" cy="120" r="18" fill="#18181b" stroke="#fbbf24" stroke-width="1.5"/>
      <text x="120" y="124" fill="#fbbf24" font-family="system-ui, sans-serif" font-size="11" font-weight="900" text-anchor="middle">9H</text>
      <text x="120" y="186" fill="#a1a1aa" font-family="monospace" font-size="9" text-anchor="middle">MATTE TEMPERED GLASS</text>
    `
  },
  {
    slug: 'screen-protector-sienna',
    badge: 'SIENNA • ANTI-GLARE',
    svg: `
      <rect x="40" y="70" width="160" height="100" rx="8" fill="#18181b" stroke="#52525b" stroke-width="2"/>
      <rect x="46" y="76" width="148" height="88" rx="5" fill="#27272a" stroke="#38bdf8" stroke-width="1.5"/>
      <path d="M 60 76 L 115 76 L 75 164 L 52 164 Z" fill="url(#glassReflection)"/>
      <circle cx="120" cy="120" r="18" fill="#18181b" stroke="#fbbf24" stroke-width="1.5"/>
      <text x="120" y="124" fill="#fbbf24" font-family="system-ui, sans-serif" font-size="11" font-weight="900" text-anchor="middle">9H</text>
      <text x="120" y="186" fill="#a1a1aa" font-family="monospace" font-size="9" text-anchor="middle">FINGERPRINT PROOF</text>
    `
  },
  {
    slug: 'screen-protector-grand-highlander',
    badge: 'GH • 12.3" ULTRA-WIDE',
    svg: `
      <!-- Extra wide aspect ratio for GH 12.3" -->
      <rect x="32" y="75" width="176" height="85" rx="8" fill="#18181b" stroke="#52525b" stroke-width="2"/>
      <rect x="38" y="81" width="164" height="73" rx="5" fill="#27272a" stroke="#38bdf8" stroke-width="1.5"/>
      <path d="M 50 81 L 105 81 L 70 154 L 45 154 Z" fill="url(#glassReflection)"/>
      <path d="M 125 81 L 160 81 L 125 154 L 100 154 Z" fill="url(#glassReflection)"/>
      <circle cx="120" cy="118" r="18" fill="#18181b" stroke="#fbbf24" stroke-width="1.5"/>
      <text x="120" y="122" fill="#fbbf24" font-family="system-ui, sans-serif" font-size="11" font-weight="900" text-anchor="middle">9H</text>
      <text x="120" y="180" fill="#a1a1aa" font-family="monospace" font-size="9" text-anchor="middle">12.3" EDGE-TO-EDGE</text>
    `
  },
  {
    slug: 'screen-protector-land-cruiser',
    badge: 'LC250 • TRAIL SHIELD',
    svg: `
      <rect x="35" y="72" width="170" height="92" rx="8" fill="#18181b" stroke="#71717a" stroke-width="2"/>
      <rect x="41" y="78" width="158" height="80" rx="5" fill="#27272a" stroke="#d97706" stroke-width="1.5"/>
      <path d="M 55 78 L 110 78 L 75 158 L 50 158 Z" fill="url(#glassReflection)"/>
      <circle cx="120" cy="118" r="18" fill="#18181b" stroke="#fbbf24" stroke-width="1.5"/>
      <text x="120" y="122" fill="#fbbf24" font-family="system-ui, sans-serif" font-size="11" font-weight="900" text-anchor="middle">9H</text>
      <text x="120" y="184" fill="#d97706" font-family="monospace" font-size="9" text-anchor="middle">IMPACT &amp; DUST ARMOR</text>
    `
  },

  // Center Console Trays
  {
    slug: 'console-tray-rav4',
    badge: 'RAV4 • DUAL TIER',
    svg: `
      <!-- Console Tray Top View Outline -->
      <rect x="45" y="65" width="150" height="110" rx="12" fill="#27272a" stroke="#52525b" stroke-width="2.5"/>
      <!-- Inner Left Section: Coin & key slot -->
      <rect x="55" y="75" width="45" height="42" rx="6" fill="#18181b" stroke="#3f3f46" stroke-width="1.5"/>
      <circle cx="70" cy="96" r="8" fill="#fbbf24" opacity="0.3" stroke="#fbbf24" stroke-width="1"/>
      <circle cx="84" cy="96" r="6" fill="#fbbf24" opacity="0.3" stroke="#fbbf24" stroke-width="1"/>
      <!-- Lower Left Section -->
      <rect x="55" y="123" width="45" height="42" rx="6" fill="#18181b" stroke="#3f3f46" stroke-width="1.5"/>
      <!-- Right Section: Phone / Glasses -->
      <rect x="106" y="75" width="78" height="90" rx="6" fill="#18181b" stroke="#3f3f46" stroke-width="1.5"/>
      <!-- Rubber Pad Lines -->
      <path d="M 116 95 L 174 95 M 116 115 L 174 115 M 116 135 L 174 135" stroke="#27272a" stroke-width="2"/>
      <!-- Cable Cutout -->
      <rect x="178" y="112" width="10" height="16" rx="3" fill="#3f3f46"/>
      <text x="120" y="194" fill="#a1a1aa" font-family="monospace" font-size="9" text-anchor="middle">DROP-IN DIVIDER TRAY</text>
    `
  },
  {
    slug: 'console-tray-sienna',
    badge: 'SIENNA • BRIDGE TRAY',
    svg: `
      <!-- Lower Bridge Wide Organizer -->
      <path d="M 40 70 L 200 70 L 190 165 L 50 165 Z" fill="#27272a" stroke="#52525b" stroke-width="2.5"/>
      <!-- Divided compartments -->
      <rect x="52" y="80" width="40" height="74" rx="6" fill="#18181b" stroke="#3f3f46" stroke-width="1.5"/>
      <rect x="98" y="80" width="44" height="74" rx="6" fill="#18181b" stroke="#3f3f46" stroke-width="1.5"/>
      <rect x="148" y="80" width="40" height="74" rx="6" fill="#18181b" stroke="#3f3f46" stroke-width="1.5"/>
      <!-- Grip ridges -->
      <circle cx="120" cy="117" r="10" fill="#27272a" stroke="#52525b" stroke-width="1"/>
      <text x="120" y="190" fill="#a1a1aa" font-family="monospace" font-size="9" text-anchor="middle">UNDER-BRIDGE ORGANIZER</text>
    `
  },
  {
    slug: 'console-tray-grand-highlander',
    badge: 'GH • DEEP VAULT TRAY',
    svg: `
      <!-- Precision Deep Vault Top Tray -->
      <rect x="42" y="65" width="156" height="110" rx="10" fill="#27272a" stroke="#52525b" stroke-width="2.5"/>
      <rect x="52" y="75" width="60" height="90" rx="6" fill="#18181b" stroke="#3f3f46" stroke-width="1.5"/>
      <rect x="118" y="75" width="70" height="42" rx="6" fill="#18181b" stroke="#3f3f46" stroke-width="1.5"/>
      <rect x="118" y="123" width="70" height="42" rx="6" fill="#18181b" stroke="#3f3f46" stroke-width="1.5"/>
      <text x="120" y="194" fill="#a1a1aa" font-family="monospace" font-size="9" text-anchor="middle">ARMREST COMPARTMENT</text>
    `
  },
  {
    slug: 'console-tray-land-cruiser',
    badge: 'LC250 • HD ORGANIZER',
    svg: `
      <!-- Rugged Armrest Storage Tray -->
      <rect x="42" y="65" width="156" height="110" rx="10" fill="#27272a" stroke="#d97706" stroke-width="1.5"/>
      <rect x="52" y="75" width="66" height="90" rx="6" fill="#18181b" stroke="#3f3f46" stroke-width="1.5"/>
      <rect x="124" y="75" width="64" height="90" rx="6" fill="#18181b" stroke="#3f3f46" stroke-width="1.5"/>
      <!-- Grid cross-hatch -->
      <path d="M 60 95 L 110 95 M 60 120 L 110 120 M 60 145 L 110 145" stroke="#27272a" stroke-width="2"/>
      <text x="120" y="194" fill="#d97706" font-family="monospace" font-size="9" text-anchor="middle">HEAVY-DUTY CONSOLE TRAY</text>
    `
  },

  // NOCO GB40 Jump Pack
  {
    slug: 'noco-gb40-jump-pack',
    badge: '1000A • WINTER RATED',
    svg: `
      <!-- NOCO Battery Body -->
      <rect x="50" y="80" width="140" height="80" rx="10" fill="#18181b" stroke="#52525b" stroke-width="2.5"/>
      <rect x="60" y="88" width="120" height="24" rx="4" fill="#27272a"/>
      <!-- Power Button -->
      <circle cx="80" cy="100" r="7" fill="#ef4444" stroke="#f87171" stroke-width="1.5"/>
      <!-- Charge Level LEDs -->
      <circle cx="104" cy="100" r="3" fill="#22c55e"/>
      <circle cx="116" cy="100" r="3" fill="#22c55e"/>
      <circle cx="128" cy="100" r="3" fill="#22c55e"/>
      <circle cx="140" cy="100" r="3" fill="#22c55e"/>
      <!-- High Output Clamps Silhouette -->
      <path d="M 70 125 L 85 145 L 60 145 Z" fill="#ef4444"/>
      <path d="M 170 125 L 155 145 L 180 145 Z" fill="#3f3f46"/>
      <!-- Lightning Bolt / 1000A -->
      <path d="M 122 122 L 114 136 L 122 136 L 118 152 L 128 134 L 120 134 Z" fill="url(#amberGlow)"/>
      <text x="120" y="186" fill="#fbbf24" font-family="monospace" font-size="10" font-weight="700" text-anchor="middle">NOCO BOOST GB40</text>
    `
  },

  // J1772 Charger Lock
  {
    slug: 'j1772-charger-lock',
    badge: 'RAV4 PRIME • PHEV ONLY',
    svg: `
      <!-- J1772 Lock Ring Outer Circle -->
      <circle cx="120" cy="115" r="46" fill="#18181b" stroke="#f59e0b" stroke-width="3"/>
      <!-- Inner Ring Hollow (Plug Socket Cutout) -->
      <circle cx="120" cy="115" r="26" fill="#27272a" stroke="#52525b" stroke-width="2"/>
      <!-- Combination Dial Tumbler on Top -->
      <rect x="102" y="55" width="36" height="22" rx="4" fill="#3f3f46" stroke="#fbbf24" stroke-width="1.5"/>
      <text x="120" y="70" fill="#fbbf24" font-family="monospace" font-size="9" font-weight="900" text-anchor="middle">3-PIN</text>
      <!-- EV Plug Silhouette Pin Cutouts -->
      <circle cx="112" cy="110" r="4" fill="#18181b" stroke="#71717a" stroke-width="1"/>
      <circle cx="128" cy="110" r="4" fill="#18181b" stroke="#71717a" stroke-width="1"/>
      <circle cx="120" cy="124" r="5" fill="#18181b" stroke="#71717a" stroke-width="1"/>
      <!-- Lock Shackle Latch -->
      <path d="M 85 115 L 75 115 M 155 115 L 165 115" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
      <text x="120" y="185" fill="#a1a1aa" font-family="monospace" font-size="9" text-anchor="middle">ANTI-THEFT LOCK RING</text>
    `
  }
];

async function generateAll() {
  console.log('Generating 14 accessory visual assets in ' + outDir + '...');
  for (const item of products) {
    const svgStr = getBaseSvg(item.svg, item.badge);
    const dest = path.join(outDir, `${item.slug}.png`);
    await sharp(Buffer.from(svgStr))
      .png({ quality: 95 })
      .toFile(dest);
    console.log(`Created: ${item.slug}.png`);
  }
  console.log('All 14 accessory thumbnails generated successfully.');
}

generateAll().catch(err => {
  console.error(err);
  process.exit(1);
});
