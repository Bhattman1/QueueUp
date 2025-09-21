import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load and display restaurants', async ({ page }) => {
    await page.goto('/');

    // Check that the page loads
    await expect(page).toHaveTitle(/Queue Up/);

    // Check that the header is present
    await expect(page.getByRole('heading', { name: 'Queue Up' })).toBeVisible();

    // Check that the hero section is present
    await expect(page.getByText('Skip the wait, join the queue')).toBeVisible();

    // Check that restaurants are displayed (may take time to load)
    await expect(page.getByText('Popular Restaurants')).toBeVisible();
  });

  test('should navigate to restaurant console', async ({ page }) => {
    await page.goto('/');

    // Click on Restaurant Console link
    await page.getByRole('link', { name: 'Restaurant Console' }).click();

    // Should navigate to console page
    await expect(page).toHaveURL('/console');
    await expect(page.getByText('Restaurant Console')).toBeVisible();
  });
});
