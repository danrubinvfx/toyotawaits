import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WhileYouWaitGear } from '@/components/submission/WhileYouWaitGear';
import { getAccessoriesForModel, ESSENTIAL_ACCESSORIES } from '@/data/accessories';
import { CA_ASSOCIATE_TAG } from '@/lib/gear/affiliate';

describe('WhileYouWaitGear Component & Accessories Data', () => {
  describe('getAccessoriesForModel', () => {
    it('returns universal essentials when model is null or undefined', () => {
      const items = getAccessoriesForModel(null);
      expect(items.length).toBeGreaterThanOrEqual(4);
      items.forEach((item) => {
        expect(item.applicableModels).toContain('universal');
      });
    });

    it('returns tailored accessories and URLs for RAV4', () => {
      const items = getAccessoriesForModel('RAV4');
      const floorLiners = items.find((i) => i.id === 'all-weather-floor-liners');
      expect(floorLiners).toBeDefined();
      expect(floorLiners?.url).toContain('Toyota%20RAV4');
      expect(floorLiners?.url).toContain(`tag=${CA_ASSOCIATE_TAG}`);
    });

    it('returns tailored accessories and URLs for Sienna', () => {
      const items = getAccessoriesForModel('Sienna');
      const floorLiners = items.find((i) => i.id === 'all-weather-floor-liners');
      expect(floorLiners).toBeDefined();
      expect(floorLiners?.url).toContain('Toyota%20Sienna');
      expect(floorLiners?.url).toContain(`tag=${CA_ASSOCIATE_TAG}`);
    });

    it('gracefully handles unknown model with universal fallback', () => {
      const items = getAccessoriesForModel('NonExistentVehicle123');
      expect(items.length).toBeGreaterThanOrEqual(4);
      const universalItems = items.filter((i) => i.applicableModels.includes('universal'));
      expect(universalItems.length).toBe(items.length);
    });
  });

  describe('WhileYouWaitGear UI Component', () => {
    it('renders header, subtitle, and accessory cards for universal fallback', () => {
      render(<WhileYouWaitGear />);

      expect(
        screen.getByText('While You Wait: Essential Delivery Day Gear')
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Recommended by fellow Canadian Toyota owners/i)
      ).toBeInTheDocument();

      const container = screen.getByTestId('while-you-wait-gear');
      expect(container).toBeInTheDocument();

      // Check for discrete affiliate disclosure
      expect(
        screen.getByText(/As an Amazon Associate, ToyotaWaits earns from qualifying purchases/i)
      ).toBeInTheDocument();
    });

    it('displays vehicle badge when modelName is provided', () => {
      render(<WhileYouWaitGear modelName="RAV4 Hybrid" />);

      expect(screen.getByText('For RAV4 Hybrid')).toBeInTheDocument();
    });

    it('renders external links with target="_blank" and rel="noopener noreferrer"', () => {
      render(<WhileYouWaitGear modelName="Sienna" />);

      const links = screen.getAllByRole('link', { name: /View .* on Amazon/i });
      expect(links.length).toBeGreaterThan(0);

      links.forEach((link) => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        expect(link.getAttribute('href')).toContain('amazon.ca');
        expect(link.getAttribute('href')).toContain(`tag=${CA_ASSOCIATE_TAG}`);
      });
    });

    it('displays CAD estimated prices and category badges', () => {
      render(<WhileYouWaitGear modelName="RAV4" />);

      const priceTags = screen.getAllByText(/CAD/i);
      expect(priceTags.length).toBeGreaterThanOrEqual(4);

      expect(screen.getAllByText('Protection').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Tech').length).toBeGreaterThan(0);
    });
  });
});
