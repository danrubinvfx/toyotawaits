'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Bell,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Copy,
  Check,
  Shield,
  Layers,
  Sparkles,
  Camera,
  LayoutGrid,
} from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { buildAmazonAffiliateUrl } from '@/lib/affiliate';
import { getAccessoriesForModel, AccessoryItem } from '@/data/accessories';
import { useMatchingInventory, useDropAlertSubscription } from '@/lib/data/inventory';
import { trackAffiliateClick } from '@/lib/gear';

export interface PostSubmissionNextStepsProps {
  modelName: string;
  province?: string;
  email?: string;
  estimatedMonths?: number | string;
  className?: string;
}

interface HeroAccessory {
  id: string;
  title: string;
  category: 'protection' | 'tech' | 'comfort';
  description: string;
  estimatedPriceCad: string;
  brand?: string;
  destinationType?: 'amazon' | 'direct_partner';
  discountCode?: string;
  discountText?: string;
  badge?: string;
  url?: string;
  searchQuery?: string;
  imageUrl?: string;
  fallbackIcon?: 'camera' | 'layers' | 'layout-grid';
}

function resolveEstimatedMonths(modelName: string): number {
  const norm = modelName.toLowerCase();
  if (norm.includes('gx550') || norm.includes('gx 550')) return 12;
  if (norm.includes('tx')) return 8;
  if (norm.includes('nx')) return 7;
  if (norm.includes('rx')) return 6;
  if (norm.includes('sienna')) return 14;
  if (norm.includes('rav4')) return 12;
  if (norm.includes('grand highlander') || norm.includes('grand-highlander')) return 10;
  if (norm.includes('tacoma')) return 6;
  if (norm.includes('prius')) return 8;
  if (norm.includes('land cruiser') || norm.includes('land-cruiser')) return 10;
  if (norm.includes('corolla')) return 6;
  return 12;
}

function getHeroAccessories(modelName: string): HeroAccessory[] {
  const norm = (modelName || '').toLowerCase().trim();

  if (norm.includes('gx') || norm.includes('gx550') || norm.includes('gx 550')) {
    return [
      {
        id: 'lexus-gx550-tuxmat',
        title: 'TuxMat High-Wall All-Weather Liners',
        category: 'protection',
        brand: 'TuxMat',
        destinationType: 'amazon',
        description: 'Maximum-coverage laser-measured all-weather liners protecting footwells and dead-pedal from road salt.',
        estimatedPriceCad: '$280 – $340 CAD',
        searchQuery: 'Lexus GX 550 all weather floor mats TuxMat',
        imageUrl: '/assets/gear/tuxmat-floor-liners.webp',
        fallbackIcon: 'layers',
      },
      {
        id: 'lexus-fitcamx',
        title: 'FitcamX 4K OEM Integrated Dashcam',
        category: 'tech',
        brand: 'FitcamX',
        destinationType: 'amazon',
        description: 'OEM-integrated rearview mirror power tap with zero visible wiring and factory appearance.',
        estimatedPriceCad: '$230 – $280 CAD',
        searchQuery: 'Fitcamx dash cam Lexus RX NX TX GX OEM 4K',
        imageUrl: '/assets/gear/fitcamx-rav4.webp',
        fallbackIcon: 'camera',
      },
      {
        id: 'lexus-14in-spigen',
        title: 'Spigen GlasTR 14-inch Screen Protector',
        category: 'protection',
        brand: 'Spigen',
        destinationType: 'amazon',
        description: 'Matte 9H oleophobic tempered glass eliminating fingerprint glare on the 14-inch Lexus Interface.',
        estimatedPriceCad: '$32 – $38 CAD',
        searchQuery: 'Spigen 14 inch screen protector Lexus TX GX NX',
        imageUrl: '/assets/gear/spigen-screen-protector.webp',
        fallbackIcon: 'layout-grid',
      },
    ];
  }

  if (norm.includes('tx')) {
    return [
      {
        id: 'lexus-tx-3row-liners',
        title: '3-Row High-Wall All-Weather Floor Liners',
        category: 'protection',
        brand: 'TuxMat',
        destinationType: 'amazon',
        description: 'Full 3-row high-wall TPE floor liners with pass-through aisle runner for family comfort.',
        estimatedPriceCad: '$260 – $320 CAD',
        searchQuery: 'Lexus TX 3-row all weather floor mats liners',
        imageUrl: '/assets/gear/tuxmat-floor-liners.webp',
        fallbackIcon: 'layers',
      },
      {
        id: 'lexus-14in-spigen-tx',
        title: 'Spigen GlasTR 14-inch Screen Protector',
        category: 'protection',
        brand: 'Spigen',
        destinationType: 'amazon',
        description: 'Precision cut 9H tempered glass screen shield for the 14-inch Lexus Interface.',
        estimatedPriceCad: '$32 – $38 CAD',
        searchQuery: 'Spigen 14 inch screen protector Lexus TX GX NX',
        imageUrl: '/assets/gear/spigen-screen-protector.webp',
        fallbackIcon: 'layout-grid',
      },
      {
        id: 'lexus-faraday-pouch',
        title: 'Dual-Layer Faraday Key Fob Shielding Pouches',
        category: 'tech',
        brand: 'Faraday',
        destinationType: 'amazon',
        description: 'Blocks smart-key RFID signals preventing residential relay theft attacks in urban centers.',
        estimatedPriceCad: '$18 – $26 CAD',
        searchQuery: 'Faraday bag key fob signal protector pouch',
        imageUrl: '/assets/gear/fitcamx-rav4.webp',
        fallbackIcon: 'camera',
      },
    ];
  }

  if (norm.includes('nx') || norm.includes('rx') || norm.includes('lexus')) {
    return [
      {
        id: 'lexus-tuxmat-crossover',
        title: 'TuxMat High-Wall All-Weather Liners',
        category: 'protection',
        brand: 'TuxMat',
        destinationType: 'amazon',
        description: 'Custom laser-fit high-wall winter protection keeping melted snow and salt off luxury carpet.',
        estimatedPriceCad: '$260 – $310 CAD',
        searchQuery: 'Lexus RX NX all weather floor mats TuxMat',
        imageUrl: '/assets/gear/tuxmat-floor-liners.webp',
        fallbackIcon: 'layers',
      },
      {
        id: 'lexus-fitcamx-crossover',
        title: 'FitcamX 4K OEM Integrated Dashcam',
        category: 'tech',
        brand: 'FitcamX',
        destinationType: 'amazon',
        description: 'Discrete factory look OEM dashcam tapping into Lexus Safety System+ mirror shroud.',
        estimatedPriceCad: '$230 – $280 CAD',
        searchQuery: 'Fitcamx dash cam Lexus RX NX TX GX OEM 4K',
        imageUrl: '/assets/gear/fitcamx-rav4.webp',
        fallbackIcon: 'camera',
      },
      {
        id: 'lexus-evse-grizzl-e',
        title: 'Grizzl-E Classic 40A Heavy-Duty Level 2 EV Charger',
        category: 'tech',
        brand: 'Grizzl-E',
        destinationType: 'amazon',
        description: 'Canadian-made -40°C winter-rated 240V home charger replenishing NX/RX 450h+ in 2.5 hours.',
        estimatedPriceCad: '$499 – $549 CAD',
        searchQuery: 'Grizzl-E Level 2 EV charger 40A NEMA 14-50',
        imageUrl: '/assets/gear/spigen-screen-protector.webp',
        fallbackIcon: 'layout-grid',
      },
    ];
  }

  if (norm.includes('rav4')) {
    return [
      {
        id: 'rav4-fitcamx',
        title: 'FitcamX 4K OEM Dashcam',
        category: 'tech',
        brand: 'FitcamX',
        destinationType: 'amazon',
        description: 'OEM-integrated rearview mirror power tap with zero visible wiring and factory fit.',
        estimatedPriceCad: '$169 – $289 CAD',
        searchQuery: 'Fitcamx dash cam Toyota RAV4 OEM 4K',
        imageUrl: '/assets/gear/fitcamx-rav4.webp',
        fallbackIcon: 'camera',
      },
      {
        id: 'rav4-tuxmat',
        title: 'TuxMat High-Wall Floor Mats',
        category: 'protection',
        brand: 'TuxMat',
        destinationType: 'amazon',
        description: 'Maximum coverage custom-fit high-wall laser measured mats for Canadian winters.',
        estimatedPriceCad: '$260 – $290 CAD',
        searchQuery: 'TuxMat Toyota RAV4 custom all weather floor mats',
        imageUrl: '/assets/gear/tuxmat-floor-liners.webp',
        fallbackIcon: 'layers',
      },
      {
        id: 'rav4-spigen-screen',
        title: 'Spigen 9H Screen Glass',
        category: 'protection',
        brand: 'Spigen',
        destinationType: 'amazon',
        description: 'Ultra-clear oleophobic 9H tempered glass screen protector guarding multimedia touch screen.',
        estimatedPriceCad: '$22 – $32 CAD',
        searchQuery: 'Spigen screen protector Toyota RAV4 10.5 inch tempered glass',
        imageUrl: '/assets/gear/spigen-screen-protector.webp',
        fallbackIcon: 'layout-grid',
      },
    ];
  }

  if (norm.includes('sienna')) {
    return [
      {
        id: 'sienna-tuxmat',
        title: 'TuxMat 3-Row Set',
        category: 'protection',
        brand: 'TuxMat',
        destinationType: 'amazon',
        description: 'Full-cabin 3-row floor spill and salt defense custom-measured for Sienna sliding seats.',
        estimatedPriceCad: '$330 – $360 CAD',
        searchQuery: 'TuxMat Toyota Sienna 3 row custom all weather floor mats',
        imageUrl: '/assets/gear/tuxmat-floor-liners.webp',
        fallbackIcon: 'layers',
      },
      {
        id: 'sienna-console-tray',
        title: 'Center Console Drop-In Tray',
        category: 'comfort',
        brand: 'Muslogy',
        destinationType: 'direct_partner',
        discountCode: 'Toyotawaits',
        discountText: '2% OFF',
        badge: 'CODE: Toyotawaits (2% OFF)',
        url: '/out/muslogy-sienna',
        description: 'Custom-fit sliding upper tray & hidden lower bridge storage organizer tailored for Sienna.',
        estimatedPriceCad: '$28 – $36 CAD',
        imageUrl: '/assets/gear/muslogy-sienna-organizer.webp',
        fallbackIcon: 'layout-grid',
      },
      {
        id: 'sienna-fitcamx',
        title: 'FitcamX 4K OEM Dashcam',
        category: 'tech',
        brand: 'FitcamX',
        destinationType: 'amazon',
        description: 'Plug-and-play OEM dashcam tapped into Sienna rearview mirror housing with zero hanging cords.',
        estimatedPriceCad: '$169 – $289 CAD',
        searchQuery: 'Fitcamx dash cam Toyota Sienna OEM 4K',
        imageUrl: '/assets/gear/fitcamx-rav4.webp',
        fallbackIcon: 'camera',
      },
    ];
  }

  if (norm.includes('grand highlander') || norm.includes('grand-highlander')) {
    return [
      {
        id: 'gh-tempered-glass',
        title: '12.3" Tempered Glass',
        category: 'protection',
        brand: 'Spigen',
        destinationType: 'amazon',
        description: '9H anti-glare scratch-resistant navigation touch screen protector for 12.3" audio multimedia.',
        estimatedPriceCad: '$24 – $34 CAD',
        searchQuery: 'Toyota Grand Highlander 12.3 inch screen protector tempered glass 9H',
        imageUrl: '/assets/gear/spigen-screen-protector.webp',
        fallbackIcon: 'layout-grid',
      },
      {
        id: 'gh-console-divider',
        title: 'Center Console Divider',
        category: 'comfort',
        brand: 'Muslogy',
        destinationType: 'direct_partner',
        discountCode: 'Toyotawaits',
        discountText: '2% OFF',
        badge: 'CODE: Toyotawaits (2% OFF)',
        url: '/out/muslogy-grand-highlander',
        description: 'Direct-fit upper armrest storage box and console divider tray tailored for Grand Highlander.',
        estimatedPriceCad: '$24 – $32 CAD',
        imageUrl: '/assets/gear/muslogy-grand-highlander-organizer.webp',
        fallbackIcon: 'layout-grid',
      },
      {
        id: 'gh-tpe-mats',
        title: 'Custom TPE Mats',
        category: 'protection',
        brand: 'TuxMat / TPE',
        destinationType: 'amazon',
        description: 'Laser-measured deep-dish all-weather floor liners and cargo mats shielding 1st, 2nd, and 3rd rows.',
        estimatedPriceCad: '$180 – $320 CAD',
        searchQuery: 'Toyota Grand Highlander all weather floor mats liners',
        imageUrl: '/assets/gear/tuxmat-floor-liners.webp',
        fallbackIcon: 'layers',
      },
    ];
  }

  if (norm.includes('tacoma')) {
    return [
      {
        id: 'tacoma-bed-mat',
        title: 'Bed Mat',
        category: 'protection',
        brand: 'OEM-Fit / TPE',
        destinationType: 'amazon',
        description: 'Heavy-duty non-slip composite truck bed protective mat engineered for Toyota Tacoma.',
        estimatedPriceCad: '$130 – $190 CAD',
        searchQuery: 'Toyota Tacoma truck bed mat heavy duty anti slip',
        imageUrl: '/assets/gear/tuxmat-floor-liners.webp',
        fallbackIcon: 'layers',
      },
      {
        id: 'tacoma-console-organizer',
        title: 'Center Console Organizer',
        category: 'comfort',
        brand: 'OEM-Fit',
        destinationType: 'amazon',
        description: 'Drop-in dual tier tray organizing coins, cards, and daily gear in the deep Tacoma console.',
        estimatedPriceCad: '$18 – $28 CAD',
        searchQuery: 'Toyota Tacoma center console organizer tray 2024-2026',
        imageUrl: '/assets/gear/console-tray-organizer.webp',
        fallbackIcon: 'layout-grid',
      },
      {
        id: 'tacoma-tempered-glass',
        title: 'Tempered Glass',
        category: 'protection',
        brand: 'Spigen',
        destinationType: 'amazon',
        description: '9H oleophobic anti-fingerprint tempered glass protector for Tacoma multimedia touchscreen.',
        estimatedPriceCad: '$20 – $32 CAD',
        searchQuery: 'Toyota Tacoma screen protector tempered glass 9H',
        imageUrl: '/assets/gear/spigen-screen-protector.webp',
        fallbackIcon: 'layout-grid',
      },
    ];
  }

  // Universal / other models fallback from accessories catalog
  const catalogItems = getAccessoriesForModel(modelName);
  return catalogItems.slice(0, 3).map((item: AccessoryItem) => ({
    id: item.id,
    title: item.title,
    category: (item.category as any) || 'protection',
    brand: item.brand,
    destinationType: item.destinationType === 'direct_partner' ? 'direct_partner' : 'amazon',
    discountCode: item.discountCode,
    discountText: item.discountText,
    badge: item.discountCode ? `CODE: ${item.discountCode} (${item.discountText || '2% OFF'})` : item.badge,
    url: item.url,
    searchQuery: item.searchQuery || item.title,
    description: item.description,
    estimatedPriceCad: item.estimatedPriceCad,
    imageUrl: item.imageUrl,
    fallbackIcon: (item.fallbackIcon as any) || 'layers',
  }));
}

export function PostSubmissionNextSteps({
  modelName,
  province = 'BC',
  email: initialEmail = '',
  estimatedMonths: overrideEstimatedMonths,
  className = '',
}: PostSubmissionNextStepsProps) {
  const { market } = useMarket();
  const estimatedMonths = overrideEstimatedMonths ?? resolveEstimatedMonths(modelName);

  // Live Inventory Matching
  const { count: activeCount } = useMatchingInventory({
    modelName,
    province,
  });

  // Drop Alert Subscription Hook
  const {
    email,
    setEmail,
    isSubscribed,
    isSubmitting: isAlertSubmitting,
    statusMessage,
    errorMessage: alertError,
    subscribe,
  } = useDropAlertSubscription({
    email: initialEmail,
    modelName,
    province,
  });

  const [showEmailInput, setShowEmailInput] = useState<boolean>(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const heroAccessories = React.useMemo(() => getHeroAccessories(modelName), [modelName]);

  const handleCopyCode = (code: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
      setCopiedCodeId(id);
      setTimeout(() => setCopiedCodeId(null), 2500);
    }
  };

  const handleAlertToggle = async () => {
    if (email && email.trim()) {
      await subscribe(email);
    } else {
      setShowEmailInput(true);
    }
  };

  const handleInlineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.trim()) return;
    const ok = await subscribe(email);
    if (ok) {
      setShowEmailInput(false);
    }
  };

  return (
    <div
      data-testid="post-submission-next-steps"
      className={`space-y-4 text-left overflow-x-hidden ${className}`}
    >
      {/* SECTION A: "Don't Want to Wait?" Live Stock & Drop Alerts */}
      {activeCount > 0 ? (
        <div
          data-testid="skip-the-wait-card"
          className="rounded-xl border border-sky-500/30 bg-sky-950/20 p-4 mb-4 space-y-3"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 block">
              ⚡ Don&apos;t want to wait {estimatedMonths} months?
            </span>
            <p className="text-sm text-neutral-300 mt-1">
              We observed {activeCount} matching {modelName} units across local dealer feeds.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
            {/* Primary CTA */}
            <Link
              href={`/inventory?model=${encodeURIComponent(modelName)}`}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition-colors text-center cursor-pointer shrink-0"
            >
              <span>Browse Live Stock ({activeCount}) ↗</span>
            </Link>

            {/* Secondary Toggle / Alert Action */}
            {!isSubscribed && (
              <button
                type="button"
                onClick={handleAlertToggle}
                disabled={isAlertSubmitting}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium border border-sky-500/40 bg-sky-900/30 hover:bg-sky-900/50 text-sky-200 transition-colors cursor-pointer shrink-0"
              >
                {isAlertSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <span>🔔 Alert Me on Canceled Allocations</span>
                )}
              </button>
            )}
          </div>

          {/* Inline Email Input Fallback if email was missing */}
          {!isSubscribed && showEmailInput && (
            <form onSubmit={handleInlineSubmit} className="pt-2 flex items-center gap-2">
              <input
                type="email"
                required
                placeholder="Enter email for drop alerts"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-700 text-xs text-zinc-100 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <button
                type="submit"
                disabled={isAlertSubmitting}
                className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md cursor-pointer shrink-0"
              >
                {isAlertSubmitting ? 'Activating...' : 'Activate'}
              </button>
            </form>
          )}

          {/* Inline Confirmation */}
          {isSubscribed && (
            <div
              data-testid="drop-alert-subscribed"
              className="flex items-center gap-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 p-2.5 text-xs text-emerald-300 animate-in fade-in"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>
                {statusMessage ||
                  'Subscribed! You will get email alerts when unreserved allocations land.'}
              </span>
            </div>
          )}

          {alertError && (
            <p className="text-xs text-rose-400 mt-1">{alertError}</p>
          )}
        </div>
      ) : (
        /* Subtle Card when activeCount === 0 */
        <div
          data-testid="zero-stock-card"
          className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 mb-4 space-y-2.5"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs sm:text-sm font-medium text-zinc-200">
                Set a 180-Day Drop Alert for incoming unreserved allocations at MSRP
              </p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                We monitor dealer cancellations and unreserved allocations arriving across {province || 'local'} showrooms.
              </p>
            </div>
            {!isSubscribed && (
              <button
                type="button"
                onClick={handleAlertToggle}
                disabled={isAlertSubmitting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 cursor-pointer shrink-0 transition-colors"
              >
                {isAlertSubmitting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Bell className="h-3.5 w-3.5 text-amber-400" />
                )}
                <span>1-Click Alert</span>
              </button>
            )}
          </div>

          {!isSubscribed && showEmailInput && (
            <form onSubmit={handleInlineSubmit} className="pt-1 flex items-center gap-2">
              <input
                type="email"
                required
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-700 text-xs text-zinc-100 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                disabled={isAlertSubmitting}
                className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md cursor-pointer shrink-0"
              >
                {isAlertSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          )}

          {isSubscribed && (
            <div
              data-testid="drop-alert-subscribed"
              className="flex items-center gap-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 p-2 text-xs text-emerald-300 animate-in fade-in"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>
                {statusMessage ||
                  'Subscribed! You will get email alerts when unreserved allocations land.'}
              </span>
            </div>
          )}

          {alertError && (
            <p className="text-xs text-rose-400 mt-1">{alertError}</p>
          )}
        </div>
      )}

      {/* SECTION B: "First-Day Buys & Delivery Day Prep" */}
      <div data-testid="first-day-buys-section" className="space-y-3 pt-1">
        <div className="border-b border-zinc-800 pb-2">
          <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
            <span>📦 First-Day Buys &amp; Essentials</span>
            <span className="text-[11px] font-normal text-zinc-400 ml-auto hidden sm:inline">
              For {modelName}
            </span>
          </h4>
          <p className="text-xs text-zinc-400 mt-0.5">
            Top-rated gear Canadian owners install on delivery day to protect their vehicle.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
          {heroAccessories.map((item) => {
            const isDirectPartner = item.destinationType === 'direct_partner';
            const rawUrl = isDirectPartner
              ? (item.url || `/out/${item.id}`)
              : buildAmazonAffiliateUrl({
                  query: item.searchQuery || item.title,
                  market: market === 'US' ? 'US' : 'CA',
                });

            const buttonText = isDirectPartner ? 'Get Deal ↗' : 'View on Amazon ↗';

            return (
              <div
                key={item.id}
                data-testid={`hero-accessory-${item.id}`}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900/70 hover:border-zinc-700 transition-colors"
              >
                {/* Accessory Icon / Photo + Info */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700/60 shrink-0 flex items-center justify-center">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : item.fallbackIcon === 'camera' ? (
                      <Camera className="h-6 w-6 text-sky-400" />
                    ) : item.fallbackIcon === 'layout-grid' ? (
                      <LayoutGrid className="h-6 w-6 text-amber-400" />
                    ) : (
                      <Layers className="h-6 w-6 text-emerald-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h5 className="text-xs sm:text-sm font-semibold text-zinc-100 truncate">
                        {item.title}
                      </h5>

                      {/* Partner Deals & Badges */}
                      {item.discountCode && (
                        <button
                          type="button"
                          onClick={() => handleCopyCode(item.discountCode!, item.id)}
                          title={`Copy code ${item.discountCode}`}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-colors cursor-pointer"
                        >
                          {copiedCodeId === item.id ? (
                            <>
                              <Check className="h-2.5 w-2.5 text-emerald-400" />
                              <span>COPIED</span>
                            </>
                          ) : (
                            <>
                              <span>CODE: {item.discountCode} (2% OFF)</span>
                              <Copy className="h-2.5 w-2.5 opacity-60" />
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-medium text-emerald-400">
                        {item.estimatedPriceCad}
                      </span>
                      {item.brand && (
                        <span className="text-[10px] text-zinc-500 font-mono">
                          • {item.brand}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Outbound Link CTA */}
                <div className="w-full sm:w-auto shrink-0 flex items-center justify-end">
                  <a
                    href={rawUrl}
                    target="_blank"
                    rel="sponsored noopener noreferrer nofollow"
                    onClick={() => {
                      trackAffiliateClick({
                        accessory_id: item.id,
                        placement: 'submission_modal',
                        model_context: modelName,
                        target_url: rawUrl,
                      });
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{buttonText}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-[10px] text-zinc-500 text-center pt-1">
          As an Amazon Associate, ToyotaWaits earns from qualifying purchases. Outbound links do not affect editorial neutrality.
        </p>
      </div>
    </div>
  );
}
