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
  Compass,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  Rav4CampingGrid,
  type Rav4CampingGear,
  AFFILIATE_TAG,
} from './rav4-camping-grid';
import {
  CampingChecklistModal,
  CampingChecklistTrigger,
  type ChecklistItem,
} from '@/components/camping/CampingChecklistModal';

export const revalidate = 3600;

export const metadata: Metadata = {
  metadataBase: new URL('https://www.toyotawaits.ca'),
  title: 'Toyota RAV4 Trail & Car Camping Gear (2019–2026) | ToyotaWaits',
  description:
    'Transform your 5th-Gen Toyota RAV4 or RAV4 Prime into an off-grid overland camper. Dual-chamber split air mattress, seatback liners, hatch LEDs, and roof crossbars.',
  keywords: [
    'toyota rav4 car camping',
    'rav4 trail camping gear',
    'rav4 prime my room mode camping',
    'rav4 sleep setup',
    'rav4 camping mattress',
    'rav4 roof crossbars rooftop tent',
    'rav4 hatch camping led light',
    'rav4 overland build 2019 2026',
  ],
  alternates: {
    canonical: 'https://www.toyotawaits.ca/camping/rav4',
  },
  openGraph: {
    title: 'Toyota RAV4 Trail & Car Camping Gear (2019–2026) | ToyotaWaits',
    description:
      'Transform your 5th-Gen Toyota RAV4 or RAV4 Prime into an off-grid overland camper. Dual-chamber split air mattress, seatback liners, hatch LEDs, and roof crossbars.',
    url: 'https://www.toyotawaits.ca/camping/rav4',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toyota RAV4 Trail & Car Camping Gear (2019–2026) | ToyotaWaits',
    description:
      'Transform your 5th-Gen Toyota RAV4 or RAV4 Prime into an off-grid overland camper. Dual-chamber split air mattress, seatback liners, hatch LEDs, and roof crossbars.',
  },
};

export { type Rav4CampingGear, AFFILIATE_TAG, CampingChecklistModal };

export const RAV4_CHECKLIST_ITEMS: ChecklistItem[] = [
  { category: 'In-Vehicle Sleeping', item: 'Dual-chamber fold-flat split air mattress' },
  { category: 'In-Vehicle Sleeping', item: 'Rear footwell leveling duffel bags / foam wedges' },
  { category: 'In-Vehicle Sleeping', item: 'Reflective custom windshield & side window shades' },
  { category: 'Cargo Defense', item: 'Waterproof split seatback cargo liners (TPE)' },
  { category: 'Cockpit Mounts', item: 'Behind-screen dash organizer tray & phone mount' },
  { category: 'Outdoor & Roof', item: 'Lockable aerodynamic roof crossbars' },
  { category: 'Outdoor & Roof', item: 'Hatch ceiling touch-dimmable downward LED kit' },
  { category: 'Outdoor & Roof', item: 'Tailgate hatch mosquito tent & rain canopy' },
  { category: 'Power & Hybrid Readiness', item: '12V high-capacity portable power station / solar pack' },
  { category: 'Power & Hybrid Readiness', item: '120V / 1500W AC outlet lead (for RAV4 Prime)' },
  { category: 'Vehicle Readiness', item: 'Hybrid battery air intake screen clean check' },
  { category: 'Safety & Trail', item: 'Bear spray, high-lumen headlamp & trail first aid kit' },
];

export const RAV4_CAMPING_GEAR: Rav4CampingGear[] = [
  {
    id: 'rav4-split-air-mattress',
    name: 'Dual-Chamber Fold-Flat Split Air Mattress',
    badge: 'Must-Have',
    category: 'In-Vehicle Sleeping',
    fitment: 'Direct Fit: RAV4 2019–2026 (LE, XLE, XSE, Limited, Adventure, TRD, Prime)',
    features: [
      'Tailored contour around rear wheel arches maximizes every inch of the 5th-Gen RAV4 cargo floor',
      'Independent 60/40 dual air chambers allow solo sleeping while retaining one folded seat for gear',
      'Flocked puncture-resistant Oxford surface includes high-flow 12V DC pump for 2-minute setup',
    ],
    priceCad: '$85 – $130 CAD',
    query: 'Toyota RAV4 car camping mattress sleeping pad',
  },
  {
    id: 'rav4-seatback-cargo-liners',
    name: 'Waterproof Split Seatback Cargo Liners',
    badge: 'Custom Fit',
    category: 'Cargo Defense',
    fitment: 'Direct Fit: RAV4 2019–2026 (LE, XLE, XSE, Limited, Adventure, TRD, Prime)',
    features: [
      'Accordion hinge coverage protects second-row seat fabric when seats are folded flat for camping',
      'High-density TPE all-weather material repels muddy hiking boots, snow gear, and dog paws',
      'Strong Velcro backing stays firmly anchored during mattress shifts without damaging OEM carpeting',
    ],
    priceCad: '$55 – $85 CAD',
    query: 'Toyota RAV4 rear seatback protector cargo liner',
  },
  {
    id: 'rav4-roof-crossbars',
    name: 'Lockable Aerodynamic Roof Crossbars',
    badge: 'Overland Ready',
    category: 'Outdoor & Roof',
    fitment: 'Direct Fit: RAV4 2019–2026 (Flush Rails & Raised Adventure Rails)',
    features: [
      '160+ lb (75 kg) dynamic rating and 600+ lb static load capacity ideal for roof tents and cargo boxes',
      'Low-profile aerodynamic airfoil shape minimizes highway wind whistle and fuel economy drag',
      'Integrated keyed metal lock cores prevent theft at trailheads and remote wilderness campsites',
    ],
    priceCad: '$130 – $195 CAD',
    query: 'Toyota RAV4 roof rack cross bars 2019-2026 lockable',
  },
  {
    id: 'rav4-hatch-led-kit',
    name: 'Hatch Ceiling Touch-Dimmable Downward LED Kit',
    badge: 'Top Upgrade',
    category: 'Outdoor & Roof',
    fitment: 'Direct Fit: RAV4 2019–2026 (LE, XLE, XSE, Limited, Adventure, TRD, Prime)',
    features: [
      'Replaces blank factory plastic pop-out access panels in the rear liftgate interior for OEM look',
      'Dual touch-capacitive dimmable diffuse white LEDs cast wide downward illumination over your camp kitchen',
      'Plug-and-play wiring harness taps directly into OEM cargo light without cutting or splicing wires',
    ],
    priceCad: '$45 – $70 CAD',
    query: 'Toyota RAV4 rear hatch liftgate led camping lights',
  },
  {
    id: 'rav4-tailgate-mosquito-tent',
    name: 'Tailgate Hatch Mosquito Tent & Rain Canopy',
    badge: 'Stealth Camp',
    category: 'Outdoor & Roof',
    fitment: 'Direct Fit: RAV4 2019–2026 (All Trims)',
    features: [
      'Custom-contoured elastic perimeter encloses the entire open liftgate opening in 3 minutes',
      'Dual-layer zippered design provides both ultra-fine no-see-um mesh and waterproof storm rainfly',
      'Extends interior usable cabin length for 6ft+ campers to stretch out with open breeze',
    ],
    priceCad: '$105 – $165 CAD',
    query: 'Toyota RAV4 tailgate tent liftgate awning bug screen',
  },
  {
    id: 'rav4-behind-screen-organizer',
    name: 'Behind-Screen Dash Organizer Tray',
    badge: 'Custom Fit',
    category: 'Cockpit Mounts',
    fitment: 'Direct Fit: RAV4 2019–2026 (7-inch, 8-inch, and 10.5-inch Multimedia Screens)',
    features: [
      'Hidden stash shelf sits neatly behind the floating central touchscreen for sunglasses, park passes, and GPS',
      'Magnetic base plate includes phone mount anchor and anti-slip silicone tray liners',
      'Installs in seconds with automotive-grade acrylic adhesive without rattling on washboard trails',
    ],
    priceCad: '$22 – $38 CAD',
    query: 'Toyota RAV4 behind screen center console dash organizer',
  },
];

export default function Rav4CampingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pt-4 sm:pt-6 pb-20">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
        <BackButton className="mb-2" />

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/90 p-6 sm:p-10 shadow-2xl">
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
              <Compass className="h-3.5 w-3.5" />
              <span>Overland & Trail Camp Build</span>
              <span className="text-slate-600">•</span>
              <span>5th-Gen RAV4 (2019–2026+)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Toyota RAV4 Trail & Car Camping Gear
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Turn your 5th-Gen Toyota RAV4 (Gas, Hybrid, or Prime PHEV) into a versatile overland
              micro-camper with fold-flat sleeping, modular storage, and roof-mounted living space.
            </p>

            <div className="pt-2">
              <CampingChecklistTrigger
                vehicleName="Toyota RAV4"
                defaultItems={RAV4_CHECKLIST_ITEMS}
                buttonLabel="Open RAV4 Packing Checklist"
              />
            </div>
          </div>

          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Fold-Flat Cargo Floor & Hybrid/PHEV Battery Tips Callout Box */}
        <Card className="border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-slate-900/80 to-slate-900/50 shadow-xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-500/20 p-2 text-amber-400 border border-amber-500/30">
                <BatteryCharging className="h-5 w-5" />
              </div>
              <div>
                <CardTitle as="h2" className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <span>RAV4 Camping Architecture: Fold-Flat Leveling & Hybrid Climate Mode</span>
                </CardTitle>
                <p className="text-xs text-amber-400/90 font-medium mt-0.5">
                  Overcoming the 2° Seat Incline & Unlocking All-Night Climate Control
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 text-xs sm:text-sm text-slate-300 space-y-3 leading-relaxed">
            <p>
              The 5th-Gen RAV4 offers over 73 inches of front-to-rear sleeping length with the second-row seats
              folded. Learn how to optimize floor leveling and leverage hybrid electrical systems for maximum comfort.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-white">
                  <Layers className="h-4 w-4 text-amber-400" />
                  <span>Fold-Flat Incline Fix</span>
                </div>
                <p className="text-slate-400">
                  Folded 2nd-row seatbacks sit at a ~2° forward rise. Slide the front seats forward and bridge the rear footwells with duffel bags or foam wedges to create a 100% horizontal sleep deck.
                </p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-white">
                  <Zap className="h-4 w-4 text-emerald-400" />
                  <span>Prime &apos;My Room Mode&apos;</span>
                </div>
                <p className="text-slate-400">
                  RAV4 Prime plug-in hybrid features factory &apos;My Room Mode&apos;. While plugged into campground Level 1/2 power, enjoy unlimited A/C, heat, and audio with zero gas consumption.
                </p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-white">
                  <ShieldCheck className="h-4 w-4 text-cyan-400" />
                  <span>Battery Intake Caution</span>
                </div>
                <p className="text-slate-400">
                  On Hybrid & Prime models, never block the hybrid traction battery cooling fan screen located beneath the rear passenger-side seat edge with pillows or sleeping gear.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Curated Camping Gear Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Curated RAV4 Trail & Overland Gear
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select a category tab to filter accessories engineered specifically for 5th-Gen Toyota RAV4 cargo floor dimensions and roof track profiles.
            </p>
          </div>

          <Rav4CampingGrid items={RAV4_CAMPING_GEAR} />
        </div>

        {/* Affiliate Disclosure Banner */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 text-center text-xs text-slate-400 space-y-1">
          <p className="font-medium text-slate-300">
            As an Amazon Associate, ToyotaWaits earns from qualifying purchases.
          </p>
          <p className="text-[11px] text-slate-500 max-w-2xl mx-auto">
            All outbound links direct to Amazon.ca search queries matching verified fitment specifications for 2019–2026+ Toyota RAV4 models. Pricing and availability subject to vendor inventory.
          </p>
        </div>
      </div>
    </main>
  );
}
