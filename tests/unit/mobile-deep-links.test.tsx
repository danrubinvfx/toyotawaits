import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { buildAmazonDeepLinks } from '@/lib/gear/affiliate';
import { handleAmazonNavigation, useAmazonRedirect } from '@/components/gear/useAmazonRedirect';
import { GearCard } from '@/components/gear/GearCard';
import { CalculatorGearCards } from '@/components/gear/CalculatorGearCards';
import { DeliveryGearCard } from '@/components/gear/DeliveryGearCard';
import { MarketProvider } from '@/context/MarketContext';
import { NextRequest } from 'next/server';
import { GET } from '@/app/out/[slug]/route';

describe('Mobile Deep Links & Intent Routing Utility (affiliate.ts)', () => {
  it('generates correct Canadian deep link targets for search queries', () => {
    const targets = buildAmazonDeepLinks({
      query: 'RAV4 floor mats',
      market: 'CA',
    });

    expect(targets.webUrl).toBe(
      'https://www.amazon.ca/s?k=RAV4%20floor%20mats&tag=toyotawaits-20'
    );
    expect(targets.iosSchemeUrl).toBe(
      'com.amazon.mobile.shopping.web://amazon.ca/s?k=RAV4%20floor%20mats&tag=toyotawaits-20'
    );
    expect(targets.androidIntentUrl).toBe(
      'intent://amazon.ca/s?k=RAV4%20floor%20mats&tag=toyotawaits-20#Intent;scheme=com.amazon.mobile.shopping.web;package=com.amazon.mShop.android.shopping;S.browser_fallback_url=https%3A%2F%2Fwww.amazon.ca%2Fs%3Fk%3DRAV4%2520floor%2520mats%26tag%3Dtoyotawaits-20;end'
    );
  });

  it('generates correct US deep link targets for verified ASINs', () => {
    const targets = buildAmazonDeepLinks({
      asin: 'B09GLVMB76',
      market: 'US',
    });

    expect(targets.webUrl).toBe(
      'https://www.amazon.com/dp/B09GLVMB76?tag=toyotawaits07-20'
    );
    expect(targets.iosSchemeUrl).toBe(
      'com.amazon.mobile.shopping.web://amazon.com/dp/B09GLVMB76?tag=toyotawaits07-20'
    );
    expect(targets.androidIntentUrl).toBe(
      'intent://amazon.com/dp/B09GLVMB76?tag=toyotawaits07-20#Intent;scheme=com.amazon.mobile.shopping.web;package=com.amazon.mShop.android.shopping;S.browser_fallback_url=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB09GLVMB76%3Ftag%3Dtoyotawaits07-20;end'
    );
  });

  it('correctly parses an existing full Amazon URL', () => {
    const rawUrl = 'https://www.amazon.ca/dp/B08XYZ1234?tag=toyotawaits-20';
    const targets = buildAmazonDeepLinks(rawUrl);

    expect(targets.webUrl).toBe(rawUrl);
    expect(targets.iosSchemeUrl).toBe('com.amazon.mobile.shopping.web://amazon.ca/dp/B08XYZ1234?tag=toyotawaits-20');
    expect(targets.androidIntentUrl).toContain('intent://amazon.ca/dp/B08XYZ1234?tag=toyotawaits-20');
    expect(targets.androidIntentUrl).toContain('package=com.amazon.mShop.android.shopping');
  });

  it('falls back to default search query when parameters are empty', () => {
    const targets = buildAmazonDeepLinks({});
    expect(targets.webUrl).toContain('s?k=Toyota%20accessories');
    expect(targets.webUrl).toContain('tag=toyotawaits-20');
  });
});

describe('Client-Side Safe Intent Dispatcher (useAmazonRedirect.ts)', () => {
  const originalUserAgent = navigator.userAgent;
  let originalLocation: Location;

  beforeEach(() => {
    originalLocation = window.location;
    // Mock window.location
    delete (window as any).location;
    window.location = {
      ...originalLocation,
      href: 'http://localhost:3000',
    } as any;
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true,
    });
    (window as any).location = originalLocation;
    vi.restoreAllMocks();
  });

  it('does nothing and does not preventDefault on desktop browsers', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
      configurable: true,
    });

    const preventDefault = vi.fn();
    const event = { preventDefault };
    const targets = buildAmazonDeepLinks({ query: 'test' });

    handleAmazonNavigation(event, targets);

    expect(preventDefault).not.toHaveBeenCalled();
    expect(window.location.href).toBe('http://localhost:3000');
  });

  it('dispatches to android intent URL and calls preventDefault on Android', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile',
      configurable: true,
    });

    const preventDefault = vi.fn();
    const event = { preventDefault };
    const targets = buildAmazonDeepLinks({ query: 'test', market: 'CA' });

    handleAmazonNavigation(event, targets);

    expect(preventDefault).toHaveBeenCalled();
    expect(window.location.href).toBe(targets.androidIntentUrl);
  });

  it('dispatches to iOS scheme URL and sets up fallback on iOS', () => {
    vi.useFakeTimers();
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
      configurable: true,
    });

    vi.spyOn(document, 'hasFocus').mockReturnValue(true);
    const preventDefault = vi.fn();
    const event = { preventDefault };
    const targets = buildAmazonDeepLinks({ query: 'test', market: 'CA' });
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    handleAmazonNavigation(event, targets);

    expect(preventDefault).toHaveBeenCalled();
    expect(window.location.href).toBe(targets.iosSchemeUrl);

    // Fast forward timers to trigger fallback
    vi.advanceTimersByTime(1300);
    expect(windowOpenSpy).toHaveBeenCalledWith(targets.webUrl, '_blank', 'noopener,noreferrer');
    vi.useRealTimers();
  });
});

describe('Component Deep Link Interactions (GearCard, CalculatorGearCards, DeliveryGearCard)', () => {
  const sampleAmazonItem = {
    id: 'test-dashcam',
    slug: 'test-dashcam',
    title: 'Plug and Play 4K Dashcam',
    category: 'Electronics & Safety',
    priceEst: '$240 CAD',
    asin: 'B09GLVMB76',
    searchQuery: 'Fitcamx Dash Cam RAV4',
  };

  it('DeliveryGearCard renders identical output to GearCard', () => {
    render(<DeliveryGearCard item={sampleAmazonItem} />);
    const link = screen.getByRole('link', { name: /View on Amazon/i });
    expect(link.getAttribute('href')).toContain('amazon.ca/dp/B09GLVMB76?tag=toyotawaits-20');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toContain('sponsored');
    expect(link.getAttribute('rel')).toContain('nofollow');
  });

  it('GearCard renders standard semantic SEO attributes for web fallback', () => {
    render(<GearCard item={sampleAmazonItem} />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(2);

    links.forEach((link) => {
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toContain('sponsored');
      expect(link.getAttribute('rel')).toContain('nofollow');
      expect(link.getAttribute('href')).toContain('amazon.ca/dp/B09GLVMB76?tag=toyotawaits-20');
    });
  });

  it('triggers handleAmazonNavigation on mobile when clicking GearCard image or CTA', () => {
    const originalUserAgent = navigator.userAgent;
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, href: 'http://localhost:3000' } as any;

    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Mobile',
      configurable: true,
    });

    render(<GearCard item={sampleAmazonItem} />);
    const ctaLink = screen.getByRole('link', { name: /View on Amazon/i });

    fireEvent.click(ctaLink);
    expect(window.location.href).toContain('intent://amazon.ca/dp/B09GLVMB76');

    Object.defineProperty(navigator, 'userAgent', { value: originalUserAgent, configurable: true });
    (window as any).location = originalLocation;
  });

  it('CalculatorGearCards wraps preview image and CTA with mobile navigation dispatcher', () => {
    const originalUserAgent = navigator.userAgent;
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, href: 'http://localhost:3000' } as any;

    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Mobile',
      configurable: true,
    });

    render(
      <MarketProvider initialMarket="CA">
        <CalculatorGearCards activeModel="rav4" />
      </MarketProvider>
    );

    // Find first non-partner Amazon action link
    const links = screen.getAllByRole('link');
    const amazonLink = links.find((l) => l.getAttribute('href')?.includes('amazon.ca'));
    expect(amazonLink).toBeDefined();

    fireEvent.click(amazonLink!);
    expect(window.location.href).toContain('intent://amazon.ca');

    Object.defineProperty(navigator, 'userAgent', { value: originalUserAgent, configurable: true });
    (window as any).location = originalLocation;
  });
});

describe('Internal Proxy Redirect Route (/out/[slug]) Mobile Intent Routing', () => {
  it('redirects Android user agent to intent:// URI with 307', async () => {
    const request = new NextRequest('http://localhost:3000/out/tuxmat-rav4', {
      headers: {
        'user-agent': 'Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 Chrome/120.0 Mobile',
      },
    });

    const response = await GET(request, {
      params: Promise.resolve({ slug: 'tuxmat-rav4' }),
    });

    expect(response.status).toBe(307);
    const location = response.headers.get('Location') || '';
    expect(location).toContain('intent://');
    expect(location).toContain('package=com.amazon.mShop.android.shopping');
    expect(location).toContain('S.browser_fallback_url=');
    expect(location).toContain('tag%3Dtoyotawaits-20');
  });

  it('serves iOS scheme bounce HTML page with fallback for iOS user agent', async () => {
    const request = new NextRequest('http://localhost:3000/out/tuxmat-rav4', {
      headers: {
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
      },
    });

    const response = await GET(request, {
      params: Promise.resolve({ slug: 'tuxmat-rav4' }),
    });

    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toContain('com.amazon.mobile.shopping.web://');
    expect(text).toContain('amazon.ca');
    expect(text).toContain('tag=toyotawaits-20');
    expect(text).toContain('Opening Amazon Shopping');
  });

  it('keeps 307 temporary redirect for desktop browsers', async () => {
    const request = new NextRequest('http://localhost:3000/out/tuxmat-rav4', {
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      },
    });

    const response = await GET(request, {
      params: Promise.resolve({ slug: 'tuxmat-rav4' }),
    });

    expect(response.status).toBe(307);
    const location = response.headers.get('Location') || '';
    expect(location).toContain('https://www.amazon.ca');
    expect(location).toContain('tag=toyotawaits-20');
  });
});
