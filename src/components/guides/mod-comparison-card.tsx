import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AffiliateCTA } from '@/components/guides/affiliate-cta';
import { LucideIcon, CheckCircle2, AlertCircle } from 'lucide-react';

interface ModComparisonCardProps {
  stepNumber?: number;
  title: string;
  categoryBadge?: string;
  icon?: LucideIcon;
  priceEst: string;
  factoryIssue: string;
  solution: string;
  steps: string[];
  affiliateSlug: string;
  affiliateLabel: string;
  affiliateSublabel?: string;
}

export function ModComparisonCard({
  stepNumber,
  title,
  categoryBadge,
  icon: Icon,
  priceEst,
  factoryIssue,
  solution,
  steps,
  affiliateSlug,
  affiliateLabel,
  affiliateSublabel,
}: ModComparisonCardProps) {
  return (
    <Card className="border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <CardHeader className="bg-zinc-50/60 dark:bg-zinc-900/40 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 text-amber-500" />}
            <CardTitle className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {stepNumber ? `${stepNumber}. ` : ''}
              {title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {categoryBadge && (
              <Badge variant="secondary" className="text-xs">
                {categoryBadge}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
              {priceEst}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* The Factory Problem vs Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              The Factory Omission
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {factoryIssue}
            </p>
          </div>

          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              The Community Solution
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {solution}
            </p>
          </div>
        </div>

        {/* Actionable Steps */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Installation Walkthrough:
          </h4>
          <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
            {steps.map((step, idx) => (
              <li key={idx} className="leading-relaxed">
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <AffiliateCTA
            slug={affiliateSlug}
            label={affiliateLabel}
            sublabel={affiliateSublabel}
            className="w-full sm:w-auto"
          />
        </div>
      </CardContent>
    </Card>
  );
}
