import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Wrench,
  Clock,
  Volume2,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  DollarSign,
  TrendingDown,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Skipping the Wait: Turn Your RAV4 Prime SE into an XSE | ToyotaWaits.ca',
  description:
    'Skip the 12-month XSE queue: How Canadian RAV4 Prime SE buyers upgrade dash speakers, leather seats, and accessories for under $700 CAD without voiding warranty.',
  openGraph: {
    title: 'Skipping the Wait: Turn Your RAV4 Prime SE into an XSE',
    description:
      'The DIY playbook for Canadian buyers tired of waiting 18+ months for an XSE. Get premium sound and leather on an SE for $700 CAD.',
    url: 'https://toyotawaits.ca/guides/rav4-se-mods',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'article',
  },
};

export default function Rav4SeModsGuidePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16 space-y-12">
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
            <Wrench className="h-3.5 w-3.5" /> DIY Mod Playbook
          </Badge>
          <Badge variant="outline" className="border-amber-500/30 text-amber-400 text-xs">
            Skip 6–12 Months of Waiting
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          Skipping the Wait: Turn Your RAV4 Prime SE into an XSE
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          The piano has been drinking, and dealer allocation lists are backed up until next winter. If you don&apos;t want to pace the floor for two years waiting on an XSE with Technology Package, take the SE delivery and build your own luxury spec in an afternoon.
        </p>
      </div>

      {/* 1. The Wait-Time Trade-off */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Clock className="h-5 w-5 text-amber-500" />
          1. The Allocation Reality: SE vs. XSE Wait Times
        </h2>
        <Card className="border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
          <CardContent className="p-6 space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <p>
              In Canadian dealerships (especially across British Columbia, Quebec, and Ontario), Toyota Canada allocates roughly <strong>3 to 4 base SE trims</strong> for every single <strong>XSE Technology Package</strong> that leaves the factory in Japan.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  RAV4 Prime SE Allocation
                </span>
                <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">180 – 240 Days</div>
                <p className="text-xs text-zinc-500">Early Bird Special queue. Shorter dealer line.</p>
              </div>
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  RAV4 Prime XSE / Tech
                </span>
                <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">410 – 540+ Days</div>
                <p className="text-xs text-zinc-500">Multi-season marathon. High demand, strict quotas.</p>
              </div>
            </div>
            <p className="text-xs italic text-zinc-500">
              By telling your dealer you will accept an SE if an allocation arrives sooner, buyers frequently shave 6 to 12 months off their delivery wait time.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 2. The 20-Minute Dash Speaker Swap */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-amber-500" />
          2. The 20-Minute Dash Speaker Swap (Near-JBL Audio)
        </h2>
        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader className="space-y-1 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
            <CardTitle className="text-lg">Drop-in JBL Club 3.5&quot; Tweeters + Plug-and-Play Harness</CardTitle>
            <CardDescription className="text-xs">
              The factory SE sound system uses cheap 2.5&quot; paper-cone dash speakers that muffle vocals. Swapping them takes 20 minutes and requires zero wire splicing.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6 text-sm text-zinc-600 dark:text-zinc-400">
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Step-by-Step Installation:</h3>
              <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm pl-1">
                <li>
                  <strong className="text-zinc-900 dark:text-zinc-200">Pry Corner Grilles:</strong> Insert a nylon pry tool along the edge of the dash corner speaker grilles. Gently pop the plastic clips upwards.
                </li>
                <li>
                  <strong className="text-zinc-900 dark:text-zinc-200">Remove Factory Bolts:</strong> Use a 10mm (or 8mm ratchet wrench depending on build) to remove the two mounting bolts on each side.
                </li>
                <li>
                  <strong className="text-zinc-900 dark:text-zinc-200">Unclip Factory Connector:</strong> Disconnect the factory wiring plug from the paper speaker cone.
                </li>
                <li>
                  <strong className="text-zinc-900 dark:text-zinc-200">Attach Harness:</strong> Click the custom Red Wolf / Metra harness into the factory plug. Slide the female spade connectors onto the JBL Club speaker terminals (positive to positive).
                </li>
                <li>
                  <strong className="text-zinc-900 dark:text-zinc-200">Fasten & Snap Down:</strong> Screw the two mounting bolts back in and snap the speaker grille flush.
                </li>
              </ol>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <Link href="/out/jbl-club-dash-speakers" target="_blank" rel="sponsored nofollow" className="block">
                <Button variant="outline" className="w-full text-xs h-auto py-2.5 flex flex-col items-start text-left border-zinc-300 dark:border-zinc-700">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                    JBL Club 3412T <ExternalLink className="h-3 w-3 text-amber-500" />
                  </span>
                  <span className="text-[11px] text-zinc-500">3.5&quot; 2-Way Drop-in (~$95 CAD)</span>
                </Button>
              </Link>

              <Link href="/out/toyota-speaker-harness" target="_blank" rel="sponsored nofollow" className="block">
                <Button variant="outline" className="w-full text-xs h-auto py-2.5 flex flex-col items-start text-left border-zinc-300 dark:border-zinc-700">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                    Toyota Harness Pair <ExternalLink className="h-3 w-3 text-amber-500" />
                  </span>
                  <span className="text-[11px] text-zinc-500">Plug & Play Adapter (~$18 CAD)</span>
                </Button>
              </Link>

              <Link href="/out/trim-removal-tools" target="_blank" rel="sponsored nofollow" className="block">
                <Button variant="outline" className="w-full text-xs h-auto py-2.5 flex flex-col items-start text-left border-zinc-300 dark:border-zinc-700">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                    Trim Pry Tools <ExternalLink className="h-3 w-3 text-amber-500" />
                  </span>
                  <span className="text-[11px] text-zinc-500">Non-Marring Nylon (~$15 CAD)</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 3. Custom Leather Upholstery */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Layers className="h-5 w-5 text-amber-500" />
          3. Custom Leather Upholstery: Clazzio &amp; EKR vs. Factory SofTex
        </h2>
        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardContent className="p-6 space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <p>
              The XSE trim includes Toyota&apos;s SofTex faux-leather seating with blue stitching. Standard SE models come with black cloth. Rather than paying thousands for the trim package, thousands of Canadian Prime owners install custom tailored seat covers that slip over the factory seats with exact laser-measured fitment.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-2 bg-zinc-50/60 dark:bg-zinc-900/40">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">Clazzio Custom Leather</h3>
                  <Badge variant="secondary" className="text-[10px]">Premium Grade</Badge>
                </div>
                <p className="text-xs text-zinc-500">
                  Genuine perforated leather insert with PVC vinyl outers. Side-airbag deployment certified. Memory foam backing provides a luxury, OEM-grade feel.
                </p>
                <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">~$600–$750 CAD</div>
                <Link href="/out/clazzio-leather-covers" target="_blank" rel="sponsored nofollow" className="inline-block pt-1">
                  <Button size="sm" variant="outline" className="text-xs h-7 gap-1">
                    Check Clazzio Fitments <ExternalLink className="h-3 w-3 text-amber-500" />
                  </Button>
                </Link>
              </div>

              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-2 bg-zinc-50/60 dark:bg-zinc-900/40">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">EKR Tailored Leatherette</h3>
                  <Badge variant="secondary" className="text-[10px]">Budget Friendly</Badge>
                </div>
                <p className="text-xs text-zinc-500">
                  Heavy-duty waterproof 4-layer faux leather. Custom molded to RAV4 5th-gen seats. Snug fit that wipes clean in winter slush and mud.
                </p>
                <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">~$320–$390 CAD</div>
                <Link href="/out/ekr-seat-covers" target="_blank" rel="sponsored nofollow" className="inline-block pt-1">
                  <Button size="sm" variant="outline" className="text-xs h-7 gap-1">
                    Check EKR on Amazon <ExternalLink className="h-3 w-3 text-amber-500" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 4. Cost vs. Wait-Time Calculator */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-emerald-500" />
          4. Cost vs. Wait-Time Financial Breakdown
        </h2>
        <Card className="border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-zinc-100 dark:bg-zinc-900 font-semibold border-b border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                <tr>
                  <th className="py-3 px-4">Feature / Upgrade</th>
                  <th className="py-3 px-4">Factory XSE Package</th>
                  <th className="py-3 px-4">SE + DIY Playbook</th>
                  <th className="py-3 px-4">Your Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60 text-zinc-600 dark:text-zinc-400">
                <tr>
                  <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">Dash &amp; Front Audio</td>
                  <td className="py-3 px-4">Factory JBL (Bundled in XSE)</td>
                  <td className="py-3 px-4">JBL Club 3412T + Harness ($128 CAD)</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">Included in $128</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">Leather / SofTex Seats</td>
                  <td className="py-3 px-4">SofTex (Bundled in XSE)</td>
                  <td className="py-3 px-4">Clazzio / EKR Covers (~$550 CAD)</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">~$550 total</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">MSRP Trim Difference</td>
                  <td className="py-3 px-4 text-rose-500 font-bold">+$4,800 to +$8,200 CAD</td>
                  <td className="py-3 px-4 text-emerald-500 font-bold">$678 CAD total parts</td>
                  <td className="py-3 px-4 text-emerald-600 font-extrabold">&gt; $4,100 CAD saved</td>
                </tr>
                <tr className="bg-amber-500/5 dark:bg-amber-950/20">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Delivery Wait Time</td>
                  <td className="py-3 px-4 text-amber-500 font-bold">410 – 540 Days</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">180 – 240 Days</td>
                  <td className="py-3 px-4 text-amber-600 dark:text-amber-400 font-extrabold">6 to 12 Months Faster</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Disclaimers & Zero-PII Notice */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 text-xs text-zinc-500 space-y-2 bg-zinc-50 dark:bg-zinc-900/40">
        <div className="flex items-center gap-1.5 font-semibold text-zinc-700 dark:text-zinc-300">
          <ShieldCheck className="h-4 w-4 text-amber-500" />
          Transparency &amp; Disclosures (Canadian Competition Act &amp; FTC)
        </div>
        <p>
          ToyotaWaits.ca participates in privacy-safe affiliate programs. When you follow product links via <code>/out/[slug]</code>, we may earn an affiliate commission at no extra cost to you. We route all outbound clicks through our zero-PII serverless proxy to prevent advertising pixels from tracking your browsing activity.
        </p>
      </div>

      {/* Back to Estimator CTA */}
      <div className="pt-4 flex items-center justify-between">
        <Link href="/#estimator">
          <Button className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold gap-2">
            <Clock className="h-4 w-4" />
            Check Live SE vs XSE Wait Times
          </Button>
        </Link>
        <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
