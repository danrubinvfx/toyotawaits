import React, { act } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import WaitTimesModelPage, {
  generateMetadata,
  generateStaticParams,
} from '@/app/wait-times/[slug]/page';

// Mock MarketContext for client components in testing environment
vi.mock('@/context/MarketContext', () => ({
  useMarket: () => ({ market: 'CA', setMarket: vi.fn() }),
  MarketProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Dedicated SEO Route: /wait-times/[slug]', () => {
  it('generates static params for all top unique vehicle models', async () => {
    const params = await generateStaticParams();
    expect(params.length).toBeGreaterThan(0);
    expect(params.some((p) => p.slug === 'rav4')).toBe(true);
    expect(params.some((p) => p.slug === 'sienna')).toBe(true);
    expect(params.some((p) => p.slug === 'grand-highlander')).toBe(true);
    expect(params.some((p) => p.slug === 'prius')).toBe(true);
  });

  it('generates high-intent dynamic metadata with canonical URL and current year', async () => {
    const currentYear = new Date().getFullYear();
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'rav4' }),
    });

    expect(metadata.title).toBe(
      `Toyota RAV4 Wait Times in Canada (${currentYear}) | Live Tracker`
    );
    expect(metadata.description).toMatch(
      /Current crowdsourced wait times for the Toyota RAV4 across Canada\. Average wait: \d+(\.\d+)? months based on \d+ owner reports\./
    );
    expect(metadata.alternates?.canonical).toBe('https://toyotawaits.ca/wait-times/rav4');
  });

  it('renders exact <h1> matching high-intent search query and summary stat card', async () => {
    const jsx = await WaitTimesModelPage({
      params: Promise.resolve({ slug: 'sienna' }),
    });

    let container: HTMLElement = document.body;
    await act(async () => {
      const rendered = render(jsx);
      container = rendered.container;
    });

    // Verify exact H1 search target
    const heading = screen.getByRole('heading', {
      level: 1,
      name: 'Toyota Sienna Wait Times in Canada',
    });
    expect(heading).toBeInTheDocument();

    // Verify summary stat card components
    expect(screen.getByText(/National Average Wait/i)).toBeInTheDocument();
    expect(screen.getByText(/Fastest Province/i)).toBeInTheDocument();
    expect(screen.getByText(/Slowest Province/i)).toBeInTheDocument();
    expect(screen.getByText(/Sample Size/i)).toBeInTheDocument();

    // Verify FAQ section
    expect(
      screen.getByText(/What is the average wait time for a Toyota Sienna in Canada\?/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Which Canadian province has the shortest wait time for the Sienna\?/i)
    ).toBeInTheDocument();

    // Verify JSON-LD Schema
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const json = JSON.parse(script!.textContent || '{}');
    expect(json['@context']).toBe('https://schema.org');

    const dataset = json['@graph'].find((e: any) => e['@type'] === 'Dataset');
    expect(dataset).toBeDefined();
    expect(dataset.name).toBe('Toyota Sienna Wait Times in Canada');
    expect(dataset.spatialCoverage).toBe('Canada');

    const faqPage = json['@graph'].find((e: any) => e['@type'] === 'FAQPage');
    expect(faqPage).toBeDefined();
    expect(faqPage.mainEntity.length).toBe(2);
    expect(faqPage.mainEntity[0].name).toContain('What is the average wait time for a Toyota Sienna in Canada?');
    expect(faqPage.mainEntity[1].name).toContain('Which Canadian province has the shortest wait time for the Sienna?');
  });
});
