import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Factory,
  Train,
  CheckCircle2,
  Clock,
  MapPin,
  Ship,
  HelpCircle,
  FileText,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export interface StatusStage {
  code: string;
  title: string;
  subTitle: string;
  badge: string;
  colorClass: string;
  timing: string;
  factories: {
    name: string;
    location: string;
    models: string;
  }[];
  logistics: string[];
  keyMilestone: string;
}

export const FACTORY_STATUS_STAGES: StatusStage[] = [
  {
    code: 'Status A',
    title: 'Allocated / Scheduled for Assembly',
    subTitle: 'Production slot officially reserved at the manufacturing plant',
    badge: 'Stage 1 • Factory Allocation',
    colorClass: 'border-blue-500/40 text-blue-400 bg-blue-950/30',
    timing: '1 to 6+ months depending on allocation queue',
    factories: [
      {
        name: 'TMMC (Cambridge & Woodstock, ON)',
        location: 'Canada',
        models: 'RAV4, RAV4 Hybrid, Lexus NX / RX',
      },
      {
        name: 'Takaoka & Tahara Plants',
        location: 'Japan',
        models: 'RAV4 Prime (PHEV), Prius, Land Cruiser 250, 4Runner',
      },
      {
        name: 'TMMI (Princeton, Indiana)',
        location: 'USA',
        models: 'Sienna Hybrid, Grand Highlander (Gas / HEV / MAX)',
      },
    ],
    logistics: [
      'Temporary specification code is assigned to your dealership order slot.',
      'Permanent 17-character VIN is typically generated approximately 7 to 14 days prior to actual body weld and final assembly.',
      'Order changes (colour, package, trim) are strictly locked once Status A reaches scheduled assembly freeze.',
    ],
    keyMilestone: 'VIN generated ~7–14 days prior to assembly. Build slot confirmed.',
  },
  {
    code: 'Status F',
    title: 'Freight / In-Transit Logistics',
    subTitle: 'Released from plant, cleared quality inspection, loaded on rail or ocean vessel',
    badge: 'Stage 2 • Freight & Shipping',
    colorClass: 'border-amber-500/40 text-amber-400 bg-amber-950/30',
    timing: '5–14 days (ON/QC) • 12–21 days (Western / Atlantic Canada)',
    factories: [],
    logistics: [
      'Cleared multi-point factory QA inspection and loaded onto Canadian National (CN) or CPKC (Canadian Pacific Kansas City) auto-rack rail carriers.',
      'Japanese imports arrive by Ro-Ro ocean vessel at the Port of Vancouver (Annacis Island auto terminal) before being transferred to cross-country freight trains.',
      'Transit Time Averages: 5 to 14 days within Ontario & Quebec; 12 to 21 days across the Rockies to Western Canada (BC & Alberta) or maritime shipping corridors.',
    ],
    keyMilestone: 'Loaded onto CN / CPKC rail or docked at Annacis Island. Real-time rail tracking active.',
  },
  {
    code: 'Status G',
    title: 'Ground / Dealership Compound',
    subTitle: 'Offloaded from transport trailer onto dealership lot ready for PDI',
    badge: 'Stage 3 • Dealership Arrival',
    colorClass: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/30',
    timing: '24 to 48 hours for PDI & Detailing',
    factories: [],
    logistics: [
      'Automotive transport carrier unloads vehicle at the dealership compound or regional compound distribution yard.',
      'Vehicle enters mandatory 24–48 hour Pre-Delivery Inspection (PDI): transit suspension spacer removal, protective plastic wrap unpeeling, battery initial charge verification, and software initializations.',
      'Dealership prepares registration, provincial safety certificate, and your final Bill of Sale handover.',
    ],
    keyMilestone: 'Physical vehicle in dealer yard. Complete your pickup day checklist before signing!',
  },
];

export function FactoryStatusTracker() {
  return (
    <section
      aria-label="Toyota Canada Order Status Tracking & Logistics Guide"
      id="toyota-status-codes"
      className="space-y-6 pt-2"
    >
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-0.5 text-xs font-semibold text-blue-400">
          <Train className="h-3.5 w-3.5" />
          <span>Toyota Canada Order Status Tracking</span>
          <span className="text-zinc-600">•</span>
          <span>Status A, F &amp; G Decoded</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Toyota Canada Order Status Codes: &ldquo;The Black Box&rdquo; Decoded
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
          From the assembly line in Ontario, Indiana, or Japan to the Canadian National (CN) railhead and
          your local dealership lot—here is what each official Toyota Canada order status code means and how long transit takes.
        </p>
      </div>

      {/* Status Progress Stepper */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FACTORY_STATUS_STAGES.map((stage, idx) => (
          <Card
            key={stage.code}
            className="border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex flex-col justify-between shadow-xl"
          >
            <CardHeader className="p-5 pb-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-black font-mono text-white px-2.5 py-0.5 rounded bg-zinc-800 border border-zinc-700">
                  {stage.code}
                </span>
                <Badge variant="outline" className={`${stage.colorClass} text-[10px] font-bold`}>
                  {stage.badge}
                </Badge>
              </div>
              <div>
                <CardTitle className="text-lg font-black text-white tracking-tight">
                  {stage.title}
                </CardTitle>
                <p className="text-xs text-zinc-400 mt-1 leading-snug">
                  {stage.subTitle}
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-4 flex-1 flex flex-col justify-between text-xs">
              <div className="space-y-3 pt-2 border-t border-zinc-800/80">
                <div className="flex items-center gap-1.5 text-cyan-400 font-semibold text-[11px]">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>Transit / Duration: {stage.timing}</span>
                </div>

                {stage.factories.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                      Factory Build Locations:
                    </p>
                    <div className="space-y-1.5">
                      {stage.factories.map((f) => (
                        <div
                          key={f.name}
                          className="p-2 rounded-lg bg-zinc-950/80 border border-zinc-800 text-[11px] space-y-0.5"
                        >
                          <div className="flex items-center justify-between text-zinc-200 font-bold">
                            <span>{f.name}</span>
                            <span className="text-[10px] text-cyan-300 font-mono">[{f.location}]</span>
                          </div>
                          <p className="text-[10px] text-zinc-400">{f.models}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    Logistics Milestones:
                  </p>
                  <ul className="space-y-1.5">
                    {stage.logistics.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-zinc-300 text-[11px] leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 font-medium">
                🎯 <strong className="text-white">Milestone:</strong> {stage.keyMilestone}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default FactoryStatusTracker;
