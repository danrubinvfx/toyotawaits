import React from 'react';
import type { Metadata } from 'next';
import { TireCatalog } from '@/components/tires/tire-catalog';
import { DirectFitSizingMatrix } from '@/components/tires/direct-fit-sizing-matrix';
import { ContextualWinterGear } from '@/components/tires/contextual-winter-gear';
import { BackButton } from '@/components/common/back-button';
import { GuideDisclaimer } from '@/components/common/GuideDisclaimer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

export const revalidate = 60;

export const metadata: Metadata = {
  metadataBase: new URL('https://www.toyotawaits.ca'),
  title: 'Toyota Winter Tire Sizing & Wheel Packages Canada (2026/2027) | ToyotaWaits',
  description:
    'Confirmed OEM tire sizes, 17-inch downsizing specs, bolt patterns (5x114.3, 60.1mm bore), and 3PMSF winter tire picks for RAV4, Sienna, Grand Highlander, and Camry.',
  keywords: [
    'toyota winter tire sizing canada',
    'toyota rav4 17 inch winter downsizing',
    'sienna 225 65r17 winter tires',
    'grand highlander 5x120 winter wheels',
    'camry hybrid 215 55r17 winter tire',
    'bc winter tire legal requirements 2026',
    'quebec winter tire deadline dec 1',
    'toyota bolt pattern 5x114.3 60.1',
    '3pmsf severe snow certified toyota',
    'toyota winter tire packages canada',
  ],
  alternates: {
    canonical: 'https://www.toyotawaits.ca/tires',
  },
  openGraph: {
    title: 'Toyota Winter Tire Sizing & Wheel Packages Canada (2026/2027) | ToyotaWaits',
    description:
      'Confirmed OEM tire sizes, 17-inch downsizing specs, bolt patterns (5x114.3, 60.1mm bore), and 3PMSF winter tire picks for RAV4, Sienna, Grand Highlander, and Camry.',
    url: 'https://www.toyotawaits.ca/tires',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toyota Winter Tire Sizing & Wheel Packages Canada (2026/2027) | ToyotaWaits',
    description:
      'Confirmed OEM tire sizes, 17-inch downsizing specs, bolt patterns (5x114.3, 60.1mm bore), and 3PMSF winter tire picks for RAV4, Sienna, Grand Highlander, and Camry.',
  },
};

const FAQ_ITEMS = [
  {
    question: 'Can you downsize 18-inch wheels to 17-inch for winter tires on a Toyota RAV4?',
    answer:
      'Yes. Downsizing from factory 18-inch (225/60R18) or 19-inch (235/55R19) wheels to 17-inch wheels with 225/65R17 tires is fully supported and recommended for winter driving on all 5th-Gen Toyota RAV4 models, including the RAV4 Prime PHEV. 17-inch rims (5x114.3 bolt pattern, 60.1mm center bore, +35 to +45 offset) clear front and rear brake calipers, provide a taller sidewall to absorb hidden potholes, cut through deep slush more effectively, and reduce replacement tire costs by $200 to $350 CAD per set.',
  },
  {
    question: 'Will 225/65R17 tires fit on a Toyota Sienna AWD?',
    answer:
      'Yes. 225/65R17 and 235/65R17 tires on 17x7 or 17x7.5 wheels (5x114.3 bolt pattern, 60.1mm hub bore, +35 to +45 offset) are a proven direct-fit winter package for the 4th-Gen (2021–2026+) Toyota Sienna AWD and FWD. The 17-inch wheel diameter clears all brake calipers and rear e-AWD electric motor hardware while delivering taller sidewall protection and narrower tread width that bites through Canadian winter slush.',
  },
  {
    question: 'What are the legal winter tire requirements in BC and Quebec for 2026/2027?',
    answer:
      'In Quebec, all passenger vehicles registered in the province must be equipped with four winter tires bearing the 3PMSF (Three-Peak Mountain Snowflake) symbol from December 1 to March 15. In British Columbia, winter tires with either the 3PMSF symbol or M+S (Mud & Snow) designation with minimum 3.5mm tread depth are legally required on designated highways (including the Coquihalla Highway 5, Sea-to-Sky Highway 99, and Trans-Canada Highway 1) from October 1 through April 30 (or March 31 on select southern routes). For Canadian winter conditions, dedicated 3PMSF-certified tires are strongly recommended over all-seasons.',
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

      {/* Above-The-Fold Direct-Fit Sizing Quick-Lookup Matrix */}
      <DirectFitSizingMatrix />

      {/* Main Interactive Tire Catalog & Reviews */}
      <TireCatalog />

      {/* Contextual Winter Gear Integration */}
      <ContextualWinterGear />

      {/* Frequently Asked Questions Section */}
      <section
        aria-label="Frequently Asked Questions: Canadian Toyota Winter Tires"
        className="container mx-auto max-w-6xl px-4 sm:px-6 py-8"
      >
        <Card className="border-zinc-800 bg-zinc-900/60 shadow-xl overflow-hidden">
          <CardHeader className="p-5 sm:p-6 pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <HelpCircle className="w-4 h-4" />
              <span>Winter Tire FAQs • 2026/2027 Guidance</span>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              Canadian Winter Tire Sizing &amp; Compliance FAQs
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
