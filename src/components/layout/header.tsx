'use client';

import React, { useState, useEffect } from 'react';
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
  Snowflake,
  Disc3,
  CheckCircle2,
} from 'lucide-react';
import { KofiHeaderPill } from '@/components/common/kofi-button';
import { cn } from '@/lib/utils';

interface HeaderSubmission {
  id: string;
  editKey?: string;
  edit_key?: string;
  editToken?: string;
  model?: string;
  status?: string;
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopModsOpen, setDesktopModsOpen] = useState(false);
  const [desktopGearOpen, setDesktopGearOpen] = useState(false);
  const [submission, setSubmission] = useState<HeaderSubmission | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const loadSubmission = () => {
      try {
        const raw = localStorage.getItem('toyotawaits_submission');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && (parsed.id || parsed.editToken)) {
            setSubmission(parsed);
            return;
          }
        }
        const pendingRaw = localStorage.getItem('toyotawait_pending_submission');
        if (pendingRaw) {
          const parsed = JSON.parse(pendingRaw);
          if (parsed && (parsed.id || parsed.editToken)) {
            setSubmission(parsed);
            return;
          }
        }
        const mySubs = localStorage.getItem('toyotawait_my_submissions');
        if (mySubs) {
          const parsedList = JSON.parse(mySubs);
          if (Array.isArray(parsedList) && parsedList.length > 0) {
            setSubmission(parsedList[0]);
            return;
          }
        }
        setSubmission(null);
      } catch {
        // SSR / localStorage disabled fallback
      }
    };

    loadSubmission();

    if (typeof window !== 'undefined') {
      window.addEventListener('toyotawaits:submission-updated', loadSubmission);
      window.addEventListener('storage', loadSubmission);
      return () => {
        window.removeEventListener('toyotawaits:submission-updated', loadSubmission);
        window.removeEventListener('storage', loadSubmission);
      };
    }
  }, []);

  const editHref = submission
    ? `/edit/${submission.id || submission.editToken}?key=${encodeURIComponent(
        submission.editKey || submission.edit_key || ''
      )}`
    : '/submit';

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setMobileMenuOpen(false);
    if (targetId === 'checklist' && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('toyotawait:open-checklist'));
    }
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
    <header className="sticky top-0 z-40 w-full max-w-full overflow-x-hidden lg:overflow-visible border-b border-zinc-200 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="container mx-auto max-w-6xl w-full max-w-full overflow-x-hidden lg:overflow-visible px-3 sm:px-4 py-2.5 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 min-w-0 shrink font-bold text-lg tracking-tight group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-amber-600 text-white shadow-sm group-hover:scale-105 transition-transform shrink-0">
            <Car className="h-5 w-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="flex items-center text-zinc-900 dark:text-zinc-50 font-black truncate text-base sm:text-lg">
              ToyotaWaits<span className="text-amber-500">.ca</span>
              <span className="ml-1.5 hidden xs:inline-flex rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 text-[10px] font-semibold text-amber-500 dark:text-amber-400 shrink-0">
                🇨🇦 Canada
              </span>
            </span>
            <span className="text-[10px] font-medium text-zinc-500 italic truncate max-w-[240px] sm:max-w-none hidden sm:block">
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

          {/* Winter Prep Desktop Link */}
          <Link
            href="/winter-prep"
            className={cn(
              'hover:text-cyan-400 transition-colors flex items-center gap-1.5 py-1',
              pathname === '/winter-prep'
                ? 'text-cyan-400 font-bold'
                : 'text-zinc-600 dark:text-zinc-300'
            )}
          >
            <Snowflake className="h-4 w-4 text-cyan-400" />
            <span>Winter Prep ❄️</span>
          </Link>

          {/* Tire Guide Desktop Link */}
          <Link
            href="/tires"
            className={cn(
              'hover:text-amber-500 transition-colors flex items-center gap-1.5 py-1',
              pathname === '/tires'
                ? 'text-amber-500 font-bold'
                : 'text-zinc-600 dark:text-zinc-300'
            )}
          >
            <Disc3 className="h-4 w-4 text-zinc-400" />
            <span>Tires 🛞</span>
          </Link>

          {/* Pickup Checklist Desktop Link */}
          <Link
            href="/#checklist"
            onClick={(e) => handleAnchorClick(e, 'checklist')}
            className="hover:text-amber-500 transition-colors flex items-center gap-1.5"
          >
            <ClipboardCheck className="h-4 w-4 text-zinc-400" />
            Pickup Checklist
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
              href="/#gear"
              onClick={(e) => handleAnchorClick(e, 'gear')}
              className="hover:text-amber-500 transition-colors flex items-center gap-1.5 py-1"
            >
              <ShoppingBag className="h-4 w-4 text-zinc-400" />
              Gear &amp; Prep
              <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
            </Link>
            {desktopGearOpen && (
              <div className="absolute top-full left-0 w-80 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 shadow-xl z-50">
                <Link
                  href="/#checklist"
                  onClick={(e) => {
                    setDesktopGearOpen(false);
                    handleAnchorClick(e, 'checklist');
                  }}
                  className="block p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 transition-colors mb-1"
                >
                  <p className="text-xs font-bold text-amber-500">📋 Pickup Day Checklist</p>
                  <p className="text-[11px] text-zinc-400">PDI inspection, bill of sale &amp; key fobs</p>
                </Link>
                <Link
                  href="/#gear"
                  onClick={(e) => {
                    setDesktopGearOpen(false);
                    handleAnchorClick(e, 'gear');
                  }}
                  className="block p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors mb-1"
                >
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Delivery Day Prep Gear</p>
                  <p className="text-[11px] text-zinc-400">Curated accessories &amp; drop-in armor</p>
                </Link>
                <a
                  href="/out/fitcamx-rav4"
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  onClick={() => setDesktopGearOpen(false)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  <div>
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">FitcamX 4K Dashcam</p>
                    <p className="text-[11px] text-zinc-500">OEM mirror tap • Saves ~$350+ vs dealer</p>
                  </div>
                  <ExternalLink className="h-3 w-3 text-zinc-400" />
                </a>
                <a
                  href="/out/noco-gb40-jump-pack"
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  onClick={() => setDesktopGearOpen(false)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  <div>
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">NOCO Boost GB40 Jump Pack</p>
                    <p className="text-[11px] text-zinc-500">12V lithium rescue • Essential Roadside</p>
                  </div>
                  <ExternalLink className="h-3 w-3 text-zinc-400" />
                </a>
                <a
                  href="/out/screen-protector-rav4"
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  onClick={() => setDesktopGearOpen(false)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  <div>
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Matte 9H Screen Protector</p>
                    <p className="text-[11px] text-zinc-500">Anti-glare tempered • Scratch Shield</p>
                  </div>
                  <ExternalLink className="h-3 w-3 text-zinc-400" />
                </a>
                <a
                  href="/out/console-tray-rav4"
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  onClick={() => setDesktopGearOpen(false)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  <div>
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Console Organizer Tray</p>
                    <p className="text-[11px] text-zinc-500">Dual-tier storage • Laser Fit</p>
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

        {/* Action Button & Ko-fi Support */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <div className="hidden sm:block shrink-0">
            <KofiHeaderPill />
          </div>
          {submission ? (
            <Link
              href={editHref}
              className="shrink-0 whitespace-nowrap text-xs font-semibold px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-black shrink-0" />
              <span className="hidden xs:inline">Update Status</span>
              <span className="xs:hidden">Status</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-700 ring-1 ring-black shrink-0" />
            </Link>
          ) : (
            <Link
              href="/submit"
              className="shrink-0 whitespace-nowrap text-xs font-semibold px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-black shrink-0" />
              <span className="hidden xs:inline">+ Log Order</span>
              <span className="xs:hidden">+ Order</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white rounded-lg focus:outline-none lg:hidden shrink-0"
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

                {/* Winter Prep Guide */}
                <Link
                  href="/winter-prep"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center justify-between p-2.5 rounded-lg transition-colors group',
                    pathname === '/winter-prep'
                      ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-bold'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-cyan-100 dark:bg-cyan-950/60 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                      <Snowflake className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-cyan-400 transition-colors">
                        Winter Prep Guide ❄️
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        Sub-zero 12V jumps, salt liners &amp; frost shields
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </Link>

                {/* Tire Guide */}
                <Link
                  href="/tires"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center justify-between p-2.5 rounded-lg transition-colors group',
                    pathname === '/tires'
                      ? 'bg-amber-500/15 border border-amber-500/30 text-amber-500 font-bold'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <Disc3 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
                        Tire Guide &amp; Reviews 🛞
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        OEM sizes, 3PMSF winter rubber &amp; wheel downsizing
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
                </Link>

                {/* Dealership Pickup Checklist */}
                <Link
                  href="/#checklist"
                  onClick={(e) => handleAnchorClick(e, 'checklist')}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <ClipboardCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
                        Pickup Checklist
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        Bill of sale, key fobs &amp; PDI spacer inspection
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
                href="/#gear"
                onClick={(e) => handleAnchorClick(e, 'gear')}
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
                  rel="noopener noreferrer nofollow sponsored"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-200 group-hover:text-amber-500">
                      FitcamX 4K Integrated Dashcam
                    </span>
                    <span className="text-[10px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      Saves ~$350+ vs dealer
                    </span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-400 group-hover:text-amber-500 shrink-0" />
                </a>

                <a
                  href="/out/noco-gb40-jump-pack"
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-200 group-hover:text-amber-500">
                      NOCO Boost GB40 Jump Starter
                    </span>
                    <span className="text-[10px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      Essential Roadside
                    </span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-400 group-hover:text-amber-500 shrink-0" />
                </a>

                <a
                  href="/out/screen-protector-rav4"
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-200 group-hover:text-amber-500">
                      Matte 9H Tempered Glass Screen Protector
                    </span>
                    <span className="text-[10px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      Scratch Shield
                    </span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-400 group-hover:text-amber-500 shrink-0" />
                </a>

                <a
                  href="/out/console-tray-rav4"
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-200 group-hover:text-amber-500">
                      Center Console Organizer Tray
                    </span>
                    <span className="text-[10px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      Laser Fit
                    </span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-400 group-hover:text-amber-500 shrink-0" />
                </a>

                <a
                  href="/out/j1772-charger-lock"
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-200 group-hover:text-amber-500">
                      J1772 Charger Port Lock Ring (PHEV)
                    </span>
                    <span className="text-[10px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      Anti-Theft Lock
                    </span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-400 group-hover:text-amber-500 shrink-0" />
                </a>
              </div>
            </div>

            {/* 4. Community Action & Open Data */}
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80 space-y-2">
              {submission ? (
                <div className="space-y-2">
                  <Link
                    href={editHref}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full bg-amber-500 text-black font-bold px-3.5 py-2.5 rounded-xl text-sm hover:bg-amber-400 transition-all shadow-sm ring-1 ring-amber-400/50 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4 text-black shrink-0" />
                    <span>Update Status {submission.model ? `(${submission.model})` : ''}</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-700 ring-1 ring-black shrink-0" />
                  </Link>
                  <Link
                    href="/submit"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 hover:text-amber-500 dark:text-zinc-400 dark:hover:text-amber-400 py-1 font-medium transition-colors"
                  >
                    + Log another vehicle
                  </Link>
                </div>
              ) : (
                <Link
                  href="/submit"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-amber-500 text-black font-bold px-3.5 py-2.5 rounded-xl text-sm hover:bg-amber-400 transition-all shadow-sm ring-1 ring-amber-400/50 flex items-center justify-center gap-2"
                >
                  <PlusCircle className="h-4 w-4 text-black shrink-0" />
                  <span>+ Log Order (Anonymous)</span>
                </Link>
              )}

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
