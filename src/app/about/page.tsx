import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Shield, HeartHandshake, ShoppingBag, Database, Scale } from 'lucide-react';
import { BackButton } from '@/components/common/back-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StorefrontLink } from '@/components/gear/StorefrontLink';

export const metadata: Metadata = {
  title: 'About ToyotaWaits | Community-Driven Toyota Wait Time & Pricing Tracker',
  description:
    'Learn about ToyotaWaits, our zero-PII open data methodology, community-vetted gear resources, and how we keep the tracker ad-free.',
  alternates: {
    canonical: 'https://www.toyotawaits.ca/about',
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16 space-y-10">
      {/* Page Header */}
      <div className="space-y-4 text-center sm:text-left">
        <BackButton className="mb-4" />

        <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
          <Badge className="bg-red-600 hover:bg-red-700 text-white gap-1 px-2.5">
            <HeartHandshake className="h-3.5 w-3.5" /> Community Open Data
          </Badge>
          <Badge
            variant="outline"
            className="border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300 gap-1"
          >
            <Scale className="h-3 w-3" />
            Independent &amp; Ad-Free
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
          About ToyotaWaits
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
          ToyotaWaits is an independent, crowdsourced delivery tracker and buyer transparency hub built for Canadian and U.S. Toyota &amp; Lexus shoppers navigating long hybrid wait times and dealer markups.
        </p>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader className="space-y-1 pb-2">
            <Database className="h-5 w-5 text-amber-600" />
            <CardTitle as="h2" className="text-base font-bold">Crowdsourced Benchmarks</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Real delivery timelines submitted by buyers across provinces and states help estimate realistic factory allocation waits.
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader className="space-y-1 pb-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            <CardTitle as="h2" className="text-base font-bold">Zero-PII Privacy</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Order timeline submissions never require names, phone numbers, or VINs. Our data stays anonymous and open.
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader className="space-y-1 pb-2">
            <ShoppingBag className="h-5 w-5 text-blue-600" />
            <CardTitle as="h2" className="text-base font-bold">Reader-Supported</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Hosting and database costs are funded by optional Ko-fi tips and affiliate links to owner-tested accessories—never paid dealer placements.
          </CardContent>
        </Card>
      </div>

      {/* Gear & Community Resources */}
      <section className="space-y-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 p-6">
        <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-amber-500" />
          Gear &amp; Community Resources
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Explore our vetted accessories, winter protection essentials, and delivery-day checklists curated specifically for Toyota and Lexus hybrid owners.
        </p>
        <ul className="space-y-2.5 text-sm">
          <li>
            <StorefrontLink
              label="Curated Amazon Storefront ↗"
              className="font-semibold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
            />
          </li>
          <li>
            <Link href="/delivery-prep" className="text-zinc-700 dark:text-zinc-300 hover:text-amber-500 transition-colors">
              Toyota Delivery Day Prep Checklist →
            </Link>
          </li>
          <li>
            <Link href="/guides" className="text-zinc-700 dark:text-zinc-300 hover:text-amber-500 transition-colors">
              Build Guides &amp; Mod Almanac →
            </Link>
          </li>
          <li>
            <Link href="/faq" className="text-zinc-700 dark:text-zinc-300 hover:text-amber-500 transition-colors">
              Wait Times &amp; Dealer Markup FAQ →
            </Link>
          </li>
        </ul>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-200 dark:border-zinc-800">
          As an Amazon Associate, ToyotaWaits earns from qualifying purchases made through outbound links at no additional cost to you.
        </p>
      </section>
    </div>
  );
}
