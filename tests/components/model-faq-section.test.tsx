import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ModelFAQSection, type ModelFAQData } from '@/components/seo/ModelFAQSection';

describe('ModelFAQSection Component', () => {
  const mockFaqData: ModelFAQData = {
    modelName: 'Toyota RAV4',
    slug: 'rav4',
    overallMedianMonths: '11.5',
    fastestProvince: {
      code: 'AB',
      name: 'Alberta',
      days: 350,
      months: '11.5',
    },
    slowestProvince: {
      code: 'QC',
      name: 'Quebec',
      days: 420,
      months: '13.8',
    },
    powertrainBreakdown: [
      { powertrain: 'Gas', nationalMedian: '260 days (~8.6 mo)' },
      { powertrain: 'Hybrid AWD', nationalMedian: '385 days (~12.7 mo)' },
      { powertrain: 'Plug-in Hybrid (Prime)', nationalMedian: '420 days (~13.8 mo)' },
    ],
    totalReports: 142,
    additionalFaqs: [
      {
        question: 'Is the RAV4 Prime eligible for the federal iZEV rebate in Canada?',
        answer: 'Yes, qualifying RAV4 Prime trims are eligible for up to $5,000 under Transport Canada iZEV.',
      },
    ],
  };

  it('renders section title and visible semantic <details> and <summary> accordions with required Tailwind styles', () => {
    const { container } = render(<ModelFAQSection faqData={mockFaqData} />);

    // Check heading
    expect(
      screen.getByText('Frequently Asked Questions: Toyota RAV4 Wait Times')
    ).toBeInTheDocument();

    // Check semantic details elements
    const detailsElements = container.querySelectorAll('details');
    expect(detailsElements.length).toBe(5); // 4 canonical + 1 additional

    // Check required Tailwind styling classes: border border-zinc-800 bg-zinc-900/40 rounded-xl p-4
    detailsElements.forEach((detail) => {
      expect(detail.className).toContain('border');
      expect(detail.className).toContain('border-zinc-800');
      expect(detail.className).toContain('bg-zinc-900/40');
      expect(detail.className).toContain('rounded-xl');
      expect(detail.className).toContain('p-4');
    });

    // Check summaries
    const summaries = container.querySelectorAll('summary');
    expect(summaries.length).toBe(5);
  });

  it('renders all 4 canonical Canadian automotive questions', () => {
    render(<ModelFAQSection faqData={mockFaqData} />);

    // 1. Average wait time for {Model} in Canada
    expect(
      screen.getByText('What is the average wait time for a Toyota RAV4 in Canada?')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Canadian national median wait time for a Toyota RAV4 is approximately 11\.5 months/i)
    ).toBeInTheDocument();

    // 2. Shortest vs longest province for {Model}
    expect(
      screen.getByText('Which Canadian province has the shortest wait time for the RAV4?')
    ).toBeInTheDocument();
    expect(screen.getByText(/Alberta \(AB\) generally reports the shortest wait times/i)).toBeInTheDocument();
    expect(screen.getByText(/Quebec \(QC\) experience the longest delivery queues/i)).toBeInTheDocument();

    // 3. Whether Canadians can place custom factory orders vs dealer allocation queues
    expect(
      screen.getByText('Can Canadians place custom factory orders for the RAV4 or is it dealer allocation?')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Toyota Canada does not operate a traditional custom factory build-to-order system/i)
    ).toBeInTheDocument();

    // 4. Waitlist deposit refundability under Canadian regulations
    expect(
      screen.getByText('Are waitlist vehicle deposits refundable under Canadian regulations?')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/OMVIC in Ontario, AMVIC in Alberta, and the VSA in British Columbia/i)
    ).toBeInTheDocument();
  });

  it('generates valid Google-compliant Schema.org FAQPage JSON-LD schema', () => {
    const { container } = render(<ModelFAQSection faqData={mockFaqData} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();

    const json = JSON.parse(script!.textContent || '{}');
    expect(json['@context']).toBe('https://schema.org');
    expect(json['@type']).toBe('FAQPage');
    expect(Array.isArray(json.mainEntity)).toBe(true);
    expect(json.mainEntity.length).toBe(5);

    // Verify first 4 canonical question entities
    expect(json.mainEntity[0]['@type']).toBe('Question');
    expect(json.mainEntity[0].name).toBe('What is the average wait time for a Toyota RAV4 in Canada?');
    expect(json.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
    expect(json.mainEntity[0].acceptedAnswer.text).toContain('11.5 months');

    expect(json.mainEntity[1].name).toBe('Which Canadian province has the shortest wait time for the RAV4?');
    expect(json.mainEntity[1].acceptedAnswer.text).toContain('Alberta (AB)');

    expect(json.mainEntity[2].name).toBe('Can Canadians place custom factory orders for the RAV4 or is it dealer allocation?');
    expect(json.mainEntity[2].acceptedAnswer.text).toContain('allocation framework');

    expect(json.mainEntity[3].name).toBe('Are waitlist vehicle deposits refundable under Canadian regulations?');
    expect(json.mainEntity[3].acceptedAnswer.text).toContain('OMVIC');
  });

  it('handles fallback string provinces, numeric months, and empty optional fields gracefully', () => {
    const minimalData: ModelFAQData = {
      modelName: 'Sienna',
      slug: 'sienna',
      overallMedianMonths: 12,
      fastestProvince: 'Alberta',
      slowestProvince: 'British Columbia',
    };

    const { container } = render(<ModelFAQSection faqData={minimalData} />);
    expect(
      screen.getByText('Frequently Asked Questions: Toyota Sienna Wait Times')
    ).toBeInTheDocument();
    expect(
      screen.getByText('What is the average wait time for a Toyota Sienna in Canada?')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Which Canadian province has the shortest wait time for the Sienna?')
    ).toBeInTheDocument();

    const script = container.querySelector('script[type="application/ld+json"]');
    const json = JSON.parse(script!.textContent || '{}');
    expect(json.mainEntity.length).toBe(4);
  });
});
