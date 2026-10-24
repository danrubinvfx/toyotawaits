import React, { act } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ModelWaitTimePage, {
  generateMetadata,
  generateStaticParams,
} from '@/app/wait-times/[model]/page';
import { MODEL_REGISTRY } from '@/lib/data/model-registry';

// Mock MarketContext for client components in testing environment
vi.mock('@/context/MarketContext', () => ({
  useMarket: () => ({ market: 'CA', setMarket: vi.fn() }),
  MarketProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Dedicated SEO Route: /wait-times/[model]', () => {
  it('generates static params for all 13 registered Canadian vehicle models', async () => {
    const params = await generateStaticParams();
    expect(params.length).toBe(Object.keys(MODEL_REGISTRY).length);
    expect(params.some((p) => p.model === 'rav4')).toBe(true);
    expect(params.some((p) => p.model === 'sienna')).toBe(true);
    expect(params.some((p) => p.model === 'grand-highlander')).toBe(true);
    expect(params.some((p) => p.model === 'highlander')).toBe(true);
    expect(params.some((p) => p.model === 'prius')).toBe(true);
    expect(params.some((p) => p.model === 'tacoma')).toBe(true);
    expect(params.some((p) => p.model === 'tundra')).toBe(true);
    expect(params.some((p) => p.model === 'corolla-cross')).toBe(true);
    expect(params.some((p) => p.model === 'camry')).toBe(true);
    expect(params.some((p) => p.model === 'land-cruiser')).toBe(true);
    expect(params.some((p) => p.model === '4runner')).toBe(true);
    expect(params.some((p) => p.model === 'sequoia')).toBe(true);
    expect(params.some((p) => p.model === 'crown-signia')).toBe(true);
  });

  it('generates high-intent dynamic metadata with canonical URL and 2026 tracker copy', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ model: 'rav4' }),
    });

    expect(metadata.title).toBe(
      'Toyota RAV4 Wait Times Canada (2026 Tracker) | ToyotaWaits'
    );
    expect(metadata.description).toBe(
      'Track real-time 2026 Toyota RAV4 delivery wait times across Canada. Compare crowdsourced lead times by trim and province.'
    );
    expect(metadata.alternates?.canonical).toBe('https://toyotawaits.ca/wait-times/rav4');
  });

  it('renders exact <h1>, fast summary grid, breakdown sections, and Sienna hitch guide banner', async () => {
    const jsx = await ModelWaitTimePage({
      params: Promise.resolve({ model: 'sienna' }),
    });

    let container: HTMLElement = document.body;
    await act(async () => {
      const rendered = render(jsx);
      container = rendered.container;
    });

    // Verify exact H1 search target: {Model} Wait Times in Canada (2026 Tracker)
    const heading = screen.getByRole('heading', {
      level: 1,
      name: 'Toyota Sienna Wait Times in Canada (2026 Tracker)',
    });
    expect(heading).toBeInTheDocument();

    // Verify fast summary grid columns
    expect(screen.getAllByText('Powertrain').length).toBeGreaterThan(0);
    expect(screen.getByText('National Median')).toBeInTheDocument();
    expect(screen.getByText('BC Lead Time')).toBeInTheDocument();
    expect(screen.getByText('Ontario Lead Time')).toBeInTheDocument();
    expect(screen.getAllByText('Hybrid AWD / FWD').length).toBeGreaterThan(0);

    // Verify Breakdown sections (<h2>)
    expect(screen.getByText(/Trim & Powertrain Delivery Spreads/i)).toBeInTheDocument();
    expect(screen.getByText(/Provincial Allocation Breakdown \(BC, AB, ON, QC\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Model-Specific Allocation Tips & Order Guidance/i)).toBeInTheDocument();
    expect(screen.getByText(/Recent Verified Submissions & Delivery Log/i)).toBeInTheDocument();
    expect(screen.getByText(/Frequently Asked Questions: Toyota Sienna Wait Times/i)).toBeInTheDocument();

    // Verify Sienna Hitch Guide Banner
    expect(screen.getByText('Planning Bike Racks or Towing?')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Waiting on your delivery\? Read our 2021\+ Toyota Sienna Trailer Hitch & Kick-Sensor Guide/i
      )
    ).toBeInTheDocument();
    const hitchLink = screen.getByRole('link', { name: /View Sienna Hitch Guide ->/i });
    expect(hitchLink).toHaveAttribute('href', '/guides/toyota-sienna-trailer-hitch-guide');

    // Verify JSON-LD Schema
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const json = JSON.parse(script!.textContent || '{}');
    expect(json['@context']).toBe('https://schema.org');

    const dataset = json['@graph'].find((e: any) => e['@type'] === 'Dataset');
    expect(dataset).toBeDefined();
    expect(dataset.name).toBe('Toyota Sienna Wait Times in Canada (2026 Tracker)');
    expect(dataset.license).toBe('https://creativecommons.org/licenses/by-nc/4.0/');
    expect(dataset.spatialCoverage).toBe('Canada');

    const faqPage = json['@graph'].find((e: any) => e['@type'] === 'FAQPage');
    expect(faqPage).toBeDefined();
    expect(faqPage.mainEntity.length).toBeGreaterThan(0);
    expect(faqPage.mainEntity[0].name).toContain('Toyota Sienna in Canada');
  });

  it('renders distinct data separation for rav4, sienna, and tacoma', async () => {
    // 1. RAV4
    const rav4Jsx = await ModelWaitTimePage({
      params: Promise.resolve({ model: 'rav4' }),
    });
    const rav4Render = render(rav4Jsx);
    expect(rav4Render.getByRole('heading', { level: 1, name: 'Toyota RAV4 Wait Times in Canada (2026 Tracker)' })).toBeInTheDocument();
    expect(rav4Render.getAllByText('Gas').length).toBeGreaterThan(0);
    expect(rav4Render.getAllByText('Plug-in Hybrid').length).toBeGreaterThan(0);
    rav4Render.unmount();

    // 2. Tacoma
    const tacomaJsx = await ModelWaitTimePage({
      params: Promise.resolve({ model: 'tacoma' }),
    });
    const tacomaRender = render(tacomaJsx);
    expect(tacomaRender.getByRole('heading', { level: 1, name: 'Toyota Tacoma Wait Times in Canada (2026 Tracker)' })).toBeInTheDocument();
    expect(tacomaRender.getAllByText('i-FORCE').length).toBeGreaterThan(0);
    expect(tacomaRender.getAllByText('i-FORCE MAX').length).toBeGreaterThan(0);
    tacomaRender.unmount();
  });

  it('triggers notFound() when an invalid slug is requested', async () => {
    await expect(
      ModelWaitTimePage({
        params: Promise.resolve({ model: 'invalid-model-slug' }),
      })
    ).rejects.toThrow();
  });
});
