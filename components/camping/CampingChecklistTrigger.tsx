'use client';

import React, { useState } from 'react';
import {
  CampingChecklistModal,
  type ChecklistItem,
} from './CampingChecklistModal';
import { ListChecks } from 'lucide-react';

export interface CampingChecklistTriggerProps {
  vehicleName: string;
  defaultItems: ChecklistItem[];
  buttonLabel?: string;
  className?: string;
}

export function CampingChecklistTrigger({
  vehicleName,
  defaultItems,
  buttonLabel,
  className,
}: CampingChecklistTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          className ||
          'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]'
        }
      >
        <ListChecks className="w-4 h-4 text-slate-950" />
        <span>{buttonLabel || `Open ${vehicleName} Camping Checklist`}</span>
      </button>

      <CampingChecklistModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        vehicleName={vehicleName}
        defaultItems={defaultItems}
      />
    </>
  );
}

export default CampingChecklistTrigger;
