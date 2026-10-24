import { describe, it, expect } from 'vitest';
import { runRouteVerification } from '../../scripts/verify-routes';
import { getModelConfig, normalizeModelSlug } from '@/lib/data/model-registry';
import { toCanonicalWaitTimeSlug } from '@/lib/calculator-model-helpers';
import { getModelBySlug } from '@/lib/data/vehicles';

describe('Full Route Audit & 404 Remediation Verification', () => {
  it('confirms all internal navigation, footer, and dynamic routes map to valid physical endpoints', () => {
    const { success, results } = runRouteVerification();
    expect(success).toBe(true);
    expect(results.length).toBeGreaterThanOrEqual(60);

    const missingFiles = results.filter((r) => r.status === 'MISSING_FILE');
    expect(missingFiles).toHaveLength(0);
  });

  describe('Model Slug Normalization & 301 Permanent Redirects', () => {
    it('normalizes powertrain suffixes (hybrid, phev, prime, hev) to canonical model slugs', () => {
      expect(toCanonicalWaitTimeSlug('rav4-hybrid')).toBe('rav4');
      expect(toCanonicalWaitTimeSlug('rav4-phev')).toBe('rav4');
      expect(toCanonicalWaitTimeSlug('rav4-prime')).toBe('rav4');
      expect(toCanonicalWaitTimeSlug('sienna-hybrid')).toBe('sienna');
      expect(toCanonicalWaitTimeSlug('sienna-hev')).toBe('sienna');
      expect(toCanonicalWaitTimeSlug('grand-highlander-hybrid')).toBe('grand-highlander');
      expect(toCanonicalWaitTimeSlug('camry-hybrid')).toBe('camry');
      expect(toCanonicalWaitTimeSlug('prius-hybrid')).toBe('prius');
      expect(toCanonicalWaitTimeSlug('crown-signia')).toBe('crown-signia');
    });

    it('resolves model registry configurations for all canonical and alias slugs without failing', () => {
      expect(getModelConfig('rav4')?.slug).toBe('rav4');
      expect(getModelConfig('rav4-hybrid')?.slug).toBe('rav4');
      expect(getModelConfig('rav4-phev')?.slug).toBe('rav4');
      expect(getModelConfig('sienna')?.slug).toBe('sienna');
      expect(getModelConfig('sienna-hybrid')?.slug).toBe('sienna');
      expect(getModelConfig('sienna-hev')?.slug).toBe('sienna');
      expect(getModelConfig('grand-highlander-hybrid')?.slug).toBe('grand-highlander');
      expect(getModelConfig('camry-hybrid')?.slug).toBe('camry');
      expect(getModelConfig('crown-signia')?.slug).toBe('crown-signia');
    });

    it('resolves vehicle catalog model for canonical and alias slugs', () => {
      expect(getModelBySlug('rav4')?.slug).toBe('rav4');
      expect(getModelBySlug('rav4-hybrid')?.slug).toBe('rav4');
      expect(getModelBySlug('sienna-hybrid')?.slug).toBe('sienna');
      expect(getModelBySlug('grand-highlander-hybrid')?.slug).toBe('grand-highlander');
      expect(getModelBySlug('camry-hybrid')?.slug).toBe('camry');
    });
  });
});
