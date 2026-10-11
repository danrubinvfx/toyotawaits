import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ArrowLeft, ExternalLink, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Canadian Auto Insurance Guide for New Toyota Deliveries | ToyotaWaits.ca',
  description:
    'How high vehicle theft rates in Ontario and Quebec affect Toyota insurance premiums. Comparing quotes, TAG system installation discounts, and hybrid replacement policies.',
};

export default function InsuranceGuidePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Wait Times
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-amber-500 text-zinc-950 font-bold gap-1 text-xs hover:bg-amber-400">
            <ShieldCheck className="h-3.5 w-3.5" /> Prep Hub
          </Badge>
          <Badge variant="outline" className="border-zinc-800 text-zinc-400 text-xs">
            Insurance &amp; Anti-Theft
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          Canadian Auto Insurance Prep for New Toyota Deliveries
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Before taking delivery of your new RAV4 or Highlander, Canadian insurance underwriters require specific anti-theft endorsements to avoid punitive high-risk surcharges.
        </p>
      </div>

      {/* Critical Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-zinc-800 bg-zinc-950 text-zinc-100">
          <CardHeader className="space-y-1 pb-2">
            <Badge className="bg-red-600 text-white w-fit text-[10px]">Ontario &amp; Quebec</Badge>
            <CardTitle className="text-base font-bold">The High-Theft Surcharge (TAG Mandate)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-zinc-400 leading-relaxed">
            <p>
              Due to organized cargo theft at Port of Montreal, major Canadian underwriters (Intact, Aviva, Desjardins) apply a $500–$1,500 annual theft surcharge on RAV4 and Highlander models unless an approved tracking system (such as the TAG Tracking System) is installed.
            </p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950 text-zinc-100">
          <CardHeader className="space-y-1 pb-2">
            <Badge className="bg-emerald-600 text-white w-fit text-[10px]">Coverage Tip</Badge>
            <CardTitle className="text-base font-bold">Replacement Value Endorsement (OPCF 43 / QEF 43)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-zinc-400 leading-relaxed">
            <p>
              Because current Toyota replacement wait times range between 6 and 18 months, securing 4-to-5 year Waiver of Depreciation endorsement guarantees you are paid the full original purchase price in the event of total loss or theft.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quote Comparison Box */}
      <Card className="border-amber-500/40 bg-zinc-950 text-zinc-100 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <FileText className="h-4 w-4" />
            <span>Canadian Rate Comparison</span>
          </div>
          <CardTitle className="text-xl font-bold">Compare Provincial Insurance Quotes Before Delivery Day</CardTitle>
          <CardDescription className="text-zinc-400 text-xs">
            Rates vary by thousands of dollars between insurance providers for identical Toyota hybrid trims. Compare rates 30 days before taking delivery.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2 text-xs text-zinc-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              Compare quotes from 30+ licensed Canadian insurance providers simultaneously
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              Check which insurers reimburse the $400 TAG anti-theft installation fee
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              Bundle home and auto for multi-policy discounts up to 20%
            </li>
          </ul>

          <Button asChild className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold gap-1.5 text-xs px-6 cursor-pointer">
            <a href="/out/rates-ca-insurance" target="_blank" rel="noopener noreferrer nofollow sponsored">
              Compare Canadian Auto Quotes
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </CardContent>
      </Card>

      <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
        <strong>Affiliate Transparency:</strong> Referral links use first-party cloaked redirects that help keep ToyotaWaits.ca free and zero-PII compliant. We do not store personal insurance data.
      </p>
    </div>
  );
}
