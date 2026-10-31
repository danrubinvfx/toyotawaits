import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import { ESSENTIAL_ACCESSORIES } from '@/data/accessories';
import { GEAR_MARKET_CATALOG, resolveVerifiedGearImageSrc } from '@/data/gear/catalog';
import { MODS_CONFIG } from '@/data/mods';
import affiliateProducts from '@/lib/data/affiliate-products.json';

describe('Accessory & Gear Local Image Asset Audit', () => {
  const publicDir = path.resolve(process.cwd(), 'public');

  it('ensures every local image path in ESSENTIAL_ACCESSORIES exists in public/', () => {
    for (const item of ESSENTIAL_ACCESSORIES) {
      if (item.imageUrl && item.imageUrl.startsWith('/')) {
        const diskPath = path.join(publicDir, item.imageUrl);
        expect(fs.existsSync(diskPath), `Missing image for ${item.id}: ${item.imageUrl}`).toBe(true);
      }
    }
  });

  it('ensures every local image path in GEAR_MARKET_CATALOG exists in public/', () => {
    for (const [slug, item] of Object.entries(GEAR_MARKET_CATALOG)) {
      if (item.imageUrl && item.imageUrl.startsWith('/')) {
        const diskPath = path.join(publicDir, item.imageUrl);
        expect(fs.existsSync(diskPath), `Missing image for ${slug}: ${item.imageUrl}`).toBe(true);
      }
    }
  });

  it('ensures every local image path in MODS_CONFIG and affiliate-products.json exists in public/', () => {
    for (const item of MODS_CONFIG) {
      if (item.image && item.image.startsWith('/')) {
        const diskPath = path.join(publicDir, item.image);
        expect(fs.existsSync(diskPath), `Missing image in MODS_CONFIG (${item.slug}): ${item.image}`).toBe(true);
      }
    }

    for (const item of affiliateProducts as Array<{ slug?: string; image?: string }>) {
      if (item.image && item.image.startsWith('/')) {
        const diskPath = path.join(publicDir, item.image);
        expect(fs.existsSync(diskPath), `Missing image in affiliate-products.json (${item.slug}): ${item.image}`).toBe(true);
      }
    }
  });

  it('rewrites legacy /images/accessories/floor-mats-rav4.png to verified local WebP asset', () => {
    const resolved = resolveVerifiedGearImageSrc('/images/accessories/floor-mats-rav4.png');
    expect(resolved).toBe('/assets/gear/tuxmat-floor-liners.webp');
    expect(fs.existsSync(path.join(publicDir, resolved!))).toBe(true);
  });

  it('ensures official Muslogy product photography assets exist in public/assets/gear/', () => {
    const muslogyAssets = [
      'muslogy-rav4-organizer.webp',
      'muslogy-armrest-cover.webp',
      'muslogy-sienna-organizer.webp',
    ];
    for (const fileName of muslogyAssets) {
      const filePath = path.join(publicDir, 'assets', 'gear', fileName);
      expect(fs.existsSync(filePath), `Missing official Muslogy asset: ${fileName}`).toBe(true);
      const stat = fs.statSync(filePath);
      expect(stat.size).toBeGreaterThan(1000);
    }
  });
});
