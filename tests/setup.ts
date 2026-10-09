import '@testing-library/jest-dom/vitest';

import { vi } from 'vitest';

// Mock Next.js Google Fonts for test runners
vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--font-geist-sans' }),
  Geist_Mono: () => ({ variable: '--font-geist-mono' }),
}));

// Ensure global.fetch and window.fetch are synchronized in jsdom
if (typeof window !== 'undefined') {
  window.fetch = global.fetch;
}
