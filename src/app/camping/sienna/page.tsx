import React from 'react';
import type { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  ShieldCheck,
  BatteryCharging,
  Fuel,
  ThermometerSnowflake,
  Zap,
  Tent,
  Moon,
  Info,
  Car,
  Sparkles,
} from 'lucide-react';
import {
  SiennaCampingGrid,
  type SiennaCampingGear,
  AFFILIATE_TAG,
} from './sienna-camping-grid';
import {
  CampingChecklistModal,
  CampingChecklistTrigger,
  type ChecklistItem,
} from '@/components/camping/CampingChecklistModal';

export const revalidate = 3600;

export const metadata: Metadata = {
  metadataBase: new URL('https://www.toyotawaits.ca'),
  title: 'Toyota Sienna Camper Van Conversion & Road Trip Gear (2021–2026) | ToyotaWaits',
  description:
    'Turn your hybrid Toyota Sienna into a stealth camper. Curated sleeping pads, blackout divider curtains, magnetic sliding door bug nets, 12V fridges, and tailgate shelters.',
  keywords: [
    'toyota sienna camper van',
    'toyota sienna car camping',
    'sienna hybrid camper conversion',
    'toyota sienna ready mode climate control camping',
    'sienna stealth camping gear',
    'toyota sienna mattress',
    'sienna sliding door bug net',
    'toyota sienna 2021 2026 accessories',
  ],
  alternates: {
    canonical: 'https://www.toyotawaits.ca/camping/sienna',
  },
  openGraph: {
    title: 'Toyota Sienna Camper Van Conversion & Road Trip Gear (2021–2026) | ToyotaWaits',
    description:
      'Turn your hybrid Toyota Sienna into a stealth camper. Curated sleeping pads, blackout divider curtains, magnetic sliding door bug nets, 12V fridges, and tailgate shelters.',
    url: 'https://www.toyotawaits.ca/camping/sienna',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toyota Sienna Camper Van Conversion & Road Trip Gear (2021–2026) | ToyotaWaits',
    description:
      'Turn your hybrid Toyota Sienna into a stealth camper. Curated sleeping pads, blackout divider curtains, magnetic sliding door bug nets, 12V fridges, and tailgate shelters.',
  },
};

export { type SiennaCampingGear, AFFILIATE_TAG, CampingChecklistModal };

export const SIENNA_CHECKLIST_ITEMS: ChecklistItem[] = [
  { category: 'Window Privacy & Bug Screens', item: 'Magnetic sliding door bug screens' },
  { category: 'Window Privacy & Bug Screens', item: 'B-Pillar telescopic blackout divider curtain' },
  { category: 'Window Privacy & Bug Screens', item: 'Custom-fit reflective multi-layer window shades' },
  { category: 'Sleep Setup', item: 'Tailored wavy-baffle Sienna inflatable air mattress' },
  { category: 'Sleep Setup', item: '12V high-speed electric air pump & nozzle set' },
  { category: '12V Refrigeration & Power', item: 'Compact 12V compressor refrigerator / freezer' },
  { category: '12V Refrigeration & Power', item: '12V fridge DC power cable & 120V AC inverter lead' },
  { category: 'Camp Stabilization', item: 'Heavy-duty wheel chocks & RV leveling blocks' },
  { category: 'Vehicle Readiness', item: 'Hybrid key fob backup battery (CR2450 / CR2032)' },
  { category: 'Vehicle Readiness', item: 'Portable 12V lithium jump starter pack & tire inflator' },
  { category: 'Tailgate & Outdoor Living', item: 'Tailgate liftgate mesh awning & storm enclosure' },
  { category: 'Tailgate & Outdoor Living', item: 'Bridge shifter lower floor organizer tray' },
];

export const SIENNA_CAMPING_GEAR: SiennaCampingGear[] = [
  {
    id: 'sienna-bug-screens',
    name: 'Magnetic Sliding Door Bug Screens',
    badge: 'Custom Fit',
    category: 'Window Privacy & Bug Screens',
    fitment: 'Direct Fit: Sienna 2021–2026 (LE, XLE, XSE, Woodland, Limited, Platinum)',
    features: [
      'Neodymium perimeter seal anchors firmly to Sienna sliding door steel frames for zero-gap bug defense',
      'Ultra-fine breathable micro-mesh enables full cross-ventilation during warm summer nights without mosquitoes',
      'Dual-sided heavy-duty center zipper lets you enter and exit the minivan cabin without peeling back the magnets',
    ],
    priceCad: '$65 – $95 CAD',
    query: 'Toyota Sienna magnetic sliding door bug screen net',
  },
  {
    id: 'sienna-divider-curtain',
    name: 'B-Pillar Telescopic Blackout Divider Curtain',
    badge: 'Stealth Camp',
    category: 'Window Privacy & Bug Screens',
    fitment: 'Direct Fit: Sienna 2021–2026 (LE, XLE, XSE, Woodland, Limited, Platinum)',
    features: [
      'Opaque privacy partition sealing the front cab from the sleeping quarters to eliminate silhouette shadows',
      'Telescopic tension line with pillar-mounted snap anchors isolates front windshield glare and streetlamps',
      'Center magnetic closure allows instant front cockpit access to check mirrors or adjust vehicle settings',
    ],
    priceCad: '$35 – $55 CAD',
    query: 'car divider curtains privacy blackout b-pillar sienna',
  },
  {
    id: 'sienna-air-mattress',
    name: 'Tailored Wavy-Baffle Sienna Inflatable Air Mattress',
    badge: 'Must-Have',
    category: 'Sleep Setup',
    fitment: 'Direct Fit: Sienna 2021–2026 (LE, XLE, XSE, Woodland, Limited, Platinum)',
    features: [
      'Multi-chamber flocking designed to contour over stowed 3rd-row seats and deep rear floor wells',
      'Ergonomic wavy-baffle structure distributes body weight evenly across the flat 78-inch sleeping length',
      'Includes high-output 12V electric pump that inflates both dual-sided sleeper zones in under 3 minutes',
    ],
    priceCad: '$95 – $145 CAD',
    query: 'Toyota Sienna car camping mattress sleeping pad',
  },
  {
    id: 'sienna-12v-fridge',
    name: 'Compact 12V Compressor Refrigerator / Freezer',
    badge: '12V Hybrid Ready',
    category: '12V Refrigeration',
    fitment: 'Direct Fit: Sienna 2021–2026 (LE, XLE, XSE, Woodland, Limited, Platinum)',
    features: [
      '20–25L capacity with true compressor cooling down to -20°C (-4°F) without messy melting ice bags',
      'Ultra-efficient 35–45W draw with 3-stage dynamic battery protection engineered for hybrid 12V ports',
      'Whisper-quiet <42dB operation fits neatly behind the 2nd-row captain chairs or in the lower trunk well',
    ],
    priceCad: '$220 – $340 CAD',
    query: '12V compressor refrigerator portable freezer 20L 25L',
  },
  {
    id: 'sienna-tailgate-awning',
    name: 'Tailgate Liftgate Mesh Awning / Camp Enclosure',
    badge: 'Tailgate Ready',
    category: 'Tailgate & Outdoor Living',
    fitment: 'Direct Fit: Sienna 2021–2026 (LE, XLE, XSE, Woodland, Limited, Platinum)',
    features: [
      'Transforms the open rear hatch into a standing-height outdoor kitchen/vestibule with 6.5ft clearance',
      'Dual-layer zippered enclosure combines high-density no-see-um mesh with waterproof storm flaps',
      'Quick 5-minute setup with elastic tension straps hooking directly to rear wheel wells and bumper anchor points',
    ],
    priceCad: '$110 – $180 CAD',
    query: 'SUV tailgate tent awning liftgate shade screen mesh sienna',
  },
  {
    id: 'sienna-bridge-tray',
    name: 'Bridge Shifter Lower Floor Organizer Tray',
    badge: 'Custom Fit',
    category: 'Tailgate & Outdoor Living',
    fitment: 'Direct Fit: Sienna 2021–2026 (LE, XLE, XSE, Woodland, Limited, Platinum)',
    features: [
      'Utilizes dead space under the front console for camping essentials, power banks, and headlamps',
      'Precision-molded ABS construction with non-slip grooved rubber liners prevents rattles and forward sliding',
      'Preserves uninhibited access to lower 12V DC power socket and dual USB fast-charging ports',
    ],
    priceCad: '$25 – $40 CAD',
    query: 'Toyota Sienna center console organizer lower bridge tray 2021-2026',
  },
];

export default function SiennaCampingPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 pt-4 sm:pt-6 pb-20">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
        <BackButton className="mb-2" />

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/90 via-zinc-900/60 to-zinc-950/90 p-6 sm:p-10 shadow-2xl">
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <Tent className="h-3.5 w-3.5" />
              <span>Overland & Stealth Camping Setup</span>
              <span className="text-zinc-600">•</span>
              <span>4th-Gen Sienna (2021–2026+)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Toyota Sienna Stealth Camper & Road Trip Setup
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Maximize the hybrid electrical architecture and cavernous sliding-door cabin with
              custom-fit sleeping, privacy, and off-grid gear.
            </p>

            <div className="pt-2">
              <CampingChecklistTrigger
                vehicleName="Toyota Sienna"
                defaultItems={SIENNA_CHECKLIST_ITEMS}
                buttonLabel="Open Sienna Camping Checklist"
              />
            </div>
          </div>

          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Hybrid Camping Callout Box */}
        <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-zinc-900/80 to-zinc-900/50 shadow-xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400 border border-emerald-500/30">
                <BatteryCharging className="h-5 w-5" />
              </div>
              <div>
                <CardTitle as="h2" className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <span>Hybrid &apos;Camp Mode&apos;: Running Climate Control Overnight in READY Mode</span>
                </CardTitle>
                <p className="text-xs text-emerald-400/90 font-medium mt-0.5">
                  Full Heating & Air Conditioning with Negligible Fuel Consumption
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 text-xs sm:text-sm text-zinc-300 space-y-3 leading-relaxed">
            <p>
              Because the 4th-Gen Sienna is exclusively a Toyota Hybrid System (THS-II) vehicle, you
              can sleep in complete climate-controlled comfort without an auxiliary diesel heater or
              external generator. By leaving the vehicle switched on in <strong className="text-emerald-300 font-semibold">&apos;READY&apos; mode</strong> overnight,
              the high-voltage NiMH/Li-ion hybrid traction battery powers the electric A/C compressor and cabin blower motor completely silently.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-white">
                  <Fuel className="h-4 w-4 text-amber-400" />
                  <span>~2.5–3.5L Per Night</span>
                </div>
                <p className="text-zinc-400">
                  The 2.5L engine only fires for ~2 minutes every 30–45 minutes to recharge the hybrid pack, consuming negligible gasoline over an 8-hour sleep.
                </p>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-white">
                  <ThermometerSnowflake className="h-4 w-4 text-cyan-400" />
                  <span>Thermostatic Comfort</span>
                </div>
                <p className="text-zinc-400">
                  Set rear cabin temperature to 20°C (68°F). Electric inverter heat pump maintains steady temperatures in sub-zero frosts or summer heatwaves.
                </p>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-white">
                  <Moon className="h-4 w-4 text-purple-400" />
                  <span>Stealth Mode Tips</span>
                </div>
                <p className="text-zinc-400">
                  Shift to Park (P), set Electronic Parking Brake (EPB), switch headlights to OFF (kills DRLs), and select &apos;Screen Off&apos; in infotainment settings.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Curated Camping Gear Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Curated Sienna Overland & Camping Gear
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Select a category tab to filter field-tested gear optimized for 4th-Gen Sienna floor geometry and 12V hybrid electrical rails.
            </p>
          </div>

          <SiennaCampingGrid items={SIENNA_CAMPING_GEAR} />
        </div>

        {/* Affiliate Disclosure Banner */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5 text-center text-xs text-zinc-400 space-y-1">
          <p className="font-medium text-zinc-300">
            As an Amazon Associate, ToyotaWaits earns from qualifying purchases.
          </p>
          <p className="text-[11px] text-zinc-500 max-w-2xl mx-auto">
            All outbound links direct to Amazon.ca search queries matching verified fitment specifications for 2021–2026+ Toyota Sienna minivans. Pricing and availability subject to vendor inventory.
          </p>
        </div>
      </div>
    </main>
  );
}
