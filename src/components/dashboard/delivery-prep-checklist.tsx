'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import productsData from '@/lib/data/affiliate-products.json';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ClipboardCheck,
  Eye,
  Layers,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  Luggage,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModCard } from '@/components/delivery-prep/mod-card';
import { useMarket } from '@/context/MarketContext';

export interface ChecklistProduct {
  id: string;
  slug: string;
  models: string[];
  powertrains?: string[];
  category:
    | 'visibility_protection'
    | 'cabin_organization'
    | 'cargo_utility'
    | 'roadside_winter'
    | 'Interior Protection'
    | 'Cargo & Utility'
    | 'Electronics & Safety'
    | 'Organization'
    | 'Battery & Emergency';
  categories?: string[];
  title: string;
  name?: string;
  priceEst?: string;
  priceEstCad?: string;
  whyBuy?: string;
  utilityNote?: string;
  description?: string;
  image?: string;
  imageSrc?: string;
  asin?: string;
  destinationUrl: string;
  affiliateUrl?: string;
  badge?: 'Essential' | 'Recommended' | 'Pro Tip' | 'Recommended Upgrade' | string;
  compatibility?: string;
  amazonCaAsinOrUrl?: string;
  youtubeVideoId?: string;
  videoTitle?: string;
  isDeliveryDayEssential?: boolean;
}

import {
  PickupChecklist,
  DELIVERY_INSPECTION_ITEMS,
  type InspectionCheckItem,
} from '@/components/delivery-prep/pickup-checklist';

export { DELIVERY_INSPECTION_ITEMS, PickupChecklist };
export type { InspectionCheckItem };

export interface DeliveryPrepChecklistProps {
  model?: string;
  powertrain?: string;
  className?: string;
  defaultExpanded?: boolean;
  vehicleLabel?: string;
  showUniversalGear?: boolean;
  onToggleUniversalGear?: () => void;
}

const PRIMARY_FILTER_TABS = [
  { id: 'all', label: 'All Gear' },
  { id: 'delivery_day_1', label: '📦 Delivery Day 1 Checklist' },
  { id: 'protection', label: '🛡️ Protection' },
  { id: 'tech_comfort', label: '⚡ Tech & Comfort' },
] as const;

const CATEGORIES = [
  { id: 'all', label: 'All Essentials', icon: ClipboardCheck },
  { id: 'visibility_protection', label: 'Visibility & Tech', icon: Eye },
  { id: 'cabin_organization', label: 'Interior Protection', icon: Layers },
  { id: 'cargo_utility', label: 'Cargo & Utility', icon: Luggage },
  { id: 'roadside_winter', label: 'Roadside Armor', icon: ShieldAlert },
] as const;

function matchesCategory(item: ChecklistProduct, selectedCategory: string): boolean {
  if (selectedCategory === 'all') return true;

  if (selectedCategory === 'delivery_day_1') {
    if (
      (item as any).isDeliveryDayEssential ||
      item.badge === 'Delivery Day 1' ||
      item.slug === 'rfid-faraday-key-fob-pouch' ||
      item.slug === 'fast-usbc-pd-car-charger'
    ) {
      return true;
    }
    const slug = (item.slug || '').toLowerCase();
    const title = (item.title || '').toLowerCase();
    return (
      slug.includes('fitcamx') ||
      slug.includes('dashcam') ||
      slug.includes('screen-protector') ||
      slug.includes('console-tray') ||
      slug.includes('console-organizer') ||
      slug.includes('all-weather-liners') ||
      slug.includes('floor-liners') ||
      slug.includes('floor-mats') ||
      title.includes('floor liner') ||
      title.includes('floor mat') ||
      title.includes('tuxmat') ||
      title.includes('fitcamx') ||
      title.includes('screen protector') ||
      title.includes('console')
    );
  }

  if (selectedCategory === 'protection') {
    const slug = (item.slug || '').toLowerCase();
    const cat = (item.category || '').toLowerCase();
    const cats = (item.categories || []).map((c) => c.toLowerCase());
    return (
      cat.includes('protection') ||
      cat.includes('armor') ||
      cat.includes('cargo') ||
      cat.includes('floor') ||
      cats.some((c) => c.includes('protection') || c.includes('cargo') || c.includes('armor') || c.includes('floor')) ||
      slug.includes('liner') ||
      slug.includes('mat') ||
      slug.includes('protector') ||
      slug.includes('guard') ||
      slug.includes('scuff')
    );
  }

  if (selectedCategory === 'tech_comfort') {
    const slug = (item.slug || '').toLowerCase();
    const cat = (item.category || '').toLowerCase();
    const cats = (item.categories || []).map((c) => c.toLowerCase());
    return (
      cat.includes('tech') ||
      cat.includes('comfort') ||
      cat.includes('visibility') ||
      cat.includes('safety') ||
      cat.includes('audio') ||
      cat.includes('electronic') ||
      cats.some((c) => c.includes('tech') || c.includes('comfort') || c.includes('safety') || c.includes('electronic')) ||
      slug.includes('fitcamx') ||
      slug.includes('dashcam') ||
      slug.includes('charger') ||
      slug.includes('organizer') ||
      slug.includes('tray') ||
      slug.includes('speaker') ||
      slug.includes('carplay')
    );
  }

  // Check multi-category array if present
  if (item.categories && item.categories.length > 0) {
    if (item.categories.includes(selectedCategory as any)) return true;
    if (
      selectedCategory === 'visibility_protection' &&
      item.categories.includes('Electronics & Safety')
    )
      return true;
    if (
      selectedCategory === 'cabin_organization' &&
      (item.categories.includes('Interior Protection') ||
        item.categories.includes('Organization'))
    )
      return true;
    if (
      selectedCategory === 'cargo_utility' &&
      item.categories.includes('Cargo & Utility')
    )
      return true;
    if (
      selectedCategory === 'roadside_winter' &&
      (item.categories.includes('Battery & Emergency') ||
        item.categories.includes('Winter Prep'))
    )
      return true;
  }

  // Fallback to single item.category
  const itemCategory = item.category;
  if (itemCategory === selectedCategory) return true;

  if (selectedCategory === 'visibility_protection') {
    return (
      itemCategory === 'visibility_protection' ||
      itemCategory === 'Electronics & Safety'
    );
  }
  if (selectedCategory === 'cabin_organization') {
    return (
      itemCategory === 'cabin_organization' ||
      itemCategory === 'Interior Protection' ||
      itemCategory === 'Organization'
    );
  }
  if (selectedCategory === 'cargo_utility') {
    return (
      itemCategory === 'cargo_utility' ||
      itemCategory === 'Cargo & Utility'
    );
  }
  if (selectedCategory === 'roadside_winter') {
    return (
      itemCategory === 'roadside_winter' ||
      itemCategory === 'Battery & Emergency'
    );
  }
  return false;
}

const LOCAL_STORAGE_KEY = 'toyotawaits_prep_checklist_checks';

export function DeliveryPrepChecklist({
  model = 'all',
  powertrain,
  className,
  defaultExpanded = true,
  vehicleLabel,
  showUniversalGear,
  onToggleUniversalGear,
}: DeliveryPrepChecklistProps) {
  const { isUs } = useMarket();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Normalize model and powertrain slugs
  const normalizedModel = useMemo(() => {
    const m = (model || '').toLowerCase().trim();
    if (m.includes('sienna')) return 'sienna';
    if (m.includes('grand') || m.includes('highlander')) return 'grand-highlander';
    if (m.includes('land') || m.includes('cruiser') || m.includes('lc250') || m.includes('1958')) return 'land-cruiser';
    if (m.includes('cross')) return 'corolla-cross';
    if (m.includes('corolla')) return 'corolla';
    if (m.includes('prius')) return m.includes('prime') ? 'prius-prime' : 'prius';
    if (m.includes('tacoma')) return 'tacoma';
    if (m.includes('sequoia')) return 'sequoia';
    if (m.includes('rav4') || m.includes('prime')) return 'rav4';
    return m || 'all';
  }, [model]);

  const normalizedPowertrain = useMemo(() => {
    const p = (powertrain || '').toLowerCase().trim();
    if (p.includes('plug') || p.includes('phev') || p.includes('prime')) return 'phev';
    if (p.includes('hybrid') || p.includes('hev') || p.includes('max')) return 'hev';
    if (p.includes('gas') || p.includes('turbo')) return 'gas';
    return p;
  }, [powertrain]);

  // Load checked state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          setCheckedItems(parsed);
        }, 0);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Save checked state to localStorage
  const toggleItem = (slug: string) => {
    setCheckedItems((prev) => {
      const next = { ...prev, [slug]: !prev[slug] };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const resetChecklist = () => {
    setCheckedItems({});
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const hasDraggedRef = useRef(false);

  const checkScrollability = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    if (scrollWidth === 0) return;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    checkScrollability();
    el.addEventListener('scroll', checkScrollability, { passive: true });
    window.addEventListener('resize', checkScrollability, { passive: true });
    return () => {
      el.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [checkScrollability]);

  const scrollByOneCard = (direction: 'left' | 'right') => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === 'left' ? -300 : 300,
      behavior: 'smooth',
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || !carouselRef.current) return;
    const nativeEvent = e.nativeEvent as unknown as {
      sourceCapabilities?: { firesTouchEvents?: boolean };
      pointerType?: string;
    };
    if (
      nativeEvent?.sourceCapabilities?.firesTouchEvents ||
      (nativeEvent?.pointerType && nativeEvent.pointerType !== 'mouse') ||
      (typeof window !== 'undefined' &&
        'ontouchstart' in window &&
        typeof window.matchMedia === 'function' &&
        !window.matchMedia('(pointer: fine)').matches)
    ) {
      return;
    }
    const pageX = e.pageX ?? e.clientX;
    setIsDragging(true);
    hasDraggedRef.current = false;
    setStartX(pageX - carouselRef.current.offsetLeft);
    setScrollLeftState(carouselRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    const pageX = e.pageX ?? e.clientX;
    const x = pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag speed multiplier
    if (Math.abs(x - startX) > 5) {
      hasDraggedRef.current = true;
    }
    carouselRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      hasDraggedRef.current = false;
    }
  };

  // Filter items matching model and powertrain with deduplication by item.id and item.asin
  const filteredProducts = useMemo(() => {
    const list = productsData as ChecklistProduct[];
    const seenIds = new Set<string>();
    const seenAsins = new Set<string>();

    return list.filter((item) => {
      // Model match
      const modelMatch =
        item.models.includes('all') ||
        normalizedModel === 'all' ||
        item.models.includes(normalizedModel);

      if (!modelMatch) return false;

      // Powertrain restriction (e.g. PHEV lock ring)
      if (item.powertrains && item.powertrains.length > 0) {
        if (!normalizedPowertrain || !item.powertrains.includes(normalizedPowertrain)) {
          return false;
        }
      }

      // Category match
      if (!matchesCategory(item, selectedCategory)) {
        return false;
      }

      // Deduplicate by id
      if (seenIds.has(item.id)) return false;
      seenIds.add(item.id);

      // Deduplicate by asin
      if (item.asin) {
        if (seenAsins.has(item.asin)) return false;
        seenAsins.add(item.asin);
      }

      return true;
    });
  }, [normalizedModel, normalizedPowertrain, selectedCategory]);

  // Overall completion for this vehicle with deduplication
  const totalModelItems = useMemo(() => {
    const list = productsData as ChecklistProduct[];
    const seenIds = new Set<string>();
    const seenAsins = new Set<string>();

    return list.filter((item) => {
      const modelMatch =
        item.models.includes('all') ||
        normalizedModel === 'all' ||
        item.models.includes(normalizedModel);
      if (!modelMatch) return false;
      if (item.powertrains && item.powertrains.length > 0) {
        if (!normalizedPowertrain || !item.powertrains.includes(normalizedPowertrain)) {
          return false;
        }
      }

      if (seenIds.has(item.id)) return false;
      seenIds.add(item.id);

      if (item.asin) {
        if (seenAsins.has(item.asin)) return false;
        seenAsins.add(item.asin);
      }

      return true;
    });
  }, [normalizedModel, normalizedPowertrain]);

  const completedCount = useMemo(() => {
    return totalModelItems.filter((item) => !!checkedItems[item.slug]).length;
  }, [totalModelItems, checkedItems]);

  const totalCompleted = completedCount;

  const getModelDisplayName = () => {
    if (vehicleLabel && normalizedModel !== 'all') {
      return vehicleLabel;
    }
    switch (normalizedModel) {
      case 'all':
        return 'Universal Toyota Gear';
      case 'sienna':
        return 'Sienna';
      case 'grand-highlander':
        return 'Grand Highlander';
      case 'land-cruiser':
        return 'Land Cruiser 250';
      case 'corolla-cross':
        return 'Corolla Cross';
      case 'corolla':
        return 'Corolla';
      case 'prius-prime':
        return 'Prius Prime (PHEV)';
      case 'prius':
        return 'Toyota Prius';
      case 'tacoma':
        return 'Tacoma';
      case 'sequoia':
        return 'Sequoia';
      case 'rav4':
        return normalizedPowertrain === 'phev' ? 'RAV4 Prime (PHEV)' : 'RAV4 (Hybrid/Prime)';
      default:
        return 'Your Toyota';
    }
  };

  return (
    <Card
      id="accessories"
      data-testid="delivery-prep-checklist"
      className={cn(
        'border-zinc-800 bg-zinc-950/60 rounded-xl overflow-hidden shadow-xs text-zinc-100 scroll-mt-24',
        className
      )}
    >
      <CardHeader className="p-4 pb-3 border-b border-zinc-800/80 bg-zinc-900/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-zinc-100 flex items-center gap-2">
              <Luggage className="h-4 w-4 text-amber-500 shrink-0" />
              <span>Essential Day-One Gear &amp; Drop-In Upgrades</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Community-vetted drop-in organizers, all-weather liners, and dashcam harnesses for {getModelDisplayName()}.
            </p>
          </div>

          {/* Secondary Toggle: View All Universal Delivery Gear */}
          {onToggleUniversalGear && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onToggleUniversalGear}
              className={cn(
                'text-xs h-7 sm:h-8 border-zinc-700 transition-all font-medium self-start sm:self-auto cursor-pointer shrink-0',
                showUniversalGear
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-400 hover:bg-amber-500/20'
                  : 'bg-zinc-900/80 text-zinc-300 hover:text-amber-400 hover:border-amber-500/40'
              )}
            >
              <SlidersHorizontal className="h-3 w-3 mr-1.5 text-amber-500 shrink-0" />
              {showUniversalGear ? `Filter to ${vehicleLabel || getModelDisplayName()} Only` : 'View All Universal Delivery Gear'}
            </Button>
          )}
        </div>

        {/* Primary Segmented Control: All Gear | 📦 Delivery Day 1 Checklist | 🛡️ Protection | ⚡ Tech & Comfort */}
        <div
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'auto' }}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar touch-auto overscroll-x-contain py-2 mt-2.5 border-t border-zinc-800/50 print:hidden"
        >
          {PRIMARY_FILTER_TABS.map((tab) => {
            const isSelected = selectedCategory === tab.id;
            const isDeliveryDayTab = tab.id === 'delivery_day_1';
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap',
                  isDeliveryDayTab
                    ? isSelected
                      ? 'border border-amber-500/40 text-amber-300 bg-amber-950/30 shadow-xs'
                      : 'border border-amber-500/20 text-amber-400/80 bg-amber-950/10 hover:border-amber-500/40 hover:text-amber-300 hover:bg-amber-950/20'
                    : isSelected
                    ? 'bg-zinc-800 text-white font-bold border border-zinc-700 shadow-xs'
                    : 'bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800/80'
                )}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Subtitle helper when Delivery Day 1 Checklist is active */}
        {selectedCategory === 'delivery_day_1' && (
          <p className="text-xs text-amber-300/90 font-medium px-1 py-1 print:hidden">
            Essential protection and plug-and-play accessories Canadian Toyota owners order before taking delivery.
          </p>
        )}

        {/* Category Filter Pills: Smooth horizontal scrolling with no-scrollbar */}
        <div
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'auto' }}
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-auto overscroll-x-contain py-1.5 print:hidden"
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer shrink-0 whitespace-nowrap',
                  isActive
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-xs'
                    : 'bg-zinc-800/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                )}
              >
                <Icon className="h-3 w-3 shrink-0" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Swipe Hint / Carousel Indicators */}
        <div className="flex items-center justify-between text-[11px] text-neutral-400 px-1 pt-1 mb-2 print:hidden">
          <span>Showing recommended gear</span>
          <span className="flex items-center gap-1 font-medium text-amber-400">
            <span className="animate-pulse">Swipe →</span>
          </span>
        </div>
      </CardHeader>

      {/* Checklist Items - Horizontal Snap Carousel rendered via ModCard with Desktop Nav Buttons */}
      <CardContent className="p-3 sm:p-4">
        {filteredProducts.length === 0 ? (
          <div className="p-6 text-center text-xs text-zinc-500 w-full">
            No accessories found matching this vehicle and filter criteria.
          </div>
        ) : (
          <div className="relative group">
            {/* Desktop Prev Button */}
            <button
              type="button"
              aria-label="Previous accessories"
              data-testid="gear-carousel-prev"
              disabled={!canScrollLeft}
              onClick={() => scrollByOneCard('left')}
              className={cn(
                'hidden md:flex items-center justify-center absolute -left-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full border border-zinc-700 bg-zinc-900/95 text-zinc-200 shadow-lg transition-all duration-200 cursor-pointer',
                'hover:bg-zinc-800 hover:text-white hover:border-amber-500/60',
                !canScrollLeft && 'opacity-0 pointer-events-none cursor-not-allowed'
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div
              ref={carouselRef}
              data-testid="gear-carousel-container"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseLeaveOrUp}
              onMouseLeave={handleMouseLeaveOrUp}
              onClickCapture={handleClickCapture}
              style={{
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
              className={cn(
                'flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-4 py-2 touch-pan-x overscroll-x-contain [-webkit-overflow-scrolling:touch] cursor-grab active:cursor-grabbing select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
                isDragging && 'cursor-grabbing scroll-auto snap-none'
              )}
            >
              {filteredProducts.map((item) => (
                <ModCard
                  key={item.id || item.slug}
                  item={item}
                  isChecked={!!checkedItems[item.slug]}
                  onToggle={toggleItem}
                  showCheckbox={true}
                  isDragging={isDragging}
                  activeModel={normalizedModel !== 'all' ? normalizedModel : undefined}
                />
              ))}
            </div>

            {/* Desktop Next Button */}
            <button
              type="button"
              aria-label="Next accessories"
              data-testid="gear-carousel-next"
              disabled={!canScrollRight}
              onClick={() => scrollByOneCard('right')}
              className={cn(
                'hidden md:flex items-center justify-center absolute -right-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full border border-zinc-700 bg-zinc-900/95 text-zinc-200 shadow-lg transition-all duration-200 cursor-pointer',
                'hover:bg-zinc-800 hover:text-white hover:border-amber-500/60',
                !canScrollRight && 'opacity-0 pointer-events-none cursor-not-allowed'
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </CardContent>

      {/* Card Footer Disclosures */}
      <CardFooter className="p-3.5 sm:p-4 bg-zinc-950/80 border-t border-zinc-800/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
          <ShieldCheck className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          <span>
            Community-vetted gear. Outbound links support {isUs ? 'ToyotaWaits.com' : 'ToyotaWaits.ca'} without tracking your personal data.
          </span>
        </div>

        {totalCompleted > 0 && (
          <button
            type="button"
            onClick={resetChecklist}
            className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer print:hidden"
          >
            <RotateCcw className="h-3 w-3" />
            Reset Checks
          </button>
        )}
      </CardFooter>
    </Card>
  );
}
