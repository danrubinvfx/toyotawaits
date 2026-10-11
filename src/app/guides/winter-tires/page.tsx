import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Snowflake, ArrowLeft, ExternalLink, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Canadian Winter Tire Laws & Toyota Fitment Guide | ToyotaWaits.ca',
  description:
    'Provincial winter tire mandates for British Columbia and Quebec. Recommended wheel downsizing specs and winter tire packages for Toyota RAV4, Sienna, Grand Highlander, and Land Cruiser.',
};

export default function WinterTiresGuidePage() {
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
            <Snowflake className="h-3.5 w-3.5" /> Prep Hub
          </Badge>
          <Badge variant="outline" className="border-zinc-800 text-zinc-400 text-xs">
            Provincial Legal Mandates
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          Canadian Winter Tire Laws &amp; Fitment Guide
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          If your Toyota delivery window lands between October and April, taking delivery on factory all-season rubber may leave you non-compliant with provincial highway safety laws.
        </p>
      </div>

      {/* Provincial Laws Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-zinc-800 bg-zinc-950 text-zinc-100">
          <CardHeader className="space-y-1 pb-2">
            <Badge className="bg-blue-600 text-white w-fit text-[10px]">British Columbia</Badge>
            <CardTitle className="text-base font-bold">Mountain Pass Regulations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-zinc-400 leading-relaxed">
            <p>
              From <strong>October 1 to April 30</strong>, winter tires marked with the Three-Peak Mountain Snowflake (3PMSF) or M+S symbol with a minimum 3.5mm tread depth are required by law on most major provincial highways (Sea-to-Sky, Coquihalla, Okanagan Connector, Hwy 3).
            </p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950 text-zinc-100">
          <CardHeader className="space-y-1 pb-2">
            <Badge className="bg-blue-600 text-white w-fit text-[10px]">Quebec</Badge>
            <CardTitle className="text-base font-bold">Loi sur les pneus d&apos;hiver</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-zinc-400 leading-relaxed">
            <p>
              Under Quebec highway safety code, all passenger vehicles registered in Quebec must be fitted with tires bearing the 3PMSF pictogram from <strong>December 1 to March 15</strong>. Dealerships cannot legally let you drive off on standard rubber without signing an exemption.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Packages */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Curated Winter Tire Packages for Canadian Road Conditions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Michelin X-Ice */}
          <Card className="border-zinc-800 bg-zinc-950 text-zinc-100 flex flex-col justify-between">
            <CardHeader className="space-y-1">
              <Badge className="bg-amber-500 text-zinc-950 font-bold w-fit text-[10px]">Top Rated for Hybrids</Badge>
              <CardTitle className="text-lg font-bold">Michelin X-Ice Snow</CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Low rolling resistance compound minimizes winter EV range penalty on RAV4 Prime and Sienna.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-1.5 text-xs text-zinc-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  Exceptional braking on black ice and slush
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  Long tread life guaranteed up to 60,000 km
                </li>
              </ul>
              <Button asChild className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold gap-1.5 text-xs cursor-pointer">
                <a href="/out/michelin-xice" target="_blank" rel="noopener noreferrer nofollow sponsored">
                  Check Canadian Availability
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Bridgestone Blizzak */}
          <Card className="border-zinc-800 bg-zinc-950 text-zinc-100 flex flex-col justify-between">
            <CardHeader className="space-y-1">
              <Badge className="bg-amber-500 text-zinc-950 font-bold w-fit text-[10px]">Deep Snow Benchmark</Badge>
              <CardTitle className="text-lg font-bold">Bridgestone Blizzak WS90 / DM-V2</CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Patented Multi-Cell compound provides extreme bite in unplowed Canadian prairie and mountain snow.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-1.5 text-xs text-zinc-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  Maximum grip on hard-packed snow and freeze-thaw slush
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  Popular fitments for Land Cruiser and Grand Highlander
                </li>
              </ul>
              <Button asChild className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold gap-1.5 text-xs cursor-pointer">
                <a href="/out/bridgestone-blizzak" target="_blank" rel="noopener noreferrer nofollow sponsored">
                  Check Canadian Availability
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
        <strong>Affiliate Transparency:</strong> Product links redirect through clean first-party redirects earning referral fees that maintain ToyotaWaits.ca. As an Amazon Associate I earn from qualifying purchases. Zero third-party trackers.
      </p>
    </div>
  );
}
