'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Lock, Heart, Globe, Scale, Mail } from 'lucide-react';
import { KofiCalloutCard } from '@/components/common/kofi-button';
import { ModelDirectory } from '@/components/ModelDirectory';
import { cn } from '@/lib/utils';
import { useMarket } from '@/context/MarketContext';
import type { CountryCode } from '@/lib/types/contracts';

interface FooterProps {
  initialRegion?: CountryCode;
}

export function Footer({ initialRegion = 'CA' }: FooterProps) {
  const { market, setMarket } = useMarket();
  const currentRegion = (market as CountryCode) || initialRegion;
  const isUs = currentRegion === 'US';
  const baseUrl = isUs ? 'https://www.toyotawaits.com' : 'https://www.toyotawaits.ca';

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 py-12 text-zinc-600 dark:text-zinc-400">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2 font-bold text-base text-zinc-900 dark:text-zinc-100">
              <span>{isUs ? 'ToyotaWaits.com' : 'ToyotaWaits.ca'}</span>
              <span className={cn(
                "rounded px-1.5 py-0.5 text-[10px] font-semibold",
                isUs
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                  : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
              )}>
                {isUs ? '🇺🇸 U.S. Open Data' : '🇨🇦 Canadian Open Data'}
              </span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-md">
              {isUs
                ? 'Crowdsourced U.S. vehicle delivery tracker for RAV4 HEV/PHEV, Sienna, Grand Highlander, and Land Cruiser. Helping American car buyers cut through allocation opacity and dealer markups.'
                : 'Crowdsourced Canadian vehicle delivery tracker for RAV4 HEV/PHEV, Sienna, Grand Highlander, and Land Cruiser. Helping Canadian car buyers cut through allocation opacity.'}
            </p>
            <div className="flex items-start space-x-2 text-xs text-zinc-500">
              <Lock className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Order timeline submissions are 100% anonymous and never require personal identifiers. Email addresses provided optionally for &apos;Notify Me&apos; delivery alerts are stored strictly in an isolated notification queue and can be deleted at any time.</span>
            </div>

            {/* Regional Switcher / Indicator */}
            <div className="pt-2 flex items-center gap-2">
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                <Globe className="h-3.5 w-3.5 text-zinc-400" />
                Region:
              </span>
              <div className="inline-flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100/90 dark:bg-zinc-900/90 p-0.5 text-xs font-semibold" data-testid="region-switcher-footer">
                <button
                  type="button"
                  onClick={() => setMarket('CA')}
                  className={cn(
                    'px-2.5 py-1 rounded-md transition-colors cursor-pointer',
                    !isUs
                      ? 'bg-white dark:bg-zinc-800 font-bold text-zinc-900 dark:text-zinc-100 shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                  )}
                  title="Switch to Canada (CAD)"
                >
                  🇨🇦 CA (CAD)
                </button>
                <button
                  type="button"
                  onClick={() => setMarket('US')}
                  className={cn(
                    'px-2.5 py-1 rounded-md transition-colors cursor-pointer',
                    isUs
                      ? 'bg-white dark:bg-zinc-800 font-bold text-zinc-900 dark:text-zinc-100 shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                  )}
                  title="Switch to United States (USD)"
                >
                  🇺🇸 US (USD)
                </button>
              </div>
            </div>

            <div className="pt-1">
              <a
                href="https://ko-fi.com/toyotawaits"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
              >
                ☕ Support this tracker
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`${baseUrl}/#estimator`} className="hover:text-amber-500 transition-colors">
                  Toyota Delivery Wait-Time Estimator
                </Link>
              </li>
              <li>
                <Link href={`${baseUrl}/calculator`} className="hover:text-amber-500 transition-colors">
                  Toyota Hybrid Savings Calculator
                </Link>
              </li>
              <li>
                <Link href={`${baseUrl}/#community-log`} className="hover:text-amber-500 transition-colors">
                  {isUs ? 'State Analytics & Delivery Log' : 'Canadian Provincial Analytics & Delivery Log'}
                </Link>
              </li>
              <li>
                <Link href={`${baseUrl}/submit`} className="hover:text-amber-500 transition-colors">
                  Submit Toyota Wait Time Timeline
                </Link>
              </li>
              <li>
                <Link href={`${baseUrl}/api/export`} className="hover:text-amber-500 transition-colors">
                  Download Canadian Toyota Delivery Data (CSV)
                </Link>
              </li>
            </ul>
          </div>

          {/* Prep Hub & Guides */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3">
              Buyer Prep &amp; Mods Hub
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`${baseUrl}/guides`} className="text-amber-500 font-semibold hover:underline">
                  All Toyota Build Guides &amp; Mod Almanac →
                </Link>
              </li>
              <li>
                <Link href={`${baseUrl}/tires`} className="hover:text-amber-500 transition-colors">
                  {isUs ? 'Tire Guide & Reviews 🛞' : 'Canadian Tire Guide 🛞'}
                </Link>
              </li>
              <li>
                <Link href={`${baseUrl}/winter-prep`} className="hover:text-amber-500 transition-colors">
                  Winter Prep &amp; Survival ❄️
                </Link>
              </li>
              <li>
                <Link href={`${baseUrl}/delivery-prep`} className="hover:text-amber-500 transition-colors">
                  Toyota Delivery Day Prep Checklist
                </Link>
              </li>
              <li>
                <Link href={`${baseUrl}/guides/rav4-se-mods`} className="hover:text-amber-500 transition-colors">
                  Toyota RAV4 Prime SE to XSE Mod Playbook
                </Link>
              </li>
              <li>
                <Link href={`${baseUrl}/guides/sienna-mods`} className="hover:text-amber-500 transition-colors">
                  Toyota Sienna Road Dog Mods
                </Link>
              </li>
              <li>
                <Link href={`${baseUrl}/guides/toyota-sienna-trailer-hitch-guide`} className="hover:text-amber-500 transition-colors">
                  Toyota Sienna Trailer Hitch &amp; Tow Guide
                </Link>
              </li>
              <li>
                <Link href={`${baseUrl}/guides/grand-highlander-mods`} className="hover:text-amber-500 transition-colors">
                  Toyota Grand Highlander Utility Mods
                </Link>
              </li>
              <li>
                <Link href={`${baseUrl}/guides/land-cruiser-mods`} className="hover:text-amber-500 transition-colors">
                  Toyota Land Cruiser 250 Mods
                </Link>
              </li>
              <li>
                <Link href={`${baseUrl}/guides/ev-charging`} className="hover:text-amber-500 transition-colors">
                  Toyota Level 2 EV &amp; PHEV Charging
                </Link>
              </li>
              <li>
                <Link href={`${baseUrl}/privacy`} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-amber-500 transition-colors pt-1">
                  <Shield className="h-3.5 w-3.5 text-zinc-400" />
                  Zero-PII Privacy Charter
                </Link>
              </li>
              <li>
                <Link href={`${baseUrl}/legal`} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-amber-500 transition-colors">
                  <Scale className="h-3.5 w-3.5 text-zinc-400" />
                  Legal &amp; Pricing Disclosures
                </Link>
              </li>
              <li>
                <a href={`${baseUrl}/sitemap.xml`} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-amber-500 transition-colors">
                  <Globe className="h-3.5 w-3.5 text-zinc-400" />
                  Sitemap
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@toyotawaits.ca?subject=ToyotaWaits%20Feedback%20%2F%20Inquiry"
                  className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-amber-500 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 text-zinc-400" />
                  Contact &amp; Feedback
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Canadian Toyota Model Trackers Directory */}
        <ModelDirectory />

        {/* Ko-fi Community Callout Card */}
        <div className="mb-8">
          <KofiCalloutCard />
        </div>

        {/* Disclaimer & Disclosure Section */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 text-xs text-zinc-500 space-y-3">
          <p className="leading-relaxed">
            <strong>Nominative Fair Use Disclaimer:</strong> {isUs ? 'toyotawaits.com' : 'toyotawaits.ca'} is an independent community tracker and is not affiliated with, endorsed by, or sponsored by Toyota Motor Corporation or {isUs ? 'Toyota Motor Sales, U.S.A., Inc.' : 'Toyota Canada Inc.'} All trademarks, service marks, and trade names are the property of their respective owners and are used strictly for identification purposes under nominative fair use. For complete details, see our{' '}
            <Link href="/legal" className="underline hover:text-amber-500">
              Legal Terms &amp; Consumer Pricing Disclosures
            </Link>.
          </p>
          <p className="leading-relaxed">
            <strong>Regulatory &amp; Affiliate Notice:</strong> {isUs ? 'toyotawaits.com' : 'toyotawaits.ca'} participates in affiliate programs, including the Amazon Associates Program. As an Amazon Associate, we may earn commissions from qualifying purchases made through links on this site at no additional cost to you.
          </p>
          <p className="leading-relaxed">
            <strong>Monetization Disclosure:</strong> {isUs ? 'ToyotaWaits.com' : 'ToyotaWaits.ca'} is community-supported and ad-free.
            We do not accept paid dealer promotions or sponsored wait-time modifications.
          </p>

          {/* Independence / Non-Dealership Community Disclaimer Note */}
          <div className="rounded-lg border border-zinc-200/80 bg-zinc-100/60 dark:border-zinc-800/80 dark:bg-zinc-900/60 p-3.5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <p data-testid="community-disclaimer">
              ToyotaWaits is an independent, community-driven tracker and is not affiliated with Toyota Motor Corporation. We cannot look up individual factory orders. For data corrections, dealer inventory tips, press inquiries, or bug reports, email{' '}
              <a
                href="mailto:hello@toyotawaits.ca?subject=ToyotaWaits%20Feedback%20%2F%20Inquiry"
                className="underline font-medium text-zinc-800 dark:text-zinc-200 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
              >
                hello@toyotawaits.ca
              </a>.
            </p>
          </div>

          {/* Global Footer Quick Navigation & Community Contact */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
            <Link
              href={`${baseUrl}/privacy`}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              Privacy
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <Link
              href={`${baseUrl}/legal`}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              Legal
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <a
              href={`${baseUrl}/sitemap.xml`}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              Sitemap
            </a>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <a
              href="mailto:hello@toyotawaits.ca?subject=ToyotaWaits%20Feedback%20%2F%20Inquiry"
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              Contact &amp; Feedback
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-2 text-[11px] text-zinc-400 gap-3 border-t border-zinc-200/60 dark:border-zinc-800/60">
            <span>© 2026 {isUs ? 'ToyotaWaits.com. U.S. Community Data Initiative.' : 'ToyotaWaits.ca. Canadian Community Data Initiative.'}</span>
            <div className="flex flex-wrap items-center gap-3 mt-2 sm:mt-0">
              <a
                href="https://ko-fi.com/toyotawaits"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
              >
                ☕ Support this tracker
              </a>
              <span className="flex items-center gap-1">
                Built with <Heart className="h-3 w-3 text-red-600 fill-current" /> for {isUs ? 'American' : 'Canadian'} automotive buyers
              </span>
            </div>
          </div>
        </div>

        {/* Amazon Associates / Community Transparency Disclosure */}
        <p className="text-[11px] text-neutral-500 max-w-xl mx-auto text-center leading-relaxed mt-8 pt-6 border-t border-neutral-800/60">
          Some links on this page are affiliate links. If you purchase through them, we may earn a small commission at no additional cost to you, which directly funds hosting, database infrastructure, and keeping this tracker open and ad-free. As an Amazon Associate I earn from qualifying purchases.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
