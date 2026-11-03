'use client';

import React from 'react';
import { buildAmazonAffiliateUrl } from '@/lib/gear/affiliate';
import { trackAffiliateClick } from '@/lib/gear';

export interface OntarioAntiTheftCardProps {
  province?: string | null;
  region?: string | null;
  model?: string | null;
  market?: 'CA' | 'US';
  className?: string;
}

export interface AntiTheftDeterrentItem {
  id: string;
  label: string;
  note: string;
  asin?: string;
  query: string;
}

export const ONTARIO_ANTI_THEFT_DETERRENTS: AntiTheftDeterrentItem[] = [
  {
    id: 'obd-port-lock',
    label: 'OBD-II Port Blocker',
    note: 'Blocks CAN-bus key-cloning theft through the diagnostic port.',
    query: 'OBD port lock anti theft car metal',
  },
  {
    id: 'rfid-faraday-key-fob-pouch',
    label: 'RFID Faraday Key Blocker',
    note: 'Prevents relay attacks from keys resting near front doors.',
    asin: 'B07MDF5TX9',
    query: 'Faraday bag key fob signal protector pouch',
  },
  {
    id: 'steering-wheel-lock',
    label: 'Visible Steering Wheel Lock',
    note: 'Primary visual deterrent for driveway parking.',
    query: 'steering wheel lock anti-theft heavy duty',
  },
];

export function isOntarioHighTheftModel(model?: string | null): boolean {
  if (!model) return false;
  const lower = model.trim().toLowerCase();
  return (
    lower.includes('rav4') ||
    lower.includes('highlander') ||
    lower.includes('grand highlander') ||
    lower.includes('grand-highlander')
  );
}

export function isOntarioRegion(provinceOrRegion?: string | null): boolean {
  if (!provinceOrRegion) return false;
  const lower = provinceOrRegion.trim().toLowerCase();
  return (
    lower === 'on' ||
    lower === 'ontario' ||
    lower.includes('ontario') ||
    lower.includes('gta')
  );
}

export function OntarioAntiTheftCard({
  province = 'ON',
  region,
  model = 'RAV4',
  market = 'CA',
  className = '',
}: OntarioAntiTheftCardProps) {
  const effectiveRegion = region ?? province;
  if (!isOntarioRegion(effectiveRegion) || !isOntarioHighTheftModel(model)) {
    return null;
  }

  return (
    <article
      data-testid="ontario-anti-theft-card"
      aria-label="Ontario High-Theft Alert: Avoid the $500–$1,500 Insurance Surcharge"
      className={`col-span-full w-full rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 transition-colors hover:border-amber-500/50 space-y-3 ${className}`}
    >
      <div className="space-y-1">
        <h4 className="text-sm sm:text-base font-bold text-amber-300 tracking-tight">
          🚨 Ontario High-Theft Alert: Avoid the $500–$1,500 Insurance Surcharge
        </h4>
        <p className="text-xs text-zinc-300 leading-relaxed">
          Ontario insurers (Intact, Desjardins, Aviva) impose steep annual surcharges on RAV4 and Highlander models unless equipped with verified tracking (TAG) and physical deterrents. Check your policy for surcharge waiver requirements.
        </p>
      </div>

      <div
        data-testid="ontario-anti-theft-grid"
        className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1"
      >
        {ONTARIO_ANTI_THEFT_DETERRENTS.map((item) => {
          const hasAsin = Boolean(item.asin);
          const href = buildAmazonAffiliateUrl({
            asin: item.asin,
            searchQuery: item.query,
            query: item.query,
            market,
          });
          const buttonLabel = hasAsin ? 'View on Amazon ↗' : 'Search Amazon ↗';

          return (
            <div
              key={item.id}
              data-testid={`anti-theft-item-${item.id}`}
              className="rounded-lg border border-amber-500/20 bg-zinc-950/70 p-3 flex flex-col justify-between gap-2.5"
            >
              <div className="space-y-1">
                <h5 className="text-xs font-bold text-white tracking-tight">
                  {item.label}
                </h5>
                <p className="text-[11px] text-zinc-400 leading-snug">
                  {item.note}
                </p>
              </div>

              <div>
                <a
                  href={href}
                  target="_blank"
                  rel="sponsored noopener noreferrer nofollow"
                  data-testid={`anti-theft-cta-${item.id}`}
                  onClick={() => {
                    trackAffiliateClick({
                      accessory_id: item.id,
                      placement: 'ontario_anti_theft_card',
                      model_context: model || null,
                      target_url: href,
                    });
                  }}
                  className="inline-flex items-center justify-center w-full px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-zinc-950 font-bold text-xs shadow transition-all cursor-pointer"
                >
                  <span>{buttonLabel}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
