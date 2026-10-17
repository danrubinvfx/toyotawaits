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
      <CardHeader className="p-4 pb-2">
        {/* Status Badge */}
        <div className="flex items-center justify-between gap-2 mb-2">
          {isIncoming ? (
            <Badge
              variant="outline"
              data-testid="status-badge"
              className="bg-blue-950/60 text-blue-400 border-blue-800/80 text-xs font-semibold px-2 py-0.5 flex items-center gap-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              Incoming availability unconfirmed
            </Badge>
          ) : isSoldOrStale ? (
            <Badge
              variant="outline"
              data-testid="status-badge"
              className="bg-zinc-800 text-zinc-400 border-zinc-700 text-xs font-medium px-2 py-0.5"
            >
              {status}
            </Badge>
          ) : (
            <Badge
              variant="outline"
              data-testid="status-badge"
              className="bg-amber-950/60 text-amber-400 border-amber-800/80 text-xs font-semibold px-2 py-0.5 flex items-center gap-1.5"
            >
              <AlertTriangle className="h-3 w-3 shrink-0" aria-hidden="true" />
              Advertised - availability unconfirmed
            </Badge>
          )}

          <div
            className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono"
            title={`Last verified on dealer feed: ${lastChecked}`}
          >
            <Clock className="h-3 w-3 text-zinc-500" aria-hidden="true" />
            <time dateTime={lastChecked}>{formattedCheckTime}</time>
          </div>
        </div>

        {/* Title & Trim */}
        <div className="space-y-0.5">
          <h3 className="text-lg font-bold text-zinc-100 tracking-tight leading-snug">
            {modelYear} {make} {model}
            {trim && <span className="text-red-400 font-semibold ml-1.5">{trim}</span>}
          </h3>
          <p className="text-xs text-zinc-400 flex items-center gap-1">
            <span>{dealerName}</span>
            {regionDisplay && <span className="text-zinc-500 font-normal">({regionDisplay})</span>}
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-1 flex-1 flex flex-col justify-between space-y-3">
        {/* Specification chips */}
        <div className="flex flex-wrap gap-1.5 text-[11px] text-zinc-300">
          {powertrain && (
            <span className="rounded bg-zinc-800/80 px-2 py-0.5 border border-zinc-700/60 font-medium">
              {powertrain}
            </span>
          )}
          {exteriorColor && (
            <span className="rounded bg-zinc-800/80 px-2 py-0.5 border border-zinc-700/60">
              {exteriorColor}
            </span>
          )}
          {stockNumber && (
            <span className="rounded bg-zinc-800/80 px-2 py-0.5 border border-zinc-700/60 font-mono text-zinc-400">
              Stock #{stockNumber}
            </span>
          )}
        </div>

        {/* VIN / Provisional Identification */}
        <div className="rounded-md bg-zinc-950/70 p-2 border border-zinc-800/70 font-mono text-[11px]">
          {isProvisionalVin || !vin ? (
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-zinc-500">Provisional Stock ID:</span>
              <span className="text-amber-300 font-semibold" data-testid="vin-display">
                {provisionalId || stockNumber || 'Provisional (VIN Pending)'}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between text-zinc-300">
              <span className="text-zinc-500">VIN:</span>
              <span className="text-emerald-400 font-medium" data-testid="vin-display">
                {vin}
              </span>
            </div>
          )}
        </div>

        {/* Pricing breakdown */}
        <div className="rounded-lg bg-zinc-950/90 p-2.5 border border-zinc-800">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-xs text-zinc-400">Advertised Price</span>
            <span className="text-base font-bold text-zinc-100" data-testid="selling-price">
              {formattedSellingPrice || 'Contact dealer'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
            <span>MSRP</span>
            <span data-testid="msrp-price">{formattedMsrp || 'N/A'}</span>
          </div>

          {/* Fee verification warning */}
          {hasUnverifiedFees ? (
            <div
              data-testid="price-not-verified-badge"
              className="flex items-center gap-1.5 text-[11px] text-amber-400/90 bg-amber-950/40 rounded px-2 py-1 border border-amber-900/50"
            >
              <ShieldAlert className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span>Price not verified (Dealer fees unconfirmed)</span>
            </div>
          ) : mandatoryFees != null ? (
            <div className="flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-800/60 pt-1">
              <span>Disclosed mandatory fees:</span>
              <span>${mandatoryFees.toLocaleString('en-CA')}</span>
            </div>
          ) : null}
        </div>

        {/* Unconfirmed physical availability disclaimer */}
        <p className="text-[11px] text-zinc-500 leading-tight italic">
          * Vehicle availability is not confirmed with dealer staff and may have an existing customer deposit.
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {vdpUrl ? (
          <a
            href={vdpUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="dealer-vdp-link"
            aria-label={`View public dealer listing for ${modelYear} ${make} ${model} at ${dealerName} (opens in new tab)`}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-600/90 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          >
            <span>View Public Dealer Listing</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ) : (
          <button
            disabled
            className="w-full rounded-lg bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-500 cursor-not-allowed"
          >
            No Direct Link Published
          </button>
        )}
      </CardFooter>
    </article>
  );
}
