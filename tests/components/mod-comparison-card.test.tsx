import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ModComparisonCard } from '@/components/guides/mod-comparison-card';
import { Volume2 } from 'lucide-react';

describe('ModComparisonCard Component', () => {
  const defaultProps = {
    stepNumber: 1,
    title: 'JBL Club 3412T Dash Tweeter & Harness Upgrade',
    categoryBadge: 'Sound & Acoustics',
    icon: Volume2,
    priceEst: '~$128 CAD',
    installEffort: '20-min Install',
    integration: 'Direct Harness Tap',
    fitmentBadge: 'Verified 2019–2026 RAV4',
    whyThisPick: 'The factory SE paper dash speakers muffle vocals. JBL Club 3412Ts drop right into the corner cavities.',
    proTip: 'Use nylon pry tools to pop dash grilles straight up.',
    factoryIssue: 'Cheap 2.5-inch paper-cone dash speakers.',
    solution: 'Drop-in 3.5-inch 2-way coaxial JBL Club drivers.',
    steps: [
      'Pry Corner Grilles with a nylon pry tool.',
      'Remove Factory 10mm bolts.',
      'Connect Red Wolf adapter harness.',
    ],
    affiliateSlug: 'jbl-club-dash-speakers',
    ctaLabel: 'Check Fitment on Amazon.ca ↗',
    affiliateSublabel: 'JBL Club 3412T 3.5-inch 2-Way Coaxial Pair (~$95 CAD)',
    secondaryActions: [
      {
        slug: 'toyota-speaker-harness',
        label: 'View Exact Part Listing ↗',
        sublabel: 'Red Wolf Plug & Play Harness (~$18 CAD)',
      },
    ],
  };

  it('renders title, step number, price badge, and category', () => {
    render(<ModComparisonCard {...defaultProps} />);

    expect(screen.getByText(/1\. JBL Club 3412T Dash Tweeter & Harness Upgrade/i)).toBeDefined();
    expect(screen.getByText('Sound & Acoustics')).toBeDefined();
    expect(screen.getByText('~$128 CAD')).toBeDefined();
  });

  it('renders structured "At-a-Glance" metadata pills', () => {
    render(<ModComparisonCard {...defaultProps} />);

    expect(screen.getByText('20-min Install')).toBeDefined();
    expect(screen.getByText('Direct Harness Tap')).toBeDefined();
    expect(screen.getByText('Verified 2019–2026 RAV4')).toBeDefined();
  });

  it('renders the Wirecutter-style why this pick / pro-tip callout', () => {
    render(<ModComparisonCard {...defaultProps} />);

    expect(
      screen.getByText(/The factory SE paper dash speakers muffle vocals/i)
    ).toBeDefined();
  });

  it('renders factory issue vs community solution comparison', () => {
    render(<ModComparisonCard {...defaultProps} />);

    expect(screen.getByText('The Factory Omission')).toBeDefined();
    expect(screen.getByText('Cheap 2.5-inch paper-cone dash speakers.')).toBeDefined();

    expect(screen.getByText('The Community Solution')).toBeDefined();
    expect(screen.getByText('Drop-in 3.5-inch 2-way coaxial JBL Club drivers.')).toBeDefined();
  });

  it('renders installation steps', () => {
    render(<ModComparisonCard {...defaultProps} />);

    expect(screen.getByText(/Pry Corner Grilles with a nylon pry tool\./i)).toBeDefined();
    expect(screen.getByText(/Remove Factory 10mm bolts\./i)).toBeDefined();
    expect(screen.getByText(/Connect Red Wolf adapter harness\./i)).toBeDefined();
  });

  it('renders high-intent outbound CTAs routing cleanly to /out/[slug]', () => {
    render(<ModComparisonCard {...defaultProps} />);

    const primaryLink = screen.getByRole('link', { name: /Check Fitment on Amazon\.ca/i });
    expect(primaryLink).toBeDefined();
    expect(primaryLink.getAttribute('href')).toBe('/out/jbl-club-dash-speakers');
    expect(primaryLink.getAttribute('rel')).toContain('sponsored');
    expect(primaryLink.getAttribute('target')).toBe('_blank');

    const secondaryLink = screen.getByRole('link', { name: /View Exact Part Listing/i });
    expect(secondaryLink).toBeDefined();
    expect(secondaryLink.getAttribute('href')).toBe('/out/toyota-speaker-harness');
    expect(secondaryLink.getAttribute('rel')).toContain('sponsored');
  });

  it('renders compliant Amazon Associate disclaimer microcopy', () => {
    render(<ModComparisonCard {...defaultProps} />);

    expect(
      screen.getByText(/As an Amazon Associate, toyotawaits\.ca earns from qualifying purchases at no extra cost to you\./i)
    ).toBeDefined();
  });
});
