'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Clock,
  PlusCircle,
  FileSpreadsheet,
  BarChart3,
  Menu,
  X,
  Car,
  Wrench,
  ShoppingBag,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  ClipboardCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopModsOpen, setDesktopModsOpen] = useState(false);
  const [desktopGearOpen, setDesktopGearOpen] = useState(false);
  const pathname = usePathname();

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setMobileMenuOpen(false);
    if (pathname === '/') {
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (typeof window !== 'undefined') {
          window.history.pushState(null, '', `/#${targetId}`);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 font-bold text-lg tracking-tight group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-amber-600 text-white shadow-sm group-hover:scale-105 transition-transform">
            <Car className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="flex items-center text-zinc-900 dark:text-zinc-50 font-black">
              ToyotaWaits<span className="text-amber-500">.ca</span>
              <span className="ml-1.5 rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 text-[10px] font-semibold text-amber-500 dark:text-amber-400">
                🇨🇦 Canada
              </span>
            </span>
            <span className="text-[10px] font-medium text-zinc-500 italic truncate max-w-[240px] sm:max-w-none">
              &ldquo;The piano has been drinking, and your Toyota is still on a boat.&rdquo;
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          <Link
            href="/#estimator"
            onClick={(e) => handleAnchorClick(e, 'estimator')}
            className="hover:text-amber-500 transition-colors flex items-center gap-1.5"
          >
            <Clock className="h-4 w-4 text-zinc-400" />
            Wait Estimator
          </Link>

          <Link
            href="/#analytics"
            onClick={(e) => handleAnchorClick(e, 'analytics')}
            className="hover:text-amber-500 transition-colors flex items-center gap-1.5"
          >
            <BarChart3 className="h-4 w-4 text-zinc-400" />
            Analytics
          </Link>

          {/* Desktop Mod Guides Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDesktopModsOpen(true)}
            onMouseLeave={() => setDesktopModsOpen(false)}
          >
            <Link
              href="/guides"
              className="hover:text-amber-500 transition-colors flex items-center gap-1.5 py-1"
            >
              <Wrench className="h-4 w-4 text-zinc-400" />
              Mod Guides
              <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
            </Link>
            {desktopModsOpen && (
              <div className="absolute top-full left-0 w-72 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 shadow-xl z-50">
                <Link
                  href="/guides/rav4-se-mods"
                  onClick={() => setDesktopModsOpen(false)}
                  className="block p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">RAV4 Prime: SE → XSE</p>
                  <p className="text-[11px] text-zinc-500">Dash speakers, leather &amp; skip wait</p>
                </Link>
                <Link
                  href="/guides/sienna-mods"
                  onClick={() => setDesktopModsOpen(false)}
                  className="block p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Sienna: Road-Trip Mods</p>
                  <p className="text-[11px] text-zinc-500">Air Lift springs, bridge tray &amp; LEDs</p>
                </Link>
                <Link
                  href="/guides/grand-highlander-mods"
                  onClick={() => setDesktopModsOpen(false)}
                  className="block p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Grand Highlander Upgrades</p>
                  <p className="text-[11px] text-zinc-500">Cargo lamps &amp; wireless charger mat</p>
                </Link>
                <Link
                  href="/guides/land-cruiser-mods"
                  onClick={() => setDesktopModsOpen(false)}
                  className="block p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Land Cruiser 250 (1958)</p>
                  <p className="text-[11px] text-zinc-500">Audio overhaul &amp; rock sliders</p>
                </Link>
                <Link
                  href="/guides/prius-mods"
                  onClick={() => setDesktopModsOpen(false)}
                  className="block p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Toyota Prius &amp; Prime</p>
                  <p className="text-[11px] text-zinc-500">OEM mirror dashcam, mud flaps &amp; floor liners</p>
                </Link>
                <div className="pt-1 mt-1 border-t border-zinc-100 dark:border-zinc-800">
                  <Link
                    href="/guides"
                    onClick={() => setDesktopModsOpen(false)}
                    className="block p-1.5 text-center text-xs font-semibold text-amber-500 hover:underline"
                  >
                    View All Guides &amp; Almanac →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Gear & Products Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDesktopGearOpen(true)}
            onMouseLeave={() => setDesktopGearOpen(false)}
          >
            <Link
              href="/#delivery-prep"
              onClick={(e) => handleAnchorClick(e, 'delivery-prep')}
              className="hover:text-amber-500 transition-colors flex items-center gap-1.5 py-1"
            >
              <ShoppingBag className="h-4 w-4 text-zinc-400" />
              Gear &amp; Prep
              <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
            </Link>
            {desktopGearOpen && (
              <div className="absolute top-full left-0 w-80 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 shadow-xl z-50">
                <Link
                  href="/#delivery-prep"
                  onClick={(e) => {
                    setDesktopGearOpen(false);
                    handleAnchorClick(e, 'delivery-prep');
                  }}
                  className="block p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 transition-colors mb-1"
                >
                  <p className="text-xs font-bold text-amber-500">Delivery Day Prep Checklist</p>
                  <p className="text-[11px] text-zinc-400">Interactive visual checklist &amp; pricing</p>
                </Link>
                <a
                  href="/out/fitcamx-rav4"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setDesktopGearOpen(false)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  <div>
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">FitcamX 4K Dashcam</p>
                    <p className="text-[11px] text-zinc-500">OEM mirror tap • ~$210 CAD</p>
                  </div>
                  <ExternalLink className="h-3 w-3 text-zinc-400" />
                </a>
                <a
                  href="/out/noco-gb40-jump-pack"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setDesktopGearOpen(false)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  <div>
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">NOCO Boost GB40 Jump Pack</p>
                    <p className="text-[11px] text-zinc-500">12V lithium rescue • ~$135 CAD</p>
                  </div>
                  <ExternalLink className="h-3 w-3 text-zinc-400" />
                </a>
                <a
                  href="/out/screen-protector-rav4"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setDesktopGearOpen(false)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  <div>
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Matte 9H Screen Protector</p>
                    <p className="text-[11px] text-zinc-500">Anti-glare tempered • ~$24 CAD</p>
                  </div>
                  <ExternalLink className="h-3 w-3 text-zinc-400" />
                </a>
                <a
                  href="/out/console-tray-rav4"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setDesktopGearOpen(false)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  <div>
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Console Organizer Tray</p>
                    <p className="text-[11px] text-zinc-500">Dual-tier storage • ~$22 CAD</p>
                  </div>
                  <ExternalLink className="h-3 w-3 text-zinc-400" />
                </a>
              </div>
            )}
          </div>

          <Link href="/api/export" className="hover:text-amber-500 transition-colors flex items-center gap-1.5">
            <FileSpreadsheet className="h-4 w-4 text-zinc-400" />
            Export CSV
          </Link>
        </nav>

        {/* Action Button */}
        <div className="hidden sm:flex items-center space-x-3">
          <Button asChild size="sm" className="gap-1.5 font-bold bg-amber-500 hover:bg-amber-600 text-zinc-950 shadow-sm border border-amber-400/40">
            <Link href="/submit">
              <PlusCircle className="h-4 w-4 text-zinc-950" />
              Submit Wait Time
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-lg focus:outline-none"
            aria-label="Toggle menu"
            data-testid="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          data-testid="mobile-menu-drawer"
          className="lg:hidden border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-4 py-5 shadow-2xl animate-in slide-in-from-top-2 max-h-[calc(100vh-4.5rem)] overflow-y-auto"
        >
          <div className="flex flex-col space-y-6 pb-4">
            {/* 1. Core Wait-Time Trackers */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-1">
                Wait-Time Tracking
              </span>
              <div className="grid grid-cols-1 gap-1">
                <Link
                  href="/#estimator"
                  onClick={(e) => handleAnchorClick(e, 'estimator')}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-red-600 dark:text-red-400">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
                        Wait-Time Estimator
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        Arrival window &amp; delivery estimates
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/#analytics"
                  onClick={(e) => handleAnchorClick(e, 'analytics')}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <BarChart3 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
                        Provincial Analytics
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        Quebec &amp; BC allocation trends
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </div>
            </div>

            {/* 2. DIY Mod Guides (Mods Section) */}
            <div className="space-y-1.5 pt-2 border-t border-zinc-200 dark:border-zinc-800/80">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                  <Wrench className="h-3 w-3 text-amber-500" />
                  DIY Mod Guides
                </span>
                <Link
                  href="/guides"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[11px] font-semibold text-amber-500 hover:underline"
                >
                  View All Guides →
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-1">
                <Link
                  href="/guides/rav4-se-mods"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-amber-500 dark:text-amber-400">RAV4 Prime</span>
                      <span className="text-xs text-zinc-400">•</span>
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
                        SE to XSE DIY Upgrades
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      JBL dash speakers, tailored leather &amp; skip 12-mo wait
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>

                <Link
                  href="/guides/sienna-mods"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-amber-500 dark:text-amber-400">Toyota Sienna</span>
                      <span className="text-xs text-zinc-400">•</span>
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
                        Road-Trip &amp; Family Mods
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      Air Lift 1000 springs, bridge tray &amp; hatch LEDs
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>

                <Link
                  href="/guides/grand-highlander-mods"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-amber-500 dark:text-amber-400">Grand Highlander</span>
                      <span className="text-xs text-zinc-400">•</span>
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
                        Cabin &amp; Utility Mods
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      OEM hatch lighting, anti-slip charging mat
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>

                <Link
                  href="/guides/land-cruiser-mods"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-amber-500 dark:text-amber-400">Land Cruiser 250</span>
                      <span className="text-xs text-zinc-400">•</span>
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
                        1958 Trim Overhaul
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      Speaker upgrades, rock sliders &amp; winter armor
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>

                <Link
                  href="/guides/prius-mods"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-amber-500 dark:text-amber-400">Toyota Prius &amp; Prime</span>
                      <span className="text-xs text-zinc-400">•</span>
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
                        Gen 5 Essentials
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      OEM mirror dashcam, mud flaps &amp; winter floor liners
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              </div>
            </div>

            {/* 3. Delivery Prep & Recommended Product Links */}
            <div className="space-y-1.5 pt-2 border-t border-zinc-200 dark:border-zinc-800/80">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                  <ShoppingBag className="h-3 w-3 text-amber-500" />
                  Gear &amp; Product Links
                </span>
                <span className="text-[10px] text-zinc-500">Amazon.ca</span>
              </div>

              {/* In-page Delivery Checklist Jump */}
              <Link
                href="/#delivery-prep"
                onClick={(e) => handleAnchorClick(e, 'delivery-prep')}
                className="flex items-center justify-between p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <ClipboardCheck className="h-4 w-4 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-amber-500 dark:text-amber-400">
                      Delivery Day Prep Checklist
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Interactive cards with price estimates &amp; checkboxes
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-amber-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </Link>

              {/* Direct Curated Product Links via /out/[slug] */}
              <div className="grid grid-cols-1 gap-1 pt-1">
                <a
                  href="/out/fitcamx-rav4"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-200 group-hover:text-amber-500">
                      FitcamX 4K Integrated Dashcam
                    </span>
                    <span className="text-[10px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      ~$210 CAD
                    </span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-400 group-hover:text-amber-500 shrink-0" />
                </a>

                <a
                  href="/out/noco-gb40-jump-pack"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-200 group-hover:text-amber-500">
                      NOCO Boost GB40 Jump Starter
                    </span>
                    <span className="text-[10px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      ~$135 CAD
                    </span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-400 group-hover:text-amber-500 shrink-0" />
                </a>

                <a
                  href="/out/screen-protector-rav4"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-200 group-hover:text-amber-500">
                      Matte 9H Tempered Glass Screen Protector
                    </span>
                    <span className="text-[10px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      ~$24 CAD
                    </span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-400 group-hover:text-amber-500 shrink-0" />
                </a>

                <a
                  href="/out/console-tray-rav4"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-200 group-hover:text-amber-500">
                      Center Console Organizer Tray
                    </span>
                    <span className="text-[10px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      ~$22 CAD
                    </span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-400 group-hover:text-amber-500 shrink-0" />
                </a>

                <a
                  href="/out/j1772-charger-lock"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-200 group-hover:text-amber-500">
                      J1772 Charger Port Lock Ring (PHEV)
                    </span>
                    <span className="text-[10px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      ~$19 CAD
                    </span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-400 group-hover:text-amber-500 shrink-0" />
                </a>
              </div>
            </div>

            {/* 4. Community Action & Open Data */}
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80 space-y-2">
              <Button asChild className="w-full gap-2 font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950">
                <Link href="/submit" onClick={() => setMobileMenuOpen(false)}>
                  <PlusCircle className="h-4 w-4" />
                  Submit Wait Time (Anonymous)
                </Link>
              </Button>

              <Link
                href="/api/export"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 py-1"
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                Export Community Data (RFC 4180 CSV)
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
