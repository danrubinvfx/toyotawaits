import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  AffiliateDisclosure,
  AFFILIATE_DISCLOSURE_TEXT,
  NOMINATIVE_FAIR_USE_DISCLAIMER_TEXT,
} from '@/components/AffiliateDisclosure';

describe('AffiliateDisclosure Component', () => {
  it('renders visible FTC and Canadian compliant affiliate disclosure text', () => {
    render(<AffiliateDisclosure />);

    const disclosure = screen.getByTestId('affiliate-disclosure');
    expect(disclosure).toBeInTheDocument();
    expect(disclosure).toHaveTextContent(AFFILIATE_DISCLOSURE_TEXT);
    expect(disclosure).toHaveTextContent(/Amazon Associates Program/i);
    expect(disclosure).toHaveTextContent(/commissions from qualifying purchases/i);
  });

  it('renders compact disclosure mode for tight headings and product listings', () => {
    render(<AffiliateDisclosure compact={true} />);

    const compact = screen.getByTestId('affiliate-disclosure-compact');
    expect(compact).toBeInTheDocument();
    expect(compact).toHaveTextContent(AFFILIATE_DISCLOSURE_TEXT);
  });

  it('provides standardized nominative fair use constant string', () => {
    expect(NOMINATIVE_FAIR_USE_DISCLAIMER_TEXT).toContain(
      'toyotawaits.ca is an independent community tracker and is not affiliated with, endorsed by, or sponsored by Toyota Motor Corporation or Toyota Canada Inc.'
    );
    expect(NOMINATIVE_FAIR_USE_DISCLAIMER_TEXT).toContain(
      'All trademarks, service marks, and trade names are the property of their respective owners and are used strictly for identification purposes under nominative fair use.'
    );
  });
});
