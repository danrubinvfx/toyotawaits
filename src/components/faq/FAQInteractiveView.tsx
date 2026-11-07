'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, DollarSign, Scale, ShieldCheck, Globe, ArrowRight } from 'lucide-react';
import { useMarket, type Market } from '@/context/MarketContext';
import { cn } from '@/lib/utils';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQCategory {
  id: 'us' | 'ca' | 'general';
  marketCode?: Market;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeText: string;
  items: FAQItem[];
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'us',
    marketCode: 'US',
    title: 'United States: Allocations, Markups & Pricing (USD)',
    subtitle: 'Dealer markup transparency (ADM), TMNA allocation cycles, port transit timelines, and deposit protection rules.',
    icon: DollarSign,
    badgeText: '🇺🇸 United States Market',
    items: [
      {
        id: 'us-adm-markups',
        question: 'Do Toyota dealers in the United States charge over MSRP (ADM)?',
        answer: 'Unlike Canada where provincial all-in pricing rules restrict surprise fees, US dealers operate as independent franchises and can add Additional Dealer Markup (ADM) or mandatory accessory packages. ToyotaWaits tracks crowdsourced MSRP deltas ($0, +$1,000, +$3,000+) so buyers can locate fair-price allocation dealers.',
      },
      {
        id: 'us-allocation-system',
        question: 'How does the Toyota allocation system work in the US?',
        answer: 'Toyota Motor North America (TMNA) and regional distributors (such as Southeast Toyota and Gulf States Toyota) distribute vehicles twice monthly via dealer allocations rather than true factory orders. Once allocated, transit from assembly or port typically takes 30 to 90 days.',
      },
      {
        id: 'us-refundable-deposits',
        question: 'Are vehicle waitlist deposits refundable in the United States?',
        answer: 'Deposit rules vary by state franchise laws. In states like California, dealer deposits on unsigned purchase agreements are generally fully refundable by law. Always secure a signed deposit receipt specifying refundability before VIN assignment.',
      },
      {
        id: 'us-vin-tracking',
        question: 'Can I track my Toyota build status using a VIN or permanent freight code?',
        answer: "Yes. Once an allocation enters build phase (status 'A' or 'F'), a temporary allocation hash or 17-digit VIN is assigned. Once freight carriers take custody, dealers can see railhead and port tracking updates.",
      },
    ],
  },
  {
    id: 'ca',
    marketCode: 'CA',
    title: 'Canada: Provincial Queues & All-In Pricing (CAD)',
    subtitle: 'OMVIC/AMVIC/VSA all-in pricing regulations, national production quotas, and EV/PHEV rebate delivery timelines.',
    icon: Scale,
    badgeText: '🇨🇦 Canadian Market',
    items: [
      {
        id: 'ca-all-in-pricing',
        question: 'How do OMVIC and Canadian provincial all-in pricing laws protect vehicle buyers?',
        answer: "Under provincial motor vehicle sales legislation (administered by OMVIC in Ontario, AMVIC in Alberta, and the VSA in British Columbia), dealerships are strictly bound to 'all-in price advertising.' A dealer cannot legally demand mandatory dealer markups, documentation fees, or unwanted dealer accessories above their advertised price. Only statutory sales taxes (GST/PST/HST) and vehicle licensing fees may be added.",
      },
      {
        id: 'ca-queue-durations',
        question: 'Why are Canadian factory wait times longer than in the United States?',
        answer: 'Toyota Canada operates within a fixed national production quota allocated from global and North American manufacturing facilities. Because Canada represents roughly 10% the market size of the US, smaller monthly dealer allocation batches combined with aggressive consumer demand in high-rebate provinces lead to extended multi-month queues, particularly on electrified powertrains.',
      },
      {
        id: 'ca-ev-rebates',
        question: 'How do provincial EV and PHEV rebates impact delivery timelines in Canada?',
        answer: 'Provinces offering point-of-sale electrified vehicle rebates (such as the federal iZEV program, British Columbia CleanBC, and Quebec Roulez vert) channel intense consumer demand toward electrified models like the RAV4 Prime and Sienna. As a result, allocation queues in BC and Quebec are typically 1.2x to 1.5x longer than in non-rebate Prairie and Atlantic provinces.',
      },
      {
        id: 'ca-refundable-deposits',
        question: 'Are vehicle waitlist deposits refundable under Canadian regulations?',
        answer: 'In Canada, vehicle waitlist deposits placed prior to executing a final binding bill of sale and receiving a confirmed vehicle VIN are generally fully refundable under provincial motor vehicle retail regulations (governed by OMVIC in Ontario, AMVIC in Alberta, and the VSA in British Columbia). Dealerships cannot lawfully retain your deposit without documented liquidated damages or signed custom-order accessory agreements. Always verify that your deposit agreement includes a written clause confirming full refundability upon request prior to factory VIN assignment.',
      },
    ],
  },
  {
    id: 'general',
    title: 'General Platform & Consumer Transparency',
    subtitle: 'Open data methodologies, statistical confidence decay, Zero-PII privacy standards, and independent non-affiliation.',
    icon: ShieldCheck,
    badgeText: '🛡️ Open Data & Privacy',
    items: [
      {
        id: 'gen-non-affiliation',
        question: 'Is ToyotaWaits affiliated with Toyota Motor Corporation?',
        answer: 'No. ToyotaWaits is an independent, community-driven tracker and research tool not endorsed by or affiliated with Toyota Motor Sales, U.S.A., Inc., or Toyota Canada Inc.',
      },
      {
        id: 'gen-data-collection',
        question: 'How does ToyotaWaits collect and calculate wait times?',
        answer: 'ToyotaWaits aggregates crowdsourced timelines submitted anonymously by verified vehicle buyers across Canada and the United States, alongside real-time inventory tracking feeds from dealership lot management systems. Statistical medians and confidence decay algorithms ensure lead times reflect current production and allocation reality rather than outdated anecdotes.',
      },
      {
        id: 'gen-zero-pii',
        question: 'Is submitting an order timeline anonymous?',
        answer: 'Yes. Timeline submissions are 100% anonymous and never require personal identifiers, financing contracts, or contact information. Optional email alerts for allocation notifications are stored in an isolated queue and can be deleted at any time under our Zero-PII privacy charter.',
      },
      {
        id: 'gen-raw-export',
        question: 'Can I download the raw community wait-time dataset?',
        answer: 'Yes. In keeping with our open-data mission, the complete sanitized community delivery dataset is available for public download in standard CSV format via our open export endpoint.',
      },
    ],
  },
];

export function FAQInteractiveView() {
  const { market, setMarket } = useMarket();
  const [activeFilter, setActiveFilter] = useState<'all' | 'us' | 'ca' | 'general'>('all');

  const handleFilterClick = (filter: 'all' | 'us' | 'ca' | 'general') => {
    setActiveFilter(filter);
    if (filter === 'us') {
      setMarket('US');
    } else if (filter === 'ca') {
      setMarket('CA');
    }
  };

  const displayedCategories = FAQ_CATEGORIES.filter((cat) => {
    if (activeFilter === 'all') return true;
    return cat.id === activeFilter;
  });

  return (
    <div className="space-y-8" data-testid="faq-interactive-view">
      {/* Interactive Category & Market Switcher Pills */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-xs">
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 px-2 flex items-center gap-1.5">
          <Globe className="h-3.5 w-3.5" />
          Filter by Market:
        </span>

        <button
          type="button"
          onClick={() => handleFilterClick('all')}
          className={cn(
            'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
            activeFilter === 'all'
              ? 'bg-amber-500 text-black shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
          )}
          data-testid="faq-filter-all"
        >
          All Topics ({FAQ_CATEGORIES.reduce((acc, c) => acc + c.items.length, 0)})
        </button>

        <button
          type="button"
          onClick={() => handleFilterClick('us')}
          className={cn(
            'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
            activeFilter === 'us'
              ? 'bg-amber-500 text-black shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
          )}
          data-testid="faq-filter-us"
        >
          <span>🇺🇸</span>
          <span>United States (USD)</span>
        </button>

        <button
          type="button"
          onClick={() => handleFilterClick('ca')}
          className={cn(
            'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
            activeFilter === 'ca'
              ? 'bg-amber-500 text-black shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
          )}
          data-testid="faq-filter-ca"
        >
          <span>🇨🇦</span>
          <span>Canada (CAD)</span>
        </button>

        <button
          type="button"
          onClick={() => handleFilterClick('general')}
          className={cn(
            'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
            activeFilter === 'general'
              ? 'bg-amber-500 text-black shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
          )}
          data-testid="faq-filter-general"
        >
          <span>🛡️</span>
          <span>Platform &amp; Transparency</span>
        </button>
      </div>

      {/* Render Categorized Accordions */}
      <div className="space-y-12">
        {displayedCategories.map((category) => {
          const CategoryIcon = category.icon;
          const isCategoryActiveMarket =
            (category.id === 'us' && market === 'US') ||
            (category.id === 'ca' && market === 'CA');

          return (
            <section
              key={category.id}
              id={`category-${category.id}`}
              className="space-y-4 scroll-mt-20"
              aria-labelledby={`heading-${category.id}`}
            >
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                    <CategoryIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2
                      id={`heading-${category.id}`}
                      className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50"
                    >
                      {category.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                      {category.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                    {category.badgeText}
                  </span>
                  {isCategoryActiveMarket && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500 text-zinc-950 shadow-xs">
                      Active Market
                    </span>
                  )}
                </div>
              </div>

              {/* Accordion Questions */}
              <div className="space-y-3">
                {category.items.map((item) => (
                  <details
                    key={item.id}
                    className="group border border-zinc-800 bg-zinc-900/40 rounded-xl p-4 transition-all"
                  >
                    <summary className="flex items-center justify-between cursor-pointer font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 select-none hover:text-red-600 dark:hover:text-red-400 transition-colors list-none">
                      <span>{item.question}</span>
                      <ChevronDown className="h-4 w-4 text-zinc-400 group-open:rotate-180 transition-transform duration-200 shrink-0 ml-2" />
                    </summary>
                    <div className="pt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-800/60 mt-3">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Helpful Quick Links Callout Banner */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Have an incoming allocation or order update?
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Contribute your anonymous timeline to help fellow car buyers benchmark their delivery turnaround.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link
            href="/submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors"
          >
            <span>Submit Timeline</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/inventory"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors"
          >
            <span>View Live Stock</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FAQInteractiveView;
