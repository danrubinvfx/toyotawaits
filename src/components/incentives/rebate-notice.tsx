'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Info, DollarSign, ExternalLink } from 'lucide-react';
import { isRebateEligibleProvince } from '@/lib/data/vehicles';

interface RebateNoticeProps {
  powertrainSlug: string;
  provinceCode: string;
}

export function RebateNotice({ powertrainSlug, provinceCode }: RebateNoticeProps) {
  // Only render for Plug-in Hybrid (PHEV) vehicles
  if (powertrainSlug !== 'phev') {
    return null;
  }

  const prov = provinceCode.toUpperCase();
  const hasProvincial = isRebateEligibleProvince(prov);

  let provincialAmount = '';
  let provincialName = '';
  let provincialNotes = '';

  if (prov === 'BC') {
    provincialAmount = 'Up to $2,000 CAD';
    provincialName = 'CleanBC Go Electric Passenger Rebate';
    provincialNotes = 'Subject to individual (<$80k) and household (<$125k) income brackets.';
  } else if (prov === 'QC') {
    provincialAmount = 'Up to $5,000 CAD';
    provincialName = 'Programme Roulez vert Québec';
    provincialNotes = 'Government transitioning to revised rebate schedule; check dealer eligibility.';
  } else if (prov === 'NB') {
    provincialAmount = '$5,000 CAD';
    provincialName = 'Plug-In NB Electric Vehicle Rebate';
    provincialNotes = 'Applied directly at point of sale for approved provincial dealerships.';
  } else if (prov === 'NS') {
    provincialAmount = '$3,000 CAD';
    provincialName = 'Electrify Nova Scotia Rebate';
    provincialNotes = 'Combines with federal incentives at vehicle delivery.';
  } else if (prov === 'PE') {
    provincialAmount = '$3,250 CAD';
    provincialName = 'PEI Universal EV Incentive';
    provincialNotes = 'Includes a free Level 2 home charger incentive with eligible purchases.';
  } else if (prov === 'NL') {
    provincialAmount = '$2,500 CAD';
    provincialName = 'NL Electric Vehicle Rebate';
    provincialNotes = 'Administered by Newfoundland and Labrador Hydro.';
  }

  return (
    <Card className="border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-zinc-900 to-zinc-950 shadow-md">
      <CardContent className="p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400">
              <Zap className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm sm:text-base text-zinc-100">
              Canadian ZEV Rebate Intelligence
            </span>
          </div>
          <Badge className="bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400">
            PHEV Incentive Eligible
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Federal iZEV */}
          <div className="rounded-lg bg-zinc-900/80 p-3 border border-zinc-800 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-300">🇨🇦 Federal iZEV Incentive</span>
              <span className="font-black text-amber-400 font-mono">$5,000 CAD</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-snug">
              Point-of-sale deduction off the total vehicle purchase price for qualifying PHEVs with $\ge$ 50 km electric range.
            </p>
          </div>

          {/* Provincial Incentive */}
          {hasProvincial ? (
            <div className="rounded-lg bg-zinc-900/80 p-3 border border-zinc-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-300">🍁 {prov} {provincialName}</span>
                <span className="font-black text-amber-400 font-mono">{provincialAmount}</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">
                {provincialNotes}
              </p>
            </div>
          ) : (
            <div className="rounded-lg bg-zinc-900/80 p-3 border border-zinc-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-300">🍁 Provincial Rebate ({prov})</span>
                <span className="text-zinc-500 font-medium">None Active</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">
                No provincial top-up currently in {prov}. Buyers qualify exclusively for the $5,000 Federal iZEV grant.
              </p>
            </div>
          )}
        </div>

        <div className="text-[11px] text-zinc-500 flex items-center justify-between pt-1 border-t border-zinc-800/80">
          <span>Rebates apply at delivery invoice after taxes and destination fees.</span>
          <span className="text-amber-500 font-mono text-[10px]">Zero PII Stored</span>
        </div>
      </CardContent>
    </Card>
  );
}
