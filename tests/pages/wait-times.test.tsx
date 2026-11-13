import React, { act } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ModelWaitTimePage, {
  generateMetadata,
  generateStaticParams,
  getCalculatorBridgeHref,
} from '@/app/wait-times/[model]/page';
import { MODEL_REGISTRY } from '@/lib/data/model-registry';

// Mock MarketContext for client components in testing environment
vi.mock('@/context/MarketContext', () => ({
  useMarket: () => ({ market: 'CA', setMarket: vi.fn() }),
  MarketProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Dedicated SEO Route: /wait-times/[model]', () => {
  it('generates static params for all registered Canadian vehicle models', async () => {
    const params = await generateStaticParams();
    expect(params.length).toBe(Object.keys(MODEL_REGISTRY).length);
    expect(params.some((p) => p.model === 'rav4')).toBe(true);
    expect(params.some((p) => p.model === 'sienna')).toBe(true);
    expect(params.some((p) => p.model === 'grand-highlander')).toBe(true);
    expect(params.some((p) => p.model === 'highlander')).toBe(true);
    expect(params.some((p) => p.model === 'prius')).toBe(true);
    expect(params.some((p) => p.model === 'tacoma')).toBe(true);
    expect(params.some((p) => p.model === 'tundra')).toBe(true);
    expect(params.some((p) => p.model === 'corolla')).toBe(true);
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
      'Toyota Grand Highlander Wait Times Canada (2026–2027 Backlog Tracker) | ToyotaWaits'
    );
    expect(metadata.description).toBe(
      `Track real-time crowdsourced Toyota Grand Highlander delivery wait times and allocations across Canada (Updated ${currentMonthYear}). Compare lead times by powertrain, trim, and province.`
    );
    expect(metadata.openGraph?.title).toBe(
      'Toyota Grand Highlander Wait Times Canada (2026–2027 Backlog Tracker) | ToyotaWaits'
    );
    expect(metadata.openGraph?.description).toBe(
      `Track real-time crowdsourced Toyota Grand Highlander delivery wait times and allocations across Canada (Updated ${currentMonthYear}). Compare lead times by powertrain, trim, and province.`
    );
    expect((metadata.twitter as any)?.title).toBe(
      'Toyota Grand Highlander Wait Times Canada (2026–2027 Backlog Tracker) | ToyotaWaits'
    );
    expect((metadata.twitter as any)?.description).toBe(
      `Track real-time crowdsourced Toyota Grand Highlander delivery wait times and allocations across Canada (Updated ${currentMonthYear}). Compare lead times by powertrain, trim, and province.`
    );
    expect(metadata.alternates?.canonical).toBe(
      'https://www.toyotawaits.ca/wait-times/grand-highlander'
    );
  });

  it('generates high-intent dynamic metadata with canonical URL and dynamic freshness date', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ model: 'rav4' }),
    });

    expect(metadata.title).toBe(
      'Toyota RAV4 Wait Times Canada (2026–2027 Delivery Tracker) | ToyotaWaits'
    );
    expect(metadata.description).toBe(
      'Real Canadian wait times and MSRP breakdown for the 2026 Toyota RAV4 Gas, Hybrid, and Plug-in Hybrid. Crowdsourced dealer delivery reports for BC, Ontario, and Alberta.'
    );
    expect(metadata.alternates?.canonical).toBe('https://www.toyotawaits.ca/wait-times/rav4');

    const siennaMetadata = await generateMetadata({
      params: Promise.resolve({ model: 'sienna' }),
    });

    expect(siennaMetadata.title).toBe(
      'Toyota Sienna Wait Times Canada (2026 Tracker) — Ontario & BC Backlog | ToyotaWaits'
    );
    expect(siennaMetadata.description).toBe(
      'Current crowdsourced wait times for the 2026 Toyota Sienna Hybrid across Canada. Check real delivery timelines for Ontario (GTA), British Columbia, and Alberta.'
    );
    expect(siennaMetadata.alternates?.canonical).toBe('https://www.toyotawaits.ca/wait-times/sienna');
  });

  it('optimizes Corolla dynamic title, h1, and description for 2026–2027 delivery tracking', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ model: 'corolla' }),
    });

    expect(metadata.title).toBe(
      'Toyota Corolla Wait Times Canada (2026–2027 Delivery Tracker) | ToyotaWaits'
    );
    expect(metadata.description).toContain('incoming 2027 allocations');
    expect(metadata.description).toContain('remaining 2026 units');
    expect(metadata.alternates?.canonical).toBe('https://www.toyotawaits.ca/wait-times/corolla');

    const jsx = await ModelWaitTimePage({
      params: Promise.resolve({ model: 'corolla' }),
    });
    render(jsx);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Toyota Corolla Wait Times in Canada (2026–2027 Delivery Tracker)',
      })
    ).toBeInTheDocument();
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

    // Verify Benchmark My Order Acquisition Widget is mounted
    const benchmarkWidget = screen.getByTestId('benchmark-order-widget');
    expect(benchmarkWidget).toBeInTheDocument();
    expect(screen.getByText('Where Do You Stand in Line?')).toBeInTheDocument();

    // Verify fast summary grid columns
    expect(screen.getAllByText('Powertrain').length).toBeGreaterThan(0);
    expect(screen.getByText('National Median')).toBeInTheDocument();
    expect(screen.getByText('BC Lead Time')).toBeInTheDocument();
    expect(screen.getByText('Ontario Lead Time')).toBeInTheDocument();
    expect(screen.getAllByText('Hybrid AWD / FWD').length).toBeGreaterThan(0);

    // Verify "Skip the Wait" Live Inventory Bridge Card
    const alertBridge = screen.getByTestId('model-drop-alert-bridge');
    expect(alertBridge).toBeInTheDocument();
    expect(screen.getByText(/⚡ SKIP THE QUEUE • ALLOCATION RADAR/i)).toBeInTheDocument();
    expect(screen.getByText(/Don't want to wait 13\.5 months for a Toyota Sienna\?/i)).toBeInTheDocument();
    const liveStockLink = screen.getByRole('link', { name: /Browse Live (Toyota )?Sienna Stock ↗/i });
    expect(liveStockLink).toHaveAttribute('href', '/inventory?model=sienna');

    // Verify Contextual Calculator Bridge & Delivery Day Preparation Bridge Cards
    const calcBanner = screen.getByTestId('calculator-teaser-banner');
    expect(calcBanner).toBeInTheDocument();
    expect(screen.getByText(/⚡ Financial Break-Even Analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/Weighing Gas vs\. Hybrid while you wait\?/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Calculate your annual fuel savings and determine if paying the hybrid premium or waiting out the queue makes financial sense\./i
      )
    ).toBeInTheDocument();
    const calcCta = screen.getByRole('link', { name: /Calculate Payback & Savings →/i });
    expect(calcCta).toHaveAttribute('href', '/calculator/sienna-hybrid');

    const deliveryPrepBanner = screen.getByTestId('delivery-prep-teaser-banner');
    expect(deliveryPrepBanner).toBeInTheDocument();
    expect(screen.getByText(/📋 Delivery Day Prep/i)).toBeInTheDocument();
    expect(screen.getByText(/Taking delivery in the next 30–90 days\?/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Avoid unexpected dealer doc fees, unverified accessory packages, and inspect fit-and-finish before signing\./i
      )
    ).toBeInTheDocument();
    const deliveryPrepCta = screen.getByRole('link', { name: /View Delivery Checklist →/i });
    expect(deliveryPrepCta).toHaveAttribute('href', '/delivery-prep');

    const ecpBanner = screen.getByTestId('ecp-warranty-teaser-banner');
    expect(ecpBanner).toBeInTheDocument();
    expect(screen.getByText(/🛡️ Finance Office Defense/i)).toBeInTheDocument();
    expect(screen.getByText(/Quoted \$3,000\+ for Toyota ECP Extended Warranty\?/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Break down factory hybrid coverage overlap, dealer margins, and whether extended protection makes financial sense for your Sienna\./i
      )
    ).toBeInTheDocument();
    const ecpCta = screen.getByRole('link', { name: /Check ECP Warranty Breakdown →/i });
    expect(ecpCta).toHaveAttribute('href', '/guides/toyota-ecp-warranty-guide');

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

    // Verify 2026 vs 2027 Sienna Guide Callout Banner
    expect(screen.getByText('Allocated a 2026 or 2027 Model?')).toBeInTheDocument();
    expect(
      screen.getByText(
        /The 2027 Sienna is a direct mechanical carryover\. Compare the trim differences and learn how dealer queue rollovers work before passing on a build slot\./i
      )
    ).toBeInTheDocument();
    const comparisonLink = screen.getByRole('link', { name: /Read 2026 vs\. 2027 Comparison →/i });
    expect(comparisonLink).toHaveAttribute('href', '/guides/toyota-sienna-2026-vs-2027');

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

  it('renders 2026 vs 2027 comparison card for RAV4 wait times page', async () => {
    const jsx = await ModelWaitTimePage({
      params: Promise.resolve({ model: 'rav4' }),
    });

    render(jsx);

    expect(screen.getByText('Allocated a 2026 or Holding Out for a 2027 RAV4?')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Toyota has announced major 2027 hardware revisions including native NACS Tesla charging and Level 3 DC fast charging\. Compare the changes before passing on an allocation\./i
      )
    ).toBeInTheDocument();
    const comparisonLink = screen.getByRole('link', { name: /Read 2026 vs\. 2027 Comparison →/i });
    expect(comparisonLink).toHaveAttribute('href', '/guides/toyota-rav4-2026-vs-2027');
  });

  it('renders 2026 vs 2027 comparison card for Grand Highlander wait times page', async () => {
    const jsx = await ModelWaitTimePage({
      params: Promise.resolve({ model: 'grand-highlander' }),
    });

    render(jsx);

    expect(screen.getByText('Allocated a 2026 or Waiting for a 2027 Grand Highlander?')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Toyota has officially announced the 2027 Grand Highlander featuring a new lifted Woodland Edition\. Compare the trim changes and see how queue rollovers work\./i
      )
    ).toBeInTheDocument();
    const comparisonLink = screen.getByRole('link', { name: /Read 2026 vs\. 2027 Comparison →/i });
    expect(comparisonLink).toHaveAttribute('href', '/guides/toyota-grand-highlander-2026-vs-2027');
  });

  it('renders 2026 vs 2027 comparison bridge card for Corolla Cross wait times page linking to guide and live inventory', async () => {
    const jsx = await ModelWaitTimePage({
      params: Promise.resolve({ model: 'corolla-cross' }),
    });

    render(jsx);

    expect(screen.getByText('Allocated a 2026 or Waiting for a 2027 Corolla Cross?')).toBeInTheDocument();
    const comparisonLink = screen.getByRole('link', { name: /Read 2026 vs\. 2027 Comparison →/i });
    expect(comparisonLink).toHaveAttribute('href', '/guides/toyota-corolla-cross-2026-vs-2027');

    const inventoryLink = screen.getByRole('link', { name: /Check Live Corolla Cross Stock ↗/i });
    expect(inventoryLink).toHaveAttribute('href', '/inventory?model=corolla-cross');
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
    // RAV4 has calculator banner linking to /calculator/rav4-hybrid
    expect(rav4Render.getByTestId('calculator-teaser-banner')).toBeInTheDocument();
    expect(
      rav4Render.getByRole('link', { name: /Calculate Payback & Savings →/i })
    ).toHaveAttribute('href', '/calculator/rav4-hybrid');
    expect(rav4Render.getByRole('heading', { level: 2, name: '2026 Toyota RAV4 Canada: Estimated Wait Times & Base Pricing' })).toBeInTheDocument();
    expect(rav4Render.getByTestId('rav4-summary-card')).toBeInTheDocument();
    expect(rav4Render.getByText('Gas (LE/XLE/Trail)')).toBeInTheDocument();
    expect(rav4Render.getByText(/MSRP ~\$35,950 CAD/)).toBeInTheDocument();
    expect(rav4Render.getByText(/Average Wait: ~2–4 months/)).toBeInTheDocument();
    expect(rav4Render.getByText('Hybrid (LE/XLE/Woodland/Limited)')).toBeInTheDocument();
    expect(rav4Render.getByText(/MSRP ~\$38,950 CAD/)).toBeInTheDocument();
    expect(rav4Render.getByText(/Average Wait: ~6–10 months/)).toBeInTheDocument();
    expect(rav4Render.getByText('Plug-in Hybrid (SE/XSE)')).toBeInTheDocument();
    expect(rav4Render.getByText(/MSRP ~\$53,150 CAD/)).toBeInTheDocument();
    expect(rav4Render.getByText(/Average Wait: ~12–18 months/)).toBeInTheDocument();
    expect(rav4Render.getByText(/In Canada, the average wait time for a 2026 Toyota RAV4 Hybrid is currently .* months, with fastest deliveries reported in Alberta and longer queues in BC and Ontario\./i)).toBeInTheDocument();
    rav4Render.unmount();

    // 2. Tacoma
    const tacomaJsx = await ModelWaitTimePage({
      params: Promise.resolve({ model: 'tacoma' }),
    });
    const tacomaRender = render(tacomaJsx);
    expect(tacomaRender.getByRole('heading', { level: 1, name: `Toyota Tacoma Wait Times Canada (Updated ${currentMonthYear})` })).toBeInTheDocument();
    expect(tacomaRender.getAllByText('i-FORCE').length).toBeGreaterThan(0);
    expect(tacomaRender.getAllByText('i-FORCE MAX').length).toBeGreaterThan(0);
    // Tacoma routes calculator bridge to fallback /calculator?model=tacoma
    expect(tacomaRender.getByTestId('calculator-teaser-banner')).toBeInTheDocument();
    expect(
      tacomaRender.getByRole('link', { name: /Calculate Payback & Savings →/i })
    ).toHaveAttribute('href', '/calculator?model=tacoma');
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
    expect(
      ghRender.getByRole('link', { name: /Calculate Payback & Savings →/i })
    ).toHaveAttribute('href', '/calculator/grand-highlander');
    ghRender.unmount();

    // Verify dynamic model context mapping helper
    expect(getCalculatorBridgeHref('rav4')).toBe('/calculator/rav4-hybrid');
    expect(getCalculatorBridgeHref('rav4-hybrid')).toBe('/calculator/rav4-hybrid');
    expect(getCalculatorBridgeHref('sienna')).toBe('/calculator/sienna-hybrid');
    expect(getCalculatorBridgeHref('grand-highlander')).toBe('/calculator/grand-highlander');
    expect(getCalculatorBridgeHref('camry')).toBe('/calculator?model=camry');
    expect(getCalculatorBridgeHref('corolla')).toBe('/calculator?model=corolla');
  });

  it('renders the seasonal Canadian winter delivery alert banner with tire and winter-prep cross-links', async () => {
    const rav4Jsx = await ModelWaitTimePage({
      params: Promise.resolve({ model: 'rav4' }),
    });
    const { getByTestId, getByRole, unmount } = render(rav4Jsx);

    const banner = getByTestId('seasonal-winter-delivery-banner');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveTextContent(/Taking winter delivery\? Check factory OEM tire specs/i);

    const tireLink = getByRole('link', { name: /Tire Fitment Guide →/i });
    expect(tireLink).toHaveAttribute('href', '/tires');

    const prepLink = getByRole('link', { name: /Winter Prep Checklist →/i });
    expect(prepLink).toHaveAttribute('href', '/winter-prep');

    unmount();
  });

  it('triggers notFound() when an invalid slug is requested', async () => {
    await expect(
      ModelWaitTimePage({
        params: Promise.resolve({ model: 'invalid-model-slug' }),
      })
    ).rejects.toThrow();
  });
});
