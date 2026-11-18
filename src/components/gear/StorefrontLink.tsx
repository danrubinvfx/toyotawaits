'use client';

import React from 'react';
import { useMarket } from '@/context/MarketContext';
import { getAmazonStorefrontUrl } from '@/lib/gear/affiliate';
import { trackAffiliateClick } from '@/lib/gear/telemetry';

export interface StorefrontLinkProps {
  label?: string;
  market?: 'CA' | 'US';
  modelContext?: string | null;
  className?: string;
}

/**
 * Outbound link to the ToyotaWaits Amazon Storefront (CA) or US fallback search.
 * Enforces sponsored rel attributes and logs clicks to telemetry_affiliate_clicks.
 */
export function StorefrontLink({
  label = 'Browse Full Storefront ↗',
  market: propMarket,
  modelContext = null,
  className,
}: StorefrontLinkProps) {
  const { isUs } = useMarket();
  const effectiveMarket: 'CA' | 'US' = propMarket ?? (isUs ? 'US' : 'CA');
  const href = getAmazonStorefrontUrl(effectiveMarket);

  const handleClick = () => {
    trackAffiliateClick({
      accessory_id: 'amazon-storefront',
      placement: 'while_you_wait',
      model_context: modelContext,
      target_url: href,
    });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored noopener noreferrer nofollow"
      onClick={handleClick}
      className={className}
    >
      {label}
    </a>
  );
}
