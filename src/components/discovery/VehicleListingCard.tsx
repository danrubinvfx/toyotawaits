import React from 'react';
import { ExternalLink, AlertTriangle, Clock, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { VehicleImage } from './VehicleImage';

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
  postedAt?: string | null;
  firstSeenAt?: string | null;
  vdpUrl?: string | null;
  listingUrl?: string | null;
  dealerBaseUrl?: string | null;
  msrp?: number | null;
  sellingPrice?: number | null;
  mandatoryFees?: number | null;
  hasUnverifiedFees?: boolean;
  powertrain?: string | null;
  driveTrain?: string | null;
  packageCode?: string | null;
  exteriorColor?: string | null;
  stockNumber?: string | null;
  distanceKm?: number | null;
  imageUrl?: string | null;
  hasRealPhoto?: boolean;
  imageSource?: string | null;
  onListingClick?: () => void;
}

export function formatVehicleCardTitles(props: {
  modelYear: number;
  make: string;
  model: string;
  trim?: string | null;
  driveTrain?: string | null;
  powertrain?: string | null;
}): {
  primaryTitle: string;
  secondaryTitle: string | null;
} {
  const { modelYear, make, model, trim, driveTrain } = props;

  const cleanMake = (make || 'Toyota').trim();
  let cleanModel = (model || '').trim();

  // If model name starts with make (e.g. "Toyota RAV4"), remove redundant make
  if (cleanModel.toLowerCase().startsWith(cleanMake.toLowerCase() + ' ')) {
    cleanModel = cleanModel.slice(cleanMake.length).trim();
  }

  const primaryTitle = `${modelYear} ${cleanMake} ${cleanModel}`;

  // Secondary title consists of Trim, Package, Drivetrain
  const secondaryParts: string[] = [];

  if (trim && trim.trim()) {
    let cleanTrim = trim.trim();
    // If trim starts with the model name (e.g. "RAV4 XSE"), remove redundant model prefix
    if (cleanTrim.toLowerCase().startsWith(cleanModel.toLowerCase() + ' ')) {
      cleanTrim = cleanTrim.slice(cleanModel.length).trim();
    }
    // If model already contains "Hybrid" and trim starts with "Hybrid ", prevent redundant "Hybrid"
    if (cleanModel.toLowerCase().includes('hybrid') && cleanTrim.toLowerCase().startsWith('hybrid ')) {
      cleanTrim = cleanTrim.slice(7).trim();
    }
    if (cleanTrim) {
      secondaryParts.push(cleanTrim);
    }
  }

  // Drivetrain deduplication
  const dtCandidate = driveTrain?.trim() || '';
  if (dtCandidate) {
    const dtLower = dtCandidate.toLowerCase();
    const modelLower = cleanModel.toLowerCase();
    const trimCombinedLower = secondaryParts.join(' ').toLowerCase();

    // Check if drivetrain is already declared in model or trim
    const isAwd = dtLower.includes('awd') || dtLower.includes('all wheel') || dtLower.includes('e-awd');
    const is4wd = dtLower.includes('4wd') || dtLower.includes('4x4') || dtLower.includes('four wheel');
    const isFwd = dtLower.includes('fwd') || dtLower.includes('front wheel');
    const isRwd = dtLower.includes('rwd') || dtLower.includes('rear wheel');

    const alreadyInModel =
      modelLower.includes(dtLower) ||
      (isAwd && (modelLower.includes('awd') || modelLower.includes('e-awd'))) ||
      (is4wd && (modelLower.includes('4wd') || modelLower.includes('4x4'))) ||
      (isFwd && modelLower.includes('fwd')) ||
      (isRwd && modelLower.includes('rwd'));

    const alreadyInTrim =
      trimCombinedLower.includes(dtLower) ||
      (isAwd && (trimCombinedLower.includes('awd') || trimCombinedLower.includes('e-awd'))) ||
      (is4wd && (trimCombinedLower.includes('4wd') || trimCombinedLower.includes('4x4'))) ||
      (isFwd && trimCombinedLower.includes('fwd')) ||
      (isRwd && trimCombinedLower.includes('rwd'));

    if (!alreadyInModel && !alreadyInTrim) {
      secondaryParts.push(dtCandidate);
    }
  }

  const secondaryTitle = secondaryParts.length > 0 ? secondaryParts.join(' ') : null;

  return { primaryTitle, secondaryTitle };
}

/**
 * Resilient Dealer Search Fallback URL Generator
 * If listing_url is missing or relative, build a resilient dealer search query avoiding
 * restrictive category parameters like &sc=new (which blocks demo/transit stock).
 */
export function getDealerListingUrl(listing: {
  listing_url?: string | null;
  vdp_url?: string | null;
  dealer_base_url?: string | null;
  vin?: string | null;
  stock_number?: string | null;
  model?: string | null;
  trim?: string | null;
  [key: string]: any;
}): string {
  // Priority 1: If listing.listing_url or listing.vdp_url is a valid http(s) URL, use it directly
  const direct = listing.listing_url || (listing as any).vdp_url;
  if (direct && typeof direct === 'string' && direct.trim().toLowerCase().startsWith('http')) {
    let clean = direct.trim();
    if (clean.includes('jptoyotadowntown.com')) {
      clean = clean.replace('jptoyotadowntown.com', 'jptoyota-downtown.com');
    }
    if (clean.includes('jptoyotasurrey.com')) {
      clean = clean.replace('jptoyotasurrey.com', 'jptoyota-surrey.com');
    }

    // Intercept dead placeholder /new-vehicles/ URL that 404s
    const baseUrl = listing.dealer_base_url ? listing.dealer_base_url.replace(/\/+$/, '') : '';
    if (
      clean.endsWith('/new-vehicles/') ||
      clean.endsWith('/new-vehicles') ||
      clean === baseUrl ||
      clean === `${baseUrl}/`
    ) {
      const term = (!listing.vin?.startsWith('PROV') && listing.vin)
        || listing.stock_number
        || `${listing.model || ''} ${listing.trim || ''}`.trim();
      return `${baseUrl}/vehicles/?search=${encodeURIComponent(term)}`;
    }

    return clean;
  }

  // Priority 2: If falling back to search query, NEVER search by provisional_stock_id (e.g. 'PROV-SIENNA-881')
  // Instead, search by: 1. Real VIN (if not provisional/null), 2. Real Stock Number, 3. Vehicle Model + Trim
  const baseUrl = listing.dealer_base_url ? listing.dealer_base_url.replace(/\/+$/, '') : '';
  const term = (!listing.vin?.startsWith('PROV') && listing.vin)
    || listing.stock_number
    || `${listing.model || ''} ${listing.trim || ''}`.trim();

  return `${baseUrl}/vehicles/?search=${encodeURIComponent(term)}`;
}

export function resolveVehicleListingUrl(props: {
  vdpUrl?: string | null;
  listingUrl?: string | null;
  dealerBaseUrl?: string | null;
  dealerName?: string;
  dealerCity?: string | null;
  dealerProvince?: string | null;
  make?: string;
  model?: string;
  trim?: string | null;
  modelYear?: number;
  vin?: string | null;
  stockNumber?: string | null;
  provisionalId?: string | null;
}): string {
  const { vdpUrl, listingUrl, dealerBaseUrl, make, model, trim, vin, stockNumber, provisionalId } = props;

  // Resolve base dealer domain (defaulting to Jim Pattison Toyota Downtown, Surrey, West Coast, Regency, or OpenRoad)
  const isSurrey =
    props.dealerName?.toLowerCase().includes('surrey') ||
    props.dealerCity?.toLowerCase().includes('surrey');
  const isWestCoast =
    props.dealerName?.toLowerCase().includes('west coast') ||
    props.dealerCity?.toLowerCase().includes('pitt meadows');
  const isRegency =
    props.dealerName?.toLowerCase().includes('regency');
  const isOpenRoadRichmond =
    props.dealerName?.toLowerCase().includes('openroad') ||
    props.dealerName?.toLowerCase().includes('richmond');

  let baseDomain = dealerBaseUrl || (isWestCoast
    ? 'https://www.westcoasttoyota.com'
    : isSurrey
    ? 'https://www.jptoyota-surrey.com'
    : isRegency
    ? 'https://www.regencytoyota.com'
    : isOpenRoadRichmond
    ? 'https://www.openroadtoyotarichmond.com'
    : 'https://www.jptoyota-downtown.com');

  const candidateUrl = listingUrl || vdpUrl;
  if (candidateUrl && (candidateUrl.startsWith('http://') || candidateUrl.startsWith('https://'))) {
    try {
      const parsed = new URL(candidateUrl);
      baseDomain = parsed.origin;
    } catch {
      // retain baseDomain
    }
  }

  if (baseDomain.includes('jptoyotadowntown.com')) {
    baseDomain = baseDomain.replace('jptoyotadowntown.com', 'jptoyota-downtown.com');
  }
  if (baseDomain.includes('jptoyotasurrey.com')) {
    baseDomain = baseDomain.replace('jptoyotasurrey.com', 'jptoyota-surrey.com');
  }

  const vehicleModel = [make, model].filter(Boolean).join(' ').trim() || (model || '');
  return getDealerListingUrl({
    listing_url: candidateUrl,
    dealer_base_url: baseDomain,
    vin: vin || undefined,
    stock_number: stockNumber || undefined,
    model: vehicleModel,
    trim: trim || undefined,
  });
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
  postedAt,
  firstSeenAt,
  vdpUrl,
  listingUrl,
  dealerBaseUrl,
  msrp,
  sellingPrice,
  mandatoryFees,
  hasUnverifiedFees,
  powertrain,
  driveTrain,
  exteriorColor,
  stockNumber,
  distanceKm,
  imageUrl,
  hasRealPhoto,
  imageSource,
  onListingClick,
}: VehicleListingCardProps) {
  const { primaryTitle, secondaryTitle } = formatVehicleCardTitles({
    modelYear,
    make,
    model,
    trim,
    driveTrain,
    powertrain,
  });

  const isIncoming =
    status.toLowerCase().includes('incoming') ||
    status.toLowerCase().includes('transit');
  const isSoldOrStale =
    status.toLowerCase().includes('sold') || status.toLowerCase().includes('stale') || status.toLowerCase().includes('no longer');

  let resolvedCity = dealerCity;
  const resolvedProvince = dealerProvince || 'BC';
  if (!resolvedCity && dealerName) {
    if (dealerName.toLowerCase().includes('surrey')) {
      resolvedCity = 'Surrey';
    } else if (dealerName.toLowerCase().includes('west coast') || dealerName.toLowerCase().includes('pitt meadows')) {
      resolvedCity = 'Pitt Meadows';
    } else if (dealerName.toLowerCase().includes('downtown') || dealerName.toLowerCase().includes('vancouver')) {
      resolvedCity = 'Vancouver';
    }
  }
  const regionDisplay = [resolvedCity, resolvedProvince].filter(Boolean).join(', ');
  const formattedMsrp = msrp != null ? `$${msrp.toLocaleString('en-CA')}` : null;
  const formattedSellingPrice = sellingPrice != null ? `$${sellingPrice.toLocaleString('en-CA')}` : formattedMsrp;
  
  const resolvedVdpUrl = resolveVehicleListingUrl({
    vdpUrl,
    listingUrl,
    dealerBaseUrl,
    dealerName,
    dealerCity,
    dealerProvince,
    make,
    model,
    trim,
    modelYear,
    vin,
    stockNumber,
    provisionalId,
  });

  // Check date staleness evaluation
  const now = Date.now();
  let hoursSinceCheck: number | null = null;
  try {
    const d = new Date(lastChecked);
    if (!isNaN(d.getTime())) {
      hoursSinceCheck = Math.floor((now - d.getTime()) / (3600 * 1000));
    }
  } catch {
    // Graceful fallback
  }
  const isNearingExpiration = hoursSinceCheck != null && hoursSinceCheck > 24;

  // Format listing date (posted_at or first_seen_at) with hover tooltip
  const effectivePostedDate = postedAt || firstSeenAt;
  const detectionDateStr = firstSeenAt || postedAt || lastChecked;

  let formattedDateDisplay = 'Recently listed';
  let fullDetectionDate = '';
  let dateTimeIso = effectivePostedDate || lastChecked;

  try {
    const detectD = new Date(detectionDateStr);
    if (!isNaN(detectD.getTime())) {
      fullDetectionDate = detectD.toLocaleDateString('en-CA', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }

    if (effectivePostedDate) {
      const d = new Date(effectivePostedDate);
      if (!isNaN(d.getTime())) {
        dateTimeIso = d.toISOString();
        const diffMs = now - d.getTime();
        const diffDays = Math.floor(diffMs / (24 * 3600 * 1000));

        if (postedAt) {
          const month = d.toLocaleDateString('en-US', { month: 'short' });
          const day = d.getDate();
          formattedDateDisplay = `Listed ${month} ${day}`;
        } else {
          if (diffDays <= 0) {
            formattedDateDisplay = 'Added today';
          } else if (diffDays === 1) {
            formattedDateDisplay = 'Added 1 day ago';
          } else if (diffDays < 30) {
            formattedDateDisplay = `Added ${diffDays} days ago`;
          } else {
            const month = d.toLocaleDateString('en-US', { month: 'short' });
            const day = d.getDate();
            formattedDateDisplay = `Listed ${month} ${day}`;
          }
        }
      }
    } else {
      const d = new Date(lastChecked);
      if (!isNaN(d.getTime())) {
        const month = d.toLocaleDateString('en-US', { month: 'short' });
        const day = d.getDate();
        formattedDateDisplay = `Listed ${month} ${day}`;
      }
    }
  } catch {
    formattedDateDisplay = 'Recently listed';
  }

  const hoverTooltip = fullDetectionDate
    ? `First detected on ${fullDetectionDate}`
    : `First detected on ${formattedDateDisplay}`;

  return (
    <article
      data-testid={`listing-card-${id}`}
      aria-label={`${primaryTitle} ${secondaryTitle || ''} at ${dealerName}`}
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

          {isNearingExpiration ? (
            <span
              data-testid="staleness-warning-badge"
              className="text-[11px] text-amber-500/80 font-medium whitespace-nowrap flex items-center gap-1"
              title={`Last verified on dealer feed: ${lastChecked}`}
            >
              ⚠️ Last confirmed {hoursSinceCheck}h ago
            </span>
          ) : (
            <div
              className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono shrink-0"
              title={hoverTooltip}
            >
              <Clock className="h-3 w-3 text-zinc-500" aria-hidden="true" />
              <time dateTime={dateTimeIso}>{formattedDateDisplay}</time>
            </div>
          )}
        </div>

        {/* Title & Dealer Location */}
        <div className="space-y-1">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
              {primaryTitle}
            </h3>
            {secondaryTitle && (
              <p className="text-sm font-medium text-neutral-400 leading-snug break-words">
                {secondaryTitle}
              </p>
            )}
          </div>
          <p className="text-xs text-zinc-400 flex flex-wrap items-center gap-1">
            <span>{dealerName}</span>
            {distanceKm != null ? (
              <>
                <span className="text-zinc-600">•</span>
                {resolvedCity && <span className="text-zinc-400">{resolvedCity}</span>}
                <span
                  data-testid="distance-badge"
                  className="text-xs text-sky-400/90 font-medium whitespace-nowrap"
                >
                  ({distanceKm} km away)
                </span>
              </>
            ) : (
              regionDisplay && (
                <span className="text-zinc-500 font-normal" data-testid="dealer-location-display">
                  ({regionDisplay})
                </span>
              )
            )}
          </p>
        </div>
      </CardHeader>

      {/* Vehicle Image & Transit/Lot Status Badge */}
      <div className="px-3.5 sm:px-4 pb-2.5">
        <div className="relative">
          <VehicleImage
            imageUrl={imageUrl}
            hasRealPhoto={hasRealPhoto}
            imageSource={imageSource}
            modelYear={modelYear}
            model={model}
            trim={trim}
            alt={`${modelYear} ${make} ${model} ${trim || ''}`.trim()}
          />
          <div
            data-testid="transit-status-badge"
            className={`absolute top-2 right-2 z-10 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-md shadow-sm ${
              isIncoming
                ? 'bg-blue-950/90 text-blue-300 border-blue-800/80'
                : 'bg-emerald-950/90 text-emerald-300 border-emerald-800/80'
            }`}
          >
            {isIncoming ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span>In Transit</span>
              </>
            ) : (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>On Lot</span>
              </>
            )}
          </div>
        </div>
      </div>

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
            onClick={() => onListingClick?.()}
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
