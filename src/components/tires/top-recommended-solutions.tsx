import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Snowflake,
  ShieldCheck,
  Compass,
  Gauge,
  ExternalLink,
  Award,
  Sparkles,
  Zap,
} from 'lucide-react';
import { buildAmazonAffiliateUrl } from '@/lib/gear/affiliate';

export interface RecommendedTireSolution {
  rank: string;
  category: string;
  title: string;
  headline: string;
  badge: string;
  badgeColor: string;
  idealFor: string;
  keyBenefits: string[];
  caveats: string;
  searchQuery: string;
  popularSizes: {
    label: string;
    query: string;
  }[];
}

export const TOP_RECOMMENDED_SOLUTIONS: RecommendedTireSolution[] = [
  {
    rank: '#1',
    category: 'All-Weather (Year-Round 3PMSF)',
    title: 'Michelin CrossClimate 2',
    headline: 'Zero seasonal tire swap fees, severe-snow rated 3PMSF all 365 days',
    badge: 'Best All-Weather 3PMSF',
    badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/30',
    idealFor: 'Urban drivers in Greater Vancouver, Southern Ontario, and Montreal commuter corridors.',
    keyBenefits: [
      '3PMSF (Three-Peak Mountain Snowflake) certified — 100% legal on BC mountain passes and Quebec winter highways.',
      'Thermal Adaptive Tread Compound stays pliable below 7°C without melting or getting greasy in July heat.',
      'Saves $160–$240 CAD annually in spring and autumn seasonal wheel swap and balancing fees.',
      'Exceptional wet-weather braking and resistance to freeze-thaw highway slush hydroplaning.',
    ],
    caveats: 'Directional V-formation tread pattern requires front-to-back tire rotation only.',
    searchQuery: 'Michelin CrossClimate 2 3PMSF tire',
    popularSizes: [
      { label: '225/65R17 (RAV4 / Sienna)', query: 'Michelin CrossClimate 2 225/65R17' },
      { label: '225/60R18 (RAV4 Ltd)', query: 'Michelin CrossClimate 2 225/60R18' },
      { label: '235/55R19 (RAV4 Prime/XSE)', query: 'Michelin CrossClimate 2 235/55R19' },
    ],
  },
  {
    rank: '#2',
    category: 'Dedicated Ice & Snow',
    title: 'Bridgestone Blizzak WS90 / Nokian Hakkapeliitta R5',
    headline: 'Maximum sub-zero braking grip on polished black ice and hard-packed snow',
    badge: 'Extreme Sub-Zero Ice',
    badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/30',
    idealFor: 'Prairies (Calgary, Edmonton, Winnipeg), Northern Ontario, and rural Quebec.',
    keyBenefits: [
      'Patented NanoPro-Tech multicell compound bites into water micro-films on glare black ice.',
      'Sub-zero braking distances up to 1.5 car lengths shorter than standard winter rubber at -20°C.',
      'High 3D zigzag sipe density creates thousands of active biting edges on packed snow ruts.',
      'Proven fitments across all Toyota AWD platforms (E-Four electronic rear motor calibration).',
    ],
    caveats: 'Soft silica compound wears quickly if driven above +7°C during early spring warm spells.',
    searchQuery: 'Bridgestone Blizzak WS90 winter tire',
    popularSizes: [
      { label: '225/65R17 (RAV4 / Sienna downsize)', query: 'Bridgestone Blizzak WS90 225/65R17' },
      { label: '235/60R18 (Sienna / RAV4)', query: 'Bridgestone Blizzak WS90 235/60R18' },
      { label: '255/65R18 (Grand Highlander)', query: 'Bridgestone Blizzak DM-V2 255/65R18' },
    ],
  },
  {
    rank: '#3',
    category: 'Rugged Trail / Light Snow',
    title: 'Falken Wildpeak A/T Trail',
    headline: 'All-terrain durability with certified 3PMSF winter rating for Woodland & TRD builds',
    badge: 'Trail & Woodland Pick',
    badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-950/30',
    idealFor: 'RAV4 Woodland Edition, TRD Off-Road, and outdoor backcountry road trips.',
    keyBenefits: [
      'Official 3PMSF severe snow rated with rugged 2-ply polyester casing and high-durability sidewall.',
      'Optimized specifically for crossover unibody platforms (retains quiet highway cruising acoustics).',
      'Protects against sharp gravel, sharp winter frost heaves, and deep slush rut washouts.',
      'Aggressive shoulder tread design gives your Toyota an authoritative off-road stance.',
    ],
    caveats: 'Slightly firmer ride and 1%–2% hybrid EV fuel consumption variance compared to low-rolling-resistance touring tires.',
    searchQuery: 'Falken Wildpeak AT Trail tire 3PMSF',
    popularSizes: [
      { label: '225/65R17 (RAV4 Woodland / Trail)', query: 'Falken Wildpeak AT Trail 225/65R17' },
      { label: '235/55R19 (RAV4 TRD / Prime)', query: 'Falken Wildpeak AT Trail 235/55R19' },
      { label: '215/65R17 (Corolla Cross)', query: 'Falken Wildpeak AT Trail 215/65R17' },
    ],
  },
];

export function TopRecommendedSolutions() {
  const inflatorUrl = buildAmazonAffiliateUrl({
    query: 'portable cordless tire inflator 150 psi auto shutoff',
    market: 'CA',
  });

  return (
    <section
      aria-label="Top 3 Recommended Winter & All-Weather Tire Solutions"
      id="recommended-solutions"
      className="container mx-auto max-w-6xl px-4 sm:px-6 py-6"
    >
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Award className="w-3.5 h-3.5" />
            <span>Curated Canadian Winter Rubber</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Top 3 Recommended Winter &amp; All-Weather Tire Solutions
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            Tested across Canadian blizzards, freezing mountain passes, and urban freeze-thaw cycles.
            Select the tire solution matching your local climate and driving habits.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {TOP_RECOMMENDED_SOLUTIONS.map((solution) => {
            const mainSearchUrl = buildAmazonAffiliateUrl({
              query: solution.searchQuery,
              market: 'CA',
            });

            return (
              <Card
                key={solution.title}
                className="flex flex-col justify-between border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 transition-all shadow-xl"
              >
                <CardHeader className="space-y-2.5 p-5 pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-800/40">
                      {solution.rank} Pick
                    </span>
                    <Badge variant="outline" className={`${solution.badgeColor} text-[11px] font-semibold`}>
                      {solution.badge}
                    </Badge>
                  </div>
                  <div>
                    <CardTitle className="text-lg font-black text-white tracking-tight">
                      {solution.title}
                    </CardTitle>
                    <p className="text-xs text-cyan-300/90 font-medium mt-0.5">
                      {solution.category}
                    </p>
                  </div>
                  <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                    {solution.headline}
                  </p>
                </CardHeader>

                <CardContent className="p-5 pt-0 space-y-4 flex-1 flex flex-col justify-between text-xs">
                  <div className="space-y-3">
                    <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                      <p className="text-[11px] font-semibold text-zinc-300">
                        🎯 <strong className="text-white">Ideal For:</strong> {solution.idealFor}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <p className="font-bold text-zinc-200 text-[11px] uppercase tracking-wider">
                        Key Performance Pillars:
                      </p>
                      <ul className="space-y-1">
                        {solution.keyBenefits.map((b, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-zinc-400 text-[11px]">
                            <span className="text-cyan-400 font-bold shrink-0">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <p className="text-[11px] text-amber-300/80 bg-amber-950/20 p-2 rounded border border-amber-800/30">
                      ⚠️ <strong className="text-amber-200">Trade-Off:</strong> {solution.caveats}
                    </p>
                  </div>

                  {/* Size buttons and primary search CTA */}
                  <div className="space-y-2 pt-3 border-t border-zinc-800">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-zinc-400">
                        Direct Size Searches:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {solution.popularSizes.map((size) => {
                          const sizeUrl = buildAmazonAffiliateUrl({
                            query: size.query,
                            market: 'CA',
                          });
                          return (
                            <a
                              key={size.label}
                              href={sizeUrl}
                              target="_blank"
                              rel="sponsored noopener noreferrer nofollow"
                              className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-1 rounded bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-cyan-300 border border-zinc-800 transition-colors"
                            >
                              <span>{size.label}</span>
                              <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                            </a>
                          );
                        })}
                      </div>
                    </div>

                    <a
                      href={mainSearchUrl}
                      target="_blank"
                      rel="sponsored noopener noreferrer nofollow"
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-3 text-xs shadow-md transition-colors mt-2"
                    >
                      <Snowflake className="w-3.5 h-3.5" />
                      <span>Search {solution.title} on Amazon.ca</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Companion Cold-Weather Tire Pressure & Inflator Banner */}
        <div className="p-4 sm:p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-950 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <Gauge className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Sub-Zero Tire Care Alert
                </span>
                <span className="text-xs text-zinc-500">•</span>
                <span className="text-xs text-zinc-400 font-mono">1–2 PSI Drop per 5°C</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Never Get Stranded by Low-Pressure TPMS Lights on Freezing Mornings
              </h3>
              <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                Tire pressures plunge rapidly during sub-zero cold snaps, triggering TPMS dash warnings and
                reducing hybrid fuel efficiency. Many new models (including Sienna and RAV4 Prime) come without
                a spare tire, relying on an inflator kit. A dedicated battery-powered cordless inflator ensures fast top-ups anywhere.
              </p>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <a
              href={inflatorUrl}
              target="_blank"
              rel="sponsored noopener noreferrer nofollow"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-2.5 px-4 text-xs transition-colors shadow-lg"
            >
              <Zap className="w-4 h-4 fill-zinc-950" />
              <span>Search Cordless Inflator Kits</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TopRecommendedSolutions;
