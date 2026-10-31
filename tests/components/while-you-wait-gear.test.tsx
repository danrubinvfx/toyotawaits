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

    it('dynamically ranks accessories by 30-day click counts and assigns enhanced badges', () => {
      const simulatedCounts = {
        '4k-front-rear-dash-cam': 50,
        'center-console-organizer-tray': 30,
        'all-weather-floor-liners': 10,
      };

      const sorted = getAccessoriesForModel('RAV4', simulatedCounts);

      // Slot 0: 4k-front-rear-dash-cam with '🔥 Most Popular'
      expect(sorted[0].id).toBe('4k-front-rear-dash-cam');
      expect(sorted[0].badge).toBe('🔥 Community Top Pick');

      // Slot 1: center-console-organizer-tray with 'Community Top Pick'
      expect(sorted[1].id).toBe('center-console-organizer-tray');
      expect(sorted[1].badge).not.toBe('🔥 Community Top Pick');

      // Slot 2: all-weather-floor-liners
      expect(sorted[2].id).toBe('all-weather-floor-liners');
    });

    it('renders the top 2 popularity-ranked accessories at the start of the grid in WhileYouWaitGear', () => {
      const simulatedCounts = {
        'infotainment-screen-protector': 99,
        'rfid-faraday-key-fob-pouch': 75,
      };

      const { container } = render(
        <WhileYouWaitGear modelName="universal" popularityCounts={simulatedCounts} />
      );

      const titles = container.querySelectorAll('h5');
      expect(titles[0]).toHaveTextContent('Anti-Glare Screen Protector (10.5" / 12.3")');
      expect(titles[1]).toHaveTextContent('Heavy-Duty RFID Faraday Key Fob Signal Blocker');

      expect(screen.getAllByText('🔥 Community Top Pick')).toHaveLength(1);
      expect(screen.queryByText('Community Top Pick')).not.toBeInTheDocument();
    });

    it('renders Muslogy direct-fit partner gear in top slots for RAV4 with discount badge and partner CTA', () => {
      render(<WhileYouWaitGear modelName="RAV4" />);

      // Verify Muslogy items rendered
      expect(screen.getByText('Muslogy Center Console Organizer Tray (RAV4)')).toBeInTheDocument();
      expect(screen.getByText('Muslogy Custom-Fit Padded Center Console Armrest Cover')).toBeInTheDocument();

      // Verify discount pills and copy buttons
      const discountPills = screen.getAllByText(/Toyotawaits/i);
      expect(discountPills.length).toBeGreaterThanOrEqual(2);

      // Verify Muslogy action buttons and sponsored link attributes
      const partnerButtons = screen.getAllByRole('link', { name: /View .* on Muslogy/i });
      expect(partnerButtons.length).toBeGreaterThanOrEqual(2);
      partnerButtons.forEach((link) => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'sponsored noopener noreferrer');
        expect(link.getAttribute('href')).toMatch(/\/out\/muslogy-(rav4|armrest-cover)/);
      });
    });

    it('renders Muslogy partner gear in top slots for Sienna and Grand Highlander', () => {
      // Sienna
      const { unmount: unmountSienna } = render(<WhileYouWaitGear modelName="Sienna" />);
      expect(screen.getByText('Muslogy Sienna Center Console Sliding Organizer & Bridge Box')).toBeInTheDocument();
      const siennaPartnerLink = screen.getByRole('link', { name: /View Muslogy Sienna Center Console Sliding Organizer & Bridge Box on Muslogy/i });
      expect(siennaPartnerLink).toHaveAttribute('href', '/out/muslogy-sienna');
      expect(siennaPartnerLink).toHaveAttribute('rel', 'sponsored noopener noreferrer');
      unmountSienna();

      // Grand Highlander
      render(<WhileYouWaitGear modelName="Grand Highlander" />);
      expect(screen.getByText('Muslogy Grand Highlander Console Divider Tray')).toBeInTheDocument();
      const ghPartnerLink = screen.getByRole('link', { name: /View Muslogy Grand Highlander Console Divider Tray on Muslogy/i });
      expect(ghPartnerLink).toHaveAttribute('href', '/out/muslogy-grand-highlander');
      expect(ghPartnerLink).toHaveAttribute('rel', 'sponsored noopener noreferrer');
    });
  });
});
