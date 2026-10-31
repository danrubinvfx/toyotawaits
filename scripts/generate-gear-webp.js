/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outDir = path.resolve(__dirname, '..', 'public', 'assets', 'gear');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function escapeXml(unsafe) {
  return (unsafe || '').replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

function getCardFrameSvg(content, brandBadge = '', subtitle = '') {
  const safeBadge = escapeXml(brandBadge);
  const safeSubtitle = escapeXml(subtitle);
  return `
<svg width="800" height="500" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#222226"/>
      <stop offset="60%" stop-color="#141416"/>
      <stop offset="100%" stop-color="#09090b"/>
    </radialGradient>
    <linearGradient id="amberAccent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <linearGradient id="cyanLens" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="40%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0c4a6e"/>
    </linearGradient>
    <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="40%" stop-color="#ffffff" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="matteBlack" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2d2d32"/>
      <stop offset="100%" stop-color="#18181b"/>
    </linearGradient>
    <linearGradient id="metalSilver" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e4e4e7"/>
      <stop offset="50%" stop-color="#71717a"/>
      <stop offset="100%" stop-color="#3f3f46"/>
    </linearGradient>
    <pattern id="dotGrid" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="#27272a" opacity="0.6"/>
    </pattern>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#000000" flood-opacity="0.75"/>
    </filter>
    <filter id="innerGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"/>
      <feFlood flood-color="#ffffff" flood-opacity="0.1"/>
      <feComposite in2="shadowDiff" operator="in"/>
      <feComposite in2="SourceGraphic" operator="over"/>
    </filter>
  </defs>

  <!-- Dark Studio Base -->
  <rect width="800" height="500" rx="24" fill="url(#bgGlow)"/>
  <rect width="800" height="500" rx="24" fill="url(#dotGrid)"/>

  <!-- Subtle Studio Pedestal Glow -->
  <ellipse cx="400" cy="410" rx="280" ry="24" fill="#000000" opacity="0.6" filter="blur(8px)"/>
  <ellipse cx="400" cy="405" rx="210" ry="12" fill="#fbbf24" opacity="0.04" filter="blur(12px)"/>

  <!-- Centered Product Content -->
  <g filter="url(#softShadow)">
    ${content}
  </g>

  <!-- Technical Branding Tag -->
  ${safeBadge ? `
  <g transform="translate(36, 36)">
    <rect width="${safeBadge.length * 8.5 + 24}" height="28" rx="6" fill="#18181b" stroke="#f59e0b" stroke-width="1.2" opacity="0.95"/>
    <circle cx="14" cy="14" r="4" fill="#f59e0b"/>
    <text x="26" y="18" fill="#f59e0b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" letter-spacing="0.8">${safeBadge}</text>
  </g>
  ` : ''}

  ${safeSubtitle ? `
  <text x="400" y="468" fill="#71717a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" text-anchor="middle" letter-spacing="1.5">${safeSubtitle}</text>
  ` : ''}
</svg>`;
}

const GEAR_ITEMS = [
  // 1. FitcamX Dash Cam
  {
    fileName: 'fitcamx-rav4.webp',
    brand: 'FITCAMX • 4K OEM REARVIEW TAP',
    subtitle: 'FITCAMX TOYOTA INTEGRATED 4K DASH CAMERA',
    svg: `
      <!-- Mirror base bracket -->
      <path d="M 280 120 L 520 120 L 560 210 L 240 210 Z" fill="#18181b" stroke="#3f3f46" stroke-width="2"/>
      <!-- Main OEM Shroud Body -->
      <path d="M 230 200 L 570 200 L 590 320 C 590 365 530 395 400 395 C 270 395 210 365 210 320 Z" fill="url(#matteBlack)" stroke="#52525b" stroke-width="3"/>
      <!-- Top Vent Slits -->
      <path d="M 310 230 L 490 230 M 325 242 L 475 242 M 340 254 L 460 254" stroke="#3f3f46" stroke-width="3" stroke-linecap="round"/>
      <!-- Camera Lens Bezel -->
      <circle cx="400" cy="325" r="48" fill="#121215" stroke="#71717a" stroke-width="4"/>
      <circle cx="400" cy="325" r="40" fill="url(#metalSilver)" stroke="#27272a" stroke-width="1.5"/>
      <!-- Glass Lens Optic -->
      <circle cx="400" cy="325" r="32" fill="url(#cyanLens)"/>
      <circle cx="400" cy="325" r="16" fill="#09090b"/>
      <circle cx="390" cy="315" r="6" fill="#ffffff" opacity="0.85"/>
      <circle cx="414" cy="336" r="3" fill="#38bdf8" opacity="0.6"/>
      <!-- Recording Status Indicator -->
      <circle cx="505" cy="285" r="6" fill="#ef4444"/>
      <circle cx="505" cy="285" r="10" stroke="#ef4444" stroke-width="1.5" opacity="0.4"/>
      <!-- SD Card Slot & Mic -->
      <rect x="260" y="295" width="28" height="6" rx="2" fill="#09090b" stroke="#3f3f46" stroke-width="1"/>
      <circle cx="305" cy="298" r="3" fill="#27272a"/>
      <!-- 4K Ultra HD Text -->
      <text x="400" y="380" fill="#a1a1aa" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle" letter-spacing="2">4K UHD • F/1.6 WIDE ANGLE</text>
    `
  },

  // 2. TuxMat Floor Liners
  {
    fileName: 'tuxmat-floor-liners.webp',
    brand: 'TUXMAT • MAXIMUM COVERAGE',
    subtitle: 'TUXMAT CUSTOM HIGH-WALL ALL-WEATHER FLOOR LINERS',
    svg: `
      <!-- Deep 3D High Wall Tub -->
      <path d="M 180 150 L 620 150 L 650 365 C 650 390 600 405 540 405 L 260 405 C 200 405 150 390 150 365 Z" fill="url(#matteBlack)" stroke="#52525b" stroke-width="3"/>
      <!-- High Perimeter Spill Rim -->
      <path d="M 205 175 L 595 175 L 620 355 C 620 375 580 385 530 385 L 270 385 C 220 385 180 375 180 355 Z" fill="#141416" stroke="#3f3f46" stroke-width="2"/>
      
      <!-- Signature Diamond Quilted Texture -->
      <g stroke="#3f3f46" stroke-width="1.5" opacity="0.8">
        <path d="M 230 220 L 310 340 M 270 200 L 350 320 M 310 185 L 390 305 M 350 185 L 430 305 M 390 185 L 470 305 M 430 185 L 510 305 M 470 185 L 550 305 M 510 200 L 570 290"/>
        <path d="M 570 220 L 490 340 M 530 200 L 450 320 M 490 185 L 410 305 M 450 185 L 370 305 M 410 185 L 330 305 M 370 185 L 290 305 M 330 185 L 250 305 M 290 200 L 230 290"/>
      </g>

      <!-- Reinforced Heel Pad Area -->
      <rect x="300" y="270" width="200" height="85" rx="8" fill="#1f1f23" stroke="#f59e0b" stroke-width="1.5" opacity="0.9"/>
      <path d="M 320 285 L 480 285 M 320 300 L 480 300 M 320 315 L 480 315 M 320 330 L 480 330 M 320 345 L 480 345" stroke="#27272a" stroke-width="3" stroke-linecap="round"/>

      <!-- Floor Hook Retention Grommet -->
      <circle cx="280" cy="370" r="14" fill="#09090b" stroke="#71717a" stroke-width="2.5"/>
      <circle cx="280" cy="370" r="8" fill="#27272a"/>
      <circle cx="520" cy="370" r="14" fill="#09090b" stroke="#71717a" stroke-width="2.5"/>
      <circle cx="520" cy="370" r="8" fill="#27272a"/>

      <!-- TuxMat Metallic Badge -->
      <rect x="365" y="195" width="70" height="20" rx="4" fill="#09090b" stroke="#d4d4d8" stroke-width="1"/>
      <text x="400" y="209" fill="#f4f4f5" font-family="-apple-system, sans-serif" font-size="9" font-weight="900" text-anchor="middle" letter-spacing="1.2">TUXMAT</text>
    `
  },

  // 3. Spigen Screen Protector
  {
    fileName: 'spigen-screen-protector.webp',
    brand: 'SPIGEN • GLAS.TR EZ FIT',
    subtitle: 'SPIGEN 9H TEMPERED GLASS SCREEN PROTECTOR',
    svg: `
      <!-- Orange EZ-Fit Installation Frame -->
      <rect x="180" y="115" width="440" height="270" rx="14" fill="#ea580c" stroke="#f97316" stroke-width="3" opacity="0.95"/>
      <!-- Inner Frame Cutout -->
      <rect x="204" y="139" width="392" height="222" rx="8" fill="#18181b"/>
      
      <!-- Tempered Glass Screen -->
      <rect x="215" y="150" width="370" height="200" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      
      <!-- High gloss reflection sheen lines across screen -->
      <path d="M 250 150 L 370 150 L 290 350 L 230 350 Z" fill="url(#glassReflection)"/>
      <path d="M 410 150 L 480 150 L 420 350 L 370 350 Z" fill="url(#glassReflection)"/>

      <!-- Alignment Guides & EZ-Fit Arrows -->
      <path d="M 195 240 L 195 260 M 605 240 L 605 260" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
      <path d="M 390 126 L 410 126" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
      
      <!-- 9H Hardness Crest -->
      <g transform="translate(400, 250)">
        <polygon points="0,-36 30,-12 30,24 0,44 -30,24 -30,-12" fill="#09090b" stroke="#fbbf24" stroke-width="2.5"/>
        <text x="0" y="5" fill="#fbbf24" font-family="-apple-system, sans-serif" font-size="20" font-weight="900" text-anchor="middle">9H</text>
        <text x="0" y="22" fill="#a1a1aa" font-family="monospace" font-size="8" font-weight="700" text-anchor="middle">TEMPERED</text>
      </g>

      <!-- Spigen Brand Mark -->
      <text x="310" y="132" fill="#ffffff" font-family="-apple-system, sans-serif" font-size="11" font-weight="800" letter-spacing="1">spigen</text>
      <text x="490" y="132" fill="#ffffff" font-family="monospace" font-size="10" font-weight="600" opacity="0.9">EZ FIT</text>
    `
  },

  // 4. Center Console Divider
  {
    fileName: 'console-tray-organizer.webp',
    brand: 'PRECISION FIT • DUAL TIER',
    subtitle: 'DROP-IN CENTER CONSOLE ORGANIZER TRAY',
    svg: `
      <!-- Console Outer Tray Flange -->
      <rect x="200" y="120" width="400" height="270" rx="18" fill="url(#matteBlack)" stroke="#52525b" stroke-width="3.5"/>
      <rect x="215" y="135" width="370" height="240" rx="12" fill="#141416" stroke="#27272a" stroke-width="2"/>

      <!-- Left Compartment: Coin & Key Caddy -->
      <rect x="230" y="150" width="115" height="100" rx="8" fill="#1e1e24" stroke="#3f3f46" stroke-width="1.5"/>
      <!-- Coin Slots -->
      <circle cx="260" cy="185" r="16" fill="#09090b" stroke="#fbbf24" stroke-width="1.5"/>
      <circle cx="260" cy="185" r="11" fill="#fbbf24" opacity="0.2"/>
      <circle cx="295" cy="185" r="13" fill="#09090b" stroke="#fbbf24" stroke-width="1.5"/>
      <circle cx="295" cy="185" r="8" fill="#fbbf24" opacity="0.2"/>
      <text x="287" y="235" fill="#71717a" font-family="monospace" font-size="10" text-anchor="middle">COINS / KEYS</text>

      <!-- Bottom Left Section: Card / Badge slot -->
      <rect x="230" y="265" width="115" height="110" rx="8" fill="#1e1e24" stroke="#3f3f46" stroke-width="1.5"/>
      <rect x="245" y="285" width="85" height="55" rx="4" fill="#27272a" stroke="#52525b" stroke-width="1"/>
      <path d="M 255 312 L 315 312" stroke="#fbbf24" stroke-width="2"/>

      <!-- Right Compartment: Large Phone & Glasses Bed -->
      <rect x="360" y="150" width="225" height="225" rx="8" fill="#1e1e24" stroke="#3f3f46" stroke-width="1.5"/>
      <!-- Non-Slip Rubber Mat Pattern with Red/Amber Accent Line -->
      <rect x="370" y="160" width="205" height="205" rx="6" fill="#121215"/>
      <g stroke="#27272a" stroke-width="3">
        <line x1="390" y1="180" x2="555" y2="180"/>
        <line x1="390" y1="210" x2="555" y2="210"/>
        <line x1="390" y1="240" x2="555" y2="240"/>
        <line x1="390" y1="270" x2="555" y2="270"/>
        <line x1="390" y1="300" x2="555" y2="300"/>
        <line x1="390" y1="330" x2="555" y2="330"/>
      </g>
      <!-- Red/Amber Edge Trim on Mat -->
      <rect x="375" y="165" width="195" height="195" rx="4" fill="none" stroke="#f59e0b" stroke-width="1.5" opacity="0.6"/>

      <!-- USB Cable Pass-through Port -->
      <rect x="565" y="235" width="16" height="30" rx="4" fill="#09090b" stroke="#71717a" stroke-width="1.5"/>
      <circle cx="573" cy="250" r="3" fill="#38bdf8"/>
    `
  },

  // 5. J1772 Charger Lock
  {
    fileName: 'j1772-lock-ring.webp',
    brand: 'EV SECURITY • RAV4 PRIME / PHEV',
    subtitle: 'ALUMINUM COMBINATION J1772 CHARGER LOCK RING',
    svg: `
      <!-- Heavy Duty Anodized Outer Ring -->
      <circle cx="400" cy="270" r="115" fill="#18181b" stroke="#f59e0b" stroke-width="7"/>
      <circle cx="400" cy="270" r="105" fill="url(#matteBlack)" stroke="#3f3f46" stroke-width="2"/>
      
      <!-- Inner Hollow Socket (Plug Neck Passage) -->
      <circle cx="400" cy="270" r="62" fill="#09090b" stroke="#71717a" stroke-width="3"/>
      
      <!-- Top Mounted 3-Digit Combination Tumbler Module -->
      <rect x="340" y="115" width="120" height="60" rx="8" fill="#27272a" stroke="#f59e0b" stroke-width="2.5"/>
      
      <!-- 3 Wheels -->
      <g transform="translate(352, 128)">
        <rect x="0" y="0" width="26" height="34" rx="4" fill="#09090b" stroke="#71717a" stroke-width="1.5"/>
        <text x="13" y="22" fill="#fbbf24" font-family="monospace" font-size="14" font-weight="900" text-anchor="middle">0</text>
        
        <rect x="35" y="0" width="26" height="34" rx="4" fill="#09090b" stroke="#71717a" stroke-width="1.5"/>
        <text x="48" y="22" fill="#fbbf24" font-family="monospace" font-size="14" font-weight="900" text-anchor="middle">7</text>
        
        <rect x="70" y="0" width="26" height="34" rx="4" fill="#09090b" stroke="#71717a" stroke-width="1.5"/>
        <text x="83" y="22" fill="#fbbf24" font-family="monospace" font-size="14" font-weight="900" text-anchor="middle">2</text>
      </g>

      <!-- Locking Latch Teeth -->
      <path d="M 305 270 L 280 270 M 495 270 L 520 270" stroke="#f59e0b" stroke-width="6" stroke-linecap="round"/>
      
      <!-- Inner Socket Guide Notches -->
      <circle cx="380" cy="255" r="8" fill="#18181b" stroke="#52525b" stroke-width="2"/>
      <circle cx="420" cy="255" r="8" fill="#18181b" stroke="#52525b" stroke-width="2"/>
      <circle cx="400" cy="290" r="10" fill="#18181b" stroke="#52525b" stroke-width="2"/>

      <text x="400" y="355" fill="#a1a1aa" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle" letter-spacing="1.5">ANTI-UNPLUG SECURITY RING</text>
    `
  },

  // 6. Grizzl-E Level 2 Charger
  {
    fileName: 'grizzl-e-charger.webp',
    brand: 'GRIZZL-E • MADE IN CANADA',
    subtitle: 'GRIZZL-E CLASSIC 40A LEVEL 2 EV/PHEV CHARGER',
    svg: `
      <!-- Heavy Duty Cast Aluminum Housing -->
      <rect x="270" y="120" width="260" height="260" rx="18" fill="#1c1917" stroke="#78716c" stroke-width="4"/>
      <rect x="285" y="135" width="230" height="230" rx="12" fill="#292524" stroke="#44403c" stroke-width="2"/>

      <!-- Grizzl-E Canadian Bear Head Silhouette & Logo -->
      <g transform="translate(400, 200)">
        <polygon points="0,-40 25,-15 35,-30 45,5 20,25 -20,25 -45,5 -35,-30 -25,-15" fill="#09090b" stroke="#fbbf24" stroke-width="2"/>
        <text x="0" y="48" fill="#fafaf9" font-family="-apple-system, sans-serif" font-size="16" font-weight="900" text-anchor="middle" letter-spacing="2">GRIZZL-E</text>
      </g>

      <!-- Status LED Indicator Bar -->
      <g transform="translate(350, 280)">
        <rect x="0" y="0" width="100" height="12" rx="6" fill="#0c0a09" stroke="#57534e" stroke-width="1.5"/>
        <circle cx="20" cy="6" r="4" fill="#22c55e"/>
        <circle cx="50" cy="6" r="4" fill="#38bdf8"/>
        <circle cx="80" cy="6" r="4" fill="#a8a29e"/>
      </g>

      <!-- Specifications Strip -->
      <rect x="310" y="315" width="180" height="26" rx="4" fill="#1c1917" stroke="#fbbf24" stroke-width="1"/>
      <text x="400" y="332" fill="#fbbf24" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">40A • 240V • NEMA 4</text>

      <!-- Heavy-duty coiled cable coming from bottom -->
      <path d="M 400 380 C 400 420 540 420 540 370 C 540 320 620 320 620 380 L 620 400" fill="none" stroke="#0c0a09" stroke-width="16" stroke-linecap="round"/>
      <path d="M 400 380 C 400 420 540 420 540 370 C 540 320 620 320 620 380 L 620 400" fill="none" stroke="#292524" stroke-width="12" stroke-linecap="round"/>

      <!-- J1772 Holster Nozzle Handle on right -->
      <rect x="600" y="270" width="30" height="70" rx="8" fill="#18181b" stroke="#71717a" stroke-width="2"/>
      <circle cx="615" cy="305" r="8" fill="#fbbf24"/>
    `
  },

  // 7. Faraday RFID Pouch
  {
    fileName: 'faraday-pouch.webp',
    brand: 'KEYLESS RELAY DEFENSE',
    subtitle: 'RFID SIGNAL BLOCKING FARADAY KEY FOB POUCH',
    svg: `
      <!-- Pouch Body (Carbon texture / Ballistic nylon) -->
      <rect x="290" y="140" width="220" height="260" rx="16" fill="url(#matteBlack)" stroke="#52525b" stroke-width="3"/>
      
      <!-- Fold-over Top Flap -->
      <path d="M 290 140 L 510 140 L 490 220 C 490 230 470 240 400 240 C 330 240 310 230 310 220 Z" fill="#1c1c20" stroke="#f59e0b" stroke-width="2"/>
      
      <!-- Copper / Nickel RF Shielding Mesh Peeking Out -->
      <rect x="315" y="160" width="170" height="40" rx="4" fill="#b45309" opacity="0.3" stroke="#d97706" stroke-width="1" stroke-dasharray="3 3"/>
      
      <!-- Metallic RF Shielding Emblem -->
      <g transform="translate(400, 205)">
        <circle cx="0" cy="0" r="16" fill="#09090b" stroke="#f59e0b" stroke-width="2"/>
        <!-- Signal wave blocked -->
        <path d="M -8 0 A 8 8 0 0 1 8 0" fill="none" stroke="#f59e0b" stroke-width="2"/>
        <path d="M -12 -4 A 12 12 0 0 1 12 -4" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="2 2"/>
        <line x1="-8" y1="-8" x2="8" y2="8" stroke="#ef4444" stroke-width="2"/>
      </g>

      <!-- Key Ring Loop at Top -->
      <circle cx="400" cy="115" r="20" fill="none" stroke="url(#metalSilver)" stroke-width="4"/>
      <rect x="390" y="130" width="20" height="15" rx="3" fill="#3f3f46"/>

      <!-- Lower Stitching & Tech Specs -->
      <path d="M 305 375 L 495 375" stroke="#3f3f46" stroke-width="2" stroke-dasharray="4 4"/>
      <text x="400" y="320" fill="#fbbf24" font-family="-apple-system, sans-serif" font-size="12" font-weight="800" text-anchor="middle" letter-spacing="1">100% SIGNAL SHIELD</text>
      <text x="400" y="340" fill="#a1a1aa" font-family="monospace" font-size="10" text-anchor="middle">BLOCKS RELAY THEFT &amp; CLONING</text>
    `
  },

  // 8. Curt Trailer Hitch
  {
    fileName: 'curt-trailer-hitch.webp',
    brand: 'CURT • CLASS III RECEIVER',
    subtitle: 'CURT 2-INCH CUSTOM FIT RECEIVER HITCH',
    svg: `
      <!-- Cross tube main bar -->
      <rect x="160" y="210" width="480" height="40" rx="6" fill="#18181b" stroke="#52525b" stroke-width="3"/>
      <!-- Side Mounting Plates -->
      <path d="M 160 160 L 220 160 L 220 280 L 160 280 Z" fill="#27272a" stroke="#71717a" stroke-width="2.5"/>
      <circle cx="190" cy="180" r="8" fill="#09090b" stroke="#71717a" stroke-width="2"/>
      <circle cx="190" cy="260" r="8" fill="#09090b" stroke="#71717a" stroke-width="2"/>

      <path d="M 580 160 L 640 160 L 640 280 L 580 280 Z" fill="#27272a" stroke="#71717a" stroke-width="2.5"/>
      <circle cx="610" cy="180" r="8" fill="#09090b" stroke="#71717a" stroke-width="2"/>
      <circle cx="610" cy="260" r="8" fill="#09090b" stroke="#71717a" stroke-width="2"/>

      <!-- Center 2-inch Receiver Box -->
      <rect x="350" y="225" width="100" height="90" rx="8" fill="url(#matteBlack)" stroke="#71717a" stroke-width="3"/>
      <rect x="365" y="240" width="70" height="60" rx="4" fill="#09090b" stroke="#e4e4e7" stroke-width="3"/>
      
      <!-- Receiver Pin Hole -->
      <circle cx="400" cy="270" r="10" fill="#18181b" stroke="#fbbf24" stroke-width="2"/>

      <!-- Safety Chain Loops -->
      <path d="M 320 285 C 320 325 360 325 360 285" fill="none" stroke="url(#metalSilver)" stroke-width="7" stroke-linecap="round"/>
      <path d="M 440 285 C 440 325 480 325 480 285" fill="none" stroke="url(#metalSilver)" stroke-width="7" stroke-linecap="round"/>

      <!-- Curt Brand Yellow Label Badge -->
      <rect x="365" y="180" width="70" height="24" rx="3" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
      <text x="400" y="196" fill="#000000" font-family="-apple-system, sans-serif" font-size="12" font-weight="900" text-anchor="middle" letter-spacing="1">CURT</text>
    `
  },

  // 9. NOCO GB40 Jump Pack
  {
    fileName: 'noco-gb40-jump-pack.webp',
    brand: 'NOCO BOOST • 1000A LITHIUM',
    subtitle: 'NOCO GB40 ULTRA-SAFE EMERGENCY JUMP STARTER',
    svg: `
      <!-- Ruggedized Battery Casing -->
      <rect x="230" y="160" width="340" height="180" rx="18" fill="#18181b" stroke="#52525b" stroke-width="4"/>
      <rect x="250" y="180" width="300" height="60" rx="8" fill="#27272a" stroke="#3f3f46" stroke-width="1.5"/>

      <!-- Power Button with Red Ring -->
      <circle cx="300" cy="210" r="18" fill="#18181b" stroke="#ef4444" stroke-width="3"/>
      <circle cx="300" cy="210" r="10" fill="#ef4444"/>

      <!-- LED Battery Meter Indicators -->
      <g transform="translate(350, 203)">
        <circle cx="0" cy="7" r="6" fill="#22c55e"/>
        <circle cx="28" cy="7" r="6" fill="#22c55e"/>
        <circle cx="56" cy="7" r="6" fill="#22c55e"/>
        <circle cx="84" cy="7" r="6" fill="#22c55e"/>
        <circle cx="112" cy="7" r="6" fill="#eab308"/>
      </g>

      <!-- 1000A Boost Rating -->
      <text x="510" y="217" fill="#fbbf24" font-family="monospace" font-size="14" font-weight="900" text-anchor="middle">1000A</text>

      <!-- Heavy Duty Spark-Proof Clamps -->
      <!-- Red positive clamp -->
      <path d="M 270 265 L 340 310 L 320 325 L 250 280 Z" fill="#ef4444" stroke="#f87171" stroke-width="2"/>
      <circle cx="295" cy="287" r="6" fill="#b91c1c"/>
      <!-- Black negative clamp -->
      <path d="M 530 265 L 460 310 L 480 325 L 550 280 Z" fill="#27272a" stroke="#71717a" stroke-width="2"/>
      <circle cx="505" cy="287" r="6" fill="#09090b"/>

      <!-- NOCO Boost Logo -->
      <text x="400" y="295" fill="#fafafa" font-family="-apple-system, sans-serif" font-size="16" font-weight="900" text-anchor="middle" letter-spacing="2">NOCO BOOST+</text>
      <text x="400" y="320" fill="#a1a1aa" font-family="monospace" font-size="10" text-anchor="middle">SUB-ZERO TOYOTA 12V COLD CRANK</text>
    `
  },

  // 10. Fast USB-C PD Car Charger
  {
    fileName: 'fast-usbc-charger.webp',
    brand: 'FAST CHARGE • 65W DUAL PORT',
    subtitle: 'COMPACT METAL 65W USB-C PD 12V CAR CHARGER',
    svg: `
      <!-- Cylindrical Metal Body with 12V Tip -->
      <path d="M 360 210 L 440 210 L 450 330 C 450 350 430 365 400 365 C 370 365 350 350 350 330 Z" fill="url(#metalSilver)" stroke="#71717a" stroke-width="3"/>
      <!-- Center 12V Spring Contact Tip -->
      <circle cx="400" cy="375" r="10" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
      <!-- Side Negative Ground Springs -->
      <rect x="338" y="280" width="14" height="28" rx="4" fill="#52525b"/>
      <rect x="448" y="280" width="14" height="28" rx="4" fill="#52525b"/>

      <!-- Faceplate with Dual Type-C Ports -->
      <ellipse cx="400" cy="190" rx="60" ry="24" fill="#18181b" stroke="#38bdf8" stroke-width="3"/>
      
      <!-- Glowing Blue Ambient Ring -->
      <ellipse cx="400" cy="190" rx="52" ry="20" fill="#09090b" stroke="#38bdf8" stroke-width="1.5" opacity="0.8"/>
      
      <!-- USB-C Port 1 (45W) -->
      <rect x="382" y="177" width="36" height="8" rx="3" fill="#27272a" stroke="#38bdf8" stroke-width="1"/>
      <!-- USB-C Port 2 (20W) -->
      <rect x="382" y="193" width="36" height="8" rx="3" fill="#27272a" stroke="#fbbf24" stroke-width="1"/>

      <text x="400" y="145" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="700" text-anchor="middle">USB-C PD 3.0 / PPS</text>
    `
  },

  // 11. Ceramic Interior Leather Protection
  {
    fileName: 'ceramic-interior-protection.webp',
    brand: 'HYDROPHOBIC UV COATING',
    subtitle: 'CERAMIC INTERIOR & SOFTEX LEATHER SHIELD',
    svg: `
      <!-- Ergonomic Spray Bottle Body -->
      <path d="M 370 170 L 430 170 L 450 380 C 450 395 435 405 400 405 C 365 405 350 395 350 380 Z" fill="#18181b" stroke="#52525b" stroke-width="3"/>
      <!-- Trigger Sprayer Head -->
      <path d="M 380 120 L 435 120 L 440 170 L 375 170 Z" fill="#27272a" stroke="#71717a" stroke-width="2"/>
      <path d="M 350 125 L 380 125 L 380 145 L 350 145 Z" fill="#09090b" stroke="#f59e0b" stroke-width="1.5"/>
      <!-- Ergonomic Trigger -->
      <path d="M 375 135 C 360 150 360 175 375 185" fill="none" stroke="#f59e0b" stroke-width="5" stroke-linecap="round"/>

      <!-- Label on Bottle -->
      <rect x="360" y="230" width="80" height="130" rx="6" fill="#09090b" stroke="#f59e0b" stroke-width="1.5"/>
      <circle cx="400" cy="265" r="18" fill="#18181b" stroke="#38bdf8" stroke-width="1.5"/>
      <!-- Water Droplet Shield Graphic -->
      <path d="M 400 252 C 410 264 414 272 400 278 C 386 272 390 264 400 252 Z" fill="#38bdf8"/>
      
      <text x="400" y="305" fill="#fafafa" font-family="-apple-system, sans-serif" font-size="9" font-weight="900" text-anchor="middle">CERAMIC</text>
      <text x="400" y="320" fill="#fbbf24" font-family="monospace" font-size="7" font-weight="700" text-anchor="middle">SOFTEX SHIELD</text>
      <text x="400" y="340" fill="#a1a1aa" font-family="monospace" font-size="6" text-anchor="middle">ANTI-DYE / UV</text>
    `
  },

  // 12. Padded Armrest Cover
  {
    fileName: 'armrest-cover.webp',
    brand: 'ERGONOMIC COMFORT',
    subtitle: 'CUSTOM-FIT PADDED CENTER CONSOLE ARMREST COVER',
    svg: `
      <!-- Padded Cushion Contour -->
      <path d="M 230 160 L 570 160 C 600 160 620 185 610 280 C 605 320 570 345 540 345 L 260 345 C 230 345 195 320 190 280 C 180 185 200 160 230 160 Z" fill="url(#matteBlack)" stroke="#52525b" stroke-width="3"/>
      <!-- Double French Contrast Stitching -->
      <path d="M 245 180 L 555 180 C 575 180 590 200 585 270 C 580 300 555 325 530 325 L 270 325 C 245 325 220 300 215 270 C 210 200 225 180 245 180 Z" fill="#141416" stroke="#fbbf24" stroke-width="1.8" stroke-dasharray="5 4"/>
      
      <!-- Breathable Perforated Center Pad -->
      <rect x="290" y="210" width="220" height="90" rx="8" fill="#1a1a1e" stroke="#3f3f46" stroke-width="1"/>
      <g fill="#27272a">
        <circle cx="320" cy="235" r="2"/><circle cx="340" cy="235" r="2"/><circle cx="360" cy="235" r="2"/><circle cx="380" cy="235" r="2"/><circle cx="400" cy="235" r="2"/><circle cx="420" cy="235" r="2"/><circle cx="440" cy="235" r="2"/><circle cx="460" cy="235" r="2"/><circle cx="480" cy="235" r="2"/>
        <circle cx="320" cy="255" r="2"/><circle cx="340" cy="255" r="2"/><circle cx="360" cy="255" r="2"/><circle cx="380" cy="255" r="2"/><circle cx="400" cy="255" r="2"/><circle cx="420" cy="255" r="2"/><circle cx="440" cy="255" r="2"/><circle cx="460" cy="255" r="2"/><circle cx="480" cy="255" r="2"/>
        <circle cx="320" cy="275" r="2"/><circle cx="340" cy="275" r="2"/><circle cx="360" cy="275" r="2"/><circle cx="380" cy="275" r="2"/><circle cx="400" cy="275" r="2"/><circle cx="420" cy="275" r="2"/><circle cx="440" cy="275" r="2"/><circle cx="460" cy="275" r="2"/><circle cx="480" cy="275" r="2"/>
      </g>
      <text x="400" y="380" fill="#a1a1aa" font-family="monospace" font-size="11" font-weight="600" text-anchor="middle">MEMORY FOAM • RELIEVES ELBOW FATIGUE</text>
    `
  },

  // 13. Console Edge Knee Cushion
  {
    fileName: 'knee-cushion.webp',
    brand: 'ROAD TRIP RELIEF',
    subtitle: 'DRIVER CONSOLE EDGE LEATHER KNEE CUSHION',
    svg: `
      <!-- Ergonomic Curved Wedge Profile -->
      <path d="M 270 170 C 350 140 450 140 530 170 C 560 185 575 220 570 290 C 565 330 540 360 500 365 C 430 375 370 375 300 365 C 260 360 235 330 230 290 C 225 220 240 185 270 170 Z" fill="url(#matteBlack)" stroke="#52525b" stroke-width="3"/>
      <!-- Soft Padded Foam Core with Amber Stitching -->
      <path d="M 290 190 C 360 165 440 165 510 190 C 535 205 545 230 540 280 C 535 315 515 340 480 345 C 420 355 380 355 320 345 C 285 340 265 315 260 280 C 255 230 265 205 290 190 Z" fill="#141416" stroke="#fbbf24" stroke-width="1.8" stroke-dasharray="6 4"/>
      
      <!-- Foam Plumpness Contour Line -->
      <path d="M 300 260 C 370 240 430 240 500 260" stroke="#27272a" stroke-width="3" stroke-linecap="round"/>
      <text x="400" y="295" fill="#fafafa" font-family="-apple-system, sans-serif" font-size="13" font-weight="800" text-anchor="middle">ERGONOMIC KNEE REST</text>
      <text x="400" y="315" fill="#fbbf24" font-family="monospace" font-size="10" text-anchor="middle">SOFT LEATHERETTE • 3M VHB MOUNT</text>
    `
  },

  // 14. Muslogy RAV4 Center Console Organizer
  {
    fileName: 'muslogy-rav4-organizer.webp',
    brand: 'MUSLOGY • DIRECT FIT 2% OFF',
    subtitle: 'MUSLOGY TOYOTA RAV4 CONSOLE TRAY & DIVIDER',
    svg: `
      <!-- Console Outer Tray Flange -->
      <rect x="195" y="115" width="410" height="280" rx="18" fill="url(#matteBlack)" stroke="#f59e0b" stroke-width="3"/>
      <rect x="210" y="130" width="380" height="250" rx="12" fill="#141416" stroke="#3f3f46" stroke-width="2"/>

      <!-- Left Compartment: Coin, Key & Card Caddy -->
      <rect x="225" y="145" width="120" height="110" rx="8" fill="#1e1e24" stroke="#52525b" stroke-width="1.5"/>
      <circle cx="255" cy="180" r="16" fill="#09090b" stroke="#fbbf24" stroke-width="1.5"/>
      <circle cx="255" cy="180" r="11" fill="#fbbf24" opacity="0.25"/>
      <circle cx="290" cy="180" r="13" fill="#09090b" stroke="#fbbf24" stroke-width="1.5"/>
      <circle cx="290" cy="180" r="8" fill="#fbbf24" opacity="0.25"/>
      <text x="285" y="235" fill="#fbbf24" font-family="monospace" font-size="10" font-weight="700" text-anchor="middle">COINS / KEYS</text>

      <!-- Bottom Left Section: Card / Badge slot -->
      <rect x="225" y="265" width="120" height="100" rx="8" fill="#1e1e24" stroke="#52525b" stroke-width="1.5"/>
      <rect x="240" y="285" width="90" height="48" rx="4" fill="#27272a" stroke="#fbbf24" stroke-width="1"/>
      <path d="M 250 309 L 320 309" stroke="#fbbf24" stroke-width="2"/>
      <text x="285" y="352" fill="#a1a1aa" font-family="monospace" font-size="9" text-anchor="middle">CARD VAULT</text>

      <!-- Right Compartment: Large Phone & Sunglasses Bed -->
      <rect x="355" y="145" width="225" height="220" rx="8" fill="#1e1e24" stroke="#52525b" stroke-width="1.5"/>
      <rect x="365" y="155" width="205" height="200" rx="6" fill="#101014"/>
      <!-- Textured Non-Slip Rubber Mat Pattern -->
      <g stroke="#27272a" stroke-width="2.5">
        <line x1="385" y1="175" x2="550" y2="175"/>
        <line x1="385" y1="200" x2="550" y2="200"/>
        <line x1="385" y1="225" x2="550" y2="225"/>
        <line x1="385" y1="250" x2="550" y2="250"/>
        <line x1="385" y1="275" x2="550" y2="275"/>
        <line x1="385" y1="300" x2="550" y2="300"/>
        <line x1="385" y1="325" x2="550" y2="325"/>
      </g>
      <!-- Amber Accent Perimeter Trim -->
      <rect x="370" y="160" width="195" height="190" rx="4" fill="none" stroke="#f59e0b" stroke-width="1.5" opacity="0.7"/>

      <!-- Muslogy Official Brand Inscription -->
      <g transform="translate(468, 245)">
        <rect x="-65" y="-12" width="130" height="24" rx="4" fill="#09090b" stroke="#f59e0b" stroke-width="1.2"/>
        <text x="0" y="4" fill="#fafafa" font-family="-apple-system, sans-serif" font-size="12" font-weight="900" letter-spacing="1.5" text-anchor="middle">MUSLOGY</text>
      </g>

      <!-- USB Pass-Through Cable Notch -->
      <rect x="565" y="230" width="18" height="34" rx="4" fill="#09090b" stroke="#fbbf24" stroke-width="1.5"/>
      <circle cx="574" cy="247" r="3.5" fill="#38bdf8"/>
    `
  },

  // 15. Muslogy Sienna Center Console Bridge Organizer
  {
    fileName: 'muslogy-sienna-organizer.webp',
    brand: 'MUSLOGY • DIRECT FIT 2% OFF',
    subtitle: 'MUSLOGY TOYOTA SIENNA CONSOLE & BRIDGE ORGANIZER',
    svg: `
      <!-- Sienna Cavernous Dual-Tier Bridge Housing -->
      <path d="M 180 130 L 620 130 L 640 370 C 640 395 590 405 530 405 L 270 405 C 210 405 160 395 160 370 Z" fill="url(#matteBlack)" stroke="#f59e0b" stroke-width="3.5"/>
      <path d="M 195 145 L 605 145 L 620 360 C 620 380 575 390 520 390 L 280 390 C 225 390 180 380 180 360 Z" fill="#141416" stroke="#3f3f46" stroke-width="2"/>

      <!-- Sliding Upper Tray Carrier -->
      <rect x="220" y="165" width="360" height="95" rx="8" fill="#1e1e24" stroke="#52525b" stroke-width="1.8"/>
      <!-- Left Sub-tray: Sunglasses / Pens -->
      <rect x="235" y="177" width="150" height="70" rx="6" fill="#101014" stroke="#f59e0b" stroke-width="1"/>
      <path d="M 255 212 C 275 195 305 195 325 212" stroke="#fbbf24" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <circle cx="270" cy="216" r="12" fill="none" stroke="#fbbf24" stroke-width="2"/>
      <circle cx="310" cy="216" r="12" fill="none" stroke="#fbbf24" stroke-width="2"/>
      <!-- Right Sub-tray: Mobile & Keys -->
      <rect x="400" y="177" width="165" height="70" rx="6" fill="#101014" stroke="#f59e0b" stroke-width="1"/>
      <rect x="420" y="190" width="125" height="44" rx="4" fill="#1a1a20" stroke="#3f3f46" stroke-width="1"/>
      <text x="482" y="217" fill="#fbbf24" font-family="monospace" font-size="10" font-weight="700" text-anchor="middle">FAST GRAB</text>

      <!-- Lower Bridge Wide Compartment (Holds Bags & Tablets) -->
      <rect x="220" y="275" width="360" height="90" rx="8" fill="#19191e" stroke="#3f3f46" stroke-width="1.5"/>
      <g stroke="#27272a" stroke-width="2">
        <line x1="240" y1="295" x2="560" y2="295"/>
        <line x1="240" y1="315" x2="560" y2="315"/>
        <line x1="240" y1="335" x2="560" y2="335"/>
      </g>
      <text x="400" y="325" fill="#fafafa" font-family="-apple-system, sans-serif" font-size="13" font-weight="900" letter-spacing="2" text-anchor="middle">MUSLOGY SIENNA BRIDGE</text>
      <text x="400" y="345" fill="#a1a1aa" font-family="monospace" font-size="9" text-anchor="middle">ANTI-SLIP MATTED LOWER DECK</text>
    `
  },

  // 16. Muslogy Custom Padded Armrest Cover
  {
    fileName: 'muslogy-armrest-cover.webp',
    brand: 'MUSLOGY • ERGONOMIC COMFORT 2% OFF',
    subtitle: 'MUSLOGY CUSTOM-FIT PADDED ARMREST COVER',
    svg: `
      <!-- Soft Memory-Foam Contour Cushion -->
      <path d="M 220 150 L 580 150 C 610 150 630 175 620 280 C 615 330 580 355 540 355 L 260 355 C 220 355 185 330 180 280 C 170 175 190 150 220 150 Z" fill="url(#matteBlack)" stroke="#f59e0b" stroke-width="3"/>
      <!-- Amber French Double Stitching -->
      <path d="M 235 170 L 565 170 C 585 170 600 190 595 265 C 590 305 565 335 530 335 L 270 335 C 235 335 210 305 205 265 C 200 190 215 170 235 170 Z" fill="#141416" stroke="#fbbf24" stroke-width="2" stroke-dasharray="6 4"/>

      <!-- Diamond-Quilted Breathable Center Section -->
      <rect x="280" y="195" width="240" height="115" rx="10" fill="#1a1a20" stroke="#3f3f46" stroke-width="1.2"/>
      <g stroke="#3f3f46" stroke-width="1.5" opacity="0.7">
        <path d="M 300 215 L 340 295 M 340 195 L 380 275 M 380 195 L 420 275 M 420 195 L 460 275 M 460 195 L 500 275"/>
        <path d="M 500 215 L 460 295 M 460 195 L 420 275 M 420 195 L 380 275 M 380 195 L 340 275 M 340 195 L 300 275"/>
      </g>

      <!-- Center Metallic Muslogy Brand Emblem -->
      <g transform="translate(400, 252)">
        <rect x="-60" y="-14" width="120" height="28" rx="6" fill="#09090b" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="0" y="5" fill="#fafafa" font-family="-apple-system, sans-serif" font-size="12" font-weight="900" letter-spacing="1.5" text-anchor="middle">MUSLOGY</text>
      </g>

      <text x="400" y="380" fill="#fbbf24" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">SOFTEX LEATHERETTE • SUB-ZERO FLEXIBLE</text>
    `
  }
];

async function generateAll() {
  console.log(`Generating ${GEAR_ITEMS.length} high-res WebP gear visuals in ${outDir}...`);
  for (const item of GEAR_ITEMS) {
    // Official partner studio photography must not be overwritten by synthetic SVG mockups
    const dest = path.join(outDir, item.fileName);
    if (
      ['muslogy-rav4-organizer.webp', 'muslogy-sienna-organizer.webp', 'muslogy-armrest-cover.webp'].includes(
        item.fileName
      ) &&
      fs.existsSync(dest)
    ) {
      console.log(`Preserving official photography: ${item.fileName}`);
      continue;
    }

    const svgStr = getCardFrameSvg(item.svg, item.brand, item.subtitle);
    await sharp(Buffer.from(svgStr))
      .webp({ quality: 95, effort: 6 })
      .toFile(dest);
    console.log(`Generated: ${item.fileName}`);
  }
  console.log('All local gear WebP visuals created successfully!');
}

generateAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
