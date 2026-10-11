'use client';

import React, { useState, useEffect, useMemo } from 'react';
import productsData from '@/lib/data/affiliate-products.json';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ClipboardCheck,
  Eye,
  Layers,
  ShieldAlert,
  Printer,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  RotateCcw,
  Luggage,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModCard } from '@/components/delivery-prep/mod-card';

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
}

export interface InspectionCheckItem {
  id: string;
  category: string;
  title: string;
  badge: string;
  badgeColor?: string;
  description: string;
  tips: string[];
}

export const DELIVERY_INSPECTION_ITEMS: InspectionCheckItem[] = [
  {
    id: 'inspect-bill-of-sale',
    category: 'Paperwork & Finance',
    title: 'Bill of Sale & Pricing Verification',
    badge: 'Mandatory',
    badgeColor: 'border-red-500/30 text-red-400 bg-red-500/10',
    description: 'Verify final drive-away price matches your original signed vehicle order and MSRP agreement before handing over payment.',
    tips: [
      'Check that documentation fees adhere strictly to provincial OMVIC/AMVIC/VSA guidelines.',
      'Ensure dealer has not added mandatory protection packages (etching, tire warranty, nitrogen fill, paint guard).',
      'For PHEV/Prime: verify federal iZEV ($5,000) and provincial rebates are deducted directly off the bill of sale.',
    ],
  },
  {
    id: 'inspect-key-fobs',
    category: 'Handover Deliverables',
    title: 'Physical Key Fobs & Deliverables Handover',
    badge: 'Critical',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    description: 'Audit physical keys and supplied accessories due to Toyota global smart key allocation guidelines.',
    tips: [
      'Confirm physical key count: Most 2024-2026 Toyotas deliver with 1 smart key + 1 mechanical key. Demand an official Toyota 2nd key allocation IOU voucher in writing.',
      'Ensure wheel lock security key socket is inside glovebox/cargo tray (if lock nuts equipped).',
      'For Prime/PHEV: confirm Level 1 (120V) OEM emergency charging cord is present in cargo sub-floor.',
      'Verify owner manual packet, warranty book, and roadside assistance card.',
    ],
  },
  {
    id: 'inspect-pdi-exterior',
    category: 'Exterior & PDI',
    title: 'Exterior Paint & PDI Transport Spacer Removal',
    badge: 'Inspection',
    badgeColor: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
    description: 'Inspect vehicle outdoors in bright daylight before signing delivery acceptance; never under dim delivery-bay lights.',
    tips: [
      'Inspect front bumper chin, rocker panels, and tailgate lip for transit tie-down gouges and rail-dust fallout.',
      'CRITICAL: Verify front/rear strut suspension transport blocks (yellow/orange plastic shipping spacers) were removed during Pre-Delivery Inspection (PDI).',
      'Check all 4 rims for carrier strap curb rash and ensure tire pressure matches door jamb spec (transport prep often over-inflates to 45+ PSI).',
    ],
  },
  {
    id: 'inspect-hybrid-systems',
    category: 'Hybrid & Cabin',
    title: 'Hybrid Battery Vent & Electronics Verification',
    badge: 'Pro Tip',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    description: 'Verify high-voltage safety clearances and interior electrical systems before pulling onto the road.',
    tips: [
      'Verify the hybrid battery cooling air intake vent (located below rear passenger seat) has its factory filter screen seated and unobstructed.',
      'Check odometer: Brand-new dealer arrivals typically show 5 to 30 km. If over 50 km, ask for explanation in writing.',
      'Pair your smartphone with Toyota Multimedia (wireless Apple CarPlay / Android Auto) and confirm TSS 3.0 dash cameras initialize without warnings.',
    ],
  },
];

export interface DeliveryPrepChecklistProps {
  model?: string;
  powertrain?: string;
  className?: string;
  defaultExpanded?: boolean;
}

const CATEGORIES = [
  { id: 'all', label: 'All Essentials', icon: ClipboardCheck },
  { id: 'visibility_protection', label: 'Visibility & Tech', icon: Eye },
  { id: 'cabin_organization', label: 'Interior Protection', icon: Layers },
  { id: 'cargo_utility', label: 'Cargo & Utility', icon: Luggage },
  { id: 'roadside_winter', label: 'Roadside Armor', icon: ShieldAlert },
] as const;

function matchesCategory(item: ChecklistProduct, selectedCategory: string): boolean {
  if (selectedCategory === 'all') return true;

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
}: DeliveryPrepChecklistProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Normalize model and powertrain slugs
  const normalizedModel = useMemo(() => {
    const m = (model || '').toLowerCase().trim();
    if (m.includes('sienna')) return 'sienna';
    if (m.includes('grand') || m.includes('highlander')) return 'grand-highlander';
    if (m.includes('land') || m.includes('cruiser') || m.includes('lc250') || m.includes('1958')) return 'land-cruiser';
    if (m.includes('corolla') || m.includes('cross')) return 'corolla-cross';
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

  const completedInspectionCount = useMemo(() => {
    return DELIVERY_INSPECTION_ITEMS.filter((item) => !!checkedItems[item.id]).length;
  }, [checkedItems]);

  const totalChecklistItems = totalModelItems.length + DELIVERY_INSPECTION_ITEMS.length;
  const totalCompleted = completedCount + completedInspectionCount;

  const completionPercent = totalChecklistItems > 0
    ? Math.round((totalCompleted / totalChecklistItems) * 100)
    : 0;

  const handlePrint = () => {
    window.print();
  };

  const getModelDisplayName = () => {
    switch (normalizedModel) {
      case 'sienna':
        return 'Toyota Sienna';
      case 'grand-highlander':
        return 'Grand Highlander';
      case 'land-cruiser':
        return 'Land Cruiser 250';
      case 'corolla-cross':
        return 'Corolla Cross';
      case 'rav4':
        return normalizedPowertrain === 'phev' ? 'RAV4 Prime (PHEV)' : 'RAV4';
      default:
        return 'Your Toyota';
    }
  };

  return (
    <Card
      id="accessories"
      data-testid="delivery-prep-checklist"
      className={cn(
        'border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-sm print:border-none print:shadow-none text-zinc-100 scroll-mt-24',
        className
      )}
    >
      {/* Header Bar */}
      <CardHeader className="p-4 sm:p-5 border-b border-zinc-800/80 bg-zinc-900/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-500 text-zinc-950 font-bold text-[10px] sm:text-xs hover:bg-amber-400 gap-1 border-none">
                <ClipboardCheck className="h-3 w-3" />
                Delivery Day Prep Checklist
              </Badge>
              <Badge variant="outline" className="text-[10px] sm:text-xs border-amber-500/30 text-amber-400 bg-amber-500/5">
                {getModelDisplayName()}
              </Badge>
            </div>
            <CardTitle className="text-base sm:text-lg font-bold text-zinc-100">
              Glovebox Essentials &amp; Rainy-Day Armor
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400 italic font-serif">
              &ldquo;Glovebox essentials and rainy-day armor while you wait out the clock.&rdquo;
              <span className="block mt-1 font-sans not-italic text-[11px] text-zinc-400">
                As an Amazon Associate I earn from qualifying purchases.
              </span>
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto print:hidden">
            <div className="text-right hidden sm:block">
              <div className="text-[11px] font-semibold text-zinc-300">
                {totalCompleted} of {totalChecklistItems} Checked
              </div>
              <div className="text-[10px] text-zinc-500">
                {completionPercent}% Ready for Delivery
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-xs h-8 gap-1.5 border-zinc-700 bg-zinc-900/60 text-zinc-300 hover:text-amber-400 hover:border-amber-500/50"
              title="Print checklist for delivery day"
            >
              <Printer className="h-3.5 w-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Print</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs h-8 w-8 p-0 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
              aria-label={isExpanded ? 'Collapse Checklist' : 'Expand Checklist'}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Amber progress bar */}
        <div className="w-full bg-zinc-800/80 h-1.5 rounded-full overflow-hidden mt-3 print:hidden">
          <div
            className="bg-amber-500 h-full transition-all duration-300"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </CardHeader>

      {/* Expandable Body */}
      {isExpanded && (
        <>
          {/* Community Transparency Disclosure Banner */}
          <div
            data-testid="affiliate-disclosure-banner"
            className="mx-4 sm:mx-5 mt-4 p-3.5 sm:p-4 rounded-lg border border-amber-500/20 bg-amber-500/5 text-xs text-zinc-300 flex items-start gap-2.5 print:hidden"
          >
            <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-amber-400 font-semibold">Community Transparency:</strong> Some links on this page are affiliate links. If you purchase through them, we may earn a small commission at no additional cost to you, which directly funds hosting, database infrastructure, and keeping this tracker open and ad-free. As an Amazon Associate I earn from qualifying purchases.
            </p>
          </div>

          {/* 1. Dealership Pickup Inspection Steps (Inspection, Bill of Sale, Key Fobs) */}
          <div className="mx-4 sm:mx-5 mt-4 p-4 sm:p-5 rounded-xl border border-zinc-800 bg-zinc-950/40 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-zinc-100 flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>Dealership Pickup Day Inspection Steps</span>
                </h4>
                <p className="text-xs text-zinc-400">
                  Audit these mandatory checkpoints with your delivery specialist before signing final vehicle acceptance.
                </p>
              </div>
              <div className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 self-start sm:self-auto shrink-0">
                {completedInspectionCount} of {DELIVERY_INSPECTION_ITEMS.length} Verified
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {DELIVERY_INSPECTION_ITEMS.map((item) => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={cn(
                      'p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2.5 select-none',
                      isChecked
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-zinc-300 shadow-2xs'
                        : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700 text-zinc-200'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={isChecked}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleItem(item.id);
                          }}
                          className={cn(
                            'h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors cursor-pointer',
                            isChecked
                              ? 'bg-emerald-500 border-emerald-500 text-zinc-950'
                              : 'border-zinc-600 bg-zinc-800/80 hover:border-amber-400'
                          )}
                        >
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </button>
                        <span className={cn('text-xs font-bold leading-snug', isChecked && 'line-through text-zinc-400')}>
                          {item.title}
                        </span>
                      </div>
                      <Badge variant="outline" className={cn('text-[10px] font-bold px-1.5 py-0 shrink-0', item.badgeColor)}>
                        {item.badge}
                      </Badge>
                    </div>

                    <p className="text-[11px] text-zinc-400 leading-relaxed pl-6">
                      {item.description}
                    </p>

                    <ul className="text-[10px] text-zinc-400 space-y-1 pl-6 pt-1.5 border-t border-zinc-800/60">
                      {item.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold shrink-0">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Curated Essential Gear & Mods Section */}
          <div className="space-y-0 pt-2">
            <div className="p-4 sm:p-5 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Luggage className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>Essential Day-One Gear &amp; Drop-In Upgrades</span>
                </h4>
                <p className="text-xs text-zinc-400">
                  Community-vetted drop-in organizers, all-weather liners, and dashcam harnesses for {getModelDisplayName()}.
                </p>
              </div>
            </div>

            {/* Category Navigation Tabs */}
            <div className="px-4 sm:px-5 pb-3 border-b border-zinc-800/60 flex flex-wrap gap-1.5 print:hidden">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer',
                      isActive
                        ? 'bg-amber-500 text-zinc-950 font-bold shadow-xs'
                        : 'bg-zinc-800/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Checklist Items - Vertical Stack rendered via ModCard */}
            <CardContent className="p-4 sm:p-5 space-y-3.5">
              {filteredProducts.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-500">
                  No accessories found matching this vehicle and filter criteria.
                </div>
              ) : (
                filteredProducts.map((item) => (
                  <ModCard
                    key={item.id || item.slug}
                    item={item}
                    isChecked={!!checkedItems[item.slug]}
                    onToggle={toggleItem}
                    showCheckbox={true}
                  />
                ))
              )}
            </CardContent>
          </div>

          {/* Card Footer Disclosures */}
          <CardFooter className="p-4 bg-zinc-950/60 border-t border-zinc-800/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
            <div className="flex flex-col gap-1 text-[11px] text-zinc-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>
                  Community-vetted gear. Outbound links support ToyotaWaits.ca without tracking your personal data.
                </span>
              </div>
              <span className="text-zinc-500 text-[10px]">
                As an Amazon Associate I earn from qualifying purchases.
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
        </>
      )}
    </Card>
  );
}
