import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AffiliateCTA } from '@/components/guides/affiliate-cta';
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

  // Problem vs Community Solution
  factoryIssue: string;
  solution: string;
  steps: string[];

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
  solution,
  steps,
  affiliateSlug,
  affiliateLabel,
  affiliateSublabel,
  ctaLabel,
  secondaryActions,
}: ModComparisonCardProps) {
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

      <CardContent className="p-5 sm:p-6 space-y-6">
        {/* Prominent "Why this pick" / Wirecutter Callout */}
        {(whyThisPick || proTip) && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-4 sm:p-4.5 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400">
              <Lightbulb className="h-4 w-4 text-amber-500 shrink-0" />
              <span>{proTip ? "Installer's Pro-Tip" : 'Why This Pick'}</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
              {whyThisPick || proTip}
            </p>
          </div>
        )}

        {/* The Factory Problem vs The Community Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-rose-500/25 bg-rose-500/5 p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-xs text-rose-700 dark:text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              The Factory Omission
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {factoryIssue}
            </p>
          </div>

          <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              The Community Solution
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {solution}
            </p>
          </div>
        </div>

        {/* Step-by-Step Installation Walkthrough */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Installation Walkthrough:
            </h4>
          </div>
          <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 pl-1">
            {steps.map((step, idx) => (
              <li key={idx} className="leading-relaxed">
                {step}
              </li>
            ))}
          </ol>
        </div>

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

          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 italic">
            Outbound links route through our privacy-safe proxy. As an Amazon Associate, toyotawaits.ca earns from qualifying purchases at no extra cost to you.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
