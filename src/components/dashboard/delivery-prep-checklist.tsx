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
  ExternalLink,
  Printer,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ChecklistProduct {
  id: string;
  slug: string;
  models: string[];
  powertrains?: string[];
  category: 'visibility_protection' | 'cabin_organization' | 'roadside_winter';
  title: string;
  utilityNote: string;
  priceEstCad: string;
  destinationUrl: string;
}

export interface DeliveryPrepChecklistProps {
  model?: string;
  powertrain?: string;
  className?: string;
  defaultExpanded?: boolean;
}

const CATEGORIES = [
  { id: 'all', label: 'All Essentials', icon: ClipboardCheck },
  { id: 'visibility_protection', label: 'Visibility & Protection', icon: Eye },
  { id: 'cabin_organization', label: 'Cabin Organization', icon: Layers },
  { id: 'roadside_winter', label: 'Roadside & Cold Weather', icon: ShieldAlert },
] as const;

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
        setCheckedItems(JSON.parse(saved));
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

  // Filter items matching model and powertrain
  const filteredProducts = useMemo(() => {
    const list = productsData as ChecklistProduct[];
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
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [normalizedModel, normalizedPowertrain, selectedCategory]);

  // Overall completion for this vehicle
  const totalModelItems = useMemo(() => {
    const list = productsData as ChecklistProduct[];
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
      return true;
    });
  }, [normalizedModel, normalizedPowertrain]);

  const completedCount = useMemo(() => {
    return totalModelItems.filter((item) => !!checkedItems[item.slug]).length;
  }, [totalModelItems, checkedItems]);

  const completionPercent = totalModelItems.length > 0
    ? Math.round((completedCount / totalModelItems.length) * 100)
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
      case 'rav4':
        return normalizedPowertrain === 'phev' ? 'RAV4 Prime (PHEV)' : 'RAV4';
      default:
        return 'Your Toyota';
    }
  };

  return (
    <Card
      data-testid="delivery-prep-checklist"
      className={cn(
        'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70 overflow-hidden shadow-sm print:border-none print:shadow-none',
        className
      )}
    >
      {/* Header Bar */}
      <CardHeader className="p-4 sm:p-5 border-b border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-50/50 dark:bg-zinc-900/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-500 text-zinc-950 font-bold text-[10px] sm:text-xs hover:bg-amber-400 gap-1">
                <ClipboardCheck className="h-3 w-3" />
                Delivery Day Prep Checklist
              </Badge>
              <Badge variant="outline" className="text-[10px] sm:text-xs border-amber-500/30 text-amber-500 dark:text-amber-400">
                {getModelDisplayName()}
              </Badge>
            </div>
            <CardTitle className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Glovebox Essentials &amp; Rainy-Day Armor
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400 italic font-serif">
              &ldquo;Glovebox essentials and rainy-day armor while you wait out the clock.&rdquo;
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto print:hidden">
            <div className="text-right hidden sm:block">
              <div className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                {completedCount} of {totalModelItems.length} Acquired
              </div>
              <div className="text-[10px] text-zinc-400">
                {completionPercent}% Ready for Delivery
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-xs h-8 gap-1.5 border-zinc-300 dark:border-zinc-700 hover:text-amber-500"
              title="Print checklist for delivery day"
            >
              <Printer className="h-3.5 w-3.5 text-zinc-500" />
              <span className="hidden sm:inline">Print</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs h-8 w-8 p-0 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              aria-label={isExpanded ? 'Collapse Checklist' : 'Expand Checklist'}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-3 print:hidden">
          <div
            className="bg-amber-500 h-full transition-all duration-300"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </CardHeader>

      {/* Expandable Body */}
      {isExpanded && (
        <>
          {/* Category Navigation */}
          <div className="p-3 sm:p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-100/40 dark:bg-zinc-900/20 flex flex-wrap gap-1.5 print:hidden">
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
                      : 'bg-zinc-200/60 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                  )}
                >
                  <Icon className="h-3 w-3" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Checklist Items */}
          <CardContent className="p-4 sm:p-5 space-y-3">
            {filteredProducts.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-500">
                No accessories found matching this vehicle and filter criteria.
              </div>
            ) : (
              filteredProducts.map((item) => {
                const isChecked = !!checkedItems[item.slug];
                return (
                  <div
                    key={item.slug}
                    data-testid={`checklist-item-${item.slug}`}
                    className={cn(
                      'rounded-xl border p-3.5 sm:p-4 transition-all duration-150 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3',
                      isChecked
                        ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/15'
                        : 'border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-900/40 hover:border-amber-500/30'
                    )}
                  >
                    {/* Left: Checkbox & Info */}
                    <div className="flex items-start gap-3 flex-1">
                      <button
                        type="button"
                        onClick={() => toggleItem(item.slug)}
                        aria-checked={isChecked}
                        role="checkbox"
                        className={cn(
                          'mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-colors cursor-pointer',
                          isChecked
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-amber-500'
                        )}
                      >
                        {isChecked && <CheckCircle2 className="h-4 w-4" />}
                      </button>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              'text-sm font-bold',
                              isChecked
                                ? 'line-through text-zinc-400 dark:text-zinc-500'
                                : 'text-zinc-900 dark:text-zinc-100'
                            )}
                          >
                            {item.title}
                          </span>
                          <span className="text-[11px] font-mono font-semibold text-amber-600 dark:text-amber-400">
                            {item.priceEstCad}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                          {item.utilityNote}
                        </p>
                      </div>
                    </div>

                    {/* Right: Outbound Action Button */}
                    <div className="sm:self-center shrink-0 w-full sm:w-auto pt-2 sm:pt-0 print:hidden">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="w-full sm:w-auto text-xs h-8 gap-1.5 border-zinc-300 dark:border-zinc-700 hover:border-amber-500/60 hover:bg-amber-500/10 cursor-pointer"
                      >
                        <a
                          href={`/out/${item.slug}`}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                        >
                          <span>View Item</span>
                          <ExternalLink className="h-3 w-3 text-amber-500 shrink-0" />
                        </a>
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>

          {/* Card Footer Disclosures */}
          <CardFooter className="p-4 bg-zinc-50/50 dark:bg-zinc-900/30 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
            <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-[11px]">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              <span>
                Community-vetted gear. Outbound links support ToyotaWaits.ca without tracking your personal data.
              </span>
            </div>

            {completedCount > 0 && (
              <button
                type="button"
                onClick={resetChecklist}
                className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer print:hidden"
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
