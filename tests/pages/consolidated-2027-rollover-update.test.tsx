import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { headers } from 'next/headers';
import nextConfig from '../../next.config';
import { MarketProvider } from '@/context/MarketContext';
import { computeRolloverPriceProtectionStats } from '@/lib/db/rollover-stats';
import {
  HolidayShippingBanner,
  isHolidayShippingWindow,
} from '@/components/gear/HolidayShippingBanner';
import { SubmissionForm } from '@/components/forms/submission-form';

import FourRunnerGuidePage, {
  generateMetadata as generateFourRunnerMetadata,
  dynamic as fourRunnerDynamic,
  instant as fourRunnerInstant,
} from '@/app/guides/toyota-4runner-2026-vs-2027/page';
import TacomaGuidePage, {
  generateMetadata as generateTacomaMetadata,
  dynamic as tacomaDynamic,
  instant as tacomaInstant,
} from '@/app/guides/toyota-tacoma-2026-vs-2027/page';
import CamryGuidePage, {
  generateMetadata as generateCamryMetadata,
  dynamic as camryDynamic,
  instant as camryInstant,
} from '@/app/guides/toyota-camry-2026-vs-2027/page';
import CorollaCrossGuidePage, {
  generateMetadata as generateCorollaCrossMetadata,
  dynamic as corollaCrossDynamic,
  instant as corollaCrossInstant,
} from '@/app/guides/toyota-corolla-cross-2026-vs-2027/page';

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Map([['host', 'www.toyotawaits.ca']])),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/components/common/back-button', () => ({
  BackButton: ({ label }: { label?: string }) => <div data-testid="back-button">{label}</div>,
}));

vi.mock('@/components/common/GuideDisclaimer', () => ({
  GuideDisclaimer: () => <div data-testid="guide-disclaimer">Disclaimer</div>,
}));

describe('Consolidated Preemptive 2027 Update', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(headers).mockResolvedValue(new Map([['host', 'www.toyotawaits.ca']]) as any);
  });

  describe('1. All 4 2026-vs-2027 Guides (CA/US Metadata, Hreflang, FAQPage JSON-LD)', () => {
    const guideCases = [
      {
        name: '4Runner',
        slug: 'toyota-4runner-2026-vs-2027',
        Page: FourRunnerGuidePage,
        generateMetadata: generateFourRunnerMetadata,
        dynamic: fourRunnerDynamic,
        instant: fourRunnerInstant,
        expectedText: /\$43,490/,
      },
      {
        name: 'Tacoma',
        slug: 'toyota-tacoma-2026-vs-2027',
        Page: TacomaGuidePage,
        generateMetadata: generateTacomaMetadata,
        dynamic: tacomaDynamic,
        instant: tacomaInstant,
        expectedText: /\+\$180 USD/,
      },
      {
        name: 'Camry',
        slug: 'toyota-camry-2026-vs-2027',
        Page: CamryGuidePage,
        generateMetadata: generateCamryMetadata,
        dynamic: camryDynamic,
        instant: camryInstant,
        expectedText: /\$35,560/,
      },
      {
        name: 'Corolla Cross',
        slug: 'toyota-corolla-cross-2026-vs-2027',
        Page: CorollaCrossGuidePage,
        generateMetadata: generateCorollaCrossMetadata,
        dynamic: corollaCrossDynamic,
        instant: corollaCrossInstant,
        expectedText: /196-hp/i,
      },
    ];

    for (const guide of guideCases) {
      it(`${guide.name} exports Next.js 16 flags, CA & US metadata, hreflang alternates, and FAQPage JSON-LD`, async () => {
        expect(guide.dynamic).toBe('force-dynamic');
        expect(guide.instant).toBe(false);

        const caMeta = await guide.generateMetadata();
        expect(caMeta.alternates?.canonical).toBe(`https://www.toyotawaits.ca/guides/${guide.slug}`);
        expect(caMeta.alternates?.languages?.['en-CA']).toBe(
          `https://www.toyotawaits.ca/guides/${guide.slug}`
        );
        expect(caMeta.alternates?.languages?.['en-US']).toBe(
          `https://www.toyotawaits.com/guides/${guide.slug}`
        );
        expect(caMeta.alternates?.languages?.['x-default']).toBe(
          `https://www.toyotawaits.ca/guides/${guide.slug}`
        );

        vi.mocked(headers).mockResolvedValue(new Map([['host', 'www.toyotawaits.com']]) as any);
        const usMeta = await guide.generateMetadata();
        expect(usMeta.alternates?.canonical).toBe(`https://www.toyotawaits.com/guides/${guide.slug}`);
        expect(String(usMeta.title)).not.toContain('Canada');

        const ui = await guide.Page();
        const { container } = render(<MarketProvider initialMarket="US">{ui}</MarketProvider>);
        const scripts = Array.from(container.querySelectorAll('script[type="application/ld+json"]'));
        const schemas = scripts.map((s) => JSON.parse(s.innerHTML));
        const faqSchema = schemas.find((s) => s['@type'] === 'FAQPage');
        expect(faqSchema).toBeDefined();
        expect(faqSchema.mainEntity.length).toBeGreaterThanOrEqual(3);

        expect(screen.getByTestId('rollover-price-protection-tracker')).toBeInTheDocument();
        expect(container.textContent).toMatch(guide.expectedText);
      });
    }
  });

  describe('2. Rollover Price-Protection Aggregation & SubmissionForm Selector', () => {
    it('computes price-protection stats and falls back when sample size < 3', () => {
      const small = computeRolloverPriceProtectionStats('4runner', [
        { rollover_price_status: 'honored_2026_msrp' },
        { rollover_price_status: 'not_applicable' },
      ]);
      expect(small.totalRollovers).toBe(1);
      expect(small.hasSufficientSample).toBe(false);

      const large = computeRolloverPriceProtectionStats('4runner', [
        { rollover_price_status: 'honored_2026_msrp' },
        { rollover_price_status: 'honored_2026_msrp' },
        { rollover_price_status: 'adjusted_2027_msrp' },
      ]);
      expect(large.totalRollovers).toBe(3);
      expect(large.honoredCount).toBe(2);
      expect(large.adjustedCount).toBe(1);
      expect(large.honoredPercent).toBe(67);
      expect(large.adjustedPercent).toBe(33);
      expect(large.hasSufficientSample).toBe(true);
    });

    it('reveals rollover pricing selector when modelYear === 2027 and submits rollover_price_status', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: { id: 'sub-1', editKey: 'key-1234567890123456' } }),
      } as any);

      render(
        <MarketProvider initialMarket="CA">
          <SubmissionForm initialOrderDate="2026-06-15" initialTurnstileToken="test-token" />
        </MarketProvider>
      );

      expect(screen.queryByLabelText(/2026 to 2027 Model-Year Rollover Pricing/i)).not.toBeInTheDocument();

      const yearSelect = screen.getByLabelText(/Model Year/i);
      fireEvent.change(yearSelect, { target: { value: '2027' } });

      const rolloverSelect = screen.getByLabelText(/2026 to 2027 Model-Year Rollover Pricing/i);
      expect(rolloverSelect).toBeInTheDocument();

      fireEvent.change(rolloverSelect, { target: { value: 'honored_2026_msrp' } });
      expect((rolloverSelect as HTMLSelectElement).value).toBe('honored_2026_msrp');

      const submitBtn = screen.getByRole('button', { name: /Submit Wait Time Anonymously/i });
      fireEvent.click(submitBtn);

      await vi.waitFor(() => expect(fetchSpy).toHaveBeenCalled());
      const sentBody = JSON.parse(String(fetchSpy.mock.calls[0][1]?.body));
      expect(sentBody.rollover_price_status).toBe('honored_2026_msrp');

      fetchSpy.mockRestore();
    });
  });

  describe('3. Dec 18 Holiday Shipping Urgency Cue', () => {
    it('renders between Nov 25 and Dec 18 and hides outside the window', () => {
      expect(isHolidayShippingWindow(new Date('2026-11-24'))).toBe(false);
      expect(isHolidayShippingWindow(new Date('2026-11-25'))).toBe(true);
      expect(isHolidayShippingWindow(new Date('2026-12-18'))).toBe(true);
      expect(isHolidayShippingWindow(new Date('2026-12-19'))).toBe(false);

      const { rerender } = render(<HolidayShippingBanner currentDate={new Date('2026-11-28')} />);
      expect(
        screen.getByText(/Winter & Holiday Pickup Window: Order before Dec 18 for pre-holiday Prime delivery\./i)
      ).toBeInTheDocument();

      rerender(<HolidayShippingBanner currentDate={new Date('2026-12-20')} />);
      expect(screen.queryByTestId('holiday-shipping-banner')).not.toBeInTheDocument();
    });
  });

  describe('4. next.config.ts Redirect Audit (Zero Self-Loops & Multi-Hop Chains)', () => {
    it('has zero self-referencing loops or multi-hop redirect chains', async () => {
      const redirects = await (nextConfig.redirects ? nextConfig.redirects() : []);
      const nonHostRedirects = redirects.filter((r) => !r.has);

      const sourceSet = new Set(nonHostRedirects.map((r) => r.source));
      for (const rule of nonHostRedirects) {
        expect(rule.destination).not.toBe(rule.source);
        expect(
          sourceSet.has(rule.destination),
          `Multi-hop redirect detected: ${rule.source} -> ${rule.destination}`
        ).toBe(false);
      }

      const expected301s: Array<[string, string]> = [
        ['/wait-times/rav4-hybrid', '/wait-times/rav4'],
        ['/wait-times/sienna-hybrid', '/wait-times/sienna'],
        ['/guides/sienna-2026-vs-2027', '/guides/toyota-sienna-2026-vs-2027'],
        ['/guides/rav4-2026-vs-2027', '/guides/toyota-rav4-2026-vs-2027'],
        ['/guides/4runner-2026-vs-2027', '/guides/toyota-4runner-2026-vs-2027'],
        ['/guides/tacoma-2026-vs-2027', '/guides/toyota-tacoma-2026-vs-2027'],
      ];
      for (const [src, dest] of expected301s) {
        const match = nonHostRedirects.find((r) => r.source === src);
        expect(match).toBeDefined();
        expect(match?.destination).toBe(dest);
        expect(match?.permanent).toBe(true);
      }
    });
  });
});
