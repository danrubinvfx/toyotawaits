import '@testing-library/jest-dom/vitest';

// Ensure global.fetch and window.fetch are synchronized in jsdom
if (typeof window !== 'undefined') {
  window.fetch = global.fetch;
}
