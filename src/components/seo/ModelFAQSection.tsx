import React from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

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
}

export interface ModelFAQSectionProps {
  faqData: ModelFAQData;
  className?: string;
}

export function ModelFAQSection({ faqData, className = '' }: ModelFAQSectionProps) {
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

  // 4 Canonical Canadian Automotive Questions
  const canonicalFaqs: ModelFAQItem[] = [
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

  // Merge canonical FAQs with any additional modelConfig FAQs, avoiding duplicate questions
  const filteredAdditional = additionalFaqs.filter((faq) => {
    const qLower = faq.question.toLowerCase();
    return (
      !qLower.includes('average wait time') &&
      !qLower.includes('shortest wait time') &&
      !qLower.includes('custom factory order') &&
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
