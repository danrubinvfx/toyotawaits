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

    it('optimizes Grand Highlander dynamic title, description, OpenGraph, and Twitter tags for high CTR', async () => {
    const currentMonthYear = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const metadata = await generateMetadata({
      params: Promise.resolve({ model: 'grand-highlander' }),
    });

    expect(metadata.title).toBe(
      `Toyota Grand Highlander Wait Times Canada (Updated ${currentMonthYear}) | Live Delivery Tracker`
    );
    expect(metadata.description).toBe(
      `Track real-time crowdsourced Toyota Grand Highlander delivery wait times and allocations across Canada (Updated ${currentMonthYear}). Compare lead times by powertrain, trim, and province.`
    );
    expect(metadata.openGraph?.title).toBe(
      `Toyota Grand Highlander Wait Times Canada (Updated ${currentMonthYear}) | Live Delivery Tracker`
    );
    expect(metadata.openGraph?.description).toBe(
      `Track real-time crowdsourced Toyota Grand Highlander delivery wait times and allocations across Canada (Updated ${currentMonthYear}). Compare lead times by powertrain, trim, and province.`
    );
    expect((metadata.twitter as any)?.title).toBe(
      `Toyota Grand Highlander Wait Times Canada (Updated ${currentMonthYear}) | Live Delivery Tracker`
    );
    expect((metadata.twitter as any)?.description).toBe(
      `Track real-time crowdsourced Toyota Grand Highlander delivery wait times and allocations across Canada (Updated ${currentMonthYear}). Compare lead times by powertrain, trim, and province.`
    );
    expect(metadata.alternates?.canonical).toBe(
      'https://www.toyotawaits.ca/wait-times/grand-highlander'
    );
  });

  it('generates high-intent dynamic metadata with canonical URL and dynamic freshness date', async () => {
    const currentMonthYear = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const metadata = await generateMetadata({
      params: Promise.resolve({ model: 'rav4' }),
    });

    expect(metadata.title).toBe(
      `Toyota RAV4 Wait Times Canada (Updated ${currentMonthYear}) | Live Delivery Tracker`
    );
    expect(metadata.description).toBe(
      `Track real-time crowdsourced Toyota RAV4 delivery wait times and allocations across Canada (Updated ${currentMonthYear}). Compare lead times by powertrain, trim, and province.`
    );
    expect(metadata.alternates?.canonical).toBe('https://www.toyotawaits.ca/wait-times/rav4');
  });

  it('renders exact <h1>, Position Zero answer box, fast summary grid, calculator banner, and Sienna hitch guide banner', async () => {
    const currentMonthYear = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const jsx = await ModelWaitTimePage({
      params: Promise.resolve({ model: 'sienna' }),
    });

    let container: HTMLElement = document.body;
    await act(async () => {
      const rendered = render(jsx);
      container = rendered.container;
    });

    // Verify exact H1 search target: {Model} Wait Times Canada (Updated {Month Year})
    const heading = screen.getByRole('heading', {
      level: 1,
      name: `Toyota Sienna Wait Times Canada (Updated ${currentMonthYear})`,
    });
    expect(heading).toBeInTheDocument();

    // Verify Featured Snippet Position Zero Answer Box
    const snippetBox = screen.getByTestId('featured-snippet-box');
    expect(snippetBox).toBeInTheDocument();
    expect(screen.getByText(/Quick Summary • Canadian Delivery Overview/i)).toBeInTheDocument();
    expect(screen.getByText('Canadian Median Wait')).toBeInTheDocument();
    expect(screen.getAllByText('Powertrain Breakdown').length).toBeGreaterThan(0);
    expect(screen.getByText('Regional Lead Times')).toBeInTheDocument();
    expect(screen.getByText(/Fastest:/i)).toBeInTheDocument();
    expect(screen.getByText(/Slowest:/i)).toBeInTheDocument();

    // Verify fast summary grid columns
    expect(screen.getAllByText('Powertrain').length).toBeGreaterThan(0);
    expect(screen.getByText('National Median')).toBeInTheDocument();
    expect(screen.getByText('BC Lead Time')).toBeInTheDocument();
    expect(screen.getByText('Ontario Lead Time')).toBeInTheDocument();
    expect(screen.getAllByText('Hybrid AWD / FWD').length).toBeGreaterThan(0);

    // Verify Contextual Calculator Teaser Callout Banner for high-volume model (Sienna)
    const calcBanner = screen.getByTestId('calculator-teaser-banner');
    expect(calcBanner).toBeInTheDocument();
    expect(screen.getAllByText(/Weighing Gas vs\. Hybrid\?/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Calculate your annual fuel savings and the extra energy cost of waiting/i)).toBeInTheDocument();
    const calcCta = screen.getByRole('link', { name: /Calculate Payback & Waiting Cost →/i });
    expect(calcCta).toHaveAttribute('href', '/calculator/sienna-hybrid');

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
    expect(dataset.name).toBe(`Toyota Sienna Wait Times in Canada (${currentMonthYear} Tracker)`);
    expect(dataset.license).toBe('https://creativecommons.org/licenses/by-nc/4.0/');
    expect(dataset.spatialCoverage).toBe('Canada');

    const faqPage = json['@graph'].find((e: any) => e['@type'] === 'FAQPage');
    expect(faqPage).toBeDefined();
    expect(faqPage.mainEntity.length).toBeGreaterThanOrEqual(2);
    // Core user queries
    expect(faqPage.mainEntity[0].name).toBe('What is the average wait time for a Toyota Sienna in Canada?');
    expect(faqPage.mainEntity[1].name).toBe('Which Canadian province has the shortest wait time for the Sienna?');
  });

  it('renders distinct data separation for rav4, sienna, and tacoma', async () => {
    const currentMonthYear = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
    // 1. RAV4
    const rav4Jsx = await ModelWaitTimePage({
      params: Promise.resolve({ model: 'rav4' }),
    });
    const rav4Render = render(rav4Jsx);
    expect(rav4Render.getByRole('heading', { level: 1, name: `Toyota RAV4 Wait Times Canada (Updated ${currentMonthYear})` })).toBeInTheDocument();
    expect(rav4Render.getAllByText('Gas').length).toBeGreaterThan(0);
    expect(rav4Render.getAllByText('Plug-in Hybrid').length).toBeGreaterThan(0);
    // RAV4 has calculator banner
    expect(rav4Render.getByTestId('calculator-teaser-banner')).toBeInTheDocument();
    rav4Render.unmount();

    // 2. Tacoma
    const tacomaJsx = await ModelWaitTimePage({
      params: Promise.resolve({ model: 'tacoma' }),
    });
    const tacomaRender = render(tacomaJsx);
    expect(tacomaRender.getByRole('heading', { level: 1, name: `Toyota Tacoma Wait Times Canada (Updated ${currentMonthYear})` })).toBeInTheDocument();
    expect(tacomaRender.getAllByText('i-FORCE').length).toBeGreaterThan(0);
    expect(tacomaRender.getAllByText('i-FORCE MAX').length).toBeGreaterThan(0);
    // Tacoma is not in rav4, sienna, camry, so calculator teaser is omitted
    expect(tacomaRender.queryByTestId('calculator-teaser-banner')).toBeNull();
    tacomaRender.unmount();
  });

  it('renders Delivery Day Upgrades & Partner Deals section with Muslogy partner items for rav4, sienna, and grand-highlander', async () => {
    // 1. RAV4 Wait Times Page
    const rav4Jsx = await ModelWaitTimePage({
      params: Promise.resolve({ model: 'rav4' }),
    });
    const rav4Render = render(rav4Jsx);
    expect(rav4Render.getByTestId('partner-deals-section')).toBeInTheDocument();
    expect(rav4Render.getAllByText(/Delivery Day Upgrades & Partner Deals/i).length).toBeGreaterThan(0);
    expect(rav4Render.getAllByText(/Muslogy Center Console Organizer Tray/i).length).toBeGreaterThan(0);
    expect(rav4Render.getAllByText('Toyotawaits').length).toBeGreaterThan(0);
    expect(rav4Render.getAllByText(/Partner Deal · 2% Off/i).length).toBeGreaterThan(0);

    const rav4Link = rav4Render.getAllByRole('link', { name: /Get 2% Off on Muslogy/i })[0];
    expect(rav4Link).toHaveAttribute('href', '/out/muslogy-rav4');
    expect(rav4Link).toHaveAttribute('target', '_blank');
    expect(rav4Link).toHaveAttribute('rel', 'sponsored noopener noreferrer');
    rav4Render.unmount();

    // 2. Sienna Wait Times Page
    const siennaJsx = await ModelWaitTimePage({
      params: Promise.resolve({ model: 'sienna' }),
    });
    const siennaRender = render(siennaJsx);
    expect(siennaRender.getByTestId('partner-deals-section')).toBeInTheDocument();
    expect(siennaRender.getAllByText(/Delivery Day Upgrades & Partner Deals/i).length).toBeGreaterThan(0);
    expect(siennaRender.getAllByText(/Muslogy Sliding Center Console & Bridge Organizer/i).length).toBeGreaterThan(0);

    const siennaLink = siennaRender.getAllByRole('link', { name: /Get 2% Off on Muslogy/i })[0];
    expect(siennaLink).toHaveAttribute('href', '/out/muslogy-console');
    siennaRender.unmount();

    // 3. Grand Highlander Wait Times Page
    const ghJsx = await ModelWaitTimePage({
      params: Promise.resolve({ model: 'grand-highlander' }),
    });
    const ghRender = render(ghJsx);
    expect(ghRender.getByTestId('partner-deals-section')).toBeInTheDocument();
    expect(ghRender.getAllByText(/Delivery Day Upgrades & Partner Deals/i).length).toBeGreaterThan(0);
    expect(ghRender.getAllByText(/Muslogy Center Console Dual-Tier Divider Tray/i).length).toBeGreaterThan(0);
    ghRender.unmount();
  });

  it('triggers notFound() when an invalid slug is requested', async () => {
    await expect(
      ModelWaitTimePage({
        params: Promise.resolve({ model: 'invalid-model-slug' }),
      })
    ).rejects.toThrow();
  });
});
