'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Clock, Ship, Package, Calculator, BookOpen, X, Check, Copy, Tag, ExternalLink } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { useCalculatorContext } from '@/context/CalculatorContext';
import { buildAmazonAffiliateUrl, getModelDisplayName } from '@/lib/gear/affiliate';
import { GearImage } from '@/components/gear/GearImage';
import { resolveVerifiedGearImageSrc } from '@/data/gear/catalog';

export interface MobileGearItem {
  id: string;
  title: string;
  brand?: string;
  priceText?: string;
  description: string;
  destinationType: 'amazon' | 'direct_partner';
  partnerUrl?: string;
  searchQuery: string;
  discountCode?: string;
  discountText?: string;
  imageUrl?: string;
  fallbackIcon?: string;
  badge?: string;
}

export function getCuratedMobileGear(modelSlug: string, market: 'CA' | 'US'): MobileGearItem[] {
  const isUs = market === 'US';
  const clean = modelSlug.toLowerCase().trim();

  if (clean === 'rav4' || clean.includes('rav4')) {
    return [
      {
        id: 'muslogy-rav4-organizer',
        title: 'Muslogy Center Console Organizer Tray (RAV4)',
        brand: 'Muslogy',
        priceText: '$24 – $28 CAD',
        description: 'Drop-in multi-tier center console armrest divider tray with anti-slip silicone coin pads.',
        destinationType: 'direct_partner',
        partnerUrl: '/out/muslogy-rav4',
        searchQuery: 'Muslogy center console organizer tray Toyota RAV4',
        discountCode: 'Toyotawaits',
        discountText: '2% OFF',
        badge: 'Partner Deal · 2% Off',
        imageUrl: '/assets/gear/muslogy-rav4-organizer.webp',
        fallbackIcon: 'layout-grid',
      },
      {
        id: 'fitcamx-rav4',
        title: 'FitcamX OEM 4K Integrated Dashcam',
        brand: 'FitcamX',
        priceText: '~$188 CAD',
        description: 'Discrete OEM look tapping into rearview mirror power with zero dangling cables.',
        destinationType: 'amazon',
        searchQuery: isUs ? 'Fitcamx dash cam Toyota RAV4 OEM 4K' : 'Fitcamx dash cam Toyota RAV4 OEM 4K',
        imageUrl: '/assets/gear/fitcamx-rav4.webp',
        fallbackIcon: 'camera',
      },
      {
        id: 'high-wall-floor-liners-rav4',
        title: 'TuxMat High-Wall TPE Floor Liners',
        brand: 'TuxMat',
        priceText: '~$270 CAD',
        description: 'Maximum high-wall laser-measured coverage containing snow, salt, mud, and water spills.',
        destinationType: 'amazon',
        searchQuery: isUs ? 'TuxMat Toyota RAV4 custom all weather floor mats' : 'TuxMat Toyota RAV4 custom all weather floor mats',
        imageUrl: '/assets/gear/tuxmat-rav4.webp',
        fallbackIcon: 'layers',
      },
      {
        id: 'ticonn-faraday-pouch-rav4',
        title: 'TICONN RFID Faraday Key Fob Pouch (2-Pack)',
        brand: 'TICONN',
        priceText: '~$15 CAD',
        description: 'Dual-layer RFID & BLE signal blocking pouches preventing keyless relay theft.',
        destinationType: 'amazon',
        searchQuery: 'TICONN Faraday bag key fob signal protector pouch',
        imageUrl: '/assets/gear/ticonn-faraday-pouch.webp',
        fallbackIcon: 'lock',
      },
    ];
  }

  if (clean === 'sienna' || clean.includes('sienna')) {
    return [
      {
        id: 'muslogy-sienna-organizer',
        title: 'Muslogy Sienna Console Sliding Tray & Bridge Box',
        brand: 'Muslogy',
        priceText: '$28 – $36 CAD',
        description: 'Custom-fit sliding upper tray and hidden lower bridge storage compartments for Toyota Sienna.',
        destinationType: 'direct_partner',
        partnerUrl: '/out/muslogy-sienna',
        searchQuery: 'Sienna center console organizer tray 2021-2026',
        discountCode: 'Toyotawaits',
        discountText: '2% OFF',
        badge: 'Partner Deal · 2% Off',
        imageUrl: '/assets/gear/muslogy-sienna-organizer.webp',
        fallbackIcon: 'layout-grid',
      },
      {
        id: 'sienna-all-weather-liners',
        title: '3-Row Custom All-Weather Floor Liners',
        brand: 'TuxMat / OEM Fit',
        priceText: '~$280 CAD',
        description: 'Maximized spill containment along sliding Super Long Slide tracks and cargo trunk well.',
        destinationType: 'amazon',
        searchQuery: 'Toyota Sienna all weather floor mats 2021-2026',
        imageUrl: '/assets/gear/tuxmat-sienna.webp',
        fallbackIcon: 'layers',
      },
      {
        id: 'fitcamx-sienna',
        title: 'FitcamX OEM 4K Integrated Dashcam (Sienna)',
        brand: 'FitcamX',
        priceText: '~$188 CAD',
        description: 'Factory-integrated mirror replacement dashcam drawing power directly from the TSS mirror harness.',
        destinationType: 'amazon',
        searchQuery: 'Fitcamx dash cam Toyota Sienna OEM 4K',
        imageUrl: '/assets/gear/fitcamx-rav4.webp',
        fallbackIcon: 'camera',
      },
      {
        id: 'muslogy-sienna-cargo-net',
        title: 'Muslogy Heavy-Duty Trunk Cargo Net (Sienna)',
        brand: 'Muslogy',
        priceText: '$26 – $34 CAD',
        description: 'Custom-fit elastic envelope trunk net securing groceries in the deep Sienna rear cargo well.',
        destinationType: 'direct_partner',
        partnerUrl: '/out/muslogy-sienna-cargo-net',
        searchQuery: 'Toyota Sienna trunk envelope cargo net',
        discountCode: 'Toyotawaits',
        discountText: '2% OFF',
        badge: 'Partner Deal · 2% Off',
        imageUrl: '/assets/gear/muslogy-sienna-cargo-net.webp',
        fallbackIcon: 'luggage',
      },
    ];
  }

  if (clean === 'grand-highlander' || clean.includes('grand-highlander') || clean.includes('grand highlander')) {
    return [
      {
        id: 'muslogy-grand-highlander-organizer',
        title: 'Muslogy Grand Highlander Console Divider Tray',
        brand: 'Muslogy',
        priceText: '$24 – $32 CAD',
        description: 'Direct-fit upper armrest storage box and console divider tray tailored for Grand Highlander.',
        destinationType: 'direct_partner',
        partnerUrl: '/out/muslogy-grand-highlander',
        searchQuery: 'Muslogy center console organizer Grand Highlander',
        discountCode: 'Toyotawaits',
        discountText: '2% OFF',
        badge: 'Partner Deal · 2% Off',
        imageUrl: '/assets/gear/muslogy-grand-highlander-organizer.webp',
        fallbackIcon: 'layout-grid',
      },
      {
        id: 'screen-protector-grand-highlander',
        title: '12.3" Anti-Glare Matte Screen Protector',
        brand: 'Spigen / Tempered Glass',
        priceText: '~$25 CAD',
        description: 'Prevents fingerprint oil buildup and eliminates harsh reflections across wide cabin glass.',
        destinationType: 'amazon',
        searchQuery: 'Grand Highlander 2024 2025 2026 12.3-inch screen protector tempered glass',
        imageUrl: '/assets/gear/screen-protector-12-3.webp',
        fallbackIcon: 'smartphone',
      },
      {
        id: 'fitcamx-grand-highlander',
        title: 'FitcamX TSS 3.0 Integrated 4K Dashcam',
        brand: 'FitcamX',
        priceText: '~$188 CAD',
        description: 'Custom molded mirror housing integrating 4K recording under the digital mirror bracket.',
        destinationType: 'amazon',
        searchQuery: 'Fitcamx dash cam Grand Highlander TSS 3.0',
        imageUrl: '/assets/gear/fitcamx-rav4.webp',
        fallbackIcon: 'camera',
      },
      {
        id: 'muslogy-grand-highlander-cargo-net',
        title: 'Muslogy Heavy-Duty Trunk Cargo Net (GH)',
        brand: 'Muslogy',
        priceText: '$26 – $34 CAD',
        description: 'Custom-fit envelope trunk cargo net securing groceries upright behind the 3rd row.',
        destinationType: 'direct_partner',
        partnerUrl: '/out/muslogy-grand-highlander-cargo-net',
        searchQuery: 'Grand Highlander trunk envelope cargo net',
        discountCode: 'Toyotawaits',
        discountText: '2% OFF',
        badge: 'Partner Deal · 2% Off',
        imageUrl: '/assets/gear/muslogy-grand-highlander-cargo-net.webp',
        fallbackIcon: 'luggage',
      },
    ];
  }

  // Universal Toyota Essentials Fallback
  return [
    {
      id: 'universal-faraday-pouches',
      title: 'TICONN RFID Faraday Key Fob Pouch (2-Pack)',
      brand: 'TICONN',
      priceText: '~$15 CAD',
      description: 'Dual-layer RFID & BLE signal blocking pouches preventing keyless relay attacks and key fob cloning.',
      destinationType: 'amazon',
      searchQuery: 'TICONN Faraday bag key fob signal protector pouch',
      imageUrl: '/assets/gear/ticonn-faraday-pouch.webp',
      fallbackIcon: 'lock',
    },
    {
      id: 'universal-tire-inflator',
      title: 'Compact Cordless 150 PSI Digital Tire Inflator',
      brand: 'AstroAI / Portable',
      priceText: '~$45 – $60 CAD',
      description: 'Rechargeable digital air pump with auto-shutoff for road trips and cold Canadian winter pressure checks.',
      destinationType: 'amazon',
      searchQuery: 'portable cordless tire inflator 150 psi',
      imageUrl: '/assets/gear/battery-jump-starter.webp',
      fallbackIcon: 'zap',
    },
    {
      id: 'universal-fast-charger',
      title: 'Fast 65W Dual USB-C Metal Car Charger',
      brand: 'Anker / Metal Flush',
      priceText: '~$25 CAD',
      description: 'Ultra-compact dual USB-C Power Delivery metal car adapter supporting rapid phone and laptop charging.',
      destinationType: 'amazon',
      searchQuery: '65W dual USB-C PD metal car charger flush fit',
      imageUrl: '/assets/gear/fast-usbc-pd-car-charger.webp',
      fallbackIcon: 'battery',
    },
    {
      id: 'universal-dashcam',
      title: 'FitcamX OEM Factory-Look 4K Dashcam',
      brand: 'FitcamX',
      priceText: '~$188 CAD',
      description: 'Clean factory OEM appearance tapping into rearview mirror power without dangling wires.',
      destinationType: 'amazon',
      searchQuery: 'Fitcamx dash cam Toyota OEM 4K',
      imageUrl: '/assets/gear/fitcamx-rav4.webp',
      fallbackIcon: 'camera',
    },
  ];
}

export interface MobileGearDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  modelSlug: string;
  modelName: string;
}

export function MobileGearDrawer({
  isOpen,
  onClose,
  modelSlug,
  modelName,
}: MobileGearDrawerProps) {
  const { market } = useMarket();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const gearItems = useMemo(
    () => getCuratedMobileGear(modelSlug, market || 'CA'),
    [modelSlug, market]
  );

  const handleCopyCode = useCallback((code: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 2200);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden" data-testid="mobile-gear-drawer-root">
      {/* Backdrop */}
      <div
        data-testid="mobile-gear-drawer-overlay"
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-Up Bottom Sheet */}
      <div
        data-testid="mobile-gear-drawer-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={`Delivery Day Prep: ${modelName || 'Toyota Essentials'}`}
        className="fixed bottom-0 inset-x-0 z-50 rounded-t-2xl bg-zinc-900 border-t border-zinc-800 p-4 max-h-[85vh] overflow-y-auto pb-safe shadow-2xl space-y-3.5"
      >
        {/* Pull Handle */}
        <div className="w-12 h-1.5 rounded-full bg-zinc-700 mx-auto" aria-hidden="true" />

        {/* Sheet Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Delivery Day Prep: {modelName || 'Toyota Essentials'}
            </h3>
            <p className="text-xs text-zinc-400">
              Curated day-one protection and partner deals
            </p>
          </div>
          <button
            type="button"
            data-testid="mobile-gear-drawer-close-btn"
            onClick={onClose}
            aria-label="Close gear drawer"
            className="rounded-full p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* 3–4 Curated Gear Cards */}
        <div className="space-y-3 pt-1">
          {gearItems.map((item) => {
            const isPartner = item.destinationType === 'direct_partner';
            const amazonUrl = buildAmazonAffiliateUrl(
              item.searchQuery,
              market || 'CA',
              market || 'CA'
            );
            const destinationUrl = isPartner && item.partnerUrl ? item.partnerUrl : amazonUrl;
            const isCodeCopied = copiedId === item.id;
            const imgSrc = resolveVerifiedGearImageSrc(item.imageUrl, undefined);

            return (
              <div
                key={item.id}
                data-testid={`mobile-gear-card-${item.id}`}
                className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 flex gap-3 items-start"
              >
                {/* Gear Image / Fallback */}
                <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 flex items-center justify-center">
                  <GearImage
                    src={imgSrc}
                    alt={item.title}
                    affiliateUrl={destinationUrl}
                    fallbackIcon={item.fallbackIcon || 'package'}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details & Actions */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-start justify-between gap-1.5">
                    <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">
                      {item.title}
                    </h4>
                    {item.priceText && (
                      <span className="text-[11px] font-semibold text-emerald-400 shrink-0">
                        {item.priceText}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-normal line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {isPartner && item.discountCode && (
                      <button
                        type="button"
                        data-testid={`copy-code-btn-${item.id}`}
                        onClick={() => handleCopyCode(item.discountCode!, item.id)}
                        className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-1 text-[11px] font-bold text-amber-400 hover:bg-amber-500/25 active:scale-95 transition cursor-pointer"
                      >
                        {isCodeCopied ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Tag className="h-3 w-3" />
                            <span>CODE: {item.discountCode} ({item.discountText || '2% OFF'})</span>
                          </>
                        )}
                      </button>
                    )}

                    <a
                      href={destinationUrl}
                      target="_blank"
                      rel="sponsored noopener noreferrer nofollow"
                      data-testid={`gear-cta-link-${item.id}`}
                      className="inline-flex items-center gap-1 rounded-md bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-2 py-1 text-[11px] font-semibold text-zinc-200 hover:text-white transition cursor-pointer"
                    >
                      <span>{isPartner ? 'Muslogy Deal ↗' : 'Check on Amazon ↗'}</span>
                      <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function MobileBottomDock() {
  const pathname = usePathname() || '';
  const searchParams = useSearchParams();
  const calcContext = useCalculatorContext();
  const [isGearDrawerOpen, setIsGearDrawerOpen] = useState(false);
  const [eventModel, setEventModel] = useState<string | null>(null);

  // Listen to custom model selection events dispatched across pages
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleModelChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ model?: string; slug?: string }>;
      const next = customEvent.detail?.model || customEvent.detail?.slug;
      if (next) {
        setEventModel(next);
      }
    };

    window.addEventListener('toyotawait:model-change', handleModelChange as EventListener);
    return () => {
      window.removeEventListener('toyotawait:model-change', handleModelChange as EventListener);
    };
  }, []);

  // Resolve active vehicle context from URL, Context, Pathname, or Event
  const { activeModelSlug, activeModelName } = useMemo(() => {
    // 1. URL search param e.g. ?model=rav4
    const urlModel = searchParams?.get('model');
    if (urlModel) {
      const clean = urlModel.toLowerCase().trim();
      return {
        activeModelSlug: clean,
        activeModelName: getModelDisplayName(clean),
      };
    }

    // 2. CalculatorContext active model
    if (calcContext?.activeModelSlug) {
      return {
        activeModelSlug: calcContext.activeModelSlug,
        activeModelName: calcContext.activeModelName || getModelDisplayName(calcContext.activeModelSlug),
      };
    }

    // 3. Pathname detection (e.g. /calculator/rav4-hybrid, /camping/sienna, /wait-times/sienna)
    const lowerPath = pathname.toLowerCase();
    if (lowerPath.includes('sienna')) {
      return { activeModelSlug: 'sienna', activeModelName: 'Sienna' };
    }
    if (lowerPath.includes('grand-highlander') || lowerPath.includes('grand highlander')) {
      return { activeModelSlug: 'grand-highlander', activeModelName: 'Grand Highlander' };
    }
    if (lowerPath.includes('rav4')) {
      return { activeModelSlug: 'rav4', activeModelName: 'RAV4' };
    }
    if (lowerPath.includes('camry')) {
      return { activeModelSlug: 'camry', activeModelName: 'Camry' };
    }
    if (lowerPath.includes('prius')) {
      return { activeModelSlug: 'prius', activeModelName: 'Prius' };
    }
    if (lowerPath.includes('tacoma')) {
      return { activeModelSlug: 'tacoma', activeModelName: 'Tacoma' };
    }

    // 4. Custom event or fallback
    if (eventModel) {
      const clean = eventModel.toLowerCase().trim();
      return {
        activeModelSlug: clean,
        activeModelName: getModelDisplayName(clean),
      };
    }

    return { activeModelSlug: '', activeModelName: '' };
  }, [searchParams, calcContext, pathname, eventModel]);

  const gearSlotLabel = activeModelName ? `${activeModelName} Gear` : 'Gear';

  // Active state matching
  const isTrackerActive = pathname === '/' || pathname === '';
  const isInventoryActive = pathname === '/inventory';
  const isGuidesActive = pathname.startsWith('/guides') || pathname === '/winter-prep' || pathname.startsWith('/camping');
  const isCalculatorActive = pathname.startsWith('/calculator');

  return (
    <>
      <nav
        data-testid="mobile-bottom-dock"
        aria-label="Mobile Navigation Dock"
        className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-zinc-950/95 border-t border-zinc-800/80 backdrop-blur-lg pb-safe"
      >
        <div className="grid grid-cols-5 items-center h-14 px-0.5 sm:px-1 max-w-md mx-auto">
          {/* Slot 1: Tracker */}
          <Link
            href="/"
            data-testid="mobile-dock-tracker"
            className={`flex flex-col items-center justify-center gap-0.5 text-center py-1 transition-colors px-0.5 ${
              isTrackerActive && !isGearDrawerOpen
                ? 'text-amber-400 font-bold'
                : 'text-zinc-400 hover:text-zinc-200 font-medium'
            }`}
          >
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span className="text-[10px] tracking-tight truncate max-w-full">Tracker</span>
          </Link>

          {/* Slot 2: Live Stock */}
          <Link
            href="/inventory"
            data-testid="mobile-dock-inventory"
            className={`flex flex-col items-center justify-center gap-0.5 text-center py-1 transition-colors px-0.5 ${
              isInventoryActive && !isGearDrawerOpen
                ? 'text-amber-400 font-bold'
                : 'text-zinc-400 hover:text-zinc-200 font-medium'
            }`}
          >
            <Ship className="h-4 w-4" aria-hidden="true" />
            <span className="text-[10px] tracking-tight truncate max-w-full">Live Stock</span>
          </Link>

          {/* Slot 3: Guides */}
          <Link
            href="/guides"
            data-testid="mobile-dock-guides"
            className={`flex flex-col items-center justify-center gap-0.5 text-center py-1 transition-colors px-0.5 ${
              isGuidesActive && !isGearDrawerOpen
                ? 'text-amber-400 font-bold'
                : 'text-zinc-400 hover:text-zinc-200 font-medium'
            }`}
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            <span className="text-[10px] tracking-tight truncate max-w-full">Guides</span>
          </Link>

          {/* Slot 4: Model Gear (Opens Drawer) */}
          <button
            type="button"
            data-testid="mobile-dock-gear"
            onClick={() => setIsGearDrawerOpen(true)}
            className={`flex flex-col items-center justify-center gap-0.5 text-center py-1 transition-colors cursor-pointer px-0.5 ${
              isGearDrawerOpen
                ? 'text-amber-400 font-bold'
                : 'text-zinc-400 hover:text-zinc-200 font-medium'
            }`}
          >
            <Package className="h-4 w-4" aria-hidden="true" />
            <span className="text-[10px] tracking-tight truncate max-w-full">
              {gearSlotLabel}
            </span>
          </button>

          {/* Slot 5: Calculator */}
          <Link
            href="/calculator"
            data-testid="mobile-dock-calculator"
            className={`flex flex-col items-center justify-center gap-0.5 text-center py-1 transition-colors px-0.5 ${
              isCalculatorActive && !isGearDrawerOpen
                ? 'text-amber-400 font-bold'
                : 'text-zinc-400 hover:text-zinc-200 font-medium'
            }`}
          >
            <Calculator className="h-4 w-4" aria-hidden="true" />
            <span className="text-[10px] tracking-tight truncate max-w-full">Calculator</span>
          </Link>
        </div>
      </nav>

      {/* Dynamic Model Gear Drawer */}
      <MobileGearDrawer
        isOpen={isGearDrawerOpen}
        onClose={() => setIsGearDrawerOpen(false)}
        modelSlug={activeModelSlug}
        modelName={activeModelName}
      />
    </>
  );
}

export default MobileBottomDock;
