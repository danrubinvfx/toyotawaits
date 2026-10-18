import React from 'react';
import { ExternalLink, AlertTriangle, Clock, ShieldAlert, CheckCircle2, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export interface VehicleListingCardProps {
  id: string;
  make: string;
  model: string;
  trim?: string | null;
  modelYear: number;
  vin?: string | null;
  provisionalId?: string | null;
  isProvisionalVin?: boolean;
  dealerName: string;
  dealerCity?: string | null;
  dealerProvince?: string | null;
  status: string; // e.g. "Advertised - availability unconfirmed", "Incoming availability unconfirmed"
  lastChecked: string;
  vdpUrl?: string | null;
  msrp?: number | null;
  sellingPrice?: number | null;
  mandatoryFees?: number | null;
  hasUnverifiedFees?: boolean;
  powertrain?: string | null;
  exteriorColor?: string | null;
  stockNumber?: string | null;
}

export function resolveVehicleListingUrl(props: {
  vdpUrl?: string | null;
  dealerName?: string;
  dealerCity?: string | null;
  dealerProvince?: string | null;
  make?: string;
  model?: string;
  modelYear?: number;
  vin?: string | null;
  stockNumber?: string | null;
}): string | null {
  const { vdpUrl, vin, stockNumber } = props;

  // Resolve base dealer domain (defaulting to Jim Pattison Toyota Downtown for pilot listings)
  let baseDomain = 'https://www.jptoyota-downtown.com';
  if (vdpUrl && (vdpUrl.startsWith('http://') || vdpUrl.startsWith('https://'))) {
    try {
      const parsed = new URL(vdpUrl);
      baseDomain = parsed.origin;
    } catch {
      // retain fallback baseDomain
    }
  }

  // Normalize common missing-hyphen domain typo
  if (baseDomain.includes('jptoyotadowntown.com')) {
    baseDomain = baseDomain.replace('jptoyotadowntown.com', 'jptoyota-downtown.com');
  }

  if (vdpUrl && typeof vdpUrl === 'string') {
    let clean = vdpUrl.trim();
    if (clean.includes('jptoyotadowntown.com')) {
      clean = clean.replace('jptoyotadowntown.com', 'jptoyota-downtown.com');
    }

    // Relative path: prepend dealer base domain
    if (clean.startsWith('/')) {
      return `${baseDomain}${clean}`;
    }

    // Intercept dead placeholder /new-vehicles/ URL that 404s
    if (
      clean.endsWith('/new-vehicles/') ||
      clean.endsWith('/new-vehicles') ||
      clean === baseDomain ||
      clean === `${baseDomain}/`
    ) {
      const keyword = vin || stockNumber;
      return keyword
        ? `${baseDomain}/vehicles/new/?keyword=${encodeURIComponent(keyword.trim())}`
        : `${baseDomain}/vehicles/new/`;
    }

    return clean;
  }

  // Fallback to public new inventory search page if direct VDP link is absent
  const keyword = vin || stockNumber;
  if (keyword) {
    return `${baseDomain}/vehicles/new/?keyword=${encodeURIComponent(keyword.trim())}`;
  }

  return `${baseDomain}/vehicles/new/`;
}

export function VehicleListingCard({
  id,
  make,
  model,
  trim,
  modelYear,
  vin,
  provisionalId,
  isProvisionalVin,
  dealerName,
  dealerCity,
  dealerProvince,
  status,
  lastChecked,
  vdpUrl,
  msrp,
  sellingPrice,
  mandatoryFees,
  hasUnverifiedFees,
  powertrain,
  exteriorColor,
  stockNumber,
}: VehicleListingCardProps) {
  const isIncoming = status.toLowerCase().includes('incoming');
  const isSoldOrStale =
    status.toLowerCase().includes('sold') || status.toLowerCase().includes('stale') || status.toLowerCase().includes('no longer');

  const regionDisplay = [dealerCity, dealerProvince].filter(Boolean).join(', ');
  const formattedMsrp = msrp != null ? `$${msrp.toLocaleString('en-CA')}` : null;
  const formattedSellingPrice = sellingPrice != null ? `$${sellingPrice.toLocaleString('en-CA')}` : formattedMsrp;
  
  const resolvedVdpUrl = resolveVehicleListingUrl({
    vdpUrl,
    dealerName,
    dealerCity,
    dealerProvince,
    make,
    model,
    modelYear,
    vin,
    stockNumber,
  });

  // Format check date if valid ISO
  let formattedCheckTime = lastChecked;
  try {
    const d = new Date(lastChecked);
    if (!isNaN(d.getTime())) {
      formattedCheckTime = d.toLocaleDateString('en-CA', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      });
    }
  } catch {
    // Keep original string if date parsing fails
  }

  return (
    <article
      data-testid={`listing-card-${id}`}
      aria-label={`${modelYear} ${make} ${model} ${trim || ''} at ${dealerName}`}
      className="flex flex-col h-full rounded-xl border border-zinc-800 bg-zinc-900/80 shadow-md backdrop-blur-sm transition-all hover:border-zinc-700"
    >
      <CardHeader className="p-3.5 sm:p-4 pb-1.5 sm:pb-2">
        {/* Compact Top Row: Status Badge & Observation Timestamp */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          {isIncoming ? (
            <Badge
              variant="outline"
              data-testid="status-badge"
              className="bg-blue-950/60 text-blue-400 border-blue-800/80 text-[11px] font-semibold px-2 py-0.5 flex items-center gap-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              Incoming availability unconfirmed
            </Badge>
          ) : isSoldOrStale ? (
            <Badge
              variant="outline"
              data-testid="status-badge"
              className="bg-zinc-800 text-zinc-400 border-zinc-700 text-[11px] font-medium px-2 py-0.5"
            >
              {status}
            </Badge>
          ) : (
            <Badge
              variant="outline"
              data-testid="status-badge"
              className="bg-amber-950/60 text-amber-400 border-amber-800/80 text-[11px] font-semibold px-2 py-0.5 flex items-center gap-1.5"
            >
              <AlertTriangle className="h-3 w-3 shrink-0" aria-hidden="true" />
              Advertised - availability unconfirmed
            </Badge>
          )}

          <div
            className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono shrink-0"
            title={`Last verified on dealer feed: ${lastChecked}`}
          >
            <Clock className="h-3 w-3 text-zinc-500" aria-hidden="true" />
            <time dateTime={lastChecked}>{formattedCheckTime}</time>
          </div>
        </div>

        {/* Title & Dealer Location */}
        <div className="space-y-0.5">
          <h3 className="text-base font-semibold text-zinc-100 tracking-tight leading-snug">
            {modelYear} {make} {model}
            {trim && <span className="text-red-400 font-semibold ml-1.5">{trim}</span>}
          </h3>
          <p className="text-xs text-zinc-400 flex items-center gap-1">
            <span>{dealerName}</span>
            {regionDisplay && <span className="text-zinc-500 font-normal">({regionDisplay})</span>}
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-3.5 sm:p-4 pt-0 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-3">
        {/* Sleek inline metadata wrap: Specs, Color, Stock, and VIN */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-300">
          {powertrain && (
            <span className="rounded bg-neutral-900/80 px-2 py-0.5 border border-neutral-800 font-medium">
              {powertrain}
            </span>
          )}
          {exteriorColor && (
            <span className="rounded bg-neutral-900/80 px-2 py-0.5 border border-neutral-800">
              {exteriorColor}
            </span>
          )}
          {stockNumber && (
            <span className="rounded bg-neutral-900/80 px-2 py-0.5 border border-neutral-800 font-mono text-neutral-400">
              Stock #{stockNumber}
            </span>
          )}
          {isProvisionalVin || !vin ? (
            <span className="rounded bg-neutral-900/80 px-2 py-0.5 border border-neutral-800 font-mono text-[11px] text-neutral-400 flex items-center gap-1">
              <span>Provisional Stock ID:</span>
              <span className="text-amber-300 font-semibold" data-testid="vin-display">
                {provisionalId || stockNumber || 'Provisional (VIN Pending)'}
              </span>
            </span>
          ) : (
            <span className="rounded bg-neutral-900/80 px-2 py-0.5 border border-neutral-800 font-mono text-[11px] text-neutral-400 flex items-center gap-1">
              <span>VIN:</span>
              <span className="text-emerald-400 font-medium" data-testid="vin-display">
                {vin}
              </span>
            </span>
          )}
        </div>

        {/* Consolidate Pricing & Disclosure */}
        <div className="rounded-lg bg-zinc-950/80 p-2.5 border border-zinc-800/80 space-y-1.5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-zinc-400">Advertised</span>
              <span className="text-base font-bold text-zinc-100" data-testid="selling-price">
                {formattedSellingPrice || 'Contact dealer'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <span>MSRP</span>
              <span className="font-medium text-zinc-300" data-testid="msrp-price">
                {formattedMsrp || 'N/A'}
              </span>
            </div>
          </div>

          {/* Compact Fee Notice / Mandatory fees inline */}
          {hasUnverifiedFees ? (
            <div
              data-testid="price-not-verified-badge"
              className="inline-flex items-center gap-1 rounded-full bg-amber-950/40 border border-amber-900/60 px-2 py-0.5 text-[10px] font-medium text-amber-300"
            >
              <ShieldAlert className="h-3 w-3 shrink-0 text-amber-400" aria-hidden="true" />
              <span>Price not verified (Dealer fees unconfirmed)</span>
            </div>
          ) : mandatoryFees != null ? (
            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5 border-t border-zinc-800/50">
              <span>Disclosed mandatory fees:</span>
              <span className="font-medium text-zinc-300">${mandatoryFees.toLocaleString('en-CA')}</span>
            </div>
          ) : null}
        </div>

        {/* Unconfirmed physical availability disclaimer */}
        <p className="text-[10px] text-zinc-500 leading-tight italic pt-0.5">
          * Vehicle availability is not confirmed with dealer staff and may have an existing customer deposit.
        </p>
      </CardContent>

      <CardFooter className="p-3.5 sm:p-4 pt-0">
        {resolvedVdpUrl ? (
          <a
            href={resolvedVdpUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="dealer-vdp-link"
            aria-label={`View public dealer listing for ${modelYear} ${make} ${model} at ${dealerName} (opens in new tab)`}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-600/90 h-9 sm:h-10 px-3 text-sm font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          >
            <span>View Public Dealer Listing</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ) : (
          <button
            disabled
            className="w-full rounded-lg bg-zinc-800 h-9 sm:h-10 px-3 text-sm font-medium text-zinc-500 cursor-not-allowed"
          >
            No Direct Link Published
          </button>
        )}
      </CardFooter>
    </article>
  );
}
