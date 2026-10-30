import React from 'react';
import Link from 'next/link';
import { getAllModelConfigs } from '@/lib/data/model-registry';
import { toCanonicalWaitTimeSlug } from '@/lib/calculator-model-helpers';

export function ModelDirectory() {
  const models = getAllModelConfigs();

  return (
    <div className="border-t border-zinc-200 dark:border-zinc-800 py-8 my-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Canadian Toyota Wait Time Trackers by Model
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Crowdsourced 2026 delivery timelines, dealer allocation spreads, and provincial wait times across Canada.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 pt-1 text-xs">
          {models.map((m) => (
            <Link
              key={m.slug}
              href={`https://www.toyotawaits.ca/wait-times/${toCanonicalWaitTimeSlug(m.slug)}`}
              className="group flex flex-col p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-red-500/40 hover:bg-red-50/50 dark:hover:bg-red-950/20 hover:text-red-700 dark:hover:text-red-400 transition-all shadow-2xs"
              title={`Toyota ${m.name} Delivery Wait Times Canada`}
            >
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-400 truncate">
                Toyota {m.name} Delivery Wait Times
              </span>
              <span className="text-[11px] text-zinc-500 truncate mt-0.5">
                {m.powertrains.join(', ')}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ModelDirectory;
