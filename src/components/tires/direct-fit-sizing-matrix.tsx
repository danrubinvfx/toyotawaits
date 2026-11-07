import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Disc3, CheckCircle2, AlertTriangle, ArrowDownRight, Layers } from 'lucide-react';

export interface SizingMatrixRow {
  model: string;
  badge?: string;
  trim: string;
  factoryOemSize: string;
  recommendedWinterDownsize: string;
  boltPatternAndBore: string;
  offset: string;
  notes?: string;
}

export const CANADIAN_WINTER_SIZING_MATRIX: SizingMatrixRow[] = [
  {
    model: 'Toyota RAV4',
    badge: 'LE / XLE',
    trim: 'LE, XLE (Gas & Hybrid)',
    factoryOemSize: '225/65R17',
    recommendedWinterDownsize: '225/65R17',
    boltPatternAndBore: '5x114.3, 60.1mm bore',
    offset: '+35 to +45',
    notes:
      'Direct factory 17" fitment. Maximum sidewall pothole compliance and lowest replacement tire cost.',
  },
  {
    model: 'Toyota RAV4',
    badge: 'Trail / Woodland',
    trim: 'Trail, Woodland Edition, Adventure',
    factoryOemSize: '225/60R18',
    recommendedWinterDownsize: '225/65R17',
    boltPatternAndBore: '5x114.3, 60.1mm bore',
    offset: '+35 to +45',
    notes:
      'Downsizing to 17" wheels adds +12mm extra sidewall cushion against curb strikes, hidden ice shelves, and frozen ruts.',
  },
  {
    model: 'Toyota RAV4',
    badge: 'Limited / PHEV',
    trim: 'Limited, XSE, RAV4 Prime PHEV',
    factoryOemSize: '235/55R19',
    recommendedWinterDownsize: '225/65R17',
    boltPatternAndBore: '5x114.3, 60.1mm bore',
    offset: '+35 to +45',
    notes:
      '17-inch wheels safely clear RAV4 Prime dual-piston calipers while saving $200–$350 CAD per set compared to 19" rubber.',
  },
  {
    model: 'Toyota Sienna AWD',
    badge: '2021–2026',
    trim: 'LE, XLE, XSE, Limited, Platinum',
    factoryOemSize: '235/60R18',
    recommendedWinterDownsize: '235/65R17',
    boltPatternAndBore: '5x114.3, 60.1mm bore',
    offset: '+35 to +45',
    notes:
      '17" wheel clears front brakes and rear e-AWD electric drive unit. Also supports 225/65R17 for narrower slush bite.',
  },
  {
    model: 'Toyota Grand Highlander',
    badge: 'Gas / HEV / MAX',
    trim: 'XLE, Limited, Platinum (Gas, Hybrid, MAX)',
    factoryOemSize: '255/60R18 or 255/50R20',
    recommendedWinterDownsize: 'Preferred: 255/60R18',
    boltPatternAndBore: '5x120, 60.1mm bore',
    offset: '+40',
    notes:
      'Requires heavy-duty 5x120 PCD (differs from RAV4/Sienna 5x114.3). Minimum 18" rim required to clear Hybrid MAX dual-piston calipers.',
  },
  {
    model: 'Toyota Corolla Cross',
    badge: 'Gas & Hybrid AWD',
    trim: 'L, LE, XLE (AWD & Hybrid)',
    factoryOemSize: '215/65R17 or 225/55R18',
    recommendedWinterDownsize: '215/65R17',
    boltPatternAndBore: '5x114.3, 60.1mm bore',
    offset: '+40',
    notes:
      'Downsizing 18" to 215/65R17 slices through dense highway snow tracks without vehicle float.',
  },
  {
    model: 'Toyota Camry Hybrid',
    badge: '2025/2026',
    trim: 'LE, SE, XSE, XLE (AWD & FWD)',
    factoryOemSize: '235/45R18',
    recommendedWinterDownsize: '215/55R17',
    boltPatternAndBore: '5x114.3, 60.1mm bore',
    offset: '+40',
    notes:
      '215/55R17 maintains factory rolling circumference within +0.2% and cuts freeze-thaw slush hydroplaning.',
  },
];

export function DirectFitSizingMatrix() {
  return (
    <section
      aria-label="Direct OEM Toyota Winter Tire Sizing & Downsizing Matrix"
      id="sizing-matrix"
      data-testid="direct-fit-sizing-matrix"
      className="container mx-auto max-w-6xl px-4 sm:px-6 pt-2 pb-8"
    >
      <Card className="border-cyan-500/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 shadow-2xl overflow-hidden">
        <CardHeader className="p-5 sm:p-6 pb-4 border-b border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-0.5 text-xs font-semibold text-cyan-400">
                <Disc3 className="h-3.5 w-3.5" />
                <span>🇨🇦 Canadian Direct-Fit Fitment Matrix</span>
                <span className="text-zinc-600">•</span>
                <span>Direct OEM &amp; Downsizing Specs</span>
              </div>
              <CardTitle as="h2" className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Direct OEM Sizing &amp; 17&quot; Downsizing Matrix
              </CardTitle>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
                Factory OEM tire sizes, recommended cost-saving 17-inch winter downsizing specs,
                bolt patterns, center bores, and offsets for Canadian Toyota deliveries.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              <Badge variant="outline" className="border-cyan-500/40 text-cyan-300 bg-cyan-950/30 text-xs">
                Hub Bore: 60.1mm
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Responsive Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead className="bg-zinc-900/90 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                <tr>
                  <th scope="col" className="py-3.5 px-4 font-bold text-zinc-300">
                    Model
                  </th>
                  <th scope="col" className="py-3.5 px-4 font-bold text-zinc-300">
                    Trim
                  </th>
                  <th scope="col" className="py-3.5 px-4 font-bold text-zinc-300">
                    Factory OEM Size
                  </th>
                  <th scope="col" className="py-3.5 px-4 font-bold text-cyan-400 bg-cyan-950/20">
                    Recommended 17&quot; Winter Downsize
                  </th>
                  <th scope="col" className="py-3.5 px-4 font-bold text-zinc-300">
                    Bolt Pattern &amp; Center Bore
                  </th>
                  <th scope="col" className="py-3.5 px-4 font-bold text-zinc-300">
                    Offset
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 bg-zinc-950/50">
                {CANADIAN_WINTER_SIZING_MATRIX.map((row, idx) => (
                  <tr
                    key={`${row.model}-${row.trim}-${idx}`}
                    className="hover:bg-zinc-900/50 transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-black text-white whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{row.model}</span>
                        {row.badge && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 group-hover:text-cyan-300">
                            {row.badge}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-300 text-xs">
                      {row.trim}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-400 text-xs whitespace-nowrap">
                      {row.factoryOemSize}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-300 bg-cyan-950/10 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <ArrowDownRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{row.recommendedWinterDownsize}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-300 text-xs whitespace-nowrap">
                      {row.boltPatternAndBore}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-300 text-xs whitespace-nowrap">
                      {row.offset}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sizing Explainer & Fitment Advisory Callout */}
          <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-950/80 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-1">
                <div className="flex items-center gap-2 font-bold text-cyan-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Why Downsize to 17-Inch Wheels in Canada?</span>
                </div>
                <p className="text-zinc-400 leading-relaxed text-[11px] sm:text-xs">
                  Narrower tread widths (e.g. 215 or 225 vs 235/255) concentrate vehicle weight onto a smaller footprint,
                  slicing through slush instead of hydroplaning over it. Taller sidewalls cushion expensive alloy rims against
                  hidden snowbank curb strikes and frozen frost-heave potholes while saving <strong>$200–$350 CAD</strong> per set of 3PMSF tires.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-400">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Caliper Clearance &amp; Hub-Centric Advisory</span>
                </div>
                <p className="text-zinc-400 leading-relaxed text-[11px] sm:text-xs">
                  Always demand hub-centric <strong>60.1mm direct-fit wheels</strong> (or high-grade aluminum hub-centering rings).
                  RAV4 Prime front calipers clear standard 17-inch steel and alloy wheels. Grand Highlander uses a unique <strong>5x120 PCD</strong>
                  and must NOT be fitted with standard 5x114.3 Toyota rims.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default DirectFitSizingMatrix;
