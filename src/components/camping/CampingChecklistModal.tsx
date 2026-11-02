'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  X,
  Printer,
  RotateCcw,
  CheckCircle2,
  ListChecks,
  Filter,
  Check,
  Sparkles,
} from 'lucide-react';

export interface ChecklistItem {
  category: string;
  item: string;
}

export interface CampingChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleName: string;
  defaultItems: ChecklistItem[];
}

export function CampingChecklistModal({
  isOpen,
  onClose,
  vehicleName,
  defaultItems,
}: CampingChecklistModalProps) {
  const storageKey = useMemo(() => {
    const sanitized = vehicleName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    return `toyotawaits_camping_checklist_${sanitized}`;
  }, [vehicleName]);

  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [filterMode, setFilterMode] = useState<'all' | 'remaining'>('all');

  // Load from localStorage on mount or when storageKey changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCheckedMap(JSON.parse(saved));
      } else {
        setCheckedMap({});
      }
    } catch {
      setCheckedMap({});
    }
  }, [storageKey, isOpen]);

  // Handle escape key and body overflow
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  const toggleItem = useCallback(
    (itemKey: string) => {
      setCheckedMap((prev) => {
        const next = { ...prev, [itemKey]: !prev[itemKey] };
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          // localStorage failure fallback
        }
        return next;
      });
    },
    [storageKey]
  );

  const resetChecklist = useCallback(() => {
    setCheckedMap({});
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // localStorage failure fallback
    }
  }, [storageKey]);

  const handlePrint = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }, []);

  // Compute counts
  const totalCount = defaultItems.length;
  const completedCount = useMemo(() => {
    return defaultItems.filter((i) => checkedMap[`${i.category}:::${i.item}`]).length;
  }, [defaultItems, checkedMap]);
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Group items by category, applying 'remaining' filter if selected
  const groupedItems = useMemo(() => {
    const groups: Record<string, { item: string; checked: boolean; key: string }[]> = {};

    for (const def of defaultItems) {
      const key = `${def.category}:::${def.item}`;
      const checked = Boolean(checkedMap[key]);

      if (filterMode === 'remaining' && checked) {
        continue;
      }

      if (!groups[def.category]) {
        groups[def.category] = [];
      }
      groups[def.category].push({ item: def.item, checked, key });
    }

    return groups;
  }, [defaultItems, checkedMap, filterMode]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checklist-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-slate-800 bg-slate-900/60">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <ListChecks className="w-3.5 h-3.5" />
              <span>Overland Readiness</span>
            </div>
            <h2 id="checklist-modal-title" className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {vehicleName} Camping Checklist
            </h2>
            <p className="text-xs text-slate-400">
              Field-tested packing checklist stored locally on your device.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close checklist"
            className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress & Controls Bar */}
        <div className="p-4 sm:px-6 bg-slate-900/40 border-b border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Packed Progress:</span>
              <span className="font-bold text-amber-400">
                {completedCount} of {totalCount} items ({progressPercent}%)
              </span>
            </div>
            {completedCount === totalCount && totalCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready for the trail!
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Filters and Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            {/* All vs Remaining filter */}
            <div className="inline-flex rounded-lg border border-slate-800 bg-slate-900/80 p-0.5">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  filterMode === 'all'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('remaining')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  filterMode === 'remaining'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Remaining ({totalCount - completedCount})
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetChecklist}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title="Reset all checkboxes"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Checklist</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 font-semibold transition-colors"
                title="Print or save as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Checklist Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {Object.keys(groupedItems).length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs sm:text-sm space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="font-semibold text-white">All items packed!</p>
              <p className="text-slate-500">Switch filter to &quot;All&quot; to review your complete pack list.</p>
            </div>
          ) : (
            Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="space-y-2.5">
                <div className="flex items-center justify-between pb-1 border-b border-slate-800/60">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>{category}</span>
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {items.filter((i) => i.checked).length} / {items.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {items.map(({ item, checked, key }) => (
                    <label
                      key={key}
                      className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-all cursor-pointer select-none text-xs ${
                        checked
                          ? 'border-emerald-500/30 bg-emerald-950/20 text-slate-400 line-through'
                          : 'border-slate-800/80 bg-slate-900/60 text-slate-200 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleItem(key)}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-colors ${
                          checked
                            ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                            : 'border-slate-700 bg-slate-950 hover:border-amber-500'
                        }`}
                      >
                        {checked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="leading-tight">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400">
          <span className="text-[11px] text-slate-500">
            Auto-saved to browser localStorage
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default CampingChecklistModal;
export { CampingChecklistTrigger } from './CampingChecklistTrigger';
