import { test, expect } from '@playwright/test';

test.describe('Restaurant Pages', () => {
  test('should display restaurant detail page', async ({ page }) => {
    // Navigate to a restaurant page (using demo data)
    await page.goto('/r/chin-chin');

    // Check that the page loads
    await expect(page).toHaveTitle(/Queue Up/);

    // Check that restaurant name is displayed
    await expect(page.getByText('Chin Chin')).toBeVisible();

    // Check that join queue form is present
    await expect(page.getByText('Join the Queue')).toBeVisible();
    await expect(page.getByLabel('Full Name *')).toBeVisible();
    await expect(page.getByLabel('Party Size')).toBeVisible();
  });

  test('should allow joining a queue', async ({ page }) => {
    await page.goto('/r/chin-chin');

    // Fill out the form
    await page.getByLabel('Full Name *').fill('Test User');
    await page.getByLabel('Phone Number (Optional)').fill('+61412345678');
    await page.getByLabel('Party Size').selectOption('2');

    // Submit the form
    await page.getByRole('button', { name: 'Join Queue' }).click();

    // Should redirect to status page
    await expect(page).toHaveURL(/\/q\/[a-f0-9]+/);
    await expect(page.getByText('Waiting')).toBeVisible();
  });
});
