'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
  Check,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

const LOCAL_STORAGE_KEY = 'toyotawaits_prep_checklist_checks';

export interface PickupChecklistProps {
  model?: string;
  checkedItems?: Record<string, boolean>;
  onToggle?: (id: string) => void;
  onReset?: () => void;
  className?: string;
  defaultOpen?: boolean;
}

export function PickupChecklist({
  checkedItems,
  onToggle,
  onReset,
  className,
  defaultOpen = false,
}: PickupChecklistProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [internalChecked, setInternalChecked] = useState<Record<string, boolean>>({});

  // Sync internal state with localStorage if checkedItems prop not provided
  useEffect(() => {
    if (checkedItems) return;
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setInternalChecked(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, [checkedItems]);

  // Listen to URL hash #checklist or ?checklist=open or custom open event
  useEffect(() => {
    const checkHashOrQuery = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      if (hash === '#checklist' || params.get('checklist') === 'open') {
        setIsOpen(true);
        setTimeout(() => {
          const el = document.getElementById('checklist');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 50);
      }
    };

    checkHashOrQuery();

    const handleHashChange = () => {
      checkHashOrQuery();
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
      setTimeout(() => {
        const el = document.getElementById('checklist');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('toyotawait:open-checklist', handleCustomOpen);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('toyotawait:open-checklist', handleCustomOpen);
    };
  }, []);

  const activeChecks = checkedItems || internalChecked;

  const handleToggle = (id: string) => {
    if (onToggle) {
      onToggle(id);
    } else {
      setInternalChecked((prev) => {
        const next = { ...prev, [id]: !prev[id] };
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
        } catch {
          // Ignore storage errors
        }
        return next;
      });
    }
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      setInternalChecked({});
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch {
        // Ignore storage errors
      }
    }
  };

  const totalCount = DELIVERY_INSPECTION_ITEMS.length;
  const verifiedCount = DELIVERY_INSPECTION_ITEMS.filter((item) => !!activeChecks[item.id]).length;

  return (
    <div
      id="checklist"
      data-testid="pickup-checklist-container"
      className={cn('scroll-mt-24 rounded-xl border border-zinc-800 bg-zinc-950/40 overflow-hidden transition-all', className)}
    >
      {/* Compact Accordion Header Bar */}
      <div
        data-testid="pickup-checklist-header"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'p-3 sm:p-4 transition-colors cursor-pointer select-none flex flex-col sm:flex-row sm:items-center justify-between gap-2.5',
          isOpen ? 'bg-zinc-900/80 border-b border-zinc-800/80' : 'hover:bg-zinc-900/40'
        )}
      >
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-amber-500 shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-zinc-100 tracking-tight">
              📋 Dealership Pickup Day Checklist
            </span>
          </div>

          <Badge
            variant="outline"
            className={cn(
              'text-[10px] font-semibold px-2 py-0.5',
              verifiedCount === totalCount
                ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                : 'border-amber-500/30 text-amber-400 bg-amber-500/10'
            )}
          >
            {verifiedCount} of {totalCount} Verified
          </Badge>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen((prev) => !prev);
            }}
            className="h-7 px-2.5 text-xs font-semibold text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 gap-1.5 cursor-pointer"
            aria-expanded={isOpen}
          >
            <span>{isOpen ? 'Hide Checklist ▴' : `View ${totalCount} Inspection Checks ▾`}</span>
          </Button>
        </div>
      </div>

      {/* Expanded Accordion Body */}
      {isOpen && (
        <div data-testid="pickup-checklist-body" className="p-3.5 sm:p-5 space-y-3.5 bg-zinc-950/20">
          <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 text-xs text-zinc-300 flex items-start gap-2 print:hidden">
            <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-zinc-300">
              Audit these {totalCount} critical checkpoints with your delivery specialist before signing final vehicle acceptance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {DELIVERY_INSPECTION_ITEMS.map((item) => {
              const isChecked = !!activeChecks[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => handleToggle(item.id)}
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
                          handleToggle(item.id);
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

          {/* Bottom Accordion Action Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs">
            {verifiedCount > 0 ? (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer print:hidden"
              >
                <RotateCcw className="h-3 w-3" />
                Reset Inspection Checks
              </button>
            ) : (
              <div />
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-7 px-3 text-[11px] font-semibold text-zinc-300 hover:text-amber-400 border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 gap-1 cursor-pointer"
            >
              <span>Collapse Checklist ▴</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PickupChecklist;
