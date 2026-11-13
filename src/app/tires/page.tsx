import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { TireCatalog } from '@/components/tires/tire-catalog';
import { DirectFitSizingMatrix } from '@/components/tires/direct-fit-sizing-matrix';
import { ProvincialMandateMatrix } from '@/components/tires/provincial-mandate-matrix';
import { TrimSizingTable } from '@/components/tires/trim-sizing-table';
import { TopRecommendedSolutions } from '@/components/tires/top-recommended-solutions';
import { ContextualWinterGear } from '@/components/tires/contextual-winter-gear';
import { BackButton } from '@/components/common/back-button';
import { GuideDisclaimer } from '@/components/common/GuideDisclaimer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  HelpCircle,
  Loader2,
  Snowflake,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Disc3,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export const metadata: Metadata = {
  metadataBase: new URL('https://www.toyotawaits.ca'),
  title: 'Toyota Winter & All-Weather Tires Canada (2026 Guide) — Sizing & Rules | ToyotaWaits',
  description:
    'Complete Canadian winter tire guide for Toyota RAV4, Sienna, Grand Highlander, and Corolla Cross. Provincial winter tire deadlines, insurance discounts, and factory wheel sizing.',
  keywords: [
    'toyota winter tire sizing canada',
    'toyota rav4 17 inch winter downsizing',
    'sienna 225 65r17 winter tires',
    'grand highlander 5x120 winter wheels',
    'corolla cross winter tire size',
    'bc winter tire legal requirements 2026',
    'quebec winter tire deadline dec 1',
    'toyota bolt pattern 5x114.3 60.1',
    '3pmsf severe snow certified toyota',
    'ontario winter tire insurance discount',
    'manitoba mpi winter tire financing',
  ],
  alternates: {
    canonical: 'https://www.toyotawaits.ca/tires',
  },
  openGraph: {
    title: 'Toyota Winter & All-Weather Tires Canada (2026 Guide) — Sizing & Rules | ToyotaWaits',
    description:
      'Complete Canadian winter tire guide for Toyota RAV4, Sienna, Grand Highlander, and Corolla Cross. Provincial winter tire deadlines, insurance discounts, and factory wheel sizing.',
    url: 'https://www.toyotawaits.ca/tires',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toyota Winter & All-Weather Tires Canada (2026 Guide) — Sizing & Rules | ToyotaWaits',
    description:
      'Complete Canadian winter tire guide for Toyota RAV4, Sienna, Grand Highlander, and Corolla Cross. Provincial winter tire deadlines, insurance discounts, and factory wheel sizing.',
  },
};

const FAQ_ITEMS = [
  {
    question: 'Can you downsize 18-inch or 19-inch wheels to 17-inch for winter tires on a Toyota RAV4?',
    answer:
      'Yes. Downsizing from factory 18-inch (225/60R18) or 19-inch (235/55R19) wheels to 17-inch wheels with 225/65R17 tires is fully supported and recommended for winter driving on all 5th-Gen and 6th-Gen Toyota RAV4 models, including the RAV4 Prime PHEV. 17-inch rims with a 5x114.3 bolt pattern, 60.1mm center bore, and +35 to +45 offset safely clear the front and rear brake calipers. A 17-inch setup provides a taller sidewall to absorb frost heaves and hidden potholes, cuts through deep snow and slush more effectively, and saves $200 to $350 CAD per set compared to 18-inch or 19-inch winter tires.',
  },
  {
    question: 'What are the legal winter tire requirements in BC and Quebec?',
    answer:
      'In Quebec, winter tires bearing the 3PMSF (Three-Peak Mountain Snowflake) symbol are legally mandatory on all passenger vehicles from December 1 through March 15. All-season tires with only an M+S rating do not comply. In British Columbia, winter tires marked with either 3PMSF or M+S with a minimum of 3.5mm remaining tread depth are legally required on designated mountain highways (including the Coquihalla Hwy 5, Sea-to-Sky Hwy 99, Malahat Hwy 1, and Trans-Canada Hwy 1) from October 1 through April 30 (or March 31 on select southern routes). Vehicles without compliant tires face police turnarounds and provincial fines.',
  },
  {
    question: 'Do insurance companies in Ontario give discounts for winter tires?',
    answer:
      'Yes. In Ontario, all auto insurance companies are legally mandated by the Financial Services Regulatory Authority of Ontario (FSRA) to offer an annual discount of 2% to 5% on your auto insurance premium if you install four certified winter tires (bearing the 3PMSF Three-Peak Mountain Snowflake symbol). Most insurers require winter tires to be installed between November or December and April, and may request purchase or installation receipts as proof of compliance.',
  },
  {
    question: 'Will 225/65R17 or 235/65R17 tires fit on a Toyota Sienna AWD?',
    answer:
      'Yes. Both 225/65R17 and 235/65R17 tires mounted on 17x7J or 17x7.5J wheels (5x114.3 bolt pattern, 60.1mm hub bore, +35 to +45 offset) are a proven direct-fit winter package for the 4th-Gen (2021–2026+) Toyota Sienna AWD and FWD. The 17-inch wheel diameter clears all front brake calipers and rear e-AWD electric motor hardware while delivering taller sidewall protection and a narrower contact patch that bites through Canadian winter slush.',
  },
  {
    question: 'What bolt pattern does the Toyota Grand Highlander use for winter wheels?',
    answer:
      'The Toyota Grand Highlander uses a heavy-duty 5x120 PCD bolt pattern with a 60.1mm center bore, differing from the traditional 5x114.3 pattern on RAV4, Sienna, and standard Highlander models. Winter wheels must be at least 18 inches (e.g., 255/60R18) to clear the large dual-piston front brake calipers on Hybrid MAX models.',
  },
  {
    question: 'What tire size fits a Toyota RAV4 Hybrid?',
    answer:
      'A Toyota RAV4 Hybrid fits factory 225/65R17 on 17x7J ET35 wheels (LE, XLE, Woodland), 225/60R18 on Limited trims, or 235/55R19 on XSE, Prime, and TRD trims. For winter driving, downsizing to 225/65R17 on 17-inch rims (5x114.3 bolt pattern, 60.1mm center bore) is fully supported across all models—including the RAV4 Prime PHEV—and provides superior pothole cushion while saving $200–$350 CAD per set.',
  },
  {
    question: 'Does the Toyota Sienna come with a spare tire for winter emergencies?',
    answer:
      'Most Canadian 4th-Gen Toyota Sienna trims do not come with a physical spare tire; they are equipped from the factory with a 12V inflator and liquid tire sealant kit. Because cold Canadian winters cause severe pressure drops and sealant kits can ruin TPMS sensors, carrying a reliable battery-powered cordless inflator or arranging dedicated seasonal roadside assistance is highly recommended.',
  },
  {
    question: 'What is the OEM winter tire size and 17-inch downsize for the Toyota Corolla Cross?',
    answer:
      'The Toyota Corolla Cross comes with 215/65R17 tires on L and LE trims (17x6.5J ET40, 5x114.3 bolt pattern, 60.1mm center bore) and 225/55R18 tires on XLE and XSE Hybrid trims. Downsizing 18-inch XLE/XSE wheels to 215/65R17 for winter driving is fully supported, reducing tire costs while improving slush and snow traction.',
  },
];

const faqPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

function CatalogLoadingFallback() {
  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-12 flex flex-col items-center justify-center space-y-3">
      <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      <p className="text-sm text-zinc-400">Loading Canadian tire fitment catalog...</p>
    </div>
  );
}

export default function TiresPage() {
  return (
    <main className="min-h-screen pt-4 sm:pt-6">
      {/* FAQPage JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <BackButton className="mb-4" />
      </div>

      {/* 1. Server-Rendered Hero Section */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 pt-2 pb-6">
        <div className="relative overflow-hidden border border-zinc-800 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 py-10 sm:py-14 text-white rounded-2xl px-5 sm:px-8 shadow-2xl">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-400">
              <Snowflake className="h-3.5 w-3.5 text-cyan-400" />
              <span>🇨🇦 Canadian Toyota Winter &amp; All-Weather Guide</span>
              <span className="text-zinc-600">•</span>
              <span>2026/2027 Season</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Toyota Winter Tire Sizing, 17&quot; Downsizing &amp; Provincial Mandates
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
              Factory OEM sizing matrices, cost-saving 17-inch winter downsizing specs, Quebec Dec 1 mandates,
              BC mountain highway rules, and Ontario/Alberta insurance discount guides for Canadian Toyota deliveries.
            </p>

            {/* Top-of-Page Jump Links for RAV4, Sienna, and Corolla Cross OEM Sizes */}
            <nav
              aria-label="Jump to Model OEM Tire Sizes"
              data-testid="tire-oem-jump-links"
              className="flex flex-wrap items-center justify-center gap-2 pt-2"
            >
              <a
                href="#rav4-oem-sizes"
                className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-950/50 hover:bg-cyan-900/60 px-3.5 py-1.5 text-xs font-bold text-cyan-300 transition-colors"
              >
                <span>RAV4 OEM Sizes &darr;</span>
              </a>
              <a
                href="#sienna-oem-sizes"
                className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-950/50 hover:bg-cyan-900/60 px-3.5 py-1.5 text-xs font-bold text-cyan-300 transition-colors"
              >
                <span>Sienna OEM Sizes &darr;</span>
              </a>
              <a
                href="#corolla-cross-oem-sizes"
                className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-950/50 hover:bg-cyan-900/60 px-3.5 py-1.5 text-xs font-bold text-cyan-300 transition-colors"
              >
                <span>Corolla Cross OEM Sizes &darr;</span>
              </a>
            </nav>

            {/* Quick Context Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-zinc-800/80 text-left text-xs">
              <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>17&quot; Downsize Approved</span>
                </div>
                <p className="text-zinc-400 text-[11px] leading-snug">
                  RAV4 (including Prime PHEV) &amp; Sienna safely clear 17&quot; wheels, saving $200–$350 CAD per set.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>QC Dec 1 &amp; BC Oct 1 Mandates</span>
                </div>
                <p className="text-zinc-400 text-[11px] leading-snug">
                  Quebec mandates 3PMSF Dec 1–Mar 15; BC requires 3PMSF or M+S with ≥3.5mm tread on highways.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>2%–5% Insurance Discount</span>
                </div>
                <p className="text-zinc-400 text-[11px] leading-snug">
                  Ontario FSRA mandates discounts for certified 4-tire winter setups; Alberta insurers offer equal savings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Direct-Fit Sizing Quick-Lookup Matrix (Server Rendered Directly Beneath Hero) */}
      <DirectFitSizingMatrix />

      {/* 3. Canadian Provincial Winter Tire Mandate & Insurance Table */}
      <ProvincialMandateMatrix />

      {/* 4. Trim-by-Trim OEM Tire Sizing Reference Table */}
      <TrimSizingTable />

      {/* 5. Top Recommended Winter & All-Weather Tire Solutions */}
      <TopRecommendedSolutions />

      {/* 6. Main Interactive Tire Catalog & Reviews wrapped in Suspense */}
      <Suspense fallback={<CatalogLoadingFallback />}>
        <TireCatalog />
      </Suspense>

      {/* 7. Contextual Winter Gear Integration */}
      <ContextualWinterGear />

      {/* 8. Frequently Asked Questions Section */}
      <section
        aria-label="Frequently Asked Questions: Canadian Toyota Winter Tires"
        className="container mx-auto max-w-6xl px-4 sm:px-6 py-8"
      >
        <Card className="border-zinc-800 bg-zinc-900/60 shadow-xl overflow-hidden">
          <CardHeader className="p-5 sm:p-6 pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <HelpCircle className="w-4 h-4" />
              <span>Winter Tire FAQs • 2026 Guide</span>
            </div>
            <CardTitle as="h2" className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              Canadian Winter Tire Sizing, Regulations &amp; Insurance FAQs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 space-y-5">
            {FAQ_ITEMS.map((faq, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2"
              >
                <h3 className="text-sm sm:text-base font-bold text-white flex items-start gap-2">
                  <span className="text-cyan-400 font-mono text-sm shrink-0">Q:</span>
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

      {/* Guide Legal Disclaimer */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 pt-4 pb-16">
        <GuideDisclaimer />
      </div>
    </main>
  );
}
