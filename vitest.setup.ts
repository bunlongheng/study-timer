import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Testing-library's auto cleanup only self-registers when `afterEach` is a
// global; since this project doesn't enable vitest's globals, unmount
// explicitly so each test starts from a fresh DOM.
afterEach(() => {
  cleanup();
});

// jsdom does not implement matchMedia; the app calls it to respect
// prefers-reduced-motion, so provide a minimal polyfill for tests.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}
