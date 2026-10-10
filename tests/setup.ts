import '@testing-library/jest-dom/vitest';

import { vi } from 'vitest';

// Mock Next.js Google Fonts for test runners
vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--font-geist-sans' }),
  Geist_Mono: () => ({ variable: '--font-geist-mono' }),
}));

// Mock Next.js Navigation for App Router client components
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn(),
}));

// Ensure global.fetch and window.fetch are synchronized in jsdom
if (typeof window !== 'undefined') {
  window.fetch = global.fetch;
}
