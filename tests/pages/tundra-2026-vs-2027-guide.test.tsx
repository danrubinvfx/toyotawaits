import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Tundra2026Vs2027GuidePage, {
  generateMetadata,
  dynamic,
  instant,
} from '@/app/guides/toyota-tundra-2026-vs-2027/page';
import ModelWaitTimePage, {
  generateMetadata as generateWaitTimesMetadata,
} from '@/app/wait-times/[model]/page';
import { MarketProvider } from '@/context/MarketContext';

describe('2026 vs. 2027 Toyota Tundra Guide Page & Model Hub', () => {
  it('has valid Next.js 16 route segment exports', () => {
    expect(dynamic).toBe('force-dynamic');
    expect(instant).toBe(false);
  });

  it('has valid SEO metadata and canonical URL matching specification requirements', async () => {
    const meta = await generateMetadata();
    expect(meta.title).toBe(
      '2026 vs. 2027 Toyota Tundra Canada: Trailhunter, TSS 4.0 & Wait Times | ToyotaWaits'
    );
    expect(meta.description).toBe(
      'Compare the 2026 and 2027 Toyota Tundra & i-FORCE MAX Hybrid in Canada. Breakdown of the new SR5 Trailhunter package, standard 14" screen, TSS 4.0, 122L fuel tank, and San Antonio allocation rollovers.'
    );
    expect(meta.alternates?.canonical).toBe(
      'https://www.toyotawaits.ca/guides/toyota-tundra-2026-vs-2027'
    );
  });

  it('renders JSON-LD FAQPage schema with the 3 mandatory Canadian questions', () => {
    const { container } = render(
      <MarketProvider initialMarket="CA">
        <Tundra2026Vs2027GuidePage />
      </MarketProvider>
    );

    const scripts = Array.from(container.querySelectorAll('script[type="application/ld+json"]'));
    expect(scripts.length).toBeGreaterThanOrEqual(1);

    const parsedSchemas = scripts.map((s) => JSON.parse(s.textContent || '{}'));
    const faqPage = parsedSchemas.find((s) => s['@type'] === 'FAQPage');

    expect(faqPage).toBeDefined();
    expect(faqPage.mainEntity).toHaveLength(3);

    expect(faqPage.mainEntity[0].name).toBe(
      'What are the major changes for the 2027 Toyota Tundra in Canada?'
    );
    expect(faqPage.mainEntity[0].acceptedAnswer.text).toBe(
      'Announced on November 5, 2026, the 2027 Toyota Tundra introduces a refreshed exterior fascia, a new SR5 Trailhunter overlanding package, upgraded TRD Pro FOX QS3 shocks, a standard 14-inch Toyota Multimedia screen, standard Toyota Safety Sense 4.0, a standard 122L fuel tank across all 31 Canadian 4x4 models, and Automated Trailer Detection.'
    );

    expect(faqPage.mainEntity[1].name).toBe(
      'Will my 2026 Toyota Tundra allocation roll over into a 2027 model year?'
    );
    expect(faqPage.mainEntity[1].acceptedAnswer.text).toBe(
      'Yes. Because Toyota Motor Manufacturing Texas (TMMTX) in San Antonio transitions assembly plates in fall 2026, unallocated 2026 Tundra orders—especially i-FORCE MAX hybrids, TRD Pro, and long-bed trims—automatically roll into 2027 VINs without losing dealership queue priority.'
    );

    expect(faqPage.mainEntity[2].name).toBe(
      'Should I take an incoming 2026 Tundra allocation or wait for a 2027?'
    );
    expect(faqPage.mainEntity[2].acceptedAnswer.text).toBe(
      'If you are buying an SR5 or Limited and want to save ~$3,500+ CAD in 2027 Canadian price increases (or prefer the 2026 CrewMax SR5 entry price), claim an incoming 2026 allocation. Wait for a 2027 if you want the new SR5 Trailhunter overlanding package, standard 14-inch screen on lower trims, TSS 4.0, or the upgraded TRD Pro FOX QS3 suspension.'
    );
  });

  it('renders the Year-Over-Year Comparison Table, Decision Matrix, Live Inventory CTA, and Day-1 Gear Shelf', () => {
    render(
      <MarketProvider initialMarket="CA">
        <Tundra2026Vs2027GuidePage />
      </MarketProvider>
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /2026 vs\. 2027 Toyota Tundra Canada: Trailhunter, TSS 4\.0 & Wait Times/i,
      })
    ).toBeInTheDocument();

    // Comparison Table checks
    expect(
      screen.getByRole('heading', {
        name: /Year-Over-Year Comparison Table \(2026 vs\. 2027 Canadian Specs\)/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/All-New SR5 Trailhunter Package/i)).toBeInTheDocument();
    expect(screen.getByText(/Upgraded Tundra-tuned FOX QS3 shocks/i)).toBeInTheDocument();
    expect(screen.getByText(/Standard 14-inch Toyota Multimedia across all grades/i)).toBeInTheDocument();
    expect(screen.getByText(/Standard Toyota Safety Sense 4\.0 with Emergency Drive Stop System/i)).toBeInTheDocument();
    expect(screen.getByText(/Standard 122-litre \(32\.2-gal\) tank & standard 4x4 across all 31 Canadian models/i)).toBeInTheDocument();
    expect(screen.getByText(/~\$65,738 \(2026\)/)).toBeInTheDocument();
    expect(screen.getByText(/\$69,573 \(2027\)/)).toBeInTheDocument();
    expect(screen.getByText(/~\$75,563 \(2026\)/)).toBeInTheDocument();
    expect(screen.getByText(/\$79,733 \(2027\)/)).toBeInTheDocument();
    expect(screen.getByText(/~\$79,218 \(2026\)/)).toBeInTheDocument();
    expect(screen.getByText(/\$83,658 \(2027\)/)).toBeInTheDocument();
    expect(screen.getByText(/~\$98,211 all-in \(2027\)/)).toBeInTheDocument();

    // Decision Matrix
    expect(
      screen.getByRole('heading', {
        name: /“Pass or Take It\?” Decision Matrix/i,
      })
    ).toBeInTheDocument();

    // Live Inventory & Wait Times CTAs
    const inventoryLink = screen.getByRole('link', {
      name: /Explore Live Toyota Tundra Inventory ↗/i,
    });
    expect(inventoryLink).toHaveAttribute('href', '/inventory?model=Tundra');

    const waitTimesLink = screen.getByRole('link', {
      name: /View Live Tundra Wait Times →/i,
    });
    expect(waitTimesLink).toHaveAttribute('href', '/wait-times/tundra');

    // Day-1 Delivery Gear Shelf (4 cards)
    expect(screen.getByText('Confirmed Fit 2022–2027')).toBeInTheDocument();
    expect(screen.getByText('All-Weather Bed Security')).toBeInTheDocument();
    expect(screen.getByText('Standard on All 2027s')).toBeInTheDocument();
    expect(screen.getByText('Day-1 Essential')).toBeInTheDocument();

    const gearLinks = [
      screen.getByRole('link', { name: /Check Floor Liners on Amazon ↗/i }),
      screen.getByRole('link', { name: /Check Tonneau Cover on Amazon ↗/i }),
      screen.getByRole('link', { name: /Check 14" Screen Shield on Amazon ↗/i }),
      screen.getByRole('link', { name: /Check Console Tray on Amazon ↗/i }),
    ];

    for (const link of gearLinks) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');
      expect(link.getAttribute('href')).toContain('amazon.ca/s?k=');
      expect(link.getAttribute('href')).toContain('tag=toyotawaits-20');
    }
  });

  it('updates /wait-times/tundra metadata title and renders the 2026 vs. 2027 Tundra comparison callout card', async () => {
    const hubMeta = await generateWaitTimesMetadata({
      params: Promise.resolve({ model: 'tundra' }),
    });
    expect(hubMeta.title).toBe(
      'Toyota Tundra Wait Times Canada (2026–2027 Delivery Tracker) | ToyotaWaits'
    );

    const jsx = await ModelWaitTimePage({
      params: Promise.resolve({ model: 'tundra' }),
    });
    render(jsx);

    expect(
      screen.getByText('Allocated a 2026 or Waiting for a 2027 Toyota Tundra?')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Announced Nov 5, 2026: the 2027 Tundra adds a refreshed grille, new SR5 Trailhunter package, standard 14" screen, TSS 4\.0, and a standard 122L fuel tank\. Compare 2026 vs\. 2027 before deciding\./i
      )
    ).toBeInTheDocument();

    const guideLink = screen.getByRole('link', {
      name: /Read 2026 vs\. 2027 Tundra Guide →/i,
    });
    expect(guideLink).toHaveAttribute('href', '/guides/toyota-tundra-2026-vs-2027');
  });
});
