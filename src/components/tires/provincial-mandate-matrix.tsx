import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ShieldCheck, DollarSign, AlertCircle, MapPin, CheckCircle2 } from 'lucide-react';

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
    requirement: 'M+S or 3PMSF (Mountain Snowflake) Required',
    insuranceDiscount: 'Optional carrier discounts (2%–5%)',
    treadDepth: 'Minimum 3.5 mm remaining tread',
    details:
      'Legally required on designated mountain highways (Coquihalla Hwy 5, Sea-to-Sky Hwy 99, Malahat Hwy 1, Trans-Canada Hwy 1). Police checkpoints enforce fines and turn vehicles around without compliant 3PMSF or M+S tires with ≥3.5mm tread.',
  },
  {
    province: 'Quebec',
    code: 'QC',
    badgeText: 'Mandatory Province-Wide',
    badgeVariant: 'destructive',
    deadline: 'December 1 – March 15',
    requirement: 'Strictly 3PMSF (Three-Peak Snowflake) Only',
    insuranceDiscount: 'Standard / Factored into provincial underwriting',
    treadDepth: 'Minimum 3.5 mm (recommended ≥ 4.0 mm)',
    details:
      'Highway Safety Code requires all passenger cars, taxis, and commercial vehicles registered in Quebec to be fitted with 4 certified 3PMSF winter tires. M+S without the mountain snowflake is illegal. Fines range from $200 to $300 CAD plus fees.',
  },
  {
    province: 'Ontario',
    code: 'ON',
    badgeText: 'Mandatory Insurance Discount',
    badgeVariant: 'default',
    deadline: 'Voluntary (Install by Nov/Dec to April)',
    requirement: '3PMSF Recommended for Premium Discount',
    insuranceDiscount: '2% to 5% off annual auto insurance (Mandated by FSRA)',
    treadDepth: 'Minimum 1.6 mm legal (4.0 mm safe snow grip)',
    details:
      'All Ontario auto insurance underwriters are legally mandated by the Financial Services Regulatory Authority (FSRA) to offer a 2% to 5% discount when 4 winter tires are installed (typically required from November/December until April).',
  },
  {
    province: 'Alberta & Atlantic Canada',
    code: 'AB / NB / NS / NL / PE',
    badgeText: 'Recommended & Discount Eligible',
    badgeVariant: 'secondary',
    deadline: 'Voluntary (Oct/Nov through April)',
    requirement: '3PMSF Strongly Recommended for Prairie / Coastal Ice',
    insuranceDiscount: '2% to 5% insurance discount across top private carriers',
    treadDepth: 'Minimum 3.5 mm recommended for sub-zero hard pack',
    details:
      'Not legally mandated on public roads (except national parks like Banff/Jasper during winter storms). However, severe freezing rain in Atlantic provinces and -30°C black ice on Alberta highways make 3PMSF dedicated compound crucial.',
  },
  {
    province: 'Manitoba',
    code: 'MB',
    badgeText: 'MPI Financing Program',
    badgeVariant: 'outline',
    deadline: 'Voluntary (MPI Program Year-Round)',
    requirement: '3PMSF Rated Tires & Approved Rims',
    insuranceDiscount: 'Financing up to $2,000 at low prime interest rate',
    treadDepth: 'New tire financing criteria',
    details:
      'Manitoba Public Insurance (MPI) offers the Winter Tire Financing Program: qualifying Manitoba drivers can finance up to $2,000 CAD per vehicle for approved 3PMSF winter tires, rims, TPMS sensors, mounting, and balancing with terms up to 48 months.',
  },
];

export function ProvincialMandateMatrix() {
  return (
    <section
      aria-label="Canadian Provincial Winter Tire Regulations & Insurance Discount Matrix"
      id="provincial-regulations"
      className="container mx-auto max-w-6xl px-4 sm:px-6 py-6"
    >
      <Card className="border-cyan-500/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 shadow-2xl overflow-hidden">
        <CardHeader className="p-5 sm:p-6 pb-4 border-b border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-0.5 text-xs font-semibold text-cyan-400">
                <MapPin className="h-3.5 w-3.5" />
                <span>Provincial Regulations Matrix</span>
                <span className="text-zinc-600">•</span>
                <span>2026/2027 Season Deadlines</span>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Canadian Provincial Winter Tire Mandates &amp; Insurance Discounts
              </CardTitle>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
                Legal deadlines, minimum tread depth standards, police enforcement dates, and auto insurance
                discounts across British Columbia, Quebec, Ontario, Alberta, Manitoba, and Atlantic Canada.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
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
                    <p className="text-[11px] text-zinc-400">{item.requirement}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <DollarSign className="w-3.5 h-3.5 shrink-0" />
                      <span>Insurance / Financing</span>
                    </div>
                    <p className="text-zinc-200 font-bold">{item.insuranceDiscount}</p>
                    <p className="text-[11px] text-zinc-400">Tread spec: {item.treadDepth}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>Enforcement &amp; Compliance</span>
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
                <strong>Insurance Tip:</strong> Keep your tire installation receipt. Most Canadian insurance
                adjusters require proof of purchase/installation to honour your annual 2%–5% winter tire policy discount.
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] shrink-0">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>3.5mm Minimum Tread Threshold</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default ProvincialMandateMatrix;
