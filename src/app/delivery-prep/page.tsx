import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { GuideDisclaimer } from '@/components/common/GuideDisclaimer';
import { PickupChecklist } from '@/components/delivery-prep/pickup-checklist';
import { PrintButton } from '@/components/delivery-prep/print-button';
import { FactoryStatusTracker } from '@/components/delivery-prep/factory-status-tracker';
import { DealerTrackingTips } from '@/components/delivery-prep/dealer-tracking-tips';
import { ShieldCheck, Car, KeyRound, Wrench, Luggage, HelpCircle, Loader2, ShieldAlert, Clock, DollarSign, AlertTriangle, ArrowRight } from 'lucide-react';
import { GearCard } from '@/components/gear/GearCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export const metadata: Metadata = {
  metadataBase: new URL('https://www.toyotawaits.ca'),
  title: 'Toyota Canada Delivery Tracking & Status Codes (2026 Guide) | ToyotaWaits',
  description:
    'Track your Canadian Toyota order from factory allocation to dealership delivery. Demystify Status A, Freight Status F, rail tracking, and dealer PDI checks.',
  keywords: [
    'toyota canada delivery tracking',
    'toyota order status codes canada',
    'toyota status a freight status f',
    'toyota status g ground delivery',
    'dealer daily logistics tracking cn rail',
    'canadian toyota delivery checklist',
    'toyota pickup day inspection pdi',
    'toyota bill of sale omvic amvic',
  ],
  alternates: {
    canonical: 'https://www.toyotawaits.ca/delivery-prep',
  },
  openGraph: {
    title: 'Toyota Canada Delivery Tracking & Status Codes (2026 Guide) | ToyotaWaits',
    description:
      'Track your Canadian Toyota order from factory allocation to dealership delivery. Demystify Status A, Freight Status F, rail tracking, and dealer PDI checks.',
    url: 'https://www.toyotawaits.ca/delivery-prep',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toyota Canada Delivery Tracking & Status Codes (2026 Guide) | ToyotaWaits',
    description:
      'Track your Canadian Toyota order from factory allocation to dealership delivery. Demystify Status A, Freight Status F, rail tracking, and dealer PDI checks.',
  },
};

const DELIVERY_FAQ_ITEMS = [
  {
    question: 'What does Toyota Status F mean?',
    answer:
      'Toyota Status F stands for Freight / In-Transit. It means your vehicle has officially completed factory assembly, passed final quality assurance inspection, and is loaded onto a freight railcar (CN or CPKC) or ocean carrier bound for regional distribution hubs or the Port of Vancouver (Annacis Island auto terminal). At this stage, a permanent 17-digit VIN is assigned.',
  },
  {
    question: 'How long does a Toyota take to arrive once in transit?',
    answer:
      'Once reaching Status F (Freight), rail and road transit typically takes 5 to 14 days for vehicles manufactured in Ontario (Cambridge/Woodstock) delivering within Ontario or Quebec. For shipments traveling to Western Canada (British Columbia and Alberta) or coming from US plants (Princeton, Indiana for Sienna/Grand Highlander), rail transit typically requires 12 to 21 days.',
  },
  {
    question: 'Can my dealer track the train carrying my Toyota?',
    answer:
      'Yes. Dealership Sales Managers and inventory controllers have access to Toyota’s internal Dealer Daily logistics portal. The system provides real-time tracking with the exact CN or CPKC railcar number, current railway interchange checkpoint, and projected ETA arrival window for dealership compound delivery (Status G).',
  },
  {
    question: 'When do I get a VIN for my Toyota order in Canada?',
    answer:
      'Your dealership will provide a temporary spec/allocation code while your order is in Status A. A permanent 17-character vehicle identification number (VIN) is usually generated approximately 7 to 14 days before scheduled physical assembly at the plant. Once Status F is reached, your dealer can print the full factory VIN build sheet.',
  },
  {
    question: 'What should I inspect during Toyota delivery day PDI?',
    answer:
      'Before handing over final certified funds or signing delivery acceptance: (1) Ensure front suspension shipping spacer blocks were removed by the PDI technician; (2) Check for paint chips, rock dings, and panel gaps under bright daylight; (3) Verify the number of smart keys provided (obtain an official Toyota 2nd key IOU voucher if affected by chip shortages); and (4) Audit your final bill of sale to verify no unrequested dealer add-ons (nitrogen, security etching, paint protection packs) were added.',
  },
];

const deliveryFaqPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: DELIVERY_FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

function ChecklistLoadingFallback() {
  return (
    <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-950/50 flex flex-col items-center justify-center space-y-3">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      <p className="text-sm text-zinc-400">Loading delivery day inspection checkpoints...</p>
    </div>
  );
}

export default function DeliveryPrepPage() {
  return (
    <main className="min-h-screen pt-4 sm:pt-6 pb-16">
      {/* FAQPage JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(deliveryFaqPageSchema) }}
      />

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 space-y-8">
        <BackButton className="mb-2" />

        {/* Page Hero */}
        <div className="border border-zinc-800 rounded-2xl bg-gradient-to-br from-zinc-900/90 to-zinc-950/80 p-5 sm:p-7 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Pickup Day Inspection</span>
                <span className="text-zinc-600">•</span>
                <span>Pre-Delivery Audit &amp; Status Tracking</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Toyota Canada Delivery Tracking &amp; Pickup Day Checklist
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                Track your Toyota order through factory allocation, rail logistics (Status A, F, G), and conduct
                a rigorous pre-delivery inspection before signing your final handover agreement.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 print:hidden">
              <PrintButton />
            </div>
          </div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-zinc-800/80 text-xs">
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800/60">
              <Car className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-zinc-200">Inspect In Bright Daylight</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Always inspect paint, rocker panels, and glass outdoors—never under dim delivery-bay lights.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800/60">
              <Wrench className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-zinc-200">Audit PDI Transport Spacers</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Check front and rear coil struts to ensure plastic shipping blocks were removed by dealer tech.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800/60">
              <KeyRound className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-zinc-200">Secure Key Allocation IOU</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  If delivering with 1 smart key due to microchip shortages, demand an official Toyota 2nd key IOU voucher in writing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 1. Toyota Canada Order Status Codes (Status A, F, G) */}
        <FactoryStatusTracker />

        {/* 2. Dealer Tracking FAQ & Pro-Tips + Cross-Link Hub */}
        <DealerTrackingTips />

        {/* 3. Interactive Checklist Component wrapped in Suspense */}
        <section className="space-y-4 pt-2">
          <Suspense fallback={<ChecklistLoadingFallback />}>
            <PickupChecklist defaultOpen={true} />
          </Suspense>
        </section>

        {/* 4. Cargo & Trunk Organization Section */}
        <section className="space-y-4 pt-2" id="cargo-trunk-organization">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-amber-400">
              <Luggage className="h-3.5 w-3.5" />
              <span>Day-One Utility</span>
              <span className="text-zinc-600">•</span>
              <span>2% Off with Code: Toyotawaits</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Luggage className="h-5 w-5 text-amber-500 shrink-0" />
              <span>Cargo &amp; Trunk Organization</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl">
              High-utility day-one essentials to secure groceries, sports gear, and tools upright against factory tie-down D-rings from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <GearCard
              item={{
                id: 'muslogy-rav4-cargo-net',
                slug: 'muslogy-rav4-cargo-net',
                title: 'Muslogy Heavy-Duty Trunk Cargo Net (RAV4)',
                category: 'cargo',
                brand: 'Muslogy',
                destinationType: 'direct_partner',
                discountCode: 'Toyotawaits',
                discountText: '2% off',
                badge: 'Partner Deal · 2% Off',
                priceEstCad: '$24 – $30 CAD',
                description: 'Heavy-duty elastic envelope mesh securing grocery bags and gear upright against factory tie-down D-rings.',
                whyBuy: 'Official Muslogy direct-fit trunk cargo net with exclusive 2% discount with code Toyotawaits.',
                buttonLabel: 'Get 2% Off on Muslogy ↗',
                destinationUrl: '/out/muslogy-rav4-cargo-net',
                imageUrl: '/assets/gear/muslogy-rav4-cargo-net.webp',
                models: ['rav4', 'rav4-hybrid', 'rav4-prime'],
                activeModel: 'rav4',
              }}
              placement="delivery_prep_cargo"
              showCheckbox={false}
              className="w-full max-w-none"
            />
            <GearCard
              item={{
                id: 'muslogy-sienna-cargo-net',
                slug: 'muslogy-sienna-cargo-net',
                title: 'Muslogy Heavy-Duty Trunk Cargo Net (Sienna)',
                category: 'cargo',
                brand: 'Muslogy',
                destinationType: 'direct_partner',
                discountCode: 'Toyotawaits',
                discountText: '2% off',
                badge: 'Partner Deal · 2% Off',
                priceEstCad: '$26 – $34 CAD',
                description: 'Custom-fit elastic envelope trunk cargo net securing groceries and luggage in the deep Sienna rear cargo well.',
                whyBuy: 'Official Muslogy direct-fit cargo organizer with exclusive 2% discount with code Toyotawaits.',
                buttonLabel: 'Get 2% Off on Muslogy ↗',
                destinationUrl: '/out/muslogy-sienna-cargo-net',
                imageUrl: '/assets/gear/muslogy-sienna-cargo-net.webp',
                models: ['sienna', 'sienna-hybrid'],
                activeModel: 'sienna',
              }}
              placement="delivery_prep_cargo"
              showCheckbox={false}
              className="w-full max-w-none"
            />
            <GearCard
              item={{
                id: 'muslogy-grand-highlander-cargo-net',
                slug: 'muslogy-grand-highlander-cargo-net',
                title: 'Muslogy Heavy-Duty Trunk Cargo Net (Grand Highlander)',
                category: 'cargo',
                brand: 'Muslogy',
                destinationType: 'direct_partner',
                discountCode: 'Toyotawaits',
                discountText: '2% off',
                badge: 'Partner Deal · 2% Off',
                priceEstCad: '$26 – $34 CAD',
                description: 'Custom-fit envelope trunk cargo net securing groceries and camping equipment upright behind the 3rd row.',
                whyBuy: 'Official Muslogy direct-fit trunk cargo net with exclusive 2% discount with code Toyotawaits.',
                buttonLabel: 'Get 2% Off on Muslogy ↗',
                destinationUrl: '/out/muslogy-grand-highlander-cargo-net',
                imageUrl: '/assets/gear/muslogy-grand-highlander-cargo-net.webp',
                models: ['grand-highlander'],
                activeModel: 'grand-highlander',
              }}
              placement="delivery_prep_cargo"
              showCheckbox={false}
              className="w-full max-w-none"
            />
          </div>
        </section>

        {/* Surviving the Business Office: Extended Warranty (ECP) Defense */}
        <section
          data-testid="ecp-warranty-defense-section"
          className="space-y-4 pt-2"
          id="ecp-warranty-defense"
          aria-labelledby="ecp-defense-heading"
        >
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-amber-400">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Finance Office Defense</span>
              <span className="text-zinc-600">•</span>
              <span>Toyota Extra Care Protection (ECP)</span>
            </div>
            <h2 id="ecp-defense-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-amber-500 shrink-0" />
              <span>Surviving the Business Office: Extended Warranty (ECP) Defense</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-3xl">
              Before taking the keys, you will be escorted into the dealership business office for the final paperwork sign-off. Protect yourself against $2,800–$3,200 CAD retail ECP warranty markups with these three non-negotiable rules.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/90 to-zinc-950/80 p-5 sm:p-6 shadow-xl space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>The 31-Day Window</span>
                </div>
                <h3 className="text-sm font-bold text-zinc-100">Never Sign on Delivery Day Under Pressure</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Finance managers claim you forfeit the 3-year complimentary maintenance package unless you sign immediately. False: Toyota Canada honors the maintenance perks within <strong>31 days of registration</strong>. Take the contract home to review.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <DollarSign className="h-4 w-4 shrink-0" />
                  <span>Target Wholesale Cost</span>
                </div>
                <h3 className="text-sm font-bold text-zinc-100">The $1,900–$2,100 CAD Target (Never Pay Sticker)</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Dealerships mark up ECP by <strong>$800–$1,400 CAD</strong> above dealer wholesale cost. If you want 7yr/160k km Platinum coverage, counter-offer at wholesale ($1,900–$2,100 CAD) or choose to self-insure.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>The Named-Component Trap</span>
                </div>
                <h3 className="text-sm font-bold text-zinc-100">Avoid ECP Gold (Insist on Platinum Only)</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Gold is a restrictive named-component contract that denies claims for touchscreen digitizers, radar sensors, and wiring harness corrosion. Modern failure points are sensors/wiring modules excluded by named-component policies.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs text-zinc-400">
                Unpack real Canadian repair costs, the 7% loan interest trap, and hybrid warranty overlap.
              </p>
              <Link
                href="/guides/toyota-ecp-warranty-guide"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md transition-colors duration-150 shrink-0 self-start sm:self-center"
              >
                <span>Read the Complete Toyota ECP Breakdown &amp; Net Cost Math →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 5. Frequently Asked Questions Section */}
        <section
          aria-label="Frequently Asked Questions: Toyota Canada Delivery Tracking"
          className="py-4"
        >
          <Card className="border-zinc-800 bg-zinc-900/60 shadow-xl overflow-hidden">
            <CardHeader className="p-5 sm:p-6 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <HelpCircle className="w-4 h-4" />
                <span>Tracking &amp; Logistics FAQs • 2026 Guide</span>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                Toyota Canada Order Tracking &amp; PDI FAQs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 sm:p-6 space-y-4">
              {DELIVERY_FAQ_ITEMS.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2"
                >
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-start gap-2">
                    <span className="text-emerald-400 font-mono text-sm shrink-0">Q:</span>
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pl-5">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Additional Guides Link */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400 print:hidden">
          <div>
            <p className="font-semibold text-zinc-200">Preparing for cold-weather delivery or drop-in upgrades?</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Explore our model-by-model winter survival guides and drop-in accessories.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/winter-prep"
              className="px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-semibold transition-colors"
            >
              Winter Prep Guide ❄️
            </Link>
            <Link
              href="/#gear"
              className="px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-semibold transition-colors"
            >
              Essential Gear 🛡️
            </Link>
          </div>
        </div>

        {/* Legal & Safety Disclaimer */}
        <GuideDisclaimer />
      </div>
    </main>
  );
}
