import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AffiliateCTA } from '@/components/guides/affiliate-cta';
import { MarketAssociateDisclaimer } from '@/components/guides/market-associate-disclaimer';
import {
  LucideIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  Wrench,
  ShieldCheck,
  Sparkles,
  Lightbulb,
} from 'lucide-react';

export interface ModSecondaryAction {
  slug: string;
  label: string;
  sublabel?: string;
  priceEst?: string;
}

export interface ModComparisonCardProps {
  stepNumber?: number;
  title: string;
  categoryBadge?: string;
  icon?: LucideIcon;
  priceEst: string;

  // Structured "At-a-Glance" metadata pills
  installEffort?: string; // e.g., "15-min Install", "5-min Install", "Plug & Play"
  integration?: string;   // e.g., "OEM Factory Look", "Direct Harness Tap", "Replaces Halogen"
  fitmentBadge?: string;  // e.g., "Verified 2019–2026 RAV4", "Verified 2021–2026 Sienna"

  // Prominent Wirecutter-style Callout
  whyThisPick?: string;
  proTip?: string;

  // Problem vs Community Solution (supports both legacy and new schema)
  factoryIssue?: string;
  factoryOmission?: string;
  solution?: string;
  communitySolution?: string;
  steps?: string[];
  installationSteps?: string[];

  // High-Intent Outbound CTAs
  affiliateSlug?: string;
  affiliateLabel?: string;
  affiliateSublabel?: string;
  ctaLabel?: string; // e.g. "Check Fitment on Amazon.ca ↗"
  secondaryActions?: ModSecondaryAction[];
}

export function ModComparisonCard({
  stepNumber,
  title,
  categoryBadge,
  icon: Icon,
  priceEst,
  installEffort,
  integration,
  fitmentBadge,
  whyThisPick,
  proTip,
  factoryIssue,
  factoryOmission,
  solution,
  communitySolution,
  steps,
  installationSteps,
  affiliateSlug,
  affiliateLabel,
  affiliateSublabel,
  ctaLabel,
  secondaryActions,
}: ModComparisonCardProps) {
  // Normalize legacy vs new prop conventions
  const activeProTip = proTip || whyThisPick;
  const activeOmission = factoryOmission || factoryIssue;
  const activeSolution = communitySolution || solution;
  const activeSteps = installationSteps || steps || [];

  // Format high-intent CTA label
  const primaryButtonLabel =
    ctaLabel ||
    affiliateLabel ||
    'Check Fitment on Amazon.ca ↗';

  return (
    <Card className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-all duration-200">
      {/* Card Header & Title */}
      <CardHeader className="bg-gradient-to-r from-zinc-50/80 via-zinc-50/50 to-transparent dark:from-zinc-900/60 dark:via-zinc-900/30 dark:to-transparent border-b border-zinc-200/80 dark:border-zinc-800/80 p-5 sm:p-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="h-9 w-9 rounded-lg bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/20 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            )}
            <CardTitle className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              {stepNumber ? `${stepNumber}. ` : ''}
              {title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {categoryBadge && (
              <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-0.5">
                {categoryBadge}
              </Badge>
            )}
            <Badge
              variant="outline"
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5"
            >
              {priceEst}
            </Badge>
          </div>
        </div>

        {/* Structured "At-a-Glance" Metadata Pills */}
        {(installEffort || integration || fitmentBadge) && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {installEffort && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
                <Clock className="h-3 w-3 text-amber-500" />
                {installEffort}
              </span>
            )}
            {integration && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
                <Sparkles className="h-3 w-3 text-amber-500" />
                {integration}
              </span>
            )}
            {fitmentBadge && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                {fitmentBadge}
              </span>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-4">
        {/* A. Installer's Pro-Tip (Open by Default) */}
        {(proTip || whyThisPick) && (
          <details open className="group border border-amber-900/40 bg-amber-950/10 rounded-lg p-3 transition-all">
            <summary className="flex items-center justify-between cursor-pointer list-none select-none text-amber-400 text-sm font-semibold [&::-webkit-details-marker]:hidden">
              <div className="flex items-center gap-2">
                <span>💡</span>
                <span>Installer&apos;s Pro-Tip</span>
              </div>
              <span className="text-amber-500/60 text-xs transition-transform duration-200 group-open:rotate-180">
                ▼
              </span>
            </summary>
            <div className="mt-2 text-xs md:text-sm text-neutral-300 leading-relaxed pl-6 border-t border-amber-900/30 pt-2 space-y-1.5">
              {whyThisPick && <p>{whyThisPick}</p>}
              {proTip && proTip !== whyThisPick && (
                <p className={whyThisPick ? "text-amber-200/90 font-medium" : ""}>
                  {proTip}
                </p>
              )}
            </div>
          </details>
        )}

        {/* B. Why Upgrade? / Problem vs Solution (Closed by Default) */}
        {(activeOmission || activeSolution) && (
          <details className="group border border-neutral-800 rounded-lg bg-neutral-900/40 p-3 transition-colors hover:border-neutral-700">
            <summary className="flex items-center justify-between cursor-pointer list-none select-none text-xs font-semibold uppercase tracking-wider text-neutral-400 [&::-webkit-details-marker]:hidden">
              <span>Why Upgrade? (Factory Flaw vs Solution)</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 font-normal group-open:hidden">Show comparison</span>
                <span className="text-xs text-neutral-500 font-normal hidden group-open:inline">Hide</span>
                <span className="text-neutral-500 transition-transform duration-200 group-open:rotate-180 text-[10px]">
                  ▼
                </span>
              </div>
            </summary>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-neutral-800 text-xs md:text-sm">
              {activeOmission && (
                <div className="p-3 rounded bg-red-950/20 border border-red-900/30 text-neutral-300">
                  <span className="text-red-400 font-semibold block mb-1">The Factory Omission</span>
                  {activeOmission}
                </div>
              )}
              {activeSolution && (
                <div className="p-3 rounded bg-emerald-950/20 border border-emerald-900/30 text-neutral-300">
                  <span className="text-emerald-400 font-semibold block mb-1">The Community Solution</span>
                  {activeSolution}
                </div>
              )}
            </div>
          </details>
        )}

        {/* C. Installation Walkthrough (Closed by Default) */}
        {activeSteps && activeSteps.length > 0 && (
          <details className="group border border-neutral-800 rounded-lg bg-neutral-900/30 p-3 transition-colors hover:border-neutral-700">
            <summary className="flex items-center justify-between cursor-pointer list-none select-none text-neutral-200 text-sm font-medium [&::-webkit-details-marker]:hidden">
              <div className="flex items-center gap-2">
                <span>🔧</span>
                <span className="font-semibold uppercase tracking-wide text-xs text-neutral-300">
                  Installation Walkthrough ({activeSteps.length} Steps)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 group-open:hidden">Show Steps</span>
                <span className="text-xs text-neutral-500 hidden group-open:inline">Hide Steps</span>
                <span className="text-neutral-500 transition-transform duration-200 group-open:rotate-180 text-[10px]">
                  ▼
                </span>
              </div>
            </summary>
            <ol className="mt-3 space-y-2 text-xs md:text-sm text-neutral-400 list-decimal list-inside pl-1 border-t border-neutral-800 pt-3">
              {activeSteps.map((step, idx) => (
                <li key={idx} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
          </details>
        )}

        {/* High-Intent Outbound Action CTAs */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-900 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {affiliateSlug && (
              <AffiliateCTA
                slug={affiliateSlug}
                label={primaryButtonLabel}
                sublabel={affiliateSublabel}
                isPrimary={true}
                className="w-full sm:w-auto"
              />
            )}

            {secondaryActions &&
              secondaryActions.map((sec, idx) => (
                <AffiliateCTA
                  key={idx}
                  slug={sec.slug}
                  label={sec.label}
                  sublabel={sec.sublabel || sec.priceEst}
                  isPrimary={false}
                  className="w-full sm:w-auto text-xs"
                />
              ))}
          </div>

          <MarketAssociateDisclaimer />
        </div>
      </CardContent>
    </Card>
  );
}
