import { defineConfig, devices } from '@playwright/test';

/**
 * E2E config. Runs against the Vite dev server. Kept out of the fast CI gate
 * on purpose (house convention: e2e runs locally / nightly, not pre-push).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3019',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3019',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
