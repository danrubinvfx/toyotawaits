import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Disc, ExternalLink, AlertTriangle, Layers, CheckCircle2 } from 'lucide-react';
import { buildAmazonAffiliateUrl } from '@/lib/gear/affiliate';

export interface TrimSizingSpec {
  id: string;
  generation: string;
  model: string;
  badge: string;
  trims: {
    trimName: string;
    tireSize: string;
    wheelSpec: string;
    recommendedWinterDownsize?: string;
    searchQuery: string;
  }[];
  notes?: string;
  warningNote?: string;
}

export const TRIM_SIZING_DATA: TrimSizingSpec[] = [
  {
    id: 'rav4-oem-sizes',
    generation: '5th / 6th Gen (2019–2026+)',
    model: 'RAV4 (Gas, Hybrid & Prime PHEV)',
    badge: 'Canada #1 Selling SUV',
    trims: [
      {
        trimName: 'LE / XLE / Woodland Edition',
        tireSize: '225/65R17',
        wheelSpec: '17x7J ET35 (5x114.3, 60.1mm bore)',
        recommendedWinterDownsize: 'Direct Factory Fit (Optimal 17" sidewall)',
        searchQuery: '225 65R17 winter tires 3PMSF',
      },
      {
        trimName: 'Limited',
        tireSize: '225/60R18',
        wheelSpec: '18x7J ET35 (5x114.3, 60.1mm bore)',
        recommendedWinterDownsize: 'Downsize to 225/65R17 on 17" wheels for pothole cushion',
        searchQuery: '225 60R18 winter tires 3PMSF',
      },
      {
        trimName: 'XSE / Prime / TRD Off-Road',
        tireSize: '235/55R19',
        wheelSpec: '19x7.5J ET40 (5x114.3, 60.1mm bore)',
        recommendedWinterDownsize: 'Downsize to 225/65R17 (Clears Prime dual-piston calipers)',
        searchQuery: '235 55R19 winter tires 3PMSF',
      },
    ],
    notes:
      'All 5th/6th Gen RAV4 trims—including RAV4 Prime PHEV with larger front brake rotors—safely clear 17x7J ET35 wheels. Downsizing to 17" saves $200–$350 CAD per set of winter rubber.',
  },
  {
    id: 'sienna-oem-sizes',
    generation: '4th Gen (2021–2026+ Hybrid)',
    model: 'Sienna AWD / FWD',
    badge: 'Hybrid Minivan Platform',
    trims: [
      {
        trimName: 'LE / XLE',
        tireSize: '235/65R17',
        wheelSpec: '17x7J ET35 (5x114.3, 60.1mm bore)',
        recommendedWinterDownsize: 'Factory 17" fitment (Also supports 225/65R17 for slush bite)',
        searchQuery: '235 65R17 winter tires 3PMSF',
      },
      {
        trimName: 'XSE / Limited / Platinum',
        tireSize: '235/60R18 or 235/50R20',
        wheelSpec: '18x7.5J ET35 or 20x7.5J ET35 (5x114.3)',
        recommendedWinterDownsize: 'Downsize to 235/65R17 or 225/65R17 on 17x7J alloy wheels',
        searchQuery: '235 60R18 winter tires 3PMSF',
      },
    ],
    notes:
      'Downsizing 20" or 18" factory alloys to 17" wheels dramatically improves ride comfort over frozen ruts and protects rims against curb strikes.',
    warningNote:
      'Sienna Spare Tire Caveat: Most Canadian Siennas ship without a physical spare tire (12V inflator kit with sealant is factory standard). Dedicated winter wheels must clear front calipers and rear electric e-AWD drive units. A dedicated cordless inflator is highly recommended.',
  },
  {
    id: 'grand-highlander-oem-sizes',
    generation: '1st Gen (2024–2026+)',
    model: 'Grand Highlander (Gas, HEV & Hybrid MAX)',
    badge: 'Full-Size 3-Row TNGA-K',
    trims: [
      {
        trimName: 'XLE / Limited / Platinum',
        tireSize: '255/65R18 or 255/55R20',
        wheelSpec: '18x7.5J ET40 or 20x8J ET40 (5x120 PCD, 60.1mm bore)',
        recommendedWinterDownsize: '255/65R18 (Minimum 18" to clear Hybrid MAX front calipers)',
        searchQuery: '255 65R18 winter tires 3PMSF',
      },
    ],
    notes:
      'Critical PCD Note: Grand Highlander uses a heavy-duty 5x120 bolt pattern (NOT the standard 5x114.3 found on RAV4/Highlander/Sienna). Rims from previous Highlander models will not fit.',
  },
  {
    id: 'corolla-cross-oem-sizes',
    generation: '1st Gen (2022–2026+)',
    model: 'Corolla Cross (AWD / FWD & Hybrid)',
    badge: 'Compact Crossover',
    trims: [
      {
        trimName: 'L / LE',
        tireSize: '215/65R17',
        wheelSpec: '17x6.5J ET40 (5x114.3, 60.1mm bore)',
        recommendedWinterDownsize: 'Factory 215/65R17 size is ideal for Canadian snow cutting',
        searchQuery: '215 65R17 winter tires 3PMSF',
      },
      {
        trimName: 'XLE',
        tireSize: '225/55R18',
        wheelSpec: '18x7J ET40 (5x114.3, 60.1mm bore)',
        recommendedWinterDownsize: 'Downsize to 215/65R17 on 17" wheels to lower seasonal tire cost',
        searchQuery: '225 55R18 winter tires 3PMSF',
      },
    ],
    notes:
      'Corolla Cross shares the 5x114.3 PCD and 60.1mm hub bore. 215-width tire profile slices cleanly through dense highway snow tracks without float.',
  },
];

export function TrimSizingTable() {
  return (
    <section
      aria-label="Trim-by-Trim OEM Toyota Tire Sizing Reference Table"
      id="trim-sizing-reference"
      className="container mx-auto max-w-6xl px-4 sm:px-6 py-6"
    >
      <Card className="border-cyan-500/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 shadow-2xl overflow-hidden">
        <CardHeader className="p-5 sm:p-6 pb-4 border-b border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-0.5 text-xs font-semibold text-cyan-400">
                <Layers className="h-3.5 w-3.5" />
                <span>Trim-by-Trim OEM Reference</span>
                <span className="text-zinc-600">•</span>
                <span>Factory Fitment Guide</span>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Trim-by-Trim Factory Tire Sizing &amp; Wheel Specs
              </CardTitle>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
                Factory tire sizes, wheel widths, bolt patterns, offsets, and winter downsizing recommendations
                for RAV4, Sienna, Grand Highlander, and Corolla Cross.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-zinc-800">
          {TRIM_SIZING_DATA.map((vehicle) => (
            <div
              key={vehicle.model}
              id={vehicle.id}
              className="p-5 sm:p-6 space-y-4 scroll-mt-20"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Disc className="w-5 h-5 text-cyan-400 shrink-0" />
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    {vehicle.model}
                  </h3>
                  <span className="text-xs text-zinc-400 hidden md:inline">
                    ({vehicle.generation})
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="border-zinc-700 bg-zinc-900 text-zinc-300 text-xs self-start sm:self-auto"
                >
                  {vehicle.badge}
                </Badge>
              </div>

              {/* Trims Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {vehicle.trims.map((trim) => {
                  const caSearchUrl = buildAmazonAffiliateUrl({
                    query: trim.searchQuery,
                    market: 'CA',
                  });
                  return (
                    <div
                      key={trim.trimName}
                      className="p-4 rounded-xl border border-zinc-800/90 bg-zinc-950/70 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-sm text-white">{trim.trimName}</span>
                          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-800/40">
                            {trim.tireSize}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-zinc-400">
                          {trim.wheelSpec}
                        </p>
                        {trim.recommendedWinterDownsize && (
                          <p className="text-xs text-emerald-400/90 flex items-start gap-1 pt-1">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
                            <span>{trim.recommendedWinterDownsize}</span>
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-zinc-800/80">
                        <a
                          href={caSearchUrl}
                          target="_blank"
                          rel="sponsored noopener noreferrer nofollow"
                          className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-cyan-500/50 text-cyan-300 py-1.5 px-3 text-xs font-semibold transition-colors"
                        >
                          <span>Search {trim.tireSize} Tires</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Notes */}
              {vehicle.notes && (
                <p className="text-xs text-zinc-400 leading-relaxed pl-1">
                  💡 <strong className="text-zinc-300">Fitment Tip:</strong> {vehicle.notes}
                </p>
              )}

              {/* Warning note if applicable */}
              {vehicle.warningNote && (
                <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs flex items-start gap-2.5 leading-relaxed">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-200">Safety &amp; Fitment Alert: </strong>
                    {vehicle.warningNote}
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

export default TrimSizingTable;
