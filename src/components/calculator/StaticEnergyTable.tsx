import React from 'react';
import {
  calculateAnnualGasCost,
  calculateAnnualPHEVCost,
} from '@/lib/calculator-engine';
import { Badge } from '@/components/ui/badge';

interface BenchmarkVehicle {
  name: string;
  category: 'Trade-in Baseline' | 'Toyota Hybrid' | 'Toyota PHEV';
  powertrain: 'GAS' | 'HEV' | 'PHEV';
  combinedRating: string;
  status: 'VERIFIED' | 'PROVISIONAL' | 'HISTORICAL';
  cost15k: number;
  cost20k: number;
  cost25k: number;
}

export function StaticEnergyTable() {
  const gasPrice = 1.75; // $ CAD / L
  const electricRate = 0.14; // $ CAD / kWh
  const phevShare = 0.65; // 65% EV

  const benchmarks: BenchmarkVehicle[] = [
    // Baselines
    {
      name: 'Compact Crossover Gas AWD (e.g. 2018 RAV4/CR-V)',
      category: 'Trade-in Baseline',
      powertrain: 'GAS',
      combinedRating: '9.5 L/100km',
      status: 'HISTORICAL',
      cost15k: calculateAnnualGasCost(15000, 9.5, gasPrice),
      cost20k: calculateAnnualGasCost(20000, 9.5, gasPrice),
      cost25k: calculateAnnualGasCost(25000, 9.5, gasPrice),
    },
    {
      name: 'Sedan Gas (e.g. 2017 Corolla/Civic/Camry)',
      category: 'Trade-in Baseline',
      powertrain: 'GAS',
      combinedRating: '8.2 L/100km',
      status: 'HISTORICAL',
      cost15k: calculateAnnualGasCost(15000, 8.2, gasPrice),
      cost20k: calculateAnnualGasCost(20000, 8.2, gasPrice),
      cost25k: calculateAnnualGasCost(25000, 8.2, gasPrice),
    },
    {
      name: 'Full-Size Truck Gas 4x4 (e.g. 2018 Tundra/F-150)',
      category: 'Trade-in Baseline',
      powertrain: 'GAS',
      combinedRating: '13.5 L/100km',
      status: 'HISTORICAL',
      cost15k: calculateAnnualGasCost(15000, 13.5, gasPrice),
      cost20k: calculateAnnualGasCost(20000, 13.5, gasPrice),
      cost25k: calculateAnnualGasCost(25000, 13.5, gasPrice),
    },

    {
      name: 'Minivan Gas V6 (e.g. 2018 Sienna/Caravan/Odyssey)',
      category: 'Trade-in Baseline',
      powertrain: 'GAS',
      combinedRating: '11.2 L/100km',
      status: 'HISTORICAL',
      cost15k: calculateAnnualGasCost(15000, 11.2, gasPrice),
      cost20k: calculateAnnualGasCost(20000, 11.2, gasPrice),
      cost25k: calculateAnnualGasCost(25000, 11.2, gasPrice),
    },
    {
      name: '3-Row Midsize SUV Gas V6 (e.g. 2018 Highlander/Explorer)',
      category: 'Trade-in Baseline',
      powertrain: 'GAS',
      combinedRating: '11.5 L/100km',
      status: 'HISTORICAL',
      cost15k: calculateAnnualGasCost(15000, 11.5, gasPrice),
      cost20k: calculateAnnualGasCost(20000, 11.5, gasPrice),
      cost25k: calculateAnnualGasCost(25000, 11.5, gasPrice),
    },

    // 2026 Models
    {
      name: '2026 Toyota RAV4 Hybrid AWD',
      category: 'Toyota Hybrid',
      powertrain: 'HEV',
      combinedRating: '5.8 L/100km',
      status: 'PROVISIONAL',
      cost15k: calculateAnnualGasCost(15000, 5.8, gasPrice),
      cost20k: calculateAnnualGasCost(20000, 5.8, gasPrice),
      cost25k: calculateAnnualGasCost(25000, 5.8, gasPrice),
    },
    {
      name: '2026 Toyota RAV4 PHEV AWD (Prime)',
      category: 'Toyota PHEV',
      powertrain: 'PHEV',
      combinedRating: '80 km EV • 21.5 kWh • 6.0 L',
      status: 'PROVISIONAL',
      cost15k: calculateAnnualPHEVCost(15000, phevShare, 21.5, electricRate, 6.0, gasPrice).totalCost,
      cost20k: calculateAnnualPHEVCost(20000, phevShare, 21.5, electricRate, 6.0, gasPrice).totalCost,
      cost25k: calculateAnnualPHEVCost(25000, phevShare, 21.5, electricRate, 6.0, gasPrice).totalCost,
    },

    // 2025 Verified Models
    {
      name: '2025 Toyota Prius Hybrid AWD',
      category: 'Toyota Hybrid',
      powertrain: 'HEV',
      combinedRating: '4.8 L/100km',
      status: 'VERIFIED',
      cost15k: calculateAnnualGasCost(15000, 4.8, gasPrice),
      cost20k: calculateAnnualGasCost(20000, 4.8, gasPrice),
      cost25k: calculateAnnualGasCost(25000, 4.8, gasPrice),
    },
    {
      name: '2025 Toyota Camry Hybrid',
      category: 'Toyota Hybrid',
      powertrain: 'HEV',
      combinedRating: '4.6 L/100km',
      status: 'VERIFIED',
      cost15k: calculateAnnualGasCost(15000, 4.6, gasPrice),
      cost20k: calculateAnnualGasCost(20000, 4.6, gasPrice),
      cost25k: calculateAnnualGasCost(25000, 4.6, gasPrice),
    },
    {
      name: '2025 Toyota Sienna Hybrid AWD',
      category: 'Toyota Hybrid',
      powertrain: 'HEV',
      combinedRating: '6.6 L/100km',
      status: 'VERIFIED',
      cost15k: calculateAnnualGasCost(15000, 6.6, gasPrice),
      cost20k: calculateAnnualGasCost(20000, 6.6, gasPrice),
      cost25k: calculateAnnualGasCost(25000, 6.6, gasPrice),
    },
    {
      name: '2025 Toyota Grand Highlander Hybrid AWD',
      category: 'Toyota Hybrid',
      powertrain: 'HEV',
      combinedRating: '7.0 L/100km',
      status: 'VERIFIED',
      cost15k: calculateAnnualGasCost(15000, 7.0, gasPrice),
      cost20k: calculateAnnualGasCost(20000, 7.0, gasPrice),
      cost25k: calculateAnnualGasCost(25000, 7.0, gasPrice),
    },
  ];

  return (
    <section aria-labelledby="benchmark-table-heading" className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 id="benchmark-table-heading" className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Canadian Annual Energy Benchmark Table
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Pre-computed annual fuel and electricity costs across annual driving milestones (Gas @ $1.75/L, Electricity @ $0.14/kWh).
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          <span>SEO & No-JS Fallback Pre-rendered</span>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
        <table className="w-full text-left text-sm border-collapse min-w-[640px]">
          <caption className="sr-only">
            Annual Canadian vehicle energy cost comparison table across 15,000, 20,000, and 25,000 km
          </caption>
          <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            <tr>
              <th scope="col" className="py-3.5 px-4 font-semibold">
                Vehicle & Powertrain
              </th>
              <th scope="col" className="py-3.5 px-3 font-semibold text-center">
                Rating
              </th>
              <th scope="col" className="py-3.5 px-3 font-semibold text-center">
                Status
              </th>
              <th scope="col" className="py-3.5 px-4 font-semibold text-right">
                15,000 km / yr
              </th>
              <th scope="col" className="py-3.5 px-4 font-semibold text-right bg-zinc-100/60 dark:bg-zinc-800/60">
                20,000 km / yr
              </th>
              <th scope="col" className="py-3.5 px-4 font-semibold text-right">
                25,000 km / yr
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
            {benchmarks.map((row) => {
              const isPhev = row.powertrain === 'PHEV';
              const isHev = row.powertrain === 'HEV';

              return (
                <tr
                  key={row.name}
                  className="hover:bg-zinc-50/70 dark:hover:bg-zinc-900/60 transition-colors"
                >
                  <th scope="row" className="py-3 px-4 font-medium">
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {row.name}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {row.category}
                    </div>
                  </th>
                  <td className="py-3 px-3 text-center text-xs font-mono">
                    {row.combinedRating}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Badge
                      variant={
                        row.status === 'VERIFIED'
                          ? 'success'
                          : row.status === 'PROVISIONAL'
                          ? 'secondary'
                          : 'outline'
                      }
                      className="text-[10px] uppercase font-bold"
                    >
                      {row.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-sm">
                    ${row.cost15k.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} CAD
                  </td>
                  <td className={`py-3 px-4 text-right font-mono text-sm font-bold bg-zinc-50/60 dark:bg-zinc-800/40 ${
                    isPhev ? 'text-emerald-600 dark:text-emerald-400' : isHev ? 'text-red-600 dark:text-red-400' : ''
                  }`}>
                    ${row.cost20k.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} CAD
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-sm">
                    ${row.cost25k.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} CAD
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
            <tr>
              <td colSpan={6} className="py-3 px-4">
                * Note: PHEV benchmark reflects 65% electric share (wall-to-wheel 21.5 kWh/100km @ $0.14/kWh) and 35% hybrid gasoline mode (6.0 L/100km @ $1.75/L). Ratings sourced from Natural Resources Canada and Toyota Canada releases.
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
