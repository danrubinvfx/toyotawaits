'use client';

import React from 'react';
import { Printer } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PrintButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== 'undefined') {
          window.print();
        }
      }}
      className={cn(
        'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-xs font-semibold text-zinc-200 hover:text-white transition-all shadow-sm cursor-pointer',
        className
      )}
    >
      <Printer className="h-3.5 w-3.5 text-amber-400" />
      <span>Print Checklist</span>
    </button>
  );
}
