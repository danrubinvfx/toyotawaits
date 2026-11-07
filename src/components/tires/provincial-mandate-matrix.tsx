import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  ShieldCheck,
  DollarSign,
  AlertCircle,
  MapPin,
  CheckCircle2,
  FileCheck2,
} from 'lucide-react';

export interface ProvincialRule {
  province: string;
  code: string;
  badgeText: string;
  badgeVariant: 'destructive' | 'default' | 'secondary' | 'outline';
  deadline: string;
  requirement: string;
  insuranceDiscount: string;
  details: string;
  treadDepth: string;
}

export const PROVINCIAL_REGULATIONS: ProvincialRule[] = [
  {
    province: 'British Columbia',
    code: 'BC',
    badgeText: 'Mandatory on Marked Highways',
    badgeVariant: 'destructive',
    deadline: 'October 1 – April 30',
    requirement: 'Mandatory M+S or 3PMSF with minimum 3.5mm tread on designated highways (Oct 1 to Apr 30).',
    insuranceDiscount: 'Optional private carrier discounts (2%–5%)',
    treadDepth: 'Minimum 3.5 mm remaining tread depth',
    details:
      'Legally required on designated mountain highways (Coquihalla Hwy 5, Sea-to-Sky Hwy 99, Malahat Hwy 1, Trans-Canada Hwy 1). Police checkpoints enforce fines and turn vehicles around without compliant 3PMSF or M+S tires with ≥3.5mm tread.',
  },
  {
    province: 'Quebec',
    code: 'QC',
    badgeText: 'Mandatory Province-Wide',
    badgeVariant: 'destructive',
    deadline: 'December 1 – March 15',
    requirement: 'Mandatory 3PMSF winter tires on all passenger vehicles (Dec 1 to Mar 15).',
    insuranceDiscount: 'Factored into mandatory provincial underwriting rating',
    treadDepth: 'Minimum 3.5 mm (recommended ≥ 4.0 mm for snow/slush)',
    details:
      'Highway Safety Code requires all passenger cars, taxis, and commercial vehicles registered in Quebec to be fitted with 4 certified 3PMSF winter tires. M+S without the 3PMSF snowflake is illegal. Fines range from $200 to $300 CAD plus administrative fees.',
  },
  {
    province: 'Ontario & Alberta',
    code: 'ON / AB',
    badgeText: 'Insurance Discounts (2%–5%)',
    badgeVariant: 'default',
    deadline: 'Voluntary (Install Nov/Dec through April)',
    requirement: 'Up to 2%–5% annual auto insurance discounts for certified 4-tire winter setups installed by winter deadlines.',
    insuranceDiscount: '2% to 5% annual premium deduction (FSRA mandated in ON, private in AB)',
    treadDepth: 'Minimum 1.6 mm legal, ≥ 3.5 mm recommended',
    details:
      'In Ontario, all auto insurers are legally mandated by the Financial Services Regulatory Authority (FSRA) to offer a 2% to 5% discount when 4 certified winter tires (3PMSF) are installed. In Alberta, leading private insurers (Intact, Aviva, Desjardins, TD) offer matching 2% to 5% premium discounts upon request.',
  },
  {
    province: 'Manitoba & Prairies',
    code: 'MB / SK',
    badgeText: 'MPI Low-Rate Financing',
    badgeVariant: 'outline',
    deadline: 'Voluntary (MPI Program Available Year-Round)',
    requirement: '3PMSF Rated Tires & Approved Direct-Fit Rims',
    insuranceDiscount: 'Financing up to $2,000 at low prime interest rate',
    treadDepth: 'New tire financing criteria',
    details:
      'Manitoba Public Insurance (MPI) offers the Winter Tire Financing Program: qualifying Manitoba drivers can finance up to $2,000 CAD per vehicle for approved 3PMSF winter tires, rims, TPMS sensors, mounting, and balancing with terms up to 48 months.',
  },
  {
    province: 'Atlantic Canada',
    code: 'NB / NS / NL / PE',
    badgeText: 'Severe Winter Recommended',
    badgeVariant: 'secondary',
    deadline: 'Voluntary (Late Fall through Spring)',
    requirement: '3PMSF Dedicated Winter Tires Strongly Recommended',
    insuranceDiscount: 'Up to 2%–5% discount across major private underwriters',
    treadDepth: 'Minimum 3.5 mm recommended for coastal freezing rain',
    details:
      'Not legally mandated on public roads, but persistent coastal freezing rain, black ice, and heavy Nor\'easter storms make certified 3PMSF compound tires essential. Most regional insurers provide policy discounts with proof of installation.',
  },
];

export function ProvincialMandateMatrix() {
  return (
    <section
      aria-label="Canadian Provincial Winter Tire Regulations & Insurance Discount Table"
      id="provincial-regulations"
      data-testid="provincial-mandate-matrix"
      className="container mx-auto max-w-6xl px-4 sm:px-6 py-6"
    >
      <Card className="border-cyan-500/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 shadow-2xl overflow-hidden">
        <CardHeader className="p-5 sm:p-6 pb-4 border-b border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-0.5 text-xs font-semibold text-cyan-400">
                <MapPin className="h-3.5 w-3.5" />
                <span>Provincial Regulations &amp; Insurance</span>
                <span className="text-zinc-600">•</span>
                <span>2026/2027 Enforcement Deadlines</span>
              </div>
              <CardTitle as="h2" className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Canadian Provincial Winter Tire Mandates &amp; Insurance Discounts
              </CardTitle>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
                Legal deadlines, minimum tread depth standards, highway police enforcement dates, and auto insurance
                discounts across British Columbia, Quebec, Ontario, Alberta, Manitoba, and Atlantic Canada.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Concise Reference Block (Highlighted Focus) */}
          <div className="p-4 sm:p-5 bg-cyan-950/20 border-b border-cyan-800/30">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
              <FileCheck2 className="w-4 h-4" />
              <span>Concise Reference: Key Provincial Mandates &amp; Deadlines</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {/* British Columbia Card */}
              <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">British Columbia</span>
                  <Badge variant="destructive" className="text-[10px] py-0 px-1.5">
                    Oct 1 – Apr 30
                  </Badge>
                </div>
                <p className="text-zinc-200 text-xs font-medium leading-snug">
                  <strong>Mandatory M+S or 3PMSF</strong> with minimum <strong>3.5mm tread</strong> on designated highways (Oct 1 to Apr 30).
                </p>
                <p className="text-[11px] text-zinc-400">
                  Enforced on Coquihalla, Sea-to-Sky, Malahat &amp; Hwy 1 mountain passes.
                </p>
              </div>

              {/* Quebec Card */}
              <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Quebec</span>
                  <Badge variant="destructive" className="text-[10px] py-0 px-1.5">
                    Dec 1 – Mar 15
                  </Badge>
                </div>
                <p className="text-zinc-200 text-xs font-medium leading-snug">
                  <strong>Mandatory 3PMSF</strong> winter tires on all passenger vehicles (Dec 1 to Mar 15).
                </p>
                <p className="text-[11px] text-zinc-400">
                  Strict province-wide rule. M+S without mountain snowflake is illegal ($200–$300 fine).
                </p>
              </div>

              {/* Ontario & Alberta Card */}
              <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Ontario &amp; Alberta</span>
                  <Badge variant="default" className="text-[10px] py-0 px-1.5 bg-emerald-600">
                    2%–5% Discount
                  </Badge>
                </div>
                <p className="text-zinc-200 text-xs font-medium leading-snug">
                  Up to <strong>2%–5% annual auto insurance discounts</strong> for certified 4-tire winter setups installed by winter deadlines.
                </p>
                <p className="text-[11px] text-zinc-400">
                  FSRA-mandated in ON (typically Nov/Dec to April); offered by top carriers in AB.
                </p>
              </div>
            </div>
          </div>

          {/* Full Provincial Breakdown List */}
          <div className="divide-y divide-zinc-800/80">
            {PROVINCIAL_REGULATIONS.map((item) => (
              <div
                key={item.province}
                className="p-5 sm:p-6 hover:bg-zinc-900/40 transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base sm:text-lg font-black text-white tracking-tight">
                      {item.province}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-cyan-300 font-bold">
                      {item.code}
                    </span>
                  </div>
                  <div>
                    <Badge
                      variant="outline"
                      className="border-cyan-500/40 text-cyan-300 bg-cyan-950/30 text-xs font-semibold"
                    >
                      {item.badgeText}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                  <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>Legal Window / Deadline</span>
                    </div>
                    <p className="text-zinc-200 font-bold">{item.deadline}</p>
                    <p className="text-[11px] text-zinc-300 leading-snug">{item.requirement}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <DollarSign className="w-3.5 h-3.5 shrink-0" />
                      <span>Insurance / Financing</span>
                    </div>
                    <p className="text-zinc-200 font-bold">{item.insuranceDiscount}</p>
                    <p className="text-[11px] text-zinc-400">Tread standard: {item.treadDepth}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>Enforcement &amp; Details</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed">{item.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Regulatory Summary Footnote */}
          <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-950/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Insurance Tip:</strong> Keep your tire purchase or seasonal swap receipt. Most Canadian insurance
                adjusters require dated proof of 4-tire 3PMSF installation to honour your annual 2%–5% policy discount.
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] shrink-0">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>3.5mm Minimum Tread Threshold</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default ProvincialMandateMatrix;
