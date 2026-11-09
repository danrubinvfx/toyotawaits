import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DeliveryPrepPage, { metadata, dynamic, instant } from '@/app/delivery-prep/page';

describe('DeliveryPrepPage Route', () => {
  it('exports force-dynamic and instant=false route segment configuration', () => {
    expect(dynamic).toBe('force-dynamic');
    expect(instant).toBe(false);
  });
  it('defines correct page metadata for Toyota Canada delivery tracking and status codes', () => {
    expect(metadata.title).toBe(
      'Toyota Canada Delivery Tracking & Status Codes (2026 Guide) | ToyotaWaits'
    );
    expect(metadata.description).toBe(
      'Track your Canadian Toyota order from factory allocation to dealership delivery. Demystify Status A, Freight Status F, rail tracking, and dealer PDI checks.'
    );
    expect(metadata.alternates?.canonical).toBe('https://www.toyotawaits.ca/delivery-prep');
  });

  it('renders factory order status tracker with Status A, Status F, and Status G stages', () => {
    render(<DeliveryPrepPage />);

    expect(
      screen.getByRole('heading', {
        name: /Toyota Canada Order Status Codes: “The Black Box” Decoded/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText('Status A')).toBeInTheDocument();
    expect(screen.getByText(/Allocated \/ Scheduled for Assembly/i)).toBeInTheDocument();
    expect(screen.getByText(/TMMC \(Cambridge & Woodstock, ON\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Takaoka & Tahara Plants/i)).toBeInTheDocument();
    expect(screen.getByText(/TMMI \(Princeton, Indiana\)/i)).toBeInTheDocument();

    expect(screen.getByText('Status F')).toBeInTheDocument();
    expect(screen.getByText(/Freight \/ In-Transit Logistics/i)).toBeInTheDocument();
    expect(screen.getByText(/Loaded onto CN \/ CPKC rail/i)).toBeInTheDocument();

    expect(screen.getByText('Status G')).toBeInTheDocument();
    expect(screen.getByText(/Ground \/ Dealership Compound/i)).toBeInTheDocument();
  });

  it('renders dealer tracking secrets, Dealer Daily portal, and PDI audit advice', () => {
    render(<DeliveryPrepPage />);

    expect(
      screen.getByRole('heading', {
        name: /Dealer Tracking FAQ & Logistics Pro-Tips/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/Can My Dealer Track the Train\?/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Dealer Daily/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/How to Request Your VIN Build Sheet/i)).toBeInTheDocument();
    expect(screen.getByText(/Watch Out for PDI Add-Ons/i)).toBeInTheDocument();
  });

  it('renders cross-link buttons bridging to RAV4 accessories and floor mats guides', () => {
    render(<DeliveryPrepPage />);

    expect(
      screen.getByRole('heading', {
        name: /Order Your Day-One Gear Before Status G Arrival/i,
      })
    ).toBeInTheDocument();

    const matsLink = screen.getByRole('link', { name: /Compare All-Weather Floor Mats/i });
    expect(matsLink).toHaveAttribute('href', '/guides/best-toyota-all-weather-floor-mats');

    const rav4Link = screen.getByRole('link', { name: /Browse RAV4 Must-Have Accessories/i });
    expect(rav4Link).toHaveAttribute('href', '/guides/toyota-rav4-must-have-accessories');
  });

  it('renders delivery FAQ items and JSON-LD schema', () => {
    const { container } = render(<DeliveryPrepPage />);

    expect(screen.getByText(/What does Toyota Status F mean\?/i)).toBeInTheDocument();
    expect(screen.getByText(/How long does a Toyota take to arrive once in transit\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Can my dealer track the train carrying my Toyota\?/i)).toBeInTheDocument();

    // Verify JSON-LD FAQ schema script
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    const faqScript = Array.from(scripts).find((s) => s.innerHTML.includes('FAQPage'));
    expect(faqScript).toBeDefined();
    expect(faqScript?.innerHTML).toContain('What does Toyota Status F mean?');
    expect(faqScript?.innerHTML).toContain('How long does a Toyota take to arrive once in transit?');
  });

  it('renders Business Office Extended Warranty (ECP) Defense section with CTA link', () => {
    render(<DeliveryPrepPage />);

    expect(
      screen.getByRole('heading', {
        name: /Surviving the Business Office: Extended Warranty \(ECP\) Defense/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/Never Sign on Delivery Day Under Pressure/i)).toBeInTheDocument();
    expect(screen.getByText(/The \$1,900–\$2,100 CAD Target/i)).toBeInTheDocument();
    expect(screen.getByText(/Avoid ECP Gold/i)).toBeInTheDocument();

    const ecpLink = screen.getByRole('link', {
      name: /Read the Complete Toyota ECP Breakdown & Net Cost Math →/i,
    });
    expect(ecpLink).toHaveAttribute('href', '/guides/toyota-ecp-warranty-guide');
  });

  it('renders Canadian Dealer Fees table with Mandatory vs. Negotiable breakdowns', () => {
    render(<DeliveryPrepPage />);

    expect(
      screen.getByRole('heading', {
        name: /Canadian Dealer Fees: Mandatory vs\. Negotiable/i,
      })
    ).toBeInTheDocument();

    // Mandatory / Statutory items
    expect(screen.getByText('Freight & PDI')).toBeInTheDocument();
    expect(screen.getByText(/~\$1,930 – standard across Canada/i)).toBeInTheDocument();

    expect(screen.getByText('Air Tax')).toBeInTheDocument();
    expect(screen.getByText(/\$100 federal/i)).toBeInTheDocument();

    expect(screen.getByText('Tire Levy')).toBeInTheDocument();
    expect(screen.getByText(/\$20–\$30 provincial/i)).toBeInTheDocument();

    expect(screen.getByText('AMVIC / OMVIC / VSA council levies')).toBeInTheDocument();
    expect(screen.getByText(/\$10–\$12 provincial/i)).toBeInTheDocument();

    // 100% Negotiable Margin items
    expect(screen.getByText('Doc Fee / Admin Fee')).toBeInTheDocument();
    expect(screen.getAllByText(/\$599–\$999/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/All-in pricing/i).length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText('Block Heater')).toBeInTheDocument();
    expect(screen.getAllByText(/\$700–\$900/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/OEM part installed is ~\$300–\$350/i)).toBeInTheDocument();

    expect(screen.getByText('Protection Packages')).toBeInTheDocument();
    expect(screen.getAllByText(/\$1,000–\$2,000/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Rust inhibitor modules/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/unibodies/i).length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText('Etching / Security Packs')).toBeInTheDocument();
    expect(screen.getAllByText(/\$399–\$699/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Pure profit add-ons/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders ECP Extended Warranty Strategy Box with wholesale benchmarks and 31-day grace window', () => {
    render(<DeliveryPrepPage />);

    expect(screen.getByText('ECP Extended Warranty Strategy')).toBeInTheDocument();
    expect(
      screen.getAllByText(/Platinum 7yr\/120,000km wholesale is ~\$1,700–\$2,000 CAD \(vs\. \$2,600\+ dealer retail\)/i).length
    ).toBeGreaterThanOrEqual(1);

    expect(
      screen.getAllByText(/31-day grace window after delivery to shop ECP at ANY Canadian Toyota dealership/i).length
    ).toBeGreaterThanOrEqual(1);
  });

  it('renders Bridge to Day-1 Protection Gear with TuxMat, FitcamX, and Spigen routed via buildAmazonAffiliateUrl', () => {
    render(<DeliveryPrepPage />);

    expect(
      screen.getByText(
        /Put the \$3,500 you saved where it counts: TuxMat floor liners, FitcamX OEM dashcam, and Spigen screen protectors\./i
      )
    ).toBeInTheDocument();

    expect(screen.getByText('TuxMat Custom Floor Liners')).toBeInTheDocument();
    expect(screen.getByText('FitcamX OEM 4K Dashcam')).toBeInTheDocument();
    expect(screen.getByText('Spigen Screen Protectors')).toBeInTheDocument();

    const gearLinks = screen.getAllByRole('link', { name: /Check on Amazon\.ca/i });
    expect(gearLinks.length).toBe(3);

    // Verify TuxMat link
    expect(gearLinks[0]).toHaveAttribute(
      'href',
      expect.stringContaining('https://www.amazon.ca/s?k=TuxMat%20Toyota%20RAV4%20custom%20all%20weather%20floor%20mats&tag=toyotawaits-20')
    );
    expect(gearLinks[0]).toHaveAttribute('target', '_blank');
    expect(gearLinks[0]).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');

    // Verify FitcamX link
    expect(gearLinks[1]).toHaveAttribute(
      'href',
      expect.stringContaining('https://www.amazon.ca/s?k=Fitcamx%20dash%20cam%20Toyota%20OEM%204K&tag=toyotawaits-20')
    );
    expect(gearLinks[1]).toHaveAttribute('target', '_blank');
    expect(gearLinks[1]).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');

    // Verify Spigen link
    expect(gearLinks[2]).toHaveAttribute(
      'href',
      expect.stringContaining('https://www.amazon.ca/s?k=Spigen%20screen%20protector%20Toyota%20tempered%20glass%20matte%209H&tag=toyotawaits-20')
    );
    expect(gearLinks[2]).toHaveAttribute('target', '_blank');
    expect(gearLinks[2]).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');
  });

  it('renders Surviving the Finance Office: The 31-Day Toyota ECP Warranty Rule with key wholesale copy', () => {
    render(<DeliveryPrepPage />);

    expect(
      screen.getByRole('heading', {
        name: /Surviving the Finance Office: The 31-Day Toyota ECP Warranty Rule/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getAllByText(
        /Wholesale cost baseline \(\$1,900–\$2,100 on 7yr\/120k Platinum vs \$2,800\+ dealer desk retail\), reminder that ECP can be purchased from any Canadian dealer within 31 days of delivery\./i
      ).length
    ).toBeGreaterThanOrEqual(1);

    expect(
      screen.getAllByText(/ECP can be purchased from any Canadian dealer within 31 days of delivery/i).length
    ).toBeGreaterThanOrEqual(1);
  });

  it('renders Printable Inspection Checklist & Fee Refusal Worksheet section with print trigger', () => {
    render(<DeliveryPrepPage />);

    expect(
      screen.getByRole('heading', {
        name: /Printable Inspection Checklist & Fee Refusal Worksheet/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByTestId('fee-refusal-worksheet-section')).toBeInTheDocument();
    expect(screen.getByTestId('print-worksheet-btn')).toBeInTheDocument();

    expect(screen.getByText('Front Suspension Transport Spacers Removed')).toBeInTheDocument();
    expect(screen.getByText('Bright Daylight Exterior Body & Glass Audit')).toBeInTheDocument();
    expect(screen.getByText('2nd Smart Key Allocation IOU Voucher')).toBeInTheDocument();
    expect(screen.getByText('Hybrid Battery Vent Filter & Charging Cables')).toBeInTheDocument();

    expect(screen.getByText('Part 2: Finance Office Fee Refusal & All-In Pricing Worksheet')).toBeInTheDocument();
    expect(screen.getByText('Purchaser Signature')).toBeInTheDocument();
    expect(screen.getByText('Dealership Representative')).toBeInTheDocument();
  });

  it('renders Interactive Dealer Fee Auditor with inputs, AMVIC/OMVIC flags, and copy script CTA', () => {
    render(<DeliveryPrepPage />);

    expect(screen.getByTestId('dealer-fee-auditor')).toBeInTheDocument();

    // Verify all 5 key line items
    expect(screen.getByTestId('fee-row-doc-fee')).toBeInTheDocument();
    expect(screen.getByTestId('fee-row-etching')).toBeInTheDocument();
    expect(screen.getByTestId('fee-row-rust-module')).toBeInTheDocument();
    expect(screen.getByTestId('fee-row-block-heater')).toBeInTheDocument();
    expect(screen.getByTestId('fee-row-ecp')).toBeInTheDocument();

    // Verify AMVIC flag by default in Alberta
    expect(screen.getByText(/AMVIC Violation \(Alberta All-In Pricing Law\)/i)).toBeInTheDocument();

    // Verify copy button
    expect(screen.getByTestId('copy-script-btn')).toBeInTheDocument();
    expect(screen.getByTestId('negotiation-script-preview')).toBeInTheDocument();
  });
});
