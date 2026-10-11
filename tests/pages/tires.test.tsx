import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TiresPage, { metadata } from '@/app/tires/page';

describe('TiresPage Route', () => {
  it('defines correct page metadata matching Canadian Toyota tire specifications', () => {
    expect(metadata.title).toBe(
      'Canadian Toyota Tire Guide: Winter & All-Weather Recommendations | ToyotaWaits.ca'
    );
    expect(metadata.description).toBe(
      'Factory tire sizes, Canadian winter reviews (3PMSF), and curated Amazon.ca links for RAV4, Sienna, Grand Highlander, Prius, and Land Cruiser.'
    );
    expect(metadata.alternates?.canonical).toBe('/tires');
  });

  it('renders the TiresPage component without crashing', () => {
    render(<TiresPage />);

    expect(
      screen.getByRole('heading', {
        name: /Canadian Toyota Tire Guide: Winter & All-Weather Recommendations/i,
      })
    ).toBeInTheDocument();
  });
});
