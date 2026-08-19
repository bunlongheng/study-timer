import { expect, test } from '@playwright/test';

test.describe('study session', () => {
  test('runs a full session to completion and locks the mode', async ({ page }) => {
    await page.goto('/');

    // Open settings and switch to the 5-second test duration.
    await page.getByRole('button', { name: /open settings/i }).click();
    await page.locator('#session-duration-select').selectOption('5');
    await page.keyboard.press('Escape');

    // The default Reading mode should now show a 5-second timer, ready to start.
    const timer = page.getByRole('button', { name: /start session/i });
    await expect(timer).toBeVisible();

    // Tap to start, then wait for the session to complete and the mode to lock.
    await timer.click();
    await expect(
      page.getByRole('button', { name: /session complete/i }),
    ).toBeVisible({ timeout: 12_000 });
  });

  test('persists an edited name across a reload', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /open settings/i }).click();
    await page.getByRole('button', { name: /^edit$/i }).click();
    const input = page.locator('#user-name-input');
    await input.fill('Mira');
    await page.getByRole('button', { name: /^save$/i }).click();
    await page.keyboard.press('Escape');

    await page.reload();
    await expect(page.getByText('Mira')).toBeVisible();
  });
});
