import React from 'react';
import type { Metadata } from 'next';
import { HelpCircle, Scale } from 'lucide-react';
import { BackButton } from '@/components/common/back-button';
import { Badge } from '@/components/ui/badge';
import { FAQInteractiveView, FAQ_CATEGORIES } from '@/components/faq/FAQInteractiveView';

export const dynamic = 'force-dynamic';
export const { instant } = { instant: false };

export function generateMetadata(): Metadata {
  return {
    title: 'Toyota Wait Times & Dealer Markup FAQ (US & Canada 2026) | ToyotaWaits',
    description:
      'Frequently asked questions on Toyota allocation transit times, dealer markups (ADM), deposit refund rules, and crowdsourced delivery tracking in the US and Canada.',
    alternates: {
      canonical: 'https://www.toyotawaits.ca/faq',
    },
    openGraph: {
      title: 'Toyota Wait Times & Dealer Markup FAQ (US & Canada 2026) | ToyotaWaits',
      description:
        'Frequently asked questions on Toyota allocation transit times, dealer markups (ADM), deposit refund rules, and crowdsourced delivery tracking in the US and Canada.',
      url: 'https://www.toyotawaits.ca/faq',
      siteName: 'ToyotaWaits',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Toyota Wait Times & Dealer Markup FAQ (US & Canada 2026) | ToyotaWaits',
      description:
        'Frequently asked questions on Toyota allocation transit times, dealer markups (ADM), deposit refund rules, and crowdsourced delivery tracking in the US and Canada.',
    },
  };
}

export default function FAQPage() {
  const allFaqs = FAQ_CATEGORIES.flatMap((category) => category.items);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Page Header */}
      <div className="space-y-4 text-center sm:text-left">
        <BackButton className="mb-4" />

        <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
          <Badge className="bg-red-600 hover:bg-red-700 text-white gap-1 px-2.5">
            <HelpCircle className="h-3.5 w-3.5" /> Consumer Transparency Hub
          </Badge>
          <Badge
            variant="outline"
            className="border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300 gap-1"
          >
            <Scale className="h-3 w-3" />
            Dual-Market: 🇺🇸 United States &amp; 🇨🇦 Canada (2026)
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
          Frequently Asked Questions
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
          Everything you need to know about Toyota factory allocation pipelines, transit timetables, dealer markups (ADM), deposit refund rights, and our crowdsourced wait-time and pricing methodology across the United States and Canada.
        </p>
      </div>

      {/* Interactive FAQ View with Market Toggle & Categorized Accordions */}
      <FAQInteractiveView />
    </div>
  );
}
