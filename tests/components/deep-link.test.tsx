import { describe, it, expect } from 'vitest';
import {
  generateMetadata,
  generateStaticParams,
} from '@/app/[model]/[powertrain]/[province]/page';

describe('Deep-link [model]/[powertrain]/[province] Route', () => {
  it('generates static params for top provincial sub-audiences', async () => {
    const params = await generateStaticParams();
    expect(params.length).toBeGreaterThan(0);

    const hasRav4Bc = params.some(
      (p) => p.model === 'rav4' && p.powertrain === 'phev' && p.province === 'bc'
    );
    expect(hasRav4Bc).toBe(true);

    const hasSiennaOn = params.some(
      (p) => p.model === 'sienna' && p.powertrain === 'hev' && p.province === 'on'
    );
    expect(hasSiennaOn).toBe(true);
  });

  it('generates rich dynamic OpenGraph and Twitter metadata for /rav4/phev/bc', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({
        model: 'rav4',
        powertrain: 'phev',
        province: 'bc',
      }),
    });

    expect(metadata.title).toContain('Toyota RAV4');
    expect(metadata.title).toContain('British Columbia (BC)');
    expect(metadata.description).toContain('412 days');
    expect(metadata.openGraph?.images).toBeDefined();

    const ogImages = metadata.openGraph?.images as Array<{ url: string }>;
    const twitterMeta = metadata.twitter as any;
    expect(twitterMeta?.card).toBe('summary_large_image');
  });

  it('returns graceful fallback metadata for non-existent model or province', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({
        model: 'corolla-fake',
        powertrain: 'diesel',
        province: 'zz',
      }),
    });

    expect(metadata.title).toContain('Not Found');
  });
});
