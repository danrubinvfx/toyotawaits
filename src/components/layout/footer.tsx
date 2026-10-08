import React from 'react';
import Link from 'next/link';
import { Shield, Lock, FileSpreadsheet, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 py-12 text-zinc-600 dark:text-zinc-400">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2 font-bold text-base text-zinc-900 dark:text-zinc-100">
              <span>ToyotaWaits.ca</span>
              <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700 dark:bg-red-950 dark:text-red-400">
                Canadian Open Data
              </span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-md">
              Crowdsourced Canadian vehicle delivery tracker for RAV4 HEV/PHEV, Sienna, Grand Highlander,
              and Land Cruiser. Helping Canadian car buyers cut through allocation opacity.
            </p>
            <div className="flex items-center space-x-2 text-xs text-zinc-500">
              <Lock className="h-3.5 w-3.5 text-emerald-600" />
              <span>Strict Zero-PII Policy: Zero names, emails, VINs, or IPs stored.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#estimator" className="hover:text-amber-500 transition-colors">
                  Wait-Time Estimator
                </Link>
              </li>
              <li>
                <Link href="/#analytics" className="hover:text-amber-500 transition-colors">
                  Provincial Analytics
                </Link>
              </li>
              <li>
                <Link href="/submit" className="hover:text-amber-500 transition-colors">
                  Submit Wait Time
                </Link>
              </li>
              <li>
                <Link href="/api/export" className="hover:text-amber-500 transition-colors">
                  Download CSV Data
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
                <Link href="/guides" className="text-amber-500 font-semibold hover:underline">
                  All Mod Guides &amp; Almanac →
                </Link>
              </li>
              <li>
                <Link href="/#delivery-prep" className="hover:text-amber-500 transition-colors">
                  Delivery Prep Checklist
                </Link>
              </li>
              <li>
                <Link href="/guides/rav4-se-mods" className="hover:text-amber-500 transition-colors">
                  RAV4 SE Mod Playbook
                </Link>
              </li>
              <li>
                <Link href="/guides/sienna-mods" className="hover:text-amber-500 transition-colors">
                  Sienna Road Dog Mods
                </Link>
              </li>
              <li>
                <Link href="/guides/grand-highlander-mods" className="hover:text-amber-500 transition-colors">
                  Grand Highlander Utility
                </Link>
              </li>
              <li>
                <Link href="/guides/land-cruiser-mods" className="hover:text-amber-500 transition-colors">
                  Land Cruiser 250 Mods
                </Link>
              </li>
              <li>
                <Link href="/guides/ev-charging" className="hover:text-amber-500 transition-colors">
                  Level 2 EV Charging
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-amber-500 transition-colors pt-1">
                  <Shield className="h-3.5 w-3.5 text-zinc-400" />
                  Zero-PII Privacy Charter
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Disclosure Section */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 text-xs text-zinc-500 space-y-3">
          <p className="leading-relaxed">
            <strong>Legal Disclaimer:</strong> ToyotaWaits.ca is an independent community-driven initiative and is not
            affiliated, associated, authorized, endorsed by, or in any way officially connected with Toyota Motor
            Corporation, Toyota Canada Inc., or any of their subsidiaries or affiliates. All vehicle model names, logos,
            and brands are property of their respective owners.
          </p>
          <p className="leading-relaxed">
            <strong>Monetization & Affiliate Disclosure:</strong> ToyotaWaits.ca is community-supported. When you purchase
            accessories through curated links on this site, we may earn an affiliate commission at no additional cost to you.
            We do not accept paid dealer promotions or sponsored wait-time modifications.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-2 text-[11px] text-zinc-400">
            <span>© 2026 ToyotaWaits.ca. Canadian Community Data Initiative.</span>
            <span className="flex items-center gap-1 mt-2 sm:mt-0">
              Built with <Heart className="h-3 w-3 text-red-600 fill-current" /> for Canadian automotive buyers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
