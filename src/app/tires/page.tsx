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
import { HelpCircle, Loader2 } from 'lucide-react';

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
    question: 'When do I need to switch to winter tires in BC and Quebec?',
    answer:
      'In Quebec, winter tires bearing the 3PMSF (Three-Peak Mountain Snowflake) symbol are legally mandatory on all passenger vehicles from December 1 through March 15. In British Columbia, winter tires marked with either 3PMSF or M+S with minimum 3.5mm tread depth are required by law on designated mountain highways (e.g. Coquihalla, Sea-to-Sky, Hwy 1) from October 1 through April 30 (or March 31 on select southern/coastal routes).',
  },
  {
    question: 'What tire size fits a Toyota RAV4 Hybrid?',
    answer:
      'A Toyota RAV4 Hybrid fits factory 225/65R17 on 17x7J ET35 wheels (LE, XLE, Woodland), 225/60R18 on Limited trims, or 235/55R19 on XSE, Prime, and TRD trims. For winter driving, downsizing to 225/65R17 on 17-inch rims (5x114.3 bolt pattern, 60.1mm center bore) is fully supported across all models—including the RAV4 Prime PHEV—and provides superior pothole cushion while saving $200–$350 CAD per set.',
  },
  {
    question: 'Can you downsize 18-inch wheels to 17-inch for winter tires on a Toyota RAV4?',
    answer:
      'Yes. Downsizing from factory 18-inch (225/60R18) or 19-inch (235/55R19) wheels to 17-inch wheels with 225/65R17 tires is fully supported and recommended for winter driving on all 5th-Gen and 6th-Gen Toyota RAV4 models, including the RAV4 Prime PHEV. 17-inch rims (5x114.3 bolt pattern, 60.1mm center bore, +35 to +45 offset) clear front and rear brake calipers, provide a taller sidewall to absorb hidden potholes, cut through deep slush more effectively, and reduce replacement tire costs by $200 to $350 CAD per set.',
  },
  {
    question: 'Will 225/65R17 tires fit on a Toyota Sienna AWD?',
    answer:
      'Yes. 225/65R17 and 235/65R17 tires on 17x7 or 17x7.5 wheels (5x114.3 bolt pattern, 60.1mm hub bore, +35 to +45 offset) are a proven direct-fit winter package for the 4th-Gen (2021–2026+) Toyota Sienna AWD and FWD. The 17-inch wheel diameter clears all brake calipers and rear e-AWD electric motor hardware while delivering taller sidewall protection and narrower tread width that bites through Canadian winter slush.',
  },
  {
    question: 'Do Canadian auto insurance companies offer discounts for winter tires?',
    answer:
      'Yes. In Ontario, all auto insurance companies are legally mandated by the Financial Services Regulatory Authority (FSRA) to provide a 2% to 5% discount on your policy if you install 4 certified winter tires (typically required from November or December through April). In Alberta and Atlantic Canada, most major insurers offer comparable voluntary premium deductions upon request.',
  },
  {
    question: 'Does the Toyota Sienna come with a spare tire for winter emergencies?',
    answer:
      'Most Canadian 4th-Gen Toyota Sienna trims do not come with a physical spare tire; they are equipped from the factory with a 12V inflator and liquid tire sealant kit. Because cold Canadian winters cause severe pressure drops and sealant kits can ruin TPMS sensors, carrying a reliable battery-powered cordless inflator or arranging dedicated seasonal roadside assistance is highly recommended.',
  },
  {
    question: 'What bolt pattern does the Toyota Grand Highlander use for winter wheels?',
    answer:
      'The Toyota Grand Highlander uses a heavy-duty 5x120 PCD bolt pattern with a 60.1mm center bore, differing from the traditional 5x114.3 pattern on RAV4, Sienna, and standard Highlander models. Winter wheels must be at least 18 inches (e.g., 255/65R18) to clear the large dual-piston front brake calipers on Hybrid MAX models.',
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

      {/* 1. Above-The-Fold Direct-Fit Sizing Quick-Lookup Matrix */}
      <DirectFitSizingMatrix />

      {/* 2. Provincial Mandate & Insurance Discount Matrix */}
      <ProvincialMandateMatrix />

      {/* 3. Trim-by-Trim OEM Tire Sizing Reference Table */}
      <TrimSizingTable />

      {/* 4. Top 3 Recommended Winter & All-Weather Tire Solutions */}
      <TopRecommendedSolutions />

      {/* 5. Main Interactive Tire Catalog & Reviews wrapped in Suspense */}
      <Suspense fallback={<CatalogLoadingFallback />}>
        <TireCatalog />
      </Suspense>

      {/* 6. Contextual Winter Gear Integration */}
      <ContextualWinterGear />

      {/* 7. Frequently Asked Questions Section */}
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
