import { test, expect } from '@playwright/test';

test.describe('Responsive Navigation Drawer', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size

  test('should display hamburger menu and toggle links list', async ({ page }) => {
    // Inject user state
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('mindmate_user', JSON.stringify({
        name: 'Dev',
        examType: 'UPSC',
        joinedAt: new Date().toISOString()
      }));
    });
    await page.goto('/dashboard');

    // Desktop nav items should be hidden
    await expect(page.locator('a:has-text("Dashboard")').first()).toBeHidden();

    // Hamburger button should be visible
    const hamburger = page.locator('button[aria-expanded]');
    await expect(hamburger).toBeVisible();

    // Click to open
    await hamburger.click();

    // Responsive nav links should be visible in drawer
    await expect(page.locator('a:has-text("Journal")').filter({ visible: true })).toBeVisible();
    await expect(page.locator('a:has-text("AI Coach")').filter({ visible: true })).toBeVisible();

    // Click to close
    await hamburger.click();
    await expect(page.locator('a:has-text("Journal")').filter({ visible: true })).toBeHidden();
  });
});
