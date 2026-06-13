import { test, expect } from '@playwright/test';

test.describe('Dashboard Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('mindmate_user', JSON.stringify({
        name: 'Alex',
        examType: 'NEET',
        joinedAt: new Date().toISOString()
      }));
    });
    await page.goto('/dashboard');
  });

  test('should display user metrics and stats panels', async ({ page }) => {
    // Check if greeting is correct
    await expect(page.locator('h1:has-text("Hey, Alex!")')).toBeVisible();

    // Check if NEET status is correct in the welcome text (visible on all viewports)
    await expect(page.locator('p:has-text("preparation cycle")')).toContainText('NEET');

    // Check stats boxes
    await expect(page.locator('p:has-text("Weekly Logs")')).toBeVisible();
    await expect(page.locator('p:has-text("Avg. Stress Index")')).toBeVisible();
    await expect(page.locator('p:has-text("Avg. Anxiety Index")')).toBeVisible();
  });

  test('should render widgets and trend chart container', async ({ page }) => {
    // Burnout Indicator
    await expect(page.locator('h3:has-text("Burnout Index")')).toBeVisible();

    // Weekly summary
    await expect(page.locator('h3:has-text("AI Weekly Health Insights")')).toBeVisible();

    // Trend chart container
    await expect(page.locator('h3:has-text("Mental Metrics Trend")')).toBeVisible();
  });
});
