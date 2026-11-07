'use client';

import React from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';

export interface ModelFAQProvince {
  name: string;
  code: string;
  days?: number;
  months?: string | number;
  multiplier?: number;
  policyNote?: string;
}

export interface ModelFAQPowertrainItem {
  powertrain: string;
  nationalMedian?: string;
  bcLeadTime?: string;
  onLeadTime?: string;
}

export interface ModelFAQItem {
  question: string;
  answer: string;
}

export interface ModelFAQData {
  modelName: string;
  slug: string;
  overallMedianMonths: string | number;
  fastestProvince: ModelFAQProvince | string;
  slowestProvince: ModelFAQProvince | string;
  powertrainBreakdown?: ModelFAQPowertrainItem[] | string;
  totalReports?: number;
  additionalFaqs?: ModelFAQItem[];
  market?: 'US' | 'CA';
}

export interface ModelFAQSectionProps {
  faqData: ModelFAQData;
  className?: string;
  market?: 'US' | 'CA';
}

export function ModelFAQSection({ faqData, className = '', market }: ModelFAQSectionProps) {
  const { market: contextMarket } = useMarket();
  const activeMarket = market || faqData.market || contextMarket || 'CA';

  const {
    modelName,
    overallMedianMonths,
    fastestProvince,
    slowestProvince,
    powertrainBreakdown,
    totalReports,
    additionalFaqs = [],
  } = faqData;

  const canonicalModelName = modelName.startsWith('Toyota')
    ? modelName
    : `Toyota ${modelName}`;
  const shortName = modelName.replace(/^Toyota\s+/i, '');

  // Format province labels
  const fastestName =
    typeof fastestProvince === 'object'
      ? `${fastestProvince.name} (${fastestProvince.code})`
      : fastestProvince;
  const fastestDays =
    typeof fastestProvince === 'object' && fastestProvince.days
      ? ` at approximately ${fastestProvince.months ? `~${fastestProvince.months} months (~` : ''}${fastestProvince.days} days${fastestProvince.months ? ')' : ''}`
      : '';

  const slowestName =
    typeof slowestProvince === 'object'
      ? `${slowestProvince.name} (${slowestProvince.code})`
      : slowestProvince;
  const slowestDays =
    typeof slowestProvince === 'object' && slowestProvince.days
      ? ` (~${slowestProvince.days} days)`
      : '';

  // Format reports text
  const reportsText =
    typeof totalReports === 'number' && totalReports > 0
      ? ` based on ${totalReports} verified Canadian crowd submissions and allocation records`
      : '';

  // Powertrain breakdown text if available
  let ptSummary = '';
  if (Array.isArray(powertrainBreakdown) && powertrainBreakdown.length > 0) {
    ptSummary = ` By powertrain variant: ${powertrainBreakdown
      .map((pt) => `${pt.powertrain} (~${pt.nationalMedian})`)
      .join(', ')}.`;
  } else if (typeof powertrainBreakdown === 'string' && powertrainBreakdown.trim()) {
    ptSummary = ` ${powertrainBreakdown.trim()}`;
  }

  // Canonical Canadian Automotive Questions
  const caFaqs: ModelFAQItem[] = [
    {
      question: `What is the average wait time for a ${canonicalModelName} in Canada?`,
      answer: `The Canadian national median wait time for a ${canonicalModelName} is approximately ${overallMedianMonths} months${reportsText}.${ptSummary} Delivery timelines vary based on powertrain choice (gas vs. hybrid vs. plug-in hybrid), package options, and dealership queue volume.`,
    },
    {
      question: `Which Canadian province has the shortest wait time for the ${shortName}?`,
      answer: `${fastestName} generally reports the shortest wait times for the ${canonicalModelName} in Canada${fastestDays}, benefiting from steady non-subsidized retail allocation pipelines. In contrast, provinces with strong provincial EV/ZEV rebate programs like ${slowestName} experience the longest delivery queues${slowestDays} due to heavy consumer order backlogs.`,
    },
    {
      question: `Can Canadians place custom factory orders for the ${shortName} or is it dealer allocation?`,
      answer: `Toyota Canada does not operate a traditional custom factory build-to-order system for retail buyers. Instead, Toyota distributes vehicles through a semi-monthly dealership allocation framework based on historical sales volume and market size. When you place a deposit on a ${canonicalModelName}, you are added to your dealer's internal reservation queue to be matched with upcoming factory allocations that fit your preferred trim, color, and option specifications.`,
    },
    {
      question: `Are waitlist vehicle deposits refundable under Canadian regulations?`,
      answer: `In Canada, vehicle waitlist deposits placed prior to executing a final binding bill of sale and receiving a confirmed vehicle VIN are generally fully refundable under provincial motor vehicle retail regulations (governed by OMVIC in Ontario, AMVIC in Alberta, and the VSA in British Columbia). Dealerships cannot lawfully retain your deposit without documented liquidated damages or signed custom-order accessory agreements. Always verify that your deposit agreement includes a written clause confirming full refundability upon request prior to factory VIN assignment.`,
    },
  ];

  // Canonical US Automotive Questions
  const usFaqs: ModelFAQItem[] = [
    {
      question: `How long is the wait for a ${canonicalModelName} in the United States?`,
      answer: `Wait times for a ${canonicalModelName} in the United States typically range from 30 to 90 days once an allocation is assigned and built, though high-demand trims and electrified variants (hybrid and plug-in hybrid) can face dealer waitlists of 3 to 9+ months. Unlike build-to-order systems, Toyota Motor North America (TMNA) and regional private distributors distribute vehicles via semi-monthly dealer allocations based on dealer sales velocity and regional market quotas.`,
    },
    {
      question: `Are US dealers adding markups to the ${canonicalModelName}?`,
      answer: `Yes, depending on regional supply and distributor allocation, many US dealerships add Additional Dealer Markup (ADM) or mandatory dealer accessory packages above MSRP on the ${canonicalModelName}. Unlike Canada where provincial regulations enforce all-in advertised pricing, independent US franchised dealerships are legally free to set their own transaction prices. ToyotaWaits tracks crowdsourced dealer pricing deltas ($0, +$1,000, +$3,000+) so American buyers can identify fair-price dealerships without ADM.`,
    },
    {
      question: `How does the Toyota allocation system work in the US?`,
      answer: `Toyota Motor North America (TMNA) and regional independent distributors (such as Southeast Toyota and Gulf States Toyota) distribute vehicles twice monthly via dealer allocations rather than true factory orders. Dealerships receive batches of build slots that are matched to buyers in their reservation queue based on requested trim, color, and option packages. Once allocated, transit from assembly or port typically takes 30 to 90 days.`,
    },
    {
      question: `Are vehicle waitlist deposits refundable in the United States?`,
      answer: `Deposit refundability in the United States varies by state motor vehicle franchise laws and dealer agreements. In states like California, dealer deposits on unsigned purchase agreements are generally fully refundable by law prior to VIN assignment. Always insist on a signed deposit receipt specifying full refundability upon request before placing a hold.`,
    },
  ];

  const canonicalFaqs = activeMarket === 'US' ? usFaqs : caFaqs;

  // Merge canonical FAQs with any additional modelConfig FAQs, avoiding duplicate questions
  const filteredAdditional = additionalFaqs.filter((faq) => {
    const qLower = faq.question.toLowerCase();
    return (
      !qLower.includes('average wait time') &&
      !qLower.includes('shortest wait time') &&
      !qLower.includes('how long is the wait') &&
      !qLower.includes('adding markups') &&
      !qLower.includes('custom factory order') &&
      !qLower.includes('allocation system work') &&
      !qLower.includes('deposit refundable')
    );
  });

  const faqs: ModelFAQItem[] = [...canonicalFaqs, ...filteredAdditional];

  // Google Schema.org FAQPage JSON-LD Markup
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section
      data-testid="model-faq-section"
      className={`space-y-4 ${className}`}
      aria-label={`Frequently Asked Questions for ${canonicalModelName}`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-red-600" />
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          Frequently Asked Questions: {canonicalModelName} Wait Times
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group border border-zinc-800 bg-zinc-900/40 rounded-xl p-4 transition-all"
          >
            <summary className="flex items-center justify-between cursor-pointer font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 select-none hover:text-red-600 dark:hover:text-red-400 transition-colors list-none">
              <span>{faq.question}</span>
              <ChevronDown className="h-4 w-4 text-zinc-400 group-open:rotate-180 transition-transform duration-200 shrink-0 ml-2" />
            </summary>
            <div className="pt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-800/60 mt-3">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

export default ModelFAQSection;
