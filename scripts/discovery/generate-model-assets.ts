import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

interface ModelDesign {
  slug: string;
  name: string;
  accentColor: string;
  bodyType: 'suv' | 'sedan' | 'truck' | 'van';
}

const MODELS: ModelDesign[] = [
  { slug: 'sienna', name: 'Toyota Sienna', accentColor: '#38bdf8', bodyType: 'van' },
  { slug: 'sienna-limited', name: 'Toyota Sienna Limited', accentColor: '#38bdf8', bodyType: 'van' },
  { slug: 'rav4', name: 'Toyota RAV4', accentColor: '#10b981', bodyType: 'suv' },
  { slug: 'rav4-hybrid', name: 'Toyota RAV4 Hybrid', accentColor: '#38bdf8', bodyType: 'suv' },
  { slug: 'rav4-hybrid-xse-awd', name: 'Toyota RAV4 Hybrid XSE AWD', accentColor: '#38bdf8', bodyType: 'suv' },
  { slug: 'rav4-plug-in-hybrid', name: 'Toyota RAV4 Plug-in Hybrid', accentColor: '#6366f1', bodyType: 'suv' },
  { slug: 'grand-highlander', name: 'Toyota Grand Highlander', accentColor: '#0ea5e9', bodyType: 'suv' },
  { slug: 'grand-highlander-hybrid', name: 'Toyota Grand Highlander Hybrid', accentColor: '#0ea5e9', bodyType: 'suv' },
  { slug: 'highlander', name: 'Toyota Highlander', accentColor: '#0ea5e9', bodyType: 'suv' },
  { slug: 'tacoma', name: 'Toyota Tacoma', accentColor: '#f59e0b', bodyType: 'truck' },
  { slug: 'tundra', name: 'Toyota Tundra', accentColor: '#ea580c', bodyType: 'truck' },
  { slug: '4runner', name: 'Toyota 4Runner', accentColor: '#d97706', bodyType: 'suv' },
  { slug: 'corolla', name: 'Toyota Corolla', accentColor: '#06b6d4', bodyType: 'sedan' },
  { slug: 'corolla-cross', name: 'Toyota Corolla Cross', accentColor: '#06b6d4', bodyType: 'suv' },
  { slug: 'camry', name: 'Toyota Camry', accentColor: '#3b82f6', bodyType: 'sedan' },
  { slug: 'camry-hybrid', name: 'Toyota Camry Hybrid', accentColor: '#3b82f6', bodyType: 'sedan' },
  { slug: 'prius', name: 'Toyota Prius', accentColor: '#8b5cf6', bodyType: 'sedan' },
  { slug: 'prius-plug-in-hybrid', name: 'Toyota Prius Plug-in Hybrid', accentColor: '#8b5cf6', bodyType: 'sedan' },
  { slug: 'bz4x', name: 'Toyota bZ4X', accentColor: '#0284c7', bodyType: 'suv' },
  { slug: 'land-cruiser', name: 'Toyota Land Cruiser', accentColor: '#b45309', bodyType: 'suv' },
  { slug: 'crown-signia', name: 'Toyota Crown Signia', accentColor: '#64748b', bodyType: 'suv' },
];

function generateSvg(design: ModelDesign): string {
  const isTruck = design.bodyType === 'truck';
  const isVan = design.bodyType === 'van';
  const isSedan = design.bodyType === 'sedan';

  // Body roofline and cabin geometry
  let roofPath: string;
  let cabinFill: string;

  if (isTruck) {
    roofPath = 'M 95 270 L 115 220 L 225 215 L 250 148 L 380 148 L 410 205 L 540 215 L 550 250 L 542 270 L 500 270';
    cabinFill = 'M 265 205 L 290 158 L 372 158 L 400 205 Z';
  } else if (isVan) {
    roofPath = 'M 95 270 L 105 210 L 180 165 L 430 160 L 515 210 L 545 245 L 540 270 L 500 270';
    cabinFill = 'M 195 205 L 220 172 L 420 170 L 495 205 Z';
  } else if (isSedan) {
    roofPath = 'M 100 270 L 125 245 L 185 220 L 260 165 L 420 165 L 485 225 L 540 245 L 542 270 L 500 270';
    cabinFill = 'M 270 215 L 300 175 L 410 175 L 465 215 Z';
  } else {
    // Standard modern SUV / crossover
    roofPath = 'M 105 270 L 120 238 L 175 195 L 255 190 L 335 142 L 460 145 L 515 215 L 540 245 L 538 270 L 500 270';
    cabinFill = 'M 270 190 L 335 152 L 450 154 L 495 205 Z';
  }

  return `<svg width="640" height="400" viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="backdrop" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#1e2029"/>
      <stop offset="60%" stop-color="#101116"/>
      <stop offset="100%" stop-color="#090a0d"/>
    </radialGradient>
    <linearGradient id="bodyGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${design.accentColor}" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="${design.accentColor}" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="floorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#27272a" stop-opacity="0"/>
      <stop offset="50%" stop-color="${design.accentColor}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#27272a" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Studio Backdrop -->
  <rect width="640" height="400" fill="url(#backdrop)"/>

  <!-- Reflection Plane -->
  <line x1="50" y1="285" x2="590" y2="285" stroke="url(#floorGrad)" stroke-width="2"/>
  <ellipse cx="320" cy="285" rx="220" ry="8" fill="${design.accentColor}" opacity="0.08"/>

  <!-- Vehicle Silhouette Outline -->
  <path d="${roofPath}" fill="none" stroke="url(#bodyGlow)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  
  <!-- Cabin Glass -->
  <path d="${cabinFill}" fill="#14151b" stroke="#3f3f46" stroke-width="1.5"/>

  <!-- Rear Wheel Assembly -->
  <circle cx="185" cy="270" r="33" fill="#090a0d" stroke="#52525b" stroke-width="3"/>
  <circle cx="185" cy="270" r="20" fill="#18181b" stroke="${design.accentColor}" stroke-width="2"/>
  <circle cx="185" cy="270" r="7" fill="#71717a"/>

  <!-- Front Wheel Assembly -->
  <circle cx="465" cy="270" r="33" fill="#090a0d" stroke="#52525b" stroke-width="3"/>
  <circle cx="465" cy="270" r="20" fill="#18181b" stroke="${design.accentColor}" stroke-width="2"/>
  <circle cx="465" cy="270" r="7" fill="#71717a"/>

  <!-- LED Headlight / Taillight Accent Lines -->
  <line x1="520" y1="230" x2="538" y2="238" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="108" y1="235" x2="118" y2="232" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>

  <!-- Factory Spec Header / Watermark -->
  <text x="320" y="70" text-anchor="middle" fill="#71717a" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" letter-spacing="0.18em">
    FACTORY SPECIFICATION RENDER
  </text>
  <text x="320" y="340" text-anchor="middle" fill="#f4f4f5" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="700" letter-spacing="0.05em">
    ${design.name.toUpperCase()}
  </text>
  <text x="320" y="360" text-anchor="middle" fill="#a1a1aa" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="500" letter-spacing="0.04em">
    STUDIO TRIM SPECIFICATION &#8226; OFFICIAL DIMENSIONS
  </text>
</svg>`;
}

async function main() {
  const years = ['2025', '2026', '2027'];
  for (const year of years) {
    const dir = path.join(process.cwd(), 'public', 'assets', 'models', year);
    fs.mkdirSync(dir, { recursive: true });
    for (const model of MODELS) {
      const svg = generateSvg(model);
      const filePath = path.join(dir, `${model.slug}.webp`);
      await sharp(Buffer.from(svg))
        .webp({ quality: 85 })
        .toFile(filePath);
    }
  }

  // Also root public/assets/models/
  const rootDir = path.join(process.cwd(), 'public', 'assets', 'models');
  for (const model of MODELS) {
    const svg = generateSvg(model);
    const filePath = path.join(rootDir, `${model.slug}.webp`);
    await sharp(Buffer.from(svg))
      .webp({ quality: 85 })
      .toFile(filePath);
  }

  console.log(`Successfully generated factory trim renders for ${MODELS.length} models across 2025, 2026, and 2027.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
