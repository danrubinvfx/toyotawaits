import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PostSubmissionNextSteps } from '@/components/submission/PostSubmissionNextSteps';
import * as inventoryModule from '@/lib/data/inventory';
import { CA_ASSOCIATE_TAG, US_ASSOCIATE_TAG } from '@/lib/gear/affiliate';
import { MarketProvider } from '@/context/MarketContext';

describe('PostSubmissionNextSteps Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('Section A: Live Inventory Bridge & Drop Alerts', () => {
    it('renders "Don\'t want to wait" card when matching active units > 0', async () => {
      global.fetch = vi.fn().mockImplementation(async (url: string) => {
        if (url.includes('/api/inventory')) {
          return {
            ok: true,
            json: async () => ({ success: true, count: 4, listings: [] }),
          } as any;
        }
        return { ok: true, json: async () => ({}) } as any;
      });

      render(
        <PostSubmissionNextSteps
          modelName="RAV4"
          province="BC"
          email="buyer@example.ca"
          estimatedMonths={12}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('skip-the-wait-card')).toBeInTheDocument();
      });

      expect(screen.getByText(/⚡ Don't want to wait 12 months\?/i)).toBeInTheDocument();
      expect(
        screen.getByText(/We observed 4 matching RAV4 units across local dealer feeds\./i)
      ).toBeInTheDocument();

      // Primary CTA linking to /inventory
      const liveLink = screen.getByRole('link', { name: /Browse Live Stock \(4\) ↗/i });
      expect(liveLink).toBeInTheDocument();
      expect(liveLink.getAttribute('href')).toBe('/inventory?model=RAV4');

      // Secondary 1-click toggle button
      const alertToggle = screen.getByRole('button', {
        name: /🔔 Alert Me on Canceled Allocations/i,
      });
      expect(alertToggle).toBeInTheDocument();
    });

    it('subscribes with 1 click when email is provided and shows inline confirmation', async () => {
      global.fetch = vi.fn().mockImplementation(async (url: string, init?: any) => {
        if (url.includes('/api/inventory')) {
          return {
            ok: true,
            json: async () => ({ success: true, count: 3, listings: [] }),
          } as any;
        }
        if (url.includes('/api/alerts/subscribe')) {
          return {
            ok: true,
            json: async () => ({
              success: true,
              message:
                'Subscribed! You will get email alerts when unreserved allocations land.',
            }),
          } as any;
        }
        return { ok: true, json: async () => ({}) } as any;
      });

      render(
        <PostSubmissionNextSteps
          modelName="RAV4"
          province="BC"
          email="test-buyer@gmail.com"
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /🔔 Alert Me on Canceled Allocations/i })).toBeInTheDocument();
      });

      const alertBtn = screen.getByRole('button', { name: /🔔 Alert Me on Canceled Allocations/i });
      fireEvent.click(alertBtn);

      await waitFor(() => {
        expect(
          screen.getByText(/Subscribed! You will get email alerts when unreserved allocations land\./i)
        ).toBeInTheDocument();
      });
    });

    it('renders subtle card when active inventory count is 0', async () => {
      global.fetch = vi.fn().mockImplementation(async (url: string) => {
        if (url.includes('/api/inventory')) {
          return {
            ok: true,
            json: async () => ({ success: true, count: 0, listings: [] }),
          } as any;
        }
        return { ok: true, json: async () => ({}) } as any;
      });

      render(
        <PostSubmissionNextSteps
          modelName="Sienna"
          province="ON"
          email="sienna@test.ca"
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('zero-stock-card')).toBeInTheDocument();
      });

      expect(
        screen.getByText(/Set a 30-Day Drop Alert for incoming unreserved allocations at MSRP/i)
      ).toBeInTheDocument();
    });
  });

  describe('Section B: Model-Specific First-Day Buys & Outbound Affiliate Integrity', () => {
    it('curates top 3 hero accessories for RAV4 (FitcamX, TuxMat, Spigen)', async () => {
      render(<PostSubmissionNextSteps modelName="RAV4" province="BC" />);

      await waitFor(() => {
        expect(screen.getByText(/📦 First-Day Buys & Essentials/i)).toBeInTheDocument();
      });
      expect(
        screen.getByText(/Top-rated gear Canadian owners install on delivery day to protect their vehicle\./i)
      ).toBeInTheDocument();

      // Top 3 for RAV4
      expect(screen.getByText('FitcamX 4K OEM Dashcam')).toBeInTheDocument();
      expect(screen.getByText('TuxMat High-Wall Floor Mats')).toBeInTheDocument();
      expect(screen.getByText('Spigen 9H Screen Glass')).toBeInTheDocument();

      // Verify Amazon outbound links have sponsored rel attributes and CA tag
      const amazonLinks = screen.getAllByRole('link', { name: /View on Amazon ↗/i });
      expect(amazonLinks.length).toBe(3);

      amazonLinks.forEach((link) => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link.getAttribute('rel')).toContain('sponsored');
        expect(link.getAttribute('rel')).toContain('noopener');
        expect(link.getAttribute('rel')).toContain('noreferrer');
        expect(link.getAttribute('rel')).toContain('nofollow');
        expect(link.getAttribute('href')).toContain(`tag=${CA_ASSOCIATE_TAG}`);
      });
    });

    it('curates top 3 hero accessories for Sienna (TuxMat, Muslogy Drop-In Tray, FitcamX)', async () => {
      render(<PostSubmissionNextSteps modelName="Sienna" province="BC" />);

      await waitFor(() => {
        expect(screen.getByText('TuxMat 3-Row Set')).toBeInTheDocument();
      });
      expect(screen.getByText('Center Console Drop-In Tray')).toBeInTheDocument();
      expect(screen.getByText('FitcamX 4K OEM Dashcam')).toBeInTheDocument();

      // Partner discount badge & partner CTA
      expect(screen.getByText(/CODE: Toyotawaits \(2% OFF\)/i)).toBeInTheDocument();
      const dealLink = screen.getByRole('link', { name: /Get Deal ↗/i });
      expect(dealLink).toBeInTheDocument();
      expect(dealLink.getAttribute('href')).toBe('/out/muslogy-sienna');
      expect(dealLink.getAttribute('rel')).toContain('sponsored');
    });

    it('curates top 3 hero accessories for Grand Highlander (12.3" Tempered Glass, Console Divider, TPE Mats)', async () => {
      render(<PostSubmissionNextSteps modelName="Grand Highlander" province="BC" />);

      await waitFor(() => {
        expect(screen.getByText('12.3" Tempered Glass')).toBeInTheDocument();
      });
      expect(screen.getByText('Center Console Divider')).toBeInTheDocument();
      expect(screen.getByText('Custom TPE Mats')).toBeInTheDocument();
      expect(screen.getByText(/CODE: Toyotawaits \(2% OFF\)/i)).toBeInTheDocument();
    });

    it('curates top 3 hero accessories for Tacoma (Bed Mat, Console Organizer, Tempered Glass)', async () => {
      render(<PostSubmissionNextSteps modelName="Tacoma" province="BC" />);

      await waitFor(() => {
        expect(screen.getByText('Bed Mat')).toBeInTheDocument();
      });
      expect(screen.getByText('Center Console Organizer')).toBeInTheDocument();
      expect(screen.getByText('Tempered Glass')).toBeInTheDocument();
    });

    it('routes affiliate links through US associate tag when in US market context', async () => {
      render(
        <MarketProvider initialMarket="US">
          <PostSubmissionNextSteps modelName="RAV4" province="CA" />
        </MarketProvider>
      );

      await waitFor(() => {
        expect(screen.getAllByRole('link', { name: /View on Amazon ↗/i }).length).toBeGreaterThan(0);
      });
      const links = screen.getAllByRole('link', { name: /View on Amazon ↗/i });
      links.forEach((link) => {
        expect(link.getAttribute('href')).toContain('amazon.com');
        expect(link.getAttribute('href')).toContain(`tag=${US_ASSOCIATE_TAG}`);
      });
    });
  });
});
