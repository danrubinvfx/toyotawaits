import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SiennaTrailerHitchGuidePage, {
  metadata,
} from '@/app/guides/toyota-sienna-trailer-hitch-guide/page';
import { AFFILIATE_LINKS } from '@/lib/affiliate';

describe('Toyota Sienna Trailer Hitch Guide Page', () => {
  it('has valid SEO metadata matching specification requirements', () => {
    expect(metadata.title).toBe(
      'Toyota Sienna Trailer Hitch Guide (2021-2026) | Torklift vs. Curt & Kick-Sensor Compatibility'
    );
    expect(metadata.description).toBe(
      'Compare the best Class 3 trailer hitches for the 4th-gen Toyota Sienna hybrid. Learn which models clear driveways, work with hands-free kick sensors, and require zero cutting.'
    );
    expect(metadata.openGraph?.title).toBe(
      'Toyota Sienna Trailer Hitch Guide (2021-2026) | Torklift vs. Curt & Kick-Sensor Compatibility'
    );
  });

  it('renders main heading and key hitch models', () => {
    render(<SiennaTrailerHitchGuidePage />);

    expect(
      screen.getByRole('heading', {
        name: /2021–2026 Toyota Sienna Trailer Hitch & Kick-Sensor Guide/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /Torklift EcoHitch: The Definitive 2-Inch Receiver/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Curt 13470: The Fast Bolt-On Alternative/i })
    ).toBeInTheDocument();
  });

  it('renders top alert banner with FTC and Canadian Ad Standards disclosure', () => {
    render(<SiennaTrailerHitchGuidePage />);

    expect(
      screen.getByText(/Affiliate & Community Transparency Disclosure/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/FTC & Ad Standards Canada Notice/i)
    ).toBeInTheDocument();
  });

  it('covers trailer wiring harnesses and the Sienna hybrid 12V rear battery advantage', () => {
    render(<SiennaTrailerHitchGuidePage />);

    expect(
      screen.getByRole('heading', {
        name: /Trailer Wiring: Curt 56456 vs. Tekonsha 118844/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The Sienna Hybrid 12V Battery Superpower/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Curt 56456 Custom Harness/i)).toBeInTheDocument();
    expect(screen.getByText(/Tekonsha 118844 T-One/i)).toBeInTheDocument();
  });

  it('covers hands-free kick-sensor considerations and instrument cluster toggle', () => {
    render(<SiennaTrailerHitchGuidePage />);

    expect(
      screen.getByRole('heading', { name: /Hands-Free Kick Sensor Mastery/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Crucial Tip: Disable the Kick Sensor When Carrying Bike Racks!/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/MID Screen → Settings \(Gear Icon\) → Vehicle Settings \(Hold OK\) → PBD → Kick Sensor → OFF/i)
    ).toBeInTheDocument();
  });

  it('details official towing limits and suspension squat solutions', () => {
    render(<SiennaTrailerHitchGuidePage />);

    expect(
      screen.getByText(/Factory Towing Capacity: 3,500 Lbs \(1,587 kg\)/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Maximum Tongue Weight: 350 Lbs \(158 kg\)/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The #1 Minivan Mod: Air Lift 1000 Helper Springs/i)
    ).toBeInTheDocument();
  });

  it('renders bottom accordion callout notices for statutory disclaimers', () => {
    render(<SiennaTrailerHitchGuidePage />);

    expect(
      screen.getByText(/1. Complete FTC & Ad Standards Canada Affiliate Disclosure/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/2. Non-Affiliation Notice & Nominative Fair Use/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/3. DIY Installation Safety & Factory Warranty Advisory/i)
    ).toBeInTheDocument();
  });

  it('binds outbound affiliate links to centralized AFFILIATE_LINKS with compliant rel attributes', () => {
    render(<SiennaTrailerHitchGuidePage />);

    const torkliftLink = screen.getByRole('link', {
      name: /Check Torklift EcoHitch Availability/i,
    });
    expect(torkliftLink).toHaveAttribute('href', AFFILIATE_LINKS.TORKLIFT);
    expect(torkliftLink).toHaveAttribute('rel', 'noopener noreferrer nofollow sponsored');
    expect(torkliftLink).toHaveAttribute('target', '_blank');

    const curtLink = screen.getByRole('link', {
      name: /Check Curt 13470 on Amazon/i,
    });
    expect(curtLink).toHaveAttribute('href', AFFILIATE_LINKS.AMAZON_CURT_HITCH);
    expect(curtLink).toHaveAttribute('rel', 'noopener noreferrer nofollow sponsored');
    expect(curtLink).toHaveAttribute('target', '_blank');

    const wiringLink = screen.getByRole('link', {
      name: /View Curt 56456 Harness/i,
    });
    expect(wiringLink).toHaveAttribute('href', AFFILIATE_LINKS.AMAZON_WIRING);
    expect(wiringLink).toHaveAttribute('rel', 'noopener noreferrer nofollow sponsored');

    const tekonshaLink = screen.getByRole('link', {
      name: /View Tekonsha 118844 Harness/i,
    });
    expect(tekonshaLink).toHaveAttribute('href', AFFILIATE_LINKS.TEKONSHA_WIRING);
    expect(tekonshaLink).toHaveAttribute('rel', 'noopener noreferrer nofollow sponsored');
  });

  it('renders prominent hitch guide feature banner on the Sienna mods page', async () => {
    const { default: SiennaModsGuidePage } = await import('@/app/guides/sienna-mods/page');
    render(<SiennaModsGuidePage />);

    expect(screen.getByText('Planning Bike Racks or Towing?')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Waiting on your delivery\? Read our 2021\+ Toyota Sienna Trailer Hitch & Kick-Sensor Guide to pick the right receiver and wiring before taking delivery\./i
      )
    ).toBeInTheDocument();
    const hitchButton = screen.getByRole('link', { name: /View Sienna Hitch Guide ->/i });
    expect(hitchButton).toHaveAttribute('href', '/guides/toyota-sienna-trailer-hitch-guide');
  });

  it('renders prominent hitch guide banner conditionally on /[model] page only for Sienna', async () => {
    const { default: ModelPage } = await import('@/app/[model]/page');

    // Test Sienna renders the banner
    const siennaJsx = await ModelPage({
      params: Promise.resolve({ model: 'sienna' }),
    });
    const { rerender } = render(siennaJsx);

    expect(screen.getByText('Planning Bike Racks or Towing?')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Waiting on your delivery\? Read our 2021\+ Toyota Sienna Trailer Hitch & Kick-Sensor Guide to pick the right receiver and wiring before taking delivery\./i
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View Sienna Hitch Guide ->/i })).toHaveAttribute(
      'href',
      '/guides/toyota-sienna-trailer-hitch-guide'
    );

    // Test RAV4 does NOT render the Sienna hitch banner
    const rav4Jsx = await ModelPage({
      params: Promise.resolve({ model: 'rav4' }),
    });
    rerender(rav4Jsx);
    expect(screen.queryByText('Planning Bike Racks or Towing?')).not.toBeInTheDocument();
  });
});
