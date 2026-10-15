import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GuideDisclaimer } from '@/components/common/GuideDisclaimer';

describe('GuideDisclaimer Component', () => {
  it('renders with accessible role and testid', () => {
    render(<GuideDisclaimer />);
    const disclaimer = screen.getByTestId('guide-disclaimer');
    expect(disclaimer).toBeInTheDocument();
    expect(disclaimer).toHaveAttribute('role', 'note');
  });

  it('renders the mandatory non-affiliation notice', () => {
    render(<GuideDisclaimer />);
    expect(
      screen.getByText(/NOT affiliated with, sponsored by, authorized by, or endorsed by Toyota Canada Inc\./i)
    ).toBeInTheDocument();
  });

  it('renders the DIY & safety advisory', () => {
    render(<GuideDisclaimer />);
    expect(
      screen.getByText(/Modifying a vehicle may impact factory warranties or safety compliance/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/consult a certified automotive technician or refer to official manufacturer service manuals/i)
    ).toBeInTheDocument();
  });

  it('renders the pricing & timing notice', () => {
    render(<GuideDisclaimer />);
    expect(
      screen.getByText(/Wait-time estimates, pricing points, and provincial rebate figures reflect community-reported experiences/i)
    ).toBeInTheDocument();
  });

  it('applies custom className correctly', () => {
    render(<GuideDisclaimer className="custom-test-class" />);
    expect(screen.getByTestId('guide-disclaimer')).toHaveClass('custom-test-class');
  });
});
