import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, ShieldCheck, ArrowLeft, ExternalLink, ThermometerSnowflake, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Canadian Level 2 EV Home Charging Prep Guide | ToyotaWaits.ca',
  description:
    'Comprehensive Canadian winter charging guide for Toyota RAV4 Prime / Plug-in Hybrid owners. Comparing Grizzl-E Classic and FLO Home G5 EVSE stations.',
};

export default function EVChargingGuidePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16 space-y-10">
      {/* Header & Breadcrumb */}
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
            <Zap className="h-3.5 w-3.5" /> Prep Hub
          </Badge>
          <Badge variant="outline" className="border-zinc-800 text-zinc-400 text-xs">
            Canadian Winter Rated
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          Level 2 Home Charging for Canadian Winters
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          While you wait for your Toyota Plug-in Hybrid, preparing your home electrical panel is the single most important step. Here is what Canadian winter temperatures demand.
        </p>
      </div>

      {/* Cold Weather Reality Check */}
      <Card className="border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-zinc-900 to-zinc-950 text-zinc-100">
        <CardHeader>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <ThermometerSnowflake className="h-4 w-4" />
            <span>Canadian Winter Reality</span>
          </div>
          <CardTitle className="text-xl font-bold">Why Level 1 (120V) Falls Short in Canadian Freezes</CardTitle>
          <CardDescription className="text-zinc-400 text-xs">
            At -20°C, a portion of the 120V wall outlet&apos;s 1.4 kW trickle is diverted simply to warm the traction battery pack, extending full charge times to over 14 hours.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-zinc-300 leading-relaxed">
          <p>
            A dedicated 240V Level 2 (32A or 40A) EVSE charges the RAV4 Plug-in Hybrid&apos;s 18.1 kWh battery from empty to 100% in approximately <strong>2.5 hours</strong>, enabling you to take full advantage of off-peak provincial electricity rates.
          </p>
        </CardContent>
      </Card>

      {/* Top Canadian EVSE Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Grizzl-E Classic */}
        <Card className="border-zinc-800 bg-zinc-950 text-zinc-100 flex flex-col justify-between">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge className="bg-emerald-600 text-white text-[10px]">Made in Canada</Badge>
              <span className="text-xs font-mono font-bold text-amber-400">Up to 40A (9.6 kW)</span>
            </div>
            <CardTitle className="text-xl font-bold">Grizzl-E Classic Heavy-Duty</CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Built in Markham, Ontario with a NEMA 4 cast-aluminum enclosure rated to -40°C.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-1.5 text-xs text-zinc-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                Heavy-duty rubber cable remains flexible in sub-zero snow
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                Simple DIP-switch amperage regulation (16A, 24A, 32A, 40A)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                NEMA 14-50 plug or hardwire compatible
              </li>
            </ul>

            <Button asChild className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold gap-1.5 text-xs cursor-pointer">
              <a href="/out/grizzl-e-charger" target="_blank" rel="noopener noreferrer nofollow sponsored">
                Check Canadian Price
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* FLO Home G5 */}
        <Card className="border-zinc-800 bg-zinc-950 text-zinc-100 flex flex-col justify-between">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge className="bg-blue-600 text-white text-[10px]">Quebec Engineered</Badge>
              <span className="text-xs font-mono font-bold text-amber-400">30A (7.2 kW)</span>
            </div>
            <CardTitle className="text-xl font-bold">FLO Home G5 Premium</CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Manufactured in Shawinigan, QC with industrial-grade casing and ultra-durable cable.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-1.5 text-xs text-zinc-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                Certified to withstand extreme ice storms and blizzards
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                Sleek architectural design for outdoor or carport mounting
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                Eligible for provincial home charger rebates in QC and PEI
              </li>
            </ul>

            <Button asChild className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold gap-1.5 text-xs cursor-pointer">
              <a href="/out/flo-g5" target="_blank" rel="noopener noreferrer nofollow sponsored">
                View FLO Station Specs
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Disclosure */}
      <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
        <strong>Affiliate Transparency:</strong> Links on this guide use first-party cloaked redirects that earn a referral fee supporting ToyotaWaits.ca hosting and open data infrastructure. As an Amazon Associate I earn from qualifying purchases. We do not use third-party tracking cookies.
      </p>
    </div>
  );
}
