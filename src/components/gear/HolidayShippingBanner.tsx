'use client';

import React from 'react';
import { PackageCheck } from 'lucide-react';

export function isHolidayShippingWindow(currentDate: Date = new Date()): boolean {
  const isUtcMidnight =
    currentDate.getUTCHours() === 0 &&
    currentDate.getUTCMinutes() === 0 &&
    currentDate.getUTCSeconds() === 0 &&
    currentDate.getUTCMilliseconds() === 0;
  const month = isUtcMidnight ? currentDate.getUTCMonth() : currentDate.getMonth();
  const day = isUtcMidnight ? currentDate.getUTCDate() : currentDate.getDate();

  return (month === 10 && day >= 25) || (month === 11 && day <= 18);
}

export interface HolidayShippingBannerProps {
  currentDate?: Date;
  className?: string;
}

export function HolidayShippingBanner({
  currentDate,
  className = '',
}: HolidayShippingBannerProps) {
  if (!isHolidayShippingWindow(currentDate)) {
    return null;
  }

  return (
    <div
      data-testid="holiday-shipping-banner"
      role="status"
      className={`inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 dark:bg-amber-950/30 px-3.5 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 ${className}`}
    >
      <PackageCheck className="h-3.5 w-3.5 text-amber-500 shrink-0" />
      <span>
        Winter &amp; Holiday Pickup Window: Order before Dec 18 for pre-holiday Prime delivery.
      </span>
    </div>
  );
}
