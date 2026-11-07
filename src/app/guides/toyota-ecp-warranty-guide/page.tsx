import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { GuideDisclaimer } from '@/components/common/GuideDisclaimer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  Calculator,
  DollarSign,
  FileText,
  Clock,
  Car,
  TrendingDown,
  Percent,
  Search,
  Lock,
  Gauge,
  Layers,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { buildAmazonAffiliateUrl } from '@/lib/gear/affiliate';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Toyota ECP Extended Warranty: Is It Worth It in Canada? | ToyotaWaits',
  description:
    'Objective breakdown of Toyota Extra Care Protection (ECP Platinum vs. Gold). Discover real repair costs, hybrid warranty overlap, dealer margins, and negotiation rules.',
  alternates: {
    canonical: 'https://toyotawaits.ca/guides/toyota-ecp-warranty-guide',
  },
  openGraph: {
    title: 'Toyota ECP Extended Warranty: Is It Worth It in Canada? | ToyotaWaits',
    description:
      'Objective breakdown of Toyota Extra Care Protection (ECP Platinum vs. Gold). Discover real repair costs, hybrid warranty overlap, dealer margins, and negotiation rules.',
    url: 'https://toyotawaits.ca/guides/toyota-ecp-warranty-guide',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toyota ECP Extended Warranty: Is It Worth It in Canada? | ToyotaWaits',
    description:
      'Objective breakdown of Toyota Extra Care Protection (ECP Platinum vs. Gold). Discover real repair costs, hybrid warranty overlap, dealer margins, and negotiation rules.',
  },
};

interface WarrantyComparisonRow {
  feature: string;
  factory: string;
  ecpGold: string;
  ecpPlatinum: string;
  highlight?: boolean;
}

const warrantyMatrix: WarrantyComparisonRow[] = [
  {
    feature: 'Contract Structure',
    factory: 'Factory Standard',
    ecpGold: 'Named Component (Strict List)',
    ecpPlatinum: 'Exclusionary (All-Covered Except List)',
    highlight: true,
  },
  {
    feature: 'Comprehensive Coverage',
    factory: '3 Years / 60,000 km',
    ecpGold: 'Up to 7–8 Years / 160,000–200,000 km',
    ecpPlatinum: 'Up to 7–8 Years / 160,000–200,000 km',
    highlight: true,
  },
  {
    feature: 'Powertrain (Engine & Transaxle)',
    factory: '5 Years / 100,000 km',
    ecpGold: 'Extended to ECP plan term',
    ecpPlatinum: 'Extended to ECP plan term',
  },
  {
    feature: 'Hybrid Components (Inverter/ECU)',
    factory: '8 Years / 160,000 km (Built-In)',
    ecpGold: 'Overlaps Factory Coverage',
    ecpPlatinum: 'Overlaps Factory Coverage',
  },
  {
    feature: 'Hybrid Battery (High Voltage)',
    factory: '10 Years / 240,000 km (Built-In)',
    ecpGold: 'Overlaps Factory Coverage',
    ecpPlatinum: 'Overlaps Factory Coverage',
  },
  {
    feature: 'TSS 3.0 Radar & Camera Arrays',
    factory: '3 Years / 60,000 km',
    ecpGold: 'Restricted / Limited Sensors',
    ecpPlatinum: '100% Comprehensive Coverage',
    highlight: true,
  },
  {
    feature: '12.3" Multimedia Touchscreen & Head Unit',
    factory: '3 Years / 60,000 km',
    ecpGold: 'Excluded or Core Only',
    ecpPlatinum: 'Full Display & Module Coverage',
    highlight: true,
  },
  {
    feature: 'Deductible per Repair Claim',
    factory: '$0 Deductible',
    ecpGold: '$0 Deductible',
    ecpPlatinum: '$0 Deductible',
  },
  {
    feature: 'Tire Road Hazard Protection',
    factory: 'None (Manufacturer Only)',
    ecpGold: '36 Months / 50,000 km Included',
    ecpPlatinum: '36 Months / 50,000 km Included',
  },
  {
    feature: 'Complimentary Scheduled Maintenance',
    factory: 'None in Canada',
    ecpGold: '3 Years / 48,000 km (if bought in 31 days)',
    ecpPlatinum: '3 Years / 48,000 km (if bought in 31 days)',
    highlight: true,
  },
  {
    feature: 'Trip Interruption & Travel Planning',
    factory: '3 Years Roadside Only',
    ecpGold: 'Included (up to $100/day for 3 days)',
    ecpPlatinum: 'Included (up to $100/day for 3 days)',
  },
  {
    feature: 'Private Party Transferability',
    factory: '100% Transferable ($0 Fee)',
    ecpGold: 'Transferable ($50 Admin Fee)',
    ecpPlatinum: 'Transferable ($50 Admin Fee)',
  },
];

const replacementCosts = [
  {
    component: '12.3" Multimedia Infotainment Display & Navigation',
    failureReason: 'Digitizer ghost-touch, screen delamination, black screen boot loop',
    oemCost: '$2,800 – $4,200 CAD',
    ecpStatus: 'Covered under Platinum only (Gold frequently excludes screen digitizers)',
  },
  {
    component: 'TSS 3.0 Millimeter-Wave Radar & Front Windshield Camera',
    failureReason: 'Calibration loss from harsh road vibration, ice heave alignment, module fault',
    oemCost: '$1,600 – $2,400 CAD',
    ecpStatus: 'Covered under Platinum; Gold named lists usually cover only the basic cruise module',
  },
  {
    component: 'High-Voltage Electric A/C Heat Pump Compressor',
    failureReason: 'Internal bearing seizure, electric motor winding failure, seal leakage',
    oemCost: '$1,800 – $2,600 CAD',
    ecpStatus: 'Covered on both Gold & Platinum as a primary mechanical component',
  },
  {
    component: 'Electronic Power Steering Rack & Pinion Motor Assembly',
    failureReason: 'Internal torque sensor fault, sub-zero boot split leading to salt intrusion',
    oemCost: '$2,200 – $3,100 CAD',
    ecpStatus: 'Covered on both Gold & Platinum',
  },
  {
    component: 'Adaptive Variable Suspension (AVS) Electronic Actuators',
    failureReason: 'Solenoid failure after repeated exposure to slush and road brine',
    oemCost: '$1,400 – $2,100 CAD',
    ecpStatus: 'Covered under Platinum only (Struts & shock assemblies are excluded wear items on Gold)',
  },
  {
    component: 'Hybrid Inverter / Converter & DC-DC Converter',
    failureReason: 'IGBT transistor overheating, cooling passage blockage',
    oemCost: '$4,500 – $6,500 CAD',
    ecpStatus: 'ALREADY COVERED by factory Hybrid Warranty for 8 Years / 160,000 km at $0 cost',
  },
];

const dayOneGear = [
  {
    id: 'spigen-screen-protector',
    slug: 'spigen-toyota-screen-protector',
    proxyUrl: '/out/spigen-screen-protector',
    fallbackAmazonUrl: buildAmazonAffiliateUrl('Toyota tempered glass screen protector matte 9H', 'CA'),
    title: 'Spigen 9H Tempered Glass Matte Screen Protector',
    category: 'Interior Screen Defense',
    brand: 'Spigen',
    badge: 'Day-1 Essential',
    priceEstimate: '$28 – $36 CAD',
    savingsEstimate: 'Saves $2,800+ CAD vs. dealership screen warranty',
    description:
      'Engineered with 9H hardness tempered glass and an oleophobic matte finish. Shields the delicate 10.5" or 12.3" touchscreen from keys, scratches, fingerprint oils, and sun glare.',
    purpose: 'Physical alternative to dealer interior/screen replacement warranties.',
    buttonLabel: 'Search Amazon ↗',
    icon: Layers,
  },
  {
    id: 'faraday-key-pouch',
    slug: 'faraday-key-fob-pouch',
    proxyUrl: '/out/faraday-key-pouch',
    fallbackAmazonUrl: buildAmazonAffiliateUrl('Faraday pouch for car keys signal blocker 2-pack', 'CA'),
    title: 'RFID Faraday Key Fob Signal Blocker (2-Pack)',
    category: 'Theft & Relay Defense',
    brand: 'Defender Guard',
    badge: 'Anti-Theft Guard',
    priceEstimate: '$16 – $22 CAD',
    savingsEstimate: 'Saves $600–$1,200 CAD vs. dealer etching & tracking',
    description:
      'Dual-layer military-grade shielding fabric that stops 100% of RFID, BLE, and sub-GHz wireless relay attacks. Prevents driveway relay theft of your Toyota Smart Key.',
    purpose: 'Inexpensive defense against relay theft vs. dealer tracking and VIN etching packages.',
    buttonLabel: 'Search Amazon ↗',
    icon: Lock,
  },
  {
    id: 'portable-tire-inflator',
    slug: 'fanttik-cordless-tire-inflator',
    proxyUrl: '/out/portable-tire-inflator',
    fallbackAmazonUrl: buildAmazonAffiliateUrl('portable cordless tire inflator 150 PSI auto shut off', 'CA'),
    title: 'Fanttik Cordless 150 PSI Tire Inflator & Digital Gauge',
    category: 'Road Hazard Defense',
    brand: 'Fanttik',
    badge: 'Roadside Essential',
    priceEstimate: '$79 – $95 CAD',
    savingsEstimate: 'Saves $1,200+ CAD vs. dealer tire & wheel insurance',
    description:
      'High-precision rechargeable cordless compressor with digital pressure sensor, automatic shutoff, and LED worklight. Perfect for seasonal top-ups and emergency roadside punctures.',
    purpose: 'Self-insuring road hazard punctures vs. dealer tire & wheel warranty markups.',
    buttonLabel: 'Search Amazon ↗',
    icon: Gauge,
  },
];

const faqs = [
  {
    q: 'Can I cancel an ECP policy for a refund if I sell or trade in my Toyota early?',
    a: 'Yes. If you cancel within the first 30 days of purchase and have made no claims, you receive a 100% full refund from Toyota Canada. After 30 days, Toyota calculates a prorated refund based on the remaining months or kilometers (whichever has elapsed more), minus an administrative processing fee. If you finance the warranty into your vehicle loan, any refund credit will be sent directly to your lienholder to reduce your principal balance.',
  },
  {
    q: 'Can I transfer my ECP extended warranty to a private buyer when selling?',
    a: 'Yes. Toyota Extra Care Protection is fully transferable to the subsequent private owner for a nominal $50 CAD administrative fee processed through any Canadian Toyota dealership. This provides a major selling point on Autotrader or Kijiji, proving verified maintenance history and transferable factory-backed coverage.',
  },
  {
    q: 'Does Toyota ECP cover the infamous "Cablegate" high-voltage corrosion issue?',
    a: 'For 2019–2022 RAV4 Hybrid and Prime models, Toyota Canada introduced Customer Support Program ZGG, which extended warranty coverage on the rear motor high-voltage cable connector to 8 years or 160,000 km. Newer 2023–2026 models feature the revised open-bottom connector shell. While ECP Platinum covers high-voltage auxiliary harnesses, primary hybrid electric components already receive 8-year / 160,000-km factory coverage.',
  },
  {
    q: 'Can I purchase an ECP policy from a different Toyota dealership than where I bought the car?',
    a: 'Absolutely. ECP pricing is not federally or provincially fixed, and individual dealerships set their own retail margins. You can purchase a genuine Toyota Canada ECP plan from any authorized Toyota dealership nationwide prior to your vehicle reaching 36 months or 60,000 km. You do not have to buy it from your delivering dealer.',
  },
  {
    q: 'Does installing aftermarket accessories void my Toyota ECP warranty?',
    a: 'No. Under Canadian consumer protection standards and Toyota warranty guidelines, a warranty claim can only be denied if the dealership and Toyota technical inspector prove that the specific aftermarket component or improper installation directly caused the mechanical failure. For example, installing a 9H screen protector or high-wall floor mats has zero bearing on engine or suspension claims.',
  },
];

export default function ToyotaEcpWarrantyGuidePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-amber-500/20 selection:text-amber-300 pb-20">
      {/* Top Banner / Breadcrumb */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <BackButton fallbackHref="/guides" label="← Back to Guides" />
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[11px] font-mono border-zinc-700 text-zinc-400">
              Finance Office Almanac
            </Badge>
            <Badge className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-[11px]">
              Canadian Market (CAD)
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-12 sm:space-y-16">
        {/* Title Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs">
              Extended Warranty Analysis
            </Badge>
            <span className="text-xs text-zinc-500 font-mono">Published November 2026 · 14 min read</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-50 leading-tight">
            Toyota ECP Extended Warranty: <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              Is It Worth It in Canada?
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-3xl">
            An objective, mathematical dissection of Toyota Extra Care Protection (ECP). We break down dealer wholesale margins, the Platinum vs. Gold trap, hybrid coverage overlap, and when you should self-insure.
          </p>
        </header>

        {/* 1. TOP SUMMARY VERDICT */}
        <section className="space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
              <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-zinc-100">
                  The Quick Verdict: Should You Buy Toyota ECP?
                </h2>
                <p className="text-xs text-zinc-400">
                  Decision matrix based on powertrain architecture, holding period, and financing terms.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              {/* Skip Card */}
              <div className="rounded-xl border border-rose-900/40 bg-rose-950/20 p-5 space-y-3.5">
                <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
                  <XCircle className="h-5 w-5" />
                  <span>SKIP ECP EXTENDED WARRANTY IF:</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-zinc-300 leading-relaxed list-disc list-inside">
                  <li>
                    <strong className="text-zinc-100">Short-Term Ownership:</strong> You plan to trade in or sell within 3 to 4 years (you are paying for coverage the next buyer will use).
                  </li>
                  <li>
                    <strong className="text-zinc-100">Mature Naturally Aspirated Hybrids:</strong> RAV4 Hybrid, Camry Hybrid, or Corolla Hybrid using Toyota’s bulletproof 2.5L/2.0L Dynamic Force engine and planetary e-CVT.
                  </li>
                  <li>
                    <strong className="text-zinc-100">Financing Over 60 Months:</strong> Rolling $2,800 CAD into a 7.5% auto loan adds $600–$800 in loan interest, completely destroying the insurance math.
                  </li>
                </ul>
              </div>

              {/* Consider Card */}
              <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-5 space-y-3.5">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>CONSIDER ECP (AT WHOLESALE ONLY) IF:</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-zinc-300 leading-relaxed list-disc list-inside">
                  <li>
                    <strong className="text-zinc-100">Long-Term Keepers (7–10+ Years):</strong> You intend to drive the vehicle to 160,000–200,000 km through harsh Canadian road salt and sub-zero freeze-thaw cycles.
                  </li>
                  <li>
                    <strong className="text-zinc-100">First-Generation Turbo / Complex Powertrains:</strong> Tacoma i-FORCE MAX, Land Cruiser 250, Grand Highlander Hybrid MAX, or Tundra 3.4L Twin-Turbo.
                  </li>
                  <li>
                    <strong className="text-zinc-100">Tech-Packed Top Trims:</strong> Vehicles with panoramic roof actuators, electronic air suspension (AVS), or dual-zone electric heat pumps.
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                <strong className="text-amber-100 font-semibold">The Golden Rule:</strong> Never pay sticker price ($2,800–$3,200 CAD) in the dealership finance office. Dealership cost is roughly 50–60% of retail. If you choose to purchase, counter-offer at <strong>$1,900 – $2,100 CAD</strong> or walk away.
              </p>
            </div>
          </div>
        </section>

        {/* 2. COMPARISON TABLE COMPONENT */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              <FileText className="h-5 w-5 text-amber-400" />
              Factory Warranty vs. ECP Gold vs. ECP Platinum
            </h2>
            <p className="text-sm text-zinc-400">
              Detailed coverage matrix comparing Toyota’s standard factory new-vehicle warranty against the two official Extra Care Protection tiers.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900">
                    <th className="p-3.5 sm:p-4 font-semibold text-zinc-300 min-w-[200px]">Coverage Feature</th>
                    <th className="p-3.5 sm:p-4 font-semibold text-zinc-300 min-w-[170px]">Factory New Vehicle</th>
                    <th className="p-3.5 sm:p-4 font-semibold text-zinc-300 min-w-[180px]">
                      ECP Gold
                      <span className="block text-[11px] font-normal text-rose-400">Named Component</span>
                    </th>
                    <th className="p-3.5 sm:p-4 font-semibold text-amber-400 min-w-[200px] bg-amber-500/10 border-l border-amber-500/30">
                      ECP Platinum
                      <span className="block text-[11px] font-normal text-amber-300">Exclusionary Policy</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {warrantyMatrix.map((row, idx) => (
                    <tr
                      key={idx}
                      className={row.highlight ? 'bg-zinc-800/30 hover:bg-zinc-800/50' : 'hover:bg-zinc-800/20'}
                    >
                      <td className="p-3.5 sm:p-4 font-medium text-zinc-200 flex items-center gap-2">
                        {row.highlight && <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />}
                        {row.feature}
                      </td>
                      <td className="p-3.5 sm:p-4 text-zinc-400">{row.factory}</td>
                      <td className="p-3.5 sm:p-4 text-zinc-400">{row.ecpGold}</td>
                      <td className="p-3.5 sm:p-4 text-zinc-100 font-medium bg-amber-500/5 border-l border-amber-500/20">
                        {row.ecpPlatinum}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3.5 bg-zinc-950/60 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between flex-wrap gap-2">
              <span>* Terms vary by plan selected (e.g. 7 yr / 120,000 km, 7 yr / 160,000 km, or 8 yr / 200,000 km).</span>
              <span className="text-amber-400 font-mono">Deductible: $0 on all genuine Toyota ECP plans</span>
            </div>
          </div>
        </section>

        {/* 3. PLATINUM VS GOLD DISTINCTION */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-400" />
              The ECP Platinum vs. Gold Trap: Why Gold Is a Waste of Money
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Dealership finance managers often push ECP Gold as a cheaper alternative to Platinum ($300–$500 less). In reality, Gold represents poor mathematical value due to contract architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-rose-900/50 bg-zinc-900/80">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-rose-400 text-lg">ECP Gold: Named Component</h3>
                  <Badge variant="outline" className="border-rose-800 text-rose-400 text-xs">High Risk</Badge>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  In a <strong>Named Component</strong> contract, the burden of proof is on you. If a part or wire is not specifically listed in the fine print of the contract brochure, <strong>coverage is denied</strong>.
                </p>
                <div className="space-y-2 text-xs text-zinc-400">
                  <p className="font-semibold text-zinc-200">Common Gold Denial Scenarios:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Touchscreen infotainment digitizer failure (only the basic radio tuner is listed).</li>
                    <li>TSS 3.0 radar wiring harness corrosion behind the front bumper.</li>
                    <li>Seat heater control modules, blind spot radar brackets, and power liftgate actuators.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-900/50 bg-zinc-900/80">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-emerald-400 text-lg">ECP Platinum: Exclusionary</h3>
                  <Badge variant="outline" className="border-emerald-800 text-emerald-400 text-xs">True Coverage</Badge>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  In an <strong>Exclusionary</strong> contract, <strong>every mechanical and electrical component is covered</strong> unless it is explicitly named in the brief list of exclusions (routine wear items like brake pads, wiper inserts, fluids, and body rust).
                </p>
                <div className="space-y-2 text-xs text-zinc-400">
                  <p className="font-semibold text-zinc-200">What Platinum Actually Covers:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Entire 12.3&quot; multimedia infotainment display and touch digitizer.</li>
                    <li>All radar, sonar, front camera, and blind spot sensor arrays.</li>
                    <li>Instrument cluster LCD screens, wiring harnesses, and control ECUs.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 4. THE FINANCIAL BREAKDOWN & NET COST MATH */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-amber-400" />
              The Financial Breakdown: The &ldquo;Net Cost&rdquo; Math
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              When a finance manager quotes you $2,800 CAD for an ECP Platinum policy, you are not actually paying $2,800 for mechanical breakdown insurance. Here is the true accounting breakdown:
            </p>
          </div>

          {/* Math breakdown cards */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60">
                <span className="text-xs text-zinc-400 uppercase tracking-wider block">Retail ECP Quote</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-zinc-100 mt-1 block">$2,800 CAD</span>
                <span className="text-[11px] text-zinc-500 mt-1 block">Typical 7yr / 160k km quote</span>
              </div>
              <div className="p-4 rounded-xl border border-emerald-900/40 bg-emerald-950/20">
                <span className="text-xs text-emerald-400 uppercase tracking-wider block">Built-In Perks Value</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1 block">-$850 CAD</span>
                <span className="text-[11px] text-emerald-300/80 mt-1 block">~$700 Maintenance + ~$150 Tire Hazard</span>
              </div>
              <div className="p-4 rounded-xl border border-amber-900/40 bg-amber-950/20">
                <span className="text-xs text-amber-400 uppercase tracking-wider block">Net Mechanical Risk</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1 block">~$1,950 CAD</span>
                <span className="text-[11px] text-amber-300/80 mt-1 block">True mechanical insurance cost</span>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
              <p>
                <strong>1. 3-Year Complimentary Maintenance (~$700 CAD Value):</strong> If purchased within the first 31 days of delivery, ECP includes your first 6 scheduled maintenance visits (Services 1, 2, and 3 up to 36 months or 48,000 km). This includes 3 synthetic oil changes, tire rotations, cabin/engine air filters, and multi-point inspections that you would have paid out-of-pocket anyway.
              </p>
              <p>
                <strong>2. 3-Year Tire Road Hazard Protection (~$150 CAD Value):</strong> ECP covers puncture repairs or prorated tire replacements for original equipment tires damaged by potholes, nails, or road debris during the first 36 months / 50,000 km.
              </p>
              <p>
                <strong>The Bottom Line:</strong> If you negotiate the retail price down to <strong>$2,000 CAD</strong>, your net mechanical warranty insurance cost is only <strong>~$1,150 CAD</strong> ($2,000 - $850). For an owner keeping the vehicle for 7 to 8 years, that represents exceptionally low risk.
              </p>
            </div>
          </div>

          {/* Real component costs table */}
          <div className="space-y-3 pt-4">
            <h3 className="text-lg font-bold text-zinc-100">Real Canadian Out-of-Warranty Repair Costs</h3>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900 text-zinc-300">
                      <th className="p-3.5 sm:p-4 font-semibold">Vehicle Component</th>
                      <th className="p-3.5 sm:p-4 font-semibold hidden md:table-cell">Common Canadian Failure Cause</th>
                      <th className="p-3.5 sm:p-4 font-semibold">Dealer Cost (Parts + Labor)</th>
                      <th className="p-3.5 sm:p-4 font-semibold">ECP Coverage Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                    {replacementCosts.map((item, idx) => (
                      <tr key={idx} className="hover:bg-zinc-800/20">
                        <td className="p-3.5 sm:p-4 font-medium text-zinc-100">{item.component}</td>
                        <td className="p-3.5 sm:p-4 text-zinc-400 hidden md:table-cell text-xs">{item.failureReason}</td>
                        <td className="p-3.5 sm:p-4 font-mono font-bold text-amber-400">{item.oemCost}</td>
                        <td className="p-3.5 sm:p-4 text-xs text-zinc-300">{item.ecpStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* 5. EMBEDDED DAY-1 PROTECTION GEAR CARDS */}
        <section className="space-y-6 pt-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs">
                Stage 1 Monetization
              </Badge>
              <span className="text-xs text-zinc-500 uppercase tracking-wider font-mono">Self-Insure &amp; Save</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
              Day-1 Replacement Protection Gear: Self-Insure Against Dealer Markups
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
              Dealerships routinely quote $600 to $1,500 CAD for interior leather/screen warranty packages, VIN etching anti-theft kits, and tire hazard warranties. You can self-insure with these community-vetted, high-quality alternatives on Day 1.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dayOneGear.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-5 sm:p-6 flex flex-col justify-between shadow-xl hover:border-zinc-700 transition-all duration-200"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[11px] font-mono border-zinc-700 text-zinc-300">
                        {item.category}
                      </Badge>
                      <Badge className="bg-emerald-950/90 text-emerald-400 border border-emerald-800/80 text-[10px]">
                        {item.badge}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0 text-amber-400">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-zinc-100 text-sm leading-snug">{item.title}</h3>
                        <span className="text-xs text-zinc-500">{item.brand}</span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed">{item.description}</p>

                    <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-400">Estimated Cost:</span>
                        <span className="font-mono font-bold text-zinc-200">{item.priceEstimate}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-emerald-400 font-medium">Value vs Dealer:</span>
                        <span className="text-[11px] font-mono text-emerald-400">{item.savingsEstimate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-zinc-800/80 space-y-2">
                    <a
                      href={item.proxyUrl}
                      target="_blank"
                      rel="sponsored noopener noreferrer nofollow"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md transition-colors duration-150"
                    >
                      <Search className="h-3.5 w-3.5" />
                      {item.buttonLabel}
                    </a>
                    <p className="text-[10px] text-center text-zinc-500">
                      Zero-markup direct search via Amazon CA/US proxy
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. THE SELF-INSURING ALTERNATIVE */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-amber-400" />
              The Self-Insuring Alternative: Beware the 7% Auto Loan Trap
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              How financing an extended warranty turns a $2,800 CAD expense into a $3,500 CAD liability, and how to build a superior emergency fund instead.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-rose-900/40 bg-zinc-900/60 p-6 space-y-4">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <Percent className="h-4 w-4" />
                <span>Scenario A: Rolling ECP Into Your Car Loan</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Most buyers don&apos;t pay $2,800 CAD cash upfront; the finance manager rolls it into a 72-month or 84-month auto loan at <strong>6.99% – 8.49% APR</strong>.
              </p>
              <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-2 font-mono text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Warranty Retail:</span>
                  <span className="text-zinc-200">$2,800 CAD</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Interest at 7.49% (72 mo):</span>
                  <span className="text-rose-400">+$689 CAD</span>
                </div>
                <div className="border-t border-zinc-800 pt-1 flex justify-between font-bold text-zinc-100 text-sm">
                  <span>Total Out-of-Pocket:</span>
                  <span className="text-rose-400">$3,489 CAD</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 italic">
                If your vehicle never experiences a major mechanical claim, all $3,489 CAD is forfeited to the warranty underwriter.
              </p>
            </div>

            <div className="rounded-xl border border-emerald-900/40 bg-zinc-900/60 p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <DollarSign className="h-4 w-4" />
                <span>Scenario B: Building a High-Interest Savings Buffer</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Take the equivalent $48/month you would have paid toward the warranty loan and deposit it into a Canadian <strong>High-Interest Savings Account (HISA / TFSA)</strong> yielding 3.5%–4.5%.
              </p>
              <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-2 font-mono text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Monthly Contribution:</span>
                  <span className="text-zinc-200">$48.50 / month</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Compounded Interest (5 Yrs):</span>
                  <span className="text-emerald-400">+$310 CAD</span>
                </div>
                <div className="border-t border-zinc-800 pt-1 flex justify-between font-bold text-zinc-100 text-sm">
                  <span>Liquid Cash Available:</span>
                  <span className="text-emerald-400">$3,220 CAD</span>
                </div>
              </div>
              <p className="text-xs text-zinc-300">
                <strong className="text-emerald-400">The Huge Difference:</strong> If your Toyota runs trouble-free (as most do), <strong>you keep the $3,220 CAD in cash</strong>. If a repair arises, you pay with your own liquid fund.
              </p>
            </div>
          </div>
        </section>

        {/* 7. DEALERSHIP NEGOTIATION PLAYBOOK */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-amber-400" />
              The Dealership Negotiation Playbook: Never Pay Sticker
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              If you decide an ECP Platinum policy fits your risk tolerance and ownership timeline, arm yourself with these three rules before stepping into the business office:
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6 space-y-2">
              <div className="flex items-center gap-3">
                <span className="h-7 w-7 rounded-full bg-amber-500/10 text-amber-400 font-bold text-sm flex items-center justify-center shrink-0 border border-amber-500/30">
                  1
                </span>
                <h3 className="font-bold text-zinc-100 text-base">
                  Rule 1: Target Wholesale Cost ($1,900 – $2,100 CAD)
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pl-10">
                Dealer markup on extended warranties is typically <strong>$800 to $1,400 CAD</strong> over wholesale cost. When the finance manager quotes $2,800, their actual cost to Toyota Canada is between $1,650 and $1,850. Politely counter: <em>&ldquo;I am interested in ECP Platinum 7yr/160k, but only at $1,950 CAD cash. Otherwise, I will happily self-insure.&rdquo;</em> Dealerships will frequently accept a $200–$300 profit rather than lose the sale entirely.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6 space-y-2">
              <div className="flex items-center gap-3">
                <span className="h-7 w-7 rounded-full bg-amber-500/10 text-amber-400 font-bold text-sm flex items-center justify-center shrink-0 border border-amber-500/30">
                  2
                </span>
                <h3 className="font-bold text-zinc-100 text-base">
                  Rule 2: Exercise the 31-Day Window (Never Buy Under Delivery Pressure)
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pl-10">
                Finance managers often claim: <em>&ldquo;You must buy ECP today on delivery day to receive the 3-year complimentary maintenance package!&rdquo;</em> This is misleading. Toyota Canada’s official ECP policy allows you to add the plan and retain 100% of the maintenance perk <strong>up to 31 days from the vehicle’s original registration date</strong>. Tell the manager you want to review the full contract at home for 2 weeks before deciding.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6 space-y-2">
              <div className="flex items-center gap-3">
                <span className="h-7 w-7 rounded-full bg-amber-500/10 text-amber-400 font-bold text-sm flex items-center justify-center shrink-0 border border-amber-500/30">
                  3
                </span>
                <h3 className="font-bold text-zinc-100 text-base">
                  Rule 3: Cross-Shop Dealerships Across Your Province
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pl-10">
                You do NOT have to purchase your ECP warranty from the dealership where you purchased the vehicle. You can purchase genuine Toyota Canada ECP from <strong>any authorized Toyota dealer across Canada</strong> before your vehicle reaches 36 months or 60,000 km. Call finance managers at regional or high-volume stores in other cities—many are willing to discount ECP to hit their monthly volume quotas.
              </p>
            </div>
          </div>
        </section>

        {/* 8. FAQ SECTION */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-amber-400" />
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="text-sm text-zinc-400">
              Answers to the most common questions Canadian buyers ask about Toyota Extra Care Protection.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-zinc-800/90 bg-zinc-900/50 p-5 sm:p-6 space-y-2"
              >
                <h3 className="font-bold text-zinc-100 text-sm sm:text-base flex items-start gap-2">
                  <span className="text-amber-400 font-mono">Q:</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Guides navigation */}
        <section className="pt-6 border-t border-zinc-800/80">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-zinc-100 text-base">Explore Related Delivery Day Playbooks</h3>
              <p className="text-xs text-zinc-400">Arm yourself with Canadian vehicle preparation knowledge.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/guides/best-toyota-all-weather-floor-mats"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 hover:text-zinc-100 transition-colors"
              >
                Floor Mat Comparison <ArrowRight className="h-3 w-3" />
              </Link>
              <Link
                href="/winter-prep"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 hover:text-zinc-100 transition-colors"
              >
                Winter Prep Guide <ArrowRight className="h-3 w-3" />
              </Link>
              <Link
                href="/tires"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 hover:text-zinc-100 transition-colors"
              >
                Downsizing &amp; Tires <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* Legal & Editorial Disclaimer */}
        <footer className="pt-4">
          <GuideDisclaimer />
        </footer>
      </div>
    </main>
  );
}
