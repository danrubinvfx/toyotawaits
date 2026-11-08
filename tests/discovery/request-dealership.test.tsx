import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RequestDealershipModal } from '@/components/discovery/RequestDealershipModal';
import { InventoryFilterBar } from '@/components/discovery/InventoryFilterBar';
import { InventoryExplorer } from '@/components/discovery/InventoryExplorer';

describe('Dealership Intake Request Feature Suite', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_ENABLE_INVENTORY_DISCOVERY = 'true';
    vi.clearAllMocks();
  });

  describe('RequestDealershipModal Component', () => {
    it('does not render when isOpen is false', () => {
      render(<RequestDealershipModal isOpen={false} onClose={vi.fn()} />);
      expect(screen.queryByTestId('request-dealership-modal')).not.toBeInTheDocument();
    });

    it('renders accessible dialog with pre-filled city and province', () => {
      render(
        <RequestDealershipModal
          isOpen={true}
          onClose={vi.fn()}
          initialCity="Mississauga"
          initialProvince="ON"
        />
      );

      const modal = screen.getByTestId('request-dealership-modal');
      expect(modal).toBeInTheDocument();
      expect(modal).toHaveAttribute('role', 'dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');

      const nameInput = screen.getByTestId('request-dealer-name-input') as HTMLInputElement;
      const cityInput = screen.getByTestId('request-dealer-city-input') as HTMLInputElement;
      const provinceSelect = screen.getByTestId('request-dealer-province-select') as HTMLSelectElement;

      expect(nameInput.value).toBe('');
      expect(cityInput.value).toBe('Mississauga');
      expect(provinceSelect.value).toBe('ON');
    });

    it('displays validation error if required fields are empty', async () => {
      render(
        <RequestDealershipModal
          isOpen={true}
          onClose={vi.fn()}
          initialCity=""
          initialProvince="BC"
        />
      );

      const submitBtn = screen.getByTestId('submit-dealer-request-btn');
      fireEvent.click(submitBtn);

      expect(screen.getByTestId('dealer-request-error')).toHaveTextContent(
        'Please enter the dealership name.'
      );
    });

    it('submits form, calls API, and displays confirmation screen', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            success: true,
            id: 'mock-dealer-req-123',
          }),
          { status: 201, headers: { 'Content-Type': 'application/json' } }
        )
      );

      const onClose = vi.fn();
      render(
        <RequestDealershipModal
          isOpen={true}
          onClose={onClose}
          initialCity="Kelowna"
          initialProvince="BC"
        />
      );

      fireEvent.change(screen.getByTestId('request-dealer-name-input'), {
        target: { value: 'Kelowna Toyota' },
      });
      fireEvent.change(screen.getByTestId('request-dealer-url-input'), {
        target: { value: 'https://www.kelownatoyota.com' },
      });
      fireEvent.change(screen.getByTestId('request-dealer-email-input'), {
        target: { value: 'driver@kelowna.ca' },
      });
      fireEvent.click(screen.getByTestId('request-dealer-notify-checkbox'));

      fireEvent.click(screen.getByTestId('submit-dealer-request-btn'));

      await waitFor(() => {
        expect(screen.getByTestId('dealer-request-success-state')).toBeInTheDocument();
      });

      expect(screen.getByText('Dealership Request Received!')).toBeInTheDocument();
      expect(fetchSpy).toHaveBeenCalledWith(
        '/api/dealers/request',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            dealerName: 'Kelowna Toyota',
            city: 'Kelowna',
            province: 'BC',
            websiteUrl: 'https://www.kelownatoyota.com',
            userEmail: 'driver@kelowna.ca',
            notifyWhenAdded: true,
            sourceFilterState: {},
          }),
        })
      );

      // Close confirmation screen
      fireEvent.click(screen.getByTestId('close-dealer-success-btn'));
      expect(onClose).toHaveBeenCalled();
    });

    it('closes on Escape key press', () => {
      const onClose = vi.fn();
      render(<RequestDealershipModal isOpen={true} onClose={onClose} />);

      fireEvent.keyDown(window, { key: 'Escape' });
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('InventoryFilterBar Secondary Action', () => {
    it('renders inline "Don\'t see your dealer? Request store" link and fires callback', () => {
      const onRequestDealership = vi.fn();

      render(
        <InventoryFilterBar
          filters={{
            model: '',
            status: 'advertised',
            cancellationsOnly: false,
            dealer: '',
            location: '',
            minPrice: '',
            maxPrice: '',
            search: '',
            sortBy: 'newest',
          }}
          onFilterChange={vi.fn()}
          availableModels={['RAV4 Hybrid']}
          availableLocations={['Vancouver']}
          onRequestDealership={onRequestDealership}
        />
      );

      const requestBtn = screen.getByTestId('request-dealer-inline-btn');
      expect(requestBtn).toBeInTheDocument();
      expect(screen.getByText(/Don't see your dealer\?/i)).toBeInTheDocument();
      expect(requestBtn).toHaveTextContent('Request store');

      fireEvent.click(requestBtn);
      expect(onRequestDealership).toHaveBeenCalled();
    });
  });

  describe('InventoryExplorer Zero-Results CTA', () => {
    it('renders dealership intake prompt and button when zero listings are found', () => {
      render(
        <InventoryExplorer
          initialListings={[]}
          initialModel="Crown Signia"
        />
      );

      expect(screen.getByTestId('no-results-message')).toBeInTheDocument();
      expect(
        screen.getByText(
          /We currently sweep select dealerships across BC and Ontario\. If your local store is missing, let us know and we'll configure its lot feed\./i
        )
      ).toBeInTheDocument();

      const requestBtn = screen.getByTestId('request-dealership-btn');
      expect(requestBtn).toBeInTheDocument();
      expect(requestBtn).toHaveTextContent('📍 Request We Add Your Dealership');

      // Click button to open modal
      fireEvent.click(requestBtn);

      const modal = screen.getByTestId('request-dealership-modal');
      expect(modal).toBeInTheDocument();
    });
  });
});
